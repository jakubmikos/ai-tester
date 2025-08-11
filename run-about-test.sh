#!/bin/bash

# Setup script for running the About PerfectDraft navigation test

echo "=== PerfectDraft Test Setup ==="

# Install Playwright browsers
echo "Installing Playwright browsers..."
pwsh bin/Debug/net8.0/playwright.ps1 install chromium

if [ $? -ne 0 ]; then
    echo "❌ Browser installation failed. Please try:"
    echo "  dotnet tool install --global Microsoft.Playwright.CLI"
    echo "  playwright install chromium"
    exit 1
fi

echo "✅ Browsers installed successfully"

# Run the specific About PerfectDraft test
echo "Running the About PerfectDraft navigation test..."
dotnet test --filter "NavigateToAboutPerfectDraftPage" --logger "console;verbosity=detailed"

echo "=== Test Setup Complete ==="