// src/steps/product-browsing.steps.js
const { Given, When, Then } = require('playwright-bdd/decorators');
const { expect } = require('@playwright/test');
const HomePage = require('../pages/home.page');
const ProductCatalogPage = require('../pages/product-catalog.page');
const ProductDetailPage = require('../pages/product-detail.page');

// Navigation to product sections
When('I navigate to the {string} section', async ({ page }, sectionName) => {
  const homePage = new HomePage(page);
  await homePage.navigateToSection(sectionName);
});

// Beer kegs catalog steps
Then('I should see a list of available beer kegs', async ({ page }) => {
  const catalogPage = new ProductCatalogPage(page);
  const isKegListVisible = await catalogPage.isKegListVisible();
  expect(isKegListVisible, 'Beer kegs list should be visible').toBeTruthy();
  
  const kegCount = await catalogPage.getKegCount();
  expect(kegCount, 'Should have at least 1 keg displayed').toBeGreaterThan(0);
});

Then('each keg should display basic information', async ({ page }) => {
  const catalogPage = new ProductCatalogPage(page);
  const hasRequiredInfo = await catalogPage.doKegsDisplayRequiredInformation();
  expect(hasRequiredInfo, 'Kegs should display required information (image, name, price, ABV)').toBeTruthy();
});

Then('I should be able to filter by beer type', async ({ page }) => {
  const catalogPage = new ProductCatalogPage(page);
  const filtersAvailable = await catalogPage.areFiltersAvailable();
  expect(filtersAvailable, 'Filters should be available').toBeTruthy();
});

Then('I should be able to sort by price or popularity', async ({ page }) => {
  const catalogPage = new ProductCatalogPage(page);
  const sortOptionsAvailable = await catalogPage.areSortOptionsAvailable();
  expect(sortOptionsAvailable, 'Sort options should be available').toBeTruthy();
});

// Machine options steps
Then('I should see all machine types:', async ({ page }, dataTable) => {
  const expectedMachineTypes = dataTable.hashes().map(row => row['Machine Type']);
  const catalogPage = new ProductCatalogPage(page);
  
  for (const machineType of expectedMachineTypes) {
    const isVisible = await catalogPage.isMachineTypeVisible(machineType);
    expect(isVisible, `Machine type "${machineType}" should be visible`).toBeTruthy();
  }
});

When('I click on a machine to view details', async ({ page }) => {
  const catalogPage = new ProductCatalogPage(page);
  await catalogPage.clickOnFirstMachine();
});

Then('I should see machine specifications including keg size', async ({ page }) => {
  const catalogPage = new ProductCatalogPage(page);
  
  const specsVisible = await catalogPage.areSpecificationsVisible();
  expect(specsVisible, 'Machine specifications should be visible').toBeTruthy();
  
  const kegSizeVisible = await catalogPage.isKegSizeSpecificationVisible();
  expect(kegSizeVisible, 'Keg size specification should be visible').toBeTruthy();
});

// Product detail steps
When('I click on a beer keg {string}', async ({ page }, productName) => {
  const catalogPage = new ProductCatalogPage(page);
  await catalogPage.clickOnProductByName(productName);
});

Then('I should see the product detail page', async ({ page }) => {
  const productDetailPage = new ProductDetailPage(page);
  const isDetailPageVisible = await productDetailPage.isProductDetailPageVisible();
  expect(isDetailPageVisible, 'Product detail page should be visible').toBeTruthy();
});

Then('I should see detailed product information:', async ({ page }, dataTable) => {
  const expectedDetails = dataTable.hashes().map(row => row['Detail Type']);
  const productDetailPage = new ProductDetailPage(page);
  
  for (const detail of expectedDetails) {
    let isVisible = false;
    
    switch (detail) {
      case 'Product images':
        isVisible = await productDetailPage.isProductImageVisible();
        break;
      case 'Full description':
        isVisible = await productDetailPage.isFullDescriptionVisible();
        break;
      case 'ABV and volume':
        isVisible = await productDetailPage.isABVAndVolumeVisible();
        break;
      case 'Price information':
        isVisible = await productDetailPage.isPriceInformationVisible();
        break;
      case 'Stock availability':
        isVisible = await productDetailPage.isStockAvailabilityVisible();
        break;
      case 'Customer reviews':
        isVisible = await productDetailPage.isCustomerReviewsVisible();
        break;
    }
    
    expect(isVisible, `"${detail}" should be visible on product detail page`).toBeTruthy();
  }
});

Then('I should see an {string} button', async ({ page }, buttonText) => {
  const productDetailPage = new ProductDetailPage(page);
  
  if (buttonText === 'Add to Cart') {
    const isAddToCartVisible = await productDetailPage.isAddToCartButtonVisible();
    expect(isAddToCartVisible, 'Add to Cart button should be visible').toBeTruthy();
  }
});

Then('I should see related product recommendations', async ({ page }) => {
  const productDetailPage = new ProductDetailPage(page);
  const hasRelatedProducts = await productDetailPage.isRelatedProductsVisible();
  expect(hasRelatedProducts, 'Related products should be visible').toBeTruthy();
});

// Promotional offers steps
When('I navigate to promotional keg packs', async ({ page }) => {
  // Try multiple ways to navigate to promotional packs
  const promotionalSelectors = [
    'text="Multibuy"',
    'text="Keg Packs"',
    'a[href*="promo"]',
    'a[href*="offer"]',
    'a[href*="pack"]'
  ];

  let navigated = false;
  for (const selector of promotionalSelectors) {
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
    await page.goto('/en-gb/perfect-draft-range/keg-packs');
    await page.waitForLoadState('networkidle');
  }
});

Then('I should see current offers like {string}', async ({ page }, offerName) => {
  const pageContent = await page.textContent('body');
  expect(pageContent).toContain(offerName);
});

Then('I should see pricing options:', async ({ page }, dataTable) => {
  const expectedPricing = dataTable.hashes();
  const pageContent = await page.textContent('body');
  
  for (const pricing of expectedPricing) {
    const packSize = pricing['Pack Size'];
    const price = pricing['Price'];
    
    // Check if pricing information is present on the page
    expect(pageContent).toContain(packSize);
    expect(pageContent).toContain(price);
  }
});

When('I select {string} keg pack', async ({ page }, packOption) => {
  try {
    // Try to find and click the pack option
    const packSelectors = [
      `text="${packOption}"`,
      `button:has-text("${packOption}")`,
      `a:has-text("${packOption}")`,
      `[data-pack*="3"]` // For "3 kegs" option
    ];

    for (const selector of packSelectors) {
      const element = page.locator(selector);
      if (await element.count() > 0 && await element.first().isVisible()) {
        await element.first().click();
        await page.waitForTimeout(1000);
        break;
      }
    }
  } catch (error) {
    console.log(`Could not select pack option: ${packOption}`);
  }
});

Then('I should be able to choose from available keg options', async ({ page }) => {
  // Look for keg selection interface
  const kegSelectionSelectors = [
    '.keg-options',
    '.product-options',
    '.keg-selection',
    'select[name*="keg"]',
    '.keg-chooser'
  ];

  let hasKegOptions = false;
  for (const selector of kegSelectionSelectors) {
    if (await page.locator(selector).count() > 0) {
      hasKegOptions = true;
      break;
    }
  }

  // Also check page content for keg selection text
  if (!hasKegOptions) {
    const pageContent = await page.textContent('body');
    hasKegOptions = pageContent.includes('Choose your kegs') || 
                   pageContent.includes('Select kegs') ||
                   pageContent.includes('Keg selection');
  }

  expect(hasKegOptions, 'Should be able to choose from available keg options').toBeTruthy();
});

Then('I should see the discount calculation', async ({ page }) => {
  const pageContent = await page.textContent('body');
  const hasDiscountInfo = pageContent.includes('Save') ||
                         pageContent.includes('Discount') ||
                         pageContent.includes('You save') ||
                         pageContent.includes('£') && pageContent.includes('off');

  expect(hasDiscountInfo, 'Should see discount calculation').toBeTruthy();
});

Then('promotional terms should be clearly displayed', async ({ page }) => {
  const pageContent = await page.textContent('body');
  const hasTerms = pageContent.includes('Terms') ||
                  pageContent.includes('Conditions') ||
                  pageContent.includes('Valid until') ||
                  pageContent.includes('Offer valid');

  expect(hasTerms, 'Promotional terms should be displayed').toBeTruthy();
});