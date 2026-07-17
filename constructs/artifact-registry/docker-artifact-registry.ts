import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

export interface DockerArtifactRegistryArgs {
    /**
     * The location/region for the repository.
     */
    location: pulumi.Input<string>;

    /**
     * The user-specified ID of the repository.
     */
    repositoryId: pulumi.Input<string>;

    /**
     * The description for the repository.
     */
    description: pulumi.Input<string>;

    /**
     * Whether repository tags should be immutable (preventing overwrites).
     */
    immutableTags?: pulumi.Input<boolean>;
}

/**
 * DockerArtifactRegistry Component Resource
 * Provisions a Google Cloud Artifact Registry Docker repository with custom configuration.
 */
export class DockerArtifactRegistry extends pulumi.ComponentResource {
    public readonly repository: gcp.artifactregistry.Repository;

    constructor(name: string, args: DockerArtifactRegistryArgs, opts?: pulumi.ComponentResourceOptions) {
        super("custom:components:DockerArtifactRegistry", name, args, opts);

        // Create the Artifact Registry repository specifically for Docker format
        this.repository = new gcp.artifactregistry.Repository(name, {
            location: args.location,
            repositoryId: args.repositoryId,
            description: args.description,
            format: "DOCKER",
            dockerConfig: {
                immutableTags: args.immutableTags ?? true,
            },
        }, { parent: this });

        this.registerOutputs({
            repository: this.repository,
        });
    }
}