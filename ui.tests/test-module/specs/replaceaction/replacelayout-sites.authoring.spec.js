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
 * Testing Form Button with Sites Editor
 */
describe('Button - Authoring', function () {
    // we can use these values to log in

    const dropButtonInSites = function () {
        const dataPath = "/content/core-components-examples/library/adaptive-form/button/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Button", afConstants.components.forms.resourceType.formbutton);
        cy.get('body').click(0, 0);
    }

    const testButtonBehaviour = function (buttonEditPathSelector) {
        var textInput = "[value='"+afConstants.components.forms.resourceType.formtextinput+"']",
            title = "[value='"+afConstants.components.forms.resourceType.title+"']",
            titleName = 'Adaptive Form Title',
            submitButton = "[value='/apps/forms-components-examples/components/form/actions/submit']";

        dropButtonInSites();
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + buttonEditPathSelector);
        cy.invokeEditableAction("[data-action='replace']"); // this line is causing frame busting which is causing cypress to fail
        // Check If Dialog Options Are Visible
        cy.get(textInput)
            .should("not.exist");
        cy.get(submitButton)
            .should("exist");
        cy.get(title)
            .click();

        cy.get('[title="'+titleName+'"]')
            .should('exist');

        cy.deleteComponentByTitle(titleName);
    }

    context('Open Sites Editor', function () {
        const buttonPagePath = "/content/core-components-examples/library/adaptive-form/button",
            buttonEditPath = buttonPagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/button",
            buttonEditPathSelector = "[data-path='" + buttonEditPath + "']";

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(buttonPagePath);
        });

        it('test behaviour of replace button', function () {
            testButtonBehaviour(buttonEditPathSelector, );
        });

    });

    const checkTestGroupPolicy = () => {
        cy.openAuthoring("/conf/core-components-examples/settings/wcm/templates/content-page/structure");
        cy.get('[data-text="Layout Container"]').eq(0).click()
            .then(() => {
                cy.get('.cq-editable-action').eq(3).click().then(() => {
                    cy.get('[value="group:replace test group"]').eq(0).click().then(() => {
                        cy.get('[title="Done"]').scrollIntoView().click();
                    })
                });
            });
    }

    const uncheckTestGroupPolicy = () => {
        cy.openSiteAuthoring("/conf/core-components-examples/settings/wcm/templates/content-page/structure");
        cy.get('[data-text="Layout Container"]').eq(0).click()
            .then(() => {
                cy.get('.cq-editable-action').eq(3).click().then(() => {
                    cy.get('[value="group:replace test group"]').eq(0).click().then(() => {
                        cy.get('[title="Done"]').scrollIntoView().click();
                    })
                });
            });
    }

    context('Test replace action within different groups', function () {
        const templatePath = "/conf/core-components-examples/settings/wcm/templates/content-page/structure";

        const   pagePath = "/content/forms/sites/core-components-it/blank",
            replaceCompTestGroup = "/apps/forms-core-components-it/form/image",
            image = "[value='"+replaceCompTestGroup+"']",
            containerSuffix = "/jcr:content/root/responsivegrid/container";

        const dataPath = "/content/forms/sites/core-components-it/blank/jcr:content/root/responsivegrid/container/container/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']",
            replaceCompTestGroupDataPath = containerSuffix + "/container/image",
            editPath = pagePath + replaceCompTestGroupDataPath,
            editPathSelector = "[data-path='" + editPath + "']",
            replaceCompTestGroupDrop = pagePath + containerSuffix + "/container/image";

        beforeEach(function () {
            checkTestGroupPolicy();
        });

        afterEach(function () {
            uncheckTestGroupPolicy();
        });

        it('test behaviour of replace within different groups same component type', function () {
            cy.openSiteAuthoring(pagePath);
            cy.selectLayer("Edit");
            cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Image", afConstants.components.forms.resourceType.formimage);
            cy.get('body').click( 0,0);

            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + editPathSelector);
            cy.invokeEditableAction("[data-action='replace']");

            cy.get(image).click();

            cy.deleteComponentByPath(replaceCompTestGroupDrop);
        });

        it('test behaviour of replace within different groups different component type', function () {
                const buttonEditPath = pagePath + containerSuffix + "/container/button",
                    buttonEditPathSelector = "[data-path='" + buttonEditPath + "']";

            cy.openSiteAuthoring(pagePath);
            cy.selectLayer("Edit");

            cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Button", afConstants.components.forms.resourceType.formbutton);
            cy.get('body').click( 0,0);

            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + buttonEditPathSelector);
            cy.invokeEditableAction("[data-action='replace']");
            cy.get(image).click();
            cy.deleteComponentByPath(buttonEditPath);
        });
    });
});
