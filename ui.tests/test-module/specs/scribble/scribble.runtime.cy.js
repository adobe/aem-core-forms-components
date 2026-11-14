/*
 *  Copyright 2025 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

describe('Form Runtime with Scribble Input', () => {
    const pagePath = "content/forms/af/core-components-it/samples/scribble/basic.html";
    const bemBlock = 'cmp-adaptiveform-scribble';
    const IS = "adaptiveFormScribble";
    const selectors = {
        scribble: `[data-cmp-is="${IS}"]`,
        label: `.${bemBlock}__label`,
        description: `.${bemBlock}__longdescription`,
        canvas: `.${bemBlock}__canvas`,
        container: `.${bemBlock}`
    };

    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        });
    });

    it('should initialize form container and render scribble field', () => {
        expect(formContainer, 'formcontainer is initialized').to.not.be.null;
        cy.get(selectors.scribble).should('exist').and('be.visible');
        cy.get(selectors.label).should('exist');
        cy.get(selectors.description).should('exist');
        cy.get(selectors.canvas).should('exist');
        // Accessibility checks
        cy.get('.cmp-adaptiveform-scribble__container')
            .should('have.attr', 'role', 'dialog')
            .and('have.attr', 'aria-label').and('not.be.empty');
        cy.get('.cmp-adaptiveform-scribble__canvas').should('have.attr', 'aria-label').and('not.be.empty');
        cy.get('.cmp-adaptiveform-scribble__label').invoke('attr', 'for').then(labelFor => {
            if (labelFor) {
                cy.get(`#${labelFor}`).should('exist');
            }
        });
        cy.get('.cmp-adaptiveform-scribble__longdescription').invoke('attr', 'id');
        cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').should('have.attr', 'title');
        cy.get('.cmp-adaptiveform-scribble__canvas-signed-image').should('not.have.attr', 'title');
    });

    it('should have correct data attributes for scribble', () => {
        cy.get(selectors.scribble)
            .should('have.attr', 'data-cmp-is', IS)
            .and('have.attr', 'data-cmp-visible', 'true')
            .and('have.attr', 'data-cmp-enabled', 'true');
    });

    it('should open the scribble modal when signed container is clicked', () => {
        cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').click().then(() => {
            cy.get('.cmp-adaptiveform-scribble__container').should('be.visible');
        });
    });

    it('should clear the signature when clear', () => {
        cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').click().then(() => {
            cy.get('.cmp-adaptiveform-scribble__container').should('be.visible').then(() => {
                cy.get('.cmp-adaptiveform-scribble__control-clear').should('be.visible').then(() => {
                    cy.get('.cmp-adaptiveform-scribble__control-text').should('be.visible').click().then(() => {
                        cy.get('.cmp-adaptiveform-scribble__keyboard-sign-box').should('be.visible').should('have.value', '').type('test').should('have.value', 'test').then(() => {
                            cy.get('.cmp-adaptiveform-scribble__control-clear').should('be.visible').should('be.enabled').click().then(() => {
                                cy.get('.cmp-adaptiveform-scribble__keyboard-sign-box').should('have.value', '');
                            });
                        });
                    });
                 });
            });
        });
    });

    it('should not clear and clear the signature when clear is cancelled and confirmed respectively', () => {
        cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').click().then(() => {
            cy.get('.cmp-adaptiveform-scribble__container').should('be.visible').then(() => {
                cy.get('.cmp-adaptiveform-scribble__save-button').should('be.visible').then(() => {
                    cy.get('.cmp-adaptiveform-scribble__control-text').should('be.visible').click().then(() => {
                        cy.get('.cmp-adaptiveform-scribble__keyboard-sign-box').should('be.visible').type('test').should('have.value', 'test').then(() => {
                            cy.get('.cmp-adaptiveform-scribble__save-button').should('be.visible').should('be.enabled').click().then(() => {
                                cy.get('.cmp-adaptiveform-scribble__canvas-signed-image').should('have.attr', 'title').and('not.be.empty');
                                cy.get('.cmp-adaptiveform-scribble__canvas-signed-image').should('have.attr', 'alt').and('not.be.empty');
                                cy.get('.cmp-adaptiveform-scribble__canvas-signed-image').should('have.attr', 'src').and('not.be.empty');
                                cy.get('.cmp-adaptiveform-scribble__clear-sign').should('exist').should('have.attr', 'role', 'button').should('have.attr', 'tabindex', '0').should('have.attr', 'aria-label', 'Clear Signature').then(() => {
                                    cy.get('.cmp-adaptiveform-scribble__clear-sign').click({ force: true }).then(() => {
                                        cy.get('.cmp-adaptiveform-scribble__clearsign-container').should('be.visible');
                                        cy.get('.cmp-adaptiveform-scribble__button--secondary').click().then(() => {
                                            cy.get('.cmp-adaptiveform-scribble__container').should('not.be.visible');
                                            cy.get('.cmp-adaptiveform-scribble__canvas-signed-image').should('have.attr', 'title').and('not.be.empty');
                                            cy.get('.cmp-adaptiveform-scribble__canvas-signed-image').should('have.attr', 'alt').and('not.be.empty');
                                            cy.get('.cmp-adaptiveform-scribble__canvas-signed-image').should('have.attr', 'src').and('not.be.empty');
                                            cy.get('.cmp-adaptiveform-scribble__clear-sign').should('exist').click({ force: true }).then(() => {  
                                                cy.get('.cmp-adaptiveform-scribble__button--primary').click().then(() => {
                                                    cy.get('.cmp-adaptiveform-scribble__clear-sign').should('not.exist');
                                                    cy.get('.cmp-adaptiveform-scribble__canvas-signed-image').should('not.have.attr', 'src');
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    

    it('should close the modal when close button is clicked', () => {
        cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').click().then(() => {
            cy.get('.cmp-adaptiveform-scribble__container').should('be.visible');
            cy.get('.cmp-adaptiveform-scribble__close-button').click().then(() => {
                cy.get('.cmp-adaptiveform-scribble__container').should('not.be.visible');
            });
        });
    });

    it('should display brushlist with correct accessibility attributes', () => {
        cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').click().then(() => {
            cy.get('.cmp-adaptiveform-scribble__container').should('be.visible');
            // Brushlist should be hidden initially
            cy.get('.cmp-adaptiveform-scribble__brushlist').should('not.be.visible');
            // Open brushlist
            cy.get('.cmp-adaptiveform-scribble__control-brush').click().then(() => {
                cy.get('.cmp-adaptiveform-scribble__brushlist').should('be.visible')
                    .and('have.attr', 'aria-label', 'brush size selection');
                // Check that each brush option (canvas) has an accessible label
                cy.get('.cmp-adaptiveform-scribble__brushlist canvas').each(($canvas) => {
                    // The aria-label is set via JS, so check for its presence
                    expect($canvas[0].getAttribute('aria-label')).to.match(/Brush Size: \d+/);
                });
                // Toggle brushlist closed
                cy.get('.cmp-adaptiveform-scribble__control-brush').click().then(() => {
                    cy.get('.cmp-adaptiveform-scribble__brushlist').should('not.be.visible');
                });
            });
        });
    });

    describe('text signature with whitespace only', () => {
        const openTextSign = () => {
            cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').click();
            cy.get('.cmp-adaptiveform-scribble__container').should('be.visible');
            cy.get('.cmp-adaptiveform-scribble__control-text').click();
            return cy.get('.cmp-adaptiveform-scribble__keyboard-sign-box').should('be.visible');
        };

        it('should keep save and clear disabled when only spaces are typed', () => {
            cy.window().then((win) => {
                cy.spy(win.console, 'error').as('consoleError');
            });
            openTextSign().type('   ');
            cy.get('.cmp-adaptiveform-scribble__save-button').should('be.disabled');
            cy.get('.cmp-adaptiveform-scribble__control-clear').should('be.disabled');
            cy.get('@consoleError').should('not.have.been.called');
        });

        it('should disable save again when typed text is deleted', () => {
            openTextSign().type('abc');
            cy.get('.cmp-adaptiveform-scribble__save-button').should('be.enabled');
            cy.get('.cmp-adaptiveform-scribble__keyboard-sign-box').type('{backspace}{backspace}{backspace}');
            cy.get('.cmp-adaptiveform-scribble__save-button').should('be.disabled');
        });

        it('should disable save when text is replaced by spaces only', () => {
            openTextSign().type('a');
            cy.get('.cmp-adaptiveform-scribble__save-button').should('be.enabled');
            cy.get('.cmp-adaptiveform-scribble__keyboard-sign-box').clear().type('  ');
            cy.get('.cmp-adaptiveform-scribble__save-button').should('be.disabled');
        });

        it('should save a text signature with leading spaces without errors', () => {
            cy.window().then((win) => {
                cy.spy(win.console, 'error').as('consoleError');
            });
            openTextSign().type('  abc');
            cy.get('.cmp-adaptiveform-scribble__save-button').should('be.enabled').click();
            cy.get('.cmp-adaptiveform-scribble__container').should('not.be.visible');
            cy.get('.cmp-adaptiveform-scribble__canvas-signed-image').should('have.attr', 'src').and('not.be.empty');
            cy.get('@consoleError').should('not.have.been.called');
        });
    });

    it('should have 2 attachments with correct data prefix in getFormDataObject', () => {
        const ssPagePath = 'content/forms/af/core-components-it/samples/scribble/ss.html';
        cy.previewForm(ssPagePath).then(formContainer => {
            cy.get('.cmp-adaptiveform-scribble').each(($scribble) => {
                cy.wrap($scribble).within(() => {
                    cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').should('be.visible').click().then(() => {
                        cy.get('.cmp-adaptiveform-scribble__container').should('be.visible');
                        cy.get('.cmp-adaptiveform-scribble__control-text').should('be.visible').click().then(() => {
                            cy.get('.cmp-adaptiveform-scribble__save-button').should('be.visible').should('have.attr', 'disabled').then(() => {
                                cy.get('.cmp-adaptiveform-scribble__keyboard-sign-box').should('be.visible').type('test').then(() => {
                                    cy.get('.cmp-adaptiveform-scribble__save-button').should('be.enabled').click().then(() => {
                                        cy.get('.cmp-adaptiveform-scribble__container').should('not.be.visible');
                                        cy.get('.cmp-adaptiveform-scribble__canvas-signed-image').should('have.attr', 'title').and('not.be.empty');
                                        cy.get('.cmp-adaptiveform-scribble__canvas-signed-image').should('have.attr', 'alt').and('not.be.empty');
                                    });
                                });
                            });
                        });
                    });
                });
            }).then(() => {
                cy.window().then($window => {
                    if ($window.guideBridge && $window.guideBridge.isConnected()) {
                        return new Cypress.Promise((resolve) => {
                            $window.guideBridge.getFormDataObject({
                                success: function (dataObj) {
                                    let data = dataObj.data;
                                    expect(data).to.have.property('attachments');
                                    expect(data.attachments).to.have.length(2);
                                    data.attachments.forEach(att => {
                                        expect(att.data).to.match(/^data:image\/png;name=fd_type_signature\.png;base64/);
                                    });
                                    resolve();
                                }
                            });
                        });
                    }
                });
            });
        });
    });

});
