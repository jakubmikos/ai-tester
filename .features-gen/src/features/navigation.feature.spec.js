/** Generated from: src\features\navigation.feature */
import { test } from "playwright-bdd";

test.describe("Website Navigation", () => {

  test.beforeEach(async ({ Given, page }) => {
    await Given("I navigate to the PerfectDraft website", null, { page });
  });

  test("Select country from homepage", { tag: ["@PerfectDraft", "@Navigation", "@P1", "@CountrySelection", "@Smoke"] }, async ({ When, page, Then, And }) => {
    await When("I am on the country selection page", null, { page });
    await Then("I should see the available regions \"Europe\" and \"America\"", null, { page });
    await And("I should see country options including \"United Kingdom\", \"Deutschland\", \"United States\"", null, { page });
    await When("I select country \"United Kingdom\"", null, { page });
    await Then("I should be redirected to the UK website", null, { page });
    await And("the currency should be displayed in \"GBP\"", null, { page });
    await And("the language should be \"English\"", null, { page });
  });

  test.describe("Navigate to different country websites", () => {

    test("Example #1", { tag: ["@PerfectDraft", "@Navigation", "@P1", "@CountrySelection", "@Regression"] }, async ({ When, page, And, Then }) => {
      await When("I am on the country selection page", null, { page });
      await And("I select country \"United Kingdom\"", null, { page });
      await Then("I should be redirected to the \"United Kingdom\" website", null, { page });
      await And("the currency should be displayed in \"GBP\"", null, { page });
      await And("the language should be \"English\"", null, { page });
    });

    test("Example #2", { tag: ["@PerfectDraft", "@Navigation", "@P1", "@CountrySelection", "@Regression"] }, async ({ When, page, And, Then }) => {
      await When("I am on the country selection page", null, { page });
      await And("I select country \"Deutschland\"", null, { page });
      await Then("I should be redirected to the \"Deutschland\" website", null, { page });
      await And("the currency should be displayed in \"EUR\"", null, { page });
      await And("the language should be \"German\"", null, { page });
    });

    test("Example #3", { tag: ["@PerfectDraft", "@Navigation", "@P1", "@CountrySelection", "@Regression"] }, async ({ When, page, And, Then }) => {
      await When("I am on the country selection page", null, { page });
      await And("I select country \"France\"", null, { page });
      await Then("I should be redirected to the \"France\" website", null, { page });
      await And("the currency should be displayed in \"EUR\"", null, { page });
      await And("the language should be \"French\"", null, { page });
    });

  });

  test("Main website navigation", { tag: ["@PerfectDraft", "@Navigation", "@P1", "@Smoke"] }, async ({ Given, page, When, Then, And }) => {
    await Given("I am on the UK website", null, { page });
    await When("I view the main navigation menu", null, { page });
    await Then("I should see navigation options:", {"dataTable":{"rows":[{"cells":[{"value":"Menu Item"}]},{"cells":[{"value":"PerfectDraft Machines"}]},{"cells":[{"value":"Beer Kegs"}]},{"cells":[{"value":"Multibuy"}]},{"cells":[{"value":"Keg Packs"}]},{"cells":[{"value":"Merchandise"}]},{"cells":[{"value":"Community Stores"}]},{"cells":[{"value":"Which machine"}]}]}}, { page });
    await And("the search functionality should be available", null, { page });
    await And("the cart icon should show \"0\" items", null, { page });
  });

});

// == technical section ==

test.use({
  $test: ({}, use) => use(test),
  $uri: ({}, use) => use("src\\features\\navigation.feature"),
  $bddFileMeta: ({}, use) => use(bddFileMeta),
});

const bddFileMeta = {
  "Select country from homepage": {"pickleLocation":"11:1","tags":["@PerfectDraft","@Navigation","@P1","@CountrySelection","@Smoke"],"ownTags":["@Smoke","@CountrySelection","@P1"]},
  "Navigate to different country websites|Example #1": {"pickleLocation":"30:9","tags":["@PerfectDraft","@Navigation","@P1","@CountrySelection","@Regression"]},
  "Navigate to different country websites|Example #2": {"pickleLocation":"31:9","tags":["@PerfectDraft","@Navigation","@P1","@CountrySelection","@Regression"]},
  "Navigate to different country websites|Example #3": {"pickleLocation":"32:9","tags":["@PerfectDraft","@Navigation","@P1","@CountrySelection","@Regression"]},
  "Main website navigation": {"pickleLocation":"35:1","tags":["@PerfectDraft","@Navigation","@P1","@Smoke"],"ownTags":["@Smoke","@Navigation","@P1"]},
};