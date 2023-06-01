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


const sitesSelectors = require('../../libs/commons/sitesSelectors'),
    afConstants = require('../../libs/commons/formsConstants');

/**
 * Testing data binding in forms editor
 */
describe('Page - Authoring', function () {

    const dropTextInputInContainer = function() {
        const dataPath = "/content/forms/af/core-components-it/samples/databinding/basic/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Text Box", afConstants.components.forms.resourceType.formtextinput);
        cy.get('body').click( 0,0);
    }

    const dropTextInputInSites = function() {
        const dataPath = "/content/core-components-examples/library/adaptive-form/textinput/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Text Box", afConstants.components.forms.resourceType.formtextinput);
        cy.get('body').click( 0,0);
    }

    const testDataBindingBehaviour = function(textInputEditPathSelector) {
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + textInputEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
        cy.get("[name='./dataRef']")
            .should("exist")
            .scrollIntoView();
        cy.get("[name='./dataRef']").should("have.value", "");

        cy.get("[name='./dataRef'] + .bindRefSelectorButtonGroup .bindRefSelectorButton").click({force: true});
        cy.get("coral-dialog.is-open coral-tree [data-value='$.firstName']")
            .should("exist")
            .click({force:true});
        cy.get(".tree-dialog-ok")
            .should("be.enabled")
            .click();

        cy.get("[name='./dataRef']").should("have.value", "$.firstName");
        cy.get(".cq-dialog-submit").click();
    }

    const testBindingPersistence = (textInputEditPathSelector) => {
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + textInputEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
        cy.get("[name='./dataRef']")
            .should("exist")
            .scrollIntoView();
        cy.get("[name='./dataRef']").should("have.value", "$.firstName");
        cy.get('.cq-dialog-cancel').click();
    }

    const configureDataModel = (formContainerEditPathSelector) => {
         // click configure action on adaptive form container component
         cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + formContainerEditPathSelector);
         cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
 
         //open data model tab
         cy.get('.cmp-adaptiveform-container'+'__editdialog').contains('Data Model').click({force:true});
         cy.get("[name='./schemaType']").should("exist");
 
         //select data model
         cy.get(".cmp-adaptiveform-container__selectformmodel").click();
         cy.get("coral-selectlist-item[value='none']").contains('None').should('exist');
         cy.get("coral-selectlist-item[value='jsonschema']").contains('Schema').should('be.visible').click();
 
         //select json schema and save it
         cy.get(".cmp-adaptiveform-container__schemaselectorcontainer").should("be.visible").click();
         cy.get("coral-selectlist-item[value='/content/dam/formsanddocuments/core-components-it/samples/databinding/sample.schema.json']").contains('sample.schema.json').should('be.visible').click();
         cy.get(".cq-dialog-submit").click();
    }

    context('Open Forms Editor', function() {
        const pagePath ="/content/forms/af/core-components-it/samples/databinding/basic",
            textInputEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/textinput",
            textInputEditPathSelector = "[data-path='" + textInputEditPath + "']",
            textInputDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formtextinput.split("/").pop();
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        //if (cy.af.isLatestAddon()) {
            it ('test data binding', { retries: 3 }, function(){
                cy.cleanTest(textInputDrop).then(function(){
                    dropTextInputInContainer();
                    testDataBindingBehaviour(textInputEditPathSelector, textInputDrop);
                    cy.openSiteAuthoring(pagePath);
                    testBindingPersistence(textInputEditPathSelector);
                    cy.deleteComponentByPath(textInputDrop);
                });
            })
        //}
    })

    context('Open Sites Editor', function () {
        const   pagePath = "/content/core-components-examples/library/adaptive-form/textinput",
            formContainerEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer",
            formContainerEditPathSelector = "[data-path='" + formContainerEditPath + "']",
            textInputEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/textinput",
            textInputEditPathSelector = "[data-path='" + textInputEditPath + "']",
            textInputDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.formtextinput.split("/").pop();

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        //if (cy.af.isLatestAddon()) {
            it('test data binding', function () {
                configureDataModel(formContainerEditPathSelector);
                dropTextInputInSites();
                testDataBindingBehaviour(textInputEditPathSelector)
                cy.openSiteAuthoring(pagePath);
                testBindingPersistence(textInputEditPathSelector);
                cy.deleteComponentByPath(textInputDrop);
            });
        //}
    });
});
