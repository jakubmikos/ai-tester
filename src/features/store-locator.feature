@PerfectDraft @StoreLocator
Feature: Store Locator
    As a customer
    I want to find nearby Community Stores
    So that I can visit them for products and services

Background:
    Given I navigate to the PerfectDraft website
    And I am on the UK website

@P3 @CommunityStore @Regression
Scenario: Find Community Store locations
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