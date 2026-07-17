import * as pulumi from "@pulumi/pulumi";
import { GitCloudbuildRepository } from "../../constructs/git/git-cloudbuild-repository";
import { s1yavGitCloudbuildConnection } from "../s1yav-git-gcp-connections";

const gcpConfig = new pulumi.Config("gcp");
const githubConfig = new pulumi.Config("s1yav-github");

export const modelcontextprotocolSuiteRepository = new GitCloudbuildRepository("modelcontextprotocol-suite-repository", {
    githubUsername: githubConfig.require("username"),
    githubRepoName: "modelcontextprotocol-suite",
    parentConnection: s1yavGitCloudbuildConnection.connection.id,
    location: gcpConfig.require("region"),
    repoName: "modelcontextprotocol-suite",
});
