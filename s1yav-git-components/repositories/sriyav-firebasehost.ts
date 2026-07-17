import * as pulumi from "@pulumi/pulumi";
import { GitCloudbuildRepository } from "../../constructs/git/git-cloudbuild-repository";
import { CloudbuildRepositoryTrigger } from "../../constructs/cloudbuild-repository-trigger";
import { s1yavGitCloudbuildConnection } from "../s1yav-git-gcp-connections";

const gcpConfig = new pulumi.Config("gcp");
const githubConfig = new pulumi.Config("s1yav-github");

export const sriyavFirebasehostRepository = new GitCloudbuildRepository("sriyav-firebasehost-repository", {
    githubUsername: githubConfig.require("username"),
    githubRepoName: "sriyav-firebasehost",
    parentConnection: s1yavGitCloudbuildConnection.connection.id,
    location: gcpConfig.require("region"),
    repoName: "sriyav-firebasehost",
});

export const sriyavFirebasehostMainTrigger = new CloudbuildRepositoryTrigger("sriyav-firebasehost-main-trigger", {
    projectId: gcpConfig.require("project"),
    location: gcpConfig.require("region"),
    repository: sriyavFirebasehostRepository.repository.id,
    branchFilter: "^main$",
    filename: "cloudbuild.yaml",
    push: {
        branch: "^main$",
    },
});
