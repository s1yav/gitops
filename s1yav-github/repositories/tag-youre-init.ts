import * as pulumi from "@pulumi/pulumi";
import { RepositoryGithub } from "../../constructs/cloudbuildv2/repository-github";
import { Trigger } from "../../constructs/cloudbuild/trigger";
import { s1yavConnectionGithub } from "../settings/installations/connection-github";
import { s1yavCloudbuildServiceAccount } from "../cloudbuild-serviceaccount";

import { gcpConfig, githubConfig, pulumiConfig, stackName } from "../configuration";

const repoName = "tag-youre-init";

export const tagYoureInitRepositoryGit = new RepositoryGithub(`${repoName}-repository`, {
    githubUsername: githubConfig.require("username"),
    githubRepoName: repoName,
    parentConnection: s1yavConnectionGithub.connection.id,
    location: gcpConfig.require("region"),
    repoName: repoName,
});

export const tagYoureInitMainTrigger = new Trigger(`${repoName}-main-trigger`, {
    projectId: gcpConfig.require("project"),
    location: gcpConfig.require("region"),
    repository: tagYoureInitRepositoryGit.repository.id,
    branchFilter: "^main$",
    filename: "cloudbuild.yaml",
    serviceAccount: s1yavCloudbuildServiceAccount.account.email,
    push: {
        branch: "^main$",
    },
    substitutions: {
        _PULUMI_ACCESS_TOKEN_ID: pulumiConfig.requireSecret("tokenId"),
        _STACK_NAME: stackName,
    },
});
