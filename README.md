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
