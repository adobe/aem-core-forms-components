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