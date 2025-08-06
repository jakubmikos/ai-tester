using Microsoft.Playwright;
using FluentAssertions;

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
                // ".product-list",
                // ".products-grid", 
                // ".keg-list",
                // "[data-testid='product-list']",
                // ".product-container",
                // ".product-grid",
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
                // ".product-item",
                // ".product-card",
                // ".keg-item",
                // "[data-product-type='keg']",
                // ".product",
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
            var kegSelectors = new[]
            {
                ".product-item",
                ".product-card",
                ".keg-item",
                "[data-product-type='keg']",
                ".product",
                ".result-wrapper",
            };

            foreach (var selector in kegSelectors)
            {
                try
                {
                    var elements = Page.Locator(selector);
                    var count = await elements.CountAsync();
                    if (count > 0)
                    {
                        return await elements.AllAsync();
                    }
                }
                catch
                {
                    continue;
                }
            }

            return new List<ILocator>();
        }

        private async Task<bool> HasProductImage(ILocator kegElement)
        {
            var imageSelectors = new[] { "img", ".product-image img", ".image img" };
            
            foreach (var selector in imageSelectors)
            {
                try
                {
                    var image = kegElement.Locator(selector);
                    if (await image.CountAsync() > 0 && await image.First.IsVisibleAsync())
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
                ".product-price", 
                ".cost",
                "[data-testid='price']",
                ".amount"
            };
            
            return await HasTextContent(kegElement, priceSelectors, "£");
        }

        private async Task<bool> HasABVInfo(ILocator kegElement)
        {
            var abvSelectors = new[] 
            { 
                ".attr-label-abv", 
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
    }
}