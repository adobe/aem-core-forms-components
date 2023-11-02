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

const e = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');

module.exports = class CI {

    /**
     * Print build context to stdout.
     */
    context() {
        this.sh('java -version');
        this.sh('mvn -v');
        console.log("Node version: %s", process.version);
        this.sh('printf "NPM version: $(npm --version)"', false, false);
    };

    /**
     * Switch working directory for the scope of the given function.
     */
    dir(dir, func) {
        let currentDir = process.cwd();
        process.chdir(dir);
        console.log('// Changed directory to: ' + process.cwd());
        try {
            func();
        } finally {
            process.chdir(currentDir);
            console.log('// Changed directory back to: ' + currentDir);
        }
    };

    /**
     * Checkout git repository with the given branch into the given folder.
     */
    checkout(repo, branch = 'master', folder = '') {
        this.sh('git clone -b ' + branch + ' ' + repo + ' ' + folder);
    };

    /**
     * Run shell command and attach to process stdio.
     */
    sh(command, returnStdout = false, print = true) {
        if (print) {
            console.log(command);
        }
        if (returnStdout) {
            return e.execSync(command).toString().trim();
        }
        return e.execSync(command, {stdio: 'inherit'});
    };

    /**
     * Return value of given environment variable.
     */
    env(key) {
        return process.env[key];
    }

    /**
     * Print stage name.
     */
    stage(name) {
        console.log("\n------------------------------\n" +
            "--\n" +
            "-- %s\n" +
            "--\n" +
            "------------------------------\n", name);
    };

    /**
     * Configure a git impersonation for the scope of the given function.
     */
    gitImpersonate(user, mail, func) {
        try {
            this.sh('git config --local user.name ' + user + ' && git config --local user.email ' + mail, false, false);
            func()
        } finally {
            this.sh('git config --local --unset user.name && git config --local --unset user.email', false, false);
        }
    };

    async restartAem() {
        // Retry the Curl command with the specified maxRetries
        for (let i = 1; i <= 5; i++) {
            let retryInterval = 5;  // Number of seconds to wait between retries
            console.log(`Attempt ${i}:`);
            const curlCommand = `curl -i -X POST -u admin:admin http://localhost:4502/system/console/vmstat --data 'shutdown_type=Restart' --max-time 300 --retry 2 --retry-delay 10 --retry-max-time 300 --compressed`;
            const curlResult = e.spawnSync(curlCommand, {shell: true, stdio: 'inherit', encoding : 'utf8'});

            if (curlResult.status === 0) {
                console.log('Curl Success!');
                break;  // Break out of the loop if Curl is successful
            } else {
                console.log('aem restart failed. Retrying in', retryInterval, 'seconds...');
                this.sh(`sleep 1m`);
                //await new Promise(resolve => setTimeout(resolve, retryInterval * 1000));
            }
        }

        // check if rest api code is working
        // Retry the request with the specified maxRetries
        for (let i = 1; i <= 5; i++) {
            try {
                console.log(`Rest API attempt ${i}:`);
                const curlCommand = `curl -i -X GET -u admin:admin http://localhost:4502/adobe/forms/af/L2NvbnRlbnQvZm9ybXMvYWYvY29yZS1jb21wb25lbnRzLWl0L2JsYW5r --max-time 300`;
                const curlResult = e.execSync(curlCommand, { encoding: 'utf8' });
                console.log(curlResult);
                if (curlResult.includes('HTTP/1.1 200 OK')) {
                    console.log('URL returned a 200 status code.');

                    // Parse JSON from the response
                    const jsonResponse = curlResult.split('\r\n\r\n')[1];
                    const responseObj = JSON.parse(jsonResponse);

                    if (responseObj && responseObj.afModelDefinition && typeof responseObj.afModelDefinition === 'object' && Object.keys(responseObj.afModelDefinition).length > 0) {
                        console.log('afModelDefinition key with object value found in JSON response.');
                        break; // Break out of the loop if the conditions are met
                    }
                } else {
                    console.log('rest api failed. Retrying in 5 mins');
                    this.sh(`sleep 8m`);
                    //await new Promise(resolve => setTimeout(resolve, 300000));
                }
            } catch (error) {
                console.error('Error:', error.message);
                console.log('Retrying in 300 seconds...'); // Wait 5 minutes before retrying
                this.sh(`sleep 8m`);
                //await new Promise(resolve => setTimeout(resolve, 300000));
            }
        }
    }

    /**
     * Configure git credentials for the scope of the given function.
     */
    gitCredentials(repo, func) {
        try {
            this.sh('git config credential.helper \'store --file .git-credentials\'');
            fs.writeFileSync('.git-credentials', repo);
            console.log('// Created file .git-credentials.');
            func()
        } finally {
            this.sh('git config --unset credential.helper');
            fs.unlinkSync('.git-credentials');
            console.log('// Deleted file .git-credentials.');
        }
    };

    /**
     * Writes given content to a file.
     */
    writeFile(fileName, content) {
        console.log(`// Write to file ${fileName}`);
        fs.writeFileSync(fileName, content, { 'encoding': 'utf8' });
    }

    collectConfiguration() {
        let configuration = {
            modules: {}
        };

        let folders = [process.cwd()];
        process.stdout.write("Collecting project configuration");
        while(folders.length) {
            let folder = folders.shift();
            let files = fs.readdirSync(folder, { withFileTypes: true });

            for(let file of files) {
                if (file.isDirectory()) {
                    folders.push(path.resolve(folder, file.name));
                    continue;
                }

                if (file.name !== 'pom.xml') {
                    continue;
                }

                let pomPath = path.resolve(folder, file.name);
                let metaData = this.sh('printf \'${project.groupId}|${project.artifactId}|${project.name}|${project.version}|${project.packaging}\' | mvn -f ' + pomPath + ' help:evaluate --non-recursive | grep -Ev "(Download|\\[)"', true, false).split('|');
                configuration.modules[metaData[1]] = {
                    groupId: metaData[0],
                    artifactId: metaData[1],
                    name: metaData[2],
                    version: metaData[3],
                    packaging: metaData[4],
                    path: folder
                };
                process.stdout.write('.');
            }
        }
        process.stdout.write(require('os').EOL);
        fs.writeFileSync('configuration.json', JSON.stringify(configuration, null, 4));

        return configuration;
    }

    restoreConfiguration() {
        let configuration = fs.readFileSync('configuration.json');
        return JSON.parse(configuration);
    }

    addQpFileDependency(module, cloud = false) {
        let output = '--install-file ';

        let filename = `${module.artifactId}-${module.version}`;
        if (cloud) {
            filename += '-cloud';
        }
        if (module.packaging == 'content-package') {
            filename += '.zip';
        } else if (module.packaging == 'bundle') {
            filename += '.jar';
        }

        output += path.resolve(module.path, 'target', filename);

        return output;
    }

    async postCommentToGitHubFromCI(commentText){

        const {CIRCLE_PROJECT_USERNAME, CIRCLE_PROJECT_REPONAME, CIRCLE_PULL_REQUEST, GITHUB_TOKEN } = process.env
        if(!CIRCLE_PULL_REQUEST) // its not a PULL request
         return
        const prNumber = CIRCLE_PULL_REQUEST.split('/').pop();
        const apiUrl = new URL(`https://api.github.com/repos/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}/issues/${prNumber}/comments`);
        const postData = JSON.stringify({body: commentText});

        // Define the options for the HTTPS request
        const options = {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
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

};