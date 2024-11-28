describe("Rule editor navigate in panel runtime", () => {
    let toggle_array = [];
    before(() => {
        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
    });

    const formsPage = "content/forms/af/core-components-it/samples/ruleeditor/navigate-in-panel/basic.html"
    let formContainer = null;

    it("should navigate to next item in panel", () => {
        if(toggle_array.includes("FT_FORMS-10781")) {
            cy.previewForm(formsPage);
            cy.get('#textinput-b1a2a445a1-widget').click();
            cy.get('#button-46e2481a3f-widget > .cmp-adaptiveform-button__text').click();
            cy.get('#button-46e2481a3f-widget > .cmp-adaptiveform-button__text').click();

            cy.focused().should('have.attr', 'id', 'textinput-4ab644c5b9-widget');
        }
    });

    it("should navigate to previous item in panel", () => {
        if(toggle_array.includes("FT_FORMS-10781")) {
            cy.previewForm(formsPage);
            cy.get('#textinput-4ab644c5b9-widget').click();
            cy.get('#button-56f02db62a-widget > .cmp-adaptiveform-button__text').click();
            cy.get('#button-56f02db62a-widget > .cmp-adaptiveform-button__text').click();

            cy.focused().should('have.attr', 'id', 'textinput-b1a2a445a1-widget');
        }
    });

    it("should navigate to next panel in wizard", () => {
        if(toggle_array.includes("FT_FORMS-10781")) {
            cy.previewForm(formsPage);
            cy.get('#textinput-e2985267ed-widget').click();
            cy.get('#button-aae7ec869b-widget > .cmp-adaptiveform-button__text').click();
            cy.get('#button-aae7ec869b-widget > .cmp-adaptiveform-button__text').click();

            cy.focused().should('have.attr', 'id', 'textinput-adb1f55685-widget');
        }
    });

    it("should navigate to previous panel in wizard", () => {
        if(toggle_array.includes("FT_FORMS-10781")) {
            cy.previewForm(formsPage);
            cy.get('#textinput-e2985267ed-widget').click();
            cy.get('#button-aae7ec869b-widget > .cmp-adaptiveform-button__text').click();
            cy.get('#button-aae7ec869b-widget > .cmp-adaptiveform-button__text').click();
            cy.get('#button-eb427c0e82-widget > .cmp-adaptiveform-button__text').click();
            cy.get('#button-eb427c0e82-widget > .cmp-adaptiveform-button__text').click();

            cy.focused().should('have.attr', 'id', 'textinput-e2985267ed-widget');
        }
    });

    it("should navigate to next panel in HorizontalTabs", () => {
        if(toggle_array.includes("FT_FORMS-10781")) {
            cy.previewForm(formsPage);
            cy.get('#textinput-cc08c3e84a-widget').click();
            cy.get('#button-4e44ce2042-widget > .cmp-adaptiveform-button__text').click();
            cy.get('#button-4e44ce2042-widget > .cmp-adaptiveform-button__text').click();

            cy.focused().should('have.attr', 'id', 'textinput-77fa9bd1dc-widget');
        }
    });

    it("should navigate to previous panel in HorizontalTabs", () => {
        if(toggle_array.includes("FT_FORMS-10781")) {
            cy.previewForm(formsPage);
            cy.get('#textinput-cc08c3e84a-widget').click();
            cy.get('#button-4e44ce2042-widget > .cmp-adaptiveform-button__text').click();
            cy.get('#button-4e44ce2042-widget > .cmp-adaptiveform-button__text').click();
            cy.get('#button-e75d381952-widget > .cmp-adaptiveform-button__text').click();
            cy.get('#button-e75d381952-widget > .cmp-adaptiveform-button__text').click();

            cy.focused().should('have.attr', 'id', 'textinput-cc08c3e84a-widget');
        }
    });

    it("should navigate to next panel in VerticalTabs", () => {
        if(toggle_array.includes("FT_FORMS-10781")) {
            cy.previewForm(formsPage);
            cy.get('#textinput-802818ca90-widget').click();
            cy.get('#button-ff091257b7-widget > .cmp-adaptiveform-button__text').click();
            cy.get('#button-ff091257b7-widget > .cmp-adaptiveform-button__text').click();

            cy.focused().should('have.attr', 'id', 'textinput-d227c4c481-widget');
        }
    });

    it("should navigate to previous panel in VerticalTabs", () => {
        if(toggle_array.includes("FT_FORMS-10781")) {
            cy.previewForm(formsPage);
            cy.get('#textinput-802818ca90-widget').click();
            cy.get('#button-ff091257b7-widget > .cmp-adaptiveform-button__text').click();
            cy.get('#button-ff091257b7-widget > .cmp-adaptiveform-button__text').click();
            cy.get('#button-2c88dbcca7-widget > .cmp-adaptiveform-button__text').click();
            cy.get('#button-2c88dbcca7-widget > .cmp-adaptiveform-button__text').click();

            cy.focused().should('have.attr', 'id', 'textinput-802818ca90-widget');
        }
    });
})
