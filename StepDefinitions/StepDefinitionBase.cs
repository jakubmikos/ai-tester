using Microsoft.Playwright;
using PerfectDraftTests.PageObjects;
using PerfectDraftTests.Support;
using Reqnroll;

namespace PerfectDraftTests.StepDefinitions;

public abstract class StepDefinitionBase
{
    protected readonly ScenarioContext ScenarioContext;
    protected readonly TestDataManager TestData;

    protected IPage Page
    {
        get => this.GetFromScenarioContext<IPage>("MyPage");
    }

    protected HomePage HomePage
    {
        get
        {
            return new HomePage(this.Page);
        }
    }

    protected ProductCatalogPage ProductCatalogPage
    {
        get
        {
            return new ProductCatalogPage(this.Page);
        }
    }

    protected StepDefinitionBase(ScenarioContext scenarioContext)
    {
        ScenarioContext = scenarioContext;
        TestData = TestDataManager.Instance;
    }

    protected async Task NavigateToAsync(string url)
    {
        await Page.GotoAsync(url);
        await Page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);
    }

    protected async Task WaitForElementAsync(string selector, int timeoutMs = 0)
    {
        var timeout = timeoutMs > 0 ? timeoutMs : TestConfiguration.Instance.Timeout;
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

    private T GetFromScenarioContext<T>(string? name = null)
    {
        var propertyName = name ?? typeof(T).Name;
        if (!ScenarioContext.ContainsKey(propertyName))
        {
            throw new ArgumentException($"No property [{propertyName}] found in the scenario context.");
        }

        return ScenarioContext.Get<T>(name);
    }
}
