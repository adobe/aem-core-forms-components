/*******************************************************************************
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
 ******************************************************************************/

/* global cy, Cypress, expect */
const sitesSelectors = require('../../libs/commons/sitesSelectors');
const constants = require('../../libs/commons/formsConstants');

describe('Authoring synchronization', {retries: 0}, function () {
    const page = '/content/forms/af/core-components-it/blank';
    const container = page + constants.FORM_EDITOR_FORM_CONTAINER_SUFFIX;
    const component = container + '/telephoneinput';
    const overlay = sitesSelectors.overlays.overlay.component + '[data-path=\'' + component + '\']';
    const insert = () => cy.insertComponent(
        sitesSelectors.overlays.overlay.component + '[data-path=\'' + container + '/*\']',
        'Adaptive Form Telephone input',
        constants.components.forms.resourceType.formtelephoneinput
    );

    beforeEach(function () {
        cy.openAuthoring(page);
        cy.cleanTest(component);
    });

    afterEach(function () {
        cy.cleanTestFixture(component);
    });

    it('cleans persisted fixtures while their overlay is still rendering', function () {
        insert();
        cy.get(overlay).then($overlay => {
            const parent = $overlay.parent();
            $overlay.detach();
            setTimeout(() => parent.append($overlay), 2000);
        });
        cy.cleanTest(component);
        cy.request({url: (Cypress.env('crx.contextPath') || '') + component + '.json', failOnStatusCode: false})
            .its('status').should('equal', 404);
    });

    it('recovers a lost Insert click without inserting twice', function () {
        let lostClick = false;
        cy.document().then(doc => {
            const discardFirstClick = event => {
                if (event.target.closest('[data-action="INSERT"]')) {
                    lostClick = true;
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    doc.removeEventListener('click', discardFirstClick, true);
                }
            };
            doc.addEventListener('click', discardFirstClick, true);
        });
        insert();
        cy.then(() => expect(lostClick, 'injected lost Insert click').to.equal(true));
        cy.get(overlay).should('have.length', 1);
        cy.getContentIFrameBody().find('.cmp-adaptiveform-telephoneinput').should('have.length', 1);
    });

    it('recovers a lost layer-switcher opening click', function () {
        cy.selectLayer('Layouting');
        cy.get('body').click(0, 0);
        cy.get(sitesSelectors.selectLayer.popover.self).should('not.be.visible');
        let lostClick = false;
        cy.document().then(doc => {
            const option = doc.querySelector(sitesSelectors.selectLayer.popover.edit);
            const parent = option.parentNode;
            const next = option.nextSibling;
            option.remove();
            setTimeout(() => parent.insertBefore(option, next), 4500);
            const discardFirstClick = event => {
                if (event.target.closest(sitesSelectors.selectLayer.trigger)) {
                    lostClick = true;
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    doc.removeEventListener('click', discardFirstClick, true);
                }
            };
            doc.addEventListener('click', discardFirstClick, true);
        });
        cy.selectLayer('Edit');
        cy.then(() => expect(lostClick, 'injected lost layer-switcher click').to.equal(true));
        cy.get(sitesSelectors.selectLayer.current + '[data-layer="Edit"].is-selected').should('be.visible');
    });

    it('waits for delayed insertion and configure refreshes before deleting', function () {
        cy.intercept('POST', '**' + container + '/*', request => {
            request.on('response', response => response.setDelay(1000));
        });
        insert();
        cy.openEditableToolbar(overlay);
        cy.invokeEditableAction('[data-action="CONFIGURE"]');
        cy.fillTextField('input[name="./jcr:title"]', 'Synchronized telephone');
        cy.submitConfigureDialog();
        cy.request((Cypress.env('crx.contextPath') || '') + component + '.json')
            .its('body.jcr:title').should('equal', 'Synchronized telephone');
        cy.deleteComponentByPath(component);
    });
});
