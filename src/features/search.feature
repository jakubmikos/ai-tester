@PerfectDraft @Search
Feature: Product Search
    As a customer
    I want to search for products
    So that I can quickly find what I'm looking for

Background:
    Given I navigate to the PerfectDraft website
    And I am on the UK website

@P1 @Search @Regression  
Scenario: Search for specific products
    When I enter "Stella" in the search box
    And I click the search button
    Then I should see search results containing "Stella" products
    And the results should include both kegs and bundles
    And I should be able to filter the search results
    When I enter "InvalidProductName123" in the search box
    And I click the search button
    Then I should see a "no results found" message
    And I should see suggestions for alternative searches
