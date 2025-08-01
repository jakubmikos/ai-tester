# PowerShell script to generate Allure report with --single-file option
# Usage: .\generate-allure-report.ps1

param(
    [string]$ResultsDir = "",
    [string]$OutputDir = "allure-report",
    [switch]$Open
)

# Default results directory from allureConfig.json or fallback
if ([string]::IsNullOrEmpty($ResultsDir)) {
    $ResultsDir = "bin\Debug\net8.0\allure-results"
    
    # Try to read from allureConfig.json if it exists
    if (Test-Path "allureConfig.json") {
        try {
            $config = Get-Content "allureConfig.json" | ConvertFrom-Json
            if ($config.allure.directory) {
                $ResultsDir = "bin\Debug\net8.0\$($config.allure.directory)"
                Write-Host "Using results directory from allureConfig.json: $($config.allure.directory)" -ForegroundColor Gray
            }
        } catch {
            Write-Host "Could not parse allureConfig.json, using default directory" -ForegroundColor Yellow
        }
    }
}

Write-Host "Checking for Allure results..." -ForegroundColor Cyan

if (Test-Path $ResultsDir) {
    Write-Host "Found Allure results in: $ResultsDir" -ForegroundColor Green
    
    Write-Host "Generating Allure report with --single-file option..." -ForegroundColor Cyan
    
    try {
        # Generate Allure report with single-file option
        allure generate $ResultsDir -o $OutputDir --clean --single-file
        
        Write-Host "Allure report generated successfully!" -ForegroundColor Green
        Write-Host "Report location: $OutputDir\index.html" -ForegroundColor Yellow
        
        if ($Open) {
            Write-Host "Opening report in browser..." -ForegroundColor Cyan
            Start-Process "$OutputDir\index.html"
        } else {
            Write-Host "To open the report, run: Start-Process '$OutputDir\index.html'" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "Error generating Allure report: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
    
} else {
    Write-Host "No Allure results found in: $ResultsDir" -ForegroundColor Red
    Write-Host "Run tests first to generate results:" -ForegroundColor Gray
    Write-Host "   dotnet test --settings test.runsettings" -ForegroundColor Gray
    exit 1
}