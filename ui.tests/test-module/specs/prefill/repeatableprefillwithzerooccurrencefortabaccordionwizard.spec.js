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
describe("Form with Wizard/Tab/Accordion and Prefill with Zero occurance", () => {
    const pagePath = "content/forms/af/core-components-it/samples/prefill/repeatableprefillwithzerooccurrencefortabaccordionwizard.html";
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    })

    it("test that repeatable instances with zero occurance is not in the dom", () => {
        const children = formContainer._model._children;
        expect(children.length).to.be.equal(3);
        for (let i = 0; i < children.length; i++) {
            let currChild = children[i];
            //model of tab, wizard and accordion has two child each
            expect(currChild._children.length).to.be.equal(2);
            //2nd children of tab, wizard and accordion are repeatable with minOccur equal to zero
            expect(currChild._children[1].minOccur).to.be.equal(0);
            //2nd children of  tab, wizard and accordion should not be present in dom.
            cy.get('#' + currChild._children[1]._jsonModel.items[0].id).should('not.exist');
        }
    })
})
