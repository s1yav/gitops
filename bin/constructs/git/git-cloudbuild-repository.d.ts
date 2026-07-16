import * as pulumi from "@pulumi/pulumi";
import * as cloudbuildv2 from "@pulumi/gcp/cloudbuildv2";
export interface GitCloudbuildRepositoryArgs {
    /**
     * The GitHub username or organization name.
     */
    githubUsername: pulumi.Input<string>;
    /**
     * The name of the GitHub repository.
     */
    githubRepoName: pulumi.Input<string>;
    /**
     * The resource ID of the parent Cloud Build connection.
     * (e.g. projects/project-id/locations/location/connections/connection-name)
     */
    parentConnection: pulumi.Input<string>;
    /**
     * The location/region for the repository link.
     */
    location: pulumi.Input<string>;
    /**
     * The name of the repository resource in Google Cloud Build.
     */
    repoName: pulumi.Input<string>;
}
/**
 * GitCloudbuildRepository Component Resource
 * Links a GitHub repository to an existing Cloud Build Gen 2 connection.
 */
export declare class GitCloudbuildRepository extends pulumi.ComponentResource {
    readonly repository: cloudbuildv2.Repository;
    constructor(name: string, args: GitCloudbuildRepositoryArgs, opts?: pulumi.ComponentResourceOptions);
}
