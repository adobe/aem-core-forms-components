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

    const getPaths = (isSites, pagePath) => {
        const obj = {};

        obj.buttonEditPath = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/button";
        obj.buttonEditPathSelector = "[data-path='" + obj.buttonEditPath + "']";
        obj.buttonDrop = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/" + afConstants.components.forms.resourceType.formbutton.split("/").pop();
        obj.checkboxEditPath = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/checkboxgroup";
        obj.checkboxEditPathSelector = "[data-path='" + obj.checkboxEditPath + "']";
        obj.checkboxDrop = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/" + afConstants.components.forms.resourceType.formcheckboxgroup.split("/").pop();
        obj.emailinputEditPath = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/emailinput";
        obj.emailinputEditPathSelector = "[data-path='" + obj.emailinputEditPath + "']";
        obj.emailinputDrop = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/" + afConstants.components.forms.resourceType.formemailinput.split("/").pop();

        obj.fileInputEditPath = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/fileinput";
        obj.fileInputEditPathSelector = "[data-path='" + obj.fileInputEditPath + "']";
        obj.fileInputDrop = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/" + afConstants.components.forms.resourceType.formfileinput.split("/").pop();

        obj.containerEditPath = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/panelcontainer";
        obj.containerEditPathSelector = "[data-path='" + obj.containerEditPath + "']";
        obj.containerDrop = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/panelcontainer";

        obj.accordionEditPath = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/accordion";
        obj.accordionEditPathSelector = "[data-path='" + obj.accordionEditPath + "']";
        obj.accordionDrop = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/accordion";

        obj.wizardEditPath = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/wizard";
        obj.wizardEditPathSelector = "[data-path='" + obj.wizardEditPath + "']";
        obj.wizardDrop = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/wizard";

        obj.verticaltabsEditPath = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/verticaltabs";
        obj.verticaltabsEditPathSelector = "[data-path='" + obj.verticaltabsEditPath + "']";
        obj.verticaltabsDrop = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/verticaltabs";

        obj.tabsontopEditPath = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/tabsontop";
        obj.tabsontopEditPathSelector = "[data-path='" + obj.tabsontopEditPath + "']";
        obj.tabsontopDrop = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/tabsontop";

        obj.imageEditPath = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/image";
        obj.imageEditPathSelector = "[data-path='" + obj.imageEditPath + "']";
        obj.imageDrop = pagePath + ((isSites) ? afConstants.RESPONSIVE_GRID_DEMO_SUFFIX : afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX) + "/" + afConstants.components.forms.resourceType.formimage.split("/").pop();
        return obj;
    }
    // const buttonEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/button";
    //     buttonEditPathSelector = "[data-path='" + buttonEditPath + "']",
    //     buttonDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formbutton.split("/").pop(),
    //     checkboxEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/checkboxgroup",
    //     checkboxEditPathSelector = "[data-path='" + checkboxEditPath + "']",
    //     checkboxDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formcheckboxgroup.split("/").pop(),
    //     emailinputEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/emailinput",
    //     emailinputEditPathSelector = "[data-path='" + emailinputEditPath + "']",
    //     emailinputDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formemailinput.split("/").pop();
    //
    // const fileInputEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/fileinput",
    //     fileInputEditPathSelector = "[data-path='" + fileInputEditPath + "']",
    //     fileInputDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formfileinput.split("/").pop();
    //
    // const containerEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/panelcontainer",
    //     containerEditPathSelector = "[data-path='" + containerEditPath + "']",
    //     containerDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/panelcontainer";
    //
    // const accordionEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/accordion",
    //     accordionEditPathSelector = "[data-path='" + accordionEditPath + "']",
    //     accordionDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/accordion";
    //
    // const wizardEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/wizard",
    //     wizardEditPathSelector = "[data-path='" + wizardEditPath + "']",
    //     wizardDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/wizard";
    //
    // const verticaltabsEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/verticaltabs",
    //     verticaltabsEditPathSelector = "[data-path='" + verticaltabsEditPath + "']",
    //     verticaltabsDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/verticaltabs";
    //
    // const tabsontopEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/tabsontop",
    //     tabsontopEditPathSelector = "[data-path='" + tabsontopEditPath + "']",
    //     tabsontopDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/tabsontop";
    //
    // const imageEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/image",
    //     imageEditPathSelector = "[data-path='" + imageEditPath + "']",
    //     imageDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formimage.split("/").pop();


    const dropComponent = function (componentEditPathSelector, dataPath, dict) {
        const responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        switch (componentEditPathSelector) {
            case dict.buttonEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Button", afConstants.components.forms.resourceType.formbutton);
                break;
            case dict.checkboxEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form CheckBox Group", afConstants.components.forms.resourceType.formcheckboxgroup);
                break;
            case dict.emailinputEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Email Input", afConstants.components.forms.resourceType.formemailinput);
                break;
            case dict.fileInputEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form File Attachment", afConstants.components.forms.resourceType.formfileinput);
                break;
            case dict.containerEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Panel", afConstants.components.forms.resourceType.panelcontainer);
                break;
            case dict.accordionEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Accordion", afConstants.components.forms.resourceType.accordion);
                break;
            case dict.wizardEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Wizard", afConstants.components.forms.resourceType.wizard);
                break;
            case dict.verticaltabsEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Vertical Tabs", afConstants.components.forms.resourceType.verticaltabs);
                break;
            case dict.tabsontopEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Horizontal Tabs", afConstants.components.forms.resourceType.tabsontop);
                break;
            case dict.imageEditPathSelector:
                cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Image", afConstants.components.forms.resourceType.formimage);
                break;
        }
        cy.get('body').click(0, 0);
    }
    const sitesDataPath = "/content/core-components-examples/library/adaptive-form/accordion/jcr:content/root/responsivegrid/demo/component/guideContainer/*";
    const containerDataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*";
    const submitBtnSelector = ".cq-dialog-submit";

    const dropComponentAndSetName = function (componentEditPathSelector, name, isSites) {
        const sitePagePath = "/content/core-components-examples/library/adaptive-form/accordion";

        let dict;
        if (isSites) {
            dict = getPaths(true, sitePagePath);
            dropComponent(componentEditPathSelector, sitesDataPath, dict);
        } else {
            dict = getPaths(false);
            dropComponent(componentEditPathSelector, containerDataPath, dict);
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
        debugger;
        dropComponentAndSetName(componentEditPathSelector, name, isSites);
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + componentEditPathSelector);
        cy.invokeEditableAction("[data-action='qualifiedName']");
        cy.get('#getQualifiedNameDialog').should('be.visible');
        cy.get("coral-dialog[id='getQualifiedNameDialog'] coral-dialog-content").contains(qualifiedName)

        cy.get("#getQualifiedNameDialog button[handle='closeButton']").click();
        cy.deleteComponentByPath(componentDrop);
    }
    const pagePath = "/content/forms/af/core-components-it/blank";

    context('Open Forms Editor', function () {
        beforeEach(function () {
            cy.openAuthoring(pagePath);
            cy.on('uncaught:exception', () => {
                return false
            });
        });
        const dict = getPaths(false, pagePath);

        it('Test Qualified name for Button', function () {
            testQualifiedName(dict.buttonEditPathSelector, dict.buttonDrop, false);
        });

        it('Test Qualified for Checkbox', function () {
            testQualifiedName(dict.checkboxEditPathSelector, dict.checkboxDrop, false);
        });

        it('Test Qualified for Email', function () {
            testQualifiedName(dict.emailinputEditPathSelector, dict.emailinputDrop, false);
        });

        it('Test Qualified for Panel', function () {
            testQualifiedName(dict.containerEditPathSelector, dict.containerDrop, false);
        });

        it('Test Qualified for Accordion', function () {
            testQualifiedName(dict.accordionEditPathSelector, dict.accordionDrop, false);
        });

        it('Test Qualified for Wizard', function () {
            testQualifiedName(dict.wizardEditPathSelector, dict.wizardDrop, false);
        });

        it('Test Qualified for Vertical tabs', function () {
            testQualifiedName(dict.verticaltabsEditPathSelector, dict.verticaltabsDrop, false);
        });

        it('Test Qualified for Tabs on top', function () {
            testQualifiedName(dict.tabsontopEditPathSelector, dict.tabsontopDrop, false);
        });

        it('Test Qualified for Image', function () {
            testQualifiedName(dict.imageEditPathSelector, dict.imageDrop, false);
        });

        it('Test Qualified for File Input', function () {
            testQualifiedName(dict.fileInputEditPathSelector, dict.fileInputDrop, false);
        });
    })

    // context('Open Sites Editor', function () {
    //     const sitePagePath = "/content/core-components-examples/library/adaptive-form/accordion";
    //
    //         beforeEach(function () {
    //         cy.openAuthoring(sitePagePath);
    //         cy.on('uncaught:exception', () => {
    //             return false
    //         });
    //     });
    //
    //     it('Test Qualified name for Button', function () {
    //         const dict = getPaths(true, sitePagePath);
    //         console.log(dict);
    //         testQualifiedName(dict.buttonEditPathSelector, dict.buttonDrop, true);
    //     });
    //
    //     it('Test Qualified for Checkbox', function () {
    //         testQualifiedName(dict.checkboxEditPathSelector, dict.checkboxDrop, true);
    //     });
    //
    //     it('Test Qualified for Email', function () {
    //         testQualifiedName(dict.emailinputEditPathSelector, dict.emailinputDrop, true);
    //     });
    //
    //     it('Test Qualified for Panel', function () {
    //         testQualifiedName(dict.containerEditPathSelector, dict.containerDrop, true);
    //     });
    //
    //     it('Test Qualified for Accordion', function () {
    //         const dict = getPaths(true, sitePagePath);
    //         console.log(dict);
    //         testQualifiedName(dict.accordionEditPathSelector, dict.accordionDrop, true);
    //     });
    //
    //     it('Test Qualified for Wizard', function () {
    //         testQualifiedName(dict.wizardEditPathSelector, dict.wizardDrop, true);
    //     });
    //
    //     it('Test Qualified for Vertical tabs', function () {
    //         testQualifiedName(dict.verticaltabsEditPathSelector, dict.verticaltabsDrop, true);
    //     });
    //
    //     it('Test Qualified for Tabs on top', function () {
    //         testQualifiedName(dict.tabsontopEditPathSelector, dict.tabsontopDrop, true);
    //     });
    //
    //     it('Test Qualified for Image', function () {
    //         testQualifiedName(dict.imageEditPathSelector, dict.imageDrop, true);
    //     });
    //
    //     it('Test Qualified for File Input', function () {
    //         testQualifiedName(dict.fileInputEditPathSelector, dict.fileInputDrop, true);
    //     });
    // })
    context('Open Sites Editor', function () {
        const pagePath = "/content/core-components-examples/library/adaptive-form/accordion",
            accordionEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/accordion",
            accordionEditPathSelector = "[data-path='" + accordionEditPath + "']";

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });
        const dropAccordionInSites = function () {
            const dataPath = "/content/core-components-examples/library/adaptive-form/accordion/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
                responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
            cy.selectLayer("Edit");
            cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Accordion", afConstants.components.forms.resourceType.accordion);
            cy.get('body').click(0, 0);
        }

        it('Test Qualified name is sites', {retries: 3}, function () {
            cy.cleanTest(accordionEditPath).then(function () {
                const name = "abc"
                const qualifiedName = `$form.${name}`;

                dropAccordionInSites();
                cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + accordionEditPathSelector);
                cy.invokeEditableAction("[data-action='CONFIGURE']");
                cy.get(".cq-dialog").should("be.visible");
                cy.get("[name='./name']").click().clear().type(name);
                cy.get(submitBtnSelector).click({force: true});

                cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + accordionEditPathSelector);
                cy.invokeEditableAction("[data-action='qualifiedName']");
                cy.get('#getQualifiedNameDialog').should('be.visible');
                cy.get("coral-dialog[id='getQualifiedNameDialog'] coral-dialog-content").contains(qualifiedName)

                cy.get("#getQualifiedNameDialog button[handle='closeButton']").click();

                cy.deleteComponentByPath(accordionEditPath);
            });
        });

    });
})
