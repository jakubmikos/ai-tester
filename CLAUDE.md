# Technology Stack

- **Language**: JavaScript (ES6+, ES modules, NOT CommonJS)
- **Test Runner**: Jest
- **BDD Framework**: Cucumber.js (NOT playwright-bdd)
- Web application testing:
  - **Browser automation**: Playwright
- **Reporting**: Allure
- **Package Manager**: npm

# Bash commands

- npm run test

# Tools

- use available browser automation MCP server (playwright or pupeteer) to solve problems related to website structure

# Step Definition Best Practices

1. **Unique Steps**: Avoid duplicate step patterns
2. **Specific Patterns**: Use specific step text to avoid conflicts
   - NOT `When('I click {string}'` (too generic)
   - YES `When('I click the {string} button'` (more specific)
3. Separate feature files per application - eg. website, Android app, iPhone app. Create one feature file per feature (eg. search, manipulating cart, checkout etc.)

# Workflow

1. New tests:
   1. Write down the test into a feature file, try to reuse as many existing steps as possible
   2. Run the new test
   3. Identify the problems if any
   4. If step is not implemented, think about weather it is a spelling mistake or a new one is required
   5. Fix spelling mistake or implement a new step and go back to step 2.
   6. Iterate until test is passing
2. Change to the existing test
   1. start with the feature file
   2. run the test
   3. identify and fix problems
   4. repeat until the test is passing
3. Run the whole test suite before and after implementing or fixing any tests to make sure we do not introduce any regressions in the rest of the test suit. If there are regressions, think hard to identify the reason and decide weather you need to reject your previous work or amend other tests to follow new patterns.

# Code style

- Use ES modules (import/export) syntax, NOT CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')

## Step implementation

- when looking for an element based on string provided as a parameter lookup in following order:
  - data-testid attribute
  - data-name attribute
  - aria-label attribute
  - name attribute
  - text
- When there are no element found, raise an errror stating so
- when there is multiple elements found, perform an action (eg. click) on the first one
- if the particular page contains multiple elements which may change, eg. search results, provide or suggest the step which would validate or take an action on nth element rather than matching it by name
