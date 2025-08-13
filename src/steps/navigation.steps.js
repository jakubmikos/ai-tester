// src/steps/navigation.steps.js
const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const HomePage = require('../pages/home.page');

const { Given, When, Then } = createBdd();

// Background steps
Given('I navigate to the PerfectDraft website', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigateToUKWebsite();
});

Given('I am on the UK website', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigateToUKWebsite();
  // Accept cookies if banner appears
  await homePage.acceptCookies();
});

// Country selection steps
When('I am on the country selection page', async ({ page }) => {
  // Navigate to main domain which should show country selection
  await page.goto('https://www.perfectdraft.com');
  await page.waitForLoadState('domcontentloaded');
});

Then('I should see the available regions {string} and {string}', async ({ page }, region1, region2) => {
  const pageContent = await page.textContent('body');
  expect(pageContent).toContain(region1);
  expect(pageContent).toContain(region2);
});

Then('I should see country options including {string}, {string}, {string}', async ({ page }, country1, country2, country3) => {
  const pageContent = await page.textContent('body');
  expect(pageContent).toContain(country1);
  expect(pageContent).toContain(country2);
  expect(pageContent).toContain(country3);
});

When('I select country {string}', async ({ page }, country) => {
  // Try to find and click the country selection
  const countrySelectors = [
    `text="${country}"`,
    `[data-country="${country}"]`,
    `a:has-text("${country}")`,
    `button:has-text("${country}")`
  ];

  let countrySelected = false;
  for (const selector of countrySelectors) {
    try {
      const element = page.locator(selector);
      if (await element.count() > 0 && await element.first().isVisible()) {
        await element.first().click();
        countrySelected = true;
        break;
      }
    } catch {
      continue;
    }
  }

  if (!countrySelected) {
    // Fallback: navigate directly to country URL
    const homePage = new HomePage(page);
    if (country === 'United Kingdom') {
      await homePage.navigateToCountry('GB');
    } else if (country === 'Deutschland') {
      await homePage.navigateToCountry('DE');
    } else if (country === 'France') {
      await homePage.navigateToCountry('FR');
    }
  }

  await page.waitForLoadState('networkidle');
});

Then('I should be redirected to the UK website', async ({ page }) => {
  await page.waitForURL(/.*perfectdraft\.com.*en-gb.*/);
  expect(page.url()).toContain('en-gb');
});

Then('I should be redirected to the {string} website', async ({ page }, country) => {
  const expectedUrls = {
    'United Kingdom': 'en-gb',
    'Deutschland': 'de-de',
    'France': 'fr-fr'
  };

  const expectedPath = expectedUrls[country];
  if (expectedPath) {
    await page.waitForURL(new RegExp(`.*${expectedPath}.*`));
    expect(page.url()).toContain(expectedPath);
  }
});

Then('the currency should be displayed in {string}', async ({ page }, currency) => {
  // Wait a bit for currency to load
  await page.waitForTimeout(2000);
  
  const pageContent = await page.textContent('body');
  
  if (currency === 'GBP') {
    expect(pageContent).toMatch(/£\d+/);
  } else if (currency === 'EUR') {
    expect(pageContent).toMatch(/€\d+|EUR/);
  }
});

Then('the language should be {string}', async ({ page }, language) => {
  const htmlLang = await page.getAttribute('html', 'lang');
  
  if (language === 'English') {
    expect(htmlLang).toMatch(/en/i);
  } else if (language === 'German') {
    expect(htmlLang).toMatch(/de/i);
  } else if (language === 'French') {
    expect(htmlLang).toMatch(/fr/i);
  }
});

// Navigation menu steps
When('I view the main navigation menu', async ({ page }) => {
  const homePage = new HomePage(page);
  const isNavVisible = await homePage.isNavigationMenuVisible();
  expect(isNavVisible).toBeTruthy();
});

Then('I should see navigation options:', async ({ page }, dataTable) => {
  const expectedMenuItems = dataTable.hashes().map(row => row['Menu Item']);
  const homePage = new HomePage(page);
  
  for (const menuItem of expectedMenuItems) {
    const isVisible = await homePage.isMenuItemVisible(menuItem);
    expect(isVisible, `Menu item "${menuItem}" should be visible`).toBeTruthy();
  }
});

Then('the search functionality should be available', async ({ page }) => {
  const homePage = new HomePage(page);
  const isSearchAvailable = await homePage.isSearchFunctionalityAvailable();
  expect(isSearchAvailable, 'Search functionality should be available').toBeTruthy();
});

Then('the cart icon should show {string} items', async ({ page }, expectedCount) => {
  const homePage = new HomePage(page);
  const cartCount = await homePage.getCartItemCount();
  expect(cartCount, `Cart should show ${expectedCount} items`).toBe(expectedCount);
});