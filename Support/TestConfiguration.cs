using Microsoft.Extensions.Configuration;

namespace PerfectDraftTests.Support;

public class TestConfiguration
{
    private static TestConfiguration? _instance;
    private readonly IConfiguration _configuration;

    private TestConfiguration()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("Configuration/appsettings.json", optional: false, reloadOnChange: true);

        _configuration = builder.Build();
    }

    public static TestConfiguration Instance => _instance ??= new TestConfiguration();

    public string BaseUrl => _configuration["TestSettings:BaseUrl"] ?? "https://www.perfectdraft.com";
    
    public string DefaultBrowser => _configuration["TestSettings:BrowserSettings:DefaultBrowser"] ?? "Chromium";
    
    public bool Headless => bool.Parse(_configuration["TestSettings:BrowserSettings:Headless"] ?? "false");
    
    public int SlowMo => int.Parse(_configuration["TestSettings:BrowserSettings:SlowMo"] ?? "100");
    
    public int Timeout => int.Parse(_configuration["TestSettings:BrowserSettings:Timeout"] ?? "30000");
    
    public int ViewportWidth => int.Parse(_configuration["TestSettings:BrowserSettings:ViewportWidth"] ?? "1920");
    
    public int ViewportHeight => int.Parse(_configuration["TestSettings:BrowserSettings:ViewportHeight"] ?? "1080");

    public bool RecordVideo => bool.Parse(_configuration["TestSettings:BrowserSettings:RecordVideo"] ?? "false");
    
    public string VideoDir => _configuration["TestSettings:BrowserSettings:VideoDir"] ?? "test-videos";
    
    public string VideoMode => _configuration["TestSettings:BrowserSettings:VideoMode"] ?? "retain-on-failure";

    public string TestEmail => _configuration["TestSettings:TestData:TestEmail"] ?? "test.user@example.com";
    
    public string TestPassword => _configuration["TestSettings:TestData:TestPassword"] ?? "SecurePassword123";
    
    public string GuestEmail => _configuration["TestSettings:TestData:GuestEmail"] ?? "guest.user@example.com";
    
    public string TestPostcode => _configuration["TestSettings:TestData:TestPostcode"] ?? "SW1A 1AA";
    
    public string TestPhoneNumber => _configuration["TestSettings:TestData:TestPhoneNumber"] ?? "+44 7700 900123";

    public int ShortWait => int.Parse(_configuration["TestSettings:WaitTimes:ShortWait"] ?? "5000");
    
    public int MediumWait => int.Parse(_configuration["TestSettings:WaitTimes:MediumWait"] ?? "10000");
    
    public int LongWait => int.Parse(_configuration["TestSettings:WaitTimes:LongWait"] ?? "30000");

    public string GetCountryUrl(string country) => 
        _configuration[$"TestSettings:Countries:{country}:Url"] ?? BaseUrl;

    public string GetCountryCurrency(string country) => 
        _configuration[$"TestSettings:Countries:{country}:Currency"] ?? "GBP";

    public string GetCountryLanguage(string country) => 
        _configuration[$"TestSettings:Countries:{country}:Language"] ?? "English";

    public string GetProductPrice(string product) => 
        _configuration[$"TestSettings:Products:{product}:Price"] ?? "£0.00";
}