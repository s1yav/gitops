import * as pulumi from "@pulumi/pulumi";
import { RepositoryGithub } from "../../constructs/cloudbuildv2/repository-github";
import { Trigger } from "../../constructs/cloudbuild/trigger";
import { s1yavConnectionGithub } from "../settings/installations/connection-github";

import { gcpConfig, githubConfig } from "../configuration";

export const aiPairProgrammingLogRepositoryGit = new RepositoryGithub("ai-pair-programming-log-repository", {
    githubUsername: githubConfig.require("username"),
    githubRepoName: "ai-pair-programming-log",
    parentConnection: s1yavConnectionGithub.connection.id,
    location: gcpConfig.require("region"),
    repoName: "ai-pair-programming-log",
});

// export const aiPairProgrammingLogMainTrigger = new Trigger("ai-pair-programming-log-main-trigger", {
//     projectId: gcpConfig.require("project"),
//     location: gcpConfig.require("region"),
//     repository: aiPairProgrammingLogRepositoryGit.repository.id,
//     branchFilter: "^main$",
//     filename: "cloudbuild.yaml",
//     serviceAccount: s1yavCloudbuildAccount.account.email,
//     push: {
//         branch: "^main$",
//     },
// });
