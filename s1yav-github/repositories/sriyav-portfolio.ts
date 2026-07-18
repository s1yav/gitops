import * as pulumi from "@pulumi/pulumi";
import { RepositoryGithub } from "../../constructs/cloudbuildv2/repository-github";
import { Trigger } from "../../constructs/cloudbuild/trigger";
import { s1yavConnectionGithub } from "../settings/installations/connection-github";
import { s1yavRepositoryDocker } from "../repository-docker";
import { s1yavCloudbuildServiceAccount } from "../cloudbuild-serviceaccount";

import { gcpConfig, githubConfig } from "../configuration";

export const sriyavPortfolioRepositoryGit = new RepositoryGithub("sriyav-portfolio-repository", {
    githubUsername: githubConfig.require("username"),
    githubRepoName: "sriyav-portfolio",
    parentConnection: s1yavConnectionGithub.connection.id,
    location: gcpConfig.require("region"),
    repoName: "sriyav-portfolio",
});

export const sriyavPortfolioMainTrigger = new Trigger("sriyav-portfolio-main-trigger", {
    projectId: gcpConfig.require("project"),
    location: gcpConfig.require("region"),
    repository: sriyavPortfolioRepositoryGit.repository.id,
    branchFilter: "^main$",
    filename: "cloudbuild.yaml",
    serviceAccount: s1yavCloudbuildServiceAccount.account.email,
    push: {
        branch: "^main$",
    },
    substitutions: {
        _ARTIFACTREGISTRY_NAME: s1yavRepositoryDocker.repository.repositoryId,
        _GITHUB_ACCESS_TOKEN_ID: githubConfig.require("tokenId"),
    },
});
