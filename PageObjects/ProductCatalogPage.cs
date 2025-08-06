using Microsoft.Playwright;

namespace PerfectDraftTests.PageObjects
{
    public class ProductCatalogPage : BasePage
    {
        public ProductCatalogPage(IPage page) : base(page)
        {
        }

        public async Task NavigateToKegsSection()
        {
            // Try multiple selectors to find the kegs/beer section
            var kegSelectors = new[]
            {
                "text=Kegs",
                "text=Beer Kegs",
                "a[href*='kegs']",
                "a[href*='beer']",
                "[data-category='kegs']",
                ".navigation a:has-text('Kegs')",
                ".menu-item:has-text('Kegs')"
            };

            bool navigationSuccessful = false;

            foreach (var selector in kegSelectors)
            {
                try
                {
                    var element = await FindElementAsync(selector);
                    if (await element.IsVisibleAsync())
                    {
                        await element.ClickAsync();
                        await WaitForPageLoadAsync();
                        navigationSuccessful = true;
                        Console.WriteLine(selector);
                        break;
                    }
                }
                catch
                {
                    continue;
                }
            }

            if (!navigationSuccessful)
            {
                // Fallback: try to navigate via URL
                var currentUrl = await GetCurrentUrlAsync();
                var baseUrl = new Uri(currentUrl).GetLeftPart(UriPartial.Authority);
                await NavigateToAsync($"{baseUrl}/kegs");
            }
        }

        public async Task<bool> IsKegListVisible()
        {
            var kegListSelectors = new[]
            {
                ".ais-InfiniteHits"
            };

            foreach (var selector in kegListSelectors)
            {
                try
                {
                    // Use Playwright's built-in waiting with 30 second timeout
                    await WaitForElementToBeVisibleAsync(selector, 30000);
                    return true;
                }
                catch (TimeoutException)
                {
                    // Continue to next selector if this one times out
                    continue;
                }
                catch
                {
                    continue;
                }
            }

            return false;
        }

        public async Task<int> GetKegCount()
        {
            var kegSelectors = new[]
            {
                ".result-wrapper",
            };

            foreach (var selector in kegSelectors)
            {
                try
                {
                    // Wait for at least one keg to be present using Playwright's built-in waiting
                    var locator = Page.Locator(selector);
                    await locator.First.WaitForAsync(new LocatorWaitForOptions
                    {
                        State = WaitForSelectorState.Attached,
                        Timeout = 30000
                    });

                    var count = await locator.CountAsync();
                    if (count > 0)
                    {
                        return count;
                    }
                }
                catch (TimeoutException)
                {
                    // Continue to next selector if this one times out
                    continue;
                }
                catch
                {
                    continue;
                }
            }

            return 0;
        }

        public async Task<bool> DoKegsDisplayRequiredInformation()
        {
            var kegItems = await GetKegElements();

            if (kegItems.Count == 0)
            {
                return false;
            }

            // Check first few kegs for required information
            var kegsToCheck = Math.Min(3, kegItems.Count);

            for (int i = 0; i < kegsToCheck; i++)
            {
                var keg = kegItems[i];

                // Check for product image
                var hasImage = await HasProductImage(keg);

                // Check for beer name/title
                var hasName = await HasProductName(keg);

                // Check for price
                var hasPrice = await HasPriceInfo(keg);

                // Check for ABV (alcohol by volume)
                var hasABV = await HasABVInfo(keg);

                // If at least most information is present, consider it valid
                var infoCount = (hasImage ? 1 : 0) + (hasName ? 1 : 0) +
                               (hasPrice ? 1 : 0) + (hasABV ? 1 : 0);

                if (infoCount < 4) // At least 4 out of 6 pieces of info should be present
                {
                    return false;
                }
            }

            return true;
        }

        private async Task<IReadOnlyList<ILocator>> GetKegElements()
        {
            var elements = Page.Locator(".result-wrapper");

            if (await elements.CountAsync() > 0)
            {
                return await elements.AllAsync();
            }

            return new List<ILocator>();
        }

        private async Task<bool> HasProductImage(ILocator kegElement)
        {
            var image = kegElement.Locator("img[itemprop=image]");
            return await image.CountAsync() > 0 && await image.First.IsVisibleAsync();
        }

        private async Task<bool> HasProductName(ILocator kegElement)
        {
            var nameSelectors = new[]
            {
                ".result-title"
            };

            return await HasTextContent(kegElement, nameSelectors);
        }

        private async Task<bool> HasPriceInfo(ILocator kegElement)
        {
            var priceSelectors = new[]
            {
                ".price",
            };

            return await HasTextContent(kegElement, priceSelectors, "£");
        }

        private async Task<bool> HasABVInfo(ILocator kegElement)
        {
            var abvSelectors = new[]
            {
                ".attr-label__abv",
            };

            return await HasTextContent(kegElement, abvSelectors, "%");
        }

        private async Task<bool> HasTextContent(ILocator kegElement, string[] selectors, string? mustContain = null)
        {
            foreach (var selector in selectors)
            {
                try
                {
                    var element = kegElement.Locator(selector);
                    if (await element.CountAsync() > 0)
                    {
                        var text = await element.First.TextContentAsync();
                        if (!string.IsNullOrWhiteSpace(text))
                        {
                            if (mustContain == null || text.Contains(mustContain))
                            {
                                return true;
                            }
                        }
                    }
                }
                catch
                {
                    continue;
                }
            }
            return false;
        }

        public async Task<bool> AreFiltersAvailable()
        {
            var filterSelectors = new[]
            {
                ".filter",
                ".filters",
                ".product-filters",
                "[data-testid='filters']",
                ".filter-container",
                "select[name*='filter']",
                ".filter-dropdown"
            };

            foreach (var selector in filterSelectors)
            {
                try
                {
                    if (await IsElementVisibleAsync(selector))
                    {
                        return true;
                    }
                }
                catch
                {
                    continue;
                }
            }

            // Also check for filter-related text
            var filterTexts = new[] { "Filter", "Filter by", "Beer Type", "Brand" };
            foreach (var text in filterTexts)
            {
                try
                {
                    var element = Page.GetByText(text, new() { Exact = false });
                    if (await element.CountAsync() > 0 && await element.First.IsVisibleAsync())
                    {
                        return true;
                    }
                }
                catch
                {
                    continue;
                }
            }

            return false;
        }

        public async Task<bool> AreSortOptionsAvailable()
        {
            var sortSelectors = new[]
            {
                ".sort",
                ".sort-by",
                ".product-sort",
                "[data-testid='sort']",
                "select[name*='sort']",
                ".sort-dropdown"
            };

            foreach (var selector in sortSelectors)
            {
                try
                {
                    if (await IsElementVisibleAsync(selector))
                    {
                        return true;
                    }
                }
                catch
                {
                    continue;
                }
            }

            // Also check for sort-related text
            var sortTexts = new[] { "Sort", "Sort by", "Price", "Popularity", "Name" };
            foreach (var text in sortTexts)
            {
                try
                {
                    var element = Page.GetByText(text, new() { Exact = false });
                    if (await element.CountAsync() > 0 && await element.First.IsVisibleAsync())
                    {
                        return true;
                    }
                }
                catch
                {
                    continue;
                }
            }

            return false;
        }

        public async Task<bool> IsMachineTypeVisible(string machineType)
        {
            if (machineType == "PerfectDraft")
            {
                // For standard PerfectDraft, find text that contains "PerfectDraft" 
                // but does NOT contain "Pro" or "Black"
                var allPerfectDraftElements = await Page.GetByText("PerfectDraft").AllAsync();
                
                foreach (var element in allPerfectDraftElements)
                {
                    if (await element.IsVisibleAsync())
                    {
                        var text = await element.TextContentAsync();
                        if (text != null && 
                            text.Contains("PerfectDraft") && 
                            !text.Contains("Pro") && 
                            !text.Contains("Black"))
                        {
                            return true;
                        }
                    }
                }
                return false;
            }
            else
            {
                // For other machine types (like "PerfectDraft Pro"), use contains match
                try
                {
                    var element = Page.GetByText(machineType, new() { Exact = false });
                    return await element.CountAsync() > 0 && await element.First.IsVisibleAsync();
                }
                catch
                {
                    return false;
                }
            }
        }

        public async Task<bool> IsComparisonLinkVisible()
        {
            try
            {
                var comparisonLink = Page.Locator("#dy-banner-104346742");
                return await comparisonLink.CountAsync() > 0 && await comparisonLink.First.IsVisibleAsync();
            }
            catch
            {
                return false;
            }
        }

        public async Task ClickOnFirstMachine()
        {
            try
            {
                // Click on the actual link element instead of the content div
                var firstMachineLink = Page.Locator("a.result.product__link").First;
                await firstMachineLink.ClickAsync();
                await WaitForPageLoadAsync();
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Failed to click on first machine: {ex.Message}", ex);
            }
        }

        public async Task<bool> AreSpecificationsVisible()
        {
            try
            {
                var specsContainer = Page.Locator(".specs");
                return await specsContainer.CountAsync() > 0 && await specsContainer.First.IsVisibleAsync();
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> IsKegSizeSpecificationVisible()
        {
            try
            {
                var kegSizeElement = Page.Locator("[data-code=\"bottle_size\"]");
                return await kegSizeElement.CountAsync() > 0 && await kegSizeElement.First.IsVisibleAsync();
            }
            catch
            {
                return false;
            }
        }
    }
}
