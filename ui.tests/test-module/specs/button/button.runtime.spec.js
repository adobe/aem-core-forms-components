/*******************************************************************************
 * Copyright 2022 Adobe
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
describe("Form Runtime with Button Input", () => {

    const pagePath = "content/forms/af/core-components-it/samples/button/basic.html"
    const bemBlock = 'cmp-button'
    const IS = "adaptiveFormButton"
    const selectors = {
        buttonGroup : `[data-cmp-is="${IS}"]`
    }

    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });


    it("should toggle description and tooltip", () => {
        const fieldId = 'tooltip_scenario_test'
        cy.get(`#${fieldId}`).parent().find(`.${bemBlock}__shortdescription`).invoke('attr', 'data-cmp-visible=false')
        .should('not.exist');
        cy.get(`#${fieldId}`).parent().find(`.${bemBlock}__shortdescription`)
        .should('contain.text', 'This is short description');
        // click on ? mark
        cy.get(`#${fieldId}`).parent().find(`.${bemBlock}__questionmark`).click();
        // long description should be shown
        cy.get(`#${fieldId}`).parent().find(`.${bemBlock}__longdescription`).invoke('attr', 'data-cmp-visible')
        .should('not.exist');
        cy.get(`#${fieldId}`).parent().find(`.${bemBlock}__longdescription`)
        .should('contain.text', 'This is long description');
        // short description should be hidden.
        cy.get(`#${fieldId}`).parent().find(`.${bemBlock}__shortdescription`).invoke('attr', 'data-cmp-visible')
        .should('eq', 'false');
    })

})