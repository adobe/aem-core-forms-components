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


/* global Cypress */

const sitesSelectors = require('../../libs/commons/sitesSelectors'),
    sitesConstants = require('../../libs/commons/sitesConstants'),
    afConstants = require('../../libs/commons/formsConstants');

/**
 * Testing Form replace with Sites Editor
 */
describe('Replace functionality - sites', function () {
    // we can use these values to log in
    const pagePath = "/content/forms/sites/core-components-it/blank",
        pageDropZoneSuffix = "/jcr:content/root/responsivegrid/container";

    const replaceDialog = 'coral-dialog:visible .cmp-replace-dialog-search-components';

    const selectReplacement = (resourceTypeSelector, componentPath) => {
        cy.initializeEventHandlerOnChannel(sitesConstants.EVENT_NAME_EDITABLES_UPDATED).as('replacementEditableUpdated');
        cy.initializeEventHandlerOnChannel(sitesConstants.EVENT_NAME_OVERLAYS_REPOSITIONED).as('replacementOverlaysRepositioned');
        cy.intercept('POST', '**' + componentPath).as('replaceComponent');
        cy.get(replaceDialog + ' ' + resourceTypeSelector).should('be.visible').click();
        cy.wait('@replaceComponent').its('response.statusCode').should('be.oneOf', [200, 201]);
        cy.get(replaceDialog).should('not.exist');
        cy.get('@replacementEditableUpdated').its('done').should('equal', true);
        cy.get('@replacementOverlaysRepositioned').its('done').should('equal', true);
    };

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

        cy.get(replaceDialog).should('be.visible');
        // Check If Dialog Options Are Visible
        cy.get(textInput)
            .should("not.exist");
        cy.get(submitButton)
            .should("exist");
        selectReplacement(title, pagePath + pageDropZoneSuffix + "/container/button");

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
        selectReplacement(accordion, pagePath + pageDropZoneSuffix + "/container/panelcontainer");
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

        it('test behaviour of replace button', function () {
            testButtonReplaceBehaviour(buttonEditPathSelector);
        });

        it('test behaviour of replace panel with accordion', function () {
            testPanelReplaceBehaviourWithAccordion(panelEditPathSelector);
        });

        it('recovers when the first insert action is lost during an editor refresh', function () {
            cy.intercept('POST', '**/content/forms/sites/core-components-it/blank/**', (request) => {
                request.on('response', (response) => response.setDelay(500));
            });
            const lostInsertAction = cy.stub().as('lostInsertAction');
            cy.window().then((win) => {
                const discardFirstInsert = (event) => {
                    if (event.target.closest(sitesSelectors.editableToolbar.actions.insert)) {
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        win.document.removeEventListener('click', discardFirstInsert, true);
                        lostInsertAction();
                    }
                };
                win.document.addEventListener('click', discardFirstInsert, true);
            });
            testButtonReplaceBehaviour(buttonEditPathSelector);
            cy.get('@lostInsertAction').should('have.been.calledOnce');
        });

    });

    context('Test replace action within different groups', function () {
        const templatePath = "/conf/core-components-examples/settings/wcm/templates/content-page/structure";
        const policyDialog = 'coral-dialog:visible:has([value="group:replace test group"])',
            policyCheckbox = policyDialog + ' coral-checkbox[value="group:replace test group"]';
        let originalTestGroupAllowed;

        const updateTestGroupPolicy = (allow) => {
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.self + '[data-path="' + templatePath + '/jcr:content/root/responsivegrid"]');
            cy.invokeEditableAction(sitesSelectors.editableToolbar.actions.policy);
            cy.get(policyCheckbox).scrollIntoView().should('be.visible').invoke('prop', 'checked')
                .should('be.a', 'boolean').then((checked) => {
                    if (originalTestGroupAllowed === undefined) {
                        originalTestGroupAllowed = checked;
                    }
                    if (checked !== allow) {
                        cy.get(policyCheckbox).click();
                    }
                });
            cy.get(policyCheckbox).should('have.prop', 'checked', allow);
            cy.intercept('POST', '**/conf/core-components-examples/settings/wcm/policies/**').as('saveReplacePolicy');
            cy.get(policyDialog + ' [title="Done"]').scrollIntoView().should('be.visible').click();
            cy.wait('@saveReplacePolicy').its('response.statusCode').should('be.oneOf', [200, 201]);
            cy.get(policyDialog).should('not.exist');
        };

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
            originalTestGroupAllowed = undefined;
            cy.openAuthoring(templatePath);
            updateTestGroupPolicy(true);
        });

        afterEach(function () {
            if (originalTestGroupAllowed !== undefined) {
                cy.openSiteAuthoring(templatePath);
                updateTestGroupPolicy(originalTestGroupAllowed);
            }
        });

        it('test behaviour of replace within different groups same component type', function () {
            cy.openSiteAuthoring(pagePath);
            cy.selectLayer("Edit");
            cy.cleanTest(editPath);
            cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Image", afConstants.components.forms.resourceType.formimage);
            cy.get('body').click( 0,0);

            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + editPathSelector);
            cy.invokeEditableAction("[data-action='replace']");

            selectReplacement(image, editPath);
            cy.request((Cypress.env('crx.contextPath') || '') + editPath + '.0.json')
                .its('body.sling:resourceType').should('equal', replaceCompTestGroup.replace('/apps/', ''));

            cy.deleteComponentByPath(replaceCompTestGroupDrop);
        });

        it('test behaviour of replace within different groups different component type', function () {
                const buttonEditPath = pagePath + containerSuffix + "/container/button",
                    buttonEditPathSelector = "[data-path='" + buttonEditPath + "']";

            cy.openSiteAuthoring(pagePath);
            cy.selectLayer("Edit");
            cy.cleanTest(buttonEditPath);

            cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Button", afConstants.components.forms.resourceType.formbutton);
            cy.get('body').click( 0,0);

            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + buttonEditPathSelector);
            cy.invokeEditableAction("[data-action='replace']");
            selectReplacement(image, buttonEditPath);
            cy.request((Cypress.env('crx.contextPath') || '') + buttonEditPath + '.0.json')
                .its('body.sling:resourceType').should('equal', replaceCompTestGroup.replace('/apps/', ''));
            cy.deleteComponentByPath(buttonEditPath);
        });
    });
});
