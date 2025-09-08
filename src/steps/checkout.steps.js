// src/steps/checkout.steps.js
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import CheckoutPage from '../pages/checkout.page.js';
import ShoppingCartPage from '../pages/shopping-cart.page.js';

const { Given, When, Then } = createBdd();

// Authentication state
Given('I am not logged in', async ({ page }) => {
  // Clear any existing session
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
});

// Checkout initiation
When('I proceed to checkout', async ({ page }) => {
  const cartPage = new ShoppingCartPage(page);
  await cartPage.proceedToCheckout();
  
  // Wait for checkout page to load
  await page.waitForLoadState('networkidle');
});

// Guest checkout steps
When('I select {string} checkout option', async ({ page }, checkoutType) => {
  const checkoutPage = new CheckoutPage(page);
  
  if (checkoutType === 'Checkout as Guest') {
    // The guest checkout is usually handled in the email step
    console.log('Guest checkout will be handled with email entry');
  }
});

When('I fill in guest checkout information with email {string}:', async ({ page }, email, dataTable) => {
  const checkoutPage = new CheckoutPage(page);
  
  // First, select guest checkout with email
  await checkoutPage.selectGuestCheckout(email);

  await page.getByText('Enter address manually').click();

  // Parse shipping information from data table
  const shippingData = {};
  const rows = dataTable.hashes();
  
  for (const row of rows) {
    const field = row['Field'];
    const value = row['Value'];
    
    switch (field) {
      case 'First Name':
        shippingData.firstName = value;
        break;
      case 'Last Name':
        shippingData.lastName = value;
        break;
      case 'Phone Number':
        shippingData.phone = value;
        break;
      case 'Address Line 1':
        shippingData.addressLine1 = value;
        break;
      case 'City':
        shippingData.city = value;
        break;
      case 'Postcode':
        shippingData.postcode = value;
        break;
    }
  }
  
  // Fill shipping address
  await checkoutPage.fillShippingAddress(shippingData);
});

When('I select {string} delivery', async ({ page }, deliveryOption) => {
  if (deliveryOption === 'Standard Delivery') {
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.selectDeliveryOption(deliveryOption);
  }
});

When('I enter valid payment details', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  
  const paymentInfo = {
    cardNumber: '4532123456789012',
    expiryDate: '12/25',
    cvv: '123',
    cardholderName: 'Jane Smith'
  };
  
  await checkoutPage.fillPaymentDetails(paymentInfo);
});

When('I confirm age verification \\(18+\\)', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.confirmAgeVerification();
});

When('I click {string} button', async ({ page }, buttonText) => {
  const checkoutPage = new CheckoutPage(page);
  
  if (buttonText === 'Place Order') {
    await checkoutPage.placeOrder();
  }
  else {
    const button = page.getByText(buttonText);
    await button.click();
  }
});

Then('I should see a payment page', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  
  const isPaymentPage = await page.getByText('Select a payment method').isVisible();
  expect(isPaymentPage, 'Order confirmation page should be displayed').toBeTruthy();
});

// Checkout verification steps
Then('I should see an order confirmation page', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  
  // Wait for order processing to complete
  await page.waitForTimeout(5000);
  
  const isConfirmationDisplayed = await checkoutPage.isOrderConfirmationDisplayed();
  expect(isConfirmationDisplayed, 'Order confirmation page should be displayed').toBeTruthy();
});

Then('I should receive an order confirmation email at {string}', async ({ page }, email) => {
  // This step would typically integrate with email verification service
  // For now, we'll just verify the email was used in the checkout process
  
  const checkoutPage = new CheckoutPage(page);
  
  // Check if there are any error messages
  const hasErrors = await checkoutPage.hasErrorMessages();
  if (hasErrors) {
    const errorMessage = await checkoutPage.getErrorMessage();
    console.log(`Checkout error: ${errorMessage}`);
  }
  
  expect(hasErrors, 'Checkout should complete without errors').toBeFalsy();
  
  // In a real test, you might:
  // 1. Check if order confirmation contains the email
  // 2. Integrate with email service API to verify email was sent
  // 3. Check order number was generated
  
  console.log(`Order confirmation email should be sent to: ${email}`);
});
