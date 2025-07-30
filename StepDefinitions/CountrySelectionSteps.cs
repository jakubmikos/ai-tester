using FluentAssertions;
using Microsoft.Playwright;
using PerfectDraftTests.Support;
using Reqnroll;

namespace PerfectDraftTests.StepDefinitions;

[Binding]
public class CountrySelectionSteps
{
    private readonly ScenarioContext _scenarioContext;
    private readonly WebDriverFactory _webDriverFactory;
    private readonly TestConfiguration _config;
    private IPage? _page;

    public CountrySelectionSteps(ScenarioContext scenarioContext, WebDriverFactory webDriverFactory)
    {
        _scenarioContext = scenarioContext;
        _webDriverFactory = webDriverFactory;
        _config = TestConfiguration.Instance;
    }

    [When(@"I am on the country selection page")]
    public async Task WhenIAmOnTheCountrySelectionPage()
    {
        _page ??= await _webDriverFactory.InitializeAsync();
        
        await _page.GotoAsync("https://www.perfectdraft.com");
        await _page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        
        // Wait for the country selection page to load
        try
        {
            await _page.WaitForSelectorAsync("[data-testid='country-selector'], .country-selection, .region-selector", new PageWaitForSelectorOptions
            {
                Timeout = _config.Timeout
            });
        }
        catch
        {
            // If specific selectors don't exist, just continue - the page might have a different structure
        }
    }

    [Then(@"I should see the available regions ""(.+)"" and ""(.+)""")]
    public async Task ThenIShouldSeeTheAvailableRegions(string region1, string region2)
    {
        _page.Should().NotBeNull("Page should be initialized");
        
        // Look for region selectors or text containing the regions
        var regions = new[] { region1, region2 };
        
        foreach (var region in regions)
        {
            var regionFound = await IsElementVisibleAsync($"[data-region='{region}']") ||
                             await IsElementVisibleAsync($"[aria-label*='{region}']") ||
                             await IsElementVisibleAsync($"h1:has-text('{region}')") ||
                             await IsElementVisibleAsync($"h2:has-text('{region}')") ||
                             await IsElementVisibleAsync($"h3:has-text('{region}')") ||
                             await _page!.GetByRole(AriaRole.Heading, new() { Name = region }).IsVisibleAsync();
            
            regionFound.Should().BeTrue($"Region '{region}' should be visible on the country selection page");
        }
    }

    [Then(@"I should see country options including ""(.+)"", ""(.+)"", ""(.+)""")]
    public async Task ThenIShouldSeeCountryOptionsIncluding(string country1, string country2, string country3)
    {
        _page.Should().NotBeNull("Page should be initialized");
        
        var countries = new[] { country1, country2, country3 };
        
        foreach (var country in countries)
        {
            var countryFound = await IsElementVisibleAsync($"[data-country='{country}']") ||
                              await IsElementVisibleAsync($"[aria-label*='{country}']") ||
                              await IsElementVisibleAsync($"a:has-text('{country}')") ||
                              await IsElementVisibleAsync($"button:has-text('{country}')") ||
                              await _page!.GetByRole(AriaRole.Link, new() { Name = country }).IsVisibleAsync() ||
                              await _page!.GetByRole(AriaRole.Button, new() { Name = country }).IsVisibleAsync();
            
            countryFound.Should().BeTrue($"Country '{country}' should be visible on the country selection page");
        }
    }

    [When(@"I select country ""(.+)""")]
    public async Task WhenISelectCountry(string countryName)
    {
        _page.Should().NotBeNull("Page should be initialized");
        
        // Try multiple selectors to find and click the country
        var selectors = new[]
        {
            $"text={countryName}",
            $"[data-country='{countryName}']",
            $"[aria-label*='{countryName}']",
            $"a:has-text('{countryName}')",
            $"button:has-text('{countryName}')"
        };

        bool clicked = false;
        foreach (var selector in selectors)
        {
            try
            {
                var element = _page!.Locator(selector);
                if (await element.IsVisibleAsync())
                {
                    await element.ClickAsync();
                    clicked = true;
                    break;
                }
            }
            catch
            {
                // Continue to next selector
            }
        }

        if (!clicked)
        {
            // Fallback: try to find by text content
            await _page!.GetByText(countryName, new PageGetByTextOptions { Exact = false }).ClickAsync();
        }

        // Wait for navigation or page change
        await _page!.WaitForLoadStateAsync(LoadState.NetworkIdle);
    }

    [Then(@"I should be redirected to the UK website")]
    public void ThenIShouldBeRedirectedToTheUKWebsite()
    {
        _page.Should().NotBeNull("Page should be initialized");
        var currentUrl = _page!.Url;
        currentUrl.Should().Contain("/en-gb", "Should be redirected to the UK website");
    }

    [Then(@"I should be redirected to the ""(.+)"" website")]
    public void ThenIShouldBeRedirectedToTheWebsite(string countryName)
    {
        _page.Should().NotBeNull("Page should be initialized");
        var currentUrl = _page!.Url;
        var expectedPath = GetCountryUrlPath(countryName);
        
        currentUrl.Should().Contain(expectedPath, $"Should be redirected to the {countryName} website");
    }

    [Then(@"the currency should be displayed in ""(.+)""")]
    public async Task ThenTheCurrencyShouldBeDisplayedIn(string expectedCurrency)
    {
        _page.Should().NotBeNull("Page should be initialized");
        
        // Look for currency symbols or text on the page
        var currencySelectors = new[]
        {
            $"text={expectedCurrency}",
            $"[data-currency='{expectedCurrency}']",
            ".currency",
            ".price-currency",
            "[class*='currency']"
        };

        bool currencyFound = false;
        foreach (var selector in currencySelectors)
        {
            try
            {
                var element = _page!.Locator(selector);
                if (await element.IsVisibleAsync())
                {
                    var content = await element.TextContentAsync();
                    if (!string.IsNullOrEmpty(content) && content.Contains(expectedCurrency))
                    {
                        currencyFound = true;
                        break;
                    }
                }
            }
            catch
            {
                // Continue to next selector
            }
        }

        if (!currencyFound)
        {
            // Check if currency symbol is visible anywhere on the page
            var currencySymbol = GetCurrencySymbol(expectedCurrency);
            var currencyElements= _page!.GetByText(currencySymbol, new PageGetByTextOptions { Exact = false });

            currencyFound = await currencyElements.CountAsync() > 0;
        }

        currencyFound.Should().BeTrue($"Currency '{expectedCurrency}' should be displayed on the page");
    }

    [Then(@"the language should be ""(.+)""")]
    public async Task ThenTheLanguageShouldBe(string expectedLanguage)
    {
        _page.Should().NotBeNull("Page should be initialized");
        
        // Check HTML lang attribute or page content language indicators
        var htmlLang = await _page!.GetAttributeAsync("html", "lang");
        
        if (!string.IsNullOrEmpty(htmlLang))
        {
            var isCorrectLanguage = expectedLanguage.ToLower() switch
            {
                "english" => htmlLang.StartsWith("en"),
                "german" => htmlLang.StartsWith("de"),
                "french" => htmlLang.StartsWith("fr"),
                _ => htmlLang.Contains(expectedLanguage.ToLower())
            };
            
            isCorrectLanguage.Should().BeTrue($"HTML lang attribute should indicate {expectedLanguage} language");
        }
        else
        {
            // Fallback: check for language-specific content
            var hasLanguageContent = await HasLanguageSpecificContent(expectedLanguage);
            hasLanguageContent.Should().BeTrue($"Page should display content in {expectedLanguage}");
        }
    }

    private async Task<bool> IsElementVisibleAsync(string selector)
    {
        try
        {
            var element = _page!.Locator(selector);
            return await element.IsVisibleAsync();
        }
        catch
        {
            return false;
        }
    }

    private static string GetCountryUrlPath(string countryName)
    {
        return countryName.ToLower() switch
        {
            "united kingdom" => "/en-gb",
            "deutschland" => "/de-de",
            "france" => "/fr-fr",
            "united states" => "us.",
            _ => $"/{countryName.ToLower().Replace(" ", "-")}"
        };
    }

    private static string GetCurrencySymbol(string currency)
    {
        return currency.ToUpper() switch
        {
            "GBP" => "£",
            "EUR" => "€",
            "USD" => "$",
            _ => currency
        };
    }

    private async Task<bool> HasLanguageSpecificContent(string language)
    {
        var languageKeywords = language.ToLower() switch
        {
            "english" => new[] { "beer", "machine", "delivery", "cart", "account" },
            "german" => new[] { "bier", "maschine", "lieferung", "warenkorb", "konto" },
            "french" => new[] { "bière", "machine", "livraison", "panier", "compte" },
            _ => new[] { language.ToLower() }
        };

        foreach (var keyword in languageKeywords)
        {
            if (await _page!.GetByText(keyword, new PageGetByTextOptions { Exact = false }).IsVisibleAsync())
            {
                return true;
            }
        }

        return false;
    }
}