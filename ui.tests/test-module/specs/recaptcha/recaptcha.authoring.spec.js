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
 * Testing Recaptcha with Sites Editor
 */
describe('Page - Authoring', function () {

    const formrecaptcha = "/apps/forms-core-components-it/form/recaptcha";

    // we can use these values to log in

    const dropRecaptchaInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form reCAPTCHA", formrecaptcha);
        cy.get('body').click(0, 0);
    }

    const dropRecaptchaInSites = function () {
        const dataPath = "/content/core-components-examples/library/adaptive-form/recaptcha/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form reCAPTCHA", formrecaptcha);
        cy.get('body').click(0, 0);
    }

    const testRecaptchaBehaviour = function (recaptchaEditPathSelector, recaptchaDrop, isSites) {
        if (isSites) {
            dropRecaptchaInSites();
        } else {
            dropRecaptchaInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + recaptchaEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
        // Check If Dialog Options Are Visible
        cy.get("[name='./rcCloudServicePath']")
            .should("exist");
        cy.get("[name='./recaptchaSize']")
            .should("exist");
        cy.get("[name='./name']")
             .should("exist");
        cy.get("[name='./visible']")
             .should("exist");
        cy.get("coral-checkbox[name='./enabled']")
             .should("exist");

        // Checking some dynamic behaviours
        cy.get('.cq-dialog-cancel').click();
        cy.deleteComponentByPath(recaptchaDrop);
    }

    context('Open Forms Editor', function() {
        const pagePath = "/content/forms/af/core-components-it/blank",
            recaptchaEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/recaptcha",
            recaptchaEditPathSelector = "[data-path='" + recaptchaEditPath + "']",
            recaptchaDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + formrecaptcha.split("/").pop();
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert Recaptcha in form container', function () {
            dropRecaptchaInContainer();
            cy.deleteComponentByPath(recaptchaDrop);
        });

        it ('open edit dialog of Recaptcha',{ retries: 3 }, function(){
            cy.cleanTest(recaptchaDrop).then(function(){
                testRecaptchaBehaviour(recaptchaEditPathSelector, recaptchaDrop);
            });
        })
    })

    context('Open Sites Editor', function () {
        const pagePath = "/content/core-components-examples/library/adaptive-form/recaptcha",
            recaptchaEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/recaptcha",
            recaptchaEditPathSelector = "[data-path='" + recaptchaEditPath + "']",
            recaptchaDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + formrecaptcha.split("/").pop();

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert aem forms Recaptcha', function () {
            dropRecaptchaInSites();
            cy.deleteComponentByPath(recaptchaDrop);
        });

        it('open edit dialog of aem forms Recaptcha', function() {
            testRecaptchaBehaviour(recaptchaEditPathSelector, recaptchaDrop, true);
        });
    });

});