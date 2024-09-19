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
describe("Form with Radio Button Input", () => {

    const pagePath = "content/forms/af/core-components-it/samples/radiobutton/basic.html";
    let formContainer = null;
    const bemBlock = 'cmp-adaptiveform-radiobutton';
    /**
     * initialization of form container before every test
     * */
    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    const checkHTML = (id, state) => {
        const visible = state.visible;
        const passVisibleCheck = `${visible === true ? "" : "not."}be.visible`;
        const passDisabledAttributeCheck = `${state.enabled === false || state.readOnly === true ? "" : "not."}have.attr`;
        cy.get(`#${id}`)
            .should(passVisibleCheck)
            .invoke('attr', 'data-cmp-visible')
            .should('eq', visible.toString());
        cy.get(`#${id}`)
            .invoke('attr', 'data-cmp-enabled')
            .should('eq', state.enabled.toString());
        return cy.get(`#${id}`).within((root) => {
            cy.get('*').should(passVisibleCheck);
            cy.get('input')
                .should('have.length', 2);
            cy.get('input')
                .should(passDisabledAttributeCheck, 'disabled');
            cy.get('input').eq(0).should('be.checked');
        })
    }

    it("radiobutton should get model and view initialized properly", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id);
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel());
        });
    });

    it("radiobutton model's changes are reflected in the html", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0];

        // checking alignment  of radio button in runtime
        cy.get(`#${id}`).find(".cmp-adaptiveform-radiobutton__widget").should('have.class', 'VERTICAL');
        const [id2, fieldView2] = Object.entries(formContainer._fields)[1];
        cy.get(`#${id2}`).find(".cmp-adaptiveform-radiobutton__widget").should('have.class', 'HORIZONTAL');

        // check model's change is reflected in HTML
        const model = formContainer._model.getElement(id);
        const val = Array('0','1');
        model.value = '0';
        checkHTML(model.id, model.getState()).then(() => {
            model.visible = false;
            return checkHTML(model.id, model.getState());
        }).then(() => {
            model.enable = false;
            cy.get(`#${id2}`).find(".cmp-adaptiveform-radiobutton__option__widget").should('not.have.attr', 'aria-disabled');
            return checkHTML(model.id, model.getState());
        });
    });

    it("radiobutton html changes are reflected in model", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[1];
        const model = formContainer._model.getElement(id);

        // check the default value to be selected as 0
        expect(model.getState().value).to.equal('0');

        cy.get(`#${id}`).find("input").eq(1).click().then(x => {
            expect(model.getState().value).to.equal('1');
        });
        cy.get(`#${id}`).find("input").eq(3).click().then(x => {
            expect(model.getState().value).to.equal('3');
        });
    });

    it("radiobutton should show error messages in the HTML", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[0];
        formContainer._model.validate();
        cy.get(`#${id}`).find(".cmp-adaptiveform-radiobutton__errormessage").should('have.text',"This is a required radiobutton");
        cy.get(`#${id}`).should('have.attr', 'data-cmp-valid', 'false')
        cy.get(`#${id} > div.${bemBlock}__errormessage`).should('have.attr', 'id', `${id}__errormessage`);
        cy.get(`#${id}`).find(".cmp-adaptiveform-radiobutton__widget").should('have.attr', 'aria-describedby', `${id}__errormessage`);
        cy.get(`#${id}`).find(".cmp-adaptiveform-radiobutton__option__widget").should('have.attr', 'aria-invalid', 'true');

        cy.get(`#${id}`).find("input").eq(1).click().then(x => {
            cy.get(`#${id}`).find(".cmp-adaptiveform-radiobutton__errormessage").should('have.text',"");
            cy.get(`#${id}`).should('have.attr', 'data-cmp-valid', 'true')
            cy.get(`#${id}`).find(".cmp-adaptiveform-radiobutton__option__widget").should('have.attr', 'aria-invalid', 'false');
            cy.get(`#${id}`).find(".cmp-adaptiveform-radiobutton__option__widget").should('not.have.attr', 'aria-checked');
            cy.get(`#${id}`).find(".cmp-adaptiveform-radiobutton__widget").should('have.attr', 'aria-describedby', '');
        });
    });

    it("Radio button should not have aria-disabled attribute if enable is false", () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[3];
        cy.get(`#${id}`).find(".cmp-adaptiveform-radiobutton__option__widget").should('not.have.attr', 'aria-disabled');
    })
        
    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, 'tooltip_scenario_test');
    })

    it("should show and hide components on certain select", () => {
        // Rule on radioButton1: When radioButton2 has Item 1 selected => Show radioButton3 and Hide radioButton4

        const [radioButton1, radioButton1FieldView] = Object.entries(formContainer._fields)[0];
        const [radioButton3, radioButton3FieldView] = Object.entries(formContainer._fields)[2];
        const [radioButton4, radioButton4FieldView] = Object.entries(formContainer._fields)[3];

        cy.get(`#${radioButton1}`).find("input").first().check().blur().then(x => {
            cy.get(`#${radioButton3}`).should('be.visible')
            cy.get(`#${radioButton4}`).should('not.be.visible')
        })
    })

    it("should enable and disable components on certain select", () => {
        // Rule on radioButton1: When radioButton2 has Item 2 selected => Enable radioButton4 and Disable radioButton2

        const [radioButton1, radioButton1FieldView] = Object.entries(formContainer._fields)[0];
        const [radioButton2, radioButton2FieldView] = Object.entries(formContainer._fields)[1];
        const [radioButton4, radioButton4FieldView] = Object.entries(formContainer._fields)[3];

        cy.get(`#${radioButton1}`).find("input").check("1").blur().then(x => {
            cy.get(`#${radioButton4}`).find("input").should('be.enabled')
            cy.get(`#${radioButton2}`).find("input").should('not.be.enabled')
        })
    })

    it("should show validation error messages based on expression rule", () => {
        // Rule on radioButton6: Validate radioButton6 using Expression: radioButton6 === radioButton5

        const [radioButton5, radioButton5FieldView] = Object.entries(formContainer._fields)[4];
        const [radioButton6, radioButton6FieldView] = Object.entries(formContainer._fields)[5];

        cy.get(`#${radioButton5}`).find("input").check(["1"]).then(x => {
            cy.get(`#${radioButton6}`).find("input").check(["0"])
            cy.get(`#${radioButton6}`).find(".cmp-adaptiveform-radiobutton__errormessage").should('have.text', "Please enter a valid value.")

            cy.get(`#${radioButton6}`).find("input").check(["1"])
            cy.get(`#${radioButton6}`).find(".cmp-adaptiveform-radiobutton__errormessage").should('have.text', "")
        })
    })

    it("should set and clear value based on rules", () => {
        // Rule on radioButton4: When input has Item1 selected, set value of radioButton6 to "Item 2" and clear value of radioButton1

        const [radioButton1, radioButton1FieldView] = Object.entries(formContainer._fields)[0];
        const [radioButton6, radioButton6FieldView] = Object.entries(formContainer._fields)[5];
        const [radioButton4, radioButton4FieldView] = Object.entries(formContainer._fields)[3];

        cy.get(`#${radioButton1}`).find("input").check("1")
        cy.get(`#${radioButton4}`).find("input").check("0").blur().then(x => {
            cy.get(`#${radioButton6}`).find("input").should('be.checked')
            cy.get(`#${radioButton1}`).find("input").should('not.be.checked')
        })
    })

    it("should update enum values on providing duplicate enums", () => {

        const [radioButton7, radioButton7FieldView] = Object.entries(formContainer._fields)[6];
        cy.get(`#${radioButton7}`).find(".cmp-adaptiveform-radiobutton__option").should('have.length', 2);
        cy.get(`#${radioButton7}`).find(".cmp-adaptiveform-radiobutton__option-label").contains('Item 3');
        cy.get(`#${radioButton7}`).find(".cmp-adaptiveform-radiobutton__option-label").contains('Item 2');
        cy.get(`#${radioButton7}`).find(".cmp-adaptiveform-radiobutton__option-label").contains('Item 1').should('not.exist');

    })

    it("rich text should render correctly", () => {
        const [radioButton9, radioButton9FieldView] = Object.entries(formContainer._fields)[8];
        cy.get(`#${radioButton9}`).find(".cmp-adaptiveform-radiobutton__option").should('have.length', 2);
        cy.get(`#${radioButton9}`).find(".cmp-adaptiveform-radiobutton__label").contains('Select Animal').should('have.css', 'font-weight', '700');
        cy.get(`#${radioButton9}`).find(".cmp-adaptiveform-radiobutton__option-label span").contains('Dog').should('have.css', 'font-style', 'italic');
        cy.get(`#${radioButton9}`).find(".cmp-adaptiveform-radiobutton__option-label span").contains('Cat').should('have.css', 'text-decoration', 'underline solid rgb(50, 50, 50)');
    });

    it("decoration element should not have same class name", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.wrap().then(() => {
            const id = formContainer._model._children[0].id;
            cy.get(`#${id}`).parent().should("not.have.class", bemBlock);
        })
    })

    it("should add filled/empty class at container div", () => {
      const [radioButton1, radioButton1FieldView] = Object.entries(formContainer._fields)[0];
      cy.get(`#${radioButton1}`).should('have.class', 'cmp-adaptiveform-radiobutton--empty');
      cy.get(`#${radioButton1}`).invoke('attr', 'data-cmp-required').should('eq', 'true');
      cy.get(`#${radioButton1}`).invoke('attr', 'data-cmp-readonly').should('eq', 'false');
      cy.get(`#${radioButton1}`).find("input").check("1").blur().then(x => {
        cy.get(`#${radioButton1}`).should('have.class', 'cmp-adaptiveform-radiobutton--filled');
      })
    })

    it("radiobutton with boolean type selection should happen in first click", () => {
        const [radioButton8, radioButton1FieldView] = Object.entries(formContainer._fields)[7];
        cy.get(`#${radioButton8}`).find("input").check("true").then(() => {
            cy.get(`#${radioButton8}`).find('input[value="true"]').should("be.checked");
        })

        cy.get(`#${radioButton8}`).find("input").check("false").then(() => {
            cy.get(`#${radioButton8}`).find('input[value="false"]').should("be.checked");
        })
    })

    it("test if required property updated in model is reflected in view", () => {
        const [id, radioButtonView] = Object.entries(formContainer._fields)[7];
        cy.get(`#${id}`).invoke('attr', 'data-cmp-required').should('eq', 'false').then(() => {
            radioButtonView._model.required = true;
        })
        cy.get(`#${id}`).invoke('attr', 'data-cmp-required').should('eq', 'true');
    })
})

describe("setFocus on radiobutton via rules", () => {

    const pagePath = "content/forms/af/core-components-it/samples/radiobutton/focustest.html"
    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    it("should focus on radio button when button is clicked", () => {
        const [button] = Object.entries(formContainer._fields).filter(it => it[1].getModel()._jsonModel.fieldType==='button')[0];
        const [radioButton] = Object.entries(formContainer._fields).filter(it => it[1].getModel()._jsonModel.fieldType==='radio-group')[0];
        cy.get(`#${radioButton}`).find("input").eq(0).should('not.have.focus');
        cy.get(`#${button}-widget`).click().then(() => {
            cy.get(`#${radioButton}`).find("input").eq(0).should('have.focus')
        })
    })
})

describe(" radiobutton repeatability ", () => {

    const pagePath = "content/forms/af/core-components-it/samples/radiobutton/radiorepeatability.html"
    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });

    const clickRadio = function (panelModel, index) {
        const panelId = panelModel.id;
        // panel only has radio button hence just searching for individual inputs of radio button
        cy.get(`#${panelId}`).find("input").eq(index).click().then(() => {
            // in this case radio button input index is same as value
            checkRepeatablePanel(panelModel, index);
        });
    }

    const checkRepeatablePanel = function (panelModel, radioButtonValue) {
        const panelId = panelModel.id;
        const radioButtonModel = panelModel.items[0];
        expect(radioButtonModel.value).to.equal(radioButtonValue);
        //Repeatable panel HTML should exist
        cy.get(`#${panelId}`).should('exist');
        cy.get(`#${radioButtonModel.id}`).should('exist').then(() => {
            //Repeatable panel should have radio button
            cy.get(`#${radioButtonModel.id}`).find("input").should('have.length', 2);
            //Repeatable panel should have radio button with value 0 checked
            cy.get(`#${radioButtonModel.id}`).find("input").eq(0).should(radioButtonValue === 0 ? 'be.checked' : 'not.be.checked');
            //Repeatable panel should have radio button with value 1 unchecked
            cy.get(`#${radioButtonModel.id}`).find("input").eq(1).should(radioButtonValue === 1 ? 'be.checked' : 'not.be.checked');
        });
    }

    it("radio button inside the panel should repeat and data is set for repeatable instance", () => {
        const initialData = '{"panelcontainer1716541354700":[{}]}';
        cy.getFormData().then((result) => {
            expect(result.data.data).to.equal(initialData);
        });

        const formModel = formContainer.getModel();
        const panelInstanceMangerModel = formModel.items[0];
        const firstPanelModel = panelInstanceMangerModel.items[0];
        const repeatButtonId = formModel.items[1].id;
        const resetButtonId = formModel.items[2].id;
        //Check First repeatable panel on initial render
        checkRepeatablePanel(firstPanelModel, null);
        clickRadio(firstPanelModel, 1);

        cy.get(`#${repeatButtonId}-widget`).click().then(() => {
            const secondPanelModel = panelInstanceMangerModel.items[1];
            //Check Second repeatable panel on repeat, initially
            checkRepeatablePanel(secondPanelModel, null);
            clickRadio(secondPanelModel, 0);
            //now check first panel again, there should not be syncing of radio buttons across repeatable panels
            checkRepeatablePanel(firstPanelModel, 1);

            cy.getFormData().then((result) => {
                const expectedData = '{"panelcontainer1716541354700":[{"radiobutton1716541359617":1},{"radiobutton1716541359617":0}]}';
                expect(result.data.data).to.equal(expectedData);
            });

            // Do a reset and then check data
            cy.get(`#${resetButtonId}-widget`).click().then(() => {
                cy.getFormData().then((result) => {
                    expect(result.data.data).to.equal(initialData);
                });
            });
        });


    })
})