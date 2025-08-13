// src/config/environments.js

/**
 * Environment-specific configurations
 * Manages different test environments (local, staging, production)
 */

const environments = {
  // Local development environment
  local: {
    name: 'Local',
    baseUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:3001/api',
    timeout: 60000,
    retries: 0,
    headless: false,
    slowMo: 100,
    features: {
      checkout: true,
      userAccount: true,
      beerTokens: false // Might not be available locally
    }
  },

  // Staging environment
  staging: {
    name: 'Staging',
    baseUrl: 'https://staging.perfectdraft.com',
    apiUrl: 'https://staging-api.perfectdraft.com/api',
    timeout: 30000,
    retries: 1,
    headless: true,
    slowMo: 0,
    features: {
      checkout: true,
      userAccount: true,
      beerTokens: true
    },
    auth: {
      username: process.env.STAGING_USERNAME,
      password: process.env.STAGING_PASSWORD
    }
  },

  // Production environment
  production: {
    name: 'Production',
    baseUrl: 'https://www.perfectdraft.com',
    apiUrl: 'https://api.perfectdraft.com/api',
    timeout: 30000,
    retries: 2,
    headless: true,
    slowMo: 0,
    features: {
      checkout: true,
      userAccount: true,
      beerTokens: true
    },
    restrictions: {
      noRealOrders: true, // Don't complete real orders in production
      readOnly: false, // Can add to cart but not complete checkout
      maxCartValue: 100 // Limit cart value for safety
    }
  },

  // CI/CD environment
  ci: {
    name: 'CI',
    baseUrl: process.env.CI_BASE_URL || 'https://www.perfectdraft.com',
    apiUrl: process.env.CI_API_URL || 'https://api.perfectdraft.com/api',
    timeout: 60000,
    retries: 2,
    headless: true,
    slowMo: 0,
    workers: 1, // Single worker in CI
    features: {
      checkout: false, // Don't run checkout in CI
      userAccount: false,
      beerTokens: false
    },
    reporting: {
      screenshots: true,
      videos: true,
      traces: true
    }
  }
};

/**
 * Get environment configuration
 * @param {string} envName - Environment name
 * @returns {Object} Environment configuration
 */
function getEnvironment(envName = process.env.TEST_ENV || 'production') {
  const env = environments[envName.toLowerCase()];
  
  if (!env) {
    console.warn(`Environment "${envName}" not found, using production`);
    return environments.production;
  }
  
  return env;
}

/**
 * Get current environment name
 * @returns {string} Environment name
 */
function getCurrentEnvironment() {
  return process.env.TEST_ENV || 'production';
}

/**
 * Check if feature is enabled in current environment
 * @param {string} feature - Feature name
 * @returns {boolean} True if feature is enabled
 */
function isFeatureEnabled(feature) {
  const env = getEnvironment();
  return env.features && env.features[feature] === true;
}

/**
 * Get environment-specific timeout
 * @param {string} type - Timeout type
 * @returns {number} Timeout in milliseconds
 */
function getEnvironmentTimeout(type = 'default') {
  const env = getEnvironment();
  const baseTimeout = env.timeout || 30000;
  
  const timeoutMultipliers = {
    default: 1,
    action: 0.5,
    navigation: 1.5,
    api: 2
  };
  
  const multiplier = timeoutMultipliers[type] || 1;
  return Math.floor(baseTimeout * multiplier);
}

/**
 * Should skip test based on environment
 * @param {string} testType - Type of test
 * @returns {boolean} True if test should be skipped
 */
function shouldSkipTest(testType) {
  const env = getEnvironment();
  
  // Skip checkout tests in CI
  if (env.name === 'CI' && testType === 'checkout') {
    return true;
  }
  
  // Skip real order tests in production
  if (env.name === 'Production' && testType === 'realOrder') {
    return true;
  }
  
  // Skip user account tests if feature is disabled
  if (testType === 'userAccount' && !isFeatureEnabled('userAccount')) {
    return true;
  }
  
  return false;
}

/**
 * Get base URL for current environment with country path
 * @param {string} countryCode - Country code
 * @returns {string} Full URL with country path
 */
function getEnvironmentUrl(countryCode = 'GB') {
  const env = getEnvironment();
  const baseUrl = env.baseUrl;
  
  const countryPaths = {
    GB: '/en-gb',
    DE: '/de-de',
    FR: '/fr-fr',
    BE: '/nl-be',
    NL: '/nl-nl',
    IE: '/en-ie'
  };
  
  const path = countryPaths[countryCode] || countryPaths.GB;
  return `${baseUrl}${path}`;
}

module.exports = {
  environments,
  getEnvironment,
  getCurrentEnvironment,
  isFeatureEnabled,
  getEnvironmentTimeout,
  shouldSkipTest,
  getEnvironmentUrl
};