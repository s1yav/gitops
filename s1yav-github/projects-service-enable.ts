import { Service } from "../constructs/projects/service";
import { gcpConfig, stackName } from "./configuration";

const projectId = gcpConfig.require("project");

// Enable Secret Manager API
export const secretManagerService = new Service(`${stackName}-secretmanager-api`, {
    projectId: projectId,
    serviceName: "secretmanager.googleapis.com",
});

// Enable Developer Connect API
export const developerConnectService = new Service(`${stackName}-developerconnect-api`, {
    projectId: projectId,
    serviceName: "developerconnect.googleapis.com",
});

// Enable Cloud Build API
export const cloudBuildService = new Service(`${stackName}-cloudbuild-api`, {
    projectId: projectId,
    serviceName: "cloudbuild.googleapis.com",
});

// Enable Artifact Registry API
export const artifactRegistryService = new Service(`${stackName}-artifactregistry-api`, {
    projectId: projectId,
    serviceName: "artifactregistry.googleapis.com",
});

// Enable IAM API
export const iamService = new Service(`${stackName}-iam-api`, {
    projectId: projectId,
    serviceName: "iam.googleapis.com",
});

// Enable Compute Engine API
export const computeService = new Service(`${stackName}-compute-api`, {
    projectId: projectId,
    serviceName: "compute.googleapis.com",
});
