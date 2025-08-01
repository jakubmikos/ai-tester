using Microsoft.Playwright;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Allure.Net.Commons;

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
        var testFailed = TestContext?.CurrentTestOutcome == UnitTestOutcome.Failed;
        
        if (testFailed)
        {
            await TakeScreenshotOnFailureAsync();
        }

        await HandleVideoRecordingAsync(testFailed);

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

                var screenshotBytes = await Page.ScreenshotAsync(new PageScreenshotOptions
                {
                    Path = screenshotPath,
                    FullPage = false
                });

                // Attach screenshot to Allure report
                AllureApi.AddAttachment("Screenshot on Failure", "image/png", screenshotBytes, ".png");

                TestContext.WriteLine($"Screenshot saved: {screenshotPath}");
            }
        }
        catch (Exception ex)
        {
            TestContext?.WriteLine($"Failed to take screenshot: {ex.Message}");
        }
    }

    protected virtual async Task HandleVideoRecordingAsync(bool testFailed)
    {
        if (!Config.RecordVideo || Page == null || TestContext == null)
            return;

        try
        {
            var shouldKeepVideo = Config.VideoMode switch
            {
                "always" => true,
                "retain-on-failure" => testFailed,
                "never" => false,
                _ => testFailed
            };

            if (shouldKeepVideo)
            {
                var videoPath = await this.Page.Video?.PathAsync()!;
                
                if (!string.IsNullOrEmpty(videoPath) && File.Exists(videoPath))
                {
                    var finalVideoDir = Path.Combine(
                        TestContext.TestResultsDirectory ?? Config.VideoDir,
                        "videos"
                    );
                    Directory.CreateDirectory(finalVideoDir);

                    var finalVideoPath = Path.Combine(
                        finalVideoDir,
                        $"{TestContext.TestName}_{DateTime.Now:yyyyMMdd_HHmmss}.webm"
                    );

                    await Page.CloseAsync();
                    
                    // Wait a moment for the video to be finalized
                    await Task.Delay(1000);
                    
                    if (File.Exists(videoPath))
                    {
                        File.Move(videoPath, finalVideoPath);
                        TestContext.WriteLine($"Test video saved: {finalVideoPath}");
                    }
                }
            }
        }
        catch (Exception ex)
        {
            TestContext.WriteLine($"Failed to handle video recording: {ex.Message}");
        }
    }

    protected async Task NavigateToHomePageAsync()
    {
        if (Page != null)
        {
            await Page.GotoAsync(Config.BaseUrl);
            await Page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);
        }
    }

    protected async Task NavigateToCountryPageAsync(string countryName)
    {
        var countryData = TestData.GetCountryData(countryName);
        if (Page != null)
        {
            await Page.GotoAsync(countryData.Url);
            await Page.WaitForLoadStateAsync(LoadState.DOMContentLoaded);
        }
    }
}