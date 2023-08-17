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
const { TYPE, BROWSER, AEM, PRERELEASE } = process.env;

try {
    ci.stage("Integration Tests");
    let wcmVersion = ci.sh('mvn help:evaluate -Dexpression=core.wcm.components.version -q -DforceStdout', true);
    ci.dir(qpPath, () => {
        // Connect to QP
        ci.sh('./qp.sh -v bind --server-hostname localhost --server-port 55555');

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
        extras += ` --bundle com.adobe.cq:core.wcm.components.all:${wcmVersion}:zip`;
        if (PRERELEASE === 'true') {
            // enable pre-release settings
            preleaseOpts = "--cmd-options \\\"-r prerelease\\\"";
        }
    }
    // add feature toggle impl bundle to check FT on cloud ready or release/650 instance
    extras += ` --install-file ${buildPath}/it/core/src/main/resources/com.adobe.granite.toggle.impl.dev-1.1.2.jar`;

    // Start CQ
    ci.sh(`./qp.sh -v start --id author --runmode author --port 4502 --qs-jar /home/circleci/cq/author/cq-quickstart.jar \
            --bundle org.apache.sling:org.apache.sling.junit.core:1.0.23:jar \
            --bundle com.adobe.cq:core.wcm.components.examples.ui.config:${wcmVersion}:zip \
            --bundle com.adobe.cq:core.wcm.components.examples.ui.apps:${wcmVersion}:zip \
            --bundle com.adobe.cq:core.wcm.components.examples.ui.content:${wcmVersion}:zip \
            ${extras} \
            ${ci.addQpFileDependency(config.modules['core-forms-components-apps'])} \
            ${ci.addQpFileDependency(config.modules['core-forms-components-af-apps'])} \
            ${ci.addQpFileDependency(config.modules['core-forms-components-af-core'])} \
            ${ci.addQpFileDependency(config.modules['core-forms-components-examples-apps'])} \
            ${ci.addQpFileDependency(config.modules['core-forms-components-examples-content'])} \
            ${ci.addQpFileDependency(config.modules['core-forms-components-examples-core'])} \
            ${ci.addQpFileDependency(config.modules['core-forms-components-it-tests-config'])} \
            ${ci.addQpFileDependency(config.modules['core-forms-components-it-tests-core'])} \
            ${ci.addQpFileDependency(config.modules['core-forms-components-it-tests-apps'])} \
            ${ci.addQpFileDependency(config.modules['core-forms-components-it-tests-content'])} \
            --vm-options \\\"-Xmx4096m -XX:MaxPermSize=1024m -Djava.awt.headless=true -javaagent:${process.env.JACOCO_AGENT}=destfile=crx-quickstart/jacoco-it.exec\\\" \
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
        const [node, script, ...params] = process.argv;
        let testSuites = params.join(',');
        // start running the tests
        ci.dir('ui.tests', () => {
            const command = `mvn verify -U -B -Pcypress-ci -DENV_CI=true -DFORMS_FAR=${AEM} -DspecFiles="${testSuites}"`;
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

} finally { // Always download logs from AEM container
    ci.sh('mkdir logs');
    ci.dir('logs', () => {
        // A webserver running inside the AEM container exposes the logs folder, so we can download log files as needed.
        ci.sh('curl -O -f http://localhost:3000/crx-quickstart/logs/error.log');
    ci.sh('curl -O -f http://localhost:3000/crx-quickstart/logs/stdout.log');
    ci.sh('curl -O -f http://localhost:3000/crx-quickstart/logs/stderr.log');
    ci.sh(`find . -name '*.log' -type f -size +32M -exec echo 'Truncating: ' {} \\; -execdir truncate --size 32M {} +`);
});
}
