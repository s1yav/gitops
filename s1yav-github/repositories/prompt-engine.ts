import * as pulumi from "@pulumi/pulumi";
import { RepositoryGithub } from "../../constructs/cloudbuildv2/repository-github";
import { Trigger } from "../../constructs/cloudbuild/trigger";
import { s1yavConnectionGithub } from "../settings/installations/connection-github";

import { gcpConfig, githubConfig } from "../configuration";

const repoName = "prompt-engine";

export const promptEngineRepositoryGit = new RepositoryGithub(`${repoName}-repository`, {
    githubUsername: githubConfig.require("username"),
    githubRepoName: repoName,
    parentConnection: s1yavConnectionGithub.connection.id,
    location: gcpConfig.require("region"),
    repoName: repoName,
});

// export const promptEngineMainTrigger = new Trigger(`${repoName}-main-trigger`, {
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
