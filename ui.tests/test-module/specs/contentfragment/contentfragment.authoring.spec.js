/*
 *  Copyright 2023 Adobe Systems Incorporated
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

// This recipe is to test the Content Fragment Component functionality

// We are going to test a few things:
// 1. Open Edit layer
// 2. Perform few operations

// Be sure to run the aem server
// before running the tests below.

const commons = require('../../libs/commons/commons'),
    sitesSelectors = require('../../libs/commons/sitesSelectors'),
    afConstants = require('../../libs/commons/formsConstants');
const siteSelectors = require("../../libs/commons/sitesSelectors");

// todo: beta specific form authoring test cases are not run (only common functionality [of beta and to be GA] test are executed)
describe('Content Fragment - Authoring', function () {

    const dropContentFragmentInContainer = function() {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Content Fragment", afConstants.components.resourceType.contentfragment);
        cy.get('body').click( 0,0);
    }

    const dropContentFragmentInSites = function() {
        const dataPath = "/content/core-components-examples/library/adaptive-form/container/jcr:content/root/responsivegrid/demo/component/formContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Content Fragment", afConstants.components.resourceType.contentfragment);
        cy.get('body').click( 0,0);
    }

    const testContentFragmentBehaviour = function(cfEditPathSelector, cfDrop, isSites) {
        if (isSites) {
            dropContentFragmentInSites();
        } else {
            dropContentFragmentInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + cfEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        // Check If Dialog Options Are Visible
        cy.get("[name='./fragmentPath']")
            .should("exist");
        cy.get("[name='./displayMode']")
            .should("exist");

        cy.get("[name='./fragmentPath'] input[role='combobox']").should("exist").clear()
            .type("/content/dam/wknd/library/sample-assets/adobe-headquarters", { delay: 0 }).click().then(x => {
            cy.get('.cq-dialog-submit').click().then(y => {
                cy.get('.cq-dialog-submit').should('not.exist').then(z => {
                    cy.deleteComponentByPath(cfDrop);
                });
            });
        });
    }

    const dropExperienceFragmentInSites = function() {
        const dataPath = "/content/core-components-examples/library/adaptive-form/container/jcr:content/root/responsivegrid/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Experience Fragment", afConstants.components.resourceType.experiencefragment);
        cy.get('body').click( 0,0);
    }

    const testExperienceFragmentBehaviour = function(xfEditPathSelector, xfDrop) {
        dropExperienceFragmentInSites();
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + xfEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        // Check If Dialog Options Are Visible
        cy.get("[name='./fragmentVariationPath']")
            .should("exist");

        cy.get("[name='./fragmentVariationPath'] input[role='combobox']").should("exist").clear()
            .type("/content/experience-fragments/test-experience-fragment/master", { delay: 0 }).click();
        cy.get("._coral-Menu-itemLabel:contains(/content/experience-fragments/test-experience-fragment/master)").should("be.visible").click();
        cy.get('.cq-dialog-submit').click().then(y => {
            cy.get('.cq-dialog-submit').should('not.exist').then(z => {
                cy.deleteComponentByPath(xfDrop);
            });
        });
    }

    context("Open Forms Editor", function () {
        // we can use these values to log in
        const pagePath = "/content/forms/af/core-components-it/blank",
            cfEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/contentfragment",
            cfEditPathSelector = "[data-path='" + cfEditPath + "']",
            cfDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.resourceType.contentfragment.split("/").pop();
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert content fragment inside adaptive form container component', function() {
            testContentFragmentBehaviour(cfEditPathSelector, cfDrop, false);
        });
    });

    // commenting once we support adaptive form container in sites editor, uncomment this test
    context("Open Sites Editor", function () {
        // we can use these values to log in
        const pagePath = "/content/core-components-examples/library/adaptive-form/container";
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert content fragment inside adaptive form container component', function() {
            const cfEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/formContainer/contentfragment",
                cfEditPathSelector = "[data-path='" + cfEditPath + "']",
                cfDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/formContainer/' + afConstants.components.resourceType.contentfragment.split("/").pop();
            testContentFragmentBehaviour(cfEditPathSelector, cfDrop, true);
        });

        it('insert experience fragment containing form container component in Sites page', function () {
            const xfEditPath = pagePath + "/jcr:content/root/responsivegrid/experiencefragment",
                xfEditPathSelector = "[data-path='" + xfEditPath + "']",
                xfDrop = pagePath + "/jcr:content/root/responsivegrid/" + afConstants.components.resourceType.experiencefragment.split("/").pop();
            testExperienceFragmentBehaviour(xfEditPathSelector, xfDrop);
        });
    });

});
