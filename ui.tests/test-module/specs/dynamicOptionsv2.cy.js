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

describe("Dynamic Options v2: Enum and EnumNames for CheckboxGroup v2 and RadioButton v2", () => {

    const pagePath = "content/forms/af/core-components-it/samples/dynamicenumenumnames/dynamicoptionsv2.html"
    const selectors = {
        checkboxgroupItem : '.cmp-adaptiveform-checkboxgroup-item',
        checkboxgroupOptionLabel : '.cmp-adaptiveform-checkboxgroup__option-label',
        radiobuttonOption : '.cmp-adaptiveform-radiobutton__option',
        radiobuttonOptionLabel : '.cmp-adaptiveform-radiobutton__option-label',
        dropdownOptionLabel : '.cmp-adaptiveform-dropdown__option',
        checkboxgroupWidget : '.cmp-adaptiveform-checkboxgroup__option__widget',
        radiobuttonWidget : '.cmp-adaptiveform-radiobutton__option__widget',
        radiobuttonGroupWidget : '.cmp-adaptiveform-radiobutton__widget',
        dropdownWidget : '.cmp-adaptiveform-dropdown__widget',
    }

    let formContainer = null
    let componentIds = {}

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
            // Create name-to-ID mapping from form container model children
            componentIds = {};
            formContainer._model._children.forEach(child => {
                if (child.name) {
                    componentIds[child.name] = child.id;
                }
            });
        })
    });

    it("should get model and view initialized properly for all components", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id)
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
        });
    })

    it("should render dynamic options for checkboxgroup v2 components", () => {
        // Test changeOptions checkboxgroup - should have 4 options (a, b, c, d)
        const changeOptionsId = componentIds['changeOptions'];
        cy.get(`#${changeOptionsId}`).find(selectors.checkboxgroupItem).should('have.length', 4);
        cy.get(`#${changeOptionsId}`).find(selectors.checkboxgroupOptionLabel).contains('a');
        cy.get(`#${changeOptionsId}`).find(selectors.checkboxgroupOptionLabel).contains('b');
        cy.get(`#${changeOptionsId}`).find(selectors.checkboxgroupOptionLabel).contains('c');
        cy.get(`#${changeOptionsId}`).find(selectors.checkboxgroupOptionLabel).contains('d');

        // Test addOptions checkboxgroup - should have 4 options (a, b, c, d) and be readonly
        const addOptionsId = componentIds['addOptions'];
        cy.get(`#${addOptionsId}`).find(selectors.checkboxgroupItem).should('have.length', 4);
        cy.get(`#${addOptionsId}`).find(selectors.checkboxgroupWidget).should('be.disabled');
        cy.get(`#${addOptionsId}`).invoke('attr', 'data-cmp-readonly').should('eq', 'true');
        cy.get(`#${addOptionsId}`).find(selectors.checkboxgroupOptionLabel).contains('a');
        cy.get(`#${addOptionsId}`).find(selectors.checkboxgroupOptionLabel).contains('b');
        cy.get(`#${addOptionsId}`).find(selectors.checkboxgroupOptionLabel).contains('c');
        cy.get(`#${addOptionsId}`).find(selectors.checkboxgroupOptionLabel).contains('d');
    })

    it("should render dynamic options for dropdown components", () => {
        // Test dynamicDropDown - should have 4 options (a, b, c, d) and be multi-select
        const dynamicDropDownId = componentIds['dynamicDropDown'];
        cy.get(`#${dynamicDropDownId}`).find(selectors.dropdownOptionLabel).should('have.length', 4);
        cy.get(`#${dynamicDropDownId}`).find(selectors.dropdownWidget).should('have.attr', 'multiple');
        cy.get(`#${dynamicDropDownId}`).find(selectors.dropdownOptionLabel).contains('a');
        cy.get(`#${dynamicDropDownId}`).find(selectors.dropdownOptionLabel).contains('b');
        cy.get(`#${dynamicDropDownId}`).find(selectors.dropdownOptionLabel).contains('c');
        cy.get(`#${dynamicDropDownId}`).find(selectors.dropdownOptionLabel).contains('d');

        // Test newdropdown - should be disabled and readonly
        const newDropDownId = componentIds['newdropdown'];
        cy.get(`#${newDropDownId}`).find(selectors.dropdownWidget).should('be.disabled');
        cy.get(`#${newDropDownId}`).invoke('attr', 'data-cmp-readonly').should('eq', 'true');
        
        // Test newdropdown options
        cy.get(`#${newDropDownId}`).find(selectors.dropdownOptionLabel).should('have.length', 4);
        cy.get(`#${newDropDownId}`).find("option[value='a']").should('exist');
        cy.get(`#${newDropDownId}`).find("option[value='b']").should('exist');
        cy.get(`#${newDropDownId}`).find("option[value='c']").should('exist');
        cy.get(`#${newDropDownId}`).find("option[value='d']").should('exist');
    })

    it("should render dynamic options for radiobutton v2 components", () => {
        // Test dynamicRadio - should have 4 options (a, b, c, d)
        const dynamicRadioId = componentIds['dynamicRadio'];
        cy.get(`#${dynamicRadioId}`).find(selectors.radiobuttonOption).should('have.length', 4);
        cy.get(`#${dynamicRadioId}`).find(selectors.radiobuttonOptionLabel).contains('a');
        cy.get(`#${dynamicRadioId}`).find(selectors.radiobuttonOptionLabel).contains('b');
        cy.get(`#${dynamicRadioId}`).find(selectors.radiobuttonOptionLabel).contains('c');
        cy.get(`#${dynamicRadioId}`).find(selectors.radiobuttonOptionLabel).contains('d');

        // Test newradio - should be disabled
        const newRadioId = componentIds['newradio'];
        cy.get(`#${newRadioId}`).find(selectors.radiobuttonWidget).should('be.disabled');
        cy.get(`#${newRadioId}`).invoke('attr', 'data-cmp-enabled').should('eq', 'false');
        cy.get(`#${newRadioId}`).find(selectors.radiobuttonOptionLabel).contains('a');
        cy.get(`#${newRadioId}`).find(selectors.radiobuttonOptionLabel).contains('b');
        cy.get(`#${newRadioId}`).find(selectors.radiobuttonOptionLabel).contains('c');
        cy.get(`#${newRadioId}`).find(selectors.radiobuttonOptionLabel).contains('d');

        // Test extraRadio - should have 2 options with different labels (Alpha, Beta)
        const extraRadioId = componentIds['extraRadio'];
        cy.get(`#${extraRadioId}`).find(selectors.radiobuttonOption).should('have.length', 2);
        cy.get(`#${extraRadioId}`).find(selectors.radiobuttonOptionLabel).contains('Alpha');
        cy.get(`#${extraRadioId}`).find(selectors.radiobuttonOptionLabel).contains('Beta');
    })

    it("should handle model changes and reflect in HTML for checkboxgroup v2", () => {
        const changeOptionsId = componentIds['changeOptions'];
        const model = formContainer._model.getElement(changeOptionsId);
        
        // Test selecting options
        cy.get(`#${changeOptionsId}`).find(`${selectors.checkboxgroupWidget}[value='a']`).check().then(() => {
            expect(model.getState().value).to.contain('a');
        });
        
        cy.get(`#${changeOptionsId}`).find(`${selectors.checkboxgroupWidget}[value='c']`).check().then(() => {
            expect(model.getState().value).to.contain('c');
        });

        // Test unchecking options
        cy.get(`#${changeOptionsId}`).find(`${selectors.checkboxgroupWidget}[value='a']`).uncheck().then(() => {
            expect(model.getState().value).to.not.contain('a');
        });
    })

    it("should handle model changes and reflect in HTML for dropdown", () => {
        const dynamicDropDownId = componentIds['dynamicDropDown'];
        const model = formContainer._model.getElement(dynamicDropDownId);
        
        // Test selecting options in multi-select dropdown
        cy.get(`#${dynamicDropDownId}`).find(selectors.dropdownWidget).select(["a", "c"]).then(() => {
            expect(model.value).to.deep.equal(['a', 'c']);
        });
    })

    it("should handle model changes and reflect in HTML for radiobutton v2", () => {
        const dynamicRadioId = componentIds['dynamicRadio'];
        const model = formContainer._model.getElement(dynamicRadioId);
        
        // Test selecting radio button
        cy.get(`#${dynamicRadioId}`).find(`${selectors.radiobuttonWidget}[value='b']`).check().then(() => {
            expect(model.getState().value).to.equal('b');
        });
        
        cy.get(`#${dynamicRadioId}`).find(`${selectors.radiobuttonWidget}[value='d']`).check().then(() => {
            expect(model.getState().value).to.equal('d');
        });
    })

    it("should not have aria-disabled attribute when disabled", () => {
        const addOptionsId = componentIds['addOptions'];
        const newDropDownId = componentIds['newdropdown'];
        const newRadioId = componentIds['newradio'];

        cy.get(`#${addOptionsId}`).find(".cmp-adaptiveform-checkboxgroup__widget").should('not.have.attr', 'aria-disabled');
        cy.get(`#${newDropDownId}`).find(selectors.dropdownWidget).should('not.have.attr', 'aria-disabled');
        cy.get(`#${newRadioId}`).find(selectors.radiobuttonWidget).should('not.have.attr', 'aria-disabled');
    })

    it("should maintain proper data attributes for all components", () => {
        const changeOptionsId = componentIds['changeOptions'];
        const dynamicDropDownId = componentIds['dynamicDropDown'];
        const dynamicRadioId = componentIds['dynamicRadio'];

        // Test data-cmp-visible attribute
        cy.get(`#${changeOptionsId}`).invoke('attr', 'data-cmp-visible').should('eq', 'true');
        cy.get(`#${dynamicDropDownId}`).invoke('attr', 'data-cmp-visible').should('eq', 'true');
        cy.get(`#${dynamicRadioId}`).invoke('attr', 'data-cmp-visible').should('eq', 'true');

        // Test data-cmp-enabled attribute
        cy.get(`#${changeOptionsId}`).invoke('attr', 'data-cmp-enabled').should('eq', 'true');
        cy.get(`#${dynamicDropDownId}`).invoke('attr', 'data-cmp-enabled').should('eq', 'true');
        cy.get(`#${dynamicRadioId}`).invoke('attr', 'data-cmp-enabled').should('eq', 'true');

        // Test data-cmp-required attribute
        cy.get(`#${changeOptionsId}`).invoke('attr', 'data-cmp-required').should('eq', 'false');
        cy.get(`#${dynamicDropDownId}`).invoke('attr', 'data-cmp-required').should('eq', 'false');
        cy.get(`#${dynamicRadioId}`).invoke('attr', 'data-cmp-required').should('eq', 'false');
    })

    it("should handle readonly state correctly", () => {
        const addOptionsId = componentIds['addOptions'];
        const newDropDownId = componentIds['newdropdown'];

        // Test readonly checkboxgroup v2
        cy.get(`#${addOptionsId}`).invoke('attr', 'data-cmp-readonly').should('eq', 'true');
        cy.get(`#${addOptionsId}`).find("input").should('be.disabled');

        // Test readonly dropdown
        cy.get(`#${newDropDownId}`).invoke('attr', 'data-cmp-readonly').should('eq', 'true');
        cy.get(`#${newDropDownId} select`).should('be.disabled');
        cy.get(`#${newDropDownId} select`).should('have.attr', 'aria-readonly', 'true');
    })

    // it("should have proper role attributes for radiobutton v2 groups", () => {
    //     const dynamicRadioId = componentIds['dynamicRadio'];
    //     const newRadioId = componentIds['newradio'];
    //     const extraRadioId = componentIds['extraRadio'];

    //     // Test radiogroup role
    //     cy.get(`#${dynamicRadioId}`).find(selectors.radiobuttonGroupWidget).should('have.attr', 'role', 'radiogroup');
    //     cy.get(`#${newRadioId}`).find(selectors.radiobuttonGroupWidget).should('have.attr', 'role', 'radiogroup');
    //     cy.get(`#${extraRadioId}`).find(selectors.radiobuttonGroupWidget).should('have.attr', 'role', 'radiogroup');
    // })

    it("should have proper tabindex attributes for interactive elements", () => {
        const changeOptionsId = componentIds['changeOptions'];
        const addOptionsId = componentIds['addOptions'];
        const dynamicRadioId = componentIds['dynamicRadio'];

        // Test checkboxgroup v2 tabindex
        cy.get(`#${changeOptionsId}`).find(selectors.checkboxgroupWidget).should('have.attr', 'tabindex', '0');
        cy.get(`#${addOptionsId}`).find(selectors.checkboxgroupWidget).should('have.attr', 'tabindex', '0');

        // Test radiobutton v2 tabindex
        cy.get(`#${dynamicRadioId}`).find(selectors.radiobuttonWidget).should('have.attr', 'tabindex', '0');
    })

    it("should add filled/empty class for checkboxgroup v2", () => {
        const changeOptionsId = componentIds['changeOptions'];
        
        // Initially should be empty
        cy.get(`#${changeOptionsId}`).should('have.class', 'cmp-adaptiveform-checkboxgroup--empty');
        
        // After selecting an option, should be filled
        cy.get(`#${changeOptionsId}`).find(`${selectors.checkboxgroupWidget}[value='a']`).check().then(() => {
            cy.get(`#${changeOptionsId}`).should('have.class', 'cmp-adaptiveform-checkboxgroup--filled');
        });
        
        // After unchecking all, should be empty again
        cy.get(`#${changeOptionsId}`).find(`${selectors.checkboxgroupWidget}[value='a']`).uncheck().then(() => {
            cy.get(`#${changeOptionsId}`).should('have.class', 'cmp-adaptiveform-checkboxgroup--empty');
        });
    })

    it("should add filled/empty class for radiobutton v2", () => {
        const dynamicRadioId = componentIds['dynamicRadio'];
        
        // Initially should be empty
        cy.get(`#${dynamicRadioId}`).should('have.class', 'cmp-adaptiveform-radiobutton--empty');
        
        // After selecting an option, should be filled
        cy.get(`#${dynamicRadioId}`).find(`${selectors.radiobuttonWidget}[value='a']`).check().then(() => {
            cy.get(`#${dynamicRadioId}`).should('have.class', 'cmp-adaptiveform-radiobutton--filled');
        });
    })

    it("checkboxgroup v2 and radiobutton v2 should be wrapped in fieldset with legend", () => {
        const changeOptionsId = componentIds['changeOptions'];
        const dynamicRadioId = componentIds['dynamicRadio'];

        // Test checkboxgroup v2 is wrapped in fieldset
        cy.get(`#${changeOptionsId}`).then($el => {
            expect($el.prop('tagName')).to.eq('FIELDSET');
        });
        cy.get(`#${changeOptionsId}`).find('legend').should('exist');

        // Test radiobutton v2 is wrapped in fieldset
        cy.get(`#${dynamicRadioId}`).then($el => {
            expect($el.prop('tagName')).to.eq('FIELDSET');
        });
        cy.get(`#${dynamicRadioId}`).find('legend').should('exist');
    })

})
