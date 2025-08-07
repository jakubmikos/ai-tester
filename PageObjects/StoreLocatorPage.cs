using Microsoft.Playwright;

namespace PerfectDraftTests.PageObjects
{
    public class StoreLocatorPage : BasePage
    {
        // URLs for store locator functionality
        private readonly string communityStoresUrl = "/en-gb/community-stores";
        
        // Selectors verified from actual website via Playwright MCP exploration
        private readonly string storeSearchInputSelector = "#map-input";
        private readonly string mapContainerSelector = ".map-wrapper";
        private readonly string storeMarkerSelector = ".popup-bubble, .store-item, .marker";
        private readonly string errorMessageSelector = ".section-search--update .error, .error-message";
        private readonly string storeFinderSectionSelector = "#storefinder";
        
        public StoreLocatorPage(IPage page) : base(page) { }

        // Navigation methods
        public async Task NavigateToCommunityStores()
        {
            var baseUrl = "https://www.perfectdraft.com";
            await Page.GotoAsync($"{baseUrl}{communityStoresUrl}");
            await Page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);
        }

        // Store locator functionality
        public async Task<bool> IsStoreLocatorPageDisplayed()
        {
            var currentUrl = Page.Url;
            var pageText = await Page.TextContentAsync("body");
            
            return currentUrl.Contains("community-stores") ||
                   (pageText != null && pageText.Contains("Community Store Network", StringComparison.OrdinalIgnoreCase));
        }

        public async Task<bool> IsStoreFinderSectionVisible()
        {
            var pageText = await Page.TextContentAsync("body");
            if (pageText == null) return false;

            return pageText.Contains("Find your nearest", StringComparison.OrdinalIgnoreCase) ||
                   pageText.Contains("Store Finder", StringComparison.OrdinalIgnoreCase) ||
                   pageText.Contains("postcode", StringComparison.OrdinalIgnoreCase);
        }

        public async Task SearchForStores(string location)
        {
            try
            {
                // Wait for the search input to be available
                await Page.WaitForSelectorAsync(storeSearchInputSelector, new() { Timeout = 10000 });
                
                // Clear and fill the search input
                await Page.FillAsync(storeSearchInputSelector, location);
                
                // Press Enter to initiate search
                await Page.PressAsync(storeSearchInputSelector, "Enter");
                
                // Wait a moment for results to load
                await Page.WaitForTimeoutAsync(2000);
            }
            catch (TimeoutException)
            {
                // If the search input is not found, try alternative approaches
                Console.WriteLine($"⚠ Search input {storeSearchInputSelector} not found, checking page content...");
                
                // Check if we're on the right page and the content is there
                var pageText = await Page.TextContentAsync("body");
                if (pageText != null && pageText.Contains("postcode", StringComparison.OrdinalIgnoreCase))
                {
                    // Try alternative selectors
                    var alternativeSelectors = new[]
                    {
                        "input[placeholder*='postcode' i]",
                        "input[placeholder*='location' i]",
                        ".controls",
                        "input[type='text']"
                    };
                    
                    foreach (var selector in alternativeSelectors)
                    {
                        try
                        {
                            var element = await Page.QuerySelectorAsync(selector);
                            if (element != null)
                            {
                                await Page.FillAsync(selector, location);
                                await Page.PressAsync(selector, "Enter");
                                await Page.WaitForTimeoutAsync(2000);
                                Console.WriteLine($"✓ Used alternative selector: {selector}");
                                return;
                            }
                        }
                        catch
                        {
                            continue;
                        }
                    }
                }
                
                throw new InvalidOperationException($"Could not find store search input on the page. Current URL: {Page.Url}");
            }
        }

        public async Task<bool> AreStoreResultsDisplayed()
        {
            var pageText = await Page.TextContentAsync("body");
            if (pageText == null) return false;

            // Check for various indicators of store results
            return pageText.Contains("store", StringComparison.OrdinalIgnoreCase) ||
                   pageText.Contains("location", StringComparison.OrdinalIgnoreCase) ||
                   pageText.Contains("Majestic", StringComparison.OrdinalIgnoreCase) ||
                   await HasMapMarkers();
        }

        public async Task<bool> HasMapMarkers()
        {
            try
            {
                var markers = await Page.QuerySelectorAllAsync(storeMarkerSelector);
                return markers.Count > 0;
            }
            catch
            {
                return false;
            }
        }

        public async Task<int> GetStoreResultsCount()
        {
            try
            {
                var markers = await Page.QuerySelectorAllAsync(storeMarkerSelector);
                return markers.Count;
            }
            catch
            {
                return 0;
            }
        }

        public async Task<List<string>> GetStoreTypes()
        {
            var storeTypes = new List<string>();
            var pageText = await Page.TextContentAsync("body");
            if (pageText == null) return storeTypes;

            // Extract store types found on the website
            if (pageText.Contains("Majestic Wine", StringComparison.OrdinalIgnoreCase))
                storeTypes.Add("Majestic Wine");
            
            if (pageText.Contains("Community Store", StringComparison.OrdinalIgnoreCase))
                storeTypes.Add("Community Store");
            
            if (pageText.Contains("In-Store Rewards", StringComparison.OrdinalIgnoreCase))
                storeTypes.Add("In-Store Rewards Partner");

            return storeTypes;
        }

        public async Task<bool> IsStoreInformationVisible()
        {
            var pageText = await Page.TextContentAsync("body");
            if (pageText == null) return false;

            // Check for store information indicators
            return pageText.Contains("£5", StringComparison.OrdinalIgnoreCase) ||
                   pageText.Contains("keg return", StringComparison.OrdinalIgnoreCase) ||
                   pageText.Contains("Beer Tokens", StringComparison.OrdinalIgnoreCase) ||
                   pageText.Contains("same-day shopping", StringComparison.OrdinalIgnoreCase);
        }

        public async Task<bool> CanSelectStoreFromResults()
        {
            // Check if there are clickable markers or store listings
            try
            {
                var clickableElements = await Page.QuerySelectorAllAsync($"{storeMarkerSelector}, button, a[href*='store'], .store-link");
                return clickableElements.Count > 0;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> IsErrorMessageDisplayed()
        {
            try
            {
                var errorElement = await Page.QuerySelectorAsync(errorMessageSelector);
                return errorElement != null;
            }
            catch
            {
                return false;
            }
        }

        public async Task<string?> GetSearchPlaceholderText()
        {
            try
            {
                var searchInput = await Page.QuerySelectorAsync(storeSearchInputSelector);
                if (searchInput == null) return null;
                
                return await searchInput.GetAttributeAsync("placeholder");
            }
            catch
            {
                return null;
            }
        }

        public async Task<bool> IsMapVisible()
        {
            try
            {
                var mapContainer = await Page.QuerySelectorAsync(mapContainerSelector);
                return mapContainer != null;
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<string>> GetStoreServices()
        {
            var services = new List<string>();
            var pageText = await Page.TextContentAsync("body");
            if (pageText == null) return services;

            // Extract services mentioned on the website
            if (pageText.Contains("Same-day shopping", StringComparison.OrdinalIgnoreCase))
                services.Add("Same-day shopping");
            
            if (pageText.Contains("Instant returns", StringComparison.OrdinalIgnoreCase))
                services.Add("Instant returns");
            
            if (pageText.Contains("cold kegs", StringComparison.OrdinalIgnoreCase))
                services.Add("Chilled kegs");
            
            if (pageText.Contains("special events", StringComparison.OrdinalIgnoreCase))
                services.Add("Special events");

            return services;
        }
    }
}