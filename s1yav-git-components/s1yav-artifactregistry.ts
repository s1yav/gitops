import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import { DockerArtifactRegistry } from "../constructs/artifactregistry/docker-artifactregistry";

const gcpConfig = new pulumi.Config("gcp");

// Instantiate the custom DockerArtifactRegistry component resource
export const s1yavDockerArtifactRegistry = new DockerArtifactRegistry("s1yav-DockerArtifactRegistry", {
    location: gcpConfig.require("region"),
    repositoryId: "s1yav-docker-artifact-registry",
    description: "Docker artifact registry for storing application images",
    immutableTags: true,
});

// Grant read access to the cross-project App Hosting compute runner service account
export const appHostingRegistryReader = new gcp.artifactregistry.RepositoryIamMember("app-hosting-registry-reader", {
    project: s1yavDockerArtifactRegistry.repository.project,
    location: s1yavDockerArtifactRegistry.repository.location,
    repository: s1yavDockerArtifactRegistry.repository.name,
    role: "roles/artifactregistry.reader",
    member: "serviceAccount:firebase-app-hosting-compute@sriyav0599-portfolio.iam.gserviceaccount.com",
});
