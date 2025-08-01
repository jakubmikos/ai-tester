#!/bin/bash
# Bash script to generate Allure report with --single-file option
# Usage: ./generate-allure-report.sh

RESULTS_DIR=${1:-""}
OUTPUT_DIR=${2:-"allure-report"}
OPEN_REPORT=${3:-false}

# Default results directory from allureConfig.json or fallback
if [ -z "$RESULTS_DIR" ]; then
    RESULTS_DIR="bin/Debug/net8.0/allure-results"
    
    # Try to read from allureConfig.json if it exists
    if [ -f "allureConfig.json" ]; then
        if command -v jq > /dev/null; then
            CONFIG_DIR=$(jq -r '.allure.directory // empty' allureConfig.json 2>/dev/null)
            if [ -n "$CONFIG_DIR" ]; then
                RESULTS_DIR="bin/Debug/net8.0/$CONFIG_DIR"
                echo "📋 Using results directory from allureConfig.json: $CONFIG_DIR"
            fi
        else
            echo "⚠️ jq not available, using default directory (install jq for config file parsing)"
        fi
    fi
fi

echo "🔍 Checking for Allure results..."

if [ -d "$RESULTS_DIR" ]; then
    echo "✅ Found Allure results in: $RESULTS_DIR"
    
    echo "🏗️ Generating Allure report with --single-file option..."
    
    # Generate Allure report with single-file option
    if allure generate "$RESULTS_DIR" -o "$OUTPUT_DIR" --clean --single-file; then
        echo "✅ Allure report generated successfully!"
        echo "📊 Report location: $OUTPUT_DIR/index.html"
        
        if [ "$OPEN_REPORT" = "true" ] || [ "$OPEN_REPORT" = "--open" ]; then
            echo "🌐 Opening report in browser..."
            if command -v xdg-open > /dev/null; then
                xdg-open "$OUTPUT_DIR/index.html"
            elif command -v open > /dev/null; then
                open "$OUTPUT_DIR/index.html"
            else
                echo "💡 To open the report, navigate to: $OUTPUT_DIR/index.html"
            fi
        else
            echo "💡 To open the report, run: xdg-open '$OUTPUT_DIR/index.html' (Linux) or open '$OUTPUT_DIR/index.html' (macOS)"
        fi
    else
        echo "❌ Error generating Allure report"
        exit 1
    fi
    
else
    echo "❌ No Allure results found in: $RESULTS_DIR"
    echo "💡 Run tests first to generate results:"
    echo "   dotnet test --settings test.runsettings"
    exit 1
fi