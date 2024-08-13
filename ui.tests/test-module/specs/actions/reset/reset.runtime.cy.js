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
describe("Form with Reset Button", () => {

    const pagePath = "content/forms/af/core-components-it/samples/actions/reset/basic.html"
    const bemBlock = 'cmp-button'
    const IS = "adaptiveFormButton"
    const selectors = {
        reset: `[data-cmp-is="${IS}"]`
    }

    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    it("should get model and view initialized properly ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id)
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
        });
    });

    const components = ["adaptiveFormTextInput", "adaptiveFormNumberInput", "adaptiveFormDropDown", "adaptiveFormDatePicker", "adaptiveFormEmailInput", "adaptiveFormCheckBoxGroup", "adaptiveFormRadioButton", "adaptiveFormFileInput", "adaptiveFormTelephoneInput"];

    const checkIfReset = (field, coreComponent) => {
        switch (coreComponent) {
            case "adaptiveFormEmailInput":
            case "adaptiveFormTextInput":
            case "adaptiveFormTelephoneInput":
            case "adaptiveFormNumberInput":
            case "adaptiveFormDatePicker":
                cy.wrap(field).find("input").should('have.value', '', `${coreComponent} must be reset`)
                break;
            case "adaptiveFormCheckBoxGroup":
            case "adaptiveFormRadioButton":
                cy.wrap(field).find("input").should('not.be.checked', `${coreComponent} must be unchecked`);
                break;
            case "adaptiveFormDropDown":
                cy.wrap(field).find(":selected").should("not.exist", `${coreComponent} must be reset`);
                break;
            case "adaptiveFormFileInput":
                cy.wrap(field).should('not.include.text', 'empty.pdf', `${coreComponent} must be unchecked`)
                break;
            default: break;
        }
    };

    const fillField = (field, coreComponent) => {
        switch (coreComponent) {
            case "adaptiveFormEmailInput":
            case "adaptiveFormTextInput":
                cy.wrap(field).find("input").type("Sample text").blur();
                break;
            case "adaptiveFormTelephoneInput":
            case "adaptiveFormNumberInput":
                cy.wrap(field).find("input").type("3434343").blur();
                break;
            case "adaptiveFormCheckBoxGroup":
                cy.wrap(field).find("input").check("0");
                break;
            case "adaptiveFormRadioButton":
                cy.wrap(field).find("input").eq(0).click();
                break;
            case "adaptiveFormDropDown":
                cy.wrap(field).find("select").select(["Orange"]);
                break;
            case "adaptiveFormFileInput":
                cy.wrap(field).find("input").attachFile("empty.pdf");
                break;
            case "adaptiveFormDatePicker":
                cy.wrap(field).find("input").type("2022-12-23");
                break;
            default: break;
        }
    };

    it(`Check for reset functionality`,() => {
        // Fill all fields with some value
        components.forEach((coreComponent) => {
            cy.get(`[data-cmp-is="${coreComponent}"]`).then(instance => fillField(instance, coreComponent));
        });

        // Reset entire form
        cy.get(`.cmp-adaptiveform-button__widget`).click();

        // Check if values are now reset
        components.forEach((coreComponent) => {
            cy.get(`[data-cmp-is="${coreComponent}"]`).then(instance => checkIfReset(instance, coreComponent));
        });
    });
});