@PerfectDraft @E2E
Feature: PerfectDraft Website Core Functionality
    As a beer enthusiast and potential customer
    I want to browse, purchase and manage PerfectDraft products
    So that I can enjoy the ultimate home beer experience

Background:
    Given I navigate to the PerfectDraft website

@P2 @UserAuthentication @Regression
Scenario Outline: User authentication with different email formats
    Given I am on the UK website
    And I have a registered account with email "<Email>"
    When I attempt to login with email "<Email>" and password "SecurePassword123"
    Then I should be logged in successfully
    And I should see my account dashboard
    
    Examples:
        | Email                        |
        | user@example.com            |
        | user.name@example.co.uk     |
        | user+tag@example.org        |
        | user123@test-domain.com     |

@P2 @BeerTokens @Regression  
Scenario Outline: Apply Beer Tokens during checkout for different users
    Given I am on the UK website
    And I am logged in with email "<Email>"
    And I have "<TokenAmount>" in Beer Tokens
    And I have "Stella Artois 6L Keg" priced at "£32.50" in my cart
    When I proceed to checkout
    Then I should see my Beer Token balance "<TokenAmount>"
    When I select "Apply Beer Tokens"
    And I choose to apply "<ApplyAmount>" tokens
    Then the order total should be reduced by "<ApplyAmount>"
    When I complete the checkout process
    Then I should receive an order confirmation email at "<Email>"
    
    Examples:
        | Email                  | TokenAmount | ApplyAmount |
        | user1@example.com     | £10.00      | £10.00      |
        | user2@example.com     | £15.00      | £10.00      |
        | user3@example.com     | £5.00       | £5.00       |

@P2 @EmailNotifications @Regression
Scenario Outline: Email notifications for different user actions
    Given I am on the UK website
    And I am logged in with email "<Email>"
    When I perform the action "<Action>"
    Then I should receive an email notification at "<Email>"
    And the email should contain "<EmailContent>"
    
    Examples:
        | Email                | Action              | EmailContent           |
        | user@example.com    | Complete order      | Order confirmation     |
        | user@example.com    | Initiate keg return | Return instructions    |
        | user@example.com    | Register account    | Email verification     |
        | user@example.com    | Reset password      | Password reset link    |

@P1 @CountrySelection @Smoke
Scenario: Select country from homepage
    When I am on the country selection page
    Then I should see the available regions "Europe" and "America"
    And I should see country options including "United Kingdom", "Deutschland", "United States"
    When I select country "United Kingdom"
    Then I should be redirected to the UK website
    And the currency should be displayed in "GBP"
    And the language should be "English"

@P1 @CountrySelection @Regression
Scenario Outline: Navigate to different country websites
    When I am on the country selection page
    And I select country "<Country>"
    Then I should be redirected to the "<Country>" website
    And the currency should be displayed in "<Currency>"
    And the language should be "<Language>"
    
    Examples:
        | Country       | Currency | Language |
        | United Kingdom| GBP      | English  |
        | Deutschland   | EUR      | German   |
        | France        | EUR      | French   |
        | United States | USD      | English  |

@P1 @Navigation @Smoke
Scenario: Main website navigation
    Given I am on the UK website
    When I view the main navigation menu
    Then I should see navigation options:
        | Menu Item                |
        | PerfectDraft Machines    |
        | Beer Kegs                |
        | Multibuy                 |
        | Keg Packs                |
        | Merchandise               |
        | Community Stores         |
        | Which machine            |
    And the search functionality should be available
    And the cart icon should show "0" items

@P1 @ProductBrowsing @Smoke  
Scenario: Browse beer kegs catalog
    Given I am on the UK website
    When I navigate to the "Beer Kegs" section
    Then I should see a list of available beer kegs
    And each keg should display basic information
    And I should be able to filter by beer type
    And I should be able to sort by price or popularity

@P1 @ProductBrowsing @Smoke
Scenario: View PerfectDraft machine options
    Given I am on the UK website  
    When I navigate to the "Machines" section
    Then I should see both machine types:
        | Machine Type     |
        | PerfectDraft     |
        | PerfectDraft Pro |
    And each machine should display specifications
    And I should see feature comparisons between Standard and Pro
    And bundle options should be available

@P1 @ProductDetails @Regression
Scenario: View detailed product information
    Given I am on the UK website
    When I navigate to the "Kegs" section
    And I click on a beer keg "Stella Artois 6L Keg"
    Then I should see the product detail page
    And I should see detailed product information:
        | Detail Type        |
        | Product images     |
        | Full description   |
        | ABV and volume     |
        | Price information  |
        | Stock availability |
        | Customer reviews   |
    And I should see an "Add to Cart" button
    And I should see related product recommendations

@P1 @Search @Regression  
Scenario: Search for specific products
    Given I am on the UK website
    When I enter "Stella" in the search box
    And I click the search button
    Then I should see search results containing "Stella" products
    And the results should include both kegs and bundles
    And I should be able to filter the search results
    When I enter "InvalidProductName123" in the search box
    And I click the search button
    Then I should see a "no results found" message
    And I should see suggestions for alternative searches

@P1 @ShoppingCart @Smoke
Scenario: Add products to shopping cart
    Given I am on the UK website
    And my cart is empty
    When I navigate to the "Kegs" section
    And I add "PerfectDraft Stella Artois 6L Keg" to the cart
#    Then the cart counter should show "1" item
#    And I should see a confirmation message
    When I click on the cart icon
    Then I should see the cart contents with:
        | Cart Information |
        | Product name     |
        | Product image    |
        | Quantity         |
        | Unit price       |
        | Total price      |

@P1 @ShoppingCart @Regression
Scenario: Modify cart contents
    Given I am on the UK website
    And I have "Stella Artois 6L Keg" in my cart
    When I view my cart
    And I increase the quantity to "2"
    Then the cart should show quantity "2"
    And the total price should be updated accordingly
    When I click "Remove" for the item
    Then the cart should be empty
    And the cart counter should show "0" items

@P1 @ShoppingCart @Regression  
Scenario: Add bundle products to cart
    Given I am on the UK website
    When I navigate to the "Bundles" section
    And I select a "PerfectDraft Machine Bundle"
    And I add the bundle to my cart
    Then the cart should contain all bundle items:
        | Bundle Contents    |
        | PerfectDraft Machine |
        | Beer keg           |
        | Glasses            |
    And the bundle discount should be applied
    And the total should reflect the bundle price

@P2 @UserRegistration @Smoke
Scenario: Register new user account
    Given I am on the UK website
    When I click on "Account" in the navigation
    And I click "Register"
    And I fill in the registration form with email "test.user@example.com":
        | Field                | Value                    |
        | Password            | SecurePassword123        |
        | Confirm Password    | SecurePassword123        |
        | First Name          | John                     |
        | Last Name           | Doe                      |
        | Date of Birth       | 15/06/1990              |
    And I accept the terms and conditions
    And I accept age verification (18+)
    And I click "Create Account"
    Then I should see a registration confirmation message
    And I should receive an email verification for "test.user@example.com"
    And I should be automatically logged in

@P1 @UserAuthentication @Smoke
Scenario: User login and logout
    Given I am on the UK website
    And I have a registered account with email "test.user@example.com"
    When I click on "Account" in the navigation
    And I click "Login"
    And I login with email "test.user@example.com" and password "SecurePassword123"
    Then I should be logged in successfully
    And I should see "Welcome John" in the account section
    When I click "Logout"
    Then I should be logged out
    And I should see the "Login" option again

@P1 @Checkout @Critical
Scenario: Complete checkout process as registered user
    Given I am on the UK website
    And I am logged in with email "test.user@example.com"
    And I have "Stella Artois 6L Keg" in my cart
    When I proceed to checkout
    Then I should see the checkout page with:
        | Section            |
        | Order summary      |
        | Shipping address   |
        | Delivery options   |
        | Payment method     |
    When I confirm my shipping address
    And I select "Standard Delivery"
    And I enter valid payment details:
        | Field            | Value            |
        | Card Number      | 4532123456789012 |
        | Expiry Date      | 12/25           |
        | CVV              | 123             |
        | Cardholder Name  | John Doe        |
    And I click "Place Order"
    Then I should see an order confirmation page
    And I should receive an order confirmation email at "test.user@example.com"
    And I should see an order tracking number

@P1 @Checkout @Critical
Scenario: Complete checkout process as guest user
    Given I am on the UK website
    And I am not logged in
    And I have "Stella Artois 6L Keg" in my cart
    When I proceed to checkout
    And I select "Checkout as Guest"
    And I fill in guest checkout information with email "guest.user@example.com":
        | Field            | Value                    |
        | First Name      | Jane                     |
        | Last Name       | Smith                    |
        | Phone Number    | +44 7700 900123         |
        | Address Line 1  | 123 Test Street         |
        | City            | London                  |
        | Postcode        | SW1A 1AA                |
    And I select "Standard Delivery"
    And I enter valid payment details
    And I confirm age verification (18+)
    And I click "Place Order"
    Then I should see an order confirmation page
    And I should receive an order confirmation email at "guest.user@example.com"

@P2 @BeerTokens @Regression
Scenario: View Beer Token information
    Given I am on the UK website
    And I am logged in as a registered user
    When I navigate to my account dashboard
    Then I should see my Beer Token balance
    And I should see information about earning tokens:
        | Earning Method           | Token Value |
        | Keg return              | £5.00       |
        | Purchase reward (5%)     | Variable    |
        | Guest order (3 days)     | Variable    |
    And I should see token expiration information "6 months"
    And I should see how to redeem tokens

@P2 @BeerTokens @Regression  
Scenario: Apply Beer Tokens during checkout
    Given I am on the UK website
    And I am logged in as a user with "£10.00" in Beer Tokens
    And I have "Stella Artois 6L Keg" priced at "£32.50" in my cart
    When I proceed to checkout
    Then I should see my Beer Token balance "£10.00"
    When I select "Apply Beer Tokens"
    And I choose to apply "£10.00" tokens
    Then the order total should be reduced by "£10.00"
    And my new total should be "£22.50"
    When I complete the checkout process
    Then my Beer Token balance should be "£0.00"

@P2 @KegReturns @Regression
Scenario: Initiate keg return process
    Given I am on the UK website  
    And I am logged in as a registered user
    When I navigate to "Keg Returns" section
    And I click "Return Kegs"
    Then I should see the keg return options:
        | Return Method      |
        | Courier Collection |
        | Community Store    |
    When I select "Courier Collection"
    And I specify "2" kegs to return
    And I confirm my collection address
    Then I should be able to generate return labels
    And I should see the estimated Beer Token credit "£10.00"
    And I should receive return instructions

@P3 @CommunityStore @Regression
Scenario: Find Community Store locations
    Given I am on the UK website
    When I navigate to "Community Store Network"
    And I enter postcode "SW1A 1AA"
    And I click "Find Stores"
    Then I should see a list of nearby Community Stores
    And each store should show:
        | Store Information |
        | Store name        |
        | Address           |
        | Distance          |
        | Opening hours     |
        | Available services|
    And I should be able to get directions to selected stores

@P2 @Bundles @Regression
Scenario: View and select bundle options
    Given I am on the UK website
    When I navigate to "Bundles" section
    Then I should see available bundle types:
        | Bundle Type                    |
        | PerfectDraft Machine Bundle    |
        | PerfectDraft Pro Bundle        |
        | Match Day Keg Pack            |
        | Seasonal Keg Packs            |
    When I select "PerfectDraft Pro Bundle"
    Then I should see bundle contents clearly listed
    And I should see bundle price vs individual prices
    And I should see savings amount
    And bundle customization options should be available

@P2 @PromotionalOffers @Regression
Scenario: View promotional keg packs
    Given I am on the UK website
    When I navigate to promotional keg packs
    Then I should see current offers like "Match Day Keg Pack"
    And I should see pricing options:
        | Pack Size | Price   |
        | 2 kegs    | £60.00  |
        | 3 kegs    | £85.00  |
    When I select "3 kegs for £85.00"
    Then I should be able to choose from available keg options
    And I should see the discount calculation
    And promotional terms should be clearly displayed

@P2 @OrderHistory @Regression
Scenario: View order history as registered user
    Given I am on the UK website
    And I am logged in as a user with previous orders
    When I navigate to "My Orders" in my account
    Then I should see a list of my previous orders
    And each order should display:
        | Order Information |
        | Order number      |
        | Order date        |
        | Order total       |
        | Order status      |
        | Tracking info     |
    When I click on an order
    Then I should see detailed order information
    And I should be able to track the shipment
    And I should have options to reorder or contact support

@P1 @ResponsiveDesign @CrossBrowser
Scenario Outline: Responsive design functionality
    Given I am on the UK website
    When I access the site on "<Device>"
    Then the layout should be optimized for "<Device>"
    And all navigation elements should be accessible
    And the shopping cart functionality should work
    And the checkout process should be functional
    And text should be readable without zooming
    
    Examples:
        | Device          |
        | Mobile Phone    |
        | Tablet          |
        | Desktop         |

@P1 @Performance @NonFunctional
Scenario: Website performance requirements
    Given I am on the UK website
    When I navigate to any page
    Then the page should load within "3" seconds
    And images should load progressively
    And the shopping cart should respond within "1" second
    And the search functionality should return results within "2" seconds

@P2 @Accessibility @NonFunctional  
Scenario: Basic accessibility compliance
    Given I am on the UK website
    When I navigate through the site using keyboard only
    Then all interactive elements should be accessible
    And focus indicators should be clearly visible
    And alt text should be provided for all images
    And color contrast should meet accessibility standards
    And screen reader compatibility should be maintained

@P1 @ErrorHandling @Edge
Scenario Outline: Handle common error scenarios
    Given I am on the UK website
    When I encounter the scenario "<Error Scenario>"
    Then I should see an appropriate error message
    And I should have options to recover or get help
    And the error should be logged for support purposes
    
    Examples:
        | Error Scenario              |
        | Page not found (404)        |
        | Server error (500)          |
        | Network connection timeout  |
        | Payment processing failure  |
        | Out of stock during checkout|

@P2 @DataValidation @Security
Scenario Outline: Form validation and security
    Given I am on the UK website
    When I attempt to register with email "<Email>" and invalid data:
        | Invalid Data Type    | Value           |
        | Invalid email format | <Email>         |
        | Weak password        | 123             |
        | Underage date        | 15/06/2010      |
        | Missing required fields | <empty>      |
    Then I should see appropriate validation messages
    And the form should not submit
    And security measures should prevent malicious input
    And sensitive data should be properly encrypted
    
    Examples:
        | Email                    |
        | invalid-email           |
        | @example.com            |
        | user@                   |
        | user..name@example.com  |

@P1 @ShoppingCart @Smoke @NewProduct
Scenario: Add new BrewDog keg to shopping cart
    Given I am on the UK website
    And my cart is empty
    When I navigate to the "Kegs" section
    And I add "BrewDog Punk IPA 6L Keg" to the cart
    When I click on the cart icon
    Then I should see the cart contents with:
        | Cart Information |
        | Product name     |
        | Product image    |
        | Quantity         |
        | Unit price       |
        | Total price      |
    And the cart counter should show "1" item
