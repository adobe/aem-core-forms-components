describe("Forms In Sites Runtime Test", () => {
  const pagePath = "content/forms/sites/core-components-it/blank.html";

  let formContainer = null;

  beforeEach(() => {
    cy.previewForm(pagePath).then(p => {
      formContainer = p;
    })
  });

  it("should initialize form container", () => {
    expect(formContainer, "formcontainer is initialized").to.not.be.null;
    expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
    cy.get(`.cmp-adaptiveform-textinput`).find(`.cmp-adaptiveform-textinput__questionmark`).click();
    cy.get(`.cmp-adaptiveform-textinput`).find(`.cmp-adaptiveform-textinput__longdescription`)
    .should('contain.text', 'This is long description');
  })
})