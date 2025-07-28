using Microsoft.Playwright;

namespace PerfectDraftTests.Support;

public class WebDriverFactory : IDisposable
{
    private IPlaywright? _playwright;
    private IBrowser? _browser;
    private IBrowserContext? _context;
    private IPage? _page;
    private readonly TestConfiguration _config;

    public WebDriverFactory()
    {
        _config = TestConfiguration.Instance;
    }

    public async Task<IPage> InitializeAsync(string browserType = "")
    {
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

        var contextOptions = new BrowserNewContextOptions
        {
            ViewportSize = new ViewportSize
            {
                Width = _config.ViewportWidth,
                Height = _config.ViewportHeight
            }
        };

        if (_config.RecordVideo)
        {
            var videoDir = Path.Combine(Directory.GetCurrentDirectory(), _config.VideoDir);
            Directory.CreateDirectory(videoDir);
            
            contextOptions.RecordVideoDir = videoDir;
            contextOptions.RecordVideoSize = new RecordVideoSize
            {
                Width = _config.ViewportWidth,
                Height = _config.ViewportHeight
            };
        }

        _context = await _browser.NewContextAsync(contextOptions);
        _context.SetDefaultTimeout(_config.Timeout);
        
        _page = await _context.NewPageAsync();
        
        return _page;
    }

    public async Task<IPage> InitializeMobileAsync(string deviceName = "iPhone 13")
    {
        _playwright = await Playwright.CreateAsync();
        
        var device = _playwright.Devices[deviceName];
        
        _browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
        {
            Headless = _config.Headless,
            SlowMo = _config.SlowMo
        });

        var contextOptions = new BrowserNewContextOptions(device);
        
        if (_config.RecordVideo)
        {
            var videoDir = Path.Combine(Directory.GetCurrentDirectory(), _config.VideoDir);
            Directory.CreateDirectory(videoDir);
            
            contextOptions.RecordVideoDir = videoDir;
            contextOptions.RecordVideoSize = device.RecordVideoSize;
        }

        _context = await _browser.NewContextAsync(contextOptions);
        _context.SetDefaultTimeout(_config.Timeout);
        
        _page = await _context.NewPageAsync();
        
        return _page;
    }

    public async Task<IPage> InitializeTabletAsync()
    {
        return await InitializeMobileAsync("iPad Pro");
    }

    public IPage? Page => _page;
    public IBrowserContext? Context => _context;

    public async Task CloseAsync()
    {
        if (_page != null)
        {
            await _page.CloseAsync();
            _page = null;
        }

        if (_context != null)
        {
            await _context.CloseAsync();
            _context = null;
        }

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