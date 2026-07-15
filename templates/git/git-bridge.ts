import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as std from "@pulumi/std";

export interface GitBridgeArgs {
    /**
     * The ID of the secret in Secret Manager.
     */
    secretId: pulumi.Input<string>;

    /**
     * Path to the local file containing the GitHub token.
     */
    tokenFilePath: pulumi.Input<string>;

    /**
     * The Cloud Build Service Agent email or project number.
     * If a project number is provided (e.g. "123456789"), it will be formatted to:
     * `service-[project-number]@gcp-sa-cloudbuild.iam.gserviceaccount.com`
     */
    cloudBuildServiceAgent: pulumi.Input<string>;

    /**
     * The name of the connection to create.
     */
    connectionName: pulumi.Input<string>;

    /**
     * The location/region for the connection.
     */
    location: pulumi.Input<string>;

    /**
     * The GitHub App Installation ID.
     */
    appInstallationId: pulumi.Input<number>;
}

/**
 * GitBridge Component Resource
 * Provisions a Secret Manager secret with the GitHub token, sets up the IAM permissions for
 * Cloud Build to access it, and creates the Cloud Build Gen 2 connection to GitHub.
 */
export class GitBridge extends pulumi.ComponentResource {
    public readonly connection: gcp.cloudbuildv2.Connection;
    public readonly secret: gcp.secretmanager.Secret;
    public readonly secretVersion: gcp.secretmanager.SecretVersion;

    constructor(name: string, args: GitBridgeArgs, opts?: pulumi.ComponentResourceOptions) {
        super("custom:components:GitBridge", name, args, opts);

        // 1. Create the secret in Secret Manager to hold the token
        const githubTokenSecret = new gcp.secretmanager.Secret(`${name}-secret`, {
            secretId: args.secretId,
            replication: {
                auto: {},
            },
        }, { parent: this });

        // 2. Add the secret version reading from the local token file
        const githubTokenSecretVersion = new gcp.secretmanager.SecretVersion(`${name}-secret-version`, {
            secret: githubTokenSecret.id,
            secretData: pulumi.output(args.tokenFilePath).apply(path =>
                std.file({ input: path }).then(invoke => invoke.result)
            ),
        }, { parent: this });

        // 3. Format the Service Agent email identifier
        const serviceAgentMember = pulumi.output(args.cloudBuildServiceAgent).apply(agent => {
            if (agent.startsWith("serviceAccount:")) {
                return agent;
            } else if (agent.includes("@")) {
                return `serviceAccount:${agent}`;
            } else {
                return `serviceAccount:service-${agent}@gcp-sa-cloudbuild.iam.gserviceaccount.com`;
            }
        });

        // 4. Generate the IAM policy allowing Cloud Build to access the secret
        const secretAccessorPolicy = serviceAgentMember.apply(member =>
            gcp.organizations.getIAMPolicy({
                bindings: [{
                    role: "roles/secretmanager.secretAccessor",
                    members: [member],
                }],
            })
        );

        // 5. Attach the IAM policy to the secret
        const secretPolicyBinding = new gcp.secretmanager.SecretIamPolicy(`${name}-policy`, {
            secretId: githubTokenSecret.secretId,
            policyData: secretAccessorPolicy.apply(policy => policy.policyData),
        }, { parent: this });

        // 6. Create the Cloud Build Gen 2 Connection
        this.connection = new gcp.cloudbuildv2.Connection(name, {
            location: args.location,
            name: args.connectionName,
            githubConfig: {
                appInstallationId: args.appInstallationId,
                authorizerCredential: {
                    oauthTokenSecretVersion: githubTokenSecretVersion.id,
                },
            },
        }, { parent: this, dependsOn: [secretPolicyBinding] });

        this.secret = githubTokenSecret;
        this.secretVersion = githubTokenSecretVersion;

        // Only exports metadata IDs; the actual secret data remains secure in Secret Manager
        this.registerOutputs({
            connection: this.connection,
            secret: this.secret,
            secretVersion: this.secretVersion,
        });
    }
}