import * as pulumi from "@pulumi/pulumi";
import { RepositoryGithub } from "../../constructs/cloudbuildv2/repository-github";
import { Trigger } from "../../constructs/cloudbuild/trigger";
import { s1yavConnectionGithub } from "../settings/installations/connection-github";
import { s1yavCloudbuildServiceAccount } from "../cloudbuild-serviceaccount";

import { gcpConfig, githubConfig, pulumiConfig } from "../configuration";

export const sriyavFirebasehostRepositoryGit = new RepositoryGithub("sriyav-firebasehost-repository", {
    githubUsername: githubConfig.require("username"),
    githubRepoName: "sriyav-firebasehost",
    parentConnection: s1yavConnectionGithub.connection.id,
    location: gcpConfig.require("region"),
    repoName: "sriyav-firebasehost",
});

export const sriyavFirebasehostMainTrigger = new Trigger("sriyav-firebasehost-main-trigger", {
    projectId: gcpConfig.require("project"),
    location: gcpConfig.require("region"),
    repository: sriyavFirebasehostRepositoryGit.repository.id,
    branchFilter: "^main$",
    filename: "cloudbuild.yaml",
    serviceAccount: s1yavCloudbuildServiceAccount.account.email,
    push: {
        branch: "^main$",
    },
    substitutions: {
        _PULUMI_ACCESS_TOKEN_ID: pulumiConfig.requireSecret("tokenId"),
    },
});
