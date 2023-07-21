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
describe("Custom Properties Tests", () => {

    const dropTextInputInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Text Box", afConstants.components.forms.resourceType.formtextinput);
        cy.get('body').click(0, 0);
    };

    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            textInputEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/textinput",
            textInputEditPathSelector = "[data-path='" + textInputEditPath + "']",
            textInputDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.formtextinput.split("/").pop();

        it('End to End Custom Property Test', function () {
            const textInputEditBoxSelector = "coral-tag[value='/conf/core-components-examples/settings/wcm/templates/af-blank-v2/structure/jcr:content/guideContainer/forms-components-examples/components/form/textinput']";
            const tabSelector = '._coral-Tabs--horizontal ._coral-Tabs-item';
            const submitBtnSelector = ".cq-dialog-submit";
            const AFv2FormTemplatePath = "/conf/core-components-examples/settings/wcm/templates/af-blank-v2/structure.html";
            // Exceptions coming from coral and template policy
            cy.on('uncaught:exception', () => {
                return false
            });
            // open template policy
            cy.openAFv2TemplateEditor();
            cy.get(textInputEditBoxSelector).find("button").click({force: true});
            cy.get('.cq-dialog').should('be.visible');
            cy.get(tabSelector).eq(1).click({force: true});
            // Fill custom properties in policy
            cy.get(".cmp-adaptiveform-base-customproperties__multifield").contains("Add").click();
            cy.get(".cmp-adaptiveform-base-customproperties__multifield").contains("Add").click();
            cy.get("input[name='./customProperties/item0/./customPropertyGroupName']").focus().clear().type("Group 1");
            cy.get("input[name='./customProperties/item0/./keyValuePairs/item0/key']").focus().clear().type("key 1");
            cy.get("input[name='./customProperties/item0/./keyValuePairs/item0/value']").focus().clear().type("value 1");
            cy.get(submitBtnSelector).click({force: true});

            // Open form
            cy.openSiteAuthoring(pagePath);
            dropTextInputInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + textInputEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");
            cy.get(".cq-dialog").should("be.visible");

            // Advanced Tab in dialog
            cy.get(tabSelector).contains("Advanced").click({force: true});
            cy.get(".cmp-adaptiveform-base-customproperties__select").click();
            cy.get("._coral-Menu-item").contains("Group 1").click();
            cy.get(".cmp-adaptiveform-base-customproperties__additionalCustomPropertiesCheck").click();
            cy.get(".cmp-adaptiveform-base-customproperties__additionalMultifield").contains("Add").click();
            cy.get(".cmp-adaptiveform-base-customproperties__additionalKeys").focus().type("addonKey1");
            cy.get(".cmp-adaptiveform-base-customproperties__additionalValues").focus().type("addonValue1");
            cy.get(submitBtnSelector).click({force: true});

            // check model json
            cy.getFormJson(pagePath).then((body) => {
                expect(body).not.to.be.undefined;
                const properties = body[":items"]["guideContainer"][":items"].textinput.properties;
                expect(properties['key 1']).not.to.be.undefined
                expect(properties['key 1']).to.equal("value 1")

                expect(properties['addonKey1']).not.to.be.undefined
                expect(properties['addonKey1']).to.equal("addonValue1")
            });

            cy.deleteComponentByPath(textInputDrop);


            // delete custom properties in template

            cy.openTemplateEditor(AFv2FormTemplatePath);
            cy.get(textInputEditBoxSelector).find("button").click({force: true});
            cy.get('.cq-dialog').should('be.visible');
            cy.get(tabSelector).eq(1).click({force: true});
            cy.get(".cmp-adaptiveform-base-customproperties__multifield ._coral-Multifield-remove").eq(1).click().then(() => {
                cy.get('._coral-Dialog').should('be.visible');
                cy.get("._coral-Button--warning").contains("Delete").click({force:true});
                cy.get(submitBtnSelector).click({force: true});
            })
        });
    })
})
