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

'use strict';

const ci = new (require('./ci.js'))();

ci.context();

ci.stage('Project Configuration');
const config = ci.restoreConfiguration();
console.log(config);
const qpPath = '/home/circleci/cq';
const buildPath = '/home/circleci/build';
const { TYPE, BROWSER, AEM, PRERELEASE, FT, CORE_COMPONENTS, WCM_COMPONENTS} = process.env;
const isLatestAddon = AEM === 'addon-latest';
const jacocoAgent = '/home/circleci/.m2/repository/org/jacoco/org.jacoco.agent/0.8.3/org.jacoco.agent-0.8.3-runtime.jar';

try {
    // # Define the image name
    let image_name="docker-adobe-cif-release.dr-uw2.adobeitc.com/circleci-qp:6.4.6-openjdk11";
    let qpContainerId = ci.sh(`docker ps --filter "ancestor=${image_name}" --quiet`, true);
    console.log("container id for qp ", qpContainerId);

    // moving the qp docker content and environment variable to host machine
    ci.sh(`docker cp ${qpContainerId}:/home/circleci/cq ${qpPath}`);
    ci.sh(`docker cp ${qpContainerId}:/home/circleci/.m2/repository/org/jacoco/org.jacoco.agent/0.8.3/ /home/circleci/.m2/repository/org/jacoco/org.jacoco.agent/0.8.3/`);

    //todo: remove this later, once aem image is released, since sites rotary aem base image has "2.25.4"
    //let wcmVersion = ci.sh('mvn help:evaluate -Dexpression=core.wcm.components.version -q -DforceStdout', true);
    let wcmVersion = "2.26.0";
    ci.stage("Integration Tests");
    ci.dir(qpPath, () => {
        // Connect to QP
        ci.sh(`./qp.sh -v bind --server-hostname localhost --server-port 55555`);

    let extras = ``, preleaseOpts = ``;
    if (AEM === 'classic') {
        // The core components are already installed in the Cloud SDK
        extras += ` --bundle com.adobe.cq:core.wcm.components.all:${wcmVersion}:zip`;
    } else if (AEM === 'addon') {
        // Download the forms Add-On
        ci.sh(`curl -s "${process.env.FORMS_ADDON_URL}" -o forms-addon.far`);
        extras = '--install-file forms-addon.far';
        extras += ` --bundle com.adobe.cq:core.wcm.components.all:${wcmVersion}:zip`;
        if (PRERELEASE === 'true') {
            // enable pre-release settings
            preleaseOpts = "--cmd-options \\\"-r prerelease\\\"";
        }
    } else if (AEM === 'addon-latest') {
        // Download latest add-on release from artifactory
        ci.sh(`mvn -s ${buildPath}/.circleci/settings.xml com.googlecode.maven-download-plugin:download-maven-plugin:1.6.3:artifact -Partifactory-cloud -DgroupId=com.adobe.aemfd -DartifactId=aem-forms-cloud-ready-pkg -Dversion=LATEST -Dclassifier=feature-archive -Dtype=far -DoutputDirectory=${buildPath} -DoutputFileName=forms-latest-addon.far`);
        extras += ` --install-file ${buildPath}/forms-latest-addon.far`;
        if (PRERELEASE === 'true') {
            // enable pre-release settings
            preleaseOpts = "--cmd-options \\\"-r prerelease\\\"";
        }
        extras += ` --bundle com.adobe.cq:core.wcm.components.all:${wcmVersion}:zip`;
    }

    if (FT === 'true') {
        // add feature toggle impl bundle to check FT on cloud ready or release/650 instance
        extras += ` --install-file ${buildPath}/it/core/src/main/resources/com.adobe.granite.toggle.impl.dev-1.1.2.jar`;
    }

    // Set an environment variable indicating test was executed
    // this is used in case of re-run failed test scenario
    ci.sh("sed -i 's/false/true/' /home/circleci/build/TEST_EXECUTION_STATUS.txt");
    if (CORE_COMPONENTS) {
        // enable specific core component version
        extras += ` --bundle com.adobe.aem:core-forms-components-apps:${CORE_COMPONENTS}:zip`;
        extras += ` --bundle com.adobe.aem:core-forms-components-core:${CORE_COMPONENTS}:jar`;
        extras += ` --bundle com.adobe.aem:core-forms-components-af-apps:${CORE_COMPONENTS}:zip`;
        extras += ` --bundle com.adobe.aem:core-forms-components-af-core:${CORE_COMPONENTS}:jar`;
        extras += ` --bundle com.adobe.aem:core-forms-components-examples-apps:${CORE_COMPONENTS}:zip`;
        extras += ` --bundle com.adobe.aem:core-forms-components-examples-content:${CORE_COMPONENTS}:zip`;
        extras += ` --bundle com.adobe.aem:core-forms-components-examples-core:${CORE_COMPONENTS}:jar`;
    }
    // Start CQ
    ci.sh(`./qp.sh -v start --id author --runmode author --port 4502 --qs-jar /home/circleci/cq/author/cq-quickstart.jar \
            --bundle org.apache.sling:org.apache.sling.junit.core:1.0.23:jar \
            --bundle com.adobe.cq:core.wcm.components.examples.ui.config:${wcmVersion}:zip \
            --bundle com.adobe.cq:core.wcm.components.examples.ui.apps:${wcmVersion}:zip \
            --bundle com.adobe.cq:core.wcm.components.examples.ui.content:${wcmVersion}:zip \
            ${extras} \
            ${!CORE_COMPONENTS ? ci.addQpFileDependency(config.modules['core-forms-components-apps'] /*, isLatestAddon ? true : false */) : ''} \
            ${!CORE_COMPONENTS ? ci.addQpFileDependency(config.modules['core-forms-components-af-apps'] /*, isLatestAddon ? true : false */) : ''} \
            ${!CORE_COMPONENTS ? ci.addQpFileDependency(config.modules['core-forms-components-af-core']) : ''} \
            ${!CORE_COMPONENTS ? ci.addQpFileDependency(config.modules['core-forms-components-examples-apps']) : ''} \
            ${!CORE_COMPONENTS ? ci.addQpFileDependency(config.modules['core-forms-components-examples-content']) : ''} \
            ${!CORE_COMPONENTS ? ci.addQpFileDependency(config.modules['core-forms-components-examples-core']) : ''} \
            ${ci.addQpFileDependency(config.modules['core-forms-components-it-tests-config'])} \
            ${ci.addQpFileDependency(config.modules['core-forms-components-it-tests-core'])} \
            ${ci.addQpFileDependency(config.modules['core-forms-components-it-tests-apps'])} \
            ${ci.addQpFileDependency(config.modules['core-forms-components-it-tests-content'])} \
            --vm-options \\\"-Xmx4096m -XX:MaxPermSize=1024m -Djava.awt.headless=true -javaagent:${jacocoAgent}=destfile=crx-quickstart/jacoco-it.exec\\\" \
            ${preleaseOpts}`);
});

    // Run integration tests
    /*
    if (TYPE === 'integration') {
        ci.dir('it/http', () => {
            ci.sh(`mvn clean verify -U -B \
                -Ptest-all \
                -Dsling.it.instance.url.1=http://localhost:4502 \
                -Dsling.it.instance.runmode.1=author \
                -Dsling.it.instances=1`);
    });
    }
    */

    // Run UI tests
    if (TYPE === 'cypress') {
        if (AEM && AEM.includes("addon")) {
            // explicitly add the rum bundle, since it is only available on publish tier
            // upload webvitals and disable api region
            const disableApiRegion = "curl -u admin:admin -X POST -d 'apply=true' -d 'propertylist=disable' -d 'disable=true' http://localhost:4502/system/console/configMgr/org.apache.sling.feature.apiregions.impl";
            ci.sh(disableApiRegion);
            const installWebVitalBundle = `curl -u admin:admin \
                                            -F bundlefile=@'${buildPath}/it/core/src/main/resources/com.adobe.granite.webvitals-1.2.2.jar' \
                                            -F name='com.adobe.granite.webvitals' \
                                            -F action=install \
                                            http://localhost:4502/system/console/bundles`;
            ci.sh(installWebVitalBundle);
            // get the bundle id
            const webVitalBundleId = ci.sh("curl -s -u admin:admin http://localhost:4502/system/console/bundles.json | jq -r '.data | map(select(.symbolicName == \"com.adobe.granite.webvitals\")) | .[0].id'", true);
            console.log("Web Vital Bundle Id " + webVitalBundleId);
            if (webVitalBundleId) {
                // start the web vital bundle
                ci.sh(`curl -u admin:admin -F action=start http://localhost:4502/system/console/bundles/${webVitalBundleId}`)
            }
        }
        const [node, script, ...params] = process.argv;
        let testSuites = params.join(',');
        if (CORE_COMPONENTS) {
            // we run only some test suites for older core components
            testSuites = "specs/prefill/customprefill.cy.js,specs/prefill/repeatableprefillwithzerooccurrencefortabaccordionwizard.cy.js,specs/actions/submit/submit.runtime.cy.js,specs/actions/render/render_with_openapi.cy.js";
        }
        // start running the tests
        ci.dir('ui.tests', () => {
            let command = `mvn verify -U -B -Pcypress-ci -DENV_CI=true -DFORMS_FAR=${AEM} -DspecFiles="${testSuites}"`;
            if (CORE_COMPONENTS) {
                command += ` -DCORE_COMPONENTS=true`;
            }
            ci.sh(command);
        });
    }

    // No coverage for UI tests
    if (TYPE === 'cypress') {
        return;
    }

    // Create coverage reports
    const createCoverageReport = () => {
        // Executing the integration tests runs also executes unit tests and generates a Jacoco report for them. To
        // strictly separate unit test from integration test coverage, we explicitly delete the unit test report first.
        ci.sh('rm -rf target/site/jacoco');

        // Download Jacoco file which is exposed by a webserver running inside the AEM container.
        ci.sh('curl -O -f http://localhost:3000/crx-quickstart/jacoco-it.exec');

        // Generate new report
        ci.sh(`mvn -B org.jacoco:jacoco-maven-plugin:${process.env.JACOCO_VERSION}:report -Djacoco.dataFile=jacoco-it.exec`);

        // Upload report to codecov
        ci.sh('curl -s https://codecov.io/bash | bash -s -- -c -F integration -f target/site/jacoco/jacoco.xml');
    };

    ci.dir('bundles/core', createCoverageReport);
    ci.dir('examples/core', createCoverageReport);

} finally {
    // Always download logs from AEM container
    ci.sh('mkdir logs');
    ci.dir('logs', () => {
        // A webserver running inside the AEM container exposes the logs folder, so we can download log files as needed.
        ci.sh('curl -O -f http://localhost:3000/crx-quickstart/logs/error.log');
    ci.sh('curl -O -f http://localhost:3000/crx-quickstart/logs/stdout.log');
    ci.sh('curl -O -f http://localhost:3000/crx-quickstart/logs/stderr.log');
    ci.sh(`find . -name '*.log' -type f -size +32M -exec echo 'Truncating: ' {} \\; -execdir truncate --size 32M {} +`);
});
}
