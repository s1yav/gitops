import * as pulumi from "@pulumi/pulumi";
import { RepositoryGithub } from "../../constructs/cloudbuildv2/repository-github";
import { Trigger } from "../../constructs/cloudbuild/trigger";
import { s1yavConnectionGithub } from "../settings/installations/connection-github";

import { gcpConfig, githubConfig } from "../configuration";

export const promptEngineRepositoryGit = new RepositoryGithub("prompt-engine-repository", {
    githubUsername: githubConfig.require("username"),
    githubRepoName: "prompt-engine",
    parentConnection: s1yavConnectionGithub.connection.id,
    location: gcpConfig.require("region"),
    repoName: "prompt-engine",
});

// export const promptEngineMainTrigger = new Trigger("prompt-engine-main-trigger", {
//     projectId: gcpConfig.require("project"),
//     location: gcpConfig.require("region"),
//     repository: promptEngineRepositoryGit.repository.id,
//     branchFilter: "^main$",
//     filename: "cloudbuild.yaml",
//     serviceAccount: s1yavCloudbuildAccount.account.email,
//     push: {
//         branch: "^main$",
//     },
// });
