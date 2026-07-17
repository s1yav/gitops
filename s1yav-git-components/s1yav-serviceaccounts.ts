import * as pulumi from "@pulumi/pulumi";
import { ServiceAccount } from "../constructs/serviceaccount";

// Instantiate the custom ServiceAccount component resource for Cloud Build trigger execution
export const s1yavCloudbuildServiceAccount = new ServiceAccount("s1yav-cloudbuild-sa", {
    accountId: "s1yav-cloudbuild-sa",
    displayName: "s1yav Cloudbuild Service Account",
    description: "User-managed service account for executing Cloud Build triggers",
});

// Instantiate the custom ServiceAccount component resource for Secret Manager administration
export const s1yavSecretmanagerServiceAccount = new ServiceAccount("s1yav-secretmanager-sa", {
    accountId: "s1yav-secretmanager-sa",
    displayName: "s1yav Secret Manager Service Account",
    description: "User-managed service account for managing secrets",
});


