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
    if(isThresholdsPass(runnerResult.lhr.categories)){
        // fail the build, with reasoning
         fail("Lighthouse score for aem-core-forms-components, below the thresholds");
    }
    console.log('.lhr` is the Lighthouse Result as a JS object', runnerResult.lhr)
    fs.writeFileSync('LigthouseReport.html', reportHtml);
//     `.lhr` is the Lighthouse Result as a JS object
    await chrome.kill();
}
// trenbolone

const isThresholdsPass = (resultCategories) => {
    const {  performance, accessibility, 'best-practices': bestPractices, seo } = lighthouseConfig.lighthouse.requiredScores
    if(performance > resultCategories.performance.score &&
        accessibility > resultCategories.accessibility.score &&
        bestPractices > resultCategories.['best-practices'].score &&
        seo > resultCategories.seo.score){
        return true
        }
        return false
}

module.exports = { checkLightHouse }