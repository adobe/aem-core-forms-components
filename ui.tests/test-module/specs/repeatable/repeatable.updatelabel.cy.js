/*******************************************************************************
 * Copyright 2024 Adobe
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
describe("Form Runtime with Panel Container", () => {
    const pagePath = "content/forms/af/core-components-it/samples/panelcontainer/repeatability-tests/repeatedpanelcount.html";
    let formContainer = null;

    beforeEach(() => {
        cy.previewFormWithPanel(pagePath).then(p => {
            formContainer = p;
        });
    });

    const checkLabelText = (textInputId, panelId, textInputLabel, panelLabel) => {
        const panelLabelSelector = ".cmp-container__label";
        const textInputLabelSelector = ".cmp-adaptiveform-textinput__label";
        cy.get(`#${textInputId} ${textInputLabelSelector}`).should('have.text', textInputLabel);
        cy.get(`#${panelId} ${panelLabelSelector}`).should('have.text', panelLabel);
    };

    it("add and remove instance should add/remove instance at correct index and label should be correctly updated", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        const [buttonid, fieldView] = Object.entries(formContainer._fields)[3];
        const [textinputid, fieldView1] = Object.entries(formContainer._fields)[0];
        const [panelid, fieldView2] = Object.entries(formContainer._fields)[1];

        checkLabelText(textinputid, panelid, 'Text Input1', 'Panel1');

        cy.get(`#${buttonid}`).find("button").click().then(() => {
            const [textinputid1, fieldView3] = Object.entries(formContainer._fields)[5];
            const [panelid1, fieldView4] = Object.entries(formContainer._fields)[6];
            const [buttonid1, fieldView5] = Object.entries(formContainer._fields)[3];
            const [removeButton, removeFieldView] = Object.entries(formContainer._fields)[4];

            checkLabelText(textinputid1, panelid1, 'Text Input2', 'Panel2');

            cy.get(`#${buttonid1}`).find("button").click().then(() => {
                const [textinputid2, fieldView6] = Object.entries(formContainer._fields)[9];
                const [panelid2, fieldView7] = Object.entries(formContainer._fields)[10];

                checkLabelText(textinputid1, panelid1, 'Text Input3', 'Panel3');
                checkLabelText(textinputid2, panelid2, 'Text Input2', 'Panel2');

                // remove instance and check label update
                // find Panel[1]'s remove button by its model index
                const removeBtn1 = Object.values(formContainer._fields).find(f =>
                    f.getModel &&
                    f.getModel()?.fieldType === 'button' &&
                    f.getModel()?.label?.value === 'Remove' &&
                    f.getModel()?.parent?.index === 1
                );
                cy.get(`#${removeBtn1.getId()}`).find("button").click().then(() => {
                    // after Panel[1] removed, find the surviving panel at index 1 by model
                    const panel1remaining = Object.values(formContainer._fields).find(f =>
                        f.getModel &&
                        f.getModel()?.fieldType === 'panel' &&
                        f.getModel()?.repeatable === true &&
                        f.getModel()?.index === 1
                    );
                    const textinput1remaining = Object.values(formContainer._fields).find(f =>
                        f.getModel &&
                        f.getModel()?.fieldType === 'text-input' &&
                        f.getModel()?.parent?.id === panel1remaining.getModel().id
                    );
                    checkLabelText(textinput1remaining.getId(), panel1remaining.getId(), 'Text Input2', 'Panel2');
                });
            });
        });
    });
});