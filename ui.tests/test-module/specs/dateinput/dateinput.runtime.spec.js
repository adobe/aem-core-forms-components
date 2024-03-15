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
describe("Form Runtime with Date Input", () => {
  const pagePath =
    "content/forms/af/core-components-it/samples/dateinput/basic.html";
  const bemBlock = "cmp-adaptiveform-dateinput";

  let formContainer = null;

  beforeEach(() => {
    cy.previewForm(pagePath).then((p) => {
      formContainer = p;
    });
  });

  const checkHTML = (id, state, displayValue) => {
    const dateArray =
      state.value != null ? state.value.split("-") : ["", "", ""];
    // const dateArray = state.value.split("/");

    const visible = state.visible;
    const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
    const passDisabledAttributeCheck = `${
      state.enabled === false ? "" : "not."
    }have.attr`;
    const passReadOnlyAttributeCheck = `${
      state.readOnly === true ? "" : "not."
    }have.attr`;
    const value1 = dateArray[0] == null ? "" : dateArray[0];
    const value2 = dateArray[1] == null ? "" : dateArray[1];
    const value3 = dateArray[2] == null ? "" : dateArray[2];
    const value = state.value == null ? "" : state.value;
    cy.get(`#${id}`)
      .should(passVisibleCheck)
      .invoke("attr", "data-cmp-visible")
      .should("eq", visible.toString());
    cy.get(`#${id}`)
      .invoke("attr", "data-cmp-enabled")
      .should("eq", state.enabled.toString());

    cy.log(cy.get("input"));
    return cy.get(`#${id}`).within((root) => {
      cy.get("*").should(passVisibleCheck);

      cy.get("input").should(passDisabledAttributeCheck, "disabled");
      cy.get("input").should(passReadOnlyAttributeCheck, "readonly");
      //cy.get("input").eq(1).should("have.value", value);
      cy.get('.cmp-adaptiveform-dateinputField__widget[name="Year"]').should(
        "have.value",
        value1
      );
      cy.get('.cmp-adaptiveform-dateinputField__widget[name="Month"]').should(
        "have.value",
        value2
      );
      cy.get('.cmp-adaptiveform-dateinputField__widget[name="Day"]').should(
        "have.value",
        value3
      );
    });
  };
  it("should toggle description and tooltip", () => {
    cy.toggleDescriptionTooltip(bemBlock, "tooltip_scenario_test");
  });
  it(" should get model and view initialized properly ", () => {
    expect(formContainer, "formcontainer is initialized").to.not.be.null;
    expect(
      formContainer._model.items.length,
      "model and view elements match"
    ).to.equal(Object.keys(formContainer._fields).length);
    Object.entries(formContainer._fields).forEach(([id, field]) => {
      expect(field.getId()).to.equal(id);
      expect(
        formContainer._model.getElement(id),
        `model and view are in sync`
      ).to.equal(field.getModel());
      // if non submit field, check that all have error message in them
      if (id.indexOf("submit") === -1) {
        checkHTML(id, field.getModel().getState());
      }
    });
  });

  it(" model's changes are reflected in the html ", () => {
    const [id, fieldView] = Object.entries(formContainer._fields)[0];
    const model = formContainer._model.getElement(id);
    model.value = "2020-10-10";
    cy.log(model.id);
    checkHTML(model.id, model.getState())
      .then(() => {
        model.visible = false;
        return checkHTML(model.id, model.getState());
      })
      .then(() => {
        model.enabled = false;
        return checkHTML(model.id, model.getState());
      });
  });

  it(" html changes are reflected in model ", () => {
    const [id, fieldView] = Object.entries(formContainer._fields)[0];
    const model = formContainer._model.getElement(id);
    const input1 = "2020";
    const input2 = "10";
    cy.get(`#${id}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Year"]')
      .clear()
      .type(input1);
    cy.get(`#${id}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Month"]')
      .clear()
      .type(input2);
    cy.get(`#${id}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Day"]')
      .clear()
      .type(input2)
      .blur()
      .then((x) => {
        expect(model.getState().value).to.equal(
          input1 + "-" + input2 + "-" + input2
        );
      });
  });

  it("should show and hide components on certain date input", () => {
    // Rule on dateInput1: When input of dateInput1 is 2022-12-23 => Show dateinput3 and Hide dateInput4

    const [dateInput1, dateInput1FieldView] = Object.entries(
      formContainer._fields
    )[0];
    const [dateInput3, dateInput3FieldView] = Object.entries(
      formContainer._fields
    )[2];
    const [dateInput4, dateInput4FieldView] = Object.entries(
      formContainer._fields
    )[3];
    const input1 = "2022";
    const input2 = "12";
    const input3 = "23";

    cy.get(`#${dateInput1}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Year"]')
      .clear()
      .type(input1);
    cy.get(`#${dateInput1}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Month"]')
      .clear()
      .type(input2);
    cy.get(`#${dateInput1}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Day"]')
      .clear()
      .type(input3)
      .blur()
      .then((x) => {
        cy.get(`#${dateInput3}`).should("be.visible");
        cy.get(`#${dateInput4}`).should("not.be.visible");
      });
  });

  it("should enable and disable components on certain date input", () => {
    // Rule on dateInput1: When input of dateInput1 is 2023-01-01 => Enable dateinput2 and Disable dateInput4

    const [dateInput1, dateInput1FieldView] = Object.entries(
      formContainer._fields
    )[0];
    const [dateInput2, dateInput2FieldView] = Object.entries(
      formContainer._fields
    )[1];
    const [dateInput4, dateInput4FieldView] = Object.entries(
      formContainer._fields
    )[3];
    const input = "2023-01-01";

    const input1 = "2023";
    const input2 = "01";
    const input3 = "01";

    cy.get(`#${dateInput1}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Year"]')
      .clear()
      .type(input1);
    cy.get(`#${dateInput1}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Month"]')
      .clear()
      .type(input2);
    cy.get(`#${dateInput1}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Day"]')
      .clear()
      .type(input3)
      .blur()
      .then((x) => {
        cy.get(`#${dateInput2}`)
          .find('.cmp-adaptiveform-dateinputField__widget[name="Year"]')
          .should("be.enabled");
        cy.get(`#${dateInput2}`)
          .find('.cmp-adaptiveform-dateinputField__widget[name="Month"]')
          .should("be.enabled");
        cy.get(`#${dateInput2}`)
          .find('.cmp-adaptiveform-dateinputField__widget[name="Day"]')
          .should("be.enabled");
        cy.get(`#${dateInput4}`)
          .find('.cmp-adaptiveform-dateinputField__widget[name="Year"]')
          .should("not.be.enabled");
        cy.get(`#${dateInput4}`)
          .find('.cmp-adaptiveform-dateinputField__widget[name="Month"]')
          .should("not.be.enabled");
        cy.get(`#${dateInput4}`)
          .find('.cmp-adaptiveform-dateinputField__widget[name="Day"]')
          .should("not.be.enabled");
      });
  });

  it("should show validation error messages based on expression rules", () => {
    // Rule on dateInput4: Validate dateInput4 using Expression: dateInput4 === 2023-01-01

    const [dateInput4, dateInput1FieldView] = Object.entries(
      formContainer._fields
    )[3];
    const incorrectInput1 = "2023";
    const incorrectInput2 = "01";
    const incorrectInput3 = "02";
    const correctInput1 = "2023";
    const correctInput2 = "01";
    const correctInput3 = "01";

    cy.get(`#${dateInput4}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Year"]')
      .clear()
      .type(incorrectInput1);
    cy.get(`#${dateInput4}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Month"]')
      .clear()
      .type(incorrectInput2);
    cy.get(`#${dateInput4}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Day"]')
      .clear()
      .type(incorrectInput3)
      .blur()
      .then((x) => {
        cy.get(`#${dateInput4}`)
          .find(".cmp-adaptiveform-dateinput__errormessage")
          .should("have.text", "Please enter a valid value.");
      });

    cy.get(`#${dateInput4}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Year"]')
      .clear()
      .type(correctInput1);
    cy.get(`#${dateInput4}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Month"]')
      .clear()
      .type(correctInput2);
    cy.get(`#${dateInput4}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Day"]')
      .clear()
      .type(correctInput3)
      .blur()
      .then((x) => {
        cy.get(`#${dateInput4}`)
          .find(".cmp-adaptiveform-dateinput__errormessage")
          .should("have.text", "");
      });
  });

  // it("should set and clear value based on rules", () => {
  //   // Rule on dateInput6: When input of dateInput6 is '2023-01-12', set value of dateInput4 to '2023-01-01' and clear value of dateInput1

  //   const [dateInput1, dateInput1FieldView] = Object.entries(
  //     formContainer._fields
  //   )[0];
  //   const [dateInput4, dateInput4FieldView] = Object.entries(
  //     formContainer._fields
  //   )[3];
  //   const [dateInput6, dateInput6FieldView] = Object.entries(
  //     formContainer._fields
  //   )[5];

  //   const input = "2023-01-12";
  //   const input1 = "2023";
  //   const input2 = "01";
  //   const input3 = "12";

  //   cy.get(`#${dateInput1}`)
  //     .find('.cmp-adaptiveform-dateinputField__widget[name="Year"]')
  //     .clear()
  //     .type("2022");
  //   cy.get(`#${dateInput1}`)
  //     .find('.cmp-adaptiveform-dateinputField__widget[name="Month"]')
  //     .clear()
  //     .type("05");
  //   cy.get(`#${dateInput1}`)
  //     .find('.cmp-adaptiveform-dateinputField__widget[name="Day"]')
  //     .clear()
  //     .type("18");

  //   cy.get(`#${dateInput6}`)
  //     .find('.cmp-adaptiveform-dateinputField__widget[name="Year"]')
  //     .clear()
  //     .type(input1);
  //   cy.get(`#${dateInput6}`)
  //     .find('.cmp-adaptiveform-dateinputField__widget[name="Month"]')
  //     .clear()
  //     .type(input2);
  //   cy.get(`#${dateInput6}`)
  //     .find('.cmp-adaptiveform-dateinputField__widget[name="Day"]')
  //     .clear()
  //     .type(input3)
  //     .blur()
  //     .then((x) => {
  //       cy.get(`#${dateInput1}`)
  //         .find('.cmp-adaptiveform-dateinputField__widget[name="Year"]')
  //         .should("have.value", "");
  //       // cy.get(`#${dateInput4}`)
  //       //   .find('.cmp-adaptiveform-dateinputField__widget[name="Year"]')
  //       //   .should("have.value", "2023");
  //     });
  // });

  it("Formatters test on Custom DateInput widget", () => {
    const [dateInput5, dateInput5FieldView] = Object.entries(
      formContainer._fields
    )[4];
    const incorrectInput1 = "2023";
    const incorrectInput2 = "33";
    const incorrectInput3 = "33";

    cy.get(`#${dateInput5}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Year"]')
      .should("have.attr", "type", "text");
    cy.get(`#${dateInput5}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Year"]')
      .clear()
      .type(incorrectInput1);
    cy.get(`#${dateInput5}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Month"]')
      .clear()
      .type(incorrectInput2);
    cy.get(`#${dateInput5}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Day"]')
      .clear()
      .type(incorrectInput3)
      .blur()
      .then((x) => {
        cy.get(`#${dateInput5}`)
          .find(".cmp-adaptiveform-dateinput__errormessage")
          .should("have.text", "Specify the value in allowed format : date.");
      });
  });

  it("decoration element should not have same class name", () => {
    expect(formContainer, "formcontainer is initialized").to.not.be.null;
    cy.wrap().then(() => {
      const id = formContainer._model._children[0].id;
      cy.get(`#${id}`)
        .parent()
        .should("not.have.class", bemBlock);
    });
  });

  it(" should add filled/empty class at container div ", () => {
    const [id, fieldView] = Object.entries(formContainer._fields)[0];
    const model = formContainer._model.getElement(id);
    const input = "2020-10-10";
    cy.get(`#${id}`).should("have.class", "cmp-adaptiveform-dateinput--empty");
    cy.get(`#${id}`)
      .invoke("attr", "data-cmp-required")
      .should("eq", "false");
    cy.get(`#${id}`)
      .invoke("attr", "data-cmp-readonly")
      .should("eq", "false");
    const input1 = "2020";
    const input2 = "10";
    const input3 = "10";

    cy.get(`#${id}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Year"]')
      .clear()
      .type(input1);
    cy.get(`#${id}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Month"]')
      .clear()
      .type(input2);
    cy.get(`#${id}`)
      .find('.cmp-adaptiveform-dateinputField__widget[name="Day"]')
      .clear()
      .type(input3)
      .blur()
      .then((x) => {
        expect(model.getState().value).to.equal(input);
        cy.get(`#${id}`).should(
          "have.class",
          "cmp-adaptiveform-dateinput--filled"
        );
      });
  });
});
