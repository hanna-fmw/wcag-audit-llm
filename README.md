STEP 1:
- Run: 
lighthouse https://www.stormfors.com --output=json --output-path=report.json 
... to generate report (in active folder / desktop) (make sure lighthouse is globally installed)
- Make sure to start local server in LM Studio (update processed_report.js to change LLM, eg. OpenAI; API Key in fetch Header needed for non-local LLMs)

STEP 2:
- Run node processed_report.js (will take a little while, results in terminal)
