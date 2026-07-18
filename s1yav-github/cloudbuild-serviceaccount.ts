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

// Get the existing Pulumi access token Secret resource
const pulumiAccessTokenSecret = gcp.secretmanager.Secret.get(
    `${stackName}-pulumi-access-token`,
    pulumiConfig.requireSecret("tokenId")
);

// Grant Secret Accessor permission to the Cloud Build service account for the Pulumi token
export const pulumiTokenAccessor = new gcp.secretmanager.SecretIamMember(`${stackName}-pulumi-token-accessor`, {
    secretId: pulumiAccessTokenSecret.id,
    role: "roles/secretmanager.secretAccessor",
    member: s1yavCloudbuildServiceAccount.account.email.apply(email => `serviceAccount:${email}`),
});

// Get the existing GitHub access token Secret resource
const githubAccessTokenSecret = gcp.secretmanager.Secret.get(
    `${stackName}-github-access-token`,
    githubConfig.requireSecret("tokenId")
);

// Grant Secret Accessor permission to the Cloud Build service account for the GitHub token
export const githubTokenAccessor = new gcp.secretmanager.SecretIamMember(`${stackName}-github-token-accessor`, {
    secretId: githubAccessTokenSecret.id,
    role: "roles/secretmanager.secretAccessor",
    member: s1yavCloudbuildServiceAccount.account.email.apply(email => `serviceAccount:${email}`),
});

// DevOps
export const cloudbuildSaDevOps = new gcp.projects.IAMMember(`${stackName}-cloudbuild-devOps`, {
    project: projectId,
    role: "roles/iam.devOps",
    member: s1yavCloudbuildServiceAccount.account.email.apply(email => `serviceAccount:${email}`),
});
