/*******************************************************************************
 *
 *    Copyright 2021 Adobe. All rights reserved.
 *    This file is licensed to you under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License. You may obtain a copy
 *    of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software distributed under
 *    the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 *    OF ANY KIND, either express or implied. See the License for the specific language
 *    governing permissions and limitations under the License.
 *
 ******************************************************************************/

const fs = require('fs');
const AxeBuilder = require('@axe-core/webdriverjs');
const WebDriver = require('selenium-webdriver');
const { createHtmlReport } = require('axe-html-reporter');
const http = require('http');


const calculateAccessibility = async () => {

    const driver = new WebDriver.Builder().forBrowser('chrome').build();
    driver.get('https://www.jaguar.in/index.html').then(() => {
        new AxeBuilder(driver)
          .analyze()
          .then(results => {
            console.log(results);

            if (results.violations.length > 0) {
               // impact can be 'critical', 'serious', 'moderate', 'minor', 'unknown'
               results.violations.filter(violation => ['critical', 'serious', 'moderate'].includes(violation.impact)).forEach(async violation => {
                    // if branch 'master' -- raise a JIRA;
//                    if(process.env.CIRCLE_BRANCH == 'master'){
                        let jiraFeilds = createJiraFeilds(violation)
                         await raiseJiraIssue(jiraFeilds);
//                    }
                    console.log("Error: Accessibility violations found, please refer the report to fix the same!")
                    process.exit(1); // fail pipeline

               })
               console.log(results.violations);
            }

            const reportHTML = createHtmlReport({
                              results: results,
                              options: {
                                  projectKey: 'aem-core-forms-components'
                              },
                          });
            fs.writeFileSync('accessibility-report.html', reportHTML);

          })
          .catch(e => {
            console.log("Some error occured in calculating accessibility", e)
          });
        });
}


const createJiraFeilds = (violation) => {
const PROJECT_KEY = "FORMS"
const ISSUE_TYPE = "Bug"
const PRIORITY = "Blocker"
const COMPONENT = "Core Components"

    return {
        projectKey: PROJECT_KEY,
        summary: 'AEM-Forms-Core-Component-Pipeline-Failed Accessibility Issue',
        description: violation.description,
        issueType: ISSUE_TYPE,
        priority: PRIORITY,
        assignee: 'prateekawast',
        component: COMPONENT,
        customFields: {
                        "customfield_27200": {
                          "value": "No",
                          "id": "61901",
                          "disabled": false
                        },
                        "customfield_25700": {
                          "value": "Internal Customer",
                          "id": "161408",
                          "disabled": false
                        }
                      }

    }
}

const raiseJiraIssue = async (issueFields) => {

const { projectKey, summary, description, issueType, priority, assignee, component, customFields } = issueFields;

  // Create the request options
  const options = {
    hostname: 'https://jira.corp.adobe.com',
    port: 443,
    path: `/rest/api/2/issue`,
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + new Buffer(process.env.JIRA_USERNAME + ':' + process.env.JIRA_PASSWORD).toString('base64'),
      'Content-Type': 'application/json',
    },
  };

  // Create the request body
  const body = {
    'fields': {
      'project': {
        'key': projectKey,
      },
      'summary': summary,
      'description': description,
      'issuetype': {
        'name': issueType,
      },
      'priority': {
        'name': priority
      },
      'assignee': {
        'name': assignee
      },
      'components': [
         {'name': component}
      ],
      ...customFields,
    },
  };

  // Make the request
  const req = https.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (body) => {
      console.log('Body: ' + body);
    });
  });

  req.on('error', (e) => {
    console.log('Some error occured while raising the JIRA: ' + e.message);
  });

  // Write the request body
  req.write(JSON.stringify(body));
  req.end();
}

module.exports = { calculateAccessibility }