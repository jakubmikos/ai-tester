# JavaScript Migration Plan - PerfectDraft Test Automation

## Overview
This document outlines the plan to migrate the C# PerfectDraft test automation project to JavaScript using Playwright with BDD support and Allure reporting.

## Technology Stack
- **Language**: JavaScript (ES6+)
- **Test Framework**: Playwright Test
- **BDD Framework**: playwright-bdd (modern Playwright-native BDD)
- **Reporting**: Allure
- **Package Manager**: npm
- **Node Version**: 18+ (LTS)

## Migration Steps

### Step 1: Project Setup ✅ Ready for Review
**Status**: Pending
**Description**: Initialize the JavaScript project structure and dependencies

**Tasks**:
1. Create project folder structure
2. Initialize npm project
3. Install core dependencies:
   - @playwright/test
   - playwright-bdd
   - allure-playwright
   - allure-commandline
4. Create .gitignore for node_modules and test artifacts

**Folder Structure**:
```
perfectdraft-tests-js/
├── src/
│   ├── features/           # Gherkin feature files
│   ├── steps/              # Step definitions
│   ├── pages/              # Page Object Model
│   ├── fixtures/           # Test data and fixtures
│   ├── support/            # Utilities and hooks
│   └── config/             # Configuration files
├── test-results/           # Test execution results
├── allure-results/         # Allure raw results
├── allure-report/          # Generated Allure reports
├── playwright.config.js    # Playwright configuration
├── .bddrc.json            # playwright-bdd configuration
├── package.json
└── README.md
```

---

### Step 2: Playwright & BDD Configuration ✅ Ready for Review
**Status**: Pending
**Description**: Configure Playwright and playwright-bdd for BDD testing

**Tasks**:
1. Create playwright.config.js with:
   - Browser configurations (Chrome, Firefox, WebKit)
   - Test directory paths
   - Reporter settings (HTML, Allure)
   - Screenshot/video settings
   - Timeout configurations
2. Create .bddrc.json for playwright-bdd settings
3. Configure test environments (local, staging, production)

**Key Configuration Points**:
- Parallel execution settings
- Retry logic
- Screenshot on failure
- Trace collection for debugging

---

### Step 3: Page Objects Migration ✅ Ready for Review
**Status**: Pending
**Description**: Convert C# Page Objects to JavaScript

**Pages to Convert**:
1. BasePage.cs → base.page.js
2. HomePage.cs → home.page.js
3. ProductCatalogPage.cs → product-catalog.page.js
4. ProductDetailPage.cs → product-detail.page.js
5. ShoppingCartPage.cs → shopping-cart.page.js
6. CheckoutPage.cs → checkout.page.js
7. SearchPage.cs → search.page.js
8. StoreLocatorPage.cs → store-locator.page.js
9. PromotionalPage.cs → promotional.page.js

**Conversion Strategy**:
- Convert C# properties to JavaScript class properties
- Adapt locator strategies to Playwright syntax
- Implement JavaScript async/await patterns
- Add JSDoc comments for better IDE support

---

### Step 4: Feature Files Migration ✅ Ready for Review
**Status**: Pending
**Description**: Migrate and adapt Gherkin feature files

**Tasks**:
1. Copy existing feature files
2. Review and update scenario tags for playwright-bdd
3. Ensure feature syntax compatibility
4. Organize features by functional area

**Current Features to Migrate**:
- PerfectDraftFeatures.feature (will be split into multiple files):
  - navigation.feature
  - product-browsing.feature
  - shopping-cart.feature
  - checkout.feature
  - store-locator.feature
  - promotions.feature
  - country-selection.feature

---

### Step 5: Step Definitions Migration ✅ Ready for Review
**Status**: Pending
**Description**: Convert C# step definitions to JavaScript

**Step Definition Files to Convert**:
1. NavigationSteps.cs → navigation.steps.js
2. ProductBrowsingSteps.cs → product-browsing.steps.js
3. AddProductsToShoppingCart.cs → shopping-cart.steps.js
4. GuestCheckoutSteps.cs → checkout.steps.js
5. StoreLocatorSteps.cs → store-locator.steps.js
6. PromotionalSteps.cs → promotional.steps.js
7. CountrySelectionSteps.cs → country-selection.steps.js
8. StepDefinitionBase.cs → step-base.js

**Conversion Considerations**:
- Adapt to playwright-bdd step syntax
- Convert C# assertions to JavaScript/Playwright assertions
- Implement proper async/await patterns
- Share page objects through context

---

### Step 6: Test Data & Configuration ✅ Ready for Review
**Status**: Pending
**Description**: Migrate test configuration and data management

**Tasks**:
1. Convert appsettings.json to JavaScript configuration
2. Create test-data.js with:
   - User credentials
   - Product data
   - Address information
   - Payment details
3. Implement environment-specific configurations
4. Create data factories for dynamic test data

**Configuration Structure**:
```javascript
// config/test-config.js
module.exports = {
  baseUrl: process.env.BASE_URL || 'https://www.perfectdraft.com',
  browsers: ['chromium', 'firefox'],
  headless: process.env.HEADLESS !== 'false',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0
};
```

---

### Step 7: Support Utilities & Hooks ✅ Ready for Review
**Status**: Pending
**Description**: Implement test hooks and utility functions

**Tasks**:
1. Create Playwright hooks:
   - beforeAll/afterAll
   - beforeEach/afterEach
2. Implement screenshot utilities
3. Create custom assertions
4. Add logging utilities
5. Implement test context management

**Hook Features**:
- Browser context setup
- Page object initialization
- Test data cleanup
- Screenshot on failure
- Allure metadata attachment

---

### Step 8: Allure Reporting Setup ✅ Ready for Review
**Status**: Pending
**Description**: Configure comprehensive Allure reporting

**Tasks**:
1. Configure allure-playwright reporter
2. Create allure-categories.json
3. Set up environment.properties
4. Create report generation scripts
5. Implement custom Allure decorators

**Scripts to Create**:
- generate-allure-report.js (cross-platform)
- GitHub Actions workflow for report publishing

---

### Step 9: Scripts & Documentation ✅ Ready for Review
**Status**: Pending
**Description**: Create npm scripts and update documentation

**NPM Scripts**:
```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:chrome": "playwright test --project=chromium",
    "test:firefox": "playwright test --project=firefox",
    "test:debug": "playwright test --debug",
    "test:tag": "playwright test --grep",
    "allure:generate": "allure generate allure-results --clean",
    "allure:open": "allure open allure-report",
    "allure:serve": "allure serve allure-results",
    "test:report": "npm run test && npm run allure:generate && npm run allure:open"
  }
}
```

**Documentation Updates**:
1. Update README.md with JavaScript instructions
2. Create SETUP.md for initial setup guide
3. Document Page Object patterns used
4. Add troubleshooting guide

---

### Step 10: Testing & Validation ✅ Ready for Review
**Status**: Pending
**Description**: Validate the migrated test suite

**Validation Tasks**:
1. Run smoke tests on all browsers
2. Verify Allure reports are generated correctly
3. Test parallel execution
4. Validate CI/CD integration
5. Performance comparison with C# version

**Success Criteria**:
- All existing test scenarios work
- Reports generate successfully
- Tests run in parallel efficiently
- Cross-browser compatibility confirmed

---

## Migration Timeline
- **Step 1-2**: Day 1 - Project setup and configuration
- **Step 3-5**: Day 2-3 - Core migration (Pages, Features, Steps)
- **Step 6-7**: Day 4 - Test data and utilities
- **Step 8-9**: Day 5 - Reporting and documentation
- **Step 10**: Day 6 - Testing and validation

## Risk Mitigation
1. **Parallel Development**: Keep C# version running until JS version is validated
2. **Incremental Migration**: Migrate and test one feature at a time
3. **Version Control**: Create separate branch for migration
4. **Rollback Plan**: Maintain ability to revert to C# version if needed

## Dependencies to Install
```json
{
  "devDependencies": {
    "@playwright/test": "^1.47.0",
    "playwright-bdd": "^7.4.1",
    "allure-playwright": "^3.0.0",
    "allure-commandline": "^2.29.0",
    "dotenv": "^16.4.0"
  }
}
```

## Notes
- No TypeScript as per requirement
- Using modern ES6+ JavaScript features
- Focus on maintainability and readability
- Leverage Playwright's built-in features (auto-waiting, retries)