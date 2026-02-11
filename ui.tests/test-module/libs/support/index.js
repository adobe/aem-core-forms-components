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
    // sometimes AEM throws this error, but does not impact functionality
    // Cannot read properties of null (reading 'getEditContext')
    if (err.message.includes('getEditContext')) {
        return false;
    }
    if (err.message.includes("reading 'extend'")) {
        return false;
    }
    if (err.message.includes("detected that you returned a promise from a command")) {
        return false;
    }
    if (err.message.includes("sling:resourceType")) { // sometimes delete component gets called twice, hence added thiw
        return false;
    }
    // lawn chair error irrelevant
    if (err.message.includes("'transaction' on 'IDBDatabase'")) {
        return false;
    }
    // sites editor is dependent on few clientlibs which is only available on forms editor
    if (err.message.includes("Cannot read properties of undefined (reading 'touchlib')")) {
        return false;
    }
    if (err.message.includes("Cannot read properties of undefined (reading 'editLayer')")) {
        return false;
    }
    // this error is sometimes seen with embed container component intermittently
    if (err.message.includes("Cannot read properties of undefined (reading 'collection')")) {
        return false;
    }
    // sometimes this error is seen
    if (err.message.includes("Cannot read properties of undefined (reading 'path')")) {
        return false;
    }
    if (err.message.includes("Cannot set properties of undefined (setting 'label')")) {
        return false;
    }
    // sometimes aemforms container gives this error, intermittently, but functionality is not impacted
    if (err.message.includes("Cannot read properties of undefined (reading 'MESSAGE_CHANNEL')")) {
        return false;
    }
    // site editor very rarely gives this error, but no functionality impact
    if (err.message.includes("Failed to execute 'insertBefore' on 'Node'")) {
        return false;
    }

    // occasionally this error is seen
    // https://web-sdk.aptrinsic.com/api/aptrinsic.js?a=AP-AULLRFDZLJ9K-2-1:8:60690
    if (err.message.includes("Cannot read properties of undefined (reading 'contentWindow')")) {
        return false;
    }

    // circle ci is seen hanging due to this error
    if (err.message.includes("Cannot read properties of null (reading")) {
        return false;
    }

    // sometimes this error is seen during create page
    if(err.message.includes('document.registerElement is not a function')) {
        return false;
    }

    // sometimes this error is seen during create page
    if(err.message.includes('Coral is not defined')) {
        return false;
    }

    // sometimes this error comes
    if(err.message.includes("Cannot read properties of undefined (reading 'sourceEditMode')")) {
        return false;
    }

    // we still want to ensure there are no other unexpected
    // errors, so we let them fail the test
    return true;
});
