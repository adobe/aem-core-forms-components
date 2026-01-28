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

/**
 * Testing Panel Container with Sites Editor
 */
describe('Page - Authoring', function () {
    // we can use these values to log in

    const dropPanelInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Panel", afConstants.components.forms.resourceType.panelcontainer);
        cy.get('body').click(0, 0);
    }

    const dropPanelInSites = function () {
        const dataPath = "/content/core-components-examples/library/adaptive-form/panelcontainer/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Panel", afConstants.components.forms.resourceType.panelcontainer);
        cy.get('body').click(0, 0);
    }

    const testPanelBehaviour = function (panelContainerEditPathSelector, panelContainerDrop, isSites) {
        if (isSites) {
            dropPanelInSites();
        } else {
            dropPanelInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + panelContainerEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
        // Check If Dialog Options Are Visible
        cy.get("[name='./roleAttribute']")
            .should("exist");
        cy.get("[name='./name']")
            .should("exist");
        cy.get("[name='./jcr:title']")
            .should("exist");
        cy.get("[name='./fd:useFieldset']")
            .should("exist");

        if (!isSites) {
            cy.get("[name='./layout']")
                .should("not.exist");
        } else {
            //because we don't use templates in the sites test, we simply use demo component to add the guidecontainer and display the html
            cy.get("[name='./layout']")
                .should("exist");
        }
        cy.get("[name='./dataRef']")
            .should("exist");
        cy.get("[name='./visible']")
            .should("exist");
        cy.get("[name='./enabled']")
            .should("exist");
        cy.get("[name='./assistPriority']")
            .should("exist");
        cy.get("[name='./custom']")
            .should("exist");

        cy.get('.cq-dialog-cancel').click();
        cy.deleteComponentByPath(panelContainerDrop);
    };

    const testSaveAsFragmentBehaviour = (pagePath, panelContainerEditPathSelector, panelContainerPath, isSites) => {
        if (isSites) {
            dropPanelInSites();
        } else {
            dropPanelInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + panelContainerEditPathSelector);
        cy.invokeEditableAction("[data-action='saveAsFragment']"); // this line is causing frame busting which is causing cypress to fail
        // Check If Dialog Options Are Visible
        cy.get("[name='name']")
            .should("be.visible");
        cy.get("[name='jcr:title']")
            .should("exist");
        cy.get("[name='targetPath']")
            .should("be.visible")
            .invoke('val', "/content/dam/formsanddocuments");
        cy.get("[name='./schemaType']")
            .should("exist");
        cy.get("[name='templatePath']")
            .should("be.visible");
        // Assuming there is one fragment component (in most cases) so this field should not be visible
        cy.get("[name='fragmentComponent']").should("not.be.visible");

        cy.intercept('POST' , '**/adobe/forms/fm/v1/saveasfragment').as('saveAsFragment');
        cy.get("[name='name']").clear().type("panel-saved-as-fragment");
        // Coral autocomplete component is taking some time to initialisation
        cy.get('.cmp-adaptiveform-saveasfragment__templateselector')
            .should(($el) => {
                expect($el.data('autocomplete')).to.exist;
            });
        cy.get("[name='templatePath']")
            .invoke("val", "/conf/core-components-examples/settings/wcm/templates/afv2frag-template")
            .trigger("change");
        cy.get(".cq-dialog-submit").click();
        cy.wait('@saveAsFragment').then(({request, response}) => {
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.have.property('formPath', '/content/dam/formsanddocuments/panel-saved-as-fragment');
        });
        cy.openSiteAuthoring(pagePath);
        cy.deleteComponentByPath(panelContainerPath)
    }

    const deleteSavedFragment = () => {
        cy.openPage("/aem/forms.html/content/dam/formsanddocuments", {noLogin: true});
        cy.get("body").then(($body) => {
            const selector = "[data-foundation-collection-item-id='/content/dam/formsanddocuments/panel-saved-as-fragment']";
            if ($body.find(selector).length > 0) {
                cy.get(selector)
                    .trigger('mouseenter')
                    .trigger('mouseover');
                cy.get(`${selector} [title='Select']`).click({ force: true });
                cy.get(".formsmanager-admin-action-delete").click();
                cy.get("#fmbase-id-modal-template button[variant='warning']").click();
            }
        });
    }

    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            panelEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/panelcontainer",
            panelContainerPathSelector = "[data-path='" + panelEditPath + "']";
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert Panel in form container', function () {
            dropPanelInContainer();
            cy.deleteComponentByPath(panelEditPath);
        });

        it('Check placeholder text in Panel ', function () {
            dropPanelInContainer();
            cy.get(panelContainerPathSelector).get("[data-text='Please drag Panel components here']").should("exist");;
        });

        it('open edit dialog of Panel', function () {
            testPanelBehaviour(panelContainerPathSelector, panelEditPath);
        })

        it('check rich text support for label', function(){
            dropPanelInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + panelContainerPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");
            cy.get("div[name='richTextTitle']").should('not.be.visible');

            // check rich text selector and see if RTE is visible.
            cy.get('.cmp-adaptiveform-base__istitlerichtext').should('be.visible').click();
            cy.get("div[name='richTextTitle']").should('be.visible');
            cy.get('.cq-dialog-cancel').click();
            cy.deleteComponentByPath(panelEditPath);
        });

        it('check fieldset option exists and behavior', function(){
            dropPanelInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + panelContainerPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");

            // Verify useFieldset checkbox exists
            cy.get("[name='./fd:useFieldset']")
                .first()
                .should("exist")
                .should("be.visible");

            // Get the title field label and verify initial state
            cy.get("[name='./jcr:title']").should("exist");

            // Check if useFieldset checkbox is checked and verify title becomes required
            cy.get("[name='./fd:useFieldset']").first().then(($checkbox) => {
                const isChecked = $checkbox.prop('checked');
                // Find the label for jcr:title field by navigating from the input to its parent wrapper
                cy.get("[name='./jcr:title']").parent().find('label').then(($label) => {
                    if (isChecked) {
                        // When fieldset is checked, title should be required
                        expect($label.text()).to.include('*');
                    }
                });
            });

            // Toggle the checkbox and verify the label changes accordingly
            cy.get("[name='./fd:useFieldset']").first().click();
            cy.get("[name='./fd:useFieldset']").first().then(($checkbox) => {
                const isChecked = $checkbox.prop('checked');
                cy.get("[name='./jcr:title']").parent().find('label').then(($label) => {
                    if (isChecked) {
                        // When fieldset is checked, title should be required
                        expect($label.text()).to.include('*');
                    } else {
                        // When fieldset is unchecked, title should not be required
                        expect($label.text()).to.not.include('*');
                    }
                });
            });

            cy.get('.cq-dialog-cancel').click();
            cy.deleteComponentByPath(panelEditPath);
        });

        if (cy.af.isLatestAddon()) {
            it('Save panel as fragment via toolbar', { retries: 3}, function () {
                cy.cleanTest(panelEditPath).then(function () {
                    deleteSavedFragment();
                    cy.openSiteAuthoring(pagePath);
                    testSaveAsFragmentBehaviour(pagePath, panelContainerPathSelector, panelEditPath);
                    deleteSavedFragment();
                })
            })
       }
    })

    context('Open Sites Editor', function () {
        const pagePath = "/content/core-components-examples/library/adaptive-form/panelcontainer",
            panelContainerEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/panelcontainer",
            panelContainerEditPathSelector = "[data-path='" + panelContainerEditPath + "']";

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert aem forms Panel', function () {
            dropPanelInSites();
            cy.deleteComponentByPath(panelContainerEditPath);
        });

        it('open edit dialog of aem forms Panel', function () {
            testPanelBehaviour(panelContainerEditPathSelector, panelContainerEditPath, true);
        });

        if (cy.af.isLatestAddon()) {
            it('Save panel as fragment via toolbar', { retries: 3}, function () {
                cy.cleanTest(panelContainerEditPath).then(function () {
                    deleteSavedFragment();
                    cy.openSiteAuthoring(pagePath);
                    testSaveAsFragmentBehaviour(pagePath, panelContainerEditPathSelector, panelContainerEditPath, true);
                    deleteSavedFragment();
                })
            });
        }
    });
});