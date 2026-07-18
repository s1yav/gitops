import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import { Account } from "../constructs/serviceaccount/account";
import { gcpConfig, githubConfig, pulumiConfig, stackName } from "./configuration";

const projectId = gcpConfig.require("project");

// Naming: stackname-<service for which the service account is being created>-constructname
// Display name: s1yav-<service for which the service account is being created>-sa
export const s1yavCloudbuildServiceAccount = new Account(`${stackName}-cloudbuild-serviceaccount`, {
    accountId: "s1yav-cloudbuild-sa",
    displayName: "s1yav-cloudbuild-sa",
    description: "User-managed service account for executing Cloud Build triggers",
});

// Grant Owner permission to the Cloud Build service account
export const s1yavCloudbuildServiceAccountOwner = new gcp.projects.IAMMember(`${stackName}-cloudbuild-sa-owner`, {
    project: projectId,
    role: "roles/owner",
    member: s1yavCloudbuildServiceAccount.account.email.apply(email => `serviceAccount:${email}`),
});