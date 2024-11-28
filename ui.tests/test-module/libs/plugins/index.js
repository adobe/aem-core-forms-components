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
module.exports = (on, config) => {
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