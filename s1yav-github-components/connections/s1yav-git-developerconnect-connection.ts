import * as pulumi from "@pulumi/pulumi";
import { GitDeveloperconnectConnection } from "../../constructs/git/git-developerconnect-connection";

const gcpConfig = new pulumi.Config("gcp");
const config = new pulumi.Config("s1yav-github");

// Instantiate the custom GitDeveloperconnectConnection component resource
export const gitDeveloperconnectConnection = new GitDeveloperconnectConnection("s1yav-GitDeveloperconnectConnection", {
    githubAccessTokenId: "github-access-token",
    location: gcpConfig.require("region"),
    connectionId: "s1yav-GitDeveloperconnectConnection",
    appInstallationId: config.require("devconnectid"),
});
