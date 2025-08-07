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
            await _page.GotoAsync("https://www.perfectdraft.co.uk");
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
                // Use the specific main navigation link for kegs
                var kegsLink = _page.Locator("a[data-menu='menu-605']").First;
                await kegsLink.ClickAsync();
            }
            else if (sectionName == "Machines" || sectionName == "PerfectDraft Machines")
            {
                // Use the specific link for machines
                var machinesLink = _page.GetByText("PerfectDraft Machines").First;
                await machinesLink.ClickAsync();
            }
            else
            {
                // Fallback to text search for other sections
                var link = _page.GetByText(sectionName).First;
                await link.ClickAsync();
            }
            
            await _page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);
        }
    }
}
