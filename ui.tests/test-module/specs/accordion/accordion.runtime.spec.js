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
describe("Form with Accordion Container", () => {

    const pagePath = "content/forms/af/core-components-it/samples/accordion/basic.html";
    const childBemBlock = 'cmp-accordion__item';
    const bemBlock = "cmp-accordion";
    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    const checkHTML = (id, state, view, count) => {
        const visible = state.visible;
        const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
        cy.get(`#${id}`)
            .should(passVisibleCheck)
            .invoke('attr', 'data-cmp-visible')
            .should('eq', visible.toString());
        cy.get(`#${id}`)
            .invoke('attr', 'data-cmp-enabled')
            .should('eq', state.enabled.toString());
        expect(state.items.length, "model has children equal to count").to.equal(count);
        if (count == 0) {
            return cy.get(`.${childBemBlock}`).should('not.exist');
        } else {
            return cy.get(`.${childBemBlock}`).should('have.length', count);
        }
    };


    it(" should get model and view initialized properly and parent child relationship is set ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id);
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel());
        });

        const datepickerId = formContainer._model.items[0].items[0].id;
        const datepickerView = formContainer._fields[datepickerId];
        expect(datepickerView, "panel child view is created").to.not.be.null;
    })

    it(" model's changes are reflected in the html ", () => {
        const accordionId = formContainer._model.items[0].id;
        const model = formContainer._model.getElement(accordionId);
        const panelId = formContainer._model.items[0].items[0].id;
        const panelView = formContainer._fields[panelId];
        const count = 2;
        checkHTML(model.id, model.getState(), panelView, count).then(() => {
            model.visible = false;
            return checkHTML(model.id, model.getState(), panelView, count);
        }).then(() => {
            model.enable = false;
            return checkHTML(model.id, model.getState(), panelView, count);
        });
    });

    it("should collapse/expand view properly", () => {

        const firstChildComponentId = formContainer._model.items[0].items[0].id;
        const firstChildComponentItemId = firstChildComponentId + "-item";
        const firstChildComponentButtonId = firstChildComponentId + "-button";
        const firstChildComponentPanelId = firstChildComponentId + "-panel";

        const secondChildComponentId = formContainer._model.items[0].items[1].id;
        const secondChildComponentItemId = secondChildComponentId + "-item";
        const secondChildComponentButtonId = secondChildComponentId + "-button";
        const secondChildComponentPanelId = secondChildComponentId + "-panel";

        cy.get(`#${firstChildComponentButtonId}`).should('have.class', 'cmp-accordion__button--expanded');
        cy.get(`#${firstChildComponentButtonId}`).should('have.attr', 'aria-controls', firstChildComponentPanelId);
        cy.get(`#${firstChildComponentItemId}`).should('have.attr', 'data-cmp-expanded');
        cy.get(`#${firstChildComponentPanelId}`).should('have.class', 'cmp-accordion__panel--expanded');
        cy.get(`#${firstChildComponentPanelId}`).should('have.attr', 'aria-labelledby', firstChildComponentButtonId);

        cy.get(`#${secondChildComponentItemId}`).should('not.have.attr', 'data-cmp-expanded');
        cy.get(`#${secondChildComponentButtonId}`).should('not.have.class', 'cmp-accordion__button--expanded');
        cy.get(`#${secondChildComponentPanelId}`).should('not.have.class', 'cmp-accordion__panel--expanded');

        //all collapsed state by clicking the expanded panel
        cy.get(`#${firstChildComponentButtonId}`).click().then(() => {
            cy.get(`#${firstChildComponentButtonId}`).should('not.have.class', 'cmp-accordion__button--expanded');
            cy.get(`#${firstChildComponentItemId}`).should('not.have.attr', 'data-cmp-expanded');
            cy.get(`#${secondChildComponentItemId}`).should('not.have.attr', 'data-cmp-expanded');
            cy.get(`#${secondChildComponentButtonId}`).should('not.have.class', 'cmp-accordion__button--expanded');
            cy.get(`#${secondChildComponentPanelId}`).should('not.have.class', 'cmp-accordion__panel--expanded');

            //expanded 2nd panel
            cy.get(`#${secondChildComponentButtonId}`).click().then(() => {
                cy.get(`#${secondChildComponentItemId}`).should('have.attr', 'data-cmp-expanded');
                cy.get(`#${secondChildComponentButtonId}`).should('have.class', 'cmp-accordion__button--expanded');
                cy.get(`#${secondChildComponentItemId}`).should('have.attr', 'data-cmp-expanded');

                cy.get(`#${firstChildComponentItemId}`).should('not.have.attr', 'data-cmp-expanded');
                cy.get(`#${firstChildComponentButtonId}`).should('not.have.class', 'cmp-accordion__button--expanded');
                cy.get(`#${firstChildComponentPanelId}`).should('not.have.class', 'cmp-accordion__panel--expanded');
            });
        })
    })

    it("should collapse/expand view properly with keyboard", () => {

        const firstChildComponentId = formContainer._model.items[0].items[0].id;
        const firstChildComponentItemId = firstChildComponentId + "-item";
        const firstChildComponentButtonId = firstChildComponentId + "-button";
        const firstChildComponentPanelId = firstChildComponentId + "-panel";

        const secondChildComponentId = formContainer._model.items[0].items[1].id;
        const secondChildComponentItemId = secondChildComponentId + "-item";
        const secondChildComponentButtonId = secondChildComponentId + "-button";
        const secondChildComponentPanelId = secondChildComponentId + "-panel";

        cy.get(`#${firstChildComponentButtonId}`).should('have.class', 'cmp-accordion__button--expanded');
        cy.get(`#${firstChildComponentButtonId}`).should('have.attr', 'aria-controls', firstChildComponentPanelId);
        cy.get(`#${firstChildComponentItemId}`).should('have.attr', 'data-cmp-expanded');
        cy.get(`#${firstChildComponentPanelId}`).should('have.class', 'cmp-accordion__panel--expanded');
        cy.get(`#${firstChildComponentPanelId}`).should('have.attr', 'aria-labelledby', firstChildComponentButtonId);

        cy.get(`#${secondChildComponentItemId}`).should('not.have.attr', 'data-cmp-expanded');
        cy.get(`#${secondChildComponentButtonId}`).should('not.have.class', 'cmp-accordion__button--expanded');
        cy.get(`#${secondChildComponentPanelId}`).should('not.have.class', 'cmp-accordion__panel--expanded');

        //all collapsed state by clicking the expanded panel
        cy.get(`#${firstChildComponentButtonId}`).focus().trigger('keydown', {keyCode: 13})
            .then(() => {
                cy.get(`#${firstChildComponentButtonId}`).should('not.have.class', 'cmp-accordion__button--expanded');
                cy.get(`#${firstChildComponentItemId}`).should('not.have.attr', 'data-cmp-expanded');
                cy.get(`#${secondChildComponentItemId}`).should('not.have.attr', 'data-cmp-expanded');
                cy.get(`#${secondChildComponentButtonId}`).should('not.have.class', 'cmp-accordion__button--expanded');
                cy.get(`#${secondChildComponentPanelId}`).should('not.have.class', 'cmp-accordion__panel--expanded');
                //expanded 2nd panel
                cy.get(`#${secondChildComponentButtonId}`).focus().trigger('keydown', {keyCode: 13})
                    .then(() => {
                        cy.get(`#${secondChildComponentItemId}`).should('have.attr', 'data-cmp-expanded');
                        cy.get(`#${secondChildComponentButtonId}`).should('have.class', 'cmp-accordion__button--expanded');
                        cy.get(`#${secondChildComponentItemId}`).should('have.attr', 'data-cmp-expanded');
                        cy.get(`#${firstChildComponentItemId}`).should('not.have.attr', 'data-cmp-expanded');
                        cy.get(`#${firstChildComponentButtonId}`).should('not.have.class', 'cmp-accordion__button--expanded');
                        cy.get(`#${firstChildComponentPanelId}`).should('not.have.class', 'cmp-accordion__panel--expanded');
                    });
            })
    })

    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, 'tooltip_scenario_test');
    })
})

describe("Form with Accordion Layout Container with focus", () => {

    const pagePath = "content/forms/af/core-components-it/samples/accordion/focus.html";
    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    it("check if first tab activated if focus call from other tab", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0];
        const firstChildComponentId = formContainer._model.items[0].items[0].id;
        const firstChildComponentButtonId = firstChildComponentId + "-button";
        const firstChildComponentPanelId = firstChildComponentId + "-panel";

        const secondChildComponentId = formContainer._model.items[0].items[1].id;
        const secondChildComponentButtonId = secondChildComponentId + "-button";
        const secondChildComponentPanelId = secondChildComponentId + "-panel";

        // panel 1 active
        cy.get(`#${firstChildComponentButtonId}`).should('have.class', 'cmp-accordion__button--expanded');
        cy.get(`#${firstChildComponentPanelId}`).should('have.class', 'cmp-accordion__panel--expanded');
        cy.get(`#${secondChildComponentButtonId}`).should('not.have.class', 'cmp-accordion__button--expanded');
        cy.get(`#${secondChildComponentPanelId}`).should('not.have.class', 'cmp-accordion__panel--expanded');

        cy.get(`#${secondChildComponentButtonId}`).click({force: true}).then(() => {
            // panel 2 active
            cy.get(`#${secondChildComponentButtonId}`).should('have.class', 'cmp-accordion__button--expanded');
            cy.get(`#${firstChildComponentButtonId}`).should('not.have.class', 'cmp-accordion__button--expanded');
            cy.get(`#${firstChildComponentPanelId}`).should('not.have.class', 'cmp-accordion__panel--expanded');

            cy.get(`#${firstChildComponentButtonId}`).then(() => {
                formContainer.setFocus(id);
                cy.get(`#${firstChildComponentButtonId}`).then(() => {
                    // panel 1 active
                    cy.get(`#${firstChildComponentButtonId}`).should('have.class', 'cmp-accordion__button--expanded');
                    cy.get(`#${firstChildComponentPanelId}`).should('have.class', 'cmp-accordion__panel--expanded');
                    cy.get(`#${secondChildComponentButtonId}`).should('not.have.class', 'cmp-accordion__button--expanded');
                    cy.get(`#${secondChildComponentPanelId}`).should('not.have.class', 'cmp-accordion__panel--expanded');

                });
            });
        });
    });
});

describe("Form with Accordion Layout Container with Hidden Children", () => {

    const pagePath = "content/forms/af/core-components-it/samples/accordion/visibility.html";
    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    it("check if first tab is hidden on page load honoring jcr and second tab is expanded", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0];
        const firstPanelNavOfAccordionId = formContainer._model.items[0].items[0].id + "-item";
        const firstPanelButtonOfAccordionId = formContainer._model.items[0].items[0].id + "-button";
        const secondPanelNavOfAccordionId = formContainer._model.items[0].items[1].id + "-item";
        const secondPanelButtonOfAccordionId = formContainer._model.items[0].items[1].id + "-button";

        cy.get(`#${firstPanelNavOfAccordionId}`).should('have.attr', 'data-cmp-visible', 'false');
        cy.get(`#${firstPanelButtonOfAccordionId}`).should('not.have.class', 'cmp-accordion__button--expanded');
        cy.get(`#${secondPanelNavOfAccordionId}`).should('have.attr', 'data-cmp-expanded');
        cy.get(`#${secondPanelButtonOfAccordionId}`).should('have.class', 'cmp-accordion__button--expanded');
    });

    it("check if rule is working to hide child", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0];
        const secondPanelNavOfAccordionId = formContainer._model.items[0].items[1].id + "-item";
        const secondPanelButtonOfAccordionId = formContainer._model.items[0].items[1].id + "-button";
        //check initial state
        cy.get(`#${secondPanelNavOfAccordionId}`).should('have.attr', 'data-cmp-expanded');
        cy.get(`#${secondPanelButtonOfAccordionId}`).should('have.class', 'cmp-accordion__button--expanded');

        const textInputId = formContainer._model.items[1].id;
        cy.get(`#${textInputId}`).find('.cmp-adaptiveform-textinput__widget').focus().type('a').blur().then(() => {
            cy.get(`#${secondPanelNavOfAccordionId}`).should('not.be.visible').should('have.attr', 'data-cmp-visible', 'false');
            cy.get(`#${secondPanelButtonOfAccordionId}`).should('not.have.class', 'cmp-accordion__button--expanded');
            const thirdPanelNavOfAccordionId = formContainer._model.items[0].items[2].id + "-item";
            const thirdPanelButtonOfAccordionId = formContainer._model.items[0].items[2].id + "-button";
            cy.get(`#${thirdPanelNavOfAccordionId}`).should('have.attr', 'data-cmp-expanded');
            cy.get(`#${thirdPanelButtonOfAccordionId}`).should('have.class', 'cmp-accordion__button--expanded');
        })
    });
});