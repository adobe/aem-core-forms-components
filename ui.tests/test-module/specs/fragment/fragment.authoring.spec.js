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
const siteSelectors = require("../../libs/commons/sitesSelectors");

/**
 * Testing Fragment
 */
describe('Page - Authoring', function () {

    let toggle_array = [];

    before(() => {
        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
    });

    const fragmentPath = "/content/forms/af/core-components-it/samples/fragment/test-fragment";
    // we can use these values to log in

    const dropFragmentInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Fragment", afConstants.components.forms.resourceType.fragment);
        cy.get('body').click(0, 0);
    }

    const dropFragmentInSites = function () {
        const dataPath = "/content/core-components-examples/library/adaptive-form/fragment/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Fragment", afConstants.components.forms.resourceType.fragment);
        cy.get('body').click(0, 0);
    }

    const testFragmentDialogBehaviour = function (fragmentEditPathSelector, fragmentDrop, isSites) {
        if (isSites) {
            dropFragmentInSites();
        } else {
            dropFragmentInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + fragmentEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
        // Check If Dialog Options Are Visible
        cy.get("[name='./roleAttribute']")
            .should("exist");
        cy.get("[name='./name']")
            .should("exist");
        cy.get("[name='./fragmentPath']")
            .should("exist");
        cy.get("[name='./jcr:title']")
            .should("exist");
        cy.get("[name='./dataRef']")
            .should("exist");
        cy.get("[name='./visible']")
            .should("exist");
        cy.get("[name='./enabled']")
            .should("exist");
        cy.get("[name='./fragmentPath'] [title='Open Selection Dialog']").click();
        cy.get("[data-foundation-collection-id='/content/dam/formsanddocuments']")
            .should("be.visible");
        cy.get(".granite-pickerdialog-content button[variant='quiet']:contains('Cancel')").click();
        cy.get('.cq-dialog-cancel').click();
        cy.deleteComponentByPath(fragmentDrop);
    }

    const attachFragmentReference = function (fragmentEditPathSelector) {
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + fragmentEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        cy.get("foundation-autocomplete[name='./fragmentPath']")
            .should("exist")
            .invoke("val", fragmentPath);
        cy.get("[name='./name']")
            .should("exist")
            .invoke("val", "fragment1234");
        cy.get('.cq-dialog-submit').click();
    }

    const getContentFrameBody = () => {
        return cy
            .get('iframe#ContentFrame')
            .its('0.contentDocument.body').should('not.be.empty')
            .then(cy.wrap)
    }

    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            fragmentEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/fragment",
            fragmentPathSelector = "[data-path='" + fragmentEditPath + "']";
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert fragment in form container', function () {
            dropFragmentInContainer();
            cy.deleteComponentByPath(fragmentEditPath);
        });

        it('open edit dialog of Fragment', function () {
            testFragmentDialogBehaviour(fragmentPathSelector, fragmentEditPath);
        });

        if(cy.af.isLatestAddon()) {
            it('fragment component placeholder visible after setting fragment path', function () {
                dropFragmentInContainer();
                getContentFrameBody().find('.cmp-adaptiveform-fragment__placeholderContainer').should("not.exist");
                attachFragmentReference(fragmentPathSelector);

                // If fragment reference is set, placeholder should be visible
                getContentFrameBody().find('.cmp-adaptiveform-fragment__placeholderContainer').should("be.visible");
            });

            it('embed fragment in form', function () {
                if (toggle_array.includes("FT_FORMS-2494")) {
                    // Textfield should not exist before embeding fragment
                    getContentFrameBody().find('.cmp-adaptiveform-textinput').should("not.exist");

                    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + fragmentPathSelector);
                    cy.invokeEditableAction("[data-action='embed']");
                    cy.get("coral-dialog-header:contains('Embed Fragment')").should("be.visible");
                    cy.get("coral-selectlist-item[value='/apps/forms-components-examples/components/form/panelcontainer']").click();

                    // Textfield should be visible after embeding fragment
                    getContentFrameBody().find('.cmp-adaptiveform-textinput').should("be.visible");
                    cy.deleteComponentByPath(fragmentEditPath);
                }
            })
        }
    })

    context('Open Sites Editor', function () {
        const pagePath = "/content/core-components-examples/library/adaptive-form/fragment",
            fragmentEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/fragment",
            fragmentEditPathSelector = "[data-path='" + fragmentEditPath + "']";

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        if (toggle_array.includes("FT_FORMS-2494")) {
            it('insert aem forms Fragment', function () {
                dropFragmentInSites();
                cy.deleteComponentByPath(fragmentEditPath);
            });

            it('open edit dialog of aem forms Fragment', function () {
                testFragmentDialogBehaviour(fragmentEditPathSelector, fragmentEditPath, true);
            });
        }

        if(cy.af.isLatestAddon()) {
            it('fragment component placeholder visible after setting fragment path', function () {
                dropFragmentInSites();
                getContentFrameBody().find('.cmp-adaptiveform-fragment__placeholderContainer').should("not.exist");
                attachFragmentReference(fragmentEditPathSelector);

                // If fragment reference is set, placeholder should be visible
                getContentFrameBody().find('.cmp-adaptiveform-fragment__placeholderContainer').should("be.visible");
            })

            it('embed fragment in sites', function () {
                if (toggle_array.includes("FT_FORMS-2494")) {
                    // Textfield should not exist before embeding fragment
                    getContentFrameBody().find('.cmp-adaptiveform-textinput').should("not.exist");

                    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + fragmentEditPathSelector);
                    cy.invokeEditableAction("[data-action='embed']");
                    cy.get("coral-dialog-header:contains('Embed Fragment')").should("be.visible");
                    cy.get("coral-selectlist-item[value='/apps/forms-components-examples/components/form/panelcontainer']").click();

                    // Textfield should be visible after embeding fragment
                    getContentFrameBody().find('.cmp-adaptiveform-textinput').should("be.visible");
                    cy.deleteComponentByPath(fragmentEditPath);
                }
            })
        }

    });
});