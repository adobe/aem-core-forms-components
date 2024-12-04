/*******************************************************************************
 * Copyright 2024 Adobe
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
describe("wizard with static text", () => {

    const pagePath = "content/forms/af/core-components-it/samples/wizard/setfocus.html";
    let formContainer = null

    // enabling theme for this test case as without theme there is a bug in custom widget css
    before(() => {
        const fmPropertiesUI = "/libs/fd/fm/gui/content/forms/formmetadataeditor.html/content/dam/formsanddocuments/core-components-it/samples/wizard/setfocus"
        const themeRef = 'input[name="./jcr:content/metadata/themeClientLibRef"]'
        const propertiesSaveBtn = '#shell-propertiespage-doneactivator'
        cy.openPage(fmPropertiesUI).then(() => {
            cy.get(themeRef).should('be.visible').clear().type('/libs/fd/af/themes/canvas').then(() => {
                cy.get(propertiesSaveBtn).click();
            })
        })
    })

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    it("should focus in the panel if text is first item", () => {
        const textComponentId = formContainer._model.items[0].items[1].items[0].id ;
        const buttonId = formContainer._model.items[1].id ;
        // todo: need to click twice, since today we don't focus on any item on load of the form
        // todo: this needs to be still implemented in the form
        cy.get(`#${buttonId} button`).click({force: true});
        cy.get(`#${buttonId} button`).click({force: true});
        cy.get(`#${textComponentId}`).should('be.visible');
    })


})