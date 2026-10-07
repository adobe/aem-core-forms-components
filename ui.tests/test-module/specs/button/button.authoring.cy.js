/*
 *  Copyright 2022 Adobe Systems Incorporated
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


const sitesSelectors = require('../../libs/commons/sitesSelectors'),
    afConstants = require('../../libs/commons/formsConstants');
const {recurse} = require('cypress-recurse');

/**
 * Testing Form Button with Sites Editor
 */
describe('Button - Authoring', function () {
    // we can use these values to log in

    const dropButtonInContainer = function() {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Button", afConstants.components.forms.resourceType.formbutton);
        cy.get('body').click( 0,0);
    }

    const dropButtonInSites = function() {
        const dataPath = "/content/core-components-examples/library/adaptive-form/button/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Button", afConstants.components.forms.resourceType.formbutton);
        cy.get('body').click( 0,0);
    }

    const getContentIframeBody = () => {
        // get the iframe > document > body
        // and retry until the body element is not empty
        return cy
            .get('iframe#ContentFrame')
            .its('0.contentDocument.body').should('not.be.empty')
            .then(cy.wrap)
      }

    const testButtonBehaviour = function(buttonEditPathSelector, buttonDrop, isSites) {
        if (isSites) {
            dropButtonInSites();
        } else {
            dropButtonInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + buttonEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
        // Check If Dialog Options Are Visible
        cy.get("[name='./name']")
            .should("exist");
        cy.get("[name='./visible']")
            .should("exist");
        cy.get("coral-checkbox[name='./enabled']")
            .should("exist");
        cy.get("[name='./readOnly']")
            .should("not.exist");

        // Checking some dynamic behaviours
        cy.get('.cq-dialog-cancel').click();
        cy.get('.cq-dialog-cancel').should('not.exist');
        cy.deleteComponentByPath(buttonDrop);
    }

    const openButtonInlineEditor = function(buttonEditPathSelector) {
        recurse(
            () => {
                cy.get('body').then($body => {
                    if (!$body.find('.rte-toolbar:visible').length) {
                        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + buttonEditPathSelector);
                        cy.get('body').then($currentBody => {
                            if (!$currentBody.find('.rte-toolbar:visible').length) {
                                cy.invokeEditableAction("[data-action='EDIT']");
                            }
                        });
                    }
                });
                return cy.get('body');
            },
            $body => $body.find('.rte-toolbar:visible').length === 1,
            {limit: 21, delay: 500, timeout: 10000, log: false}
        );
        return cy.get('.rte-toolbar:visible').should('have.length', 1);
    };

    const enableButtonRichText = function(buttonEditPathSelector) {
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + buttonEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        cy.get("input[name='./isTitleRichText'][type='checkbox']").check({force: true}).should('be.checked');
        cy.get("div[name='richTextTitle']").should('be.visible');
        cy.submitConfigureDialog();
    };

    const testButtonBehaviourInilineEdit = function(buttonEditPathSelector, buttonDrop, isSites) {
        const updatedLabel = 'Updated Button';
        if (isSites) {
            dropButtonInSites();
        } else {
            dropButtonInContainer();
        }
        enableButtonRichText(buttonEditPathSelector);
        const contextPath = Cypress.env('crx.contextPath') || '';
        [updatedLabel, ''].forEach(label => {
            openButtonInlineEditor(buttonEditPathSelector);
            getContentIframeBody().find('.cmp-adaptiveform-button__text').should('have.length', 1)
                .then(($span) => {
                    $span[0].textContent = label;
                });
            recurse(
                () => {
                    cy.get('body').then($body => {
                        if ($body.find('.rte-toolbar:visible').length) {
                            cy.get('body').click(0, 0);
                        }
                    });
                    return cy.get('body');
                },
                $body => !$body.find('.rte-toolbar:visible').length,
                {limit: 21, delay: 500, timeout: 10000, log: false}
            );
            getContentIframeBody().find('.cmp-adaptiveform-button button').should($button => {
                expect($button).to.have.length(1);
                expect($button.text().trim()).to.equal(label);
            });
            cy.request(contextPath + buttonDrop + '.json').its('body').should(body => {
                if (label) {
                    expect(body['jcr:title']).to.equal(label);
                } else {
                    expect([undefined, '']).to.include(body['jcr:title']);
                }
            });
        });
    };


    context('Open Forms Editor', function() {
        const pagePath = "/content/forms/af/core-components-it/blank",
            buttonEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/button",
            buttonEditPathSelector = "[data-path='" + buttonEditPath + "']",
            buttonDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formbutton.split("/").pop();
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        afterEach(function () {
            cy.cleanTestFixture(buttonDrop);
        });

        it('insert Button in form container', function () {
            dropButtonInContainer();
            cy.deleteComponentByPath(buttonDrop);
        });

        it ('open edit dialog of Button',{ retries: 3 }, function(){
            cy.cleanTest(buttonDrop).then(function(){
                testButtonBehaviour(buttonEditPathSelector, buttonDrop);
            });
        });

        it ('open Inline edit dialog of Button', function(){
            cy.cleanTest(buttonDrop).then(function(){
                testButtonBehaviourInilineEdit(buttonEditPathSelector, buttonDrop);
                cy.deleteComponentByPath(buttonDrop);
            });
        });

        it('check rich text support for label', function(){
            dropButtonInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + buttonEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");
            cy.get("div[name='richTextTitle']").should('not.be.visible');

            // check rich text selector and see if RTE is visible.
            cy.get('.cmp-adaptiveform-base__istitlerichtext').should('be.visible').click();
            cy.get("div[name='richTextTitle']").should('be.visible');
            cy.get('.cq-dialog-submit').click();
        });

        it('check rich text inline editor is present', function(){
            cy.cleanTest(buttonDrop).then(function() {
                dropButtonInContainer();
                enableButtonRichText(buttonEditPathSelector);
                openButtonInlineEditor(buttonEditPathSelector);
                cy.get('.rte-toolbar:visible .rte-toolbar-item[title="Close"]').should('be.visible').click();
                cy.get('.rte-toolbar:visible').should('not.exist');
                cy.deleteComponentByPath(buttonDrop);
            });
        });
    });

    context('Open Sites Editor', function () {
        const   pagePath = "/content/core-components-examples/library/adaptive-form/button",
            buttonEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/button",
            buttonEditPathSelector = "[data-path='" + buttonEditPath + "']",
            buttonDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.formbutton.split("/").pop();

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert aem forms Button', function () {
            dropButtonInSites();
            cy.deleteComponentByPath(buttonDrop);
        });

        it('open edit dialog of aem forms Button', { retries: 3 }, function() {
            cy.cleanTest(buttonDrop).then(function() {
                testButtonBehaviour(buttonEditPathSelector, buttonDrop, true);
            });
        });

    });
});