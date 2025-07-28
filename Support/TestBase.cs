using Microsoft.Playwright;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace PerfectDraftTests.Support;

[TestClass]
public abstract class TestBase
{
    protected WebDriverFactory? WebDriverFactory;
    protected IPage? Page;
    protected TestConfiguration Config;
    protected TestDataManager TestData;

    public TestContext? TestContext { get; set; }

    protected TestBase()
    {
        Config = TestConfiguration.Instance;
        TestData = TestDataManager.Instance;
    }

    [TestInitialize]
    public virtual async Task SetUpAsync()
    {
        WebDriverFactory = new WebDriverFactory();
        Page = await WebDriverFactory.InitializeAsync();
    }

    [TestCleanup]
    public virtual async Task TearDownAsync()
    {
        if (TestContext?.CurrentTestOutcome == UnitTestOutcome.Failed)
        {
            await TakeScreenshotOnFailureAsync();
        }

        if (WebDriverFactory != null)
        {
            await WebDriverFactory.CloseAsync();
            WebDriverFactory.Dispose();
        }
    }

    protected virtual async Task TakeScreenshotOnFailureAsync()
    {
        try
        {
            if (Page != null && TestContext != null)
            {
                var screenshotPath = Path.Combine(
                    TestContext.TestResultsDirectory ?? "Screenshots",
                    $"{TestContext.TestName}_{DateTime.Now:yyyyMMdd_HHmmss}_FAILED.png"
                );

                Directory.CreateDirectory(Path.GetDirectoryName(screenshotPath) ?? "Screenshots");

                await Page.ScreenshotAsync(new PageScreenshotOptions
                {
                    Path = screenshotPath,
                    FullPage = true
                });

                TestContext.WriteLine($"Screenshot saved: {screenshotPath}");
            }
        }
        catch (Exception ex)
        {
            TestContext?.WriteLine($"Failed to take screenshot: {ex.Message}");
        }
    }

    protected async Task NavigateToHomePageAsync()
    {
        if (Page != null)
        {
            await Page.GotoAsync(Config.BaseUrl);
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        }
    }

    protected async Task NavigateToCountryPageAsync(string countryName)
    {
        var countryData = TestData.GetCountryData(countryName);
        if (Page != null)
        {
            await Page.GotoAsync(countryData.Url);
            await Page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        }
    }
}