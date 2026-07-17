import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as cloudbuild from "@pulumi/gcp/cloudbuild";
import * as input from "@pulumi/gcp/types/input";

export interface CloudbuildRepositoryTriggerArgs {
    /**
     * The GCP Project ID.
     */
    projectId: pulumi.Input<string>;

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

    /**
     * The service account used for trigger execution.
     * If both serviceAccount and projectId are provided, serviceAccount takes precedence.
     * If not provided, the default service account is constructed using the projectId.
     */
    serviceAccount?: pulumi.Input<string>;
}

/**
 * Resolves the service account used for trigger execution.
 * If both serviceAccount and projectId are provided, serviceAccount takes precedence.
 * If not provided, the default service account is constructed using the projectId.
 */
function resolveServiceAccount(projectId: pulumi.Input<string>, serviceAccount?: pulumi.Input<string>): pulumi.Output<string> {
    if (serviceAccount !== undefined) {
        return pulumi.output(serviceAccount);
    }
    const project = gcp.organizations.getProjectOutput({
        projectId: projectId,
    });
    return pulumi.interpolate`projects/${projectId}/serviceAccounts/${project.number}@cloudbuild.gserviceaccount.com`;
}

/**
 * CloudbuildRepositoryTrigger Component Resource
 * Provisions a Google Cloud Build trigger linked to GitHub repository push events.
 */
export class CloudbuildRepositoryTrigger extends pulumi.ComponentResource {
    public readonly trigger: cloudbuild.Trigger;

    constructor(name: string, args: CloudbuildRepositoryTriggerArgs, opts?: pulumi.ComponentResourceOptions) {
        super("custom:components:CloudbuildRepositoryTrigger", name, args, opts);

        // Resolve the service account to be used for the trigger execution
        const serviceAccount = resolveServiceAccount(args.projectId, args.serviceAccount);

        // Create the Cloud Build trigger linked to repository push events
        this.trigger = new cloudbuild.Trigger(name, {
            location: args.location,
            repositoryEventConfig: {
                repository: args.repository,
                push: args.push,
                pullRequest: args.pullRequest,
            },
            filename: args.filename,
            serviceAccount: serviceAccount,
        }, { parent: this });

        this.registerOutputs({
            trigger: this.trigger,
        });
    }
}