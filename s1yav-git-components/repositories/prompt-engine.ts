import * as pulumi from "@pulumi/pulumi";
import { GitCloudbuildRepository } from "../../constructs/git/git-cloudbuild-repository";
import { CloudbuildRepositoryTrigger } from "../../constructs/cloudbuild-repository-trigger";
import { s1yavGitCloudbuildConnection } from "../s1yav-git-gcp-connections";

const gcpConfig = new pulumi.Config("gcp");
const githubConfig = new pulumi.Config("s1yav-github");

export const promptEngineRepository = new GitCloudbuildRepository("prompt-engine-repository", {
    githubUsername: githubConfig.require("username"),
    githubRepoName: "prompt-engine",
    parentConnection: s1yavGitCloudbuildConnection.connection.id,
    location: gcpConfig.require("region"),
    repoName: "prompt-engine",
});

export const promptEngineMainTrigger = new CloudbuildRepositoryTrigger("prompt-engine-main-trigger", {
    location: gcpConfig.require("region"),
    repository: promptEngineRepository.repository.id,
    branchFilter: "^main$",
    filename: "cloudbuild.yaml",
    push: {
        branch: "^main$",
    },
});
