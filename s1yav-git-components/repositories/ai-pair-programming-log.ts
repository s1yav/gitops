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

export const aiPairProgrammingLogRepository = new GitCloudbuildRepository("ai-pair-programming-log-repository", {
    githubUsername: githubConfig.require("username"),
    githubRepoName: "ai-pair-programming-log",
    parentConnection: s1yavGitCloudbuildConnection.connection.id,
    location: gcpConfig.require("region"),
    repoName: "ai-pair-programming-log",
});

// Grant the service account access to the Pulumi access token secret
export const aiPairProgrammingLogPulumiTokenAccessor = grantPulumiAccessTokenSecretAccessor(
    "ai-pair-programming-log-pulumi-token-accessor",
    pulumiAccessTokenId,
    pulumi.interpolate`serviceAccount:${s1yavCloudbuildServiceAccount.account.email}`,
    aiPairProgrammingLogRepository
);

// export const aiPairProgrammingLogMainTrigger = new CloudbuildRepositoryTrigger("ai-pair-programming-log-main-trigger", {
//     projectId: gcpConfig.require("project"),
//     location: gcpConfig.require("region"),
//     repository: aiPairProgrammingLogRepository.repository.id,
//     branchFilter: "^main$",
//     filename: "cloudbuild.yaml",
//     serviceAccount: s1yavCloudbuildServiceAccount.account.email,
//     push: {
//         branch: "^main$",
//     },
// });
