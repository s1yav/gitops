import * as pulumi from "@pulumi/pulumi";
import { GitCloudbuildConnection } from "../constructs/git/git-cloudbuild-connection";

const gcpConfig = new pulumi.Config("gcp");
const gitConfig = new pulumi.Config("s1yav-git");

// Instantiate the custom GitCloudbuildConnection component resource
export const gitCloudbuildConnection = new GitCloudbuildConnection("s1yav-GitCloudbuildConnection", {
    githubAccessTokenId: "github-access-token",
    location: gcpConfig.require("region"),
    connectionName: "s1yav-git-cloudbuild-connection",
    appInstallationId: gitConfig.requireSecret("cloudbuild-id").apply(id => {
        const parsed = parseInt(id, 10);
        if (isNaN(parsed)) {
            throw new Error(`cloudbuild-id is not a valid number: ${id}`);
        }
        return parsed;
    }),
    projectId: gcpConfig.require("project"),
});
