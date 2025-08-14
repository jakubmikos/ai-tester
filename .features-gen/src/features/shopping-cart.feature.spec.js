/** Generated from: src\features\shopping-cart.feature */
import { test } from "playwright-bdd";

test.describe("Shopping Cart Management", () => {

  test.beforeEach(async ({ Given, page, And }) => {
    await Given("I navigate to the PerfectDraft website", null, { page });
    await And("I am on the UK website", null, { page });
  });

  test("Add products to shopping cart", { tag: ["@PerfectDraft", "@ShoppingCart", "@P1", "@Smoke"] }, async ({ Given, page, When, And, Then }) => {
    await Given("my cart is empty", null, { page });
    await When("I navigate to the \"Kegs\" section", null, { page });
    await And("I add \"PerfectDraft Stella Artois 6L Keg\" to the cart", null, { page });
    await Then("the cart counter should show quantity of at least \"1\"", null, { page });
    await And("I should see a confirmation message", null, { page });
    await When("I click on the cart icon", null, { page });
    await Then("I should see the cart contents with:", {"dataTable":{"rows":[{"cells":[{"value":"Cart Information"}]},{"cells":[{"value":"Product name"}]},{"cells":[{"value":"Product image"}]},{"cells":[{"value":"Quantity"}]},{"cells":[{"value":"Unit price"}]},{"cells":[{"value":"Total price"}]}]}}, { page });
  });

  test("Modify cart contents", { tag: ["@PerfectDraft", "@ShoppingCart", "@P1", "@Regression"] }, async ({ Given, page, When, And, Then }) => {
    await Given("I have \"Stella Artois 6L Keg\" in my cart", null, { page });
    await When("I view my cart", null, { page });
    await And("I increase the quantity to \"2\"", null, { page });
    await Then("the cart should show quantity of at least \"2\"", null, { page });
    await And("the total price should be updated accordingly", null, { page });
    await When("I click \"Remove\" for the item", null, { page });
    await Then("the cart should be empty", null, { page });
    await And("the cart should show quantity \"0\"", null, { page });
  });

  test("Add new Camden Hells keg to shopping cart", { tag: ["@PerfectDraft", "@ShoppingCart", "@P1", "@Smoke", "@NewProduct"] }, async ({ Given, page, When, And, Then }) => {
    await Given("my cart is empty", null, { page });
    await When("I navigate to the \"Kegs\" section", null, { page });
    await And("I add \"Camden Hells 6L Keg\" to the cart", null, { page });
    await When("I click on the cart icon", null, { page });
    await Then("I should see the cart contents with:", {"dataTable":{"rows":[{"cells":[{"value":"Cart Information"}]},{"cells":[{"value":"Product name"}]},{"cells":[{"value":"Product image"}]},{"cells":[{"value":"Quantity"}]},{"cells":[{"value":"Unit price"}]},{"cells":[{"value":"Total price"}]}]}}, { page });
    await And("the cart should show quantity of at least \"1\"", null, { page });
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use("src\\features\\shopping-cart.feature"),
  $bddFileMeta: ({}, use) => use(bddFileMeta),
});

const bddFileMeta = {
  "Add products to shopping cart": {"pickleLocation":"12:1","tags":["@PerfectDraft","@ShoppingCart","@P1","@Smoke"],"ownTags":["@Smoke","@ShoppingCart","@P1"]},
  "Modify cart contents": {"pickleLocation":"28:1","tags":["@PerfectDraft","@ShoppingCart","@P1","@Regression"],"ownTags":["@Regression","@ShoppingCart","@P1"]},
  "Add new Camden Hells keg to shopping cart": {"pickleLocation":"39:1","tags":["@PerfectDraft","@ShoppingCart","@P1","@Smoke","@NewProduct"],"ownTags":["@NewProduct","@Smoke","@ShoppingCart","@P1"]},
};