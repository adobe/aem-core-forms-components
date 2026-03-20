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
 * Fetches ALL Adaptive Form pages under the samples root from AEM via the
 * QueryBuilder API, then validates each form's entire guideContainer tree in
 * a single Node.js task call.  The task walks every node with a `fieldType`
 * property and validates it against the root adaptive-form-component authoring
 * schema (oneOf discriminator keyed on fieldType / fd:viewType).
 *
 * Discovery: QueryBuilder (type=cq:Page, path=samples root, p.limit=-1) returns
 * every form page regardless of nesting depth — avoiding the manual 2-level
 * traversal that previously missed top-level pages such as
 * .../samples/accessibility.
 */

const SAMPLES_ROOT = '/content/forms/af/core-components-it/samples';

describe('JCR Authoring Schema Validation', () => {
    const username    = Cypress.env('crx.username') || 'admin';
    const password    = Cypress.env('crx.password') || 'admin';
    const contextPath = Cypress.env('crx.contextPath') || '';

    let formPaths = [];

    before(() => {
        // QueryBuilder returns all cq:Page nodes under the samples root in one
        // request, regardless of nesting depth.
        cy.request({
            url: `${contextPath}/bin/querybuilder.json`,
            qs: {
                path: SAMPLES_ROOT,
                type: 'cq:Page',
                'p.limit': '-1',
                'p.hits': 'selective',
                'p.properties': 'jcr:path'
            },
            auth: { username, password }
        }).then(response => {
            expect(response.status).to.eq(200);
            formPaths = (response.body.hits || []).map(h => h['jcr:path']);
            cy.log(`Discovered ${formPaths.length} form pages under ${SAMPLES_ROOT}`);
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
                    expect(result.violations, `schema violations in ${formPath}`).to.be.empty;
                });
            });
        });
    });
});
