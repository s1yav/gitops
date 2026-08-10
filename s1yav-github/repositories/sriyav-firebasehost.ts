import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import { RepositoryGithub } from "../../constructs/cloudbuildv2/repository-github";
import { Trigger } from "../../constructs/cloudbuild/trigger";
import { s1yavConnectionGithub } from "../settings/installations/connection-github";
import { s1yavCloudbuildServiceAccount } from "../cloudbuild-serviceaccount";

import { gcpConfig, githubConfig, pulumiConfig, gitopsConfig } from "../configuration";

const repoName = "sriyav-firebasehost";

export const sriyavFirebasehostRepositoryGit = new RepositoryGithub(`${repoName}-repository`, {
    githubUsername: githubConfig.require("username"),
    githubRepoName: repoName,
    parentConnection: s1yavConnectionGithub.connection.id,
    location: gcpConfig.require("region"),
    repoName: repoName,
});

export const sriyavFirebasehostMainTrigger = new Trigger(`${repoName}-main-trigger`, {
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
        _FIREBASEHOST_SERVICE_ACCOUNT: gitopsConfig.requireSecret("sriyav-firebasehost"),
    },
});
