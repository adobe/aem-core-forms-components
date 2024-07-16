


describe("Form Runtime with Fragment", () => {
const pagePath = "content/forms/af/core-components-it/samples/formcontainer/basic.html"
const bemBlock = 'cmp-adaptiveform-fragment'
const IS = "adaptiveFormFragment"
const selectors = {
    textinput : `[data-cmp-is="${IS}"]`
}
let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    const checkHTML = (id, state) => {
        const visible = state.visible;
        const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
        const passDisabledAttributeCheck = `${state.enabled === false ? "" : "not."}have.attr`;
        const value = state.value == null ? '' : state.value;
        cy.get(`#${id}`)
            .should(passVisibleCheck)
            .invoke('attr', 'data-cmp-visible')
            .should('eq', visible.toString());
        cy.get(`#${id}`)
            .invoke('attr', 'data-cmp-enabled')
            .should('eq', state.enabled.toString());
        return cy.get(`#${id}`).within((root) => {
            cy.get('*').should(passVisibleCheck)
            cy.get('input')
                .should(passDisabledAttributeCheck, 'disabled');
            cy.get('input').should('have.value', value)
        })
    }

    const checkInstanceHTML = (instanceManager, count) => {
        expect(instanceManager.children.length, " instance manager view has children equal to count ").to.equal(count);
        expect(instanceManager.getModel().items.length, " instance manager model has items equal to count ").to.equal(count);
        const checkChild = (childView) => {
            checkHTML(childView.getId(), childView.getModel(), childView);
        }
        instanceManager.children.forEach(checkChild);
        return cy.get('[data-cmp-is="adaptiveFormContainer"]');
    };

    it(" should get model and view initialized properly ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;

        // const fields = formContainer.getAllFields();
        // const fragmentId = formContainer._model.items[0].items[0].id;
        // const textInputId = formContainer._model.items[0].items[0].items[0].id;
        // const fragmentView = fields[fragmentId];
        // const textInputView = fields[textInputId];

        // expect(fragmentView, "fragment view is created").to.not.be.null;
        // expect(textInputView, "fragment child view is created").to.not.be.null;
        // expect(fragmentView.children.length, `fragment has ${fragmentChildCount} child`).to.equal(fragmentChildCount);
        // expect(fragmentView.children[0].id, "fragment has reference to child view").to.equal(textInputId);
        // expect(textInputView.parentView.id, "text input has reference to parent panel view").to.equal(fragmentId);

        // Object.entries(formContainer._fields).forEach(([id, field]) => {
        //     expect(field.getId()).to.equal(id)
        //     expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
        // });
    })

})

