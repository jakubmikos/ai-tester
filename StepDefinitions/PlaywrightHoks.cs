using Microsoft.Playwright;
using PerfectDraftTests.Support;
using Reqnroll;

[Binding]
public class PlaywrightHooks
{
    protected readonly ScenarioContext ScenarioContext;

    private IPlaywright playwright = null!;
    private IBrowser browser = null!;
    private IBrowserContext context = null!;

    protected IPage Page
    {
        get => this.GetFromScenarioContext<IPage>("MyPage");
        set => this.AddToScenarioContext(value, "MyPage");
    }

    public PlaywrightHooks(ScenarioContext scenarioContext)
    {
        ScenarioContext = scenarioContext;
    }

    [BeforeScenario]
    public async Task InitializeAsync()
    {
        Console.WriteLine("beofre scenrio mf");
        playwright = await Playwright.CreateAsync();

        var browserOptions = new BrowserTypeLaunchOptions
        {
            Headless = TestConfiguration.Instance.Headless,
            SlowMo = TestConfiguration.Instance.SlowMo,
        };

        browser = await playwright.Chromium.LaunchAsync(browserOptions);

        var contextOptions = new BrowserNewContextOptions
        {
            ViewportSize = new ViewportSize
            {
                Width = TestConfiguration.Instance.ViewportWidth,
                Height = TestConfiguration.Instance.ViewportHeight
            }
        };

        if (TestConfiguration.Instance.RecordVideo)
        {
            var videoDir = Path.Combine(Directory.GetCurrentDirectory(), TestConfiguration.Instance.VideoDir);
            Directory.CreateDirectory(videoDir);

            contextOptions.RecordVideoDir = videoDir;
            contextOptions.RecordVideoSize = new RecordVideoSize
            {
                Width = TestConfiguration.Instance.ViewportWidth,
                Height = TestConfiguration.Instance.ViewportHeight
            };
        }

        context = await browser.NewContextAsync(contextOptions);
        context.SetDefaultTimeout(TestConfiguration.Instance.Timeout);


        Page = await context.NewPageAsync();
    }

    [AfterScenario]
    public async Task DisposeAsync()
    {
        await context.CloseAsync();
        await browser.CloseAsync();

        playwright.Dispose();
    }

    private T GetFromScenarioContext<T>(string? name = null)
    {
        Console.WriteLine(" get MyPage");
        var propertyName = name ?? typeof(T).Name;
        if (!ScenarioContext.ContainsKey(propertyName))
        {
            throw new ArgumentException($"No property [{propertyName}] found in the scenario context.");
        }

        return ScenarioContext.Get<T>(name);
    }

    private void AddToScenarioContext<T>(T contextItem, string? name = null)
    {
        Console.WriteLine("add MyPage");
        var propertyName = name ?? typeof(T).Name;

        if (!ScenarioContext.ContainsKey(name!))
        {
            ScenarioContext.Add(propertyName, contextItem);
        }
    }
}
