# Setup Guide - PerfectDraft Test Automation

## 🚀 Quick Setup (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Install browsers
npm run playwright:install

# 3. Copy environment config
cp .env.example .env

# 4. Run your first test
npm run test:smoke
```

## 📋 Detailed Setup Instructions

### Step 1: System Requirements

Ensure you have the following installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

Verify installations:
```bash
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher
git --version   # Any recent version
```

### Step 2: Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd perfectdraft-tests-js

# Switch to JavaScript branch
git checkout javascript
```

### Step 3: Install Dependencies

```bash
# Install all npm packages
npm install

# If you encounter issues, try:
npm install --legacy-peer-deps
```

### Step 4: Install Playwright Browsers

```bash
# Install all browsers
npm run playwright:install

# Or install specific browser
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

### Step 5: Configure Environment

1. **Create .env file**
```bash
cp .env.example .env
```

2. **Edit .env file with your settings**
```env
# Required settings
BASE_URL=https://www.perfectdraft.com
HEADLESS=false
DEFAULT_BROWSER=chromium

# Optional test user (for authenticated tests)
TEST_USERNAME=your-test-email@example.com
TEST_PASSWORD=your-test-password
```

### Step 6: Verify Installation

Run the verification script:
```bash
node scripts/test-runner.js --help
```

Or run a simple test:
```bash
npm run test:smoke -- --headed
```

## 🔧 IDE Setup (VS Code)

### Recommended Extensions

1. **Playwright Test for VSCode**
   - Extension ID: `ms-playwright.playwright`
   - Features: Test runner, debugging, code generation

2. **Cucumber (Gherkin) Full Support**
   - Extension ID: `alexkrechik.cucumberautocomplete`
   - Features: Syntax highlighting, autocomplete

3. **ESLint**
   - Extension ID: `dbaeumer.vscode-eslint`
   - Features: Code quality checks

4. **Prettier**
   - Extension ID: `esbenp.prettier-vscode`
   - Features: Code formatting

### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "cucumber.features": ["src/features/**/*.feature"],
  "cucumber.glue": ["src/steps/**/*.js"],
  "playwright.reuseBrowser": true,
  "playwright.showTrace": true
}
```

## 🌍 Environment-Specific Setup

### Local Development

```bash
# Use local environment
TEST_ENV=local BASE_URL=http://localhost:3000 npm test
```

### Staging Environment

```bash
# Use staging environment
TEST_ENV=staging npm test
```

### Production Environment

```bash
# Use production (default)
npm test
```

## 🔐 Authentication Setup

### Option 1: Test Credentials (Recommended)

Add to `.env`:
```env
TEST_USERNAME=test.user@perfectdraft.com
TEST_PASSWORD=SecureTestPassword123
```

### Option 2: Auth State (Advanced)

Save authentication state:
```bash
npx playwright codegen --save-storage=auth.json
```

Use in tests:
```javascript
const context = await browser.newContext({
  storageState: 'auth.json'
});
```

## 🐳 Docker Setup (Optional)

### Build Docker Image

Create `Dockerfile`:
```dockerfile
FROM mcr.microsoft.com/playwright:v1.47.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx playwright install

CMD ["npm", "test"]
```

### Run in Docker

```bash
# Build image
docker build -t perfectdraft-tests .

# Run tests
docker run --rm perfectdraft-tests

# Run with custom command
docker run --rm perfectdraft-tests npm run test:smoke
```

## 🔄 CI/CD Setup

### GitHub Actions

Already configured in `.github/workflows/test.yml`

### GitLab CI

Create `.gitlab-ci.yml`:
```yaml
test:
  image: mcr.microsoft.com/playwright:v1.47.0-jammy
  script:
    - npm ci
    - npm run test
  artifacts:
    when: always
    paths:
      - allure-report/
    expire_in: 1 week
```

### Jenkins

Create `Jenkinsfile`:
```groovy
pipeline {
  agent any
  
  stages {
    stage('Setup') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install'
      }
    }
    
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
    
    stage('Report') {
      steps {
        sh 'npm run allure:generate'
        publishHTML([
          reportDir: 'allure-report',
          reportFiles: 'index.html',
          reportName: 'Allure Report'
        ])
      }
    }
  }
}
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Browser Launch Error
```bash
# Error: browserType.launch: Executable doesn't exist
Solution: npm run playwright:install
```

#### 2. Timeout Errors
```bash
# Error: Test timeout of 30000ms exceeded
Solution: Increase timeout in playwright.config.js
```

#### 3. Module Not Found
```bash
# Error: Cannot find module 'playwright-bdd'
Solution: npm install
```

#### 4. Permission Denied
```bash
# Error: EACCES: permission denied
Solution: 
- Windows: Run as Administrator
- Mac/Linux: Use sudo npm install -g
```

#### 5. Port Already in Use
```bash
# Error: Port 9323 is already in use
Solution: Kill the process or use different port
```

### Debug Mode

Enable debug mode for troubleshooting:
```bash
# Playwright debug
DEBUG=pw:api npm test

# Verbose logging
VERBOSE=true npm test

# Interactive debug
npm run test:debug
```

## 📞 Support

If you encounter issues:

1. Check [Troubleshooting](#troubleshooting) section
2. Review error logs in `test-results/`
3. Contact the team:
   - Slack: #qa-automation
   - Email: qa@perfectdraft.com

## ✅ Setup Verification Checklist

- [ ] Node.js 18+ installed
- [ ] npm dependencies installed
- [ ] Playwright browsers installed
- [ ] .env file configured
- [ ] Can run `npm run test:smoke`
- [ ] Can generate Allure report
- [ ] VS Code extensions installed (optional)
- [ ] Can run tests in headed mode

## 🎉 Ready to Test!

Once setup is complete, you can:

1. Run smoke tests: `npm run test:smoke`
2. Run all tests: `npm test`
3. Debug tests: `npm run test:debug`
4. Generate reports: `npm run report:open`

Happy Testing! 🍺