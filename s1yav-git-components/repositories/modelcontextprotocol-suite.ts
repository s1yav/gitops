import * as pulumi from "@pulumi/pulumi";
import { GitCloudbuildRepository } from "../../constructs/git/git-cloudbuild-repository";
import { CloudbuildRepositoryTrigger } from "../../constructs/cloudbuild-repository-trigger";
import { s1yavGitCloudbuildConnection } from "../s1yav-git-gcp-connections";

import { grantPulumiAccessTokenSecretAccessor } from "../../constructs/git/git-cloudbuild-repository";
import { s1yavCloudbuildServiceAccount } from "../s1yav-serviceaccounts";

const gcpConfig = new pulumi.Config("gcp");
const githubConfig = new pulumi.Config("s1yav-github");
const pulumiAccessTokenId = "pulumi-access-token";

export const modelcontextprotocolSuiteRepository = new GitCloudbuildRepository("modelcontextprotocol-suite-repository", {
    githubUsername: githubConfig.require("username"),
    githubRepoName: "modelcontextprotocol-suite",
    parentConnection: s1yavGitCloudbuildConnection.connection.id,
    location: gcpConfig.require("region"),
    repoName: "modelcontextprotocol-suite",
});

// Grant the service account access to the Pulumi access token secret
export const modelcontextprotocolSuitePulumiTokenAccessor = grantPulumiAccessTokenSecretAccessor(
    "modelcontextprotocol-suite-pulumi-token-accessor",
    pulumiAccessTokenId,
    pulumi.interpolate`serviceAccount:${s1yavCloudbuildServiceAccount.account.email}`,
    modelcontextprotocolSuiteRepository
);

// export const modelcontextprotocolSuiteMainTrigger = new CloudbuildRepositoryTrigger("modelcontextprotocol-suite-main-trigger", {
//     projectId: gcpConfig.require("project"),
//     location: gcpConfig.require("region"),
//     repository: modelcontextprotocolSuiteRepository.repository.id,
//     branchFilter: "^main$",
//     filename: "cloudbuild.yaml",
//     serviceAccount: s1yavCloudbuildServiceAccount.account.email,
//     push: {
//         branch: "^main$",
//     },
// });
