/*
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2023 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */

describe('GuideBridge ', () => {

    before(() => {
        cy.attachConsoleErrorSpy();
    });

    const pagePath = "content/forms/af/core-components-it/samples/textinput/basic.html";
    let formContainer = null;

    /**
     * initialization of form container before every test
     * */
    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });


    Cypress.Commands.add('checkEventArguments', (spy, expectedObjectProps, ...expectedOtherArgs) => {
        const calledArgs = spy.args; // Get the arguments of the event call
        const actualObject = calledArgs.find(arg => typeof arg === 'object');
        const expectedObject = Cypress._.pick(actualObject, Object.keys(expectedObjectProps));
        expect(expectedObject).to.deep.equal(expectedObjectProps);
        const nonObjectCalledArgs = calledArgs.filter(arg => typeof arg !== 'object');
        expect(nonObjectCalledArgs).to.deep.include.members([...expectedOtherArgs]);
    });

    it('should trigger elementValueChanged and elementFocusChanged', () => {
        cy.window().then($window => {
            if($window.guideBridge && $window.guideBridge.isConnected()) {
                // Create a spy on the event
                const spy = cy.spy($window.guideBridge, 'trigger');
                // find textinput with name, textinput_18577078541690896990322
                const targetName = "textinput_18577078541690896990322";
                const textBox1FieldView = Object.values(formContainer._fields).find(obj => obj._model.name === targetName);
                const input = "test123";

                cy.get(`#${textBox1FieldView.id}`).find("input").clear().type(input).blur().then(x => {
                    // Assert that the function was called two times
                    cy.wrap(spy).should('have.callCount', 2);
                    // first check for focus change
                    let expectedArg1 = $window.FormView.Constants.ELEMENT_FOCUS_CHANGED;
                    let expectedArg2ObjectProps = {
                        fieldName: textBox1FieldView._model.name,
                        fieldId: textBox1FieldView.id
                    };
                    let expectedArg3 = textBox1FieldView._model.form.properties["fd:path"];
                    cy.checkEventArguments(spy.getCall(0), expectedArg2ObjectProps, expectedArg1, expectedArg3);
                    // then check for value change
                    expectedArg1 = $window.FormView.Constants.ELEMENT_VALUE_CHANGED;
                    let expectedArg2ValueObjectProps = {
                        ...expectedArg2ObjectProps,
                        newText: 'test123'
                    };
                    cy.checkEventArguments(spy.getCall(1), expectedArg2ValueObjectProps, expectedArg1, expectedArg3);

                });
            }
        })
        cy.expectNoConsoleErrors();
    })

    it('should test the resolveNode API for a specific field', () => {
        cy.window().then($window => {
            if($window.guideBridge && $window.guideBridge.isConnected()) {
                const targetName = "textinput_18577078541690896990322";
                const textBox1FieldView = Object.values(formContainer._fields).find(obj => obj._model.name === targetName);
                const qualifiedName = textBox1FieldView._model.qualifiedName;
                expect($window.guideBridge.resolveNode(qualifiedName)).to.deep.equal(textBox1FieldView._model);
            }
        });
        cy.expectNoConsoleErrors();
    })

    it('should unload the adaptive form and clean up state', () => {
        cy.window().then($window => {
            if($window.guideBridge && $window.guideBridge.isConnected()) {
                const formContainerPath = formContainer.getPath();
                const containerSelector = '[data-cmp-is="adaptiveFormContainer"]';
                
                // Verify form is loaded and connected
                expect($window.guideBridge.isConnected()).to.be.true;
                expect($window.guideBridge.getFormModel()).to.not.be.null;
                
                // Verify MutationObservers exist before unload
                const mutationObserversBeforeUnload = formContainer._mutationObservers;
                expect(mutationObserversBeforeUnload).to.be.an('array');
                const hasObservers = mutationObserversBeforeUnload.length > 0;
                
                // Create some mock widget elements in body to test cleanup
                const mockRecaptchaWidget = $window.document.createElement('div');
                mockRecaptchaWidget.className = 'cmp-adaptiveform-recaptcha__widget';
                $window.document.body.appendChild(mockRecaptchaWidget);
                
                const mockDatePickerWidget = $window.document.createElement('div');
                mockDatePickerWidget.className = 'datetimepicker datePickerTarget';
                $window.document.body.appendChild(mockDatePickerWidget);
                
                // Set up some cache to test cleanup
                if ($window.afCache) {
                    $window.afCache.store = { testKey: 'testValue' };
                }
                
                // Verify DOM elements exist before unload
                const formContainerEl = $window.document.querySelector(containerSelector);
                expect(formContainerEl).to.not.be.null;
                expect(formContainerEl.children.length).to.be.greaterThan(0);
                expect($window.document.querySelector('.cmp-adaptiveform-recaptcha__widget')).to.not.be.null;
                expect($window.document.querySelector('.datetimepicker.datePickerTarget')).to.not.be.null;
                
                // Call unloadAdaptiveForm with just the path
                $window.guideBridge.unloadAdaptiveForm(formContainerPath);
                
                // Verify container is completely removed from DOM
                expect($window.document.querySelector(containerSelector)).to.be.null;
                
                // Verify widget elements are removed from body
                expect($window.document.querySelector('.cmp-adaptiveform-recaptcha__widget')).to.be.null;
                expect($window.document.querySelector('.datetimepicker.datePickerTarget')).to.be.null;
                
                // Verify cache is cleared
                if ($window.afCache) {
                    expect($window.afCache.store).to.deep.equal({});
                }
                
                // Verify MutationObservers are disconnected and cleared
                if (hasObservers) {
                    expect(formContainer._mutationObservers).to.be.an('array');
                    expect(formContainer._mutationObservers.length).to.equal(0);
                }
                
                // Verify form model is no longer available for the unloaded path
                expect($window.guideBridge.getFormModel()).to.be.null;
            }
        });
        cy.expectNoConsoleErrors();
    })

    it('should handle multiple calls to unloadAdaptiveForm safely', () => {
        cy.window().then($window => {
            if($window.guideBridge && $window.guideBridge.isConnected()) {
                const formContainerPath = formContainer.getPath();
                
                // First call
                $window.guideBridge.unloadAdaptiveForm(formContainerPath);
                
                // Second call should not throw errors
                expect(() => {
                    $window.guideBridge.unloadAdaptiveForm(formContainerPath);
                }).to.not.throw();
                
                // Verify no console errors
                cy.expectNoConsoleErrors();
            }
        });
    })

    it('should auto-deduce form when path not provided', () => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
            cy.window().then($window => {
                if($window.guideBridge && $window.guideBridge.isConnected()) {
                    const containerSelector = '[data-cmp-is="adaptiveFormContainer"]';
                    const formContainerEl = $window.document.querySelector(containerSelector);
                    
                    // Call without any parameters - should auto-find and clean current form
                    $window.guideBridge.unloadAdaptiveForm();
                    
                    // Verify container is completely removed from DOM
                    expect($window.document.querySelector(containerSelector)).to.be.null;
                    
                    // Verify form is disconnected
                    expect($window.guideBridge.isConnected()).to.be.false;
                }
            });
            cy.expectNoConsoleErrors();
        });
    })

    it('should warn when unloadAdaptiveForm is called without a valid form path', () => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
            cy.window().then($window => {
                if($window.guideBridge && $window.guideBridge.isConnected()) {
                    const formContainerPath = formContainer.getPath();
                    
                    // First unload the form to clear the internal formContainerPath
                    $window.guideBridge.unloadAdaptiveForm(formContainerPath);
                    
                    // Now guideBridge has no formContainerPath set
                    expect($window.guideBridge.isConnected()).to.be.false;
                    
                    // Spy on console.warn to capture the warning
                    let warningMessage = null;
                    const originalWarn = $window.console.warn;
                    $window.console.warn = function(msg) {
                        warningMessage = msg;
                        originalWarn.apply($window.console, arguments);
                    };
                    
                    // Call unloadAdaptiveForm again without any form path available
                    $window.guideBridge.unloadAdaptiveForm();
                    
                    // Restore original warn
                    $window.console.warn = originalWarn;
                    
                    // Verify warning was logged
                    expect(warningMessage).to.equal('No form container path specified or available to unload.');
                }
            });
        });
    })
})
