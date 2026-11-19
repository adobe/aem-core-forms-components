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

    describe('scribble dialog modal behavior', () => {
        const openDialog = () => {
            cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').click();
            cy.get('.cmp-adaptiveform-scribble__container').should('be.visible');
        };

        it('should declare aria-modal on the dialog', () => {
            cy.get('.cmp-adaptiveform-scribble__container').should('have.attr', 'aria-modal', 'true');
        });

        it('should show a backdrop and make the rest of the page inert while open', () => {
            cy.get('.cmp-adaptiveform-scribble__backdrop').should('not.exist');
            openDialog();
            cy.get('.cmp-adaptiveform-scribble__backdrop').should('exist');
            cy.get('.cmp-adaptiveform-scribble__canvas-signed-container').should('have.attr', 'inert');
            cy.get('.cmp-adaptiveform-scribble__container').should('not.have.attr', 'inert');
            cy.get('.cmp-adaptiveform-scribble__container').parents().each(($el) => {
                expect($el[0].hasAttribute('inert'), 'ancestor is not inert').to.be.false;
            });
        });

        it('should remove backdrop and inert when closed with the close button', () => {
            openDialog();
            cy.get('.cmp-adaptiveform-scribble__close-button').click();
            cy.get('.cmp-adaptiveform-scribble__container').should('not.be.visible');
            cy.get('.cmp-adaptiveform-scribble__backdrop').should('not.exist');
            cy.get('[inert]').should('not.exist');
        });

        it('should remove backdrop and inert after saving a signature', () => {
            openDialog();
            cy.get('.cmp-adaptiveform-scribble__control-text').click();
            cy.get('.cmp-adaptiveform-scribble__keyboard-sign-box').type('test');
            cy.get('.cmp-adaptiveform-scribble__save-button').should('be.enabled').click();
            cy.get('.cmp-adaptiveform-scribble__container').should('not.be.visible');
            cy.get('.cmp-adaptiveform-scribble__backdrop').should('not.exist');
            cy.get('[inert]').should('not.exist');
        });

        it('should close on Escape and return focus to the trigger', () => {
            openDialog();
            cy.get('.cmp-adaptiveform-scribble__container').type('{esc}');
            cy.get('.cmp-adaptiveform-scribble__container').should('not.be.visible');
            cy.get('.cmp-adaptiveform-scribble__backdrop').should('not.exist');
            cy.get('[inert]').should('not.exist');
            cy.focused().should('have.class', 'cmp-adaptiveform-scribble__canvas-signed-container');
        });

        const getFocusable = ($container) => Cypress.$($container).find(
            'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
        ).filter(':visible');

        it('should keep focus inside the dialog when tabbing past the last control', () => {
            openDialog();
            cy.get('.cmp-adaptiveform-scribble__container').then(($container) => {
                const $focusable = getFocusable($container);
                const first = $focusable.first()[0];
                const last = $focusable.last()[0];
                cy.wrap(last).focus().trigger('keydown', { key: 'Tab', bubbles: true });
                cy.focused().should(($el) => expect($el[0]).to.equal(first));
            });
        });

        it('should keep focus inside the dialog when shift-tabbing past the first control', () => {
            openDialog();
            cy.get('.cmp-adaptiveform-scribble__container').then(($container) => {
                const $focusable = getFocusable($container);
                const first = $focusable.first()[0];
                const last = $focusable.last()[0];
                cy.wrap(first).focus().trigger('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
                cy.focused().should(($el) => expect($el[0]).to.equal(last));
            });
        });

        it('should be reopenable after closing', () => {
            openDialog();
            cy.get('.cmp-adaptiveform-scribble__close-button').click();
            openDialog();
            cy.get('.cmp-adaptiveform-scribble__backdrop').should('have.length', 1);
            cy.get('.cmp-adaptiveform-scribble__close-button').click();
            cy.get('[inert]').should('not.exist');
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
