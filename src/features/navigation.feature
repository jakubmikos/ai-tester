@PerfectDraft @Navigation
Feature: Website Navigation
    As a beer enthusiast
    I want to navigate the PerfectDraft website easily
    So that I can find products and information quickly

Background:
    Given I navigate to the PerfectDraft website

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