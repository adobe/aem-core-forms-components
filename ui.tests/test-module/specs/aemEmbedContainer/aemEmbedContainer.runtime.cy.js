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
describe("Sites with Aem Embed Container", () => {
    const PAGE_PATH = "/content/forms/sites/core-components-it/afcorecomponentsembedtest.html";
    context('aem embed container in iframe mode ', function () {

        const pagePath = PAGE_PATH;

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openPage(pagePath);

        })

        const getIframeBody = () => {
            // get the iframe > document > body
            // and retry until the body element is not empty
            return cy
                .get('iframe')
                .its('0.contentDocument.body').should('not.be.empty')
                .then(cy.wrap)
        }

        it("test for iframe presence in for with data path as selected form", () => {
            cy.get('.cmp-aemform__iframecontent').should('have.length', 1);
            cy.get('.cmp-aemform__iframecontent').should('have.attr', "data-form-page-path", "/content/forms/af/core-components-it/samples/numberinput/basic");
        })

        it("test for aemembedcontainer presence inside iframe", () => {
            getIframeBody().find('.cmp-adaptiveform-container').should('have.length', 1);
            getIframeBody().find('.cmp-adaptiveform-container').find('.cmp-adaptiveform-numberinput__widget').its('length').should('be.gt', 8);
        })

        it("test for form presence in nonIframe mode", () => {
            cy.get('.cmp-adaptiveform-container').should('have.length', 1);
            cy.get('.cmp-adaptiveform-container').find('.cmp-adaptiveform-textinput__widget').should('have.length', 11);
        })

        it('Test iframe src with dataRef', () => {
            cy.get('.cmp-aemform__iframecontent').should('have.attr', 'src').should('not.include', "wcmmode");
        });
    })

    context('aem embed container in iframe mode with custom height ', function () {

        const pagePath = "/content/forms/sites/core-components-it/aemembedcontainerwithcustomheight.html?wcmmode=disabled";

        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openPage(pagePath);

        })

        it("test for embed container height property working in iFrameMode", () => {
            cy.get('.cmp-aemform__iframecontent').should('have.css', 'height', '1000px');
        })

    })

    context('aem embed container id mismatch test ', function () {

        const pagePath = "/content/forms/sites/core-components-it/aemembedcontainertest.html";
        let formContainer = null;

        beforeEach(function () {
            cy.previewForm(pagePath).then(p => {
                formContainer = p;
            })
        })

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

        it("model initialized properly", () => {
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            // fragment component, text field and IntanceManager
            expect(Object.keys(formContainer._fields).length).to.be.gt(4);
        })

        it("model's changes are reflected in the html ", () => {
            const id = formContainer._model.items[0].items[0].items[0].id;
            const model = formContainer._model.getElement(id);
            model.value = "some other value"
            checkHTML(model.id, model.getState()).then(() => {
                model.visible = false
                return checkHTML(model.id, model.getState())
            }).then(() => {
                model.enabled = false
                return checkHTML(model.id, model.getState())
            })
        });

        it("html changes are reflected in model", () => {
            const fragmentTextinputId = formContainer._model.items[0].items[0].items[0].id;
            const fragmentTextInputModel = formContainer._model.getElement(fragmentTextinputId);
            const input = "Test value"
            cy.get(`#${fragmentTextinputId}`).find("input").clear().type(input).blur().then(x => {
                expect(fragmentTextInputModel.getState().value).to.equal(input)
            })
        })

    })
})
