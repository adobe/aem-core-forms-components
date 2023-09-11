/*******************************************************************************
 * Copyright 2023 Adobe
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
describe("Form Runtime with Experience Fragment", () => {

    const pagePath = "content/forms/sites/core-components-it/test-xf-id-mismatch.html"

    let formContainers = null;

    beforeEach(() => {
        cy.previewForm(pagePath, {multipleContainers: true}).then(p => {
            formContainers = p;
        })
    });

    const checkHTML = (id, state) => {
        const visible = state.visible;
        const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
        const passDisabledAttributeCheck = `${state.enabled === false ? "" : "not."}have.attr`;
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
            cy.get('input').should('have.value', value)
        })
    }

    const testTextinputAndFragmentModelToHtml = (formContainer) => {
        const fragmentTextinputId = formContainer._model.items[1].items[0].id;
        const textinputId = formContainer._model.items[0].id;
        const fragmentTextInputModel = formContainer._model.getElement(fragmentTextinputId);
        const textinputModel = formContainer._model.getElement(textinputId);
        checkHTML(fragmentTextInputModel.id, fragmentTextInputModel.getState()).then(() => {
            fragmentTextInputModel.visible = false;
            return checkHTML(fragmentTextInputModel.id, fragmentTextInputModel.getState());
        }).then(() => {
            fragmentTextInputModel.enable = false;
            return checkHTML(fragmentTextInputModel.id, fragmentTextInputModel.getState());
        });

        checkHTML(textinputModel.id, textinputModel.getState()).then(() => {
            textinputModel.visible = false;
            return checkHTML(textinputModel.id, textinputModel.getState());
        }).then(() => {
            textinputModel.enable = false;
            return checkHTML(textinputModel.id, textinputModel.getState());
        });
    }

    const testTextinputAndFragmentHtmlToModel = (formContainer) => {
        const fragmentTextinputId = formContainer._model.items[1].items[0].id;
        const textinputId = formContainer._model.items[0].id;
        const fragmentTextInputModel = formContainer._model.getElement(fragmentTextinputId);
        const textinputModel = formContainer._model.getElement(textinputId);
        const input = "Test value"
        cy.get(`#${textinputId}`).find("input").clear().type(input).blur().then(x => {
            expect(textinputModel.getState().value).to.equal(input)
        })
        cy.get(`#${fragmentTextinputId}`).find("input").clear().type(input).blur().then(x => {
            expect(fragmentTextInputModel.getState().value).to.equal(input)
        })
    }

    it("should initialize form container", () => {
       expect(formContainers).to.have.length(3);
       cy.wrap(formContainers).each(formContainer => {
           expect(formContainer, "formcontainer is initialized").to.not.be.null;
           // In first two case there is 3 field, for last one there is 2 field and InstanceManager.
           expect(Object.keys(formContainer._fields).length, "model and view elements match")
               .to.eq(3);
       })
    })

    it("model change reflected in html for form container in sites", () => {
        const formContainer = formContainers[0];
        testTextinputAndFragmentModelToHtml(formContainer);
    });

    it("html changes are reflected in model for form container in sites", () => {
        const formContainer = formContainers[0];
        testTextinputAndFragmentHtmlToModel(formContainer);
    });

    it("test model change reflected in html for form container in experience fragment", () => {
        const formContainer = formContainers[1];
        testTextinputAndFragmentModelToHtml(formContainer);
    });

    it("html changes are reflected in model for form container in experience fragment", () => {
        const formContainer = formContainers[1];
        testTextinputAndFragmentHtmlToModel(formContainer);
    });

    it("model change reflected in html for embedded form having fragment in experience fragment", () => {
        const formContainer = formContainers[2];
        const fragmentTextinputId = formContainer._model.items[0].items[0].items[0].id;
        const fragmentTextInputModel = formContainer._model.getElement(fragmentTextinputId);
        checkHTML(fragmentTextInputModel.id, fragmentTextInputModel.getState()).then(() => {
            fragmentTextInputModel.visible = false;
            return checkHTML(fragmentTextInputModel.id, fragmentTextInputModel.getState());
        }).then(() => {
            fragmentTextInputModel.enable = false;
            return checkHTML(fragmentTextInputModel.id, fragmentTextInputModel.getState());
        });
    })

    it("html changes are reflected in model for embedded form having fragment in experience fragment", () => {
        cy.wrap(formContainers).then((_formContainers) => {
            const formContainer = formContainers[2];
            const fragmentTextinputId = formContainer._model.items[0].items[0].items[0].id;
            const fragmentTextInputModel = formContainer._model.getElement(fragmentTextinputId);
            const input = "Test value"
            cy.get(`#${fragmentTextinputId}`).find("input").clear().type(input).blur().then(x => {
                expect(fragmentTextInputModel.getState().value).to.equal(input)
            })
        })
    })
})
