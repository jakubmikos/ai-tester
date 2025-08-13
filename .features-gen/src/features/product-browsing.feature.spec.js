/** Generated from: src\features\product-browsing.feature */
import { test } from "playwright-bdd";

test.describe("Product Browsing", () => {

  test.beforeEach(async ({ Given, page, And }) => {
    await Given("I navigate to the PerfectDraft website", null, { page });
    await And("I am on the UK website", null, { page });
  });

  test("Browse beer kegs catalog", { tag: ["@PerfectDraft", "@ProductBrowsing", "@P1", "@Smoke"] }, async ({ When, page, Then, And }) => {
    await When("I navigate to the \"Beer Kegs\" section", null, { page });
    await Then("I should see a list of available beer kegs", null, { page });
    await And("each keg should display basic information", null, { page });
    await And("I should be able to filter by beer type", null, { page });
    await And("I should be able to sort by price or popularity", null, { page });
  });

  test("View PerfectDraft machine options", { tag: ["@PerfectDraft", "@ProductBrowsing", "@P1", "@Smoke"] }, async ({ When, page, Then }) => {
    await When("I navigate to the \"PerfectDraft Machines\" section", null, { page });
    await Then("I should see all machine types:", {"dataTable":{"rows":[{"cells":[{"value":"Machine Type"}]},{"cells":[{"value":"PerfectDraft"}]},{"cells":[{"value":"PerfectDraft Pro"}]},{"cells":[{"value":"PerfectDraft Black"}]}]}}, { page });
    await When("I click on a machine to view details", null, { page });
    await Then("I should see machine specifications including keg size", null, { page });
  });

  test("View detailed product information", { tag: ["@PerfectDraft", "@ProductBrowsing", "@P1", "@ProductDetails", "@Regression"] }, async ({ When, page, And, Then }) => {
    await When("I navigate to the \"Kegs\" section", null, { page });
    await And("I click on a beer keg \"Stella Artois 6L Keg\"", null, { page });
    await Then("I should see the product detail page", null, { page });
    await And("I should see detailed product information:", {"dataTable":{"rows":[{"cells":[{"value":"Detail Type"}]},{"cells":[{"value":"Product images"}]},{"cells":[{"value":"Full description"}]},{"cells":[{"value":"ABV and volume"}]},{"cells":[{"value":"Price information"}]},{"cells":[{"value":"Stock availability"}]},{"cells":[{"value":"Customer reviews"}]}]}}, { page });
    await And("I should see an \"Add to Cart\" button", null, { page });
    await And("I should see related product recommendations", null, { page });
  });

  test("View promotional keg packs", { tag: ["@PerfectDraft", "@ProductBrowsing", "@P2", "@PromotionalOffers", "@Regression"] }, async ({ When, page, Then, And }) => {
    await When("I navigate to promotional keg packs", null, { page });
    await Then("I should see current offers like \"Match Day Keg Pack\"", null, { page });
    await And("I should see pricing options:", {"dataTable":{"rows":[{"cells":[{"value":"Pack Size"},{"value":"Price"}]},{"cells":[{"value":"2 kegs"},{"value":"£60.00"}]},{"cells":[{"value":"3 kegs"},{"value":"£85.00"}]}]}}, { page });
    await When("I select \"3 kegs for £85.00\" keg pack", null, { page });
    await Then("I should be able to choose from available keg options", null, { page });
    await And("I should see the discount calculation", null, { page });
    await And("promotional terms should be clearly displayed", null, { page });
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use("src\\features\\product-browsing.feature"),
  $bddFileMeta: ({}, use) => use(bddFileMeta),
});

const bddFileMeta = {
  "Browse beer kegs catalog": {"pickleLocation":"12:1","tags":["@PerfectDraft","@ProductBrowsing","@P1","@Smoke"],"ownTags":["@Smoke","@ProductBrowsing","@P1"]},
  "View PerfectDraft machine options": {"pickleLocation":"20:1","tags":["@PerfectDraft","@ProductBrowsing","@P1","@Smoke"],"ownTags":["@Smoke","@ProductBrowsing","@P1"]},
  "View detailed product information": {"pickleLocation":"31:1","tags":["@PerfectDraft","@ProductBrowsing","@P1","@ProductDetails","@Regression"],"ownTags":["@Regression","@ProductDetails","@P1"]},
  "View promotional keg packs": {"pickleLocation":"47:1","tags":["@PerfectDraft","@ProductBrowsing","@P2","@PromotionalOffers","@Regression"],"ownTags":["@Regression","@PromotionalOffers","@P2"]},
};