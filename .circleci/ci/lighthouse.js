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
const lighthouseConfig = require("../lighthouseConfig.js")
//const { fail } = require('@circleci/circleci-javascript-sdk');


const checkLightHouse = async () => {
    const lighthouse = await import('lighthouse')
    const chromeLauncher = await import('chrome-launcher')
    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    const options = {logLevel: 'info', output: 'html', port: chrome.port, extraHeaders: { Authorization: 'Basic YWRtaW46YWRtaW4=' }};  // YWRtaW46YWRtaW4= -- base64 encoded, admin:admin
    console.log(" lighthouseConfig --->>> ", lighthouseConfig)
    console.log(" from env variables --->>> ", process.env)

    const runnerResult = await lighthouse.default(lighthouseConfig.urls[0], options);
    // `.report` is the HTML report as a string

    const reportHtml = runnerResult.report;
    console.log('Report is done for', runnerResult.lhr.finalDisplayedUrl);
//    console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);

    if(isThresholdsPass(runnerResult.lhr.categories)){
        // update on github with the object.
    }
    else{
        // fail the build, with reasoning
//        fail("Lighthouse score for aem-core-forms-components, below the thresholds");
        console.log("Lighthouse score for aem-core-forms-components, below the thresholds")
    }


    console.log("repo owner from env variables", process.env.REPO_OWNER)
    console.log("repo $REPO_NAME from env variables", process.env.REPO_NAME)
    console.log("repo $PR_NUMBER from env variables", process.env.PR_NUMBER)
    console.log("repo $GITHUB_TOKEN from env variables", process.env.GITHUB_TOKEN)

    fs.writeFileSync('LigthouseReport.html', reportHtml);

//    postCommentToGitHub($REPO_OWNER, $REPO_NAME, $PR_NUMBER, commentText, $GITHUB_TOKEN)
//              .then(comment => console.log('Comment posted:', comment))
//              .catch(error => console.error('Failed to post comment:', error));


    console.log('.lhr` is the Lighthouse Result as a JS object', runnerResult.lhr)
//     `.lhr` is the Lighthouse Result as a JS object
    await chrome.kill();
}

const isThresholdsPass = (resultCategories) => {
    const {  performance, accessibility, bestPractices, seo } = lighthouseConfig.requiredScores[0]
    if(performance < resultCategories.performance.score &&
        accessibility < resultCategories.accessibility.score &&
        bestPractices < resultCategories['best-practices'].score &&
        seo < resultCategories.seo.score){
        return true
        }
        return false
}

const postCommentToGitHub = async (owner, repo, issueNumber, commentText, authToken) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `token ${authToken}`
    },
    body: JSON.stringify({
      body: commentText
    })
  });

  if (!response.ok) {
     throw new Error(`Failed to post comment: ${response.status} ${response.statusText}`);
    console.log("Failed to post comment on github PR!")
  }
  const comment = await response.json();
  return comment;
}

module.exports = { checkLightHouse }