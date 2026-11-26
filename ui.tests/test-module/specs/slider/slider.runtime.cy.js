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

describe("Form with Slider", () => {

    const pagePath = "content/forms/af/core-components-it/samples/slider/basic.html"
    const bemBlock = 'cmp-adaptiveform-slider'
    const IS = "adaptiveFormSlider"
    const selectors = {
        slider: `[data-cmp-is="${IS}"]`,
        widget: `.${bemBlock}__widget`,
        value: `.${bemBlock}__value`
    }

    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    const getSliderEntries = () => Object.entries(formContainer._fields)
        .filter(([id, field]) => field.getModel().fieldType === 'range');

    const setSliderValue = (id, value) => {
        cy.get(`#${id}`).find('input').then($input => {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setter.call($input[0], value);
            $input[0].dispatchEvent(new Event('input', {bubbles: true}));
            $input[0].dispatchEvent(new Event('change', {bubbles: true}));
        });
    }

    it("should export fieldType range and type number in the model", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        const sliders = getSliderEntries();
        expect(sliders.length, "all sliders are initialized").to.equal(5);
        sliders.forEach(([id, field]) => {
            expect(field.getId()).to.equal(id);
            expect(formContainer._model.getElement(id), "model and view are in sync").to.equal(field.getModel());
            expect(field.getModel().type).to.equal('number');
        });
    });

    it("should render a native range input with min, max, step and default", () => {
        const [id] = getSliderEntries()[0];
        cy.get(`#${id}`).find('input')
            .should('have.attr', 'type', 'range')
            .and('have.attr', 'min', '0')
            .and('have.attr', 'max', '100')
            .and('have.attr', 'step', '5')
            .and('have.value', '20');
        cy.get(`#${id}`).find(selectors.value).should('have.text', '20');
    });

    it("should update the displayed value live while the slider moves", () => {
        const [id] = getSliderEntries()[0];
        cy.get(`#${id}`).find('input').then($input => {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setter.call($input[0], '45');
            $input[0].dispatchEvent(new Event('input', {bubbles: true}));
        });
        cy.get(`#${id}`).find(selectors.value).should('have.text', '45');
        cy.get(`#${id}`).find('input').should('have.attr', 'aria-valuetext', '45');
    });

    it("should reflect html changes in the model", () => {
        const [id, field] = getSliderEntries()[0];
        setSliderValue(id, '60');
        cy.wrap(null).should(() => {
            expect(Number(field.getModel().value)).to.equal(60);
        });
    });

    it("should reflect model changes in the html", () => {
        const [id, field] = getSliderEntries()[0];
        field.getModel().value = 35;
        cy.get(`#${id}`).find('input').should('have.value', '35');
        cy.get(`#${id}`).find(selectors.value).should('have.text', '35');
    });

    it("should be keyboard focusable and honour the step", () => {
        const [id, field] = getSliderEntries()[0];
        cy.get(`#${id}`).find('input').focus().should('have.focus')
            .and('not.have.attr', 'tabindex', '-1')
            .and('have.attr', 'step', '5');
        setSliderValue(id, '25');
        cy.wrap(null).should(() => {
            expect(Number(field.getModel().value)).to.equal(25);
        });
    });

    it("should clamp values to the min and max", () => {
        const [id, field] = getSliderEntries()[1];
        setSliderValue(id, '500');
        cy.get(`#${id}`).find('input').should('have.value', '50');
        setSliderValue(id, '-20');
        cy.get(`#${id}`).find('input').should('have.value', '10');
    });

    it("should snap values to the step", () => {
        const [id] = getSliderEntries()[1];
        setSliderValue(id, '23');
        cy.get(`#${id}`).find('input').should('have.value', '20');
    });

    it("should not change the model of a read-only slider", () => {
        const [id, field] = getSliderEntries()[2];
        cy.get(`#${id}`).find('input').should('have.attr', 'aria-readonly', 'true');
        setSliderValue(id, '8');
        cy.wrap(null).should(() => {
            expect(Number(field.getModel().value)).to.equal(3);
        });
        cy.get(`#${id}`).find('input').should('have.value', '3');
    });

    it("should disable the widget of a disabled slider", () => {
        const [id, field] = getSliderEntries().find(([, f]) => f.getModel().name === 'slider4');
        cy.wrap(null).should(() => {
            expect(field.getModel().enabled, "model is disabled").to.equal(false);
        });
        cy.get(`#${id}`).find('input').should('have.attr', 'disabled');
    });

    it("should be usable in a calculation", () => {
        const [sliderId] = getSliderEntries()[0];
        const total = Object.values(formContainer._fields).find(f => f.getModel().name === 'total');
        cy.wrap(null).should(() => {
            expect(Number(total.getModel().value)).to.equal(40);
        });
        setSliderValue(sliderId, '30');
        cy.wrap(null).should(() => {
            expect(Number(total.getModel().value)).to.equal(60);
        });
    });

    it("should set aria-invalid when the model becomes invalid", () => {
        const [id, field] = getSliderEntries()[0];
        field.getModel().required = true;
        field.getModel().value = null;
        field.getModel().validate();
        cy.get(`#${id}`).find('input').should('have.attr', 'aria-invalid', 'true');
    });

    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, 'tooltip_scenario_test');
    });
})
