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

// reader iammember
export const s1yavCloudbuildServiceAccountReader = new gcp.secretmanager.SecretIamMember(`${stackName}-cloudbuild-sa-reader`, {
    secretId: pulumiConfig.requireSecret("tokenId"),
    role: "roles/reader",
    member: s1yavCloudbuildServiceAccount.account.email.apply(email => `serviceAccount:${email}`),
});

// Writer iammember
export const s1yavCloudbuildServiceAccountWriter = new gcp.secretmanager.SecretIamMember(`${stackName}-cloudbuild-sa-writer`, {
    secretId: pulumiConfig.requireSecret("tokenId"),
    role: "roles/writer",
    member: s1yavCloudbuildServiceAccount.account.email.apply(email => `serviceAccount:${email}`),
});

// DevOps
export const cloudbuildSaDevOps = new gcp.projects.IAMMember(`${stackName}-cloudbuild-devOps`, {
    project: projectId,
    role: "roles/iam.devOps",
    member: s1yavCloudbuildServiceAccount.account.email.apply(email => `serviceAccount:${email}`),
});

// Grant Secret Accessor permission to the Cloud Build service account for the Pulumi token
export const pulumiTokenAccessor = new gcp.secretmanager.SecretIamMember(`${stackName}-pulumi-token-accessor`, {
    secretId: pulumiConfig.requireSecret("tokenId"),
    role: "roles/secretmanager.secretAccessor",
    member: s1yavCloudbuildServiceAccount.account.email.apply(email => `serviceAccount:${email}`),
});

// Grant Secret Accessor permission to the Cloud Build service account for the GitHub token
export const githubTokenAccessor = new gcp.secretmanager.SecretIamMember(`${stackName}-github-token-accessor`, {
    secretId: githubConfig.requireSecret("tokenId"),
    role: "roles/secretmanager.secretAccessor",
    member: s1yavCloudbuildServiceAccount.account.email.apply(email => `serviceAccount:${email}`),
});
