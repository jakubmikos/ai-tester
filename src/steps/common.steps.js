import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

/**
 * Generic button click step that tries multiple selector strategies
 * Priority order:
 * 1. data-testid attribute
 * 2. data-name attribute  
 * 3. aria-label attribute
 * 4. name attribute
 * 5. text content
 */
When('I click the {string} button', async ({ page }, buttonIdentifier) => {
    // Strategy 1: Try data-testid
    let button = page.locator(`[data-testid="${buttonIdentifier}"]`);
    
    if (await button.count() === 0) {
        // Strategy 2: Try data-name
        button = page.locator(`[data-name="${buttonIdentifier}"]`);
    }
    
    if (await button.count() === 0) {
        // Strategy 3: Try aria-label
        button = page.locator(`[aria-label="${buttonIdentifier}"]`);
    }
    
    if (await button.count() === 0) {
        // Strategy 4: Try name attribute
        button = page.locator(`[name="${buttonIdentifier}"]`);
    }
    
    if (await button.count() === 0) {
        // Strategy 5: Try by text (for button elements and role="button")
        button = page.locator(`button:has-text("${buttonIdentifier}"), [role="button"]:has-text("${buttonIdentifier}")`);
    }
    
    if (await button.count() === 0) {
        // Strategy 6: Try partial text match as fallback
        button = page.getByRole('button', { name: buttonIdentifier });
    }

    if (await button.count() === 0) {
        // Strategy 7: Try partial text match as fallback
        button = page.getByRole('button', { title: buttonIdentifier });
    }
    
    // Ensure we found exactly one button
    const count = await button.count();
    if (count === 0) {
        throw new Error(`Button "${buttonIdentifier}" not found using any selector strategy`);
    }
    if (count > 1) {
        button = button.first();
        //throw new Error(`Found ${count} buttons matching "${buttonIdentifier}". Please use a more specific identifier`);
    }
    
    // Wait for button to be visible and enabled
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await expect(button).toBeEnabled();
    
    // Click the button
    await button.click();
});
