import * as pulumi from "@pulumi/pulumi";
import * as cloudbuildv2 from "@pulumi/gcp/cloudbuildv2";
import * as secretmanager from "@pulumi/gcp/secretmanager";

/**
 * Helper to grant the Secret Manager Secret Accessor role to a specific member.
 */
export function grantPulumiAccessTokenSecretAccessor(
    name: string,
    secretId: pulumi.Input<string>,
    member: pulumi.Input<string>,
    parent: pulumi.Resource
): secretmanager.SecretIamMember {
    const pulumiAccessTokenSecret = secretmanager.Secret.get(`${name}-access-token`, secretId, {}, { parent: parent });
    return new secretmanager.SecretIamMember(name, {
        secretId: pulumiAccessTokenSecret.secretId,
        role: "roles/secretmanager.secretAccessor",
        member: member,
    }, { parent: parent });
}

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
export class GitCloudbuildRepository extends pulumi.ComponentResource {
    public readonly repository: cloudbuildv2.Repository;

    constructor(name: string, args: GitCloudbuildRepositoryArgs, opts?: pulumi.ComponentResourceOptions) {
        super("custom:components:GitCloudbuildRepository", name, args, opts);

        // Link the GitHub repository to the parent Cloud Build Connection
        this.repository = new cloudbuildv2.Repository(name, {
            location: args.location,
            name: args.repoName,
            parentConnection: args.parentConnection,
            remoteUri: pulumi.interpolate`https://github.com/${args.githubUsername}/${args.githubRepoName}.git`,
        }, { parent: this });

        this.registerOutputs({
            repository: this.repository,
        });
    }
}