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
/**
describe("Form Runtime with Scribble Input", () => {

    const pagePath = "content/forms/af/core-components-it/samples/scribble/basic.html"
    const bemBlock = "cmp-adaptiveform-scribble"

    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    const checkHTML = (id, state) => {
        const visible = state.visible;
        const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
        const passDisabledAttributeCheck = `${state.enabled === false || state.readOnly === true ? "" : "not."}have.attr`;
        const value = state.value
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
                .should('have.length', 1)
            cy.get('input')
                .should(passDisabledAttributeCheck, 'disabled');
            cy.get('input').should('be.checked');
        })
    }

    it("should get model and view initialized properly", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id)
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
        });
    });

    it("on clicking of text button, user can type signature and save it", () => {
        cy.get(".cmp-adaptiveform-scribble__canvas-signed-container").click();
        cy.get('.cmp-adaptiveform-scribble__canvases').should('be.visible');
        cy.get('button[aria-label="textSign"]').should('be.visible').click(); 
        cy.get('input[name="signatureText"]').should('be.visible').type('Xyx');
        cy.get('button[aria-label="save"]').should('not.be.disabled').click();
        cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').find('img').should('have.attr', 'src');
    });

    // it('should draw a signature on the canvas using mouse events', () => {
    //     cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').click();
    //     cy.get('.cmp-adaptiveform-scribble__canvases').trigger('mousedown', 'center').trigger('mousemove',5,5).trigger('mouseup');
    //     cy.get('button[aria-label="save"]').should('not.be.disabled').click();
    //     cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').find('img').should('have.attr', 'src'); 
    // });

    it('should erase the signature on clicking of eraser icon', () => {
        cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').click();
        cy.get('.cmp-adaptiveform-scribble__canvases').trigger('mousedown', 'center').trigger('mousemove',5,5).trigger('mouseup');
        cy.get('button[aria-label="clearSign"]').should('be.visible').click();
        cy.get('button[aria-label="save"]').should('be.disabled'); 
        cy.get('button[aria-label="close"]').click();
        cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').find('img').should('not.have.attr', 'src'); 
    });

    // it('Delete button should clear the image', () => {
    //     cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').click();
    //     cy.get('.cmp-adaptiveform-scribble__canvases').trigger('mousedown', 'center').trigger('mousemove',5,5).trigger('mouseup');
    //     cy.get('button[aria-label="save"]').should('not.be.disabled').click();
    //     cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').find('img').should('have.attr', 'src');
    //     cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').find('.cmp-adaptiveform-scribble__clear-sign').click(); 
    //     cy.get('.cmp-adaptiveform-scribble__clearsign-container').find('.cmp-adaptiveform-scribble__button--primary').click();
    //     cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').find('img').should('not.have.attr', 'src'); 
    // });

    // it("on clicking of brush button, user can select different grade of pencil for signing the canvas ", () => {
    //     cy.get(".cmp-adaptiveform-scribble__canvas-signed-container").click();
    //     cy.get('.cmp-adaptiveform-scribble__canvases').should('be.visible');
    //     cy.get('button[aria-label="brushes"]').should('be.visible').click(); 
    //     cy.get('.cmp-adaptiveform-scribble__brushlist').should('be.visible');
    //     cy.get('.cmp-adaptiveform-scribble__brushlist div').eq(5).click();
    //     cy.get('.cmp-adaptiveform-scribble__canvases').trigger('mousedown', 'center').trigger('mousemove',5,5).trigger('mouseup');
    //     cy.get('button[aria-label="save"]').should('not.be.disabled').click();
    //     cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').find('img').should('have.attr', 'src');
    // });


})
 **/
