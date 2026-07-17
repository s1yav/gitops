import * as pulumi from "@pulumi/pulumi";
import { GitCloudbuildRepository } from "../../constructs/git/git-cloudbuild-repository";
import { CloudbuildRepositoryTrigger } from "../../constructs/cloudbuild-repository-trigger";
import { s1yavGitCloudbuildConnection } from "../s1yav-git-gcp-connections";
import * as secretmanager from "@pulumi/gcp/secretmanager";

import { grantPulumiAccessTokenSecretAccessor } from "../../constructs/git/git-cloudbuild-repository";
import { s1yavCloudbuildServiceAccount } from "../s1yav-serviceaccounts";

const gcpConfig = new pulumi.Config("gcp");
const githubConfig = new pulumi.Config("s1yav-github");
const pulumiAccessTokenId = "pulumi-access-token";

export const sriyavFirebasehostRepository = new GitCloudbuildRepository("sriyav-firebasehost-repository", {
    githubUsername: githubConfig.require("username"),
    githubRepoName: "sriyav-firebasehost",
    parentConnection: s1yavGitCloudbuildConnection.connection.id,
    location: gcpConfig.require("region"),
    repoName: "sriyav-firebasehost",
});

// Grant the service account access to the Pulumi access token secret
export const sriyavFirebasehostPulumiTokenAccessor = grantPulumiAccessTokenSecretAccessor(
    "sriyav-firebasehost-pulumi-token-accessor",
    pulumiAccessTokenId,
    pulumi.interpolate`serviceAccount:${s1yavCloudbuildServiceAccount.account.email}`,
    sriyavFirebasehostRepository
);

export const sriyavFirebasehostMainTrigger = new CloudbuildRepositoryTrigger("sriyav-firebasehost-main-trigger", {
    projectId: gcpConfig.require("project"),
    location: gcpConfig.require("region"),
    repository: sriyavFirebasehostRepository.repository.id,
    branchFilter: "^main$",
    filename: "cloudbuild.yaml",
    serviceAccount: s1yavCloudbuildServiceAccount.account.email,
    push: {
        branch: "^main$",
    },
    substitutions: {
        _PULUMI_ACCESS_TOKEN_ID: "pulumi-access-token",
    },
});
