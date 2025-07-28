# PerfectDraft Test Automation

This project contains automated tests for the PerfectDraft e-commerce website using Reqnroll framework with Playwright for browser automation.

## Project Structure

```
PerfectDraftTests/
├── Configuration/
│   └── appsettings.json          # Test configuration settings
├── Features/
│   └── PerectDraftFeatures.feature # Gherkin test scenarios
├── PageObjects/
│   └── BasePage.cs               # Base page object with common functionality
├── StepDefinitions/
│   └── StepDefinitionBase.cs     # Base class for step definitions
├── Support/
│   ├── TestBase.cs               # Base test class
│   ├── TestConfiguration.cs     # Configuration manager
│   ├── TestDataManager.cs       # Test data management
│   └── WebDriverFactory.cs      # Browser factory
├── Plan.md                       # Implementation plan
├── TestsLevels.md               # Scenario complexity analysis
├── PerfectDraftTests.csproj     # Project file
└── PerfectDraftTests.sln        # Solution file
```

## Technology Stack

- **Framework**: Reqnroll with MSTest
- **Browser Automation**: Playwright
- **Language**: C# (.NET 8.0)
- **Assertions**: FluentAssertions

## Setup Instructions

### Prerequisites

1. .NET 8.0 SDK
2. Visual Studio 2022 or VS Code
3. Playwright browsers (will be installed automatically)

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Restore NuGet packages:
   ```bash
   dotnet restore
   ```
4. Install Playwright browsers:
   ```bash
   dotnet run playwright install
   ```

### Opening the Project

**Visual Studio:**
- Open `PerfectDraftTests.sln` in Visual Studio 2022

**Visual Studio Code:**
- Open the folder in VS Code
- The solution will be automatically detected

**Command Line:**
- Use `dotnet build` to build the solution
- Use `dotnet test` to run tests

### Configuration

The test configuration is managed through `Configuration/appsettings.json`:

- **BaseUrl**: PerfectDraft website URL
- **BrowserSettings**: Browser type, headless mode, timeouts
- **TestData**: Test user credentials, addresses, payment data
- **Countries**: Country-specific URLs and settings
- **Products**: Product information for testing

## Phase 1 Implementation Status

✅ **Completed Tasks:**
- Initialize Reqnroll project with Playwright
- Configure project dependencies and NuGet packages  
- Set up basic test configuration (browsers, timeouts, URLs)
- Create base page object class with common functionality
- Implement WebDriver factory for cross-browser testing
- Set up test data management system

## Running Tests

### Command Line
```bash
# Run all tests
dotnet test

# Run with specific browser
dotnet test -- MSTest.Browser=Firefox

# Run in headless mode
dotnet test -- MSTest.Headless=true
```

### Visual Studio
1. Open the solution in Visual Studio
2. Build the project
3. Use Test Explorer to run individual tests or test suites

## Features

### Cross-Browser Testing
- Chrome/Chromium (default)
- Firefox
- WebKit/Safari
- Mobile device emulation

### Test Data Management
- Configuration-driven test data
- Environment-specific settings
- Reusable data objects for users, addresses, products

### Page Object Model
- Base page class with common functionality
- Element interaction helpers
- Assertion helpers
- Screenshot capture on failures

### Reporting
- MSTest HTML reports
- Playwright traces and screenshots
- Failure screenshots automatically captured

## Next Steps

After Phase 1 completion, the next phases will implement:

- **Phase 2**: Level 1 scenarios (basic navigation)
- **Phase 3**: Level 2 scenarios (simple interactions)
- **Phase 4**: Level 3 scenarios (user management & cart)
- **Phase 5**: Level 4 scenarios (multi-step processes)
- **Phase 6**: Level 5 scenarios (E2E workflows)
- **Phase 7**: Level 6 scenarios (advanced testing)

See `TestsLevels.md` for detailed scenario breakdown and `Plan.md` for the complete implementation roadmap.

## Contributing

1. Follow the established naming conventions
2. Maintain the page object model structure
3. Add appropriate test data to TestDataManager
4. Include error handling and logging
5. Write descriptive test names and comments

## Support

For issues and questions:
1. Check the project documentation
2. Review existing test implementations
3. Consult the Plan.md for implementation guidance