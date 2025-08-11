# Allure Reporting Setup & Historical Data Preservation

## Overview

This project uses Allure Framework for comprehensive test reporting with historical data preservation across GitHub Actions runs. The setup ensures that test trends, execution history, and progress tracking are maintained over time.

## Key Features

### ✅ **Historical Data Preservation**
- **Test Trends**: Pass/fail rates over time
- **Execution History**: Duration trends and performance metrics  
- **Build Comparison**: Compare results across different runs
- **Progress Tracking**: Visual representation of test suite improvements

### ✅ **Enhanced Categorization**
- **Priority-based**: P1 (Smoke), P2 (Regression), P3 (Extended)
- **Functional Areas**: Shopping Cart, Product Catalog, Authentication, etc.
- **Issue Types**: Infrastructure, Flaky Tests, Test Data issues
- **Business Impact**: Critical Business Flows categorization

### ✅ **Rich Environment Information**
- Build metadata (commit hash, branch, build number)
- Test environment details (browser, framework versions)
- Execution context (CI platform, OS, runtime info)

## Configuration Files

### 1. **allureConfig.json**
Enhanced configuration with:
- History retention settings (keeps last 20 builds)
- Trend chart enablement
- Report branding and metadata
- Environment variable definitions

### 2. **allure-categories.json**  
Defines test failure categories:
- Critical Business Flows
- Shopping Cart Issues
- Product Catalog Issues
- User Authentication Issues
- Infrastructure Issues
- Priority-based groupings

### 3. **environment.properties**
Static environment information:
- Framework versions and configuration
- Browser and platform details
- Test execution settings

## How Historical Data Works

### **Data Flow**
1. **Download**: Existing history from gh-pages branch
2. **Merge**: Previous history with new test results
3. **Generate**: Updated Allure report with trends
4. **Deploy**: Report to GitHub Pages with preserved history
5. **Backup**: History data stored as workflow artifacts

### **GitHub Action Steps**
1. **History Download**: Checkout gh-pages branch content
2. **History Preservation**: Copy existing history files to results directory
3. **Configuration Copy**: Add categories and environment files
4. **Report Generation**: Create Allure report with historical context
5. **Metadata Addition**: Add build information and environment details
6. **Artifact Backup**: Store history as downloadable artifacts
7. **Deployment**: Deploy to GitHub Pages with history preserved

## Report Features

### **Dashboard Overview**
- **Overview**: Summary of latest test execution
- **Categories**: Test failures grouped by type and priority
- **Suites**: Test organization by feature areas
- **Graphs**: Visual trends and historical data
- **Timeline**: Execution timeline and duration analysis

### **Historical Trends**
- **History Trend**: Pass/fail rates over last 20 builds
- **Duration Trend**: Test execution time changes
- **Retry Trend**: Test retry patterns and flaky test detection
- **Categories Trend**: Failure category analysis over time

### **Test Details**
- **Test Cases**: Individual test results with full context
- **Attachments**: Screenshots, logs, and trace files
- **Parameters**: Test data and configuration details
- **Environment**: Execution environment information

## Accessing Reports

### **Live Reports**
- **URL**: `https://[username].github.io/perfectdraft-ai-tester/`
- **Updated**: After each GitHub Actions run
- **History**: Preserves last 20 test executions

### **Backup Access**
- **Artifacts**: Available in GitHub Actions run details
- **Retention**: 30 days for history backup files
- **Download**: Accessible via GitHub Actions interface

## Troubleshooting

### **No Historical Data Showing**
- Check if gh-pages branch exists
- Verify ALLURE_GH_PAGES_TOKEN is configured
- Review GitHub Actions logs for history download steps

### **Categories Not Working**
- Ensure allure-categories.json is properly formatted
- Check regex patterns match your test naming conventions
- Verify categories file is copied to results directory

### **Environment Info Missing**
- Confirm environment.properties exists in root directory
- Check if build info step is executing successfully
- Verify environment variables are accessible in workflow

## Maintenance

### **Regular Tasks**
- **Monitor**: Report generation success in GitHub Actions
- **Review**: Category effectiveness and adjust regex patterns
- **Update**: Environment information when versions change
- **Clean**: Old artifact backups when storage limits approached

### **Customization**
- **Categories**: Modify allure-categories.json for your test patterns
- **Environment**: Update environment.properties with current versions
- **Retention**: Adjust history retention in allureConfig.json
- **Branding**: Customize report titles and links in configuration

## Benefits

### **For Development Teams**
- **Visibility**: Clear view of test suite health over time
- **Accountability**: Historical evidence of quality improvements
- **Debugging**: Rich context for investigating test failures
- **Planning**: Data-driven decisions about test priorities

### **For Stakeholders**
- **Progress Tracking**: Visual proof of testing progress
- **Quality Metrics**: Quantifiable quality improvements
- **Risk Assessment**: Identification of problematic areas
- **Confidence Building**: Transparent quality reporting

This setup ensures comprehensive test reporting with full historical context, enabling effective test suite management and continuous quality improvement.