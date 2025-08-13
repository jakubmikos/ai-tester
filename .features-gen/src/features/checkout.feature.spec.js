/** Generated from: src\features\checkout.feature */
import { test } from "playwright-bdd";

test.describe("Checkout Process", () => {

  test.beforeEach(async ({ Given, page, And }) => {
    await Given("I navigate to the PerfectDraft website", null, { page });
    await And("I am on the UK website", null, { page });
  });

  test("Complete checkout process as guest user", { tag: ["@PerfectDraft", "@Checkout", "@P1", "@Critical"] }, async ({ Given, page, And, When, Then }) => {
    await Given("I am not logged in", null, { page });
    await And("I have \"Stella Artois 6L Keg\" in my cart", null, { page });
    await When("I proceed to checkout", null, { page });
    await And("I select \"Checkout as Guest\" checkout option", null, { page });
    await And("I fill in guest checkout information with email \"guest.user@example.com\":", {"dataTable":{"rows":[{"cells":[{"value":"Field"},{"value":"Value"}]},{"cells":[{"value":"First Name"},{"value":"Jane"}]},{"cells":[{"value":"Last Name"},{"value":"Smith"}]},{"cells":[{"value":"Phone Number"},{"value":"+44 7700 900123"}]},{"cells":[{"value":"Address Line 1"},{"value":"123 Test Street"}]},{"cells":[{"value":"City"},{"value":"London"}]},{"cells":[{"value":"Postcode"},{"value":"SW1A 1AA"}]}]}}, { page });
    await And("I select \"Standard\" delivery", null, { page });
    await And("I enter valid payment details", null, { page });
    await And("I confirm age verification (18+)", null, { page });
    await And("I click \"Place Order\" button", null, { page });
    await Then("I should see an order confirmation page", null, { page });
    await And("I should receive an order confirmation email at \"guest.user@example.com\"", null, { page });
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use("src\\features\\checkout.feature"),
  $bddFileMeta: ({}, use) => use(bddFileMeta),
});

const bddFileMeta = {
  "Complete checkout process as guest user": {"pickleLocation":"12:1","tags":["@PerfectDraft","@Checkout","@P1","@Critical"],"ownTags":["@Critical","@Checkout","@P1"]},
};