import * as pulumi from "@pulumi/pulumi";
import { GitCloudbuildRepository } from "../../constructs/git/git-cloudbuild-repository";
import { CloudbuildRepositoryTrigger } from "../../constructs/cloudbuild-repository-trigger";
import { s1yavGitCloudbuildConnection } from "../s1yav-git-gcp-connections";

const gcpConfig = new pulumi.Config("gcp");
const githubConfig = new pulumi.Config("s1yav-github");

export const sriyavPortfolioRepository = new GitCloudbuildRepository("sriyav-portfolio-repository", {
    githubUsername: githubConfig.require("username"),
    githubRepoName: "sriyav-portfolio",
    parentConnection: s1yavGitCloudbuildConnection.connection.id,
    location: gcpConfig.require("region"),
    repoName: "sriyav-portfolio",
});

export const sriyavPortfolioMainTrigger = new CloudbuildRepositoryTrigger("sriyav-portfolio-main-trigger", {
    projectId: gcpConfig.require("project"),
    location: gcpConfig.require("region"),
    repository: sriyavPortfolioRepository.repository.id,
    branchFilter: "^main$",
    filename: "cloudbuild.yaml",
    push: {
        branch: "^main$",
    },
});
