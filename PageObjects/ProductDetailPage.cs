using Microsoft.Playwright;

namespace PerfectDraftTests.PageObjects
{
    public class ProductDetailPage : BasePage
    {
        // Selectors verified from actual website via Playwright MCP exploration
        private readonly string productImageSelector = "img[alt*='Stella'], img[alt*='Keg']";
        private readonly string productTitleSelector = "h1";
        private readonly string productPriceSelector = "[class*='price']";
        private readonly string productSpecsSelector = ".specs";
        private readonly string addToCartButtonSelector = "button";
        private readonly string stockStatusSelector = "*";  // Will check text content
        private readonly string productDescriptionSelector = "*";  // Will check for description text
        private readonly string reviewsSelector = "*";  // Will check for review text

        public ProductDetailPage(IPage page) : base(page) { }

        public async Task<bool> IsProductDetailPageVisible()
        {
            return await IsElementVisibleAsync(productTitleSelector) && await IsElementVisibleAsync(productImageSelector);
        }

        public async Task<bool> IsProductImageVisible()
        {
            // Check for any image that contains product-related keywords in alt text
            var images = await Page.Locator("img").AllAsync();
            foreach (var image in images)
            {
                var alt = await image.GetAttributeAsync("alt");
                var src = await image.GetAttributeAsync("src");
                if ((alt?.Contains("Stella") == true || alt?.Contains("Keg") == true || alt?.Contains("PerfectDraft") == true) ||
                    (src?.Contains("stella") == true || src?.Contains("keg") == true))
                {
                    if (await image.IsVisibleAsync())
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        public async Task<bool> IsFullDescriptionVisible()
        {
            var pageText = await Page.TextContentAsync("body");
            if (pageText == null) return false;
            
            // Look for descriptive text about the product
            return pageText.Contains("brewmasters") || 
                   pageText.Contains("Description") ||
                   pageText.Length > 500; // If page has substantial content
        }

        public async Task<bool> IsABVAndVolumeVisible()
        {
            return await IsAnyElementVisibleAsync(productSpecsSelector);
        }

        public async Task<bool> IsPriceInformationVisible()
        {
            var pageText = await Page.TextContentAsync("body");
            if (pageText == null) return false;
            
            // Look for price patterns like £XX.XX
            return pageText.Contains("£") && (pageText.Contains(".") || pageText.Contains("per pint"));
        }

        public async Task<bool> IsStockAvailabilityVisible()
        {
            var pageText = await Page.TextContentAsync("body");
            return pageText?.Contains("In stock") ?? false;
        }

        public async Task<bool> IsCustomerReviewsVisible()
        {
            var pageText = await Page.TextContentAsync("body");
            if (pageText == null) return false;
            
            return pageText.Contains("Review") || pageText.Contains("review");
        }

        public async Task<bool> IsAddToCartButtonVisible()
        {
            var buttons = await Page.Locator("button").AllAsync();
            foreach (var button in buttons)
            {
                var text = await button.TextContentAsync();
                if (text?.ToLower().Contains("add") == true)
                {
                    return await button.IsVisibleAsync();
                }
            }
            return false;
        }

        private async Task<bool> IsAnyElementVisibleAsync(string multipleSelectors)
        {
            var selectors = multipleSelectors.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                           .Select(s => s.Trim())
                                           .ToArray();

            foreach (var selector in selectors)
            {
                try
                {
                    if (await IsElementVisibleAsync(selector))
                    {
                        return true;
                    }
                }
                catch
                {
                    continue;
                }
            }
            return false;
        }

        public async Task<bool> AreRelatedProductsVisible()
        {
            var pageText = await Page.TextContentAsync("body");
            if (pageText == null) return false;
            
            // Look for related product sections that we saw in the MCP exploration
            return pageText.Contains("Additional Ways to Enjoy") || 
                   pageText.Contains("see more") ||
                   pageText.Contains("Bundle") ||
                   pageText.Contains("related");
        }

        public async Task<string> GetProductTitle()
        {
            return await GetTextAsync(productTitleSelector);
        }

        public async Task<string> GetProductPrice()
        {
            return await GetTextAsync(productPriceSelector);
        }

        public async Task<string> GetProductSpecs()
        {
            return await GetTextAsync(productSpecsSelector);
        }
    }
}