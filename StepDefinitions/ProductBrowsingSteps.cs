using Microsoft.Playwright;
using PerfectDraftTests.PageObjects;
using PerfectDraftTests.Support;
using Reqnroll;
using FluentAssertions;

namespace PerfectDraftTests.StepDefinitions
{
    [Binding]
    public class ProductBrowsingSteps
    {
        private readonly ScenarioContext _scenarioContext;
        private readonly WebDriverFactory _webDriverFactory;
        private IPage? _page;
        private HomePage? _homePage;
        private ProductCatalogPage? _catalogPage;

        public ProductBrowsingSteps(ScenarioContext scenarioContext, WebDriverFactory webDriverFactory)
        {
            _scenarioContext = scenarioContext;
            _webDriverFactory = webDriverFactory;
        }

        [When(@"I navigate to the ""([^""]*)"" section")]
        public async Task WhenINavigateToTheSection(string sectionName)
        {
            // Try to get existing page from scenario context first
            if (_scenarioContext.ContainsKey("Page"))
            {
                _page = _scenarioContext.Get<IPage>("Page");
            }
            else
            {
                _page = await _webDriverFactory.InitializeAsync();
                _scenarioContext.Set(_page, "Page");
            }

            // Try to get existing HomePage from scenario context first
            if (_scenarioContext.ContainsKey("HomePage"))
            {
                _homePage = _scenarioContext.Get<HomePage>("HomePage");
            }
            else
            {
                _homePage = new HomePage(_page);
                _scenarioContext.Set(_homePage, "HomePage");
            }

            // Navigate to the specified section
            await _homePage.NavigateToSection(sectionName);

            // Initialize catalog page for product browsing
            if (sectionName.Equals("Kegs", StringComparison.OrdinalIgnoreCase) || 
                sectionName.Equals("Beer Kegs", StringComparison.OrdinalIgnoreCase))
            {
                _catalogPage = new ProductCatalogPage(_page);
                _scenarioContext.Set(_catalogPage, "ProductCatalogPage");
            }
        }

        [Then(@"I should see a list of available beer kegs")]
        public async Task ThenIShouldSeeAListOfAvailableBeerKegs()
        {
            // Get catalog page from scenario context
            if (_scenarioContext.ContainsKey("ProductCatalogPage"))
            {
                _catalogPage = _scenarioContext.Get<ProductCatalogPage>("ProductCatalogPage");
            }
            
            _catalogPage.Should().NotBeNull("ProductCatalogPage should be initialized after navigating to Kegs section");

            Console.WriteLine("Waiting for beer kegs list to load...");
            
            // Use Playwright's built-in waiting - these methods now handle the waiting internally
            var isKegListVisible = await _catalogPage!.IsKegListVisible();
            isKegListVisible.Should().BeTrue("A list of beer kegs should be visible on the kegs page");

            var kegCount = await _catalogPage.GetKegCount();
            kegCount.Should().BeGreaterThan(0, "There should be at least one keg displayed in the catalog");
            
            Console.WriteLine($"✓ Successfully found {kegCount} kegs in the catalog");
        }

        [Then(@"each keg should display:")]
        public async Task ThenEachKegShouldDisplay(Table table)
        {
            // Get catalog page from scenario context
            if (_scenarioContext.ContainsKey("ProductCatalogPage"))
            {
                _catalogPage = _scenarioContext.Get<ProductCatalogPage>("ProductCatalogPage");
            }
            
            _catalogPage.Should().NotBeNull("ProductCatalogPage should be initialized");

            // Verify that kegs display the required information
            var displayRequiredInfo = await _catalogPage!.DoKegsDisplayRequiredInformation();
            displayRequiredInfo.Should().BeTrue("Each keg should display the required product information including:");

            // Log what information should be displayed (from the table)
            foreach (var row in table.Rows)
            {
                var information = row["Information"];
                Console.WriteLine($"✓ Expected information: {information}");
            }

            // Additional verification: ensure we have a reasonable number of kegs
            var kegCount = await _catalogPage.GetKegCount();
            kegCount.Should().BeGreaterThan(0, "Should have kegs to verify information display");

            Console.WriteLine($"✓ Verified information display for {kegCount} kegs");
        }

        [Then(@"I should be able to filter by beer type")]
        public async Task ThenIShouldBeAbleToFilterByBeerType()
        {
            // Get catalog page from scenario context
            if (_scenarioContext.ContainsKey("ProductCatalogPage"))
            {
                _catalogPage = _scenarioContext.Get<ProductCatalogPage>("ProductCatalogPage");
            }
            
            _catalogPage.Should().NotBeNull("ProductCatalogPage should be initialized");

            var filtersAvailable = await _catalogPage!.AreFiltersAvailable();
            filtersAvailable.Should().BeTrue("Filter options should be available on the kegs catalog page");

            Console.WriteLine("✓ Filter functionality is available for beer types");
        }

        [Then(@"I should be able to sort by price or popularity")]
        public async Task ThenIShouldBeAbleToSortByPriceOrPopularity()
        {
            // Get catalog page from scenario context
            if (_scenarioContext.ContainsKey("ProductCatalogPage"))
            {
                _catalogPage = _scenarioContext.Get<ProductCatalogPage>("ProductCatalogPage");
            }
            
            _catalogPage.Should().NotBeNull("ProductCatalogPage should be initialized");

            var sortOptionsAvailable = await _catalogPage!.AreSortOptionsAvailable();
            sortOptionsAvailable.Should().BeTrue("Sort options should be available on the kegs catalog page");

            Console.WriteLine("✓ Sort functionality is available (price, popularity, etc.)");
        }
    }
}
