using Microsoft.Playwright;
using PerfectDraftTests.Support;

namespace PerfectDraftTests.StepDefinitions;

public abstract class StepDefinitionBase
{
    protected readonly IPage Page;
    protected readonly TestConfiguration Config;
    protected readonly TestDataManager TestData;

    protected StepDefinitionBase(IPage page)
    {
        Page = page;
        Config = TestConfiguration.Instance;
        TestData = TestDataManager.Instance;
    }

    protected async Task NavigateToAsync(string url)
    {
        await Page.GotoAsync(url);
        await Page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);
    }

    protected async Task WaitForElementAsync(string selector, int timeoutMs = 0)
    {
        var timeout = timeoutMs > 0 ? timeoutMs : Config.Timeout;
        await Page.WaitForSelectorAsync(selector, new PageWaitForSelectorOptions
        {
            Timeout = timeout
        });
    }

    protected async Task<bool> IsElementVisibleAsync(string selector)
    {
        try
        {
            var element = Page.Locator(selector);
            return await element.IsVisibleAsync();
        }
        catch
        {
            return false;
        }
    }

    protected async Task ClickAsync(string selector)
    {
        var element = Page.Locator(selector);
        await element.ClickAsync();
    }

    protected async Task TypeAsync(string selector, string text)
    {
        var element = Page.Locator(selector);
        await element.FillAsync(text);
    }

    protected async Task<string> GetTextAsync(string selector)
    {
        var element = Page.Locator(selector);
        return await element.TextContentAsync() ?? string.Empty;
    }
}