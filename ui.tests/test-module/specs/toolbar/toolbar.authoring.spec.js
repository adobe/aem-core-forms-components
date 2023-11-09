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

    const checkToolbarAddition = function (componentEditPath) {
        const componentEditPathSelector = "[data-path='" + componentEditPath + "']",
            toolbarEditPath = componentEditPath + "/toolbar",
            toolbarEditPathSelector = "[data-path='" + toolbarEditPath + "']";
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + componentEditPathSelector);
        cy.invokeEditableAction("[data-action='addpaneltoolbar']").then(() => {
            cy.get(toolbarEditPathSelector).should("be.visible");
        });

        cy.deleteComponentByPath(toolbarEditPath); // deleting toolbar for retries
    }

    context('Add toolbar for all panel layouts', function () {
        const pagePath = "/content/forms/af/core-components-it/samples/toolbar/basic",
            panelEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/panelcontainer",
            accordionEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/accordion",
            verticalTabsEditPath =  pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/verticaltabs",
            tabsontopEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/tabsontop",
            wizardEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/wizard";

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
            cy.selectLayer("Edit");
        });

        it('Add toolbar for panelcontainer', function () {
            checkToolbarAddition(panelEditPath);
        });

        it('Add toolbar for accordion', function () {
            checkToolbarAddition(accordionEditPath);
        });

        it('Add toolbar for vertical tabs', function () {
            checkToolbarAddition(verticalTabsEditPath);
        });

        it('Add toolbar for tabs on top', function () {
            checkToolbarAddition(tabsontopEditPath);
        });

        it('Add toolbar for tabs on wizard', function () {
            checkToolbarAddition(wizardEditPath);
        });
    })

    // TODO: pending drop toolbar in forms, site editor tests

});