import * as pulumi from "@pulumi/pulumi";
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
export declare class GitDeveloperconnectConnection extends pulumi.ComponentResource {
    readonly connection: developerconnect.Connection;
    constructor(name: string, args: GitDeveloperconnectConnectionArgs, opts?: pulumi.ComponentResourceOptions);
}
