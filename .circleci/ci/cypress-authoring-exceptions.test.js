/*
 * Copyright 2026 Adobe
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
 */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const supportFile = path.resolve(__dirname, '../../ui.tests/test-module/libs/support/index.js');
let exceptionHandler;
vm.runInNewContext(fs.readFileSync(supportFile, 'utf8').replace(/^import .+$/gm, ''), {
    Cypress: {
        on(event, handler) {
            assert.equal(event, 'uncaught:exception');
            exceptionHandler = handler;
        }
    },
    require(name) {
        assert.equal(name, 'cypress-terminal-report/src/installLogsCollector');
        return () => {};
    }
}, {filename: supportFile});

test('ignores the requested getEditable authoring error', () => {
    assert.equal(exceptionHandler(new TypeError('Cannot read properties of undefined (reading \'getEditable\')')), false);
});

test('keeps a different editable lookup error fatal', () => {
    assert.equal(exceptionHandler(new TypeError('Cannot read properties of undefined (reading \'getEditables\')')), true);
});

test('keeps unrelated application failures fatal', () => {
    assert.equal(exceptionHandler(new Error('Rule editor failed to initialize')), true);
});
