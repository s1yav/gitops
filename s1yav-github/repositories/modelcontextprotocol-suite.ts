import * as pulumi from "@pulumi/pulumi";
import { RepositoryGithub } from "../../constructs/cloudbuildv2/repository-github";
import { Trigger } from "../../constructs/cloudbuild/trigger";
import { s1yavConnectionGithub } from "../settings/installations/connection-github";

import { gcpConfig, githubConfig } from "../configuration";

export const modelcontextprotocolSuiteRepositoryGit = new RepositoryGithub("modelcontextprotocol-suite-repository", {
    githubUsername: githubConfig.require("username"),
    githubRepoName: "modelcontextprotocol-suite",
    parentConnection: s1yavConnectionGithub.connection.id,
    location: gcpConfig.require("region"),
    repoName: "modelcontextprotocol-suite",
});

// export const modelcontextprotocolSuiteMainTrigger = new Trigger("modelcontextprotocol-suite-main-trigger", {
//     projectId: gcpConfig.require("project"),
//     location: gcpConfig.require("region"),
//     repository: modelcontextprotocolSuiteRepositoryGit.repository.id,
//     branchFilter: "^main$",
//     filename: "cloudbuild.yaml",
//     serviceAccount: s1yavCloudbuildAccount.account.email,
//     push: {
//         branch: "^main$",
//     },
// });
