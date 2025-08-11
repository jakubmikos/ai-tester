using Microsoft.Playwright;

namespace PerfectDraftTests.PageObjects
{
    public class AboutPerfectDraftPage : BasePage
    {
        public AboutPerfectDraftPage(IPage page) : base(page)
        {
        }

        public async Task<bool> HasCompanyInformationContent()
        {
            // Check for typical company information content indicators
            var contentIndicators = new[]
            {
                "about", "company", "information", "business", "story", "mission", "vision", "history"
            };

            foreach (var indicator in contentIndicators)
            {
                try
                {
                    var element = await FindElementByTextAsync(indicator);
                    if (await element.IsVisibleAsync())
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

        public async Task<bool> HasNavigationBackToMainSite()
        {
            // Check for navigation elements back to main site
            var navigationSelectors = new[]
            {
                "a[href*='perfectdraft.com']",
                ".logo",
                "[class*='logo']",
                "a[href='/']",
                "a[href='/en-gb']"
            };

            foreach (var selector in navigationSelectors)
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

            // Also check for text-based navigation
            var navigationTexts = new[] { "home", "back", "main site" };
            foreach (var text in navigationTexts)
            {
                try
                {
                    var element = await FindElementByTextAsync(text);
                    if (await element.IsVisibleAsync())
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

        public async Task<bool> IsOnAboutPerfectDraftPage()
        {
            var currentUrl = await GetCurrentUrlAsync();
            var title = await GetPageTitleAsync();

            // Check URL contains about-related keywords
            var urlMatches = currentUrl.ToLower().Contains("about") ||
                           currentUrl.ToLower().Contains("perfectdraft");

            // Check title contains about-related keywords
            var titleMatches = title.ToLower().Contains("about") ||
                             title.ToLower().Contains("perfectdraft");

            return urlMatches || titleMatches;
        }
    }
}