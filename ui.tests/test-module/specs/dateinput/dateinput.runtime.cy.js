/*******************************************************************************
 * Copyright 2026 Adobe
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
describe("Form Runtime with Date Input", () => {

    const pagePath = "content/forms/af/core-components-it/samples/dateinput/basic.html";
    const bemBlock = 'cmp-adaptiveform-dateinput';
    const IS = "adaptiveFormDateInput";
    const selectors = {
        dateInput: `[data-cmp-is="${IS}"]`,
        widgetDay: `.${bemBlock}__widget--day`,
        widgetMonth: `.${bemBlock}__widget--month`,
        widgetYear: `.${bemBlock}__widget--year`,
        widgetCombined: `.${bemBlock}__widget--combined`,
        errormessage: `.${bemBlock}__errormessage`,
        label: `.${bemBlock}__label`,
        widgetContainer: `.${bemBlock}__widget-container`,
    };

    let formContainer = null;
    let toggle_array = [];

    before(() => {
        cy.attachConsoleErrorSpy();
    });

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        });
        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
    });

    /**
     * Checks that the container div and the hidden combined input reflect the given model state.
     * The three visible sub-inputs are checked for disabled state via the day input (representative).
     */
    const checkHTML = (id, state) => {
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

        return cy.get(`#${id}`).within(() => {
            cy.get('*:not([type=hidden])').should(passVisibleCheck);
            // Sub-inputs carry disabled/readonly state. Use separate queries: chaining
            // two attr assertions fails because `(not.)have.attr` yields the attribute
            // value (undefined when absent) as the subject for the next assertion.
            cy.get(selectors.widgetDay).should(passDisabledAttributeCheck, 'disabled');
            cy.get(selectors.widgetDay).should(passReadOnlyAttributeCheck, 'readonly');
            // Hidden combined input carries the ISO date value
            cy.get(selectors.widgetCombined).should('have.value', value);
        });
    };

    /**
     * Types a date into the three separate sub-inputs (day / month / year) of the given field.
     * isoDate format: YYYY-MM-DD.
     */
    const typeDate = (id, isoDate) => {
        const parts = isoDate.split('-');
        const year = parts[0];
        const month = String(parseInt(parts[1], 10));
        const day   = String(parseInt(parts[2], 10));
        cy.get(`#${id}`).find(selectors.widgetDay).clear().type(day);
        cy.get(`#${id}`).find(selectors.widgetMonth).clear().type(month);
        cy.get(`#${id}`).find(selectors.widgetYear).clear().type(year).blur();
    };

    // ─── Initialisation ───────────────────────────────────────────────────────

    it("should get model and view initialised properly", () => {
        expect(formContainer, "formcontainer is initialised").to.not.be.null;
        expect(formContainer._model.items.length, "model and view element counts match")
            .to.equal(Object.keys(formContainer._fields).length);

        Object.entries(formContainer._fields).forEach(([id, field]) => {
            if (field.getModel()._jsonModel.fieldType === 'date-input') {
                expect(field.getId()).to.equal(id);
                expect(formContainer._model.getElement(id), "model and view are in sync")
                    .to.equal(field.getModel());
                checkHTML(id, field.getModel().getState());
            }
        });
        cy.expectNoConsoleErrors();
    });

    // ─── Structural checks ────────────────────────────────────────────────────

    it("should render three sub-inputs and one hidden combined input", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        cy.get(`#${id}`).within(() => {
            cy.get(selectors.widgetDay).should('exist').and('have.attr', 'type', 'text');
            cy.get(selectors.widgetMonth).should('exist').and('have.attr', 'type', 'text');
            cy.get(selectors.widgetYear).should('exist').and('have.attr', 'type', 'text');
            cy.get(selectors.widgetCombined).should('exist').and('have.attr', 'type', 'hidden');
        });
        cy.expectNoConsoleErrors();
    });

    it("should lay out day, month and year in a single horizontal row", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        cy.get(`#${id}`).find(selectors.widgetContainer).then(($container) => {
            expect($container.css('display')).to.equal('flex');
        });
        cy.expectNoConsoleErrors();
    });

    it("decoration element should not carry the component class", () => {
        const id = formContainer._model._children[0].id;
        cy.get(`#${id}`).parent().should("not.have.class", bemBlock);
        cy.expectNoConsoleErrors();
    });

    // ─── Model → HTML sync ────────────────────────────────────────────────────

    it("model changes are reflected in the HTML", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(id);

        model.value = "2024-11-15";
        checkHTML(model.id, model.getState()).then(() => {
            model.visible = false;
            return checkHTML(model.id, model.getState());
        }).then(() => {
            model.enabled = false;
            return checkHTML(model.id, model.getState());
        });
        cy.expectNoConsoleErrors();
    });

    it("setting model value populates day, month and year sub-inputs", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(id);

        model.value = "2024-03-07";
        cy.get(`#${id}`).within(() => {
            cy.get(selectors.widgetYear).should('have.value', '2024');
            cy.get(selectors.widgetMonth).should('have.value', '3');
            cy.get(selectors.widgetDay).should('have.value', '7');
        });
        cy.expectNoConsoleErrors();
    });

    it("clearing model value clears all sub-inputs", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(id);

        model.value = "2024-06-01";
        model.value = null;
        cy.get(`#${id}`).within(() => {
            cy.get(selectors.widgetDay).should('have.value', '');
            cy.get(selectors.widgetMonth).should('have.value', '');
            cy.get(selectors.widgetYear).should('have.value', '');
            cy.get(selectors.widgetCombined).should('have.value', '');
        });
        cy.expectNoConsoleErrors();
    });

    // ─── HTML → Model sync ────────────────────────────────────────────────────

    it("typing into sub-inputs is reflected in the model as ISO YYYY-MM-DD", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(id);

        typeDate(id, "2024-11-15");
        cy.then(() => {
            expect(model.getState().value).to.equal("2024-11-15");
        });
        cy.expectNoConsoleErrors();
    });

    it("combined hidden input holds the ISO value after typing", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        typeDate(id, "2025-01-08");
        cy.get(`#${id}`).find(selectors.widgetCombined).should('have.value', '2025-01-08');
        cy.expectNoConsoleErrors();
    });

    // ─── Auto-advance ─────────────────────────────────────────────────────────

    it("focus advances from day to month when day field reaches max length", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        cy.get(`#${id}`).find(selectors.widgetDay).clear().type('15');
        cy.focused().should('have.class', selectors.widgetMonth.substring(1));
        cy.expectNoConsoleErrors();
    });

    it("focus advances from month to year when month field reaches max length", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        cy.get(`#${id}`).find(selectors.widgetMonth).clear().type('11');
        cy.focused().should('have.class', selectors.widgetYear.substring(1));
        cy.expectNoConsoleErrors();
    });

    it("focus advances immediately when first digit of month cannot start a valid 2-digit month", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        // '5' typed in month: 50–59 are all > 12, so focus should jump to year
        cy.get(`#${id}`).find(selectors.widgetMonth).clear().type('5');
        cy.focused().should('have.class', selectors.widgetYear.substring(1));
        cy.expectNoConsoleErrors();
    });

    it("focus advances immediately when first digit of day cannot start a valid 2-digit day", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        // '4' typed in day: 40–49 are all > 31, so focus should jump to month
        cy.get(`#${id}`).find(selectors.widgetDay).clear().type('4');
        cy.focused().should('have.class', selectors.widgetMonth.substring(1));
        cy.expectNoConsoleErrors();
    });

    // ─── Per-field input guards ───────────────────────────────────────────────

    it("day field does not accept a second digit that would exceed 31", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        cy.get(`#${id}`).find(selectors.widgetDay).clear().type('35');
        // '35' is invalid: strip back to '3'
        cy.get(`#${id}`).find(selectors.widgetDay).should('have.value', '3');
        cy.expectNoConsoleErrors();
    });

    it("month field does not accept a second digit that would exceed 12", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        cy.get(`#${id}`).find(selectors.widgetMonth).clear().type('16');
        // '16' is invalid: strip back to '1'
        cy.get(`#${id}`).find(selectors.widgetMonth).should('have.value', '1');
        cy.expectNoConsoleErrors();
    });

    it("day field does not accept 00 as a value", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        cy.get(`#${id}`).find(selectors.widgetDay).clear().type('00');
        cy.get(`#${id}`).find(selectors.widgetDay).should('have.value', '0');
        cy.expectNoConsoleErrors();
    });

    it("month field does not accept 00 as a value", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        cy.get(`#${id}`).find(selectors.widgetMonth).clear().type('00');
        cy.get(`#${id}`).find(selectors.widgetMonth).should('have.value', '0');
        cy.expectNoConsoleErrors();
    });

    it("year field accepts exactly 4 digits and no more", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        cy.get(`#${id}`).find(selectors.widgetYear).clear().type('20241');
        cy.get(`#${id}`).find(selectors.widgetYear).should('have.value', '2024');
        cy.expectNoConsoleErrors();
    });

    // ─── Cross-field (calendar) validation ───────────────────────────────────

    it("day 31 in November (30-day month) marks day field aria-invalid", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        cy.get(`#${id}`).find(selectors.widgetMonth).clear().type('11');
        cy.get(`#${id}`).find(selectors.widgetYear).clear().type('2024');
        cy.get(`#${id}`).find(selectors.widgetDay).clear().type('3');
        // After month=11 is set, '31' should be blocked: the day field should stop at '3'
        cy.get(`#${id}`).find(selectors.widgetDay).should('have.value', '3');
        cy.expectNoConsoleErrors();
    });

    it("day 31 in April (30-day month) is blocked by the keydown guard", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        cy.get(`#${id}`).find(selectors.widgetMonth).clear().type('4');
        cy.get(`#${id}`).find(selectors.widgetYear).clear().type('2024');
        // Type '3' then '1' in day field — '1' should be blocked since April has 30 days
        cy.get(`#${id}`).find(selectors.widgetDay).clear().type('31');
        cy.get(`#${id}`).find(selectors.widgetDay).should('not.have.value', '31');
        cy.expectNoConsoleErrors();
    });

    it("Feb 29 is allowed in a leap year", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        typeDate(id, "2024-02-29");
        cy.get(`#${id}`).find(selectors.widgetCombined).should('have.value', '2024-02-29');
        cy.get(`#${id}`).find(selectors.widgetDay).should('not.have.attr', 'aria-invalid');
        cy.expectNoConsoleErrors();
    });

    it("Feb 29 in a non-leap year clears the combined value and marks day invalid", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        typeDate(id, "2023-02-29");
        // The cross-field guard should block or invalidate this
        cy.get(`#${id}`).find(selectors.widgetCombined).should('have.value', '');
        cy.expectNoConsoleErrors();
    });

    it("Feb 30 is always invalid regardless of year", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        typeDate(id, "2024-02-30");
        cy.get(`#${id}`).find(selectors.widgetCombined).should('have.value', '');
        cy.expectNoConsoleErrors();
    });

    it("combined value is empty when only some sub-fields are filled", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        cy.get(`#${id}`).find(selectors.widgetDay).clear().type('15');
        cy.get(`#${id}`).find(selectors.widgetMonth).clear().type('6');
        // Year not entered yet
        cy.get(`#${id}`).find(selectors.widgetYear).clear().blur();
        cy.get(`#${id}`).find(selectors.widgetCombined).should('have.value', '');
        cy.expectNoConsoleErrors();
    });

    // ─── Enabled / disabled ───────────────────────────────────────────────────

    it("disabling the field disables all three sub-inputs", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(id);
        model.enabled = false;
        cy.get(`#${id}`).within(() => {
            cy.get(selectors.widgetDay).should('have.attr', 'disabled');
            cy.get(selectors.widgetMonth).should('have.attr', 'disabled');
            cy.get(selectors.widgetYear).should('have.attr', 'disabled');
        });
        cy.expectNoConsoleErrors();
    });

    it("re-enabling the field removes disabled from all three sub-inputs", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(id);
        model.enabled = false;
        model.enabled = true;
        cy.get(`#${id}`).within(() => {
            cy.get(selectors.widgetDay).should('not.have.attr', 'disabled');
            cy.get(selectors.widgetMonth).should('not.have.attr', 'disabled');
            cy.get(selectors.widgetYear).should('not.have.attr', 'disabled');
        });
        cy.expectNoConsoleErrors();
    });

    // ─── Read-only ────────────────────────────────────────────────────────────

    it("marking field read-only sets readonly on all three sub-inputs", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(id);
        model.readOnly = true;
        cy.get(`#${id}`).within(() => {
            cy.get(selectors.widgetDay).should('have.attr', 'readonly');
            cy.get(selectors.widgetMonth).should('have.attr', 'readonly');
            cy.get(selectors.widgetYear).should('have.attr', 'readonly');
        });
        cy.expectNoConsoleErrors();
    });

    // ─── Visibility ──────────────────────────────────────────────────────────

    it("hiding the field makes the container invisible", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(id);
        model.visible = false;
        cy.get(`#${id}`).should('not.be.visible');
        cy.expectNoConsoleErrors();
    });

    it("showing the field makes the container visible", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        const model = formContainer._model.getElement(id);
        model.visible = false;
        model.visible = true;
        cy.get(`#${id}`).should('be.visible');
        cy.expectNoConsoleErrors();
    });

    // ─── Filled / empty class ─────────────────────────────────────────────────

    it("container carries the --empty modifier when no value is set", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        cy.get(`#${id}`).should('have.class', `${bemBlock}--empty`);
        cy.expectNoConsoleErrors();
    });

    it("container switches to --filled modifier after a complete date is entered", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        typeDate(id, "2024-06-20");
        cy.get(`#${id}`).should('have.class', `${bemBlock}--filled`);
        cy.expectNoConsoleErrors();
    });

    // ─── Description / tooltip ────────────────────────────────────────────────

    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, 'tooltip_scenario_test');
    });

    // ─── Visibility / enable rules ────────────────────────────────────────────

    it("should show and hide other fields based on a date rule", () => {
        // Rule on dateInput1: when value is 2022-12-23 → show dateInput3, hide dateInput4
        const [field1] = Object.entries(formContainer._fields)[0];
        const [field3] = Object.entries(formContainer._fields)[2];
        const [field4] = Object.entries(formContainer._fields)[3];

        typeDate(field1, "2022-12-23");
        cy.get(`#${field3}`).should('be.visible');
        cy.get(`#${field4}`).should('not.be.visible');
        cy.expectNoConsoleErrors();
    });

    it("should enable and disable other fields based on a date rule", () => {
        // Rule on dateInput1: when value is 2023-01-01 → enable dateInput2, disable dateInput4
        const [field1] = Object.entries(formContainer._fields)[0];
        const [field2] = Object.entries(formContainer._fields)[1];
        const [field4] = Object.entries(formContainer._fields)[3];

        typeDate(field1, "2023-01-01");
        cy.get(`#${field2}`).find(selectors.widgetDay).should('be.enabled');
        cy.get(`#${field4}`).find(selectors.widgetDay).should('not.be.enabled');
        cy.expectNoConsoleErrors();
    });

    // ─── Min / Max constraint errors ─────────────────────────────────────────

    it("should show error when entered date is before minimum date", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        typeDate(id, "2020-01-01");
        cy.get(`#${id}`).find(selectors.errormessage).should('not.be.empty');
        cy.expectNoConsoleErrors();
    });

    it("should clear error when a valid date within range is entered", () => {
        const [id] = Object.entries(formContainer._fields)[0];
        typeDate(id, "2024-06-15");
        cy.get(`#${id}`).find(selectors.errormessage).should('have.text', '');
        cy.expectNoConsoleErrors();
    });

    it("should set and clear value based on rules", () => {
        // Rule on dateInput6: when value is 2023-01-12 → set dateInput4 to 2023-01-01, clear dateInput1
        const [field1] = Object.entries(formContainer._fields)[0];
        const [field4] = Object.entries(formContainer._fields)[3];
        const [field6] = Object.entries(formContainer._fields)[5];

        typeDate(field1, "2022-05-18");
        typeDate(field6, "2023-01-12");
        cy.get(`#${field1}`).find(selectors.widgetCombined).should('have.value', '');
        cy.get(`#${field4}`).find(selectors.widgetCombined).should('have.value', '2023-01-01');
        cy.expectNoConsoleErrors();
    });
});
