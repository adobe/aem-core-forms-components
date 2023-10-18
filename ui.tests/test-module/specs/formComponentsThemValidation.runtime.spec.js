describe('Components - Authoring', function () {

    const pagePath = "content/forms/af/core-components-it/samples/v2-components.html";

    /**
     * initialization of form container before test
     * */
    before(() => {
        cy.previewForm(pagePath);
    });

    it('Verifying Components themes in Preview', function () {
        cy.get("div[class='cmp cmp-adaptiveform-container']").should("be.visible");
        const retryOptions = {
            limit: 5, // max number of retries
            delay: 500 // delay before next iteration, ms
        }
        cy.compareSnapshot("Visual testing V2 Components", 0, retryOptions);

    });

});