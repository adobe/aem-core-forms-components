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
describe("Form Runtime with screen reader text", () => {

    const pagePath = "content/forms/af/core-components-it/samples/accessibility/screenreadertext.html";
    let formContainer = null;

    /**
    * initialization of form container before every test
    * */
    beforeEach(() => {
    cy.previewForm(pagePath).then(p => {
        formContainer = p;
        });
    });

    it("Aria label should be present for screen reader text in date picker component", () => {
        const [datePicker1, datePicker1FieldView] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(datePicker1);
        cy.get(`#${datePicker1}`).find("input").focus().blur().then(x => {
            cy.get(`#${datePicker1}`).find(".cmp-adaptiveform-datepicker__widget").should('have.attr','aria-label', model.getState().screenReaderText);
        });
    });

    it("Aria label should be present for screen reader text in text input component", () => {
        const [textbox1, textbox1FieldView] = Object.entries(formContainer._fields)[2];
        cy.get(`#${textbox1}`).find("input").focus().blur().then(x => {
            cy.get(`#${textbox1}`).find(".cmp-adaptiveform-textinput__widget").should('have.attr','aria-label', 'Long Text Box\n');
        });
    });

    it("Aria label should be present for screen reader text in email input component", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[3];
        const model = formContainer._model.getElement(id);
        cy.get(`#${id}`).find("input").focus().blur().then(x => {
            cy.get(`#${id}`).find(".cmp-adaptiveform-emailinput__widget").should('have.attr','aria-label', model.getState().screenReaderText);
        });
    });

    it("Aria label should be present for screen reader text in radio-button component", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[5];
        const model = formContainer._model.getElement(id);
        cy.get(`#${id}`).find(".cmp-adaptiveform-radiobutton__widget").should('have.attr','aria-label', model.getState().screenReaderText);
    });

    it("Aria label should be present for screen reader text in checkbox group component", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[6];
        const model = formContainer._model.getElement(id);
        cy.get(`#${id}`).find(".cmp-adaptiveform-checkboxgroup__widget").should('have.attr','aria-label', model.getState().screenReaderText);
    });

    it("Aria label should be present for screen reader text in dropdown component", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[7];
        const model = formContainer._model.getElement(id);
        cy.get(`#${id}`).find(".cmp-adaptiveform-dropdown__widget").should('have.attr','aria-label', model.getState().screenReaderText);
    });

    it("Aria label should be present for screen reader text in tabs on top component", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[8];
        const model = formContainer._model.getElement(id);
        cy.get(`#${id} > .cmp-tabs__tablist`).should('have.attr','aria-label', model.getState().screenReaderText);
    });

    it("Aria label should be present for screen reader text in wizard component", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[9];
        const model = formContainer._model.getElement(id);
        cy.get(`#${id} > .cmp-adaptiveform-wizard__widget`).should('have.attr','aria-label', model.getState().screenReaderText);
    });

    it("Aria label should be present for screen reader text in checkbox component", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[10];
        const model = formContainer._model.getElement(id);
        cy.get(`#${id}`).find(".cmp-adaptiveform-checkbox__widget").should('have.attr','aria-label', model.getState().screenReaderText);
    });

});