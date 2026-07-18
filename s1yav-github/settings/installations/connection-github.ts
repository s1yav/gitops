import * as pulumi from "@pulumi/pulumi";
import { ConnectionGithub } from "../../../constructs/cloudbuildv2/connection-github";

import { gcpConfig, githubConfig as gitConfig, stackName } from "../../configuration";

// Instantiate the custom ConnectionGithub component resource
export const s1yavConnectionGithub = new ConnectionGithub(`${stackName}-ConnectionGithub`, {
    githubAccessTokenId: gitConfig.requireSecret("tokenId"),
    location: gcpConfig.require("region"),
    connectionName: "s1yav-ConnectionGithub",
    appInstallationId: gitConfig.requireSecret("cloudbuild-app-installation-id").apply(id => {
        const parsed = parseInt(id, 10);
        if (isNaN(parsed)) {
            throw new Error(`cloudbuild-id is not a valid number: ${id}`);
        }
        return parsed;
    }),
    projectId: gcpConfig.require("project"),
});
