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

describe("Repeatability Tests in Panel Container", () => {
    const pagePath = "content/forms/af/core-components-it/samples/panelcontainer/repeatability-tests/add-instances-via-loop.html";

    let formContainer = null;

    beforeEach(() => {
        cy.previewFormWithPanel(pagePath).then(p => {
            formContainer = p;
        });
    });

    it("add instance using loop and change checkbox enums", () => {
        const instanceManager = formContainer._model.items[0];
        const initialNoOfChild = instanceManager.items.length;
        expect(initialNoOfChild).to.equal(1);
        cy.get(".cmp-adaptiveform-container__wrapper")
            .children()
            .should("have.length", 1);

        cy.wrap(null).then(() => {
            for(let i=0; i < 4; i++) {
                if(i !== 0) {
                    instanceManager.dispatch({type: "addItem"});
                }
                const chbx = instanceManager.items[i].items[0];
                chbx.enum = [ "item1" + i, "item2" + i];
                chbx.enumNames = [ "Item1" + i, "Item2" + i];
            }
        })

        cy.get(".cmp-adaptiveform-container__wrapper > div")
            .should("have.length", 4);

        cy.wrap(null).then(() => {
            for(let i=0; i < 4; i++) {
                const chbx = instanceManager.items[i].items[0];
                expect(chbx.enum).to.deep.equal([ "item1" + i, "item2" + i]);
                expect(chbx.enumNames).to.deep.equal([ "Item1" + i, "Item2" + i]);
                cy.get("#" + chbx.id + " [value='item1" + i + "']")
                    .should("be.visible");
                cy.get("#" + chbx.id + " [value='item2" + i + "']")
                    .should("be.visible");
            }
        })
    })
})