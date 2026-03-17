/*
 *  Copyright 2021 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const path = require('path');

/**
 * @type {Cypress.PluginConfig}
 */
/**
 * Makes an HTTP GET or POST to AEM using only Basic Auth (no browser session cookies).
 * Used so that the AEM Granite CSRF filter recognises the request as non-browser traffic
 * (safe user-agent path) and does not require a CSRF token.
 */
function aemHttpRequest({ baseUrl, method, path, username, password, body }) {
    return new Promise((resolve, reject) => {
        const http = require('http');
        const parsedBase = new URL(baseUrl);
        const auth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
        const bodyBuffer = body ? Buffer.from(body, 'utf8') : null;
        const opts = {
            hostname: parsedBase.hostname,
            port: parseInt(parsedBase.port || '80', 10),
            path,
            method,
            headers: Object.assign(
                { Authorization: auth },
                bodyBuffer ? {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': bodyBuffer.length
                } : {}
            )
        };
        const req = http.request(opts, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });
        req.on('error', reject);
        if (bodyBuffer) req.write(bodyBuffer);
        req.end();
    });
}

const TOGGLE_PID = 'com.adobe.granite.toggle.impl.dev.DynamicToggleProviderImpl';

module.exports = (on, config) => {
    on('task', {
        /**
         * Enables or disables a single feature toggle in the live AEM instance via the
         * Felix OSGi configuration servlet. Runs entirely in Node.js so no browser
         * session cookies are sent — Basic Auth alone satisfies the server.
         *
         * @param {{ action: 'enable'|'disable', toggleId: string }} params
         */
        async updateOsgiToggleConfig({ action, toggleId }) {
            const baseUrl = config.baseUrl || 'http://localhost:4502';
            const contextPath = config.env['crx.contextPath'] || '';
            const username = config.env['crx.username'] || 'admin';
            const password = config.env['crx.password'] || 'admin';
            const configPath = `${contextPath}/system/console/configMgr/${TOGGLE_PID}`;

            const { body } = await aemHttpRequest({
                baseUrl, method: 'GET', path: `${configPath}.json`, username, password
            });
            const data = JSON.parse(body);
            const current = data[0].properties.enabledToggles.values;

            let updated;
            if (action === 'enable') {
                if (current.includes(toggleId)) return `${toggleId} already enabled`;
                updated = [...current, toggleId];
            } else {
                if (!current.includes(toggleId)) return `${toggleId} already disabled`;
                updated = current.filter(t => t !== toggleId);
            }

            const params = new URLSearchParams();
            params.append('apply', 'true');
            params.append('propertylist', 'enabledToggles');
            updated.forEach(t => params.append('enabledToggles', t));

            const result = await aemHttpRequest({
                baseUrl, method: 'POST', path: configPath,
                username, password, body: params.toString()
            });
            if (result.status !== 302) {
                throw new Error(`Felix configMgr POST returned ${result.status}: ${result.body}`);
            }
            return `${action}d ${toggleId} (HTTP ${result.status})`;
        }
    });
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config

    // Debugging: Log the values of config.fileServerFolder and config.env.specPattern
    console.log('config.fileServerFolder:', config.fileServerFolder);
    console.log('config.env.specPattern:', config.env.specPattern);

    const specPattern = config.env.specPattern;
    if (typeof specPattern !== 'string') {
        throw new TypeError('The "to" argument must be of type string. Received ' + typeof specPattern);
    }

    const fileServerFolder = config.fileServerFolder;
    if (typeof fileServerFolder !== 'string') {
        throw new TypeError('The "to" argument must be of type string. Received ' + typeof fileServerFolder);
    }

    const options = {
        outputRoot: config.projectRoot + '/target/',
        // Used to trim the base path of specs and reduce nesting in the
        // generated output directory.
        specRoot: path.relative(fileServerFolder, specPattern),
        outputTarget: {
            'cypress-logs|json': 'json'
        }
    };

    require('cypress-terminal-report/src/installLogsPrinter')(on, options);
    require('cypress-log-to-output').install(on);
};