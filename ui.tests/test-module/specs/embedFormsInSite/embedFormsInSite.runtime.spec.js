/*******************************************************************************
 * Copyright 2023 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
describe("Embed multiple form in site", () => {

  context('Forms inside site', function () {

    before(() => {
      cy.attachConsoleErrorSpy();
    });

    const pagePath = "/content/forms/sites/core-components-it/aemembedmutipleform.html";
    let formContainer = [];

    beforeEach(function () {
        cy.previewForm(pagePath, {multipleContainers: true}).then(p => {
            formContainer = p;
        })
    })

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

    it("should render three form", () => {
      expect(formContainer.length).to.equal(3);
    });

    it("form 1 model initialized properly", () => {
        expect(formContainer[0], "formcontainer is initialized").to.not.be.null;
        expect(Object.keys(formContainer[0]._fields).length).to.equal(11);
    });

    it("form 2 model initialized properly", () => {
      expect(formContainer[1], "formcontainer is initialized").to.not.be.null;
      expect(Object.keys(formContainer[1]._fields).length).to.equal(4);
    });

    it(" model's changes are reflected in the html  for form1", () => {
      const [id, fieldView] = Object.entries(formContainer[0]._fields)[0]
      const model = formContainer[0]._model.getElement(id)
      model.value = "some other value"
      checkHTML(model.id, model.getState()).then(() => {
          model.visible = false
          return checkHTML(model.id, model.getState())
      }).then(() => {
          model.enabled = false
          return checkHTML(model.id, model.getState())
      })
      cy.expectNoConsoleErrors();
    });

    it(" model's changes are reflected in the html for form 2", () => {
      const [id, fieldView] = Object.entries(formContainer[1]._fields)[0]
      const model = formContainer[1]._model.getElement(id)
      model.value = "some other value"
      checkHTML(model.id, model.getState()).then(() => {
          model.visible = false
          return checkHTML(model.id, model.getState())
      }).then(() => {
          model.enabled = false
          return checkHTML(model.id, model.getState())
      })
  });

  it("testing add/remove instance for wizard", () => {
    cy.get(".cmp-adaptiveform-wizard__tab").should('have.length', 4);
    cy.get(".cmp-adaptiveform-wizard__wizardpanel").should('have.length', 4);
    cy.get("button").contains("+R1").click().then(() => {
        cy.get(".cmp-adaptiveform-wizard__tab").should('have.length', 5);
        cy.get(".cmp-adaptiveform-wizard__wizardpanel").should('have.length', 5);
        cy.get("button").contains("-R1").click().then(() => {
            cy.get(".cmp-adaptiveform-wizard__tab").should('have.length', 4);
            cy.get(".cmp-adaptiveform-wizard__wizardpanel").should('have.length', 4);
            cy.get("button").contains("-R1").click().then(() => {
                cy.get(".cmp-adaptiveform-wizard__tab").should('have.length', 3);
                cy.get(".cmp-adaptiveform-wizard__wizardpanel").should('have.length', 3);
            })
        })
    })
    cy.expectNoConsoleErrors();
  })

})
})