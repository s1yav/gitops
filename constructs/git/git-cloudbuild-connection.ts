import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as std from "@pulumi/std";
import * as cloudbuildv2 from "@pulumi/gcp/cloudbuildv2";
import * as secretmanager from "@pulumi/gcp/secretmanager";

export interface GitCloudbuildConnectionArgs {
    /**
     * The GCP Secret resource ID or name holding the GitHub access token.
     */
    githubAccessTokenId: pulumi.Input<string>;

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

    /**
     * Project ID
     */
    projectId: pulumi.Input<string>;
}

/**
 * GitCloudbuildConnection Component Resource
 * Provisions a Secret Manager secret with the GitHub token, sets up the IAM permissions for
 * cloudbuild to access it, and creates the cloudbuild Gen 2 connection to GitHub.
 */
export class GitCloudbuildConnection extends pulumi.ComponentResource {
    public readonly connection: cloudbuildv2.Connection;

    constructor(name: string, args: GitCloudbuildConnectionArgs, opts?: pulumi.ComponentResourceOptions) {
        super("custom:components:GitCloudbuildConnection", name, args, opts);

        // Get the existing Secret resource using its ID/Path
        const githubAccessTokenSecret = secretmanager.Secret.get(`${name}-access-token`, args.githubAccessTokenId, {}, { parent: this });

        // 1. Get/Create the Cloud Build Service Identity
        const legacyCloudbuildServiceIdentity = new gcp.projects.ServiceIdentity(`${name}-identity`, {
            service: "cloudbuild.googleapis.com",
        }, { parent: this });

        // Get the project details to retrieve the project number
        const project = gcp.organizations.getProjectOutput({
            projectId: args.projectId,
        });

        // Construct the second (modern) service identity member: service-PROJECT_NUMBER@gcp-sa-cloudbuild.iam.gserviceaccount.com
        const cloudbuildServiceMemberName = project.number.apply(num => `serviceAccount:service-${num}@gcp-sa-cloudbuild.iam.gserviceaccount.com`);

        // 2. Create the authoritative IAM policy binding to grant the secretAccessor role to both service identities
        const secretAccessorBinding = new secretmanager.SecretIamBinding(`${name}-policy-binding`, {
            secretId: githubAccessTokenSecret.secretId,
            role: "roles/secretmanager.secretAccessor",
            members: [
                legacyCloudbuildServiceIdentity.member,
                cloudbuildServiceMemberName,
            ],
        }, { parent: this });

        const oauthTokenSecretVersion = pulumi.all([args.projectId, githubAccessTokenSecret.id]).apply(([proj, id]) => {
            if (id.startsWith("projects/")) {
                return `${id}/versions/1`;
            }
            return `projects/${proj}/secrets/${id}/versions/1`;
        });

        // 4. Create the cloudbuild Gen 2 Connection
        this.connection = new cloudbuildv2.Connection(name, {
            location: args.location,
            name: args.connectionName,
            githubConfig: {
                appInstallationId: args.appInstallationId,
                authorizerCredential: {
                    oauthTokenSecretVersion,
                },
            },
        }, { parent: this, dependsOn: [secretAccessorBinding] });

        // Only exports metadata IDs; the actual secret data remains secure in Secret Manager
        this.registerOutputs({
            connection: this.connection,
        });
    }
}