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

    if (cy.af.isLatestAddon()) {
        it("should validate start and end date", () => {
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            console.log(formContainer._fields);
            const [startDate, startDateFieldView] = Object.entries(formContainer._fields)[0];
            cy.get(`#${startDate}`).find("input").clear().type(getCurrentDateOffsetBy(-1)).blur().then(x => {
                const startDateModel = formContainer._model.getElement(startDate);
                expect(startDateModel.getState().valid).to.equal(true);
            });
            const [endDate, endDateFieldView] = Object.entries(formContainer._fields)[1];
            cy.get(`#${endDate}`).find("input").clear().type(getCurrentDateOffsetBy(+1)).blur().then(x => {
                const endDateModel = formContainer._model.getElement(endDate);
                expect(endDateModel.getState().valid).to.equal(true);
            });

            //invalid start value
            cy.get(`#${startDate}`).find("input").clear().type(getCurrentDateOffsetBy(+1)).blur().then(x => {
                const startDateModel = formContainer._model.getElement(startDate);
                expect(startDateModel.getState().valid).to.equal(false);
            });
        })
    }

    function getCurrentDateOffsetBy(days) {
        const today = new Date();
        today.setDate(today.getDate() + days);

        const day = String(today.getDate()).padStart(2, '0'); // Get day and pad with leading zero if necessary
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Get month (0-based index) and pad with leading zero if necessary
        const year = today.getFullYear(); // Get full year

        return `${year}-${month}-${day}`; // Format the date as yyyy-mm-dd
    }

    /**
     * Runtime ruleSanity for button to change label of textbox
     * [when button is clicked the textbox field label should change using custom function]
     */
    it("should change textinput label on button click", () => {
        if (toggle_array.includes("FT_FORMS-11541")) {
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            cy.get(`.cmp-adaptiveform-button__widget`).click()
            const [textbox1, textBox1FieldView] = Object.entries(formContainer._fields)[2];
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
        if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-13209")) {
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
        if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-13209")) {
            cy.previewForm(submitCustomErrorHandler);
            let alertFired = false;
            cy.get(`.cmp-adaptiveform-button__widget`).click().then(x => {
                cy.get('.modal .error-message').should('contain', "Custom Form submission failed!")
            });
        }
    });
})

describe("Rule editor save handler runtime", () => {

    let toggle_array = [];

    before(() => {
        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
    });

    const saveRunTime = "content/forms/af/core-components-it/samples/ruleeditor/save/saveruntime.html"

    it("should save formData on button click", () => {
        if (toggle_array.includes("FT_FORMS-11581")) {

            const saveApiResponse = {
                'draftId': 'ABC'
            };
            // Rule when button is clicked then save call should trigger
            cy.intercept('POST' , '**/adobe/forms/af/save/*', saveApiResponse).as('afSave');

            cy.previewForm(saveRunTime);

            cy.get(`.cmp-adaptiveform-button__widget`).click();

            cy.wait('@afSave').then(({request, response}) => {
                // Check the request payload
                expect(request.body).to.be.not.null;

                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.not.null;
                expect(response.body.draftId).to.equal('ABC');
            });
        }
    })
})


describe('Rule editor properties on form initialize test', () => {
    const pagePath = "content/forms/af/core-components-it/samples/ruleeditor/set_property_test.html"
    let formContainer = null;

    before(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    it("Check properties are properly set on form initialize", () => {
        const [checkBoxId, checkBoxFieldView] = Object.entries(formContainer._fields)[0]
        const [fileInputId, fileInputView] = Object.entries(formContainer._fields)[1]

        const checkProperties = (id, bemBlock, labelSelector, expectedLabel, expectedDescription) => {
            cy.get(`#${id}`).invoke('attr', 'data-cmp-required').should('eq', 'true');
            cy.get(`#${id} ${labelSelector}`)
            .should('have.text', expectedLabel);
            // cy.get(`#${id}__longdescription p`)
            // .should('have.text', expectedDescription);

            cy.get(`#${id}`).find(`.${bemBlock}__questionmark`).click();
            // long description should be shown
            cy.get(`#${id}`).find(`.${bemBlock}__longdescription`).invoke('attr', 'data-cmp-visible')
            .should('not.exist');
            cy.get(`#${id}`).find(`.${bemBlock}__longdescription`)
            .should('contain.text', expectedDescription);
        }
        checkProperties(checkBoxId, 'cmp-adaptiveform-checkboxgroup', '.cmp-adaptiveform-checkboxgroup__label', 'Updated CheckBox', 'This is a long description of checkboxgroup');
        checkProperties(fileInputId, 'cmp-adaptiveform-fileinput', '.cmp-adaptiveform-fileinput__label', 'Updated File Input Label', 'File Input Description');
    });
})
