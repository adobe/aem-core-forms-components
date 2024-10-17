describe("Auto save handler runtime", () => {

    let toggle_array = [];

    before(() => {
        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
    });

    const autoSaveRunTime = "content/forms/af/core-components-it/samples/autosave.html"

    it("should save formData after every 3 seconds", () => {
        if (cy.af.isLatestAddon() && toggle_array.includes('FT_FORMS-14255')) {
            const saveApiResponse = {
                'draftId': 'ABC'
            };

            const stub = cy.stub();
            cy.on('window:alert', stub);
            // Rule when button is clicked then save call should trigger
            cy.intercept('POST' , '**/adobe/forms/af/save/*', saveApiResponse).as('afSave');

            cy.previewForm(autoSaveRunTime);

            cy.wait('@afSave').then(({request, response}) => {
                // Check the request payload
                expect(stub.getCall(0)).to.be.calledWith('The draft is saved successfully.');
                expect(request.body).to.be.not.null;

                expect(response.statusCode).to.equal(200);
                expect(response.body).to.be.not.null;
                expect(response.body.draftId).to.equal('ABC');
            });
        }
    })
})
