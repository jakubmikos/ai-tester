using Microsoft.Playwright;
using PerfectDraftTests.PageObjects;
using PerfectDraftTests.Support;
using Reqnroll;
using FluentAssertions;

namespace PerfectDraftTests.StepDefinitions
{
    [Binding]
    public class NavigationSteps : StepDefinitionBase
    {
        private HomePage? _homePage;

        public NavigationSteps(ScenarioContext scenarioContext) : base(scenarioContext)
        {
        }

        [Given(@"I navigate to the PerfectDraft website")]
        public async Task GivenINavigateToThePerfectDraftWebsite()
        {
            _homePage = new HomePage(Page);
            await _homePage.NavigateToUKWebsite();
        }

        [Given(@"I am on the UK website")]
        public async Task GivenIAmOnTheUKWebsite()
        {
            _homePage = new HomePage(Page);
            await _homePage.NavigateToUKWebsite();

            ScenarioContext.Set(_homePage, "HomePage");
        }

        [When(@"I view the main navigation menu")]
        public async Task WhenIViewTheMainNavigationMenu()
        {
            _homePage.Should().NotBeNull("HomePage should be initialized");
            var isVisible = await _homePage!.IsNavigationMenuVisible();
            isVisible.Should().BeTrue("Main navigation menu should be visible");
        }

        [Then(@"I should see navigation options:")]
        public async Task ThenIShouldSeeNavigationOptions(Table table)
        {
            _homePage.Should().NotBeNull("HomePage should be initialized");

            foreach (var row in table.Rows)
            {
                var menuItem = row["Menu Item"];
                var isVisible = await _homePage!.IsMenuItemVisible(menuItem);
                isVisible.Should().BeTrue($"Menu item '{menuItem}' should be visible in navigation");
            }
        }

        [Then(@"the search functionality should be available")]
        public async Task ThenTheSearchFunctionalityShouldBeAvailable()
        {
            _homePage.Should().NotBeNull("HomePage should be initialized");
            var isAvailable = await _homePage!.IsSearchFunctionalityAvailable();
            isAvailable.Should().BeTrue("Search functionality should be available");
        }

        [Then(@"the cart icon should show ""([^""]*)"" items")]
        public async Task ThenTheCartIconShouldShowItems(string expectedCount)
        {
            _homePage.Should().NotBeNull("HomePage should be initialized");

            var isCartVisible = await _homePage!.IsCartIconVisible();
            isCartVisible.Should().BeTrue("Cart icon should be visible");

            var actualCount = await _homePage.GetCartItemCount();
            actualCount.Should().Be(expectedCount, $"Cart should show {expectedCount} items");
        }

        [When(@"I look for ""([^""]*)"" in the footer")]
        public async Task WhenILookForInTheFooter(string linkText)
        {
            _homePage.Should().NotBeNull("HomePage should be initialized");
            var isLinkFound = await _homePage!.IsFooterLinkVisible(linkText);
            isLinkFound.Should().BeTrue($"Link '{linkText}' should be visible in the footer");
        }

        [When(@"I click on ""([^""]*)"" in the footer")]
        public async Task WhenIClickOnInTheFooter(string linkText)
        {
            _homePage.Should().NotBeNull("HomePage should be initialized");
            await _homePage!.ClickFooterLink(linkText);
        }

        [When(@"I click on ""([^""]*)""")]
        public async Task WhenIClickOn(string linkText)
        {
            _homePage.Should().NotBeNull("HomePage should be initialized");
            await _homePage!.ClickFooterLink(linkText);
        }

        [Then(@"I should be on the ""([^""]*)"" page")]
        public async Task ThenIShouldBeOnThePage(string expectedPageTitle)
        {
            await Page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);
            
            // Check URL contains relevant keywords
            var currentUrl = Page.Url;
            var normalizedPageTitle = expectedPageTitle.ToLower().Replace(" ", "-");
            currentUrl.Should().Contain(normalizedPageTitle, $"Current URL should contain '{normalizedPageTitle}' for the '{expectedPageTitle}' page");
        }

        [Then(@"I should see company information content")]
        public async Task ThenIShouldSeeCompanyInformationContent()
        {
            // Wait for page to load
            await Page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);
            
            // Check for typical company information content indicators
            var contentIndicators = new[]
            {
                "about", "company", "information", "business", "story", "mission", "vision"
            };

            var hasCompanyContent = false;
            foreach (var indicator in contentIndicators)
            {
                try
                {
                    var element = await Page.QuerySelectorAsync($"text=/{indicator}/i");
                    if (element != null && await element.IsVisibleAsync())
                    {
                        hasCompanyContent = true;
                        break;
                    }
                }
                catch
                {
                    continue;
                }
            }

            hasCompanyContent.Should().BeTrue("Page should contain company information content");
        }

        [Then(@"the page should have proper navigation back to main site")]
        public async Task ThenThePageShouldHaveProperNavigationBackToMainSite()
        {
            // Check for navigation elements back to main site
            var navigationSelectors = new[]
            {
                "a[href*='perfectdraft.com']",
                "text=/home/i", 
                "text=/back/i",
                ".logo",
                "[class*='logo']",
                "a[href='/']",
                "a[href='/en-gb']"
            };

            var hasNavigation = false;
            foreach (var selector in navigationSelectors)
            {
                try
                {
                    var element = await Page.QuerySelectorAsync(selector);
                    if (element != null && await element.IsVisibleAsync())
                    {
                        hasNavigation = true;
                        break;
                    }
                }
                catch
                {
                    continue;
                }
            }

            hasNavigation.Should().BeTrue("Page should have proper navigation back to main site");
        }
    }
}
