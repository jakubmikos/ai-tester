using PerfectDraftTests.PageObjects;
using Reqnroll;
using FluentAssertions;
using Microsoft.Playwright;

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

        [Then(@"I should see all machine types:")]
        public async Task ThenIShouldSeeAllMachineTypes(Table table)
        {
            ProductCatalogPage.Should().NotBeNull("ProductCatalogPage should be initialized");

            foreach (var row in table.Rows)
            {
                var machineType = row["Machine Type"];
                var isMachineVisible = await ProductCatalogPage!.IsMachineTypeVisible(machineType);
                isMachineVisible.Should().BeTrue($"Machine type '{machineType}' should be visible on the machines page");
            }

            Console.WriteLine("✓ Both PerfectDraft machine types are visible");
        }

        [Then(@"I should see a feature comparison link")]
        public async Task ThenIShouldSeeAFeatureComparisonLink()
        {
            ProductCatalogPage.Should().NotBeNull("ProductCatalogPage should be initialized");

            var comparisonLinkVisible = await ProductCatalogPage!.IsComparisonLinkVisible();
            comparisonLinkVisible.Should().BeTrue("Feature comparison link should be visible on the machines page");

            Console.WriteLine("✓ Feature comparison link is available");
        }

        [When(@"I click on a machine to view details")]
        public async Task WhenIClickOnAMachineToViewDetails()
        {
            ProductCatalogPage.Should().NotBeNull("ProductCatalogPage should be initialized");

            await ProductCatalogPage!.ClickOnFirstMachine();
            
            Console.WriteLine("✓ Navigated to machine detail page");
        }

        [Then(@"I should see machine specifications including keg size")]
        public async Task ThenIShouldSeeMachineSpecificationsIncludingKegSize()
        {
            ProductCatalogPage.Should().NotBeNull("ProductCatalogPage should be initialized");

            var specsVisible = await ProductCatalogPage!.AreSpecificationsVisible();
            specsVisible.Should().BeTrue("Machine specifications should be visible on the detail page");

            var kegSizeVisible = await ProductCatalogPage!.IsKegSizeSpecificationVisible();
            kegSizeVisible.Should().BeTrue("Keg size specification should be visible in machine details");

            Console.WriteLine("✓ Machine specifications including keg size are visible");
        }

        [When(@"I click on a beer keg ""([^""]*)""")]
        public async Task WhenIClickOnABeerKeg(string kegName)
        {
            ProductCatalogPage.Should().NotBeNull("ProductCatalogPage should be initialized");

            // Navigate to kegs section first if not already there
            await this.HomePage.NavigateToSection("Kegs");
            
            // Click on the specified keg
            await ProductCatalogPage!.ClickOnProductByName(kegName);
            
            Console.WriteLine($"✓ Clicked on {kegName}");
        }

        [Then(@"I should see the product detail page")]
        public async Task ThenIShouldSeeTheProductDetailPage()
        {
            // Wait for page to fully load
            await Page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);
            
            // Check if we're on a product detail page by URL pattern
            var currentUrl = Page.Url;
            Console.WriteLine($"Current URL: {currentUrl}");
            
            // Product detail pages typically contain the product name in the URL
            var isProductDetailUrl = currentUrl.Contains("stella-artois") || 
                                   currentUrl.Contains("product") || 
                                   currentUrl.Contains("keg");
            
            // Also check for basic elements that should exist on any product page
            var hasTitle = await Page.Locator("h1").CountAsync() > 0;
            
            var isProductPage = isProductDetailUrl && hasTitle;
            isProductPage.Should().BeTrue($"Should be on a product detail page. URL: {currentUrl}, Has H1: {hasTitle}");

            Console.WriteLine("✓ Product detail page is displayed");
        }

        [Then(@"I should see detailed product information:")]
        public async Task ThenIShouldSeeDetailedProductInformation(Table table)
        {
            var productDetailPage = new ProductDetailPage(Page);

            foreach (var row in table.Rows)
            {
                var detailType = row["Detail Type"];
                bool isVisible = false;

                switch (detailType)
                {
                    case "Product images":
                        isVisible = await productDetailPage.IsProductImageVisible();
                        break;
                    case "Full description":
                        isVisible = await productDetailPage.IsFullDescriptionVisible();
                        break;
                    case "ABV and volume":
                        isVisible = await productDetailPage.IsABVAndVolumeVisible();
                        break;
                    case "Price information":
                        isVisible = await productDetailPage.IsPriceInformationVisible();
                        break;
                    case "Stock availability":
                        isVisible = await productDetailPage.IsStockAvailabilityVisible();
                        break;
                    case "Customer reviews":
                        isVisible = await productDetailPage.IsCustomerReviewsVisible();
                        break;
                    default:
                        throw new ArgumentException($"Unknown detail type: {detailType}");
                }

                isVisible.Should().BeTrue($"{detailType} should be visible on the product detail page");
            }

            Console.WriteLine("✓ All detailed product information is displayed");
        }

        [Then(@"I should see an ""([^""]*)"" button")]
        public async Task ThenIShouldSeeAnAddToCartButton(string buttonText)
        {
            var productDetailPage = new ProductDetailPage(Page);

            var isButtonVisible = await productDetailPage.IsAddToCartButtonVisible();
            isButtonVisible.Should().BeTrue($"{buttonText} button should be visible on the product detail page");

            Console.WriteLine($"✓ {buttonText} button is visible");
        }

        [Then(@"I should see related product recommendations")]
        public async Task ThenIShouldSeeRelatedProductRecommendations()
        {
            var productDetailPage = new ProductDetailPage(Page);

            var areRelatedProductsVisible = await productDetailPage.AreRelatedProductsVisible();
            areRelatedProductsVisible.Should().BeTrue("Related product recommendations should be visible on the product detail page");

            Console.WriteLine("✓ Related product recommendations are displayed");
        }
    }
}
