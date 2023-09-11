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
    const fieldTypes = {TEXT: 'text', SELECT: 'select', NON_INPUT: 'nonInputReadOnly'}
    const typeMap = {
        "formbutton": fieldTypes.NON_INPUT,
        "formcheckboxgroup": fieldTypes.SELECT,
        "datepicker": fieldTypes.TEXT,
        "formdropdown": fieldTypes.SELECT,
        "formemailinput": fieldTypes.TEXT,
        "formnumberinput": fieldTypes.TEXT,
        "formradiobutton": fieldTypes.SELECT,
        "formtelephoneinput": fieldTypes.TEXT,
        "formtext": fieldTypes.NON_INPUT,
        "formtextinput": fieldTypes.TEXT,
        "title": fieldTypes.NON_INPUT,
        "formimage": fieldTypes.NON_INPUT,
        "checkbox": fieldTypes.SELECT,
        "switch": fieldTypes.SELECT
    }
    const pagePath = "/content/forms/af/core-components-it/blank",
        buttonEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/button",
        buttonEditPathSelector = "[data-path='" + buttonEditPath + "']",
        buttonDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formbutton.split("/").pop(),
        checkboxEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/checkboxgroup",
        checkboxEditPathSelector = "[data-path='" + checkboxEditPath + "']",
        checkboxDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formcheckboxgroup.split("/").pop(),
        emailinputEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/emailinput",
        emailinputEditPathSelector = "[data-path='" + emailinputEditPath + "']",
        emailinputDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formemailinput.split("/").pop();

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
            case checkboxEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form CheckBox Group", afConstants.components.forms.resourceType.formcheckboxgroup);
                break;
            case emailinputEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Email Input", afConstants.components.forms.resourceType.formemailinput);
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

        var titleName = 'Adaptive Form Title',
            telephoneInputName = 'Adaptive Form Telephone Input',
            radioButtonName = 'Adaptive Form Radio Button',

            horizontalTabs = "[value='/apps/forms-components-examples/components/form/tabsontop']",
            accordion = "[value='/apps/forms-components-examples/components/form/accordion']",
            wizard = "[value='/apps/forms-components-examples/components/form/wizard']";

        dropComponent(componentEditPathSelector, containerDataPath);

        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + componentEditPathSelector);
        cy.invokeEditableAction("[data-action='replace']");

        // Check If Dialog Options Are Visible
        if (componentEditPathSelector == containerEditPathSelector) {
            cy.get(horizontalTabs)
                .should("exist");
            cy.get(accordion)
                .should("exist");
            cy.get(wizard)
                .should("exist");
            cy.get(accordion)
                .click();
            // check if default panels of accordion's template are not visible
            cy.get('[data-path="/content/forms/af/af2/jcr:content/guideContainer/accordion/item_1"]')
                .should('not.exist');
            cy.deleteComponentByPath(componentDrop);
        } else {
            var replacedComponentName, currentType, replacementComp;
            switch (componentEditPathSelector) {
                case buttonEditPathSelector:
                    currentType = fieldTypes.NON_INPUT;
                    replacementComp = "[value='" + afConstants.components.forms.resourceType.title + "']";
                    replacedComponentName = titleName;
                    break;
                case checkboxEditPathSelector:
                    currentType = fieldTypes.SELECT;
                    replacementComp = "[value='" + afConstants.components.forms.resourceType.formradiobutton + "']";
                    replacedComponentName = radioButtonName;
                    break;
                case emailinputEditPathSelector:
                    currentType = fieldTypes.TEXT;
                    replacementComp = "[value='" + afConstants.components.forms.resourceType.formtelephoneinput + "']";
                    replacedComponentName = telephoneInputName;
                    break;
            }
            for (var type in typeMap) {
                if (typeMap[type] === currentType) {
                    cy.get("[value='" + afConstants.components.forms.resourceType[type] + "']").should('exist');
                } else {
                    cy.get("[value='" + afConstants.components.forms.resourceType[type] + "']").should('not.exist');
                }
            }
            cy.get(replacementComp).click();
            cy.deleteComponentByTitle(replacedComponentName);
        }
    }

    context('Open Forms Editor', function () {
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('replace button with title', function () {
            testComponentReplaceBehaviour(buttonEditPathSelector, buttonDrop);
        })

        it.skip('replace checkbox with switch', function () {
            testComponentReplaceBehaviour(checkboxEditPathSelector, checkboxDrop);
        })

        it('replace email input with telephone input', function () {
            testComponentReplaceBehaviour(emailinputEditPathSelector, emailinputDrop);
        })

        it('replace panel container with other container', function () {
            testComponentReplaceBehaviour(containerEditPathSelector, containerDrop);
        })

        it('test behaviour of replace file input', function () {
            testReplaceForFileInput(fileInputEditPathSelector, fileInputDrop);
        })
    })

    context('Group independent replace action test', function () {
        const replaceCompPagePath = "/content/forms/af/core-components-it/samples/replace/replacewcmcomponents/basic",
            replaceCompPageUrl = replaceCompPagePath;

        const updateAllowedComponent = function (allow) {
            cy.get('[title="Adaptive Form Container [Root]"]').click()
                .then(() => {
                    cy.get('.cq-editable-action').eq(0).click().then(() => {
                        cy.get('[value="group:replace test group"]').eq(0)
                            .invoke('attr', 'checked').then(isChecked => {
                            if ((isChecked === 'checked' && !allow) || (isChecked !== 'checked' && allow)) {
                                cy.log('clicking now');
                                cy.get('[value="group:replace test group"]').eq(0).click().then(() => {
                                    cy.get('[title="Done"]').scrollIntoView().click();
                                });
                            } else {
                                cy.get('[title="Done"]').scrollIntoView().click();
                            }
                        })
                    });
                })
        }

        it('test replace of component by different group', function () {
            const testGroupCompDataPath = replaceCompPagePath+"/jcr:content/guideContainer/*",
                responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + testGroupCompDataPath + "']";

            const replaceCompEditPath = replaceCompPagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/image",
                replaceCompEditPathSelector = "[data-path='" + replaceCompEditPath + "']",
                replaceCompTestGroup = "/apps/forms-core-components-it/form/image",
                replaceCompDrop = replaceCompPagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + replaceCompTestGroup.split("/").pop();

            cy.openAuthoring("/conf/core-components-examples/settings/wcm/templates/af-blank-v2/structure");
            updateAllowedComponent(true);

            cy.openSiteAuthoring(replaceCompPageUrl);
            cy.selectLayer("Edit");
            cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Image", afConstants.components.forms.resourceType.formimage);
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + replaceCompEditPathSelector);
            cy.invokeEditableAction("[data-action='replace']");
            const replacementComp = "[value='" + replaceCompTestGroup + "']";
            cy.get(replacementComp).click();
            cy.deleteComponentByPath(replaceCompDrop);
            cy.openSiteAuthoring("/conf/core-components-examples/settings/wcm/templates/af-blank-v2/structure");
            updateAllowedComponent(false);
        });
    });
});
