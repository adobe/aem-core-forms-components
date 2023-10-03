const afConstants = require("../../../libs/commons/formsConstants");
const sitesSelectors = require("../../../libs/commons/sitesSelectors");
/*******************************************************************************
 * Copyright 2023 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
describe("View Qualified Name Tests", () => {
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

    const accordionEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/accordion",
        accordionEditPathSelector = "[data-path='" + accordionEditPath + "']",
        accordionDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/accordion";

    const wizardEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/wizard",
        wizardEditPathSelector = "[data-path='" + wizardEditPath + "']",
        wizardDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/wizard";

    const verticaltabsEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/verticaltabs",
        verticaltabsEditPathSelector = "[data-path='" + verticaltabsEditPath + "']",
        verticaltabsDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/verticaltabs";

    const tabsontopEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/tabsontop",
        tabsontopEditPathSelector = "[data-path='" + tabsontopEditPath + "']",
        tabsontopDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/tabsontop";

    const imageEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/image",
        imageEditPathSelector = "[data-path='" + imageEditPath + "']",
        imageDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formimage.split("/").pop();



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
            case accordionEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Accordion", afConstants.components.forms.resourceType.accordion);
                break;
            case wizardEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Wizard", afConstants.components.forms.resourceType.wizard);
                break;
            case verticaltabsEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Vertical Tabs", afConstants.components.forms.resourceType.verticaltabs);
                break;
            case tabsontopEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Horizontal Tabs", afConstants.components.forms.resourceType.tabsontop);
                break;
            case imageEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Image", afConstants.components.forms.resourceType.formimage);
                break;
        }
        cy.get('body').click(0, 0);
    }
    const sitesDataPath = "/content/core-components-examples/library/adaptive-form/image/jcr:content/root/responsivegrid/demo/component/guideContainer/*";
    const containerDataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*";
    const submitBtnSelector = ".cq-dialog-submit";

    const dropComponenAndSetName = function (componentEditPathSelector, name, isSites = false) {
        if(isSites) {
            dropComponent(componentEditPathSelector, sitesDataPath);
        } else {
            dropComponent(componentEditPathSelector, containerDataPath);
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + componentEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        cy.get(".cq-dialog").should("be.visible");
        cy.get("[name='./name']").click().clear().type(name);
        cy.get(submitBtnSelector).click({force: true});
    }

    const testQualifiedName = (componentEditPathSelector, componentDrop, isSites) => {
        const name = "abc"
        const qualifiedName = `$form.${name}`;
        dropComponenAndSetName(componentEditPathSelector, name, isSites);
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + componentEditPathSelector);
        cy.invokeEditableAction("[data-action='qualifiedName']");
        cy.get('#getQualifiedNameDialog').should('be.visible');
        cy.get("coral-dialog[id='getQualifiedNameDialog'] coral-dialog-content").contains(qualifiedName)

        cy.get("#getQualifiedNameDialog button[handle='closeButton']").click();
        cy.deleteComponentByPath(componentDrop);
    }

    context('Open Forms Editor', function () {
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
            cy.on('uncaught:exception', () => {
                return false
            });
        });


        it('Test Qualified name for Button', function () {
            testQualifiedName(buttonEditPathSelector, buttonDrop);
        });

        it('Test Qualified for Checkbox', function () {
            testQualifiedName(checkboxEditPathSelector, checkboxDrop);
        });

        it('Test Qualified for Email', function () {
            testQualifiedName(emailinputEditPathSelector, emailinputDrop);
        });

        it('Test Qualified for Panel', function () {
            testQualifiedName(containerEditPathSelector, containerDrop);
        });

        it('Test Qualified for Accordion', function () {
            testQualifiedName(accordionEditPathSelector, accordionDrop);
        });

        it('Test Qualified for Wizard', function () {
            testQualifiedName(wizardEditPathSelector, wizardDrop);
        });

        it('Test Qualified for Vertical tabs', function () {
            testQualifiedName(verticaltabsEditPathSelector, verticaltabsDrop);
        });

        it('Test Qualified for Tabs on top', function () {
            testQualifiedName(tabsontopEditPathSelector, tabsontopDrop);
        });

        it('Test Qualified for Image', function () {
            testQualifiedName(imageEditPathSelector, imageDrop);
        });

        it.only('Test Qualified for File Input', function () {
            testQualifiedName(fileInputEditPathSelector, fileInputDrop);
        });
    })
})
