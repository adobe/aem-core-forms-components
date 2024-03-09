/*
 *  Copyright 2024 Adobe Systems Incorporated
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

describe('Page - Authoring', function () {
    const dropTelephoneDropdownInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Telephone Drop-down List", afConstants.components.forms.resourceType.formtelephonedropdown);
        cy.get('body').click(0, 0);
    }
    const dropTelephoneDropdownInSites = function () {
        const dataPath = "/content/core-components-examples/library/adaptive-form/telephonedropdown/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Telephone Input", afConstants.components.forms.resourceType.formtelephoneinput);
        cy.get('body').click(0, 0);
    }

    const testTelephoneInputBehaviour = function(telephoneInputEditPathSelector, telephoneInputDrop, isSites) {
        const bemEditDialog = '.cmp-adaptiveform-telephonedropdown__editdialog'
        if (isSites) {
            dropTelephoneDropdownInSites();
        } else {
            dropTelephoneDropdownInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + telephoneInputEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
        cy.get("[name='./autocomplete']")
            .should("exist");
        cy.get(bemEditDialog).contains('Validation').click({force:true});
        cy.get('.cq-dialog-cancel').click();
        cy.deleteComponentByPath(telephoneInputDrop);
    }

    context('Open Forms Editor', function() {
        const pagePath = "/content/forms/af/core-components-it/blank",
            telephoneInputEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/telephonedropdown",
            telephoneInputEditPathSelector = "[data-path='" + telephoneInputEditPath + "']",
            telephoneInputDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formtelephonedropdown.split("/").pop();
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert TelephoneDropdown in form container', function () {
            dropTelephoneDropdownInContainer();
            cy.deleteComponentByPath(telephoneInputDrop);
        });

        it ('open edit dialog of TelephoneDropdown', { retries: 3 }, function(){
            cy.cleanTest(telephoneInputDrop).then(function() {
                testTelephoneInputBehaviour(telephoneInputEditPathSelector, telephoneInputDrop);
            });
        })

        it.only ('change validation pattern type of TelephoneDropdown', function () {
            const bemEditDialog = '.cmp-adaptiveform-telephonedropdown__editdialog';
            dropTelephoneDropdownInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + telephoneInputEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");
            cy.get(bemEditDialog).contains('Validation').click({force: true}).then(() => {
                cy.get('.cmp-adaptiveform-telephonedropdown__validationformat').should('have.value', '');
               // cy.get('.cmp-adaptiveform-telephonedropdown__validationformat').type('^[+]1[0-9]{0,10}$');
                // cy.get('.cmp-adaptiveform-telephonedropdown__validationpattern select').type('^[+]1[0-9]{0,10}$');
                // cy.get('.cmp-adaptiveform-telephonedropdown__validationformat').should('have.value', '^[+]1[0-9]{0,10}$');
                cy.get('.cq-dialog-cancel').click();
                cy.deleteComponentByPath(telephoneInputDrop);
            });
        });

        context('Open Sites Editor', function () {
            const   pagePath = "/content/core-components-examples/library/adaptive-form/telephonedropdwon",
                telephoneInputEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/telephonedropdown",
                telephoneInputEditPathSelector = "[data-path='" + telephoneInputEditPath + "']",
                telephoneInputDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.formtelephonedropdown.split("/").pop();

            beforeEach(function () {
                // this is done since cypress session results in 403 sometimes
                cy.openAuthoring(pagePath);
            });

            it('insert aem forms TelephoneInput', function () {
                dropTelephoneDropdownInSites();
                cy.deleteComponentByPath(telephoneInputDrop);
            });

            it('open edit dialog of aem forms TelephoneInput', { retries: 3 }, function() {
                cy.cleanTest(telephoneInputDrop).then(function(){
                    testTelephoneInputBehaviour(telephoneInputEditPathSelector, telephoneInputDrop, true);
                });
            });

        });
    });
});
