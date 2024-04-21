describe('Rule editor runtime sanity for core-components',function(){
    const formPath = "/content/forms/af/core-components-it/samples/ruleeditor/basic.html";
    let formContainer = null;
    let toggle_array = [];

    before(() => {
        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
    });

    /**
     * initialization of form container before every test
     * */
    beforeEach(() => {
        cy.previewForm(formPath).then(p => {
            formContainer = p;
        });
    });

    if (cy.af.isLatestAddon()) {
        it("should have merged custom function list registered in FunctionRuntime from both clientlibs", () => {
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            let func;
            cy.window().then(win => {
                func = win.FormView.FunctionRuntime.customFunctions.testFunction1; // from corecomponent.it.customfunction
                expect(func).to.not.be.null;
                expect(func).to.not.be.undefined;

                func = win.FormView.FunctionRuntime.customFunctions.testSubmitFormPreprocessor; // from corecomponent.it.customfunction
                expect(func).to.not.be.null;
                expect(func).to.not.be.undefined;

                func = win.FormView.FunctionRuntime.customFunctions.testSetProperty; // from corecomponent.it.customfunction2
                expect(func).to.not.be.null;
                expect(func).to.not.be.undefined;
            })
        })
    }

    /**
     * Runtime ruleSanity for button to change label of textbox
     * [when button is clicked the textbox field label should change using custom function]
     */
    it("should change textinput label on button click", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-11541")) {
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            cy.get(`.cmp-adaptiveform-button__widget`).click()
            const [textbox1, textBox1FieldView] = Object.entries(formContainer._fields)[0];
            cy.get(`#${textbox1}`).find("div > label").should('have.text', "Changed Label")
        }
    })
})

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
        if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-13209")) {
            cy.previewForm(submitDefaultSuccessHandler);
            cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                cy.get('body').should('contain', "Thank you for submitting the form.\n")
            });
        }
    });

    it("Custom submitSuccess handler should handle successful form submission", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-13209")) {
            cy.previewForm(submitCustomSuccessHandler);
            cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                cy.get('.modal .success-message').should('contain', "Thank you for submitting the form.")
            });
        }
    });

    it("Hardcoded submitError handler should handle form submission error", () => {
        cy.previewForm(submitErrorHardcodedHandler);
        let alertFired = false;
        cy.on('window:alert', (message) => {
            expect(message).to.equal('Encountered an internal error while submitting the form.');
            alertFired = true;
        });

        cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
            // Confirm the alert was called
            expect(alertFired).to.be.true;
        });
    });

    it("Default submitError handler should handle form submission error", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-13209")) {
            cy.previewForm(submitDefaultErrorHandler);
            let alertFired = false;
            cy.on('window:alert', (message) => {
                expect(message).to.equal('Form submission failed!');
                alertFired = true;
            });

            cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                expect(alertFired).to.be.true;
            });
        }
    });

    it("Custom submitError handler should handle form submission error", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-13209")) {
            cy.previewForm(submitCustomErrorHandler);
            let alertFired = false;
            cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                cy.get('.modal .error-message').should('contain', "Custom Form submission failed!")
            });
        }
    });
})
