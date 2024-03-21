describe('Rule editor runtime sanity for core-components',function(){
    const formPath = "/content/forms/af/core-components-it/samples/ruleeditor/basic.html";
    let formContainer = null;
    let toggle_array = [];

    /**
     * initialization of form container before every test
     * */
    beforeEach(() => {
        cy.previewForm(formPath).then(p => {
            formContainer = p;
        });
        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
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
    if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-11541")) {
        it("should change textinput label on button click", () => {
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            cy.get(`.cmp-adaptiveform-button__widget`).click()
            const [textbox1, textBox1FieldView] = Object.entries(formContainer._fields)[0];
            cy.get(`#${textbox1}`).find("div > label").should('have.text', "Changed Label")
        })
    }
})
