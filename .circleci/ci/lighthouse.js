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

const checkLightHouse = async () => {

    const aemUsername = ci.sh('mvn --file ui.tests help:evaluate -Dexpression=AEM_AUTHOR_USERNAME -q -DforceStdout', true);
    const aemPassword = ci.sh('mvn --file ui.tests help:evaluate -Dexpression=AEM_AUTHOR_PASSWORD -q -DforceStdout', true);

    const {default: LHDesktopConfig} = await import('lighthouse/core/config/desktop-config.js')
    const chromeLauncher = await import('chrome-launcher')
    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    const options = {
      logLevel: "info",
      output: "html",
      port: chrome.port,
      extraHeaders: {
        Authorization:
          "Basic " +
          Buffer.from(
            aemUsername + ":" + aemPassword
          ).toString("base64"),
      },
    };
    const lighthouseConfig = JSON.parse(fs.readFileSync('/home/circleci/build/.circleci/ci/lighthouseConfig.json'))

    const desktopResult = await computeMedianScores(lighthouseConfig.urls[0], options,  LHDesktopConfig) // Running lighthouse for desktop
    console.log('Lighthouse Report for desktop generated', desktopResult.lhr.finalDisplayedUrl);
    console.log(getCommentText(desktopResult.lhr.categories, 'desktop'))
    const desktopReportHtml = desktopResult.report;

    const mobileResult = await computeMedianScores(lighthouseConfig.urls[0], options) // by default lighthouse scores are computed for mobile device
    console.log('Lighthouse Report for desktop generated', mobileResult.lhr.finalDisplayedUrl);
    console.log(getCommentText(mobileResult.lhr.categories, 'mobile'))
    const mobileReportHtml = mobileResult.report;
    // adding node index to prevent multiple github comments in PR
    let nodeIndex = 0;
    if (process.env.CIRCLE_NODE_INDEX !== undefined) {
        nodeIndex = process.env.CIRCLE_NODE_INDEX;
    }
    console.log('node index ', nodeIndex);
    if((process.env.AEM === "addon" || process.env.AEM === "classic") && nodeIndex == 0){ // posting lighthouse scores only in case of AEM is addon
        await ci.postCommentToGitHubFromCI(getCommentText(desktopResult.lhr.categories, 'desktop'))
        await ci.postCommentToGitHubFromCI(getCommentText(mobileResult.lhr.categories, 'mobile'))
    }
    ci.sh('mkdir artifacts');
    ci.dir("artifacts", () => {
        fs.writeFileSync('DesktopLigthouseReport.html', desktopReportHtml);
        fs.writeFileSync('MobileLigthouseReport.html', mobileReportHtml);
        });


    const thresholdResults = checkThresholds(mobileResult.lhr.categories, lighthouseConfig) // using mobile lighthouse scores as these are usually lower
    console.log("thresholdResults -->>>> ", thresholdResults)
    if(!thresholdResults.isThresholdPass && (process.env.AEM === "addon" || process.env.AEM === "classic") && nodeIndex == 0){
        console.log("Error: Lighthouse score for aem-core-forms-components, below the thresholds");
        await ci.postCommentToGitHubFromCI("Error: Lighthouse score for aem-core-forms-components, below the thresholds, check reports under artifacts in CircleCI")
        process.exit(1);
    }
    else if(thresholdResults.updateLighthouseConfig && ['master', 'dev', 'release/650'].includes(process.env.CIRCLE_BRANCH) && process.env.AEM === "addon"){ // only execute if branch name is 'master'
        writeObjLighthouseConfig(mobileResult.lhr.categories, lighthouseConfig)
    }
    await chrome.kill();
}

const computeMedianScores = async (url, options, config) => {
    const {default:lighthouse} = await import('lighthouse');
    const {computeMedianRun} = await import('lighthouse/core/lib/median-run.js');
    const lhrs = [], results = [];
    for(let i=0; i<5; i++) {
        try {
            const result = await lighthouse(url, options, config);
            results.push(result);
            lhrs.push(result.lhr);
        } catch (e) {
            console.log(e)
        }
    }
    const median = computeMedianRun(lhrs);
    const result = results[lhrs.indexOf(median)]
    return result;
}

const getCommentText = (resultCategories, preset) => {
  const commentText = `### Lighthouse scores (${preset})\n\n|        | Performance | Accessibility | Best-Practices | SEO |\n| ------ | ----------- | ------------- | -------------- | --- |\n| Scores |     ${resultCategories.performance.score*100}      |       ${resultCategories.accessibility.score*100}       |       ${resultCategories['best-practices'].score*100}       |  ${resultCategories.seo.score*100} |`
  return commentText
}

const checkThresholds = (resultCategories, lighthouseConfig) => {
  const { performance, accessibility, bestPractices, seo } =
    lighthouseConfig.requiredScores[0];
  const margin = lighthouseConfig.margin;
  const thresholdResults = {
    isThresholdPass: false,
    updateLighthouseConfig: false,
  };
  if (
    performance * (1 - margin) < resultCategories.performance.score * 100 &&
    accessibility * (1 - margin) < resultCategories.accessibility.score * 100 &&
    bestPractices * (1 - margin) <
      resultCategories["best-practices"].score * 100 &&
    seo * (1 - margin) < resultCategories.seo.score * 100
  ) {
    thresholdResults.isThresholdPass = true;
  }

  if (
    performance < resultCategories.performance.score * 100 &&
    accessibility < resultCategories.accessibility.score * 100 &&
    bestPractices < resultCategories["best-practices"].score * 100 &&
    seo < resultCategories.seo.score * 100
  ) {
    thresholdResults.updateLighthouseConfig = true;
  }

  return thresholdResults;
};

const writeObjLighthouseConfig = (resultCategories, lighthouseConfig) => {
  const {
    performanceResult,
    accessibilityResult,
    bestPracticesResult,
    seoResult,
  } = {
    performanceResult: resultCategories.performance.score * 100,
    accessibilityResult: resultCategories.accessibility.score * 100,
    bestPracticesResult: resultCategories["best-practices"].score * 100,
    seoResult: resultCategories.seo.score * 100,
  };
  let newLighthouseConfig = lighthouseConfig;

  if (
    performanceResult > lighthouseConfig.requiredScores[1].performance &&
    accessibilityResult > lighthouseConfig.requiredScores[1].accessibility &&
    bestPracticesResult > lighthouseConfig.requiredScores[1].bestPractices &&
    seoResult > lighthouseConfig.requiredScores[1].seo
  ) {
    newLighthouseConfig.requiredScores = [
      lighthouseConfig.requiredScores[1],
      {
        performance: performanceResult,
        accessibility: accessibilityResult,
        bestPractices: bestPracticesResult,
        seo: seoResult,
      },
    ];
  } else {
    newLighthouseConfig.requiredScores = [
      {
        performance: performanceResult,
        accessibility: accessibilityResult,
        bestPractices: bestPracticesResult,
        seo: seoResult,
      },
      lighthouseConfig.requiredScores[1],
    ];
  }

  console.log("newLighthouseConfig -->> ", newLighthouseConfig);
  fs.writeFileSync(
    "/home/circleci/build/.circleci/ci/lighthouseConfig.json",
    JSON.stringify(newLighthouseConfig, null, 4)
  );
  // update to git;
  ci.sh(`git add /home/circleci/build/.circleci/ci/lighthouseConfig.json`);
  ci.sh("git status");
  ci.sh(`git commit -m "@trivial - Update Lighthouse Config"`);
  ci.sh(`git push --set-upstream --force origin ${process.env.CIRCLE_BRANCH}`);
  console.log("Successfully updated lighthouseConfig.json");
};


checkLightHouse()
