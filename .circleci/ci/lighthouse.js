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


    const runnerResult = await lighthouse.default(lighthouseConfig.urls[0], options);
    // `.report` is the HTML report as a string

    const reportHtml = runnerResult.report;
    console.log('Report is done for', runnerResult.lhr.finalDisplayedUrl);
//    console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);

    if(isThresholdsPass(runnerResult.lhr.categories, lighthouseConfig)){
        writeObjLighthouseConfig(lighthouseConfig, runnerResult.lhr.categories)
    }
    else{
        // fail the build, with reasoning, without exiting the build
//        fail("Lighthouse score for aem-core-forms-components, below the thresholds");
        console.log("Error: Lighthouse score for aem-core-forms-components, below the thresholds")
       // process.exit(1);
    }
    postCommentToGitHub('Posting Lighthouse scores..', process.env.GITHUB_TOKEN)
    fs.writeFileSync('LigthouseReport.html', reportHtml);
    await chrome.kill();
}

const isThresholdsPass = (resultCategories, lighthouseConfig) => {
    const {  performance, accessibility, bestPractices, seo } = lighthouseConfig.requiredScores[0]
    if(performance < resultCategories.performance.score &&
        accessibility < resultCategories.accessibility.score &&
        bestPractices < resultCategories['best-practices'].score &&
        seo < resultCategories.seo.score){
        return true
        }
        return false
}

const postCommentToGitHub = (commentText, GITHUB_TOKEN) => {

    const prNumber = process.env.CIRCLE_PULL_REQUEST.split('/').pop();
    const apiUrl = new URL(`https://api.github.com/repos/${process.env.CIRCLE_PROJECT_USERNAME}/${process.env.CIRCLE_PROJECT_REPONAME}/issues/${prNumber}/comments`);
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

const writeObjLighthouseConfig = (lighthouseConfig, resultCategories) => {
let newLighthouseConfig = {};

newLighthouseConfig.urls = lighthouseConfig.urls;
newLighthouseConfig.requiredScores = [lighthouseConfig.requiredScores[1], {performance: resultCategories.performance.score, accessibility: resultCategories.accessibility.score,
                                                                            bestPractices: resultCategories['best-practices'].score, seo: resultCategories.seo.score}]

// write changes in the git file;

fs.writeFileSync("lighthouseConfig.json", JSON.stringify(newLighthouseConfig, null, 4), function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log("File contents replaced successfully!");
      }
    });
}
// login to https://github.com/adobe/aem-core-forms-components/tree/lighthouse-circleci/.circleci/ci
// write a file here


module.exports = { checkLightHouse }