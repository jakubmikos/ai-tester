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
    }
}
