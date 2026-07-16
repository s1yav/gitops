import * as pulumi from "@pulumi/pulumi";
import * as cloudbuild from "@pulumi/gcp/cloudbuild";
import * as input from "@pulumi/gcp/types/input";
export interface CloudbuildRepositoryTriggerArgs {
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
    /**
     * The pull request trigger configuration for repository.
     */
    pullRequest?: pulumi.Input<input.cloudbuild.TriggerRepositoryEventConfigPullRequest> | undefined;
    /**
     * The commit push trigger configuration for repository.
     */
    push?: pulumi.Input<input.cloudbuild.TriggerRepositoryEventConfigPush> | undefined;
}
/**
 * CloudbuildRepositoryTrigger Component Resource
 * Provisions a Google Cloud Build trigger linked to GitHub repository push events.
 */
export declare class CloudbuildRepositoryTrigger extends pulumi.ComponentResource {
    readonly trigger: cloudbuild.Trigger;
    constructor(name: string, args: CloudbuildRepositoryTriggerArgs, opts?: pulumi.ComponentResourceOptions);
}
