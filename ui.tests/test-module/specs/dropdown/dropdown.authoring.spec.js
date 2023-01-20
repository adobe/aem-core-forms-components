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


const commons = require('../../libs/commons/commons'),
    sitesSelectors = require('../../libs/commons/sitesSelectors'),
    sitesConstants = require('../../libs/commons/sitesConstants'),
    guideSelectors = require('../../libs/commons/guideSelectors'),
    afConstants = require('../../libs/commons/formsConstants');

/**
 * Testing Dropdown with Sites Editor
 */
describe('Page - Authoring', function () {
    // we can use these values to log in

    const insertDropDownInContainer = function() {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Drop-down List", afConstants.components.forms.resourceType.formdropdown);
        cy.get('body').click( 0,0);
    }

    const insertDropDownInSites = function() {
        const dataPath = "/content/core-components-examples/library/adaptive-form/dropdown/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Drop-down List", afConstants.components.forms.resourceType.formdropdown);
        cy.get('body').click( 0,0);
    }

    const testDropDownBehaviour = function(dropDownEditPathSelector, dropdown, isSites) {
        if (isSites) {
            insertDropDownInSites();
        } else {
            insertDropDownInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + dropDownEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
        // Check If Dialog Options Are Visible
        cy.get("[name='./multiSelect']")
            .should("exist");
        cy.get("[name='./typeIndex']")
            .should("exist");
        cy.get("[name='./typeIndex']")
            .should("exist");

        // Checking some dynamic behaviours
        cy.get('[name="./multiSelect"][type="checkbox"]').should("exist").check();
        cy.get(".cmp-adaptiveform-dropdown__defaultvaluemultiselect").should("have.css","display","block");

        cy.get('[name="./multiSelect"][type="checkbox"]').should("exist").uncheck();
        cy.get(".cmp-adaptiveform-dropdown__defaultvalue").should("have.css","display","block");

        cy.get('.cq-dialog-cancel').click();
        cy.deleteComponentByPath(dropdown);
    }

    context('Open Forms Editor', function() {
        const pagePath = "/content/forms/af/core-components-it/blank",
            dropDownEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/dropdown",
            dropDownEditPathSelector = "[data-path='" + dropDownEditPath + "']",
            dropdown = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formdropdown.split("/").pop();
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert Dropdown in form container', function () {
            insertDropDownInContainer();
            cy.deleteComponentByPath(dropdown);
        });

        it ('open edit dialog of Dropdown', function(){
            testDropDownBehaviour(dropDownEditPathSelector, dropdown);
        })

        it ('check value type validations', function() {

            // For Number Type
            insertDropDownInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + dropDownEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");
            cy.get('.cmp-adaptiveform-dropdown__savevaluetype').children('._coral-Dropdown-trigger').click();
            cy.get("coral-selectlist-item-content").contains('Number').should('be.visible').click({force: true});
            cy.get(".cmp-adaptiveform-dropdown__defaultvalue input").invoke('val', 'Not a Number');
            cy.get('.cq-dialog-submit').click();
            cy.get('.coral-Form-errorlabel').should('contain.text', 'Value Type Mismatch');

            cy.get('.cq-dialog-cancel').click();
            cy.deleteComponentByPath(dropdown);

            // For Boolean
            insertDropDownInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + dropDownEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");
            cy.get('.cmp-adaptiveform-dropdown__savevaluetype').children('._coral-Dropdown-trigger').click();
            cy.get("coral-selectlist-item-content").contains('Boolean').click({force: true});
            cy.get(".cmp-adaptiveform-dropdown__defaultvalue input").invoke('val', 'Not a Boolean');
            cy.get('.cq-dialog-submit').click();
            cy.get('.coral-Form-errorlabel').should('contain.text', 'Value Type Mismatch');

            cy.get('.cq-dialog-cancel').click();
            cy.deleteComponentByPath(dropdown);
        })
    })

    context('Open Sites Editor', function () {
        const   pagePath = "/content/core-components-examples/library/adaptive-form/dropdown",
            dropDownEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/dropdown",
            dropDownEditPathSelector = "[data-path='" + dropDownEditPath + "']",
            dropdown = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.formdropdown.split("/").pop();

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert aem forms DropDown', function () {
            insertDropDownInSites();
            cy.deleteComponentByPath(dropdown);
        });

        it('open edit dialog of aem forms Dropdown', function() {
            testDropDownBehaviour(dropDownEditPathSelector, dropdown, true);
        });

    });
});