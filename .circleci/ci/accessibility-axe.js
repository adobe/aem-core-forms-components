/*******************************************************************************
 * Copyright 2023 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

const fs = require('fs');
const ci = new (require('./ci.js'))();
const { AxeBuilder } = require('@axe-core/webdriverjs');
const WebDriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { createHtmlReport } = require('axe-html-reporter');
const accessibilityConfig = require("./accessibilityConfig.json")


const calculateAccessibility = async () => {

    const options = new chrome.Options();
    const driver = new WebDriver.Builder().forBrowser('chrome').setChromeOptions(options).build();
    const ACCESSIBILITY_COLLATERAL_URL = "http://localhost:4502/content/dam/formsanddocuments/core-components-it/samples/accessibility/jcr:content?wcmmode=disabled"
    const aemUsername = ci.sh('mvn --file ui.tests help:evaluate -Dexpression=AEM_AUTHOR_USERNAME -q -DforceStdout', true);
    const aemPassword = ci.sh('mvn --file ui.tests help:evaluate -Dexpression=AEM_AUTHOR_PASSWORD -q -DforceStdout', true);


    try {
        await driver.get(ACCESSIBILITY_COLLATERAL_URL);

        await driver.wait(async () => {
          const readyState = await driver.executeScript('return document.readyState');
          return readyState === 'complete';
        });
//        await driver.findElement(WebDriver.By.xpath("//button[@aria-expanded='false']/coral-accordion-item-label[contains(text(),'Sign in locally')]")).click();
        const usernameInput = await driver.findElement(WebDriver.By.id('username'));
        await usernameInput.sendKeys(aemUsername);
        const passwordInput = await driver.findElement(WebDriver.By.id('password'));
        await passwordInput.sendKeys(aemPassword);
        await driver.findElement(WebDriver.By.id('submit-button')).click();
        await driver.wait(async () => {
          const readyState = await driver.executeScript('return document.readyState');
          return readyState === 'complete';
        });
        await driver.getPageSource();

        const axeBuilder = new AxeBuilder(driver).withTags(['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice', 'wcag***', 'ACT', 'TTv5', 'TT*.*', 'EN-301-549', 'EN-9.*', 'experimental', 'cat.*', 'section508', 'section508.*.*']);
        const results = await axeBuilder.analyze();
        const reportHTML = createHtmlReport({
          results: results,
          options: {
            projectKey: "aem-core-forms-components",
          },
        });
        fs.writeFileSync('accessibility-report.html', reportHTML);
        // adding node index to prevent multiple github comments in PR
        let nodeIndex = 0;
        if (process.env.CIRCLE_NODE_INDEX !== undefined) {
            nodeIndex = process.env.CIRCLE_NODE_INDEX;
        }
        console.log('node index ', nodeIndex);

        if ((process.env.AEM === "addon" || process.env.AEM === "classic" || process.env.AEM === "addon-latest") && nodeIndex == 0) {

            if (results.violations.length > 0) {
                console.log(getAccessibilityViolationsTable(results.violations))
                await ci.postCommentToGitHubFromCI(getAccessibilityViolationsTable(results.violations));
                // impact can be 'critical', 'serious', 'moderate', 'minor', 'unknown'
                if (
                    results.violations.some(
                        (violation) => ["critical", "serious", "moderate"].includes(violation.impact) &&
                        !accessibilityConfig.accessibilityExceptionList.includes(violation.id)
                    )
                ) {
                    console.log("Error: Accessibility violations found, please refer the report under artifacts to fix the same!");
                    await ci.postCommentToGitHubFromCI("Error: Accessibility violations found, please refer the report under artifacts, inside circleCI PR, to fix the same!");
                    process.exit(1); // fail pipeline
                }

                console.log("results.violations--->>>", results.violations);
            }

        }

    }
    catch (e) {
        console.log("Some error occured in calculating accessibility", e)
    }
}

const getAccessibilityViolationsTable = (violations) => {
  const printRow = (id, impact) => {
    return `| ${id + " ".repeat(30 - id.length)} | ${
      impact + " ".repeat(25 - impact.length)
    } |\n`;
  };

  const printDashedLine = () => {
    return `| ${"-".repeat(30)} | ${"-".repeat(25)} |\n`;
  };

  let table = "";
  table += "\n\n### Accessibility Violations Found\n";
  table += `| Id                             | Impact                    |\n`;
  table += printDashedLine();
  violations.forEach((violation) => {
    table += printRow(violation.id, violation.impact);
  });
  return table;
};

calculateAccessibility()
