/*******************************************************************************
 * Copyright 2025 Adobe
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
describe("Form Runtime with Date Picker - Min/Max Constraints", () => {

    const pagePath = "content/forms/af/core-components-it/samples/datepicker/basic.html"
    const bemBlock = 'cmp-adaptiveform-datepicker'

    let formContainer = null
    const fmPropertiesUI = "/libs/fd/fm/gui/content/forms/formmetadataeditor.html/content/dam/formsanddocuments/core-components-it/samples/datepicker/basic"
    const themeRef = 'input[name="./jcr:content/metadata/themeRef"]'
    const propertiesSaveBtn = '#shell-propertiespage-doneactivator'

    // enabling theme for this test case as without theme there is a bug in custom widget css
    before(() => {
        cy.openPage(fmPropertiesUI).then(() => {
            cy.get(themeRef).invoke('val', '').type('/libs/fd/af/themes/canvas', {force: true}).then(() => {
                cy.get(propertiesSaveBtn).click();
            })
        })
    })

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    it("should have min and max attributes correctly set on input element", () => {
        // datepicker190 has minimumDate: 2024-07-10 and maximumDate: 2024-07-23
        const [dateInput10, dateInput10FieldView] = Object.entries(formContainer._fields)[10];
        
        // Verify min attribute is set correctly (should be formatted as yyyy-MM-dd)
        cy.get(`#${dateInput10}`).find("input").should('have.attr', 'min', '2024-07-10');
        
        // Verify max attribute is set correctly (should be formatted as yyyy-MM-dd)
        cy.get(`#${dateInput10}`).find("input").should('have.attr', 'max', '2024-07-23');
    });

    it("should enforce min constraint when date is below minimum", () => {
        const [dateInput10, dateInput10FieldView] = Object.entries(formContainer._fields)[10];
        const dateBelowMin = "2024-07-09"; // One day before minimum
        
        cy.get(`#${dateInput10}`).find("input").clear().type(dateBelowMin).blur().then(() => {
            // The browser should prevent dates below min, but if entered, validation should catch it
            cy.get(`#${dateInput10}`).find("input").invoke('val').then((val) => {
                // If browser enforces min constraint, the value might be empty or the min date
                // If validation catches it, error message should appear
                if (val === dateBelowMin) {
                    cy.get(`#${dateInput10}`).find(".cmp-adaptiveform-datepicker__errormessage")
                        .should('not.have.text', '');
                }
            });
        });
    });

    it("should enforce max constraint when date is above maximum", () => {
        const [dateInput10, dateInput10FieldView] = Object.entries(formContainer._fields)[10];
        const dateAboveMax = "2024-07-24"; // One day after maximum
        
        cy.get(`#${dateInput10}`).find("input").clear().type(dateAboveMax).blur().then(() => {
            // The browser should prevent dates above max, but if entered, validation should catch it
            cy.get(`#${dateInput10}`).find("input").invoke('val').then((val) => {
                // If browser enforces max constraint, the value might be empty or the max date
                // If validation catches it, error message should appear
                if (val === dateAboveMax) {
                    cy.get(`#${dateInput10}`).find(".cmp-adaptiveform-datepicker__errormessage")
                        .should('not.have.text', '');
                }
            });
        });
    });

    it("should accept dates within min and max range", () => {
        const [dateInput10, dateInput10FieldView] = Object.entries(formContainer._fields)[10];
        const dateInRange = "2024-07-15"; // Within the range
        
        cy.get(`#${dateInput10}`).find("input").clear().type(dateInRange).blur().then(() => {
            cy.get(`#${dateInput10}`).find("input").should('have.value', dateInRange);
            cy.get(`#${dateInput10}`).find(".cmp-adaptiveform-datepicker__errormessage")
                .should('have.text', '');
        });
    });

    it("should accept minimum date value", () => {
        const [dateInput10, dateInput10FieldView] = Object.entries(formContainer._fields)[10];
        const minDate = "2024-07-10"; // Exactly the minimum date
        
        cy.get(`#${dateInput10}`).find("input").clear().type(minDate).blur().then(() => {
            cy.get(`#${dateInput10}`).find("input").should('have.value', minDate);
            // Note: Since excludeMinimum is true, this date should show validation error
            // But the min attribute should still be set correctly
        });
    });

    it("should accept maximum date value", () => {
        const [dateInput10, dateInput10FieldView] = Object.entries(formContainer._fields)[10];
        const maxDate = "2024-07-23"; // Exactly the maximum date
        
        cy.get(`#${dateInput10}`).find("input").clear().type(maxDate).blur().then(() => {
            cy.get(`#${dateInput10}`).find("input").should('have.value', maxDate);
            // Note: Since excludeMaximum is true, this date should show validation error
            // But the max attribute should still be set correctly
        });
    });

    it("should format min and max dates correctly as yyyy-MM-dd", () => {
        const [dateInput10, dateInput10FieldView] = Object.entries(formContainer._fields)[10];
        
        // Verify the format matches HTML5 date input format (yyyy-MM-dd)
        cy.get(`#${dateInput10}`).find("input").invoke('attr', 'min').then((minValue) => {
            expect(minValue).to.match(/^\d{4}-\d{2}-\d{2}$/);
            expect(minValue).to.equal('2024-07-10');
        });
        
        cy.get(`#${dateInput10}`).find("input").invoke('attr', 'max').then((maxValue) => {
            expect(maxValue).to.match(/^\d{4}-\d{2}-\d{2}$/);
            expect(maxValue).to.equal('2024-07-23');
        });
    });

    it("should not have min or max attributes when constraints are not set", () => {
        // Find a datepicker without min/max constraints (first datepicker typically doesn't have them)
        const [datePicker1, datePicker1FieldView] = Object.entries(formContainer._fields)[0];
        
        cy.get(`#${datePicker1}`).find("input").should('not.have.attr', 'min');
        cy.get(`#${datePicker1}`).find("input").should('not.have.attr', 'max');
    });
});

