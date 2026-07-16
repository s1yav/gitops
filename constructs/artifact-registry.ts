import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as gcpTypes from "@pulumi/gcp/types";

export interface ArtifactRegistryArgs {
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
     * The format of the repository (e.g. "DOCKER", "MAVEN", "NPM").
     */
    format: pulumi.Input<string>;

    /**
     * Whether repository tags should be immutable (preventing overwrites).
     * Only applicable for DOCKER repositories.
     */
    immutableTags?: pulumi.Input<boolean>;
}

/**
 * ArtifactRegistry Component Resource
 * Provisions a Google Cloud Artifact Registry repository with custom configuration.
 */
export class ArtifactRegistry extends pulumi.ComponentResource {
    public readonly repository: gcp.artifactregistry.Repository;

    constructor(name: string, args: ArtifactRegistryArgs, opts?: pulumi.ComponentResourceOptions) {
        super("custom:components:ArtifactRegistry", name, args, opts);

        // Build dockerConfig only if the repository format is DOCKER
        const dockerConfig = pulumi.all([args.format, args.immutableTags]).apply(([format, immutableTags]) => {
            if (format.toUpperCase() === "DOCKER" && immutableTags !== undefined) {
                return { immutableTags };
            }
            return undefined;
        });

        // Create the Artifact Registry repository
        this.repository = new gcp.artifactregistry.Repository(name, {
            location: args.location,
            repositoryId: args.repositoryId,
            description: args.description,
            format: args.format,
            dockerConfig: dockerConfig as pulumi.Output<gcpTypes.input.artifactregistry.RepositoryDockerConfig>,
        }, { parent: this });

        this.registerOutputs({
            repository: this.repository,
        });
    }
}