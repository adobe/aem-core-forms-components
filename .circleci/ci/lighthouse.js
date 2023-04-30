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
const lighthouseConfig = require("../lighthouseConfig.yml")
const { fail } = require('@circleci/circleci-javascript-sdk');


const checkLightHouse = async () => {
    const lighthouse = await import('lighthouse')
    const chromeLauncher = await import('chrome-launcher')
    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    const options = {logLevel: 'info', output: 'html', port: chrome.port, extraHeaders: { Authorization: 'Basic YWRtaW46YWRtaW4=' }};  // YWRtaW46YWRtaW4= -- base64 encoded, admin:admin
    const runnerResult = await lighthouse.default(lighthouseConfig.lighthouse.urls[0], options);
    // `.report` is the HTML report as a string
    const reportHtml = runnerResult.report;
    console.log('Report is done for', runnerResult.lhr.finalDisplayedUrl);
//    console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);
    fs.writeFileSync('LigthouseReport.html', reportHtml);
    if(isThresholdsPass(runnerResult.lhr.categories)){

    }
    else{
        // fail the build, with reasoning
        fail("Lighthouse score for aem-core-forms-components, below the thresholds");
    }


//    COMMENT="| Performance | Accessibility | Best-Practices | SEO |\n| ------------------- | ------------------- | ------------------- | ------------------- |\n| 40 | 100 | 90 | 90 |"
//
//    curl -X POST \
//          -H "Authorization: token ${GITHUB_TOKEN}" \
//          -H "Content-Type: application/json" \
//          -d "{\"body\":\"${COMMENT}\"}" \
//          "https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${PR_NUMBER}/comments"



    console.log('.lhr` is the Lighthouse Result as a JS object', runnerResult.lhr)
//     `.lhr` is the Lighthouse Result as a JS object
    await chrome.kill();
}
// trenbolone

const isThresholdsPass = (resultCategories) => {
    const {  performance, accessibility, 'best-practices': bestPractices, seo } = lighthouseConfig.lighthouse.requiredScores
    if(performance < resultCategories.performance.score &&
        accessibility < resultCategories.accessibility.score &&
        bestPractices < resultCategories['best-practices'].score &&
        seo < resultCategories.seo.score){
        return true
        }
        return false
}

module.exports = { checkLightHouse }