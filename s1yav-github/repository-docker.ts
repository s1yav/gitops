import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import { RepositoryDocker } from "gcp-constructs/artifactregistry/repository-docker";

import { gcpConfig, stackName, gitopsConfig } from "./configuration";

// Instantiate the custom RepositoryDocker component resource
export const s1yavRepositoryDocker = new RepositoryDocker(`${stackName}-RepositoryDocker`, {
    location: gcpConfig.require("region"),
    repositoryId: "s1yav-RepositoryDocker",
    description: "Docker artifact registry for storing application images",
    immutableTags: true,
    cleanupPolicyDryRun: true,
    cleanupPolicies: [
        {
            id: "delete-untagged",
            action: "DELETE",
            condition: {
                tagState: "UNTAGGED",
            },
        },
        {
            id: "keep-last-30-versions",
            action: "KEEP",
            mostRecentVersions: {
                keepCount: 30,
            },
        },
    ],
});

// Grant artifactregistry.reader to mouse-agent-sa in sriyav0599-portfolio
export const mouseAgentRepositoryDockerReader = new gcp.artifactregistry.RepositoryIamMember(
    `${stackName}-mouse-agent-repository-docker-reader`,
    {
        project: gcpConfig.require("project"),
        location: gcpConfig.require("region"),
        repository: s1yavRepositoryDocker.repository.name,
        role: "roles/artifactregistry.reader",
        member: "serviceAccount:mouse-agent-sa@sriyav0599-portfolio.iam.gserviceaccount.com",
    },
    { parent: s1yavRepositoryDocker }
);

// Grant artifactregistry.reader to sriyav-firebasehost-sa in sriyav0599-portfolio
export const sriyavFirebasehostSaRepositoryDockerReader = new gcp.artifactregistry.RepositoryIamMember(
    `${stackName}-firebasehost-sa-repository-docker-reader`,
    {
        project: gcpConfig.require("project"),
        location: gcpConfig.require("region"),
        repository: s1yavRepositoryDocker.repository.name,
        role: "roles/artifactregistry.reader",
        member: pulumi.interpolate`serviceAccount:${gitopsConfig.requireSecret("sriyav-firebasehost")}`,
    },
    { parent: s1yavRepositoryDocker }
);


