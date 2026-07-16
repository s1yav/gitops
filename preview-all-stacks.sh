#!/usr/bin/env bash

set -euo pipefail

echo "🔍 Fetching all Pulumi stacks..."
# Get list of stacks, stripping headers and asterisks
STACKS=$(pulumi stack ls | tail -n +2 | awk '{print $1}' | tr -d '*')

if [ -z "$STACKS" ]; then
  echo "⚠️ No Pulumi stacks found."
  exit 1
fi

REQUIRED_APIS=(
  "compute.googleapis.com"
  "secretmanager.googleapis.com"
  "developerconnect.googleapis.com"
  "cloudbuild.googleapis.com"
  "artifactregistry.googleapis.com"
  "iam.googleapis.com"
)

echo "🚀 Running pulumi preview for all stacks..."
for stack in $STACKS; do
  PROJECT_ID=$(pulumi config get gcp:project --stack "$stack" 2>/dev/null || echo "")
  
  if [ -n "$PROJECT_ID" ]; then
    echo "=================================================="
    echo "📦 Previewing Stack: $stack (GCP Project: $PROJECT_ID)"
    echo "=================================================="
    
    echo "⚙️ Verifying required GCP APIs..."
    for api in "${REQUIRED_APIS[@]}"; do
      status=$(gcloud services list --enabled --filter="config.name=$api" --format="value(config.name)" --project="$PROJECT_ID" 2>/dev/null || echo "")
      if [ -z "$status" ]; then
        echo "⚡ Enabling API '$api' in project '$PROJECT_ID'..."
        gcloud services enable "$api" --project="$PROJECT_ID"
      else
        echo "✅ API '$api' is already enabled."
      fi
    done
  else
    echo "=================================================="
    echo "📦 Previewing Stack: $stack"
    echo "=================================================="
  fi
  
  # Run pulumi preview for the specific stack
  pulumi preview --stack "$stack"
  
  echo "=================================================="
done
