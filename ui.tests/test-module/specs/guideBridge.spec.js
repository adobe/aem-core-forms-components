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
                const [textbox1, textBox1FieldView] = Object.entries(formContainer._fields)[0];
                const [textbox2, textbox2FieldView] = Object.entries(formContainer._fields)[1];
                const [textbox3, textbox3FieldView] = Object.entries(formContainer._fields)[2];
                const input = "test123";

                cy.get(`#${textbox1}`).find("input").clear().type(input).blur().then(x => {
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
})
