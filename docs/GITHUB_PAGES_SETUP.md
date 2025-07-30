# GitHub Pages Setup for Allure Reports

This document explains how to set up GitHub Pages to automatically publish Allure test reports.

## How it Works

1. **Test Workflow** (`pr-tests.yml`) runs tests and generates Allure reports
2. **Pages Workflow** (`deploy-pages.yml`) automatically triggers when tests complete successfully
3. **Allure Reports** are published to GitHub Pages at: `https://[username].github.io/[repository-name]`

## Setup Steps

### 1. Enable GitHub Pages (Manual Step)

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Source", select **GitHub Actions**
4. Save the settings

### 2. Workflow Permissions (Manual Step)

Ensure the repository has the correct permissions:

1. Go to **Settings** → **Actions** → **General**
2. Under "Workflow permissions", select **Read and write permissions**
3. Check **Allow GitHub Actions to create and approve pull requests**
4. Save the settings

## What You Get

- **Live URL**: `https://[username].github.io/[repository-name]`
- **Automatic Updates**: Reports update after each successful test run
- **Historical Data**: Allure keeps test history and trends
- **Rich Reports**: Interactive charts, test details, screenshots, and more

## Workflow Triggers

The Pages deployment runs automatically when:
- The "PR Tests" workflow completes successfully
- On branches: `main` or `dotnet`
- Only on successful test runs (failures don't update the live site)

## Troubleshooting

### Pages not updating
- Check that GitHub Pages is enabled with "GitHub Actions" as source
- Verify workflow permissions are set to "Read and write"
- Ensure the "PR Tests" workflow completed successfully

### Reports not found
- Check that allure-report artifact was uploaded in the test workflow
- Verify the artifact name matches exactly: "allure-report"

### Permission errors
- Ensure `GITHUB_TOKEN` has pages:write and id-token:write permissions
- Check repository settings allow Actions to deploy to Pages