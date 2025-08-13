# PerfectDraft Test Automation - JavaScript Edition

Modern JavaScript/Playwright test automation framework for the PerfectDraft e-commerce platform, featuring BDD support with Gherkin syntax and comprehensive Allure reporting.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npm run playwright:install

# Run all tests
npm test

# Run tests with report
npm run test:report
```

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Reporting](#reporting)
- [Writing Tests](#writing-tests)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- **BDD Testing** - Gherkin feature files with playwright-bdd
- **Page Object Model** - Maintainable and reusable page objects
- **Cross-Browser Testing** - Chrome, Firefox, Safari/WebKit support
- **Mobile Testing** - Mobile viewport emulation
- **Parallel Execution** - Fast test execution
- **Allure Reporting** - Beautiful HTML reports with history
- **Environment Management** - Multiple environment support
- **Test Data Management** - Centralized test data
- **Automatic Retries** - Smart retry mechanism for flaky tests
- **Screenshot/Video** - Capture on failure

## 🛠 Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ LTS | Runtime environment |
| Playwright | 1.47.0 | Browser automation |
| playwright-bdd | 7.4.1 | BDD/Gherkin support |
| Allure | 2.29.0 | Test reporting |
| JavaScript | ES6+ | Programming language |

## 📁 Project Structure

```
perfectdraft-tests-js/
├── src/
│   ├── features/           # Gherkin feature files
│   │   ├── navigation.feature
│   │   ├── product-browsing.feature
│   │   ├── search.feature
│   │   ├── shopping-cart.feature
│   │   ├── checkout.feature
│   │   └── store-locator.feature
│   ├── steps/              # Step definitions
│   │   ├── navigation.steps.js
│   │   ├── product-browsing.steps.js
│   │   └── ...
│   ├── pages/              # Page Object Model
│   │   ├── base.page.js
│   │   ├── home.page.js
│   │   ├── product-catalog.page.js
│   │   └── ...
│   ├── fixtures/           # Test data
│   │   └── test-data.js
│   ├── support/            # Utilities and hooks
│   │   ├── fixtures.js
│   │   ├── hooks.js
│   │   └── allure-utils.js
│   └── config/             # Configuration
│       ├── test-config.js
│       └── environments.js
├── scripts/                # Utility scripts
│   └── allure-report.js
├── test-results/          # Test execution results
├── allure-results/        # Allure raw results
├── allure-report/         # Generated reports
├── playwright.config.js   # Playwright configuration
├── .bddrc.json           # playwright-bdd config
├── package.json          # Dependencies
└── README.md             # This file
```

## 🔧 Installation

### Prerequisites

- Node.js 18+ LTS
- npm or yarn
- Git

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd perfectdraft-tests-js
```

2. **Install dependencies**
```bash
npm install
```

3. **Install Playwright browsers**
```bash
npm run playwright:install
```

4. **Install Allure CLI (optional, for reports)**
```bash
npm install -g allure-commandline
```

5. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Test Environment
TEST_ENV=production
BASE_URL=https://www.perfectdraft.com
HEADLESS=false

# Test User
TEST_USERNAME=test@example.com
TEST_PASSWORD=TestPassword123

# Browser Settings
DEFAULT_BROWSER=chromium
SLOW_MO=0

# Timeouts
DEFAULT_TIMEOUT=30000
ACTION_TIMEOUT=15000

# Reporting
SCREENSHOT_MODE=only-on-failure
VIDEO_MODE=retain-on-failure
```

### Test Configuration

Edit `src/config/test-config.js` for test-specific settings:

```javascript
{
  baseUrl: 'https://www.perfectdraft.com',
  countries: {
    default: 'GB',
    available: ['GB', 'FR', 'DE', 'BE', 'NL']
  },
  timeouts: {
    default: 30000,
    action: 15000,
    navigation: 30000
  }
}
```

### Browser Configuration

Configure browsers in `playwright.config.js`:

```javascript
projects: [
  { name: 'chromium', use: devices['Desktop Chrome'] },
  { name: 'firefox', use: devices['Desktop Firefox'] },
  { name: 'webkit', use: devices['Desktop Safari'] },
  { name: 'mobile-chrome', use: devices['Pixel 5'] }
]
```

## 🎯 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run specific browser
npm run test:chrome
npm run test:firefox
npm run test:webkit

# Run by tag
npm run test:smoke
npm run test:regression
npm run test:critical

# Debug mode
npm run test:debug
```

### Advanced Options

```bash
# Run specific feature
npx playwright test src/features/checkout.feature

# Run with grep pattern
npx playwright test --grep "@P1"

# Run in specific environment
TEST_ENV=staging npm test

# Run with custom config
npx playwright test --config=custom.config.js
```

### Parallel Execution

```bash
# Run with specific workers
npx playwright test --workers=4

# Disable parallel execution
npx playwright test --workers=1
```

## 📊 Reporting

### Allure Reports

```bash
# Generate report
npm run report

# Generate and open
npm run report:open

# Live server with auto-refresh
npm run report:serve

# Single-file report
npm run allure:single

# Clean reports
npm run allure:clean
```

### Report Features

- **Test Categories** - Organized by priority and type
- **History & Trends** - Track test results over time
- **Attachments** - Screenshots, videos, logs
- **Performance Metrics** - Page load times
- **Network Logs** - API calls tracking
- **Console Logs** - Browser console output

### Accessing Reports

1. **Local HTML Report**
   - Location: `allure-report/index.html`
   - Open in browser directly

2. **Live Server**
   ```bash
   npm run report:serve
   ```
   - Opens at http://localhost:port
   - Auto-refreshes on new results

3. **CI/CD Reports**
   - Published to GitHub Pages
   - Available at: `https://[username].github.io/[repo]`

## ✍️ Writing Tests

### Feature Files

Create feature files in `src/features/`:

```gherkin
@Smoke @P1
Feature: Shopping Cart
  As a customer
  I want to manage my cart
  So that I can purchase products

  Scenario: Add product to cart
    Given I am on the UK website
    When I navigate to the "Kegs" section
    And I add "Stella Artois 6L Keg" to the cart
    Then the cart counter should show "1" item
```

### Step Definitions

Create step definitions in `src/steps/`:

```javascript
const { Given, When, Then } = require('playwright-bdd/decorators');
const { expect } = require('@playwright/test');

Given('I am on the UK website', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigateToUKWebsite();
});
```

### Page Objects

Create page objects in `src/pages/`:

```javascript
class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.addToCartButton = 'button[data-test="add-to-cart"]';
  }

  async addToCart() {
    await this.click(this.addToCartButton);
  }
}
```

## 🔄 CI/CD Integration

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run tests
        run: npm test
        env:
          HEADLESS: true
          CI: true
      
      - name: Generate report
        if: always()
        run: npm run allure:generate
      
      - name: Upload report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: allure-report
          path: allure-report/
```

## 🐛 Troubleshooting

### Common Issues

**1. Browsers not installed**
```bash
npm run playwright:install
```

**2. Timeout errors**
- Increase timeout in config
- Check network speed
- Verify selectors

**3. Element not found**
- Update selectors
- Add wait conditions
- Check page load

**4. Allure not found**
```bash
npm install -g allure-commandline
```

### Debug Tips

1. **Use debug mode**
```bash
npm run test:debug
```

2. **Enable verbose logging**
```javascript
DEBUG=pw:api npm test
```

3. **Capture trace**
```javascript
use: { trace: 'on' }
```

4. **Check screenshots**
- Location: `test-results/screenshots/`

## 📚 Best Practices

1. **Page Object Model**
   - One page object per page
   - Keep selectors in page objects
   - Use meaningful method names

2. **Step Definitions**
   - Keep steps atomic
   - Reuse common steps
   - Use data tables for complex data

3. **Test Data**
   - Centralize in fixtures
   - Use dynamic data generation
   - Clean up after tests

4. **Assertions**
   - Use Playwright's built-in assertions
   - Add custom messages
   - Verify critical elements

5. **Performance**
   - Run tests in parallel
   - Use specific selectors
   - Minimize waits

## 🤝 Contributing

1. Create feature branch
2. Write tests following patterns
3. Ensure all tests pass
4. Update documentation
5. Submit pull request

## 📝 License

[License Type]

## 📧 Contact

For questions or support:
- Team: QA Team
- Email: qa@perfectdraft.com
- Slack: #qa-automation

---

**Happy Testing! 🍺**