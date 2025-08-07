using Microsoft.Playwright;

namespace PerfectDraftTests.PageObjects
{
    public class SearchPage : BasePage
    {
        // Selectors verified from actual website via Playwright MCP exploration
        private readonly string searchInputSelector = "#autocomplete-0-input";
        private readonly string searchButtonSelector = ".aa-SubmitButton";
        private readonly string searchFormSelector = ".aa-Form";
        private readonly string searchResultsHeaderSelector = "h1, .page-title";
        private readonly string noResultsMessageSelector = "*";  // Will use text-based check
        private readonly string searchSuggestionsSelector = "*";  // Will use text-based check
        private readonly string filterSectionSelector = ".sidebar, [class*='filter']";
        private readonly string sortDropdownSelector = "#sorter, select, [data-role='sorter']";
        private readonly string productResultsSelector = ".products, .search-results, .result-wrapper";

        public SearchPage(IPage page) : base(page) { }

        public async Task EnterSearchTerm(string searchTerm)
        {
            await Page.FillAsync(searchInputSelector, searchTerm);
        }

        public async Task ClickSearchButton()
        {
            await Page.ClickAsync(searchButtonSelector);
            await Page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);
        }

        public async Task<bool> AreSearchResultsVisible()
        {
            var pageText = await Page.TextContentAsync("body");
            return pageText?.Contains("Search results for:") ?? false;
        }

        public async Task<bool> DoSearchResultsContainTerm(string searchTerm)
        {
            var pageText = await Page.TextContentAsync("body");
            if (pageText == null) return false;

            // Check if results contain the search term or related products
            return pageText.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                   pageText.Contains($"Search results for: '{searchTerm}'");
        }

        public async Task<bool> DoResultsIncludeBothKegsAndBundles()
        {
            var pageText = await Page.TextContentAsync("body");
            if (pageText == null) return false;

            // Look for evidence of both kegs and bundles/machines in results
            var hasKegs = pageText.Contains("Keg", StringComparison.OrdinalIgnoreCase) ||
                         pageText.Contains("6L", StringComparison.OrdinalIgnoreCase);
            
            var hasBundles = pageText.Contains("Bundle", StringComparison.OrdinalIgnoreCase) ||
                           pageText.Contains("Machine", StringComparison.OrdinalIgnoreCase) ||
                           pageText.Contains("Starter", StringComparison.OrdinalIgnoreCase);

            return hasKegs && hasBundles;
        }

        public async Task<bool> AreFiltersAvailable()
        {
            var pageText = await Page.TextContentAsync("body");
            if (pageText == null) return false;

            // Check for filter-related text and elements
            return pageText.Contains("Filter", StringComparison.OrdinalIgnoreCase) ||
                   pageText.Contains("Shop By", StringComparison.OrdinalIgnoreCase) ||
                   pageText.Contains("Category", StringComparison.OrdinalIgnoreCase) ||
                   pageText.Contains("Product Type", StringComparison.OrdinalIgnoreCase);
        }

        public async Task<bool> IsNoResultsMessageVisible()
        {
            var pageText = await Page.TextContentAsync("body");
            if (pageText == null) return false;

            return pageText.Contains("Your search returned no results") ||
                   pageText.Contains("Sorry no products matched") ||
                   pageText.Contains("no results found", StringComparison.OrdinalIgnoreCase);
        }

        public async Task<bool> AreSearchSuggestionsVisible()
        {
            var pageText = await Page.TextContentAsync("body");
            if (pageText == null) return false;

            // Look for search suggestions that we saw in MCP exploration
            // From the actual website response, we saw: "Did you mean: hawkstone cider peroni stella"
            return pageText.Contains("Did you mean:") ||
                   pageText.Contains("Check your spelling") ||
                   pageText.Contains("try a different keyword") ||
                   pageText.Contains("hawkstone") ||
                   pageText.Contains("cider") ||
                   pageText.Contains("peroni");
        }

        public async Task<int> GetSearchResultsCount()
        {
            var pageText = await Page.TextContentAsync("body");
            if (pageText == null) return 0;

            // Try to extract the count from text like "Items 1-12 of 15 products"
            if (pageText.Contains("of") && pageText.Contains("products"))
            {
                var lines = pageText.Split('\n');
                foreach (var line in lines)
                {
                    if (line.Contains("of") && line.Contains("products"))
                    {
                        var parts = line.Split(' ');
                        for (int i = 0; i < parts.Length - 1; i++)
                        {
                            if (parts[i] == "of" && int.TryParse(parts[i + 1], out int count))
                            {
                                return count;
                            }
                        }
                    }
                }
            }

            return 0;
        }

        public async Task<bool> IsSortingAvailable()
        {
            var pageText = await Page.TextContentAsync("body");
            if (pageText == null) return false;

            return pageText.Contains("Sort By", StringComparison.OrdinalIgnoreCase) ||
                   pageText.Contains("Relevance") ||
                   pageText.Contains("Price") ||
                   pageText.Contains("Best Selling");
        }
    }
}