import * as pulumi from "@pulumi/pulumi";
import * as artifactregistry from "@pulumi/gcp/artifactregistry";

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
     */
    immutableTags: pulumi.Input<boolean>;
}

/**
 * ArtifactRegistry Component Resource
 * Provisions a Google Cloud Artifact Registry repository with custom configuration.
 */
export class ArtifactRegistry extends pulumi.ComponentResource {
    public readonly repository: artifactregistry.Repository;

    constructor(name: string, args: ArtifactRegistryArgs, opts?: pulumi.ComponentResourceOptions) {
        super("custom:components:ArtifactRegistry", name, args, opts);

        // Create the Artifact Registry repository
        this.repository = new artifactregistry.Repository(name, {
            location: args.location,
            repositoryId: args.repositoryId,
            description: args.description,
            format: args.format,
            dockerConfig: {
                immutableTags: args.immutableTags,
            },
        }, { parent: this });

        this.registerOutputs({
            repository: this.repository,
        });
    }
}