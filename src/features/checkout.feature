@PerfectDraft @Checkout
Feature: Checkout Process
    As a customer
    I want to complete my purchase
    So that I can receive my products

Background:
    Given I navigate to the PerfectDraft website
    And I am on the UK website

@P1 @Checkout @Critical
Scenario: Complete checkout process as guest user
    Given I am not logged in
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