using Microsoft.Playwright;
using PerfectDraftTests.Support;
using FluentAssertions;

namespace PerfectDraftTests.PageObjects;

public abstract class BasePage
{
    protected readonly IPage Page;
    protected readonly TestConfiguration Config;

    protected BasePage(IPage page)
    {
        Page = page;
        Config = TestConfiguration.Instance;
    }

    public virtual async Task NavigateToAsync(string url)
    {
        await Page.GotoAsync(url);
        await WaitForPageLoadAsync();
    }

    public virtual async Task WaitForPageLoadAsync()
    {
        await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
    }

    public virtual async Task<string> GetPageTitleAsync()
    {
        return await Page.TitleAsync();
    }

    public virtual Task<string> GetCurrentUrlAsync()
    {
        return Task.FromResult(Page.Url);
    }

    protected Task<ILocator> FindElementAsync(string selector)
    {
        return Task.FromResult(Page.Locator(selector));
    }

    protected Task<ILocator> FindElementByTextAsync(string text)
    {
        return Task.FromResult(Page.GetByText(text));
    }

    protected Task<ILocator> FindElementByRoleAsync(AriaRole role, string? name = null)
    {
        var options = new PageGetByRoleOptions();
        if (!string.IsNullOrEmpty(name))
        {
            options.Name = name;
        }
        return Task.FromResult(Page.GetByRole(role, options));
    }

    protected async Task ClickAsync(string selector)
    {
        var element = await FindElementAsync(selector);
        await element.ClickAsync();
    }

    protected async Task ClickByTextAsync(string text)
    {
        var element = await FindElementByTextAsync(text);
        await element.ClickAsync();
    }

    protected async Task TypeAsync(string selector, string text)
    {
        var element = await FindElementAsync(selector);
        await element.FillAsync(text);
    }

    protected async Task<string> GetTextAsync(string selector)
    {
        var element = await FindElementAsync(selector);
        return await element.TextContentAsync() ?? string.Empty;
    }

    protected async Task<bool> IsElementVisibleAsync(string selector)
    {
        try
        {
            var element = await FindElementAsync(selector);
            return await element.IsVisibleAsync();
        }
        catch
        {
            return false;
        }
    }

    protected async Task<bool> IsElementEnabledAsync(string selector)
    {
        try
        {
            var element = await FindElementAsync(selector);
            return await element.IsEnabledAsync();
        }
        catch
        {
            return false;
        }
    }

    protected async Task WaitForElementAsync(string selector, int timeoutMs = 0)
    {
        var timeout = timeoutMs > 0 ? timeoutMs : Config.Timeout;
        await Page.WaitForSelectorAsync(selector, new PageWaitForSelectorOptions
        {
            Timeout = timeout
        });
    }

    protected async Task WaitForElementToBeVisibleAsync(string selector, int timeoutMs = 0)
    {
        var timeout = timeoutMs > 0 ? timeoutMs : Config.Timeout;
        await Page.WaitForSelectorAsync(selector, new PageWaitForSelectorOptions
        {
            State = WaitForSelectorState.Visible,
            Timeout = timeout
        });
    }

    protected async Task WaitForElementToBeHiddenAsync(string selector, int timeoutMs = 0)
    {
        var timeout = timeoutMs > 0 ? timeoutMs : Config.Timeout;
        await Page.WaitForSelectorAsync(selector, new PageWaitForSelectorOptions
        {
            State = WaitForSelectorState.Hidden,
            Timeout = timeout
        });
    }

    protected async Task ScrollToElementAsync(string selector)
    {
        var element = await FindElementAsync(selector);
        await element.ScrollIntoViewIfNeededAsync();
    }

    protected async Task SelectFromDropdownAsync(string selector, string value)
    {
        var element = await FindElementAsync(selector);
        await element.SelectOptionAsync(value);
    }

    protected async Task<int> GetElementCountAsync(string selector)
    {
        var elements = Page.Locator(selector);
        return await elements.CountAsync();
    }

    protected async Task<IReadOnlyList<string>> GetAllTextsAsync(string selector)
    {
        var elements = Page.Locator(selector);
        return await elements.AllTextContentsAsync();
    }

    protected async Task TakeScreenshotAsync(string? path = null)
    {
        var screenshotPath = path ?? $"screenshot_{DateTime.Now:yyyyMMdd_HHmmss}.png";
        await Page.ScreenshotAsync(new PageScreenshotOptions
        {
            Path = screenshotPath,
            FullPage = true
        });
    }

    protected async Task AssertElementExistsAsync(string selector, string? customMessage = null)
    {
        var element = await FindElementAsync(selector);
        var isVisible = await element.IsVisibleAsync();
        isVisible.Should().BeTrue(customMessage ?? $"Element with selector '{selector}' should be visible");
    }

    protected async Task AssertElementContainsTextAsync(string selector, string expectedText, string? customMessage = null)
    {
        var actualText = await GetTextAsync(selector);
        actualText.Should().Contain(expectedText, customMessage ?? $"Element should contain text '{expectedText}' but found '{actualText}'");
    }

    protected async Task AssertUrlContainsAsync(string expectedUrlPart, string? customMessage = null)
    {
        var currentUrl = await GetCurrentUrlAsync();
        currentUrl.Should().Contain(expectedUrlPart, customMessage ?? $"URL should contain '{expectedUrlPart}' but was '{currentUrl}'");
    }

    protected async Task AssertPageTitleContainsAsync(string expectedTitlePart, string? customMessage = null)
    {
        var title = await GetPageTitleAsync();
        title.Should().Contain(expectedTitlePart, customMessage ?? $"Page title should contain '{expectedTitlePart}' but was '{title}'");
    }
}