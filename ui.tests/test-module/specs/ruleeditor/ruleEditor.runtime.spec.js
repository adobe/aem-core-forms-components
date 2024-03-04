describe('Rule editor sanity for core-components',function(){
    const formPath = "/content/forms/af/core-components-it/samples/ruleeditor/basic.html";
    let formContainer = null;

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

    /**
     * Runetime ruleSanity for button to change label of textbox
     * [when button is clicked the textbox field label should change using custom function]
     */
    if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-11541")) {
        it("should change textinput label on button click", () => {
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            cy.get(`.cmp-adaptiveform-button__widget`).click()
            const [textbox1, textBox1FieldView] = Object.entries(formContainer._fields)[0];
            cy.get(`#${textbox1}`).find("div > label").should('have.value', "Changed Label")
        })
    }
})
