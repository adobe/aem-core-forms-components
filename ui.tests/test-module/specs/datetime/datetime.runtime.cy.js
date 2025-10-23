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
describe("Form Runtime with Date Time", () => {

    const pagePath = "content/forms/af/core-components-it/samples/datetime/datetime.html"
    const bemBlock = 'cmp-adaptiveform-datetime'
    let toggle_array = [];

    let formContainer = null
    const fmPropertiesUI = "/libs/fd/fm/gui/content/forms/formmetadataeditor.html/content/dam/formsanddocuments/core-components-it/samples/datetime/datetime"
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

        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
    });

    const checkHTML = (id, state) => {
        const visible = state.visible;
        const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
        const passDisabledAttributeCheck = `${state.enabled === false ? "" : "not."}have.attr`;
        const passReadOnlyAttributeCheck = `${state.readOnly === true ? "" : "not."}have.attr`;
        let value = state.value == null ? '' : state.value;

        let useDisplayValue = state.displayFormat !== 'date|short';
        if (useDisplayValue && value) {
            value = state.displayValue;
        }
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
            cy.get('input').invoke('val').then(inputVal => {
                const viewDate = new Date(inputVal);
                const stateDate = new Date(value);
               if (!isNaN(viewDate) && !isNaN(stateDate)) {
                   // Default date could be in different format, we need to compare the intrinsic value of the date
                   expect(viewDate.getTime()).to.equal(stateDate.getTime());
               } else {
                   expect(inputVal).to.equal(value)
               }
            })
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
        const [id, fieldView] = Object.entries(formContainer._fields)[0]
        const model = formContainer._model.getElement(id)
        model.value = "2020-10-10T00:00"
        checkHTML(model.id, model.getState()).then(() => {
            model.visible = false
            return checkHTML(model.id, model.getState())
        }).then(() => {
            model.enabled = false
            return checkHTML(model.id, model.getState())
        })
    });

    it(" html changes are reflected in model ", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0]
        const model = formContainer._model.getElement(id)
        const input = "2020-10-10T00:00"
        cy.get(`#${id}`).find("input").clear().type(input).blur().then(x => {
            expect(model.getState().value).to.equal(input)
        })
    });


    it("should show and hide components on certain date input", () => {
        // Rule on dateTime1: When input of dateTime1 is 2022-12-23 => Show dateTime3 and Hide dateTime4

        const [dateTime1, dateTime1FieldView] = Object.entries(formContainer._fields)[0];
        const [dateTime3, dateTime3FieldView] = Object.entries(formContainer._fields)[2];
        const [dateTime4, dateTime4FieldView] = Object.entries(formContainer._fields)[3];
        const input = '2022-12-23T00:00';

        cy.get(`#${dateTime1}`).find("input").type(input).blur().then(x => {
            cy.get(`#${dateTime3}`).should('be.visible')
            cy.get(`#${dateTime4}`).should('not.be.visible')
        })
    })
    //
    it("should enable and disable components on certain date input", () => {
        // Rule on dateTime1: When input of dateTime1 is 2023-01-01 => Enable dateTime2 and Disable dateTime4

        const [dateTime1, dateTime1FieldView] = Object.entries(formContainer._fields)[0];
        const [dateTime2, dateTime2FieldView] = Object.entries(formContainer._fields)[1];
        const [dateTime4, dateTime4FieldView] = Object.entries(formContainer._fields)[3];
        const input = '2023-01-01T00:00';

        cy.get(`#${dateTime1}`).find("input").type(input).blur().then(x => {
            cy.get(`#${dateTime2}`).find("input").should('be.enabled')
            cy.get(`#${dateTime4}`).find("input").should('not.be.enabled')
        })

            // cy.get(`#${dateTime4}`).find("input").clear().type(incorrectInput).blur().then(x => {
            //     cy.get(`#${dateTime4}`).find(".cmp-adaptiveform-datetime__errormessage").should('have.text',"Please enter a valid value.")
            //     cy.get(`#${dateTime4} > div.${bemBlock}__errormessage`).should('have.attr', 'id', `${dateTime4}__errormessage`)
            //     cy.get(`#${dateTime4} > .${bemBlock}__widget`).should('have.attr', 'aria-describedby', `${dateTime4}__shortdescription ${dateTime4}__errormessage`)
            //     cy.get(`#${dateTime4} > .${bemBlock}__widget`).should('have.attr', 'aria-invalid', 'true')
            // })
    })

    it("should show validation error messages based on expression rules", () => {
        // Rule on dateTime4: Validate dateTime4 using Expression: dateTime4 === 2023-01-01

        const [dateTime4, dateTime1FieldView] = Object.entries(formContainer._fields)[4];
        const incorrectInput = "2023-01-02T00:00";
        const correctInput = "2025-07-20T00:00";

        cy.get(`#${dateTime4}`).find("input").clear().type(incorrectInput).blur().then(x => {
            cy.get(`#${dateTime4}`).find(".cmp-adaptiveform-datetime__errormessage").should('have.text', "Please enter a valid value.")
            // Scroll into view and interact with the input element
            cy.get(`#${dateTime4}`).find("input")
                .should('have.attr', 'aria-invalid', 'true')
                .should('have.attr', 'aria-describedby', 'datetime-4178eedf3e__errormessage')
                .clear()
                .type('2023-10-10T10:00')
                .blur();

            // Validate the error message container
            cy.get('#datetime-4178eedf3e__errormessage')
                .should('have.text', 'Please enter a valid value.')
                .should('have.attr', 'aria-live', 'assertive');
            cy.get(`#${dateTime4} > div.${bemBlock}__errormessage`).should('have.attr', 'id', `${dateTime4}__errormessage`)
        })

        cy.get(`#${dateTime4}`).find("input").clear().type(correctInput).blur().then(x => {
            cy.get(`#${dateTime4}`).find(".cmp-adaptiveform-datetime__errormessage").should('have.text', "")
            cy.get(`#${dateTime4}`).find("input")
                .should('have.attr', 'aria-invalid', 'false')
                .should('have.attr', 'aria-describedby', '')
                .clear()
                .type('2023-10-10T10:00')
                .blur();
        })
    })

    it("should set and clear value based on rules", () => {
        // Rule on dateTime6: When input of dateTime6 is '2023-01-12', set value of dateTime4 to '2023-01-01' and clear value of dateTime1

        const [dateTime1, dateTime1FieldView] = Object.entries(formContainer._fields)[0];
        const [dateTime4, dateTime4FieldView] = Object.entries(formContainer._fields)[3];
        const [dateTime6, dateTime6FieldView] = Object.entries(formContainer._fields)[5];

        const input = "2023-01-12T00:00";
        cy.get(`#${dateTime1}`).find("input").clear().type('2022-05-18T00:00').blur();
        cy.get(`#${dateTime6}`).find("input").clear().type(input).blur().then(x => {
            cy.get(`#${dateTime1}`).find("input").should('have.value', "")
            cy.get(`#${dateTime4}`).find("input").should('have.value', "2023-01-01T00:00")
        })
    })

    it(" should add filled/empty class at container div ", () => {
      const [id, fieldView] = Object.entries(formContainer._fields)[0]
      const model = formContainer._model.getElement(id)
      const input = "2020-10-10T00:00";
      cy.get(`#${id}`).should('have.class', 'cmp-adaptiveform-datetime--empty');
      cy.get(`#${id}`).invoke('attr', 'data-cmp-required').should('eq', 'false');
      cy.get(`#${id}`).invoke('attr', 'data-cmp-readonly').should('eq', 'false');
      cy.get(`#${id}`).find("input").clear().type(input).blur().then(x => {
          expect(model.getState().value).to.equal(input);
          cy.get(`#${id}`).should('have.class', 'cmp-adaptiveform-datetime--filled');
      });
    });

})
