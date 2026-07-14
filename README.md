# GitOps Infrastructure Orchestrator

This repository hosts the Infrastructure-as-Code (IaC) configuration for managing Google Cloud Platform (GCP) resources and continuous deployment (CI/CD) pipelines across all platform repositories.

## Overview
* **Tooling:** Managed via **Pulumi with TypeScript** for robust, programmatic cloud deployments.
* **Scope:** Provisions global core services including **Artifact Registry** repositories, **Cloud Run** hosts, and **Cloud Build** Gen 2 commit-push triggers.
* **Goal:** Provides a centralized, automated GitOps control plane that builds, tests, and deploys containers to GCP upon code pushes to targeted GitHub repositories.
