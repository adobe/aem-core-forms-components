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
 * Testing Form replace with Sites Editor
 */
describe('Replace functionality - sites', function () {
    // we can use these values to log in
    const pagePath = "/content/forms/sites/core-components-it/blank",
        pageDropZoneSuffix = "/jcr:content/root/responsivegrid/container";

    const dropComponentInSites = function (componentName, resourceType) {
        const dataPath = "/content/forms/sites/core-components-it/blank/jcr:content/root/responsivegrid/container/container/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, componentName, resourceType);
        cy.get('body').click(0, 0);
    }

    const testButtonReplaceBehaviour = function (editPathSelector) {
        const textInput = "[value='"+afConstants.components.forms.resourceType.formtextinput+"']",
            title = "[value='"+afConstants.components.forms.resourceType.title+"']",
            titleName = 'Adaptive Form Title',
            submitButton = "[value='/apps/forms-components-examples/components/form/actions/submit']";
        const buttonName = "Adaptive Form Button",
            buttonResourceType = afConstants.components.forms.resourceType.formbutton

        dropComponentInSites(buttonName, buttonResourceType);
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + editPathSelector);
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

    const testPanelReplaceBehaviourWithAccordion = function (editPathSelector) {
        const accordion = "[value='"+afConstants.components.forms.resourceType.accordion+"']",
            verticalTabs = "[value='"+afConstants.components.forms.resourceType.verticaltabs+"']",
            horizontalTabs = "[value='"+afConstants.components.forms.resourceType.tabsontop+"']",
            wizard = "[value='"+afConstants.components.forms.resourceType.wizard+"']",
            panelEditPath = pagePath + pageDropZoneSuffix + "/container/accordion/item_1",
            accordionDefaultPanel = "[data-path='" + panelEditPath + "']",
            accordionName = 'Adaptive Form Accordion';

        const panelName = "Adaptive Form Panel",
            panelResourceType = afConstants.components.forms.resourceType.panelcontainer

        dropComponentInSites(panelName, panelResourceType);
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + editPathSelector);
        cy.invokeEditableAction("[data-action='replace']"); // this line is causing frame busting which is causing cypress to fail
        // Check If Dialog Options Are Visible
        cy.get(accordion)
            .should("exist");
        cy.get(verticalTabs)
            .should("exist");
        cy.get(horizontalTabs)
            .should("exist");
        cy.get(wizard)
            .should("exist");
        cy.get(accordion)
            .click();
        cy.get(accordionDefaultPanel)
            .should("not.exist");

        cy.deleteComponentByTitle(accordionName);
    }

    context('Open Sites Editor', function () {
        const buttonEditPath = pagePath + pageDropZoneSuffix + "/container/button",
            buttonEditPathSelector = "[data-path='" + buttonEditPath + "']",
            panelEditPath = pagePath + pageDropZoneSuffix + "/container/panelcontainer",
            panelEditPathSelector = "[data-path='" + panelEditPath + "']";

        beforeEach(function () {
            cy.openAuthoring(pagePath);
        });

        xit('test behaviour of replace button', function () {
            testButtonReplaceBehaviour(buttonEditPathSelector);
        });

        xit('test behaviour of replace button', function () {
            testPanelReplaceBehaviourWithAccordion(panelEditPathSelector);
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

        xit('test behaviour of replace within different groups same component type', function () {
            cy.openSiteAuthoring(pagePath);
            cy.selectLayer("Edit");
            cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Image", afConstants.components.forms.resourceType.formimage);
            cy.get('body').click( 0,0);

            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + editPathSelector);
            cy.invokeEditableAction("[data-action='replace']");

            cy.get(image).click();

            cy.deleteComponentByPath(replaceCompTestGroupDrop);
        });

        xit('test behaviour of replace within different groups different component type', function () {
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
