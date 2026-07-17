import * as pulumi from "@pulumi/pulumi";
import { GitCloudbuildRepository } from "../../constructs/git/git-cloudbuild-repository";
import { CloudbuildRepositoryTrigger } from "../../constructs/cloudbuild-repository-trigger";
import { s1yavGitCloudbuildConnection } from "../s1yav-git-gcp-connections";

import { grantPulumiAccessTokenSecretAccessor } from "../../constructs/git/git-cloudbuild-repository";
import { s1yavCloudbuildServiceAccount } from "../s1yav-serviceaccounts";

const gcpConfig = new pulumi.Config("gcp");
const githubConfig = new pulumi.Config("s1yav-github");
const pulumiAccessTokenId = "pulumi-access-token";

export const promptEngineRepository = new GitCloudbuildRepository("prompt-engine-repository", {
    githubUsername: githubConfig.require("username"),
    githubRepoName: "prompt-engine",
    parentConnection: s1yavGitCloudbuildConnection.connection.id,
    location: gcpConfig.require("region"),
    repoName: "prompt-engine",
});

// Grant the service account access to the Pulumi access token secret
export const promptEnginePulumiTokenAccessor = grantPulumiAccessTokenSecretAccessor(
    "prompt-engine-pulumi-token-accessor",
    pulumiAccessTokenId,
    pulumi.interpolate`serviceAccount:${s1yavCloudbuildServiceAccount.account.email}`,
    promptEngineRepository
);

// export const promptEngineMainTrigger = new CloudbuildRepositoryTrigger("prompt-engine-main-trigger", {
//     projectId: gcpConfig.require("project"),
//     location: gcpConfig.require("region"),
//     repository: promptEngineRepository.repository.id,
//     branchFilter: "^main$",
//     filename: "cloudbuild.yaml",
//     serviceAccount: s1yavCloudbuildServiceAccount.account.email,
//     push: {
//         branch: "^main$",
//     },
// });
