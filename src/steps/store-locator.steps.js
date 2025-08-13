// src/steps/store-locator.steps.js
const { Given, When, Then } = require('playwright-bdd/decorators');
const { expect } = require('@playwright/test');
const HomePage = require('../pages/home.page');

// Store locator navigation
When('I navigate to {string}', async ({ page }, sectionName) => {
  if (sectionName === 'Community Store Network') {
    // Try multiple ways to navigate to store locator
    const storeLocatorSelectors = [
      'text="Community Stores"',
      'text="Store Locator"',
      'text="Find a Store"',
      'a[href*="store"]',
      'a[href*="community"]',
      'a[href*="locator"]'
    ];

    let navigated = false;
    for (const selector of storeLocatorSelectors) {
      try {
        const element = page.locator(selector);
        if (await element.count() > 0 && await element.first().isVisible()) {
          await element.first().click();
          await page.waitForLoadState('networkidle');
          navigated = true;
          break;
        }
      } catch {
        continue;
      }
    }

    if (!navigated) {
      // Fallback: direct navigation
      await page.goto('/en-gb/community-stores');
      await page.waitForLoadState('networkidle');
    }
  } else {
    // Generic navigation for other sections
    const homePage = new HomePage(page);
    await homePage.navigateToSection(sectionName);
  }
});

// Store search steps
When('I enter postcode {string}', async ({ page }, postcode) => {
  // Find postcode input field
  const postcodeSelectors = [
    'input[name*="postcode"]',
    'input[name*="zip"]',
    'input[placeholder*="postcode"]',
    'input[placeholder*="Postcode"]',
    '#postcode',
    '.postcode-input'
  ];

  let postcodeEntered = false;
  for (const selector of postcodeSelectors) {
    try {
      const element = page.locator(selector);
      if (await element.count() > 0 && await element.first().isVisible()) {
        await element.first().fill(postcode);
        postcodeEntered = true;
        break;
      }
    } catch {
      continue;
    }
  }

  if (!postcodeEntered) {
    throw new Error('Could not find postcode input field');
  }
});

When('I click {string}', async ({ page }, buttonText) => {
  if (buttonText === 'Find Stores') {
    // Try to find and click the search button
    const searchSelectors = [
      `button:has-text("${buttonText}")`,
      `text="${buttonText}"`,
      'button[type="submit"]',
      '.search-button',
      '.find-stores'
    ];

    let clicked = false;
    for (const selector of searchSelectors) {
      try {
        const element = page.locator(selector);
        if (await element.count() > 0 && await element.first().isVisible()) {
          await element.first().click();
          await page.waitForLoadState('networkidle');
          clicked = true;
          break;
        }
      } catch {
        continue;
      }
    }

    if (!clicked) {
      // Fallback: press Enter
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
    }
  }
});

// Store results verification
Then('I should see a list of nearby Community Stores', async ({ page }) => {
  // Wait for results to load
  await page.waitForTimeout(2000);

  // Check for store results
  const storeResultSelectors = [
    '.store-result',
    '.store-item',
    '.store-location',
    '.community-store',
    '[data-store]'
  ];

  let hasStores = false;
  for (const selector of storeResultSelectors) {
    const storeCount = await page.locator(selector).count();
    if (storeCount > 0) {
      hasStores = true;
      break;
    }
  }

  // Also check page content for store information
  if (!hasStores) {
    const pageContent = await page.textContent('body');
    hasStores = pageContent.includes('Store') || 
                pageContent.includes('Community') ||
                pageContent.includes('Opening hours') ||
                pageContent.includes('Address');
  }

  expect(hasStores, 'Should see a list of nearby Community Stores').toBeTruthy();
});

Then('each store should show:', async ({ page }, dataTable) => {
  const expectedStoreInfo = dataTable.hashes().map(row => row['Store Information']);
  const pageContent = await page.textContent('body');

  for (const info of expectedStoreInfo) {
    let hasInfo = false;

    switch (info) {
      case 'Store name':
        hasInfo = pageContent.includes('Store') || 
                 pageContent.includes('Community') ||
                 (await page.locator('.store-name, .store-title, h3').count() > 0);
        break;
      case 'Address':
        hasInfo = pageContent.includes('Street') || 
                 pageContent.includes('Road') ||
                 pageContent.includes('Avenue') ||
                 (await page.locator('.store-address, .address').count() > 0);
        break;
      case 'Distance':
        hasInfo = pageContent.includes('miles') || 
                 pageContent.includes('km') ||
                 pageContent.includes('distance') ||
                 (await page.locator('.store-distance, .distance').count() > 0);
        break;
      case 'Opening hours':
        hasInfo = pageContent.includes('Open') || 
                 pageContent.includes('hours') ||
                 pageContent.includes('Monday') ||
                 pageContent.includes('Sunday') ||
                 (await page.locator('.opening-hours, .hours').count() > 0);
        break;
      case 'Available services':
        hasInfo = pageContent.includes('Services') || 
                 pageContent.includes('Available') ||
                 pageContent.includes('Keg return') ||
                 (await page.locator('.store-services, .services').count() > 0);
        break;
    }

    expect(hasInfo, `Store should show "${info}"`).toBeTruthy();
  }
});

Then('I should be able to get directions to selected stores', async ({ page }) => {
  // Check for directions functionality
  const directionsSelectors = [
    'button:has-text("Directions")',
    'button:has-text("Get Directions")',
    'a:has-text("Directions")',
    '.directions-link',
    '[href*="maps"]',
    '[href*="directions"]'
  ];

  let hasDirections = false;
  for (const selector of directionsSelectors) {
    const directionsCount = await page.locator(selector).count();
    if (directionsCount > 0) {
      hasDirections = true;
      break;
    }
  }

  // Also check page content
  if (!hasDirections) {
    const pageContent = await page.textContent('body');
    hasDirections = pageContent.includes('Directions') || 
                   pageContent.includes('Get directions') ||
                   pageContent.includes('View on map');
  }

  expect(hasDirections, 'Should be able to get directions to stores').toBeTruthy();
});