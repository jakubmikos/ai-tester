using Microsoft.Playwright;

namespace PerfectDraftTests.Support;

public class WebDriverFactory : IDisposable
{
    private IBrowserContext? _context;
    private IPage? _page;
    private readonly TestConfiguration _config;
    private readonly SharedBrowserManager _sharedBrowser;

    public WebDriverFactory()
    {
        _config = TestConfiguration.Instance;
        _sharedBrowser = SharedBrowserManager.Instance;
    }

    public async Task<IPage> InitializeAsync(string browserType = "")
    {
        var browser = await _sharedBrowser.GetBrowserAsync(browserType);

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

        _context = await browser.NewContextAsync(contextOptions);
        _context.SetDefaultTimeout(_config.Timeout);
        
        _page = await _context.NewPageAsync();
        
        return _page;
    }

    public async Task<IPage> InitializeMobileAsync(string deviceName = "iPhone 13")
    {
        var browser = await _sharedBrowser.GetBrowserAsync("chromium");
        
        var device = Microsoft.Playwright.Playwright.CreateAsync().Result.Devices[deviceName];

        var contextOptions = new BrowserNewContextOptions(device);
        
        if (_config.RecordVideo)
        {
            var videoDir = Path.Combine(Directory.GetCurrentDirectory(), _config.VideoDir);
            Directory.CreateDirectory(videoDir);
            
            contextOptions.RecordVideoDir = videoDir;
            contextOptions.RecordVideoSize = device.RecordVideoSize;
        }

        _context = await browser.NewContextAsync(contextOptions);
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
    }

    public void Dispose()
    {
        CloseAsync().GetAwaiter().GetResult();
        GC.SuppressFinalize(this);
    }
}