namespace PerfectDraftTests.Support;

public class TestDataManager
{
    private readonly TestConfiguration _config;
    private static TestDataManager? _instance;

    private TestDataManager()
    {
        _config = TestConfiguration.Instance;
    }

    public static TestDataManager Instance => _instance ??= new TestDataManager();

    public class UserData
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string DateOfBirth { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public AddressData Address { get; set; } = new();
    }

    public class AddressData
    {
        public string AddressLine1 { get; set; } = string.Empty;
        public string AddressLine2 { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Postcode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
    }

    public class PaymentData
    {
        public string CardNumber { get; set; } = string.Empty;
        public string ExpiryDate { get; set; } = string.Empty;
        public string Cvv { get; set; } = string.Empty;
        public string CardholderName { get; set; } = string.Empty;
    }

    public class ProductData
    {
        public string Name { get; set; } = string.Empty;
        public string Price { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class CountryData
    {
        public string Name { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;
        public string Language { get; set; } = string.Empty;
    }

    public UserData GetDefaultTestUser()
    {
        return new UserData
        {
            Email = _config.TestEmail,
            Password = _config.TestPassword,
            FirstName = "John",
            LastName = "Doe",
            DateOfBirth = "15/06/1990",
            PhoneNumber = _config.TestPhoneNumber,
            Address = GetDefaultTestAddress()
        };
    }

    public UserData GetGuestUser()
    {
        return new UserData
        {
            Email = _config.GuestEmail,
            FirstName = "Jane",
            LastName = "Smith",
            PhoneNumber = _config.TestPhoneNumber,
            Address = GetDefaultTestAddress()
        };
    }

    public UserData GetUserWithEmail(string email)
    {
        var user = GetDefaultTestUser();
        user.Email = email;
        return user;
    }

    public AddressData GetDefaultTestAddress()
    {
        return new AddressData
        {
            AddressLine1 = "123 Test Street",
            AddressLine2 = "Flat 1",
            City = "London",
            Postcode = _config.TestPostcode,
            Country = "United Kingdom"
        };
    }

    public PaymentData GetDefaultPaymentData()
    {
        return new PaymentData
        {
            CardNumber = "4532123456789012",
            ExpiryDate = "12/25",
            Cvv = "123",
            CardholderName = "John Doe"
        };
    }

    public ProductData GetStellaArtoisKeg()
    {
        return new ProductData
        {
            Name = "Stella Artois 6L Keg",
            Price = _config.GetProductPrice("StellaArtoisKeg"),
            Brand = "Stella Artois",
            Description = "Premium Belgian lager in 6L keg format"
        };
    }

    public CountryData GetCountryData(string countryName)
    {
        return countryName switch
        {
            "United Kingdom" => new CountryData
            {
                Name = "United Kingdom",
                Url = _config.GetCountryUrl("UnitedKingdom"),
                Currency = _config.GetCountryCurrency("UnitedKingdom"),
                Language = _config.GetCountryLanguage("UnitedKingdom")
            },
            "Deutschland" => new CountryData
            {
                Name = "Deutschland",
                Url = _config.GetCountryUrl("Deutschland"),
                Currency = _config.GetCountryCurrency("Deutschland"),
                Language = _config.GetCountryLanguage("Deutschland")
            },
            "France" => new CountryData
            {
                Name = "France",
                Url = _config.GetCountryUrl("France"),
                Currency = _config.GetCountryCurrency("France"),
                Language = _config.GetCountryLanguage("France")
            },
            "United States" => new CountryData
            {
                Name = "United States",
                Url = _config.GetCountryUrl("UnitedStates"),
                Currency = _config.GetCountryCurrency("UnitedStates"),
                Language = _config.GetCountryLanguage("UnitedStates")
            },
            _ => throw new ArgumentException($"Country data not found for: {countryName}")
        };
    }

    public List<string> GetValidEmailFormats()
    {
        return new List<string>
        {
            "user@example.com",
            "user.name@example.co.uk",
            "user+tag@example.org",
            "user123@test-domain.com"
        };
    }

    public List<string> GetInvalidEmailFormats()
    {
        return new List<string>
        {
            "invalid-email",
            "@example.com",
            "user@",
            "user..name@example.com"
        };
    }

    public Dictionary<string, string> GetBeerTokenScenarios()
    {
        return new Dictionary<string, string>
        {
            { "user1@example.com", "£10.00" },
            { "user2@example.com", "£15.00" },
            { "user3@example.com", "£5.00" }
        };
    }

    public List<string> GetNavigationMenuItems()
    {
        return new List<string>
        {
            "Machines",
            "Kegs",
            "Bundles",
            "Community",
            "Account"
        };
    }

    public List<string> GetAvailableRegions()
    {
        return new List<string> { "Europe", "America" };
    }

    public List<string> GetCountryOptions()
    {
        return new List<string>
        {
            "United Kingdom",
            "Deutschland",
            "United States"
        };
    }
}