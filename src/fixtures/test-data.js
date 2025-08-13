// src/fixtures/test-data.js

/**
 * Test Data Management
 * Centralized test data for all scenarios
 */

const testData = {
  // User accounts
  users: {
    guest: {
      email: 'guest.user@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+44 7700 900123'
    },
    registered: {
      email: 'test.user@example.com',
      password: 'SecurePassword123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+44 7700 900456'
    },
    newUser: {
      email: () => `test_${Date.now()}@example.com`, // Dynamic email generation
      password: 'NewUser123!',
      firstName: 'Alice',
      lastName: 'Johnson',
      dateOfBirth: '15/06/1990',
      phone: '+44 7700 900789'
    }
  },

  // Shipping addresses
  addresses: {
    uk: {
      addressLine1: '123 Test Street',
      addressLine2: '',
      city: 'London',
      county: 'Greater London',
      postcode: 'SW1A 1AA',
      country: 'United Kingdom'
    },
    scotland: {
      addressLine1: '456 Royal Mile',
      addressLine2: 'Old Town',
      city: 'Edinburgh',
      county: 'Midlothian',
      postcode: 'EH1 1RF',
      country: 'United Kingdom'
    },
    invalid: {
      addressLine1: '999 Fake Street',
      city: 'NoCity',
      postcode: 'INVALID'
    }
  },

  // Payment methods
  payment: {
    validCard: {
      cardNumber: '4532123456789012',
      expiryDate: '12/25',
      cvv: '123',
      cardholderName: 'Jane Smith'
    },
    validCardAlternative: {
      cardNumber: '5500005555555559', // Mastercard test number
      expiryDate: '03/26',
      cvv: '321',
      cardholderName: 'John Doe'
    },
    invalidCard: {
      cardNumber: '4111111111111112', // Invalid card number
      expiryDate: '01/20', // Expired
      cvv: '999',
      cardholderName: 'Invalid User'
    }
  },

  // Products
  products: {
    kegs: {
      stellaArtois: {
        name: 'Stella Artois 6L Keg',
        searchName: 'Stella Artois',
        price: '£32.50',
        abv: '4.6%',
        volume: '6L',
        category: 'Lager'
      },
      camdenHells: {
        name: 'Camden Hells 6L Keg',
        searchName: 'Camden Hells',
        price: '£34.00',
        abv: '4.6%',
        volume: '6L',
        category: 'Lager'
      },
      corona: {
        name: 'Corona Extra 6L Keg',
        searchName: 'Corona',
        price: '£35.00',
        abv: '4.5%',
        volume: '6L',
        category: 'Lager'
      },
      budweiser: {
        name: 'Budweiser 6L Keg',
        searchName: 'Budweiser',
        price: '£30.00',
        abv: '4.5%',
        volume: '6L',
        category: 'Lager'
      }
    },
    machines: {
      standard: {
        name: 'PerfectDraft',
        price: '£249.00',
        features: ['Temperature control', 'Freshness indicator', '30-day freshness']
      },
      pro: {
        name: 'PerfectDraft Pro',
        price: '£349.00',
        features: ['Enhanced cooling', 'Premium design', 'App connectivity']
      },
      black: {
        name: 'PerfectDraft Black',
        price: '£299.00',
        features: ['Black finish', 'Premium feel', 'Temperature control']
      }
    },
    bundles: {
      starter: {
        name: 'Starter Bundle',
        includes: ['PerfectDraft Machine', '2 Kegs'],
        price: '£299.00',
        savings: '£15.00'
      },
      premium: {
        name: 'Premium Bundle',
        includes: ['PerfectDraft Pro', '3 Kegs'],
        price: '£449.00',
        savings: '£30.00'
      }
    }
  },

  // Promotional offers
  promotions: {
    matchDayPack: {
      name: 'Match Day Keg Pack',
      options: [
        { size: '2 kegs', price: '£60.00', savings: '£5.00' },
        { size: '3 kegs', price: '£85.00', savings: '£12.00' }
      ]
    },
    summerBundle: {
      name: 'Summer Bundle',
      description: 'Perfect for summer BBQs',
      discount: '15%'
    }
  },

  // Store locator
  stores: {
    postcodes: {
      london: 'SW1A 1AA',
      manchester: 'M1 1AE',
      birmingham: 'B1 1AA',
      edinburgh: 'EH1 1RF',
      invalid: 'XXX XXX'
    },
    expectedStores: {
      london: ['London Central', 'Westminster Store', 'Chelsea Store'],
      manchester: ['Manchester City Centre', 'Old Trafford Store']
    }
  },

  // Search terms
  searchTerms: {
    valid: ['Stella', 'Camden', 'Lager', 'Machine', 'Bundle'],
    invalid: ['InvalidProductName123', 'XXXYYY', 'NonExistentBeer'],
    popular: ['Stella Artois', 'PerfectDraft Machine', 'Keg Pack']
  },

  // Countries and locales
  countries: {
    'United Kingdom': {
      code: 'GB',
      path: '/en-gb',
      currency: 'GBP',
      currencySymbol: '£',
      language: 'English',
      locale: 'en-GB'
    },
    'Deutschland': {
      code: 'DE',
      path: '/de-de',
      currency: 'EUR',
      currencySymbol: '€',
      language: 'German',
      locale: 'de-DE'
    },
    'France': {
      code: 'FR',
      path: '/fr-fr',
      currency: 'EUR',
      currencySymbol: '€',
      language: 'French',
      locale: 'fr-FR'
    },
    'België': {
      code: 'BE',
      path: '/nl-be',
      currency: 'EUR',
      currencySymbol: '€',
      language: 'Dutch',
      locale: 'nl-BE'
    },
    'Nederland': {
      code: 'NL',
      path: '/nl-nl',
      currency: 'EUR',
      currencySymbol: '€',
      language: 'Dutch',
      locale: 'nl-NL'
    }
  },

  // Beer tokens
  beerTokens: {
    returnValue: '£5.00',
    purchaseReward: '5%',
    expirationPeriod: '6 months',
    testBalances: ['£0.00', '£5.00', '£10.00', '£15.00', '£20.00']
  },

  // Order details
  orders: {
    deliveryOptions: {
      standard: {
        name: 'Standard Delivery',
        cost: '£4.99',
        duration: '3-5 business days'
      },
      express: {
        name: 'Express Delivery',
        cost: '£9.99',
        duration: '1-2 business days'
      },
      free: {
        name: 'Free Delivery',
        cost: '£0.00',
        minOrder: '£50.00',
        duration: '3-5 business days'
      }
    }
  },

  // Test utilities
  utils: {
    /**
     * Generate a unique email address
     * @param {string} prefix - Email prefix
     * @returns {string} Unique email
     */
    generateEmail: (prefix = 'test') => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      return `${prefix}_${timestamp}_${random}@example.com`;
    },

    /**
     * Generate a unique phone number
     * @returns {string} UK phone number
     */
    generatePhone: () => {
      const random = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
      return `+44 77${random}`;
    },

    /**
     * Get future date in DD/MM/YYYY format
     * @param {number} daysFromNow - Days to add
     * @returns {string} Formatted date
     */
    getFutureDate: (daysFromNow = 30) => {
      const date = new Date();
      date.setDate(date.getDate() + daysFromNow);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },

    /**
     * Get random item from array
     * @param {Array} array - Array to pick from
     * @returns {*} Random item
     */
    getRandomItem: (array) => {
      return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Wait for specified time
     * @param {number} ms - Milliseconds to wait
     * @returns {Promise} Promise that resolves after timeout
     */
    wait: (ms) => new Promise(resolve => setTimeout(resolve, ms))
  }
};

module.exports = testData;