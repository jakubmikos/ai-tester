using Microsoft.Playwright;

namespace PerfectDraftTests.Support;

public class SharedBrowserManager : IDisposable
{
    private static SharedBrowserManager? _instance;
    private static readonly object Lock = new();
    
    private IPlaywright? _playwright;
    private IBrowser? _browser;
    private readonly TestConfiguration _config;

    private SharedBrowserManager()
    {
        _config = TestConfiguration.Instance;
    }

    public static SharedBrowserManager Instance
    {
        get
        {
            if (_instance == null)
            {
                lock (Lock)
                {
                    _instance ??= new SharedBrowserManager();
                }
            }
            return _instance;
        }
    }

    public async Task<IBrowser> GetBrowserAsync(string browserType = "")
    {
        if (_browser != null)
            return _browser;

        browserType = string.IsNullOrEmpty(browserType) ? _config.DefaultBrowser : browserType;

        _playwright = await Playwright.CreateAsync();
        
        var launchOptions = new BrowserTypeLaunchOptions
        {
            Headless = _config.Headless,
            SlowMo = _config.SlowMo
        };

        _browser = browserType.ToLower() switch
        {
            "firefox" => await _playwright.Firefox.LaunchAsync(launchOptions),
            "webkit" => await _playwright.Webkit.LaunchAsync(launchOptions),
            "chromium" or _ => await _playwright.Chromium.LaunchAsync(launchOptions)
        };

        return _browser;
    }

    public async Task CloseAsync()
    {
        if (_browser != null)
        {
            await _browser.CloseAsync();
            _browser = null;
        }

        if (_playwright != null)
        {
            _playwright.Dispose();
            _playwright = null;
        }
    }

    public void Dispose()
    {
        CloseAsync().GetAwaiter().GetResult();
        GC.SuppressFinalize(this);
    }
}