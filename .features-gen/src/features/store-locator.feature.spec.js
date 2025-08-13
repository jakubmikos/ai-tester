/** Generated from: src\features\store-locator.feature */
import { test } from "playwright-bdd";

test.describe("Store Locator", () => {

  test.beforeEach(async ({ Given, page, And }) => {
    await Given("I navigate to the PerfectDraft website", null, { page });
    await And("I am on the UK website", null, { page });
  });

  test("Find Community Store locations", { tag: ["@PerfectDraft", "@StoreLocator", "@P3", "@CommunityStore", "@Regression"] }, async ({ When, page, And, Then }) => {
    await When("I navigate to \"Community Store Network\"", null, { page });
    await And("I enter postcode \"SW1A 1AA\"", null, { page });
    await And("I click \"Find Stores\" for store search", null, { page });
    await Then("I should see a list of nearby Community Stores", null, { page });
    await And("each store should show:", {"dataTable":{"rows":[{"cells":[{"value":"Store Information"}]},{"cells":[{"value":"Store name"}]},{"cells":[{"value":"Address"}]},{"cells":[{"value":"Distance"}]},{"cells":[{"value":"Opening hours"}]},{"cells":[{"value":"Available services"}]}]}}, { page });
    await And("I should be able to get directions to selected stores", null, { page });
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use("src\\features\\store-locator.feature"),
  $bddFileMeta: ({}, use) => use(bddFileMeta),
});

const bddFileMeta = {
  "Find Community Store locations": {"pickleLocation":"12:1","tags":["@PerfectDraft","@StoreLocator","@P3","@CommunityStore","@Regression"],"ownTags":["@Regression","@CommunityStore","@P3"]},
};