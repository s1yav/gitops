import * as pulumi from "@pulumi/pulumi";
import { GitCloudbuildRepository } from "../../constructs/git/git-cloudbuild-repository";
import { CloudbuildRepositoryTrigger } from "../../constructs/cloudbuild-repository-trigger";
import { s1yavGitCloudbuildConnection } from "../s1yav-git-gcp-connections";
import { s1yavDockerArtifactRegistry } from "../s1yav-artifactregistry";

import { grantPulumiAccessTokenSecretAccessor } from "../../constructs/git/git-cloudbuild-repository";
import { s1yavCloudbuildServiceAccount } from "../s1yav-serviceaccounts";

const gcpConfig = new pulumi.Config("gcp");
const githubConfig = new pulumi.Config("s1yav-github");
const pulumiAccessTokenId = "pulumi-access-token";

export const sriyavPortfolioRepository = new GitCloudbuildRepository("sriyav-portfolio-repository", {
    githubUsername: githubConfig.require("username"),
    githubRepoName: "sriyav-portfolio",
    parentConnection: s1yavGitCloudbuildConnection.connection.id,
    location: gcpConfig.require("region"),
    repoName: "sriyav-portfolio",
});

// Grant the service account access to the Pulumi access token secret
export const sriyavPortfolioPulumiTokenAccessor = grantPulumiAccessTokenSecretAccessor(
    "sriyav-portfolio-pulumi-token-accessor",
    pulumiAccessTokenId,
    pulumi.interpolate`serviceAccount:${s1yavCloudbuildServiceAccount.account.email}`,
    sriyavPortfolioRepository
);

export const sriyavPortfolioMainTrigger = new CloudbuildRepositoryTrigger("sriyav-portfolio-main-trigger", {
    projectId: gcpConfig.require("project"),
    location: gcpConfig.require("region"),
    repository: sriyavPortfolioRepository.repository.id,
    branchFilter: "^main$",
    filename: "cloudbuild.yaml",
    serviceAccount: s1yavCloudbuildServiceAccount.account.email,
    push: {
        branch: "^main$",
    },
    substitutions: {
        _ARTIFACTREGISTRY_NAME: s1yavDockerArtifactRegistry.repository.repositoryId,
    },
});
