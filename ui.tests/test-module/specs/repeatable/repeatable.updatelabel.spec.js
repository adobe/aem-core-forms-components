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
describe( "Form Runtime with Panel Container", () => {

    const pagePath = "content/forms/af/core-components-it/samples/panelcontainer/repeatability-tests/repeatedpanelcount.html";
    let formContainer = null;

    beforeEach(() => {
        cy.previewFormWithPanel(pagePath).then(p => {
            formContainer = p;
        });
    });

    it(" add instance should add instance at correct index and label should be correctly updated ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        const [id, fieldView] = Object.entries(formContainer._fields)[2];
        const labelSelector = ".cmp-adaptiveform-panelcontainer__label";
        // click the button with navigate
        cy.get(`#${id}`).find("button").click().then(x => {
            const [id, fieldView] = Object.entries(formContainer._fields)[2]
            // check if instance is added and label is set correctly
            cy.get(`#${id} ${labelSelector}`)
                .should('have.text', 'text input 1');
        });
    })

})