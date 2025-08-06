using PerfectDraftTests.PageObjects;
using Reqnroll;
using FluentAssertions;

namespace PerfectDraftTests.StepDefinitions
{
    [Binding]
    public class ProductBrowsingSteps : StepDefinitionBase
    {
        public ProductBrowsingSteps(ScenarioContext scenarioContext) : base(scenarioContext)
        {
        }

        [When(@"I navigate to the ""([^""]*)"" section")]
        public async Task WhenINavigateToTheSection(string sectionName)
        {
            // Navigate to the specified section
            await this.HomePage.NavigateToSection(sectionName);
        }

        [Then(@"I should see a list of available beer kegs")]
        public async Task ThenIShouldSeeAListOfAvailableBeerKegs()
        {
            Console.WriteLine("Waiting for beer kegs list to load...");

            // Use Playwright's built-in waiting - these methods now handle the waiting internally
            var isKegListVisible = await ProductCatalogPage!.IsKegListVisible();
            isKegListVisible.Should().BeTrue("A list of beer kegs should be visible on the kegs page");

            var kegCount = await ProductCatalogPage.GetKegCount();
            kegCount.Should().BeGreaterThan(0, "There should be at least one keg displayed in the catalog");

            Console.WriteLine($"✓ Successfully found {kegCount} kegs in the catalog");
        }

        [Then(@"each keg should display basic information")]
        public async Task ThenEachKegShouldDisplay()
        {
            ProductCatalogPage.Should().NotBeNull("ProductCatalogPage should be initialized");

            // Verify that kegs display the required information
            var displayRequiredInfo = await ProductCatalogPage!.DoKegsDisplayRequiredInformation();
            displayRequiredInfo.Should().BeTrue("Each keg should display the required product information including:");

            // Additional verification: ensure we have a reasonable number of kegs
            var kegCount = await ProductCatalogPage.GetKegCount();
            kegCount.Should().BeGreaterThan(0, "Should have kegs to verify information display");

            Console.WriteLine($"✓ Verified information display for {kegCount} kegs");
        }

        [Then(@"I should be able to filter by beer type")]
        public async Task ThenIShouldBeAbleToFilterByBeerType()
        {
            ProductCatalogPage.Should().NotBeNull("ProductCatalogPage should be initialized");

            var filtersAvailable = await ProductCatalogPage!.AreFiltersAvailable();
            filtersAvailable.Should().BeTrue("Filter options should be available on the kegs catalog page");

            Console.WriteLine("✓ Filter functionality is available for beer types");
        }

        [Then(@"I should be able to sort by price or popularity")]
        public async Task ThenIShouldBeAbleToSortByPriceOrPopularity()
        {
            ProductCatalogPage.Should().NotBeNull("ProductCatalogPage should be initialized");

            var sortOptionsAvailable = await ProductCatalogPage!.AreSortOptionsAvailable();
            sortOptionsAvailable.Should().BeTrue("Sort options should be available on the kegs catalog page");

            Console.WriteLine("✓ Sort functionality is available (price, popularity, etc.)");
        }
    }
}
