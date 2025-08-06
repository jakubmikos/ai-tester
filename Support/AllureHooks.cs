using Allure.Net.Commons;
using Reqnroll;

namespace PerfectDraftTests.Support;

[Binding]
public class AllureHooks
{
    [BeforeTestRun]
    public static void BeforeTestRun()
    {
        Environment.SetEnvironmentVariable("ALLURE_CONFIG", Path.Combine(Directory.GetCurrentDirectory(), "allureConfig.json"));
        Environment.SetEnvironmentVariable("ALLURE_RESULTS_DIRECTORY", Path.Combine(Directory.GetCurrentDirectory(), "allure-results"));
        AllureLifecycle.Instance.CleanupResultDirectory();
    }

    [BeforeScenario]
    public void BeforeScenario(ScenarioContext scenarioContext)
    {
        // Add scenario tags as Allure labels
        foreach (var tag in scenarioContext.ScenarioInfo.Tags)
        {
            if (tag.StartsWith("@P"))
            {
                AllureApi.AddLabel("priority", tag.Substring(1));
            }
            else if (tag.StartsWith("@"))
            {
                AllureApi.AddLabel("tag", tag.Substring(1));
            }
        }

        // Add scenario info
        AllureApi.AddLabel("feature", scenarioContext.ScenarioInfo.Title);
        AllureApi.AddLabel("story", scenarioContext.ScenarioInfo.Title);
    }

    [AfterScenario]
    public void AfterScenario(ScenarioContext scenarioContext)
    {
    }

    [AfterStep]
    public void AfterStep(ScenarioContext scenarioContext)
    {
        if (scenarioContext.TestError != null)
        {
            AllureApi.AddLabel("status", "failed");
        }
    }
}
