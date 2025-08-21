/** Generated from: src\features\checkout.feature */
import { test } from "playwright-bdd";

test.describe("Checkout Process", () => {

  test.beforeEach(async ({ Given, page, And }) => {
    await Given("I navigate to the PerfectDraft website", null, { page });
    await And("I am on the UK website", null, { page });
  });

  test("Incomplete (up to payment) checkout process as guest user", { tag: ["@PerfectDraft", "@Checkout", "@P1", "@Critical"] }, async ({ Given, page, When, And, Then }) => {
    await Given("I am not logged in", null, { page });
    await When("I navigate to the \"Kegs\" section", null, { page });
    await And("I add \"PerfectDraft Stella Artois 6L Keg\" to the cart", null, { page });
    await And("I proceed to checkout", null, { page });
    await And("I select \"Checkout as Guest\" checkout option", null, { page });
    await And("I fill in guest checkout information with email \"guest.user@example.com\":", {"dataTable":{"rows":[{"cells":[{"value":"Field"},{"value":"Value"}]},{"cells":[{"value":"First Name"},{"value":"Jane"}]},{"cells":[{"value":"Last Name"},{"value":"Smith"}]},{"cells":[{"value":"Phone Number"},{"value":"7708900123"}]},{"cells":[{"value":"Address Line 1"},{"value":"123 Test Street"}]},{"cells":[{"value":"City"},{"value":"London"}]},{"cells":[{"value":"Postcode"},{"value":"SW1A 1AA"}]}]}}, { page });
    await And("I click \"Continue to payment\" button", null, { page });
    await Then("I should see a payment page", null, { page });
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use("src\\features\\checkout.feature"),
  $bddFileMeta: ({}, use) => use(bddFileMeta),
});

const bddFileMeta = {
  "Incomplete (up to payment) checkout process as guest user": {"pickleLocation":"12:1","tags":["@PerfectDraft","@Checkout","@P1","@Critical"],"ownTags":["@Critical","@Checkout","@P1"]},
};