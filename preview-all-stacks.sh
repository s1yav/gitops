#!/usr/bin/env bash

set -euo pipefail

echo "🔍 Fetching all Pulumi stacks..."
# Get list of stacks, stripping headers and asterisks
STACKS=$(pulumi stack ls | tail -n +2 | awk '{print $1}' | tr -d '*')

if [ -z "$STACKS" ]; then
  echo "⚠️ No Pulumi stacks found."
  exit 1
fi

echo "🚀 Running pulumi preview for all stacks..."
for stack in $STACKS; do
  PROJECT_ID=$(pulumi config get gcp:project --stack "$stack" 2>/dev/null || echo "N/A")
  echo "=================================================="
  echo "📦 Previewing Stack: $stack (GCP Project: $PROJECT_ID)"
  echo "=================================================="
  
  # Run pulumi preview for the specific stack
  pulumi preview --stack "$stack"
  
  echo "=================================================="
done
