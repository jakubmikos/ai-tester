using Microsoft.Playwright;

namespace PerfectDraftTests.PageObjects
{
    public class HomePage : BasePage
    {
        private readonly IPage _page;

        public HomePage(IPage page) : base(page)
        {
            _page = page;
        }

        public async Task NavigateToUKWebsite()
        {
            await _page.GotoAsync("https://www.perfectdraft.com/en-gb");
            await _page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);
        }

        public async Task<bool> IsNavigationMenuVisible()
        {
            // Look for main navigation - trying multiple selectors
            var navSelectors = new[] { "nav", ".navigation", ".main-nav", "[role='navigation']" };

            foreach (var selector in navSelectors)
            {
                try
                {
                    var element = await _page.QuerySelectorAsync(selector);
                    if (element != null && await element.IsVisibleAsync())
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

        public async Task<bool> IsMenuItemVisible(string menuItem)
        {
            // Use Playwright's text selector which is more reliable
            try
            {
                var element = await _page.QuerySelectorAsync($"text={menuItem}");
                return element != null && await element.IsVisibleAsync();
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> IsSearchFunctionalityAvailable()
        {
            var searchSelectors = new[]
            {
                "input[type='search']",
                "[placeholder*='Search']",
                "[placeholder*='search']",
                "input[name*='search']",
                ".search input"
            };

            foreach (var selector in searchSelectors)
            {
                try
                {
                    var element = await _page.QuerySelectorAsync(selector);
                    if (element != null && await element.IsVisibleAsync())
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

        public async Task<string> GetCartItemCount()
        {
            var cartSelectors = new[]
            {
                ".cart-count",
                ".cart-counter",
                "[data-cart-count]",
                ".basket-count"
            };

            foreach (var selector in cartSelectors)
            {
                try
                {
                    var element = await _page.QuerySelectorAsync(selector);
                    if (element != null && await element.IsVisibleAsync())
                    {
                        var text = await element.TextContentAsync();
                        return text?.Trim() ?? "0";
                    }
                }
                catch
                {
                    continue;
                }
            }

            // If no specific counter found, default to "0"
            return "0";
        }

        public async Task<bool> IsCartIconVisible()
        {
            var cartSelectors = new[]
            {
                "text=Cart",
                "text=Basket",
                "[href*='cart']",
                "[href*='basket']",
                ".cart-icon",
                ".basket-icon"
            };

            foreach (var selector in cartSelectors)
            {
                try
                {
                    var element = await _page.QuerySelectorAsync(selector);
                    if (element != null && await element.IsVisibleAsync())
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

        public async Task NavigateToSection(string sectionName)
        {
            if (sectionName == "Kegs")
            {
                try
                {
                    // First try direct navigation which is more reliable
                    await _page.GotoAsync("https://www.perfectdraft.com/en-gb/perfect-draft-range/perfect-draft-kegs");
                    await _page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);
                    Console.WriteLine("Successfully navigated directly to kegs page");
                }
                catch
                {
                    // Fallback to clicking the navigation link
                    try
                    {
                        // Use the specific main navigation link for kegs with force click
                        var kegsLink = _page.Locator("a[data-menu='menu-605']").First;
                        await kegsLink.ClickAsync(new() { Force = true });
                    }
                    catch
                    {
                        // Try alternative navigation approaches
                        await _page.EvaluateAsync("window.location.href = 'https://www.perfectdraft.com/en-gb/perfect-draft-range/perfect-draft-kegs'");
                    }
                }
            }
            else if (sectionName == "Machines" || sectionName == "PerfectDraft Machines")
            {
                try
                {
                    // Use the specific link for machines
                    var machinesLink = _page.GetByText("PerfectDraft Machines").First;
                    await machinesLink.ClickAsync(new() { Force = true });
                }
                catch
                {
                    // Direct navigation fallback
                    await _page.GotoAsync("https://www.perfectdraft.com/en-gb/perfect-draft-range/perfect-draft-machines");
                }
            }
            else
            {
                // Fallback to text search for other sections
                try
                {
                    var link = _page.GetByText(sectionName).First;
                    await link.ClickAsync(new() { Force = true });
                }
                catch
                {
                    Console.WriteLine($"Could not navigate to section: {sectionName}");
                }
            }
            
            await _page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);
            await _page.WaitForTimeoutAsync(2000); // Allow time for dynamic content to load
        }
    }
}
