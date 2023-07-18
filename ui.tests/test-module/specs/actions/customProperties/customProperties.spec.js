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

    let component;
    const componentBox = ``
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

        it.skip('End to End Custom Property Test', function () {
            const textInputEditBoxSelector = "coral-tag[value='/conf/core-components-examples/settings/wcm/templates/af-blank-v2/structure/jcr:content/guideContainer/forms-components-examples/components/form/textinput']";

            cy.openAFv2TemplateEditor();
            cy.get(textInputEditBoxSelector).find("button").click({force: true});
            cy.get('._coral-Tabs--horizontal ._coral-Tabs-item').eq(1).click({force: true});

            cy.get("input[name='./customProperties/item0/./customPropertyGroupName']").focus().clear().type("Group 1");
            cy.get("input[name='./customProperties/item0/./keyValuePairs/item0/key']").focus().clear().type("key 1");
            cy.get("input[name='./customProperties/item0/./keyValuePairs/item0/value']").focus().clear().type("value 1");
            cy.get(".cq-dialog-submit").click({force: true});

            cy.openSiteAuthoring(pagePath);

            dropTextInputInContainer();
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + textInputEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");

            cy.get("._coral-Tabs--horizontal ._coral-Tabs-item").contains("Advanced").click({force: true})
            cy.get(".cmp-adaptiveform-base-customproperties__select").click();
            cy.get("._coral-Menu-item").contains("Group 1").click();

            cy.get(".cmp-adaptiveform-base-customproperties__additionalCustomPropertiesCheck").click();
            cy.deleteComponentByPath(textInputDrop);
        });
    })
})
