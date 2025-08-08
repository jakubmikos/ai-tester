using Microsoft.Playwright;
using System.Threading.Tasks;

namespace PerfectDraftTests.PageObjects
{
    public class ShoppingCartPage : BasePage
    {
        // Cart selectors - updated based on PerfectDraft website inspection
        private const string CartIcon = ".counter.qty, .minicart-wrapper, .cart-icon, button:has-text('£')";
        private const string CartCounter = ".counter.qty .counter-number, .counter-number, .badge";
        private const string EmptyCartMessage = ":has-text('Your cart is empty'), :has-text('You have no items')";
        private const string CartItems = ".minicart-items .product-item, .cart-item, .product";
        private const string ProductName = ".product-name, .product-item-name, .item-name";
        private const string ProductImage = ".product-image img, .item-image img";
        private const string ProductQuantity = "input[name*='qty'], .qty input, .quantity input";
        private const string ProductPrice = ".price, .item-price, .subtotal";
        private const string RemoveButton = ".action.delete, .remove-item, .action:has-text('Remove')";
        private const string UpdateButton = ".action.update, .update-item, button:has-text('Update')";
        private const string ViewCartButton = ".action.viewcart, .view-cart, button:has-text('View Cart')";
        private const string CartDropdown = ".minicart-content, .cart-dropdown, .dropdown-menu, div[role='dialog']";
        private const string CartTotal = ".subtotal .price, .total-price, .grand-total .price";
        private const string ConfirmationMessage = ".message.success, .alert.success, .notification.success";

        public ShoppingCartPage(IPage page) : base(page)
        {
        }

        public async Task<bool> IsCartEmpty()
        {
            try
            {
                // Check if empty cart message is visible or cart counter shows 0
                var emptyMessage = await Page.Locator(EmptyCartMessage).IsVisibleAsync();
                if (emptyMessage) return true;

                var counterText = await GetCartItemCount();
                return counterText == 0;
            }
            catch
            {
                return true;
            }
        }

        public async Task<int> GetCartItemCount()
        {
            try
            {
                // Wait a moment for cart to update after product addition
                await Page.WaitForTimeoutAsync(1000);
                
                // Try multiple selectors for cart counter
                var possibleSelectors = new[]
                {
                    ".counter.qty .counter-number",
                    ".counter-number",
                    ".badge",
                    ".counter.qty",
                    ".minicart-wrapper .counter",
                    ".cart-counter",
                    "[data-role='cart-qty']",
                    ".qty-container .counter"
                };
                
                foreach (var selector in possibleSelectors)
                {
                    try
                    {
                        var elements = await Page.Locator(selector).AllAsync();
                        foreach (var element in elements)
                        {
                            if (await element.IsVisibleAsync())
                            {
                                var text = await element.TextContentAsync();
                                if (!string.IsNullOrEmpty(text))
                                {
                                    // Extract number from text (could be "1" or "1 item" etc.)
                                    var numberOnly = System.Text.RegularExpressions.Regex.Match(text.Trim(), @"\d+").Value;
                                    if (int.TryParse(numberOnly, out int count) && count > 0)
                                    {
                                        Console.WriteLine($"Found cart count {count} using selector: {selector}");
                                        return count;
                                    }
                                }
                            }
                        }
                    }
                    catch
                    {
                        // Try next selector
                    }
                }
                
                // If no specific counter found, try to detect if cart has items by checking cart content
                try
                {
                    var cartItems = await Page.Locator(CartItems).CountAsync();
                    if (cartItems > 0)
                    {
                        Console.WriteLine($"No cart counter found, but detected {cartItems} items in cart content");
                        return cartItems;
                    }
                }
                catch
                {
                    // Continue to return 0
                }
                
                Console.WriteLine("No cart counter found and no items detected");
                return 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting cart count: {ex.Message}");
                return 0;
            }
        }

        public async Task ClickCartIcon()
        {
            await Page.Locator(CartIcon).First.ClickAsync();
            
            // Wait for cart dropdown to appear with more flexibility
            try
            {
                await Page.WaitForSelectorAsync(CartDropdown, new() { State = WaitForSelectorState.Visible, Timeout = 3000 });
            }
            catch (TimeoutException)
            {
                // If dropdown doesn't appear, cart might already be visible or use different structure
                // Continue without error - the verification in the test will catch issues
            }
        }

        public async Task<bool> IsProductInCart(string productName)
        {
            try
            {
                var productLocator = Page.Locator(ProductName).Filter(new() { HasText = productName });
                return await productLocator.IsVisibleAsync();
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> VerifyCartContents()
        {
            try
            {
                // Check if essential cart elements are visible
                var hasProductName = await Page.Locator(ProductName).First.IsVisibleAsync();
                var hasProductImage = await Page.Locator(ProductImage).First.IsVisibleAsync();
                var hasQuantity = await Page.Locator(ProductQuantity).First.IsVisibleAsync();
                var hasPrice = await Page.Locator(ProductPrice).First.IsVisibleAsync();

                return hasProductName && hasQuantity && hasPrice;
            }
            catch
            {
                return false;
            }
        }

        public async Task UpdateQuantity(string productName, int quantity)
        {
            // Find the product item
            var productItem = Page.Locator(CartItems).Filter(new() { HasText = productName });
            
            // Find and update the quantity input within that product item
            var quantityInput = productItem.Locator(ProductQuantity).First;
            await quantityInput.FillAsync(quantity.ToString());
            
            // Click update button if exists
            var updateBtn = productItem.Locator(UpdateButton);
            if (await updateBtn.IsVisibleAsync())
            {
                await updateBtn.ClickAsync();
            }
        }

        public async Task RemoveProduct(string productName)
        {
            // Find the product item
            var productItem = Page.Locator(CartItems).Filter(new() { HasText = productName });
            
            // Click remove button for that product
            await productItem.Locator(RemoveButton).First.ClickAsync();
            
            // Wait for item to be removed
            await Page.WaitForTimeoutAsync(1000);
        }

        public async Task<string> GetCartTotal()
        {
            try
            {
                return await Page.Locator(CartTotal).First.TextContentAsync() ?? "£0.00";
            }
            catch
            {
                return "£0.00";
            }
        }

        public async Task ViewFullCart()
        {
            await Page.Locator(ViewCartButton).First.ClickAsync();
            await Page.WaitForURLAsync("**/checkout/cart**", new() { Timeout = 5000 });
        }

        public async Task<bool> IsConfirmationMessageVisible()
        {
            try
            {
                // Check for the cart popover that appears after adding items to cart
                var cartPopoverVisible = await Page.Locator(".minicart-popover.show-popover").IsVisibleAsync();
                if (cartPopoverVisible) return true;
                
                // Also check for traditional confirmation messages
                return await Page.Locator(ConfirmationMessage).IsVisibleAsync();
            }
            catch
            {
                return false;
            }
        }
    }
}