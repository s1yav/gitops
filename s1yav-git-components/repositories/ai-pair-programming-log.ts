import * as pulumi from "@pulumi/pulumi";
import { GitCloudbuildRepository } from "../../constructs/git/git-cloudbuild-repository";
import { CloudbuildRepositoryTrigger } from "../../constructs/cloudbuild-repository-trigger";
import { s1yavGitCloudbuildConnection } from "../s1yav-git-gcp-connections";

const gcpConfig = new pulumi.Config("gcp");
const githubConfig = new pulumi.Config("s1yav-github");

export const aiPairProgrammingLogRepository = new GitCloudbuildRepository("ai-pair-programming-log-repository", {
    githubUsername: githubConfig.require("username"),
    githubRepoName: "ai-pair-programming-log",
    parentConnection: s1yavGitCloudbuildConnection.connection.id,
    location: gcpConfig.require("region"),
    repoName: "ai-pair-programming-log",
});

export const aiPairProgrammingLogMainTrigger = new CloudbuildRepositoryTrigger("ai-pair-programming-log-main-trigger", {
    location: gcpConfig.require("region"),
    repository: aiPairProgrammingLogRepository.repository.id,
    branchFilter: "^main$",
    filename: "cloudbuild.yaml",
    push: {
        branch: "^main$",
    },
});
