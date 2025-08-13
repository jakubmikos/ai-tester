/** Generated from: src\features\search.feature */
import { test } from "playwright-bdd";

test.describe("Product Search", () => {

  test.beforeEach(async ({ Given, page, And }) => {
    await Given("I navigate to the PerfectDraft website", null, { page });
    await And("I am on the UK website", null, { page });
  });

  test("Search for specific products", { tag: ["@PerfectDraft", "@Search", "@P1", "@Regression"] }, async ({ When, page, And, Then }) => {
    await When("I enter \"Stella\" in the search box", null, { page });
    await And("I click the search button", null, { page });
    await Then("I should see search results containing \"Stella\" products", null, { page });
    await And("the results should include both kegs and bundles", null, { page });
    await And("I should be able to filter the search results", null, { page });
    await When("I enter \"InvalidProductName123\" in the search box", null, { page });
    await And("I click the search button", null, { page });
    await Then("I should see a \"no results found\" message", null, { page });
    await And("I should see suggestions for alternative searches", null, { page });
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use("src\\features\\search.feature"),
  $bddFileMeta: ({}, use) => use(bddFileMeta),
});

const bddFileMeta = {
  "Search for specific products": {"pickleLocation":"12:1","tags":["@PerfectDraft","@Search","@P1","@Regression"],"ownTags":["@Regression","@Search","@P1"]},
};