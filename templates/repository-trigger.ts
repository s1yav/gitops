import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

export interface RepositoryTriggerArgs {
    /**
     * The location/region for the trigger.
     */
    location: pulumi.Input<string>;

    /**
     * The resource ID of the Cloud Build repository.
     */
    repository: pulumi.Input<string>;

    /**
     * Regex pattern of branches to trigger builds (e.g. "feature-.*").
     */
    branchFilter: pulumi.Input<string>;

    /**
     * The path to the Cloud Build configuration file in the repository (e.g. "cloudbuild.yaml").
     */
    filename: pulumi.Input<string>;
}

/**
 * RepositoryTrigger Component Resource
 * Provisions a Google Cloud Build trigger linked to GitHub repository push events.
 */
export class RepositoryTrigger extends pulumi.ComponentResource {
    public readonly trigger: gcp.cloudbuild.Trigger;

    constructor(name: string, args: RepositoryTriggerArgs, opts?: pulumi.ComponentResourceOptions) {
        super("custom:components:RepositoryTrigger", name, args, opts);

        // Create the Cloud Build trigger linked to repository push events
        this.trigger = new gcp.cloudbuild.Trigger(name, {
            location: args.location,
            repositoryEventConfig: {
                repository: args.repository,
                push: {
                    branch: args.branchFilter,
                },
            },
            filename: args.filename,
        }, { parent: this });

        this.registerOutputs({
            trigger: this.trigger,
        });
    }
}