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

/**
 * Testing Turnstile with Forms and Sites Editor
 */
describe('Page - Authoring', function () {

    const formturnstile = "/apps/forms-core-components-it/form/turnstile";

    // we can use these values to log in

    const dropTurnstileInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Cloudflare® Turnstile", formturnstile);
        cy.get('body').click(0, 0);
    }

    const dropTurnstileInSites = function () {
        const dataPath = "/content/core-components-examples/library/adaptive-form/turnstile/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Cloudflare® Turnstile", formturnstile);
        cy.get('body').click(0, 0);
    }

    const testTurnstileBehaviour = function (turnstileEditPathSelector, turnstileDrop, isSites) {
        if (isSites) {
            dropTurnstileInSites();
        } else {
            dropTurnstileInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + turnstileEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
        // Check If Dialog Options Are Visible
        cy.get("[name='./cloudServicePath']")
            .should("exist");
        cy.get("[name='./size']")
            .should("exist");
        cy.get("[name='./name']")
             .should("exist");
        cy.get("[name='./visible']")
             .should("exist");
        cy.get("coral-checkbox[name='./enabled']")
             .should("exist");

        // Checking some dynamic behaviours
        cy.get('.cq-dialog-cancel').click();
        cy.deleteComponentByPath(turnstileDrop);
    }

    context('Open Forms Editor', function() {
        const pagePath = "/content/forms/af/core-components-it/blank",
            turnstileEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/turnstile",
            turnstileEditPathSelector = "[data-path='" + turnstileEditPath + "']",
            turnstileDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + formturnstile.split("/").pop();
        beforeEach(function () {
            if (cy.af.isLatestAddon()) {
                // this is done since cypress session results in 403 sometimes
                cy.openAuthoring(pagePath);
            }
        });

        it('insert turnstile in form container', function () {
            if (cy.af.isLatestAddon()) {
                dropTurnstileInContainer();
                cy.deleteComponentByPath(turnstileDrop);
            }
        });

        it ('open edit dialog of turnstile',{ retries: 3 }, function(){
            if (cy.af.isLatestAddon()) {
                cy.cleanTest(turnstileDrop).then(function(){
                    testTurnstileBehaviour(turnstileEditPathSelector, turnstileDrop);
                });
            }
        })
    })

    context('Open Sites Editor', function () {
        const pagePath = "/content/core-components-examples/library/adaptive-form/turnstile",
            turnstileEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/turnstile",
            turnstileEditPathSelector = "[data-path='" + turnstileEditPath + "']",
            turnstileDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + formturnstile.split("/").pop();

        beforeEach(function () {
            if (cy.af.isLatestAddon()) {
                // this is done since cypress session results in 403 sometimes
                cy.openAuthoring(pagePath);
            }
        });

        it('insert aem forms turnstile', function () {
            if (cy.af.isLatestAddon()) {
                dropTurnstileInSites();
                cy.deleteComponentByPath(turnstileDrop);
            }
        });

        it('open edit dialog of aem forms turnstile', function() {
            if (cy.af.isLatestAddon()) {
                testTurnstileBehaviour(turnstileEditPathSelector, turnstileDrop, true);
            }
        });
    });

});
