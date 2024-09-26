/*******************************************************************************
 * Copyright 2022 Adobe
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
describe("Form Runtime with Custom Text Input", () => {

  before(() => {

  });

  const pagePath = "content/forms/af/core-components-it/samples/textinput/custom_text_input_repeatability.html"
  const bemBlock = 'cmp-adaptiveform-textinput'
  const IS = "adaptiveFormTextInput"
  const selectors = {
    textinput : `[data-cmp-is="${IS}"]`
  }

  let formContainer = null
  let toggle_array = [];

  beforeEach(() => {
    cy.previewForm(pagePath).then(p => {
      formContainer = p;
    })
    cy.fetchFeatureToggles().then((response) => {
      if (response.status === 200) {
        toggle_array = response.body.enabled;
      }
    });
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

  it(" model's changes are reflected in the html ", () => {
    const [id, fieldView] = Object.entries(formContainer._fields)[0]
    const model = formContainer._model.getElement(id)
    model.value = "some other value"
    checkHTML(model.id, model.getState()).then(() => {
      model.visible = false
      return checkHTML(model.id, model.getState())
    }).then(() => {
      model.enabled = false
      return checkHTML(model.id, model.getState())
    })

  });


  it("should show different default error messages on different constraints only on click of submit button", () => {
    expect(formContainer, "formcontainer is initialized").to.not.be.null;
    const [textbox1, textBox1FieldView] = Object.entries(formContainer._fields)[0];
    const [textbox2, textBox2FieldView] = Object.entries(formContainer._fields)[1]
    const [submitButton, fieldView] = Object.entries(formContainer._fields)[5];
    // Required field should not show error on blur due to custom text field
    cy.get(`#${textbox1}`).find("input").focus().clear().type("abc").blur().then(x => {
      cy.get(`#${textbox1}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"")
    })
    cy.get(`#${textbox2}`).find("input").focus().clear().type("abc").blur().then(x => {
      cy.get(`#${textbox2}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"")
    })

    cy.get(`#${submitButton}-widget`).click();

    cy.get(`#${textbox1}`).find("input").focus().clear().blur().then(x => {
      cy.get(`#${textbox1}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"this is required")
    })

    cy.get(`#${textbox2}`).find("input").focus().clear().blur().then(x => {
      cy.get(`#${textbox2}`).find(".cmp-adaptiveform-textinput__errormessage").should('have.text',"this is required")
    })
  })

})
