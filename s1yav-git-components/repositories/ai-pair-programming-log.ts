import * as pulumi from "@pulumi/pulumi";
import { GitCloudbuildRepository } from "../../constructs/git/git-cloudbuild-repository";
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
