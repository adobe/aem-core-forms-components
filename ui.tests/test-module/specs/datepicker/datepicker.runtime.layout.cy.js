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
 **************************o****************************************************/
describe("Form Runtime layout of Date Picker ", () => {

    const pagePath = "content/forms/af/core-components-it/samples/datepicker/datepickerlayoutissue.html"
    const bemBlock = 'cmp-adaptiveform-datepicker'

    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    const checkHTML = (id, state, displayValue) => {
        const visible = state.visible;
        const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
        const passDisabledAttributeCheck = `${state.enabled === false ? "" : "not."}have.attr`;
        const passReadOnlyAttributeCheck = `${state.readOnly === true ? "" : "not."}have.attr`;
        const value = state.value == null ? '' : state.value;
        cy.get(`#${id}`)
            .should(passVisibleCheck)
            .invoke('attr', 'data-cmp-visible')
            .should('eq', visible.toString());
        cy.get(`#${id}`)
            .invoke('attr', 'data-cmp-enabled')
            .should('eq', state.enabled.toString());
        return cy.get(`#${id}`).within((root) => {
            cy.get('*').should(passVisibleCheck)
            cy.get('input')
                .should(passDisabledAttributeCheck, 'disabled');
            cy.get('input').should(passReadOnlyAttributeCheck, 'readonly');
            cy.get('input').should('have.value', value)
        })
    }

    it(" should get model and view initialized properly ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id)
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
            // if non submit field, check that all have error message in them
            if (id.indexOf('submit') === -1) {
                checkHTML(id, field.getModel().getState())
            }
        });
    })

    it(" model's changes are reflected in the html ", () => {
        const [datePicker7, datePicker7FieldView] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(datePicker7)

        const date = '2023-08-10';
        cy.get(`#${datePicker7}`).find("input").clear().type(date).then(() => {
            cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "Thursday, 10 August, 2023");
        });

        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get("#li-day-3").should("be.visible").click(); // clicking on the 2nd day of the month of October 2023
            cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "Wednesday, 2 August, 2023");
            cy.get(`#${datePicker7}`).find("input").focus().should("have.value", "Wednesday, 2 August, 2023");

        });
    });

    it("Check for Feb month with 28 days starting on Sunday", () => {
        const [datePicker7, datePicker7FieldView] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(datePicker7)

        const date = '2026-02-01';
        cy.get(`#${datePicker7}`).find("input").clear().type(date);

        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
                cy.get("#li-day-2").should("be.visible").click();
                cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "Sunday, 1 February, 2026");
            });
        });

        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get("#li-day-29").should("be.visible").click();
                cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "Saturday, 28 February, 2026");
            });
        });

        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get(".dp-rightnav").should("be.visible").click();
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
            });
            cy.get(".dp-leftnav").should("be.visible").click();
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
            });


        });

    });

    it("Check for Feb month with 29 days starting on Sunday", () => {
        const [datePicker7, datePicker7FieldView] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(datePicker7)

        const date = '2032-02-01';
        cy.get(`#${datePicker7}`).find("input").clear().type(date);

        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
                cy.get("#li-day-2").should("be.visible").click();
                cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "Sunday, 1 February, 2032");
            });
        });

        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get("#li-day-30").should("be.visible").click();
                cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "Sunday, 29 February, 2032");
            });
        });
        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get(".dp-rightnav").should("be.visible").click();
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
            });
            cy.get(".dp-leftnav").should("be.visible").click();
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
            });


        });
    });


    it("Check for Feb month with 28 days starting on Saturday", () => {
        const [datePicker7, datePicker7FieldView] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(datePicker7)

        const date = '2025-02-01';
        cy.get(`#${datePicker7}`).find("input").clear().type(date);

        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
                cy.get("#li-day-2").should("be.visible").click();
                cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "Saturday, 1 February, 2025");
            });

        });

        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get("#li-day-29").should("be.visible").click();
                cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "Friday, 28 February, 2025");
            });
        });
        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get(".dp-rightnav").should("be.visible").click();
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
            });
            cy.get(".dp-leftnav").should("be.visible").click();
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
            });

        });
    });

    it("Check for Feb month with 29 days starting on Saturday", () => {
        const [datePicker7, datePicker7FieldView] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(datePicker7)

        const date = '2020-02-01';
        cy.get(`#${datePicker7}`).find("input").clear().type(date);

        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
                cy.get("#li-day-2").should("be.visible").click();
                cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "Saturday, 1 February, 2020");
            });
        });

        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get("#li-day-30").should("be.visible").click();
                cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "Saturday, 29 February, 2020");
            });
        });
        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get(".dp-rightnav").should("be.visible").click();
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
            });
            cy.get(".dp-leftnav").should("be.visible").click();
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
            });


        });
    });

    it("Check for March month with 31 days starting on Sunday", () => {
        const [datePicker7, datePicker7FieldView] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(datePicker7)

        const date = '2020-03-01';
        cy.get(`#${datePicker7}`).find("input").clear().type(date);

        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
                cy.get("#li-day-2").should("be.visible").click();
                cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "Sunday, 1 March, 2020");
            });
        });

        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get("#li-day-32").should("be.visible").click();
                cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "Tuesday, 31 March, 2020");
            });
        });
        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get(".dp-rightnav").should("be.visible").click();
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
            });
            cy.get(".dp-leftnav").should("be.visible").click();
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
            });


        });
    });

    it("Check for March month with 31 days starting on Saturday", () => {
        const [datePicker7, datePicker7FieldView] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(datePicker7)

        const date = '2025-03-01';
        cy.get(`#${datePicker7}`).find("input").clear().type(date);

        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
                cy.get("#li-day-2").should("be.visible").click();
                cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "Saturday, 1 March, 2025");
            });
        });

        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get("#li-day-32").should("be.visible").click();
                cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "Monday, 31 March, 2025");
            });
        });
        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get(".dp-rightnav").should("be.visible").click();
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
            });
            cy.get(".dp-leftnav").should("be.visible").click();
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
            });


        });
    });

    it("Check for April month with 30 days starting on Sunday", () => {
        const [datePicker7, datePicker7FieldView] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(datePicker7)

        const date = '2029-04-01';
        cy.get(`#${datePicker7}`).find("input").clear().type(date);

        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
                cy.get("#li-day-2").should("be.visible").click();
                cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "Sunday, 1 April, 2029");
            });
        });

        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get("#li-day-31").should("be.visible").click();
                cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "Monday, 30 April, 2029");
            });
        });
        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get(".dp-rightnav").should("be.visible").click();
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
            });
            cy.get(".dp-leftnav").should("be.visible").click();
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
            });


        });
    });

    it("Check for April month with 30 days starting on Satuday", () => {
        const [datePicker7, datePicker7FieldView] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(datePicker7)

        const date = '2028-04-01';
        cy.get(`#${datePicker7}`).find("input").clear().type(date);

        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
                cy.get("#li-day-2").should("be.visible").click();
                cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "Saturday, 1 April, 2028");
            });
        });

        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get("#li-day-31").should("be.visible").click();
                cy.get(`#${datePicker7}`).find("input").blur().should("have.value", "Sunday, 30 April, 2028");
            });
        });
        cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
            cy.get(".dp-rightnav").should("be.visible").click();
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
            });
            cy.get(".dp-leftnav").should("be.visible").click();
            cy.get('.datetimepicker.datePickerTarget').then(($selectedElement) => {
                cy.get('.view.dp-monthview').children().should("have.length", 7)
            });


        });
    });

})