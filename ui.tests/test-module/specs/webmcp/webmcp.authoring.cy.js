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
/* global cy, Cypress, expect */

const sitesSelectors = require('../../libs/commons/sitesSelectors');
const afConstants = require('../../libs/commons/formsConstants');

describe.skip('WebMCP form authoring and preview', () => {
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

    before(() => {
        cy.openAuthoring(pagePath);
        cy.fetchFeatureToggles().its('body.enabled').should('include', 'FT_FORMS-28233');
        cy.request(resourcePath + '.json').its('body').then(properties => {
            originalProperties = properties;
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
            cy.request({
                method: 'POST',
                url: resourcePath,
                form: true,
                body: Object.assign(properties, {':cq_csrf_token': token})
            });
        });
    });

    it('enables AI assistant access in the container dialog and registers the preview catalog', () => {
        const tools = new Map();
        const host = {
            registerTool(tool) {
                tools.set(tool.name, tool);
                return {unregister() { tools.delete(tool.name); }};
            }
        };
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + '[data-path="' + containerPath + '"]');
        cy.invokeEditableAction('[data-action="CONFIGURE"]');
        cy.get('.cmp-adaptiveform-container__editdialog').contains('Basic').click({force: true});
        cy.get('coral-checkbox[name="./fd:webMcpEnabled"]').should('be.visible')
            .find('input[type="checkbox"]').check({force: true}).should('be.checked');
        cy.submitConfigureDialog();

        cy.previewForm(pagePath + '.html', {
            onBeforeLoad(win) {
                Object.defineProperty(win.document, 'modelContext', {configurable: true, value: host});
            }
        }).then(formContainer => {
            expect(formContainer.getModel().webMcpEnabled).to.equal(true);
        });
        cy.wrap(tools, {log: false}).should(registered => {
            expect(Array.from(registered.keys())).to.have.members(toolNames);
            registered.forEach(tool => {
                expect(tool.execute, tool.name).to.be.a('function');
                expect(tool.inputSchema.type, tool.name).to.equal('object');
            });
            expect(registered.get('validate_form_completeness').annotations)
                .to.include({readOnlyHint: true, untrustedContentHint: true});
        });
        cy.then(() => tools.get('list_forms').execute({})).then(result => {
            expect(result.success).to.equal(true);
            expect(result.forms).to.have.length(1);
        });
        cy.then(() => tools.get('get_form_summary').execute({})).then(summary => {
            expect(summary.success).to.equal(true);
            expect(summary.fields.length).to.be.greaterThan(10);
        });
    });
});
