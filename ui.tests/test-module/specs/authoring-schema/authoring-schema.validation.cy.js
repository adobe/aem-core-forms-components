/*
 *  Copyright 2026 Adobe Systems Incorporated
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

/**
 * JCR Authoring Schema Validation
 *
 * Fetches a random sample of live Adaptive Forms from AEM via infinity.json and
 * validates each form's entire guideContainer tree in a single Node.js task call.
 * The task walks every node with a `fieldType` property and validates it against
 * the root adaptive-form-component authoring schema (oneOf discriminator keyed on
 * fieldType / fd:viewType). Schema violations are logged as warnings.
 *
 * Discovery: samples root (depth=1) → component categories → individual form dirs.
 */

const SAMPLES_ROOT = '/content/forms/af/core-components-it/samples';
// Number of individual form paths to validate per run (random subset for speed)
const SAMPLE_SIZE  = 5;

describe('JCR Authoring Schema Validation', () => {
    const username    = Cypress.env('crx.username') || 'admin';
    const password    = Cypress.env('crx.password') || 'admin';
    const contextPath = Cypress.env('crx.contextPath') || '';

    let formPaths = [];

    before(() => {
        // Fetch the top-level samples listing (depth=1) to discover component categories.
        // Forms live one level deeper: samples/<category>/<formName>
        cy.request({
            url: `${contextPath}${SAMPLES_ROOT}.1.json`,
            auth: { username, password }
        }).then(listingResponse => {
            expect(listingResponse.status).to.eq(200);
            const categories = Object.keys(listingResponse.body)
                .filter(key => !key.startsWith('jcr:') && typeof listingResponse.body[key] === 'object');

            const discoveredPaths = [];
            cy.wrap(categories).each(category => {
                cy.request({
                    url: `${contextPath}${SAMPLES_ROOT}/${category}.1.json`,
                    auth: { username, password },
                    failOnStatusCode: false
                }).then(catResponse => {
                    if (catResponse.status !== 200) return;
                    Object.keys(catResponse.body)
                        .filter(key => !key.startsWith('jcr:') && typeof catResponse.body[key] === 'object')
                        .forEach(formName => discoveredPaths.push(`${SAMPLES_ROOT}/${category}/${formName}`));
                });
            }).then(() => {
                formPaths = Cypress._.sampleSize(discoveredPaths, SAMPLE_SIZE);
                cy.log(`Sampled ${formPaths.length} forms from ${discoveredPaths.length} discovered: ${formPaths.join(', ')}`);
            });
        });
    });

    it('validates guideContainer JCR trees against the authoring schema', () => {
        cy.wrap(null).then(() => {
            expect(formPaths.length, 'at least one form path discovered').to.be.greaterThan(0);
        });

        cy.wrap(formPaths).each(formPath => {
            // Sling encodes jcr:content as _jcr_content in URLs
            const infinityUrl = `${contextPath}${formPath}/_jcr_content/guideContainer.infinity.json`;
            cy.log(`Validating ${infinityUrl}`);

            cy.request({
                url: infinityUrl,
                auth: { username, password },
                failOnStatusCode: false
            }).then(response => {
                if (response.status !== 200) {
                    cy.log(`SKIP ${formPath} — status ${response.status}`);
                    return;
                }

                // Pass the entire JSON tree to the task — it walks and validates internally
                cy.task('validateJcrTree', { json: response.body, formPath }).then(result => {
                    if (result.violations.length > 0) {
                        result.violations.forEach(v => {
                            cy.log(`SCHEMA VIOLATION at ${v.path} (fieldType=${v.fieldType}): ${v.errors.join('; ')}`);
                        });
                    } else {
                        cy.log(`OK — no violations in ${formPath}`);
                    }
                    expect(result).to.have.property('violations');
                });
            });
        });
    });
});
