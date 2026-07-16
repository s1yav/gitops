import * as pulumi from "@pulumi/pulumi";
import * as cloudbuildv2 from "@pulumi/gcp/cloudbuildv2";
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
export declare class GitCloudbuildConnection extends pulumi.ComponentResource {
    readonly connection: cloudbuildv2.Connection;
    constructor(name: string, args: GitCloudbuildConnectionArgs, opts?: pulumi.ComponentResourceOptions);
}
