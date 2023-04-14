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
 * Testing Form Component replace behaviour in authoring
 */
describe('component replace - Authoring', function () {
    const pagePath = "/content/forms/af/core-components-it/blank",
        buttonEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/button",
        buttonEditPathSelector = "[data-path='" + buttonEditPath + "']",
        buttonDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formbutton.split("/").pop();

    const fileInputEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/fileinput",
        fileInputEditPathSelector = "[data-path='" + fileInputEditPath + "']",
        fileInputDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formfileinput.split("/").pop();

    const containerEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/panelcontainer",
        containerEditPathSelector = "[data-path='" + containerEditPath + "']",
        containerDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/panelcontainer";

    const containerDataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*";

    const dropComponent = function (componentEditPathSelector, dataPath) {
        const responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        switch (componentEditPathSelector) {
            case buttonEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Button", afConstants.components.forms.resourceType.formbutton);
                break;
            case fileInputEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form File Attachment", afConstants.components.forms.resourceType.formfileinput);
                break;
            case containerEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Panel", afConstants.components.forms.resourceType.panelcontainer);
                break;
        }
        cy.get('body').click(0, 0);
    }

    const testReplaceForFileInput = function (componentEditPathSelector, componentDrop) {
        dropComponent(componentEditPathSelector, containerDataPath);

        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + componentEditPathSelector);
        cy.get("[data-action='replace']").should("not.exist");
        cy.deleteComponentByPath(componentDrop);
    }

    const testComponentReplaceBehaviour = function (componentEditPathSelector, componentDrop) {

        var textInput = "[value='"+afConstants.components.forms.resourceType.formtextinput+"']",
            titlePath = "[value='"+afConstants.components.forms.resourceType.title+"']",
            submitButton = "[value='/apps/forms-components-examples/components/form/actions/submit']",
            titleName = 'Adaptive Form Title',

            horizontalTabs = "[value='/apps/forms-components-examples/components/form/tabsontop']",
            accordion = "[value='/apps/forms-components-examples/components/form/accordion']",
            wizard = "[value='/apps/forms-components-examples/components/form/wizard']";

        dropComponent(componentEditPathSelector, containerDataPath);

        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + componentEditPathSelector);
        cy.invokeEditableAction("[data-action='replace']");

        // Check If Dialog Options Are Visible
        if (componentEditPathSelector == buttonEditPathSelector) {
            cy.get(textInput)
                .should("not.exist");
            cy.get(submitButton)
                .should("exist");
            cy.get(titlePath)
                .click();
            cy.get('[title="'+titleName+'"]')
                .should('exist');
            cy.deleteComponentByTitle(titleName);
            return;
        } else {
            cy.get(horizontalTabs)
                .should("exist");
            cy.get(accordion)
                .should("exist");
            cy.get(wizard)
                .should("exist");
            cy.get(accordion)
                .click();
        }
        cy.deleteComponentByPath(componentDrop);
    }

    context('Open Forms Editor', function () {
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('replace button with title', function () {
            testComponentReplaceBehaviour(buttonEditPathSelector, buttonDrop);
        })

        it('replace panel container with other container', function () {
            testComponentReplaceBehaviour(containerEditPathSelector, containerDrop);
        })

        it('test behaviour of replace file input', function () {
            testReplaceForFileInput(fileInputEditPathSelector, fileInputDrop);
        })
    })
});
