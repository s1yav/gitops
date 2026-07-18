import * as pulumi from "@pulumi/pulumi";

export const gcpConfig = new pulumi.Config("gcp");
export const githubConfig = new pulumi.Config("s1yav-github");
export const pulumiConfig = new pulumi.Config("s1yav-pulumi");
export const stackName = pulumi.getStack();
