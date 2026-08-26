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
describe("Form Runtime with ImageChoice", () => {

    const pagePath = "content/forms/af/core-components-it/samples/imagechoice/testimagechoice.html"
    const bemBlock = 'cmp-adaptiveform-imagechoice'
    const IS = "adaptiveFormImageChoice"
    const selectors = {
        imagechoice: `[data-cmp-is="${IS}"]`
    }

    let formContainer = null

    /**
     * Helper to get field by model children index (guarantees model order).
     * Object.entries(formContainer._fields) does NOT guarantee insertion order
     * matches model item order, so we use _model._children instead.
     */
    const getField = (index) => {
        const child = formContainer._model._children[index];
        return [child.id, formContainer._fields[child.id]];
    };

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    const checkHTML = (id, state, inputCount) => {
        const visible = state.visible;
        const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
        const passDisabledAttributeCheck = `${state.enabled === false || state.readOnly === true ? "" : "not."}have.attr`;
        cy.get(`#${id}`)
            .should(passVisibleCheck)
            .invoke('attr', 'data-cmp-visible')
            .should('eq', visible.toString());
        cy.get(`#${id}`)
            .invoke('attr', 'data-cmp-enabled')
            .should('eq', state.enabled.toString());
        return cy.get(`#${id}`).within(() => {
            cy.get('*').should(passVisibleCheck)
            cy.get('input')
                .should('have.length', inputCount)
            cy.get('input')
                .should(passDisabledAttributeCheck, 'disabled');
        })
    }

    it("should get model and view initialized properly", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id)
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
        });
    })

    it("multi-select imagechoice should render with horizontal orientation and checkbox inputs", () => {
        const [id, fieldView] = getField(0)
        cy.get(`#${id}`).find(`.${bemBlock}__widget`).should('have.class', 'horizontal')
        cy.get(`#${id}`).invoke('attr', 'data-cmp-selection-type').should('eq', 'multi')
        cy.get(`#${id}`).find('input[type="checkbox"]').should('have.length', 3)
    })

    it("single-select imagechoice should render with vertical orientation and radio inputs", () => {
        const [id, fieldView] = getField(1)
        cy.get(`#${id}`).find(`.${bemBlock}__widget`).should('have.class', 'vertical')
        cy.get(`#${id}`).invoke('attr', 'data-cmp-selection-type').should('eq', 'single')
        cy.get(`#${id}`).find('input[type="radio"]').should('have.length', 2)
    })

    it("should render images for each option", () => {
        const [id, fieldView] = getField(0)
        cy.get(`#${id}`).find(`.${bemBlock}__image`).should('have.length', 3)
        cy.get(`#${id}`).find(`.${bemBlock}__image`).each(($img) => {
            cy.wrap($img).should('have.attr', 'src').and('not.be.empty')
        })
    })

    it("should render option text for each option", () => {
        const [id, fieldView] = getField(0)
        cy.get(`#${id}`).find(`.${bemBlock}__option-text`).should('have.length', 3)
        cy.get(`#${id}`).find(`.${bemBlock}__option-text`).eq(0).should('contain.text', 'a')
        cy.get(`#${id}`).find(`.${bemBlock}__option-text`).eq(1).should('contain.text', 'b')
        cy.get(`#${id}`).find(`.${bemBlock}__option-text`).eq(2).should('contain.text', 'c')
    })

    it("model's changes are reflected in the html for multi-select", () => {
        const [id, fieldView] = getField(0)
        const model = formContainer._model.getElement(id)

        model.value = 1
        checkHTML(model.id, model.getState(), 3).then(() => {
            cy.get(`#${id}`).find('input').eq(0).should('be.checked')
            cy.get(`#${id}`).find('input').eq(1).should('not.be.checked')
            cy.get(`#${id}`).find('input').eq(2).should('not.be.checked')
        }).then(() => {
            model.visible = false
            return checkHTML(model.id, model.getState(), 3)
        }).then(() => {
            model.enable = false
            return checkHTML(model.id, model.getState(), 3)
        })
    })

    it("model's changes are reflected in the html for single-select", () => {
        const [id, fieldView] = getField(1)
        const model = formContainer._model.getElement(id)

        model.value = 'a'
        checkHTML(model.id, model.getState(), 2).then(() => {
            cy.get(`#${id}`).find('input').eq(0).should('be.checked')
            cy.get(`#${id}`).find('input').eq(1).should('not.be.checked')
        }).then(() => {
            model.value = 'b'
            cy.get(`#${id}`).find('input').eq(0).should('not.be.checked')
            cy.get(`#${id}`).find('input').eq(1).should('be.checked')
        })
    })

    it("html changes are reflected in model for multi-select", () => {
        const [id, fieldView] = getField(0)
        const model = formContainer._model.getElement(id)

        cy.get(`#${id}`).find("input").eq(0).click({force: true}).then(() => {
            expect(model.getState().value).to.deep.include(1);
        })

        cy.get(`#${id}`).find("input").eq(2).click({force: true}).then(() => {
            const val = model.getState().value;
            expect(val).to.deep.include(1);
            expect(val).to.deep.include(3);
        })

        cy.get(`#${id}`).find("input").eq(0).click({force: true}).then(() => {
            const val = model.getState().value;
            expect(val).to.not.deep.include(1);
            expect(val).to.deep.include(3);
        })
    })

    it("html changes are reflected in model for single-select", () => {
        const [id, fieldView] = getField(1)
        const model = formContainer._model.getElement(id)

        cy.get(`#${id}`).find("input").eq(0).click({force: true}).then(() => {
            expect(model.getState().value).to.equal('a');
        })

        cy.get(`#${id}`).find("input").eq(1).click({force: true}).then(() => {
            expect(model.getState().value).to.equal('b');
        })
    })

    it("should toggle enabled/disabled state via model", () => {
        const [id, fieldView] = getField(0)
        const model = formContainer._model.getElement(id)

        model.enabled = false
        cy.get(`#${id}`).invoke('attr', 'data-cmp-enabled').should('eq', 'false')
        cy.get(`#${id}`).find('input').should('have.attr', 'disabled')

        cy.wrap(null).then(() => {
            model.enabled = true
        })
        cy.get(`#${id}`).invoke('attr', 'data-cmp-enabled').should('eq', 'true')
        cy.get(`#${id}`).find('input').should('not.have.attr', 'disabled')
    })

    it("should toggle readOnly state via model", () => {
        const [id, fieldView] = getField(0)
        const model = formContainer._model.getElement(id)

        model.readOnly = true
        cy.get(`#${id}`).invoke('attr', 'data-cmp-readonly').should('eq', 'true')
        cy.get(`#${id}`).find('input').should('have.attr', 'disabled')

        cy.wrap(null).then(() => {
            model.readOnly = false
        })
        cy.get(`#${id}`).invoke('attr', 'data-cmp-readonly').should('eq', 'false')
        cy.get(`#${id}`).find('input').should('not.have.attr', 'disabled')
    })

    it("should toggle visibility via model", () => {
        const [id, fieldView] = getField(0)
        const model = formContainer._model.getElement(id)

        model.visible = false
        cy.get(`#${id}`).should('not.be.visible')
        cy.get(`#${id}`).invoke('attr', 'data-cmp-visible').should('eq', 'false')

        cy.wrap(null).then(() => {
            model.visible = true
        })
        cy.get(`#${id}`).should('be.visible')
        cy.get(`#${id}`).invoke('attr', 'data-cmp-visible').should('eq', 'true')
    })

    it("should add filled/empty class at container div for multi-select", () => {
        const [id, fieldView] = getField(0)

        cy.get(`#${id}`).should('have.class', `${bemBlock}--empty`)
        cy.get(`#${id}`).find("input").eq(0).click({force: true}).then(() => {
            cy.get(`#${id}`).should('have.class', `${bemBlock}--filled`)
        })
    })

    it("should add filled/empty class at container div for single-select", () => {
        const [id, fieldView] = getField(1)

        cy.get(`#${id}`).should('have.class', `${bemBlock}--empty`)
        cy.get(`#${id}`).find("input").eq(0).click({force: true}).then(() => {
            cy.get(`#${id}`).should('have.class', `${bemBlock}--filled`)
        })
    })

    it("reset button should clear multi-select imagechoice values", () => {
        const [multiId, multiFieldView] = getField(0)
        const [resetId, resetFieldView] = getField(2)

        cy.get(`#${multiId}`).find("input").eq(0).click({force: true})
        cy.get(`#${multiId}`).find("input").eq(1).click({force: true})
        cy.get(`#${multiId}`).find("input").eq(0).should('be.checked')
        cy.get(`#${multiId}`).find("input").eq(1).should('be.checked')

        cy.get(`#${resetId} button`).click().then(() => {
            cy.get(`#${multiId}`).find("input").should('not.be.checked')
        })
    })

    it("reset button should clear single-select imagechoice value", () => {
        const [singleId, singleFieldView] = getField(1)
        const [resetId, resetFieldView] = getField(2)

        cy.get(`#${singleId}`).find("input").eq(0).click({force: true})
        cy.get(`#${singleId}`).find("input").eq(0).should('be.checked')

        cy.get(`#${resetId} button`).click().then(() => {
            cy.get(`#${singleId}`).find("input").should('not.be.checked')
        })
    })

    it("decoration element should not have same class name", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.wrap().then(() => {
            const id = formContainer._model._children[0].id;
            cy.get(`#${id}`).parent().should("not.have.class", bemBlock);
        })
    })
})
