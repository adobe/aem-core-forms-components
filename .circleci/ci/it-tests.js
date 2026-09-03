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
const { TYPE, BROWSER, AEM, PRERELEASE, FT, CONTEXTPATH, FTCONFIG, CORE_COMPONENTS, WCM_COMPONENTS} = process.env;
const isLatestAddon = AEM === 'addon-latest';
const jacocoAgent = process.env.JACOCO_AGENT;
 // 6.6.0 packages are published to same artifactory, once fixed use latest here
const latestVersion = ci.fetchLatestArtifactVersion('com.adobe.aemds', 'adobe-aemfd-linux-pkg');
const classicFormAddonVersion = latestVersion !== null ? latestVersion : '6.0.1328'; // Use the latest version if available, otherwise default to '6.0.1256'
// this value is for 6.5.21.0 version as per, https://experienceleague.adobe.com/en/docs/experience-manager-release-information/aem-release-updates/forms-updates/aem-forms-releases
const classicFormReleasedAddonVersion = '6.0.1360';
// 6.6.0 (LTS) forms add-on is published on the 6.1.x line in the same artifactory; pull the latest like we do for 6.5
const ltsLatestVersion = ci.fetchLatestArtifactVersion('com.adobe.aemds', 'adobe-aemfd-linux-pkg', '6.1.');
const ltsFormAddonVersion = ltsLatestVersion !== null ? ltsLatestVersion : '6.1.244'; // fallback to the last known 6.6.0 add-on

try {
    let wcmVersion = "2.32.4";
    ci.stage("Integration Tests");
    ci.dir(qpPath, () => {
        // Connect to QP
        ci.sh('./qp.sh -v bind --server-hostname localhost --server-port 55555');

        let extras = ``, preleaseOpts = ``, contextPathOpts = ``;
        if (AEM === 'classic') {
            // Download latest add-on release from artifactory
            ci.sh(`mvn -s ${buildPath}/.circleci/settings.xml com.googlecode.maven-download-plugin:download-maven-plugin:1.6.3:artifact -Partifactory-cloud -DgroupId=com.adobe.aemds -DartifactId=adobe-aemfd-linux-pkg -Dversion=${classicFormReleasedAddonVersion} -Dtype=zip -DoutputDirectory=${buildPath} -DoutputFileName=forms-linux-addon.zip`);
            extras += ` --install-file ${buildPath}/forms-linux-addon.zip`;
            // The core components are already installed in the Cloud SDK
            extras += ` --bundle com.adobe.cq:core.wcm.components.all:${wcmVersion}:zip`;
            // add hotfix for 6520, remove it later if required
            // extras += ` --install-file ${buildPath}/it/core/src/main/resources/Hotfix-6520-Linux.zip`;
        } else if (AEM === 'classic-latest' || AEM === 'classic-latest-cp') {
            // Download latest add-on release from artifactory
            ci.sh(`mvn -s ${buildPath}/.circleci/settings.xml com.googlecode.maven-download-plugin:download-maven-plugin:1.6.3:artifact -Partifactory-cloud -DgroupId=com.adobe.aemds -DartifactId=adobe-aemfd-linux-pkg -Dversion=${classicFormAddonVersion} -Dtype=zip -DoutputDirectory=${buildPath} -DoutputFileName=forms-linux-addon.zip`);
            extras += ` --install-file ${buildPath}/forms-linux-addon.zip`;
            // The core components are already installed in the Cloud SDK
            extras += ` --bundle com.adobe.cq:core.wcm.components.all:${wcmVersion}:zip`;
            if (CONTEXTPATH != null) {
                // enable context path settings
                contextPathOpts = `--cmd-options \\\"-c ${CONTEXTPATH}\\\"`;
            }
        } else if (AEM === 'classic-lts') {
            // Download latest 6.6.0 (LTS) forms add-on release (6.1.x line) from artifactory
            ci.sh(`mvn -s ${buildPath}/.circleci/settings.xml com.googlecode.maven-download-plugin:download-maven-plugin:1.6.3:artifact -Partifactory-cloud -DgroupId=com.adobe.aemds -DartifactId=adobe-aemfd-linux-pkg -Dversion=${ltsFormAddonVersion} -Dtype=zip -DoutputDirectory=${buildPath} -DoutputFileName=forms-linux-addon.zip`);
            extras += ` --install-file ${buildPath}/forms-linux-addon.zip`;
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
            extras += ` --bundle com.adobe.cq:core.wcm.components.all:${wcmVersion}:zip`;
            if (PRERELEASE === 'true') {
                // enable pre-release settings
                preleaseOpts = "--cmd-options \\\"-r prerelease\\\"";
            }
        }

    if (FT === 'true') {
        // add feature toggle impl bundle to check FT on cloud ready or release/650 instance
        extras += ` --install-file ${buildPath}/it/core/src/main/resources/com.adobe.granite.toggle.impl.dev-1.2.0.jar`;
    }

        // Set an environment variable indicating test was executed
        // this is used in case of re-run failed test scenario
        ci.sh("sed -i 's/false/true/' /home/circleci/build/TEST_EXECUTION_STATUS.txt")
        
        // Start CQ
        ci.sh(`./qp.sh -v start --id author --runmode author --port 4502 --qs-jar /home/circleci/cq/author/cq-quickstart.jar \
            --bundle org.apache.sling:org.apache.sling.junit.core:1.0.23:jar \
            --bundle com.adobe.cq:core.wcm.components.examples.ui.config:${wcmVersion}:zip \
            --bundle com.adobe.cq:core.wcm.components.examples.ui.apps:${wcmVersion}:zip \
            --bundle com.adobe.cq:core.wcm.components.examples.ui.content:${wcmVersion}:zip \
            ${extras} \
            ${!CORE_COMPONENTS ? ci.addQpFileDependency(config.modules['core-forms-components-apps'] /*, isLatestAddon ? true : false */) : ''} \
            ${!CORE_COMPONENTS ? ci.addQpFileDependency(config.modules['core-forms-components-af-apps'] /*, isLatestAddon ? true : false */) : ''} \
            ${!CORE_COMPONENTS ? ci.addQpFileDependency(config.modules['core-forms-components-core']) : ''} \
            ${!CORE_COMPONENTS ? ci.addQpFileDependency(config.modules['core-forms-components-af-core']) : ''} \
            ${!CORE_COMPONENTS ? ci.addQpFileDependency(config.modules['core-forms-components-examples-apps']) : ''} \
            ${!CORE_COMPONENTS ? ci.addQpFileDependency(config.modules['core-forms-components-examples-content']) : ''} \
            ${!CORE_COMPONENTS ? ci.addQpFileDependency(config.modules['core-forms-components-examples-core']) : ''} \
            ${ci.addQpFileDependency(config.modules['core-forms-components-it-tests-config'])} \
            ${ci.addQpFileDependency(config.modules['core-forms-components-it-tests-core'])} \
            ${ci.addQpFileDependency(config.modules['core-forms-components-it-tests-apps'])} \
            ${ci.addQpFileDependency(config.modules['core-forms-components-it-tests-content'])} \
            --vm-options \\\"-Xmx4096m -Djava.awt.headless=true -javaagent:${jacocoAgent}=destfile=crx-quickstart/jacoco-it.exec\\\" \
            ${preleaseOpts} ${contextPathOpts}`);

        if (AEM === 'classic' || AEM === 'classic-latest' || AEM === 'classic-latest-cp' || AEM === 'classic-lts') {
            // add a sleep for 10 mins, add-on takes times to come up
            ci.sh(`sleep 8m`);
            // restart the AEM insatnce
            ci.sh(`./qp.sh stop --id author`);
            ci.sh(`./qp.sh start --id author`);
            // add a sleep for 7 mins, add-on takes times to come up
            ci.sh(`sleep 8m`);
        }
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
    // add a sleep for 8 mins since 23482 version aem has become slow
    //ci.sh(`sleep 2m`);
    // Run UI tests
    if (TYPE === 'cypress') {
        if (AEM && AEM.includes("addon")) {
            // explicitly add the rum bundle, since it is only available on publish tier
            // upload webvitals and disable api region
            const disableApiRegion = "curl -u admin:admin -X POST -d 'apply=true' -d 'propertylist=disable' -d 'disable=true' http://localhost:4502/system/console/configMgr/org.apache.sling.feature.apiregions.impl";
            ci.sh(disableApiRegion);
            
            // Only remove duplicate bundles when testing SNAPSHOT builds (not specific CORE_COMPONENTS versions)
            if (!CORE_COMPONENTS) {
                // Uninstall old af-core bundles to prevent adaptTo() conflicts
                // First, log all af-core bundles to debug which one we're keeping
                const allBundles = ci.sh('curl -s -u admin:admin http://localhost:4502/system/console/bundles.json | jq -r \'.data | map(select(.symbolicName == "com.adobe.aem.core-forms-components-af-core")) | sort_by(.id | tonumber) | reverse | .[] | "ID: \\(.id) | Version: \\(.version) | State: \\(.state)"\'', true);
                console.log('Found af-core bundles:');
                console.log(allBundles);
                
                // Get SNAPSHOT bundle ID for later restart
                const afCoreSnapshotId = ci.sh('curl -s -u admin:admin http://localhost:4502/system/console/bundles.json | jq -r \'.data | map(select(.symbolicName == "com.adobe.aem.core-forms-components-af-core" and (.version | contains("SNAPSHOT")))) | .[0].id\'', true);
                
                // Keep the SNAPSHOT version (from build) and uninstall all others
                const oldBundlesInfo = ci.sh('curl -s -u admin:admin http://localhost:4502/system/console/bundles.json | jq -r \'.data | map(select(.symbolicName == "com.adobe.aem.core-forms-components-af-core" and (.version | contains("SNAPSHOT") | not))) | .[] | "\\(.id)|\\(.version)"\'', true);
                if (oldBundlesInfo && oldBundlesInfo.trim() !== '' && oldBundlesInfo !== 'null') {
                    console.log('Uninstalling old af-core bundle versions to avoid conflicts');
                    oldBundlesInfo.trim().split('\n').forEach(bundleInfo => {
                        if (bundleInfo && bundleInfo !== 'null' && bundleInfo.trim() !== '') {
                            const [bundleId, version] = bundleInfo.split('|');
                            console.log(`  Uninstalling bundle ${bundleId} (version ${version})`);
                            ci.sh(`curl -s -u admin:admin -F action=uninstall http://localhost:4502/system/console/bundles/${bundleId}`);
                        }
                    });
                }
                
                // Similarly, uninstall old core bundle versions
                const allCoreBundles = ci.sh('curl -s -u admin:admin http://localhost:4502/system/console/bundles.json | jq -r \'.data | map(select(.symbolicName == "com.adobe.aem.core-forms-components-core")) | sort_by(.id | tonumber) | reverse | .[] | "ID: \\(.id) | Version: \\(.version) | State: \\(.state)"\'', true);
                console.log('Found core bundles:');
                console.log(allCoreBundles);
                
                // Get SNAPSHOT bundle ID for later restart
                const coreSnapshotId = ci.sh('curl -s -u admin:admin http://localhost:4502/system/console/bundles.json | jq -r \'.data | map(select(.symbolicName == "com.adobe.aem.core-forms-components-core" and (.version | contains("SNAPSHOT")))) | .[0].id\'', true);
                
                const oldCoreBundlesInfo = ci.sh('curl -s -u admin:admin http://localhost:4502/system/console/bundles.json | jq -r \'.data | map(select(.symbolicName == "com.adobe.aem.core-forms-components-core" and (.version | contains("SNAPSHOT") | not))) | .[] | "\\(.id)|\\(.version)"\'', true);
                if (oldCoreBundlesInfo && oldCoreBundlesInfo.trim() !== '' && oldCoreBundlesInfo !== 'null') {
                    console.log('Uninstalling old core bundle versions to avoid conflicts');
                    oldCoreBundlesInfo.trim().split('\n').forEach(bundleInfo => {
                        if (bundleInfo && bundleInfo !== 'null' && bundleInfo.trim() !== '') {
                            const [bundleId, version] = bundleInfo.split('|');
                            console.log(`  Uninstalling bundle ${bundleId} (version ${version})`);
                            ci.sh(`curl -s -u admin:admin -F action=uninstall http://localhost:4502/system/console/bundles/${bundleId}`);
                        }
                    });
                }
                
                // Restart SNAPSHOT bundles to ensure clean wiring after uninstalling old bundles
                if ((oldBundlesInfo && oldBundlesInfo.trim() !== '' && oldBundlesInfo !== 'null') || 
                    (oldCoreBundlesInfo && oldCoreBundlesInfo.trim() !== '' && oldCoreBundlesInfo !== 'null')) {
                    
                    // Stop SNAPSHOT bundles (using IDs fetched earlier)
                    if (afCoreSnapshotId && afCoreSnapshotId.trim() !== '' && afCoreSnapshotId !== 'null') {
                        console.log(`Stopping af-core SNAPSHOT bundle (ID: ${afCoreSnapshotId.trim()})...`);
                        ci.sh(`curl -s -u admin:admin -F action=stop http://localhost:4502/system/console/bundles/${afCoreSnapshotId.trim()}`);
                    }
                    if (coreSnapshotId && coreSnapshotId.trim() !== '' && coreSnapshotId !== 'null') {
                        console.log(`Stopping core SNAPSHOT bundle (ID: ${coreSnapshotId.trim()})...`);
                        ci.sh(`curl -s -u admin:admin -F action=stop http://localhost:4502/system/console/bundles/${coreSnapshotId.trim()}`);
                    }
                    
                    console.log('Waiting 10 seconds for bundles to stop...');
                    ci.sh('sleep 10');
                    
                    // Start SNAPSHOT bundles
                    if (afCoreSnapshotId && afCoreSnapshotId.trim() !== '' && afCoreSnapshotId !== 'null') {
                        console.log(`Starting af-core SNAPSHOT bundle (ID: ${afCoreSnapshotId.trim()})...`);
                        ci.sh(`curl -s -u admin:admin -F action=start http://localhost:4502/system/console/bundles/${afCoreSnapshotId.trim()}`);
                    }
                    if (coreSnapshotId && coreSnapshotId.trim() !== '' && coreSnapshotId !== 'null') {
                        console.log(`Starting core SNAPSHOT bundle (ID: ${coreSnapshotId.trim()})...`);
                        ci.sh(`curl -s -u admin:admin -F action=start http://localhost:4502/system/console/bundles/${coreSnapshotId.trim()}`);
                    }
                    
                    console.log('Waiting 30 seconds for OSGi to re-wire bundles...');
                    ci.sh('sleep 10');
                    
                    console.log('Checking bundle stability...');
                    let attempts = 0;
                    const maxAttempts = 30; // 450 seconds additional wait if needed
                    while (attempts < maxAttempts) {
                        const inactiveBundles = ci.sh('curl -s -u admin:admin http://localhost:4502/system/console/bundles.json | jq -r \'[.data[] | select(.state != "Active" and .state != "Fragment")] | length\'', true);
                        const count = parseInt(inactiveBundles.trim());
                        if (count === 0) {
                            console.log('All bundles are active');
                            break;
                        }
                        console.log(`  ${count} bundles not active yet, waiting... (attempt ${attempts + 1}/${maxAttempts})`);
                        ci.sh('sleep 15');
                        attempts++;
                    }
                    
                    if (attempts >= maxAttempts) {
                        console.log('Warning: Some bundles still not active, checking critical bundles...');
                        const criticalBundles = ci.sh('curl -s -u admin:admin http://localhost:4502/system/console/bundles.json | jq -r \'.data | map(select((.symbolicName | contains("core-forms-components")) and (.version | contains("SNAPSHOT")))) | .[] | "\\(.symbolicName): \\(.state)"\'', true);
                        console.log('Critical SNAPSHOT bundle states:');
                        console.log(criticalBundles);
                    }
                }
            }
            
            // const installWebVitalBundle = `curl -u admin:admin \
            //                                 -F bundlefile=@'${buildPath}/it/core/src/main/resources/com.adobe.granite.webvitals-1.2.2.jar' \
            //                                 -F name='com.adobe.granite.webvitals' \
            //                                 -F action=install \
            //                                 http://localhost:4502/system/console/bundles`;
            // ci.sh(installWebVitalBundle);
            // // get the bundle id
            // const webVitalBundleId = ci.sh("curl -s -u admin:admin http://localhost:4502/system/console/bundles.json | jq -r '.data | map(select(.symbolicName == \"com.adobe.granite.webvitals\")) | .[0].id'", true);
            // console.log("Web Vital Bundle Id " + webVitalBundleId);
            // if (webVitalBundleId) {
            //     // start the web vital bundle
            //     ci.sh(`curl -u admin:admin -F action=start http://localhost:4502/system/console/bundles/${webVitalBundleId}`)
            // }
        }
        const disableToggleOption = ((FTCONFIG != null && FTCONFIG === 'false') ? `-DdisableToggle=true` : '');
        if (disableToggleOption) {
            ci.sh(`mvn clean install -pl=it/config ${disableToggleOption} -PautoInstallPackage`);
        }
        const [node, script, ...params] = process.argv;
        let testSuites = params.join(',');
        if (CORE_COMPONENTS) {
            // we run only some test suites for older core components
            testSuites = "specs/prefill/customprefill.cy.js,specs/prefill/repeatableprefillwithzerooccurrencefortabaccordionwizard.cy.js,specs/actions/submit/submit.runtime.cy.js,specs/actions/render/render_with_openapi.cy.js";
        }
        // add a sleep for 8 mins since 23482 version aem has become slow
        //ci.sh(`sleep 9m`);
        // start running the tests
        ci.dir('ui.tests', () => {
            const contextPathOption = CONTEXTPATH ? `-Daem.contextPath=/${CONTEXTPATH}` : '';
            const command = `mvn verify -U -B -Pcypress-ci -DENV_CI=true -DFORMS_FAR=${AEM} ${contextPathOption} -DspecFiles="${testSuites}"`;
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
