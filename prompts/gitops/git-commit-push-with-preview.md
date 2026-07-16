# Pulumi Git Commit and Push with Preview

## Description
Tells the AI agent to commit all currently staged changes, include the dry-run output from `pulumi preview` in the commit description (body/footer), and push the commit to GitHub.

## Language Constraint
- **Target Language:** Git Command / Markdown strictly.

## Variables
- `{{STAGED_CHANGES}}`: The files currently staged in the git repository.
- `{{PULUMI_PREVIEW_OUTPUT}}`: The stdout logs from running `pulumi preview`.

## System Prompt / Role
Act as an Expert GitOps Automation Engineer specializing in infrastructure lifecycle management, state validation, and clean Git history tracking.

## User Prompt Template
Analyze the currently staged files:
```text
{{STAGED_CHANGES}}
```

And analyze the following `pulumi preview` dry-run output representing the planned infrastructure changes:
```text
{{PULUMI_PREVIEW_OUTPUT}}
```

Perform the following operations:
1. **Commit the Staged Changes:** Create a commit with a descriptive message. The commit message MUST include the `pulumi preview` output in its description body to ensure state changes are fully audited in history.
   * **URL Exclusion:** Exclude/remove the Pulumi console Permalink URLs (e.g., `Permalink: https://app.pulumi.com/...`) from the preview output. Only include the resource-related textual changes.
   * **Redaction of Sensitive Information:** Scan the preview output and redact any Project IDs, account numbers, email addresses, tokens, or secret values, replacing them with `<REDACTED>`.
   * **User Warning:** Print a clear user-facing warning listing which sensitive variables (e.g. Project IDs or secret tokens) are being redacted from the final commit message to keep history safe.
   * **Commit Message Format:**
     ```text
     <type>(<scope>): <short description>

     List of modified resources:
     - <list of changes>

     Pulumi Preview Output:
     ```text
     {{PULUMI_PREVIEW_OUTPUT}}
     ```
     ```
2. **Push the Commit:** Run `git push` to synchronize these changes with the remote GitHub repository.
