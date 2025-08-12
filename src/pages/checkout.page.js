// src/pages/checkout.page.js
const BasePage = require('./base.page');

/**
 * Checkout Page Object
 * Handles the entire checkout process including guest checkout and payment
 */
class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Checkout page selectors
    this.selectors = {
      // Guest checkout
      emailInput: 'input[type="email"], input[name*="email"], #customer-email',
      noPasswordOption: 'label:has-text("No Password"), span:has-text("No Password")',
      continueButton: 'button[type="submit"], button.action.primary, button:has-text("Continue")',
      
      // Shipping form
      firstNameInput: 'input[name*="firstname"], #shipping-new-address-form input[name="firstname"]',
      lastNameInput: 'input[name*="lastname"], #shipping-new-address-form input[name="lastname"]',
      phoneInput: 'input[name*="telephone"], input[type="tel"], #shipping-new-address-form input[name="telephone"]',
      streetInput: 'input[name*="street"], #shipping-new-address-form input[name="street[0]"]',
      cityInput: 'input[name*="city"], #shipping-new-address-form input[name="city"]',
      postcodeInput: 'input[name*="postcode"], #shipping-new-address-form input[name="postcode"]',
      
      // Delivery options
      standardDeliveryOption: 'input[value*="standard"], label:has-text("Standard"), input[name*="shipping_method"]:first-child',
      
      // Payment selectors
      paymentMethodRadio: 'input[name="payment[method]"], .payment-method input[type="radio"]',
      cardNumberInput: 'input[name*="card_number"], #card_number, iframe[name*="card"]',
      expiryInput: 'input[name*="expiry"], #expiry_date',
      cvvInput: 'input[name*="cvv"], #cvv',
      cardholderInput: 'input[name*="cardholder"], #cardholder_name',
      
      // Age verification
      ageVerificationCheckbox: 'input[type="checkbox"][name*="age"], input[id*="age-verification"], label:has-text("18")',
      
      // Order placement
      placeOrderButton: 'button.checkout, button:has-text("Place Order"), button[title="Place Order"]',
      
      // Confirmation page
      orderConfirmationMessage: '.checkout-success, .order-success, h1:has-text("Thank you")',
      orderNumber: '.order-number, .checkout-success .order-number',
      
      // Common checkout containers
      checkoutContainer: '.checkout-container, #checkout, .opc-wrapper',
      
      // Error messages
      errorMessage: '.error-message, .field-error, .mage-error',
      
      // Loading indicators
      loadingIndicator: '.loading-mask, .loader, .spinner'
    };
  }

  /**
   * Check if we're on checkout page
   * @returns {Promise<boolean>}
   */
  async isOnCheckoutPage() {
    try {
      // Check for checkout URL
      const url = this.getCurrentUrl();
      if (url.includes('checkout') || url.includes('onepage')) {
        return true;
      }
      
      // Check for checkout-specific elements
      const hasCheckoutElements = await this.getElementCount(this.selectors.checkoutContainer) > 0;
      return hasCheckoutElements;
    } catch {
      return false;
    }
  }

  /**
   * Select guest checkout and enter email
   * @param {string} email - Guest email address
   */
  async selectGuestCheckout(email) {
    // Enter email
    await this.waitForElement(this.selectors.emailInput, 10000);
    await this.type(this.selectors.emailInput, email);
    
    // Click "No Password" option for guest checkout
    try {
      await this.clickByText('No Password');
      console.log('Clicked "No Password" option');
    } catch {
      // Some sites might not have explicit "No Password" option
      console.log('No explicit "No Password" option found, proceeding as guest');
    }
    
    // Continue to shipping - try multiple possible continue buttons
    await this.clickContinueButton();
  }

  /**
   * Click continue button with multiple fallbacks
   */
  async clickContinueButton() {
    const continueSelectors = [
      this.selectors.continueButton,
      'button:has-text("Next")',
      'button.primary',
      '.action.continue',
      'button[type="submit"]'
    ];

    for (const selector of continueSelectors) {
      try {
        const element = this.page.locator(selector);
        if (await element.isVisible()) {
          await element.click();
          console.log(`Clicked continue button with selector: ${selector}`);
          return;
        }
      } catch {
        continue;
      }
    }
    
    console.log('No continue button found - form might proceed automatically');
  }

  /**
   * Fill shipping address form
   * @param {Object} shippingInfo - Shipping information object
   */
  async fillShippingAddress(shippingInfo) {
    const {
      firstName,
      lastName,
      phone,
      addressLine1,
      city,
      postcode
    } = shippingInfo;

    try {
      // Wait for shipping form to be visible
      await this.waitForElement(this.selectors.firstNameInput, 10000);

      // Fill shipping form fields
      if (firstName) {
        await this.type(this.selectors.firstNameInput, firstName);
      }
      
      if (lastName) {
        await this.type(this.selectors.lastNameInput, lastName);
      }
      
      if (phone) {
        await this.type(this.selectors.phoneInput, phone);
      }
      
      if (addressLine1) {
        await this.type(this.selectors.streetInput, addressLine1);
      }
      
      if (city) {
        await this.type(this.selectors.cityInput, city);
      }
      
      if (postcode) {
        await this.type(this.selectors.postcodeInput, postcode);
      }

      console.log('Shipping address filled successfully');
    } catch (error) {
      throw new Error(`Failed to fill shipping address: ${error.message}`);
    }
  }

  /**
   * Select delivery option
   * @param {string} deliveryOption - Delivery option (e.g., 'Standard Delivery')
   */
  async selectDeliveryOption(deliveryOption = 'Standard Delivery') {
    try {
      if (deliveryOption.toLowerCase().includes('standard')) {
        // Try to select standard delivery
        const standardOption = this.page.locator(this.selectors.standardDeliveryOption);
        if (await standardOption.count() > 0) {
          await standardOption.first().check();
          console.log('Selected standard delivery');
          return;
        }
      }

      // Fallback: try to find delivery option by text
      const deliveryRadio = this.page.getByText(deliveryOption).locator('..').locator('input[type="radio"]');
      if (await deliveryRadio.count() > 0) {
        await deliveryRadio.first().check();
        console.log(`Selected delivery option: ${deliveryOption}`);
      }
    } catch (error) {
      console.error(`Failed to select delivery option: ${error.message}`);
    }
  }

  /**
   * Fill payment details
   * @param {Object} paymentInfo - Payment information object
   */
  async fillPaymentDetails(paymentInfo) {
    const {
      cardNumber = '4532123456789012',
      expiryDate = '12/25',
      cvv = '123',
      cardholderName = 'John Doe'
    } = paymentInfo;

    try {
      // Wait for payment section
      await this.page.waitForTimeout(2000);

      // Handle card number (might be in iframe)
      await this.fillCardNumber(cardNumber);

      // Fill expiry date
      await this.fillCardExpiry(expiryDate);

      // Fill CVV
      await this.fillCardCVV(cvv);

      // Fill cardholder name
      await this.fillCardholderName(cardholderName);

      console.log('Payment details filled successfully');
    } catch (error) {
      throw new Error(`Failed to fill payment details: ${error.message}`);
    }
  }

  /**
   * Fill card number (handles iframes)
   * @param {string} cardNumber - Card number
   */
  async fillCardNumber(cardNumber) {
    try {
      // First try direct input
      const cardInput = this.page.locator(this.selectors.cardNumberInput);
      if (await cardInput.count() > 0) {
        await cardInput.fill(cardNumber);
        return;
      }

      // Try iframe approach
      const iframe = this.page.frameLocator('iframe[name*="card"]');
      const cardFieldInIframe = iframe.locator('input[name*="card"], #card_number');
      await cardFieldInIframe.fill(cardNumber);
    } catch (error) {
      console.error('Error filling card number:', error.message);
    }
  }

  /**
   * Fill card expiry date
   * @param {string} expiryDate - Expiry date (MM/YY format)
   */
  async fillCardExpiry(expiryDate) {
    try {
      const expiryInput = this.page.locator(this.selectors.expiryInput);
      if (await expiryInput.count() > 0) {
        await expiryInput.fill(expiryDate);
      }
    } catch (error) {
      console.error('Error filling expiry date:', error.message);
    }
  }

  /**
   * Fill card CVV
   * @param {string} cvv - CVV code
   */
  async fillCardCVV(cvv) {
    try {
      const cvvInput = this.page.locator(this.selectors.cvvInput);
      if (await cvvInput.count() > 0) {
        await cvvInput.fill(cvv);
      }
    } catch (error) {
      console.error('Error filling CVV:', error.message);
    }
  }

  /**
   * Fill cardholder name
   * @param {string} cardholderName - Cardholder name
   */
  async fillCardholderName(cardholderName) {
    try {
      const cardholderInput = this.page.locator(this.selectors.cardholderInput);
      if (await cardholderInput.count() > 0) {
        await cardholderInput.fill(cardholderName);
      }
    } catch (error) {
      console.error('Error filling cardholder name:', error.message);
    }
  }

  /**
   * Confirm age verification (18+)
   */
  async confirmAgeVerification() {
    try {
      const ageCheckbox = this.page.locator(this.selectors.ageVerificationCheckbox);
      if (await ageCheckbox.count() > 0) {
        await ageCheckbox.check();
        console.log('Age verification confirmed');
      }
    } catch (error) {
      console.error('Error confirming age verification:', error.message);
    }
  }

  /**
   * Place the order
   */
  async placeOrder() {
    try {
      // Wait for any loading to complete
      await this.waitForLoadingToComplete();

      // Click place order button
      const placeOrderButton = this.page.locator(this.selectors.placeOrderButton);
      if (await placeOrderButton.isVisible()) {
        await placeOrderButton.click();
        console.log('Place order button clicked');
        
        // Wait for order processing
        await this.waitForOrderProcessing();
      } else {
        throw new Error('Place order button not found or not visible');
      }
    } catch (error) {
      throw new Error(`Failed to place order: ${error.message}`);
    }
  }

  /**
   * Wait for loading indicators to disappear
   */
  async waitForLoadingToComplete() {
    try {
      const loadingIndicator = this.page.locator(this.selectors.loadingIndicator);
      if (await loadingIndicator.count() > 0) {
        await loadingIndicator.waitFor({ state: 'hidden', timeout: 30000 });
      }
    } catch {
      // Loading indicator might not be present
    }
  }

  /**
   * Wait for order processing to complete
   */
  async waitForOrderProcessing() {
    try {
      // Wait for either success page or error message
      await this.page.waitForFunction(() => {
        return document.querySelector('.checkout-success, .order-success, .error-message, .mage-error') !== null;
      }, { timeout: 60000 });
    } catch {
      // Continue even if we can't detect completion
    }
  }

  /**
   * Check if order confirmation page is displayed
   * @returns {Promise<boolean>}
   */
  async isOrderConfirmationDisplayed() {
    try {
      const confirmationMessage = this.page.locator(this.selectors.orderConfirmationMessage);
      return await confirmationMessage.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get order number from confirmation page
   * @returns {Promise<string>}
   */
  async getOrderNumber() {
    try {
      const orderNumberElement = this.page.locator(this.selectors.orderNumber);
      if (await orderNumberElement.isVisible()) {
        const orderNumber = await orderNumberElement.textContent();
        return orderNumber?.trim() || '';
      }
      return '';
    } catch {
      return '';
    }
  }

  /**
   * Check for error messages
   * @returns {Promise<boolean>}
   */
  async hasErrorMessages() {
    try {
      const errorMessage = this.page.locator(this.selectors.errorMessage);
      return await errorMessage.count() > 0;
    } catch {
      return false;
    }
  }

  /**
   * Get error message text
   * @returns {Promise<string>}
   */
  async getErrorMessage() {
    try {
      const errorMessage = this.page.locator(this.selectors.errorMessage);
      if (await errorMessage.count() > 0) {
        const text = await errorMessage.first().textContent();
        return text?.trim() || '';
      }
      return '';
    } catch {
      return '';
    }
  }

  /**
   * Complete full guest checkout process
   * @param {Object} checkoutData - All checkout data
   */
  async completeGuestCheckout(checkoutData) {
    const {
      email,
      shippingInfo,
      deliveryOption = 'Standard Delivery',
      paymentInfo,
      confirmAge = true
    } = checkoutData;

    try {
      // Step 1: Guest checkout with email
      await this.selectGuestCheckout(email);
      await this.page.waitForTimeout(2000);

      // Step 2: Fill shipping address
      await this.fillShippingAddress(shippingInfo);
      await this.page.waitForTimeout(1000);

      // Step 3: Select delivery option
      await this.selectDeliveryOption(deliveryOption);
      await this.page.waitForTimeout(1000);

      // Step 4: Fill payment details
      await this.fillPaymentDetails(paymentInfo);
      await this.page.waitForTimeout(1000);

      // Step 5: Confirm age verification
      if (confirmAge) {
        await this.confirmAgeVerification();
      }

      // Step 6: Place order
      await this.placeOrder();

      console.log('Guest checkout completed successfully');
    } catch (error) {
      throw new Error(`Guest checkout failed: ${error.message}`);
    }
  }
}

module.exports = CheckoutPage;