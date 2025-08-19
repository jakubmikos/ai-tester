// src/steps/store-locator.steps.js
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import HomePage from '../pages/home.page.js';
import StoreLocatorPage from '../pages/store-locator.page.js';

const { Given, When, Then } = createBdd();

// Store locator navigation
When('I navigate to {string}', async ({ page }, sectionName) => {
  if (sectionName === 'Community Store Network') {
    const storeLocatorPage = new StoreLocatorPage(page);
    await storeLocatorPage.navigateToStoreLocator();
  } else {
    // Generic navigation for other sections
    const homePage = new HomePage(page);
    await homePage.navigateToSection(sectionName);
  }
});

// Store search steps
When('I enter postcode {string}', async ({ page }, postcode) => {
  const storeLocatorPage = new StoreLocatorPage(page);
  await storeLocatorPage.enterPostcode(postcode);
});

When('I click {string} for store search', async ({ page }, buttonText) => {
  if (buttonText === 'Find Stores') {
    const storeLocatorPage = new StoreLocatorPage(page);
    await storeLocatorPage.clickSearch();
  }
});

// Store results verification
Then('I should see a list of nearby Community Stores', async ({ page }) => {
  const storeLocatorPage = new StoreLocatorPage(page);
  
  // Wait for results to load
  await page.waitForTimeout(2000);

  const storeCount = await storeLocatorPage.getStoreCount();
  expect(storeCount, 'Should see a list of nearby Community Stores').toBeGreaterThan(0);
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