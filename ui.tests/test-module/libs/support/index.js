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

// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './functions'
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')


require('cypress-terminal-report/src/installLogsCollector')();

Cypress.on('uncaught:exception', (err, runnable) => {
    // we get 'Page info could not be loaded' occasionally but does not impact functionality
    // and don't want to fail the test so we return false
    if (err.message.includes('Page info could not be loaded')) {
        return false;
    }
    if (err.message.includes("reading 'extend'")) {
        return false;
    }
    if (err.message.includes("detected that you returned a promise from a command")) {
        return false;
    }
    // we still want to ensure there are no other unexpected
    // errors, so we let them fail the test
    return true;
});
