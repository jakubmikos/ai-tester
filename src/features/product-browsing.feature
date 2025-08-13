@PerfectDraft @ProductBrowsing
Feature: Product Browsing
    As a potential customer
    I want to browse PerfectDraft products
    So that I can find the right products for my needs

Background:
    Given I navigate to the PerfectDraft website
    And I am on the UK website

@P1 @ProductBrowsing @Smoke  
Scenario: Browse beer kegs catalog
    When I navigate to the "Beer Kegs" section
    Then I should see a list of available beer kegs
    And each keg should display basic information
    And I should be able to filter by beer type
    And I should be able to sort by price or popularity

@P1 @ProductBrowsing @Smoke
Scenario: View PerfectDraft machine options
    When I navigate to the "PerfectDraft Machines" section
    Then I should see all machine types:
        | Machine Type      |
        | PerfectDraft      |
        | PerfectDraft Pro  |
        | PerfectDraft Black|
    When I click on a machine to view details
    Then I should see machine specifications including keg size

@P1 @ProductDetails @Regression
Scenario: View detailed product information
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

@P2 @PromotionalOffers @Regression
Scenario: View promotional keg packs
    When I navigate to promotional keg packs
    Then I should see current offers like "Match Day Keg Pack"
    And I should see pricing options:
        | Pack Size | Price   |
        | 2 kegs    | £60.00  |
        | 3 kegs    | £85.00  |
    When I select "3 kegs for £85.00" keg pack
    Then I should be able to choose from available keg options
    And I should see the discount calculation
    And promotional terms should be clearly displayed