@PerfectDraft @Checkout
Feature: Checkout Process
    As a customer
    I want to complete my purchase
    So that I can receive my products

Background:
    Given I navigate to the PerfectDraft website
    And I am on the UK website

@P1 @Checkout @Critical
Scenario: Incomplete (up to payment) checkout process as guest user
    Given I am not logged in
    When I navigate to the "Kegs" section
    And I add "PerfectDraft Stella Artois 6L Keg" to the cart
    And I proceed to checkout
    And I select "Checkout as Guest" checkout option
    And I fill in guest checkout information with email "guest.user@example.com":
        | Field            | Value                    |
        | First Name      | Jane                     |
        | Last Name       | Smith                    |
        | Phone Number    | 7708900123         |
        | Address Line 1  | 123 Test Street         |
        | City            | London                  |
        | Postcode        | SW1A 1AA                |
    And I click "Continue to payment" button
    Then I should see a payment page
