import * as pulumi from "@pulumi/pulumi";
import { GitCloudbuildRepository } from "../../constructs/git/git-cloudbuild-repository";
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
