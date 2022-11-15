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
describe("Form with File Input", () => {

    const pagePath = "content/forms/af/core-components-it/samples/fileinput/basic.html"
    const bemBlock = 'cmp-adaptiveform-fileinput'
    const IS = "adaptiveFormFileInput"
    const selectors = {
        numberinput : `[data-cmp-is="${IS}"]`
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
        const value = (state.value == null ? '' : (Array.isArray(state.value) ? state.value[0].name : state.value.name)); // check for file name in dom
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
            if (value !== "") {
                cy.get('.cmp-adaptiveform-fileinput__filename').should('have.text', value)
            }
        })
    }

    it(" should get model and view initialized properly ", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            expect(field.getId()).to.equal(id)
            expect(formContainer._model.getElement(id), `model and view are in sync`).to.equal(field.getModel())
            checkHTML(id, field.getModel().getState())
        });
    })

    it(" model's changes are reflected in the html ", () => {
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            let model = field.getModel();
            model.value = {
                "name" : "abc",
                "size" : 0,
                "mediaType" : "application/octet-stream",
                "data" : "http://xyz.com/def.pdf"
            }
            checkHTML(model.id, model.getState()).then(() => {
                model.visible = false
                return checkHTML(model.id, model.getState())
            }).then(() => {
                model.enabled = false
                return checkHTML(model.id, model.getState())
            })
        });
    });

    it(" html changes are reflected in model ", () => {
        Object.entries(formContainer._fields).forEach(([id, field]) => {
            let model = field.getModel();
            let fileName = 'empty.pdf';
            if (model.visible && model.enabled) {
                cy.get(`#${id}`).find("input").attachFile(fileName).then(x => {
                    let expectedFileName = Array.isArray(model.getState().value) ? model.getState().value[0].name : model.getState().value.name;
                    expect(expectedFileName).to.equal(fileName)
                })
            }
        });
        cy.window().then(function(win) {
            win.guideBridge.getFormDataObject({
                "success" : function (resultObj) {
                    let afFormData = resultObj.data;
                    expect(afFormData).to.exist // "af form data object not present in guideBridge#getFormDataObject API");
                    expect(afFormData.data).to.exist // "form data not present in guideBridge#getFormDataObject API");
                    expect(afFormData.contentType).to.equal("application/json");
                    assert.equal(afFormData.attachments.length, 3, "incorrect attachments returned from guideBridge#getFormDataObject API");
                    afFormData.attachments.forEach(function(attachment) {
                        expect(attachment.dataRef).to.contain('fileinput');
                    });
                    // explicitly calling this to ensure there are no errors during this API invocation
                    let htmlFormData = afFormData.toHTMLFormData();
                    // Display the key/value pairs
                    for (let pair of htmlFormData.entries()) {
                        console.log(pair[0]+ ', ' + pair[1]);
                    }
                }
            });
        });
    });

    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, 'tooltip_scenario_test');
    })

})
