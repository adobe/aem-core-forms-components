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

/// <reference types="cypress" />
/* global cy, Cypress, expect, window, document */

const sitesSelectors = require('../../libs/commons/sitesSelectors');
const afConstants = require('../../libs/commons/formsConstants');

describe('WebMCP form authoring and preview', () => {
    if (!cy.af.isLatestAddon()) {
        return;
    }
    const pagePath = '/content/forms/af/core-components-it/samples/accessibility';
    const containerPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX;
    const contextPath = Cypress.env('crx.contextPath') || '';
    const resourcePath = contextPath + containerPath;
    const toolNames = [
        'list_forms', 'get_form_summary', 'get_field_value', 'explain_field', 'validate_form_completeness',
        'list_repeatable_instances', 'focus_field', 'navigate_to_panel', 'set_field_value',
        'apply_prefill', 'add_repeatable_instance', 'remove_repeatable_instance', 'submit_form'
    ];
    let originalProperties;

    before(function () {
        cy.openAuthoring(pagePath);
        cy.fetchFeatureToggles().its('body.enabled').should('be.an', 'array').then(enabled => {
            if (!enabled.includes('FT_FORMS-28233')) {
                return this.skip();
            }
            cy.request(resourcePath + '.json').its('body').then(properties => {
                originalProperties = properties;
            });
        });
    });

    after(() => {
        if (!originalProperties) {
            return;
        }
        const originalValue = originalProperties['fd:webMcpEnabled'];
        const properties = originalValue === undefined ? {'fd:webMcpEnabled@Delete': ''} : {
            'fd:webMcpEnabled': originalValue,
            'fd:webMcpEnabled@TypeHint': typeof originalValue === 'boolean' ? 'Boolean' : 'String'
        };
        cy.request(contextPath + '/libs/granite/csrf/token.json').its('body.token').then(token => {
            return cy.window().then(win => win.fetch(resourcePath, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new win.URLSearchParams(Object.assign(properties, {':cq_csrf_token': token})).toString()
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Unable to restore WebMCP opt-in: HTTP ' + response.status);
                }
            }));
        });
    });

    it('enables AI assistant access in the container dialog and registers the preview catalog', () => {
        const installHost = () => {
            const tools = new Map();
            window.__webMcpTestTools = tools;
            Object.defineProperty(document, 'modelContext', {
                configurable: true,
                value: {
                    registerTool(tool) {
                        tools.set(tool.name, tool);
                        return {unregister() { tools.delete(tool.name); }};
                    }
                }
            });
        };
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + '[data-path="' + containerPath + '"]');
        cy.intercept('GET', '**/container/_cq_dialog.html/**').as('containerDialog');
        cy.invokeEditableAction('[data-action="CONFIGURE"]');
        cy.wait('@containerDialog').its('response.statusCode').should('eq', 200);
        cy.get('.cmp-adaptiveform-container__editdialog', {timeout: 60000}).contains('Basic').click({force: true});
        cy.get('coral-checkbox[name="./fd:webMcpEnabled"]').should('be.visible')
            .find('input[type="checkbox"]').check({force: true}).should('be.checked');
        cy.submitConfigureDialog();

        // Inject into the preview document so editor navigation cannot discard the test host.
        cy.intercept('GET', '**' + pagePath + '.html*', request => {
            request.continue(response => {
                expect(response.body).to.match(/<head(?:\s[^>]*)?>/i);
                response.body = response.body.replace(/<head(?:\s[^>]*)?>/i,
                    '$&<script>(' + installHost.toString() + ')();</script>');
            });
        });
        cy.previewForm(pagePath + '.html').then(formContainer => {
            expect(formContainer.getModel().webMcpEnabled).to.equal(true);
        });
        cy.window().its('__webMcpTestTools').as('tools').should(registered => {
            expect(Array.from(registered.keys())).to.have.members(toolNames);
            registered.forEach(tool => {
                expect(tool.execute, tool.name).to.be.a('function');
                expect(tool.inputSchema.type, tool.name).to.equal('object');
            });
            expect(registered.get('validate_form_completeness').annotations)
                .to.include({readOnlyHint: true, untrustedContentHint: true});
        });
        cy.get('@tools').then(tools => tools.get('list_forms').execute({})).then(result => {
            expect(result.success).to.equal(true);
            expect(result.forms).to.have.length(1);
        });
        cy.get('@tools').then(tools => tools.get('get_form_summary').execute({})).then(summary => {
            expect(summary.success).to.equal(true);
            expect(summary.fields.length).to.be.greaterThan(10);
        });
    });
});
