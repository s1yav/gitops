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
