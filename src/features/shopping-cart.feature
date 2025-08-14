@PerfectDraft @ShoppingCart
Feature: Shopping Cart Management
    As a customer
    I want to manage my shopping cart
    So that I can purchase the products I want

Background:
    Given I navigate to the PerfectDraft website
    And I am on the UK website

@P1 @ShoppingCart @Smoke
Scenario: Add products to shopping cart
    Given my cart is empty
    When I navigate to the "Kegs" section
    And I add "PerfectDraft Stella Artois 6L Keg" to the cart
    Then the cart should show quantity of at least "1"
    And I should see a confirmation message
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
    Given I have "Stella Artois 6L Keg" in my cart
    When I view my cart
    And I increase the quantity to "2"
    Then the cart should show quantity of at least "2"
    And the total price should be updated accordingly
    When I click "Remove" for the item
    Then the cart should be empty
    And the cart should show quantity "0"

@P1 @ShoppingCart @Smoke @NewProduct
Scenario: Add new Camden Hells keg to shopping cart
    Given my cart is empty
    When I navigate to the "Kegs" section
    And I add "Camden Hells 6L Keg" to the cart
    When I click on the cart icon
    Then I should see the cart contents with:
        | Cart Information |
        | Product name     |
        | Product image    |
        | Quantity         |
        | Unit price       |
        | Total price      |
    And the cart should show quantity of at least "1"
