import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import { RepositoryDocker } from "../constructs/artifactregistry/repository-docker";

import { gcpConfig, stackName } from "./configuration";

// Instantiate the custom RepositoryDocker component resource
export const s1yavRepositoryDocker = new RepositoryDocker(`${stackName}-RepositoryDocker`, {
    location: gcpConfig.require("region"),
    repositoryId: "s1yav-RepositoryDocker",
    description: "Docker artifact registry for storing application images",
    immutableTags: true,
});

// // Grant read access to the cross-project App Hosting compute runner service account
// export const appHostingRegistryReader = new gcp.artifactregistry.RepositoryIamMember("app-hosting-registry-reader", {
//     project: s1yavRepositoryDocker.repository.project,
//     location: s1yavRepositoryDocker.repository.location,
//     repository: s1yavRepositoryDocker.repository.name,
//     role: "roles/artifactregistry.reader",
//     member: "serviceAccount:firebase-app-hosting-compute@sriyav0599-portfolio.iam.gserviceaccount.com",
// });
