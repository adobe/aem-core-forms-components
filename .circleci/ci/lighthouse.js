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
const https = require('https');
//const { fail } = require('@circleci/circleci-javascript-sdk');


const checkLightHouse = async () => {
    const lighthouse = await import('lighthouse')
    const chromeLauncher = await import('chrome-launcher')
    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    const options = {logLevel: 'info', output: 'html', port: chrome.port, extraHeaders: { Authorization: 'Basic ' + Buffer.from('admin:admin').toString('base64') }};  // YWRtaW46YWRtaW4= -- base64 encoded, admin:admin
    console.log(" from env variables --->>> ", process.env)

    const lighthouseConfig = JSON.parse(fs.readFileSync('lighthouseConfig.json'))
    console.log("lighthouseConfig -->> ", lighthouseConfig)

    const runnerResult = await lighthouse.default(lighthouseConfig.urls[0], options);
    // `.report` is the HTML report as a string

    const reportHtml = runnerResult.report;
    console.log('Report is done for', runnerResult.lhr.finalDisplayedUrl);
//    console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);

    //postCommentToGitHub('Posting Lighthouse scores..', process.env.GITHUB_TOKEN)
    fs.writeFileSync('LigthouseReport.html', reportHtml);

    const thresholdResults = checkThresholds(runnerResult.lhr.categories, lighthouseConfig)
    console.log("thresholdResults -->>>> ", thresholdResults)
    if(!thresholdResults.isThresholdPass){
        console.log("Error: Lighthouse score for aem-core-forms-components, below the thresholds")
        process.exit(1);
    }
    else if(thresholdResults.updateLighthouseConfig && process.env.CIRCLE_BRANCH == 'master'){ // only execute if branch name is 'master'
        writeObjLighthouseConfig(runnerResult.lhr.categories, lighthouseConfig)
    }
    await chrome.kill();
}

const checkThresholds = (resultCategories, lighthouseConfig) => {
    const {  performance, accessibility, bestPractices, seo } = lighthouseConfig.requiredScores[0]
    const margin = lighthouseConfig.margin
    const thresholdResults = {
        isThresholdPass: false,
        updateLighthouseConfig: false
    }
    if(performance*(1-margin) > resultCategories.performance.score ||
        accessibility*(1-margin) > resultCategories.accessibility.score ||
        bestPractices*(1-margin) > resultCategories['best-practices'].score ||
        seo*(1-margin) > resultCategories.seo.score){
            thresholdResults.isThresholdPass = true
        }

    if(performance < resultCategories.performance.score &&
        accessibility > resultCategories.accessibility.score &&
        bestPractices > resultCategories['best-practices'].score &&
        seo > resultCategories.seo.score){
            thresholdResults.updateLighthouseConfig = true
        }

        return thresholdResults

}

const postCommentToGitHub = (commentText, GITHUB_TOKEN) => {

    const {CIRCLE_PROJECT_USERNAME, CIRCLE_PROJECT_REPONAME, CIRCLE_PULL_REQUEST } = process.env
    const prNumber = CIRCLE_PULL_REQUEST.split('/').pop();
    const apiUrl = new URL(`https://api.github.com/repos/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/issues/${prNumber}/comments`);
    const postData = JSON.stringify({body: commentText});

    // Define the options for the HTTPS request
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `${GITHUB_TOKEN}`,
        'User-Agent': 'CircleCI'
      }
    };

    // Send the HTTPS request to create the new comment on the pull request
    const req = https.request(apiUrl, options, (res) => {
      console.log(`Status: ${res.statusCode}`);
      res.on('data', (d) => {
        process.stdout.write(d);
      });
    });

    req.on('error', (error) => {
      console.error(error);
    });

    req.write(postData);
    req.end();
}

const writeObjLighthouseConfig = (resultCategories, lighthouseConfig) => {

const {performanceResult, accessibilityResult, bestPracticesResult, seoResult} = {performanceResult: resultCategories.performance.score, accessibility: resultCategories.accessibility.score,
                                                                                   bestPracticesResult: resultCategories['best-practices'].score, seoResult: resultCategories.seo.score}
let newLighthouseConfig = lighthouseConfig;

if(performanceResult > lighthouseConfig.requiredScores[1].performance && accessibilityResult > lighthouseConfig.requiredScores[1].accessibility &&
bestPracticesResult > lighthouseConfig.requiredScores[1].bestPractices && seoResult > lighthouseConfig.requiredScores[1].seo){
    newLighthouseConfig.requiredScores = [lighthouseConfig.requiredScores[1], {performance: performanceResult, accessibility: accessibilityResult, bestPractices: bestPracticesResult, seo: seoResult}]
}
else{
    newLighthouseConfig.requiredScores = [{performance: performanceResult, accessibility: accessibilityResult, bestPractices: bestPracticesResult, seo: seoResult}, lighthouseConfig.requiredScores[1]]
}
// write changes in the git file;
console.log("newLighthouseConfig -->> ", newLighthouseConfig)

fs.writeFileSync("lighthouseConfig.json", JSON.stringify(newLighthouseConfig, null, 4), function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log("File contents replaced successfully!");
      }
    });
}


module.exports = { checkLightHouse }