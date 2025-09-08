# AI QA (Troublemaker) Report

## Experiments
1. Generate initial suite of gherkin-style test scenarios for https://PerfectDraft.com
2. Implementing test scenarios in .net
   1. Used Claude Code with Playwright MCP for browsing web
3. Implementing test scenarios is Javascript
   1. Claude Code with Playwright MCP for browsing web
4. N8N test scenario generation chat bot
   1. Relatively easy to implement
   2. Prompt initially designed to generate new test scenarios from natural language works great for more general conversations about test suite like:
      1. Exploring existing test suite
      2. What the chat bot can be used for
   3. At the moment pulls all of the scenarios to the prompt, which may pose a scalability issues later on when the test suit grows. 
   It could potentially (just a hypothesis) be solved by:
      1. Having dedicated model and train it on the test suit on the regular basis. That being said, my knowledge on training LLMs is very limited
      2. Providing just a high level test suite structure and dynamically pulling details of the required tests whenever necessary.
   4. 
5. GitHub Copilot for implementing new test scenarios
   1. Does a decent job, although need to be instructed better not to include temp scripts in the PR
   2. Has Playwright MCP available, so can browse web out of the box
   3. Used default Copilot model (one of OpenAI GPTs I believe) so far. 
   4. There is an ability to use Anthropic (Claude), Google (Gemini), X (Grok) and other OpenAI models, which is worth exploring
