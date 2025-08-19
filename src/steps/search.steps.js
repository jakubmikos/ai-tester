// src/steps/search.steps.js
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import SearchPage from '../pages/search.page.js';
import HomePage from '../pages/home.page.js';

const { Given, When, Then } = createBdd();

// Search action steps
When('I enter {string} in the search box', async ({ page }, searchTerm) => {
  const homePage = new HomePage(page);
  const searchPage = new SearchPage(page);

  try {
    // Try using SearchPage methods first
    await searchPage.enterSearchTerm(searchTerm);
  } catch {
    // Fallback to HomePage search method
    await homePage.searchForProduct(searchTerm);
  }
});

When('I click the search button', async ({ page }) => {
  const searchPage = new SearchPage(page);

  try {
    await searchPage.clickSearchButton();
  } catch {
    // Fallback: press Enter in search field
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle');
  }
});

// Search results verification steps
Then('I should see search results containing {string} products', async ({ page }, searchTerm) => {
  const searchPage = new SearchPage(page);

  // Verify search results are visible
  const resultsVisible = await searchPage.areSearchResultsVisible();
  expect(resultsVisible, 'Search results should be visible').toBeTruthy();

  // Verify results contain the search term
  const resultsContainTerm = await searchPage.doSearchResultsContainTerm(searchTerm);
  expect(resultsContainTerm, `Search results should contain "${searchTerm}"`).toBeTruthy();

  // Verify we have some results
  const resultCount = await searchPage.getNumberOfResults();
  expect(resultCount, 'Should have at least 1 search result').toBeGreaterThan(0);
});

Then('the results should include both kegs and bundles', async ({ page }) => {
  const searchPage = new SearchPage(page);
  const hasBothTypes = await searchPage.doResultsIncludeBothKegsAndBundles();
  expect(hasBothTypes, 'Results should include both kegs and bundles').toBeTruthy();
});

Then('I should be able to filter the search results', async ({ page }) => {
  const searchPage = new SearchPage(page);
  const filtersAvailable = await searchPage.areFiltersAvailable();
  expect(filtersAvailable, 'Search results should have filters available').toBeTruthy();
});

// No results steps
Then('I should see a {string} message', async ({ page }, messageType) => {
  const searchPage = new SearchPage(page);

  if (messageType === 'no results found') {
    const noResultsVisible = await searchPage.isNoResultsMessageVisible();
    expect(noResultsVisible, 'No results message should be visible').toBeTruthy();
  }
});

Then('I should see suggestions for alternative searches', async ({ page }) => {
  const searchPage = new SearchPage(page);
  const suggestionsVisible = await searchPage.areSearchSuggestionsVisible();
  expect(suggestionsVisible, 'Search suggestions should be visible').toBeTruthy();
});
