import * as pulumi from "@pulumi/pulumi";
import { GitCloudbuildRepository } from "../../constructs/git/git-cloudbuild-repository";
import { CloudbuildRepositoryTrigger } from "../../constructs/cloudbuild-repository-trigger";
import { s1yavGitCloudbuildConnection } from "../s1yav-git-gcp-connections";

const gcpConfig = new pulumi.Config("gcp");
const githubConfig = new pulumi.Config("s1yav-github");

export const gitopsRepository = new GitCloudbuildRepository("gitops-repository", {
    githubUsername: githubConfig.require("username"),
    githubRepoName: "gitops",
    parentConnection: s1yavGitCloudbuildConnection.connection.id,
    location: gcpConfig.require("region"),
    repoName: "gitops",
});

export const gitopsMainTrigger = new CloudbuildRepositoryTrigger("gitops-main-trigger", {
    location: gcpConfig.require("region"),
    repository: gitopsRepository.repository.id,
    branchFilter: "^main$",
    filename: "cloudbuild.yaml",
    push: {
        branch: "^main$",
    },
});
