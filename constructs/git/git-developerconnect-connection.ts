import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as secretmanager from "@pulumi/gcp/secretmanager";
import * as developerconnect from "@pulumi/gcp/developerconnect";

export interface GitDeveloperconnectConnectionArgs {
    /**
     * The GCP Secret resource ID or name holding the GitHub access token.
     */
    githubAccessTokenId: pulumi.Input<string>;

    /**
     * The location/region for the connection.
     */
    location: pulumi.Input<string>;

    /**
     * The ID of the connection to create.
     */
    connectionId: pulumi.Input<string>;

    /**
     * The GitHub App Installation ID.
     */
    appInstallationId: pulumi.Input<string>;

    /**
     * The GCP Project ID.
     */
    projectId: pulumi.Input<string>;
}

/**
 * GitDeveloperconnectConnection Component Resource
 * Sets up a Developer Connect connection to GitHub, provisions the necessary IAM policy
 * for the Developer Connect service agent to access the GitHub token secret, and links it.
 */
export class GitDeveloperconnectConnection extends pulumi.ComponentResource {
    public readonly connection: developerconnect.Connection;

    constructor(name: string, args: GitDeveloperconnectConnectionArgs, opts?: pulumi.ComponentResourceOptions) {
        super("custom:components:GitDeveloperconnectConnection", name, args, opts);

        // Get the existing Secret resource using its ID/Path
        const githubAccessTokenSecret = secretmanager.Secret.get(`${name}-access-token`, args.githubAccessTokenId, {}, { parent: this });

        // 1. Get/Create the Developer Connect Service Identity
        const devconnectServiceIdentity = new gcp.projects.ServiceIdentity(`${name}-identity`, {
            service: "developerconnect.googleapis.com",
        }, { parent: this });

        // 2. Generate the IAM policy allowing Developer Connect to access the secret
        const p4saSecretAccessor = devconnectServiceIdentity.member.apply(member =>
            gcp.organizations.getIAMPolicy({
                bindings: [{
                    role: "roles/secretmanager.secretAccessor",
                    members: [member],
                }],
            })
        );

        // 3. Attach the IAM policy to the secret
        const secretPolicyBinding = new secretmanager.SecretIamPolicy(`${name}-policy`, {
            secretId: githubAccessTokenSecret.secretId,
            policyData: p4saSecretAccessor.apply(policy => policy.policyData),
        }, { parent: this });

        const oauthTokenSecretVersion = pulumi.all([args.projectId, githubAccessTokenSecret.id]).apply(([proj, id]) => {
            if (id.startsWith("projects/")) {
                return `${id}/versions/latest`;
            }
            return `projects/${proj}/secrets/${id}/versions/latest`;
        });

        // 4. Create the Developer Connect Connection
        this.connection = new developerconnect.Connection(name, {
            location: args.location,
            connectionId: args.connectionId,
            githubConfig: {
                githubApp: "DEVELOPER_CONNECT",
                appInstallationId: args.appInstallationId,
                authorizerCredential: {
                    oauthTokenSecretVersion,
                },
            },
        }, { parent: this, dependsOn: [secretPolicyBinding] });

        this.registerOutputs({
            connection: this.connection,
        });
    }
}