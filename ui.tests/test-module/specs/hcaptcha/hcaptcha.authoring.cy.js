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
 * Testing hCaptcha with Forms and Sites Editor
 */
describe('Page - Authoring', function () {

    const formhcaptcha = "/apps/forms-core-components-it/form/hcaptcha";

    // we can use these values to log in

    const dropHCaptchaInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form hCaptcha", formhcaptcha);
        cy.get('body').click(0, 0);
    }

    const dropHCaptchaInSites = function () {
        const dataPath = "/content/core-components-examples/library/adaptive-form/hcaptcha/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form hCaptcha", formhcaptcha);
        cy.get('body').click(0, 0);
    }

    const testHCaptchaBehaviour = function (hCaptchaEditPathSelector, hCaptchaDrop, isSites) {
        if (isSites) {
            dropHCaptchaInSites();
        } else {
            dropHCaptchaInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + hCaptchaEditPathSelector);
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
        cy.deleteComponentByPath(hCaptchaDrop);
    }

    context('Open Forms Editor', function() {
        const pagePath = "/content/forms/af/core-components-it/blank",
            hCaptchaEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/hcaptcha",
            hCaptchaEditPathSelector = "[data-path='" + hCaptchaEditPath + "']",
            hCaptchaDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + formhcaptcha.split("/").pop();
        beforeEach(function () {
            if (cy.af.isLatestAddon()) {
                // this is done since cypress session results in 403 sometimes
                cy.openAuthoring(pagePath);
            }
        });

        it('insert hCaptcha in form container', function () {
            if (cy.af.isLatestAddon()) {
                dropHCaptchaInContainer();
                cy.deleteComponentByPath(hCaptchaDrop);
            }
        });

        it ('open edit dialog of hCaptcha',{ retries: 3 }, function(){
            if (cy.af.isLatestAddon()) {
                cy.cleanTest(hCaptchaDrop).then(function(){
                    testHCaptchaBehaviour(hCaptchaEditPathSelector, hCaptchaDrop);
                });
            }
        })
    })

    context('Open Sites Editor', function () {
        const pagePath = "/content/core-components-examples/library/adaptive-form/hcaptcha",
            hCaptchaEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/hcaptcha",
            hCaptchaEditPathSelector = "[data-path='" + hCaptchaEditPath + "']",
            hCaptchaDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + formhcaptcha.split("/").pop();

        beforeEach(function () {
            if (cy.af.isLatestAddon()) {
                // this is done since cypress session results in 403 sometimes
                cy.openAuthoring(pagePath);
            }
        });

        it('insert aem forms hCaptcha', function () {
            if (cy.af.isLatestAddon()) {
                dropHCaptchaInSites();
                cy.deleteComponentByPath(hCaptchaDrop);
            }
        });

        it('open edit dialog of aem forms hCaptcha', function() {
            if (cy.af.isLatestAddon()) {
                testHCaptchaBehaviour(hCaptchaEditPathSelector, hCaptchaDrop, true);
            }
        });
    });

});
