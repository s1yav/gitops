# GitOps Infrastructure Orchestrator

This repository hosts the Infrastructure-as-Code (IaC) configuration for managing Google Cloud Platform (GCP) resources and continuous deployment (CI/CD) pipelines across all platform repositories.

## Overview
* **Tooling:** Managed via **Pulumi with TypeScript** for robust, programmatic cloud deployments.
* **Scope:** Provisions global core services including **Artifact Registry** repositories, **Cloud Run** hosts, and **Cloud Build** Gen 2 commit-push triggers.
* **Goal:** Provides a centralized, automated GitOps control plane that builds, tests, and deploys containers to GCP upon code pushes to targeted GitHub repositories.

---

## Safe Pulumi Deployment Workflow

When managing infrastructure across multiple environments (e.g., `dev`, `gamma`, `prod`), follow these steps to safely validate and deploy your stacks.

### 1. Select the Target Stack
First, list all stacks to verify state tracking and choose the environment you want to deploy:
```bash
# List all stacks (active stack is marked with an asterisk *)
pulumi stack ls

# Select your target environment (e.g., dev, gamma, prod)
pulumi stack select <stack_name>
```

### 2. Verify Stack Configuration
Verify the GCP project ID and configuration variables specific to the selected stack. Always confirm that you are not accidentally targeting a production project when expecting to deploy to development:
```bash
# Get the active GCP project ID
pulumi config get gcp:project

# Get the target region
pulumi config get gcp:region

# Verify custom GitHub settings
pulumi config get s1yav-github:devconnectid
```

### 3. Dry-Run / Preview All Stacks
Before mutating any live cloud resources, run the `preview-all-stacks.sh` script to perform a dry-run validation across **all** stacks in the repository:
```bash
./preview-all-stacks.sh
```
> [!IMPORTANT]
> Carefully audit the output of the script. Look for any unintended resource destructions (`- delete`) or unexpected updates (`~ update`) on any of the stacks.

### 4. Deploy the Target Stack
Once the preview is verified for your target environment, execute the deployment:
```bash
# Deploys changes to the active stack and updates the state
pulumi up
```
> [!TIP]
> When executing `pulumi up`, Pulumi displays the preview one final time and prompts you for manual confirmation before writing any changes. Always double-check the target stack name in that prompt!

---

## Onboarding

This section outlines the workflow for connecting a GitHub account and onboarding new repositories to the GitOps automated deployment system.

### 1. Onboarding a GitHub Account

To connect a new GitHub account or organization to Cloud Build Gen 2:

1. **Create Developer Connect Connection**: Provision a Cloud Build Gen 2 Developer Connect connection (`gcp.cloudbuildv2.Connection`) referencing the target GitHub account.
2. **Authorize GitHub App**: Complete the OAuth authorization flow and install the Google Cloud Build GitHub App on the target account/organization to grant access to repository webhooks.
3. **Configure Installation Settings**: Define the connection settings under the account directory (e.g., `s1yav-github/settings/installations/connection-github.ts`) and set the necessary stack configuration variables (`devconnectid`).

### 2. Onboarding a New Repository

To onboard a repository within an onboarded GitHub account:

1. **Target Project Service Account**: Create a dedicated target Service Account in the GCP account/project where the repository's resources will be deployed.
2. **IAM Service Account Impersonation**: Configure an IAM impersonation binding (e.g., granting `roles/iam.serviceAccountTokenCreator` on the target service account) allowing the central GitOps Cloud Build service account (`s1yavCloudbuildServiceAccount`) to impersonate the target service account for a short duration while provisioning resources.
3. **Define Repository & Trigger Constructs**: Create a new TypeScript file under `<account-name>/repositories/<repo-name>.ts` specifying:
   - `RepositoryGithub`: Connects the repository to the Developer Connect connection.
   - `Trigger`: Defines the Cloud Build push trigger pointing to `cloudbuild.yaml` in the target repo.
4. **Register in Account Stack**: Import the new file in `<account-name>/index.ts`.
5. **Add Cloud Build Pipeline**: Ensure a `cloudbuild.yaml` file exists in the target repository root to handle automated verification and deployment steps upon code push.

