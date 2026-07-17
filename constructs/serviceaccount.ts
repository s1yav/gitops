import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

export interface ServiceAccountArgs {
    /**
     * The service account ID (the username part of the email, e.g. "my-service-account").
     */
    accountId: pulumi.Input<string>;

    /**
     * The display name for the service account.
     */
    displayName: pulumi.Input<string>;

    /**
     * Optional description of the service account's purpose.
     */
    description?: pulumi.Input<string>;
}

/**
 * ServiceAccount Component Resource
 * Provisions a reusable, parameterized Google Cloud Service Account.
 */
export class ServiceAccount extends pulumi.ComponentResource {
    public readonly account: gcp.serviceaccount.Account;

    constructor(name: string, args: ServiceAccountArgs, opts?: pulumi.ComponentResourceOptions) {
        super("custom:components:ServiceAccount", name, args, opts);

        // Provision the underlying GCP Service Account
        this.account = new gcp.serviceaccount.Account(name, {
            accountId: args.accountId,
            displayName: args.displayName,
            description: args.description,
        }, { parent: this });

        this.registerOutputs({
            account: this.account,
        });
    }
}