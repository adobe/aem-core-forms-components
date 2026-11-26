/*
 * Copyright 2026 Adobe. All rights reserved.
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
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const filename = path.resolve(__dirname, '../../ui.tests/test-module/libs/plugins/index.js');

function setup(browsers, execFileSync) {
    const context = {
        module: { exports: {} },
        console: { log() {} },
        require(name) {
            switch (name) {
            case 'path':
                return path;
            case 'child_process':
                return { execFileSync };
            case 'cypress-terminal-report/src/installLogsPrinter':
                return () => {};
            case 'cypress-log-to-output':
                return { install() {} };
            default:
                throw new Error(`Unexpected import: ${name}`);
            }
        }
    };
    vm.runInNewContext(readFileSync(filename, 'utf8'), context, { filename });
    return context.module.exports(() => {}, {
        browsers,
        env: { specPattern: 'specs/**/*.cy.js' },
        fileServerFolder: '/project',
        projectRoot: '/project'
    });
}

test('preserves ordinary Chrome metadata without executing a browser', () => {
    const browser = { name: 'chrome', version: '121.0.6167.139', majorVersion: 121 };
    setup([browser], () => assert.fail('Ordinary Chrome must not be re-detected'));
    assert.equal(browser.version, '121.0.6167.139');
    assert.equal(browser.majorVersion, 121);
});

test('reads the real version when Cypress misidentifies Chrome for Testing', () => {
    const browser = { name: 'chrome', path: '/usr/local/bin/google-chrome', version: 'for', majorVersion: NaN };
    setup([browser], (binary, args) => {
        assert.equal(binary, browser.path);
        assert.equal(args.join(' '), '--product-version');
        return '121.0.6167.139\n';
    });
    assert.equal(browser.version, '121.0.6167.139');
    assert.equal(browser.majorVersion, 121);
});

test('rejects invalid version output instead of passing incorrect metadata to Cypress', () => {
    const browser = { name: 'chrome', path: '/usr/local/bin/google-chrome', version: 'for' };
    assert.throws(() => setup([browser], () => 'invalid\n'), /Unexpected Chrome version: invalid/);
});
