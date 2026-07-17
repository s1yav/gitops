import * as pulumi from "@pulumi/pulumi";
import { GitCloudbuildRepository } from "../../constructs/git/git-cloudbuild-repository";
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
