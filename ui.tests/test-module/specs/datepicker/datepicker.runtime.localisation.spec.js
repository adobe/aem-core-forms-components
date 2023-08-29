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
describe("Form Runtime with Date Picker", () => {

    const pagePath = "content/forms/af/core-components-it/samples/datepicker/basic.html"
    const bemBlock = 'cmp-adaptiveform-datepicker'

    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath, {"params" : ["afAcceptLang=fr"]}).then(p => {
            formContainer = p;
        })
    });

    it("Formatters test on Custom DatePicker widget", () => {

        const [datePicker5, datePicker5FieldView] = Object.entries(formContainer._fields)[4];
        const incorrectInput = "01-01-2023";
        const correctInput = "2023-01-01";

        cy.get(`#${datePicker5}`).find("input").should('have.attr',"type", "text");
        cy.get(`#${datePicker5}`).find("input").clear().type(incorrectInput).blur().then(x => {
            cy.get(`#${datePicker5}`).find(".cmp-adaptiveform-datepicker__errormessage").should('have.text',"Specify the value in allowed format : date.")
        })

        cy.get(`#${datePicker5}`).find("input").clear().type(correctInput).blur().then(x => {
            cy.get(`#${datePicker5}`).find(".cmp-adaptiveform-datepicker__errormessage").should('have.text',"")
            cy.get(`#${datePicker5}`).find("input").should("have.value", "janvier 1, 2023")
            const model = formContainer._model.getElement(datePicker5)
            expect(model.getState().value).to.equal(correctInput)
        })
        cy.get(`#${datePicker5}`).find("input").focus().then(x => {
            cy.get(`#${datePicker5}`).find("input").should("have.value", "dimanche, janvier 1, 2023")
        })
    })

    it("Test changing dates in datePicker with edit/display patterns", () => {
        const [datePicker7, datePicker7FieldView] = Object.entries(formContainer._fields)[6];

        const date = '2023-08-10';
        cy.get(`#${datePicker7}`).find("input").clear().type(date).then(() => {
            cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "jeudi, 10 août, 2023");
            cy.get(`#${datePicker7}`).find("input").focus().should("have.value","10/08/2023");
        });

        // choose a different date and check if its persisted
        cy.get(`#${datePicker7}`).find(".datepicker-calendar-icon").should("be.visible").click().then(() => {
            cy.get("#li-day-3").should("be.visible").click(); // clicking on the 2nd day of the month of October 2023
            cy.get(`#${datePicker7}`).find("input").blur().should("have.value","mercredi, 2 août, 2023");
            cy.get(`#${datePicker7}`).find("input").focus().should("have.value","02/08/2023");

        });
    });

    it("Test order of the days", () => {
        const [datePicker7, datePicker7FieldView] = Object.entries(formContainer._fields)[6];
        cy.get(`#${datePicker7}`).find(".datepicker-calendar-icon").should("be.visible").click().then(() => {
            cy.get(".header").invoke("text").should("eq", 'dim.lun.mar.mer.jeu.ven.sam.');
        });
    });

    it("Test localisation for date picker", () => {
            const [datePicker7, datePicker7FieldView] = Object.entries(formContainer._fields)[6];
            cy.get(`#${datePicker7}`).find(".datepicker-calendar-icon").should("be.visible").click().then(() => {
                cy.get(".header").invoke("text").should("eq", 'dim.lun.mar.mer.jeu.ven.sam.');
                cy.get(".dp-clear").invoke("text").should("eq", 'Effacer');
            });
        });

})