describe("Rule editor submission handler runtime", () => {
    let toggle_array = [];

    before(() => {
        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
    });
    const submitSuccessHardcodedHandler = "content/forms/af/core-components-it/samples/ruleeditor/submit/submitsuccesshardcodedhandler.html"
    const submitErrorHardcodedHandler = "content/forms/af/core-components-it/samples/ruleeditor/submit/submiterrorhardcodedhandler.html"
    const submitDefaultSuccessHandler = "content/forms/af/core-components-it/samples/ruleeditor/submit/submitdefaultsuccesshandler.html"
    const submitDefaultErrorHandler = "content/forms/af/core-components-it/samples/ruleeditor/submit/submitdefaulterrorhandler.html"
    const submitCustomSuccessHandler = "content/forms/af/core-components-it/samples/ruleeditor/submit/submitcustomsuccesshandler.html"
    const submitCustomErrorHandler = "content/forms/af/core-components-it/samples/ruleeditor/submit/submitcustomerrorhandler.html"
    const bemBlock = 'cmp-button'
    const IS = "adaptiveFormButton"
    const selectors = {
        submit: `[data-cmp-is="${IS}"]`
    }

    let formContainer = null;

    it("Hardcoded submitSuccess handler should handle successful form submission", () => {
        cy.previewForm(submitSuccessHardcodedHandler);
        cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
            cy.get('body').should('contain', "Thank you for submitting the form.\n")
        });
    });

    it("Default submitSuccess handler should handle successful form submission", () => {
        if (toggle_array.includes("FT_FORMS-13209")) {
            cy.previewForm(submitDefaultSuccessHandler);
            cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                cy.get('body').should('contain', "Thank you for submitting the form.\n")
            });
        }
    });

    it("Custom submitSuccess handler should handle successful form submission", () => {
        if (toggle_array.includes("FT_FORMS-13209")) {
            cy.previewForm(submitCustomSuccessHandler);
            cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                cy.get('.modal .success-message').should('contain', "Thank you for submitting the form.")
            });
        }
    });

    it("Hardcoded submitError handler should handle form submission error", () => {
        cy.previewForm(submitErrorHardcodedHandler);

        cy.window().then(win => {
            let alertFired = false;

            // Stub the window alert to capture the alert message and set alertFired to true
            cy.stub(win, 'alert').callsFake((message) => {
                expect(message).to.equal('Encountered an internal error while submitting the form.');
                alertFired = true;
            });

            // Click the submit button
            cy.get('.cmp-adaptiveform-button__widget').click().then(() => {
                // Use cy.wrap to ensure Cypress waits for the promise to resolve
                cy.wrap(null).should(() => {
                    expect(alertFired).to.be.true;
                });
            });
        });
    });


    it("Default submitError handler should handle form submission error", () => {
        if (toggle_array.includes("FT_FORMS-13209")) {
            cy.previewForm(submitDefaultErrorHandler);

            cy.window().then(win => {
                let alertFired = false;

                // Stub the window alert to capture the alert message and set alertFired to true
                cy.stub(win, 'alert').callsFake((message) => {
                    expect(message).to.equal('Form submission failed!');
                    alertFired = true;
                });

                // Click the submit button
                cy.get('.cmp-adaptiveform-button__widget').click().then(() => {
                    // Use cy.wrap to ensure Cypress waits for the promise to resolve
                    cy.wrap(null).should(() => {
                        expect(alertFired).to.be.true;
                    });
                });
            });
        }
    });

    it("Custom submitError handler should handle form submission error", () => {
        if (toggle_array.includes("FT_FORMS-13209")) {
            cy.previewForm(submitCustomErrorHandler);
            let alertFired = false;
            cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                cy.get('.modal .error-message').should('contain', "Custom Form submission failed!")
            });
        }
    });
})