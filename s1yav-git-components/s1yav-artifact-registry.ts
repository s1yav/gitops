import * as pulumi from "@pulumi/pulumi";
import { DockerArtifactRegistry } from "../constructs/artifact-registry/docker-artifact-registry";

const gcpConfig = new pulumi.Config("gcp");

// Instantiate the custom DockerArtifactRegistry component resource
export const s1yavDockerArtifactRegistry = new DockerArtifactRegistry("s1yav-DockerArtifactRegistry", {
    location: gcpConfig.require("region"),
    repositoryId: "s1yav-docker-artifact-registry",
    description: "Docker artifact registry for storing application images",
    immutableTags: true,
});
