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

describe("Min Occur Repeatability Tests in Accordion", () => {
    const pagePath = "content/forms/af/core-components-it/samples/accordion/minoccurtest.html";

    let formContainer = null;

    beforeEach(() => {
        cy.previewFormWithPanel(pagePath).then(p => {
            formContainer = p;
        });
    });

    const getItemDivs = () => {
        return cy.get(".cmp-accordion__item");
    }

    const getAccordionPanels = () => {
        return cy.get(".cmp-accordion__panel");
    }

    const getAccordionButtons = () => {
        return cy.get(".cmp-accordion__button");
    }


    const getAccordionPanelsAtIndex = (index) => {
        return getAccordionPanels().eq(index);
    }

    const getAccordionButtonsAtIndex = (index) => {
        return getAccordionButtons().eq(index);
    }


    it("Check min occur instance in view and model", () => {
        const formContainerModel = formContainer.getModel();
        const fields = formContainer.getAllFields();
        const instanceManagerModel = formContainerModel.items[1].items[1];
        const instanceManagerView = fields[instanceManagerModel.id];
        expect(instanceManagerModel.items.length, "Instance Manger model should have 5 items").to.equal(5);
        expect(instanceManagerView.children.length, "Instance Manger view should have 5 children").to.equal(5);
        for (var i = 0; i < 5; i++) {
            expect(instanceManagerModel.items[i].id, "Repeatable model id should be in sync with repeatable view id for index " + i).to.equal(instanceManagerView.children[i].id);
            expect(instanceManagerModel.items[i].items[0].id, "Repeatable panel child model id should be in sync with repeatable panel view child id for index " + i).to.equal(instanceManagerView.children[i].children[0].id);
        }
    })

    it("With min occur, focus should remain at first element", () => {
        getItemDivs().should('have.length', 6).then(() => {
            getAccordionPanelsAtIndex(0).should('have.class', 'cmp-accordion__panel--expanded');
            getAccordionButtonsAtIndex(0).should('have.class', 'cmp-accordion__button--expanded');
            getAccordionPanelsAtIndex(1).should('not.have.class', 'cmp-accordion__panel--expanded');
            getAccordionButtonsAtIndex(1).should('not.have.class', 'cmp-accordion__button--expanded');
            getAccordionPanelsAtIndex(2).should('not.have.class', 'cmp-accordion__panel--expanded');
            getAccordionButtonsAtIndex(2).should('not.have.class', 'cmp-accordion__button--expanded');
            getAccordionPanelsAtIndex(3).should('not.have.class', 'cmp-accordion__panel--expanded');
            getAccordionButtonsAtIndex(3).should('not.have.class', 'cmp-accordion__button--expanded');
            getAccordionPanelsAtIndex(4).should('not.have.class', 'cmp-accordion__panel--expanded');
            getAccordionButtonsAtIndex(4).should('not.have.class', 'cmp-accordion__button--expanded');
            getAccordionPanelsAtIndex(5).should('not.have.class', 'cmp-accordion__panel--expanded');
            getAccordionButtonsAtIndex(5).should('not.have.class', 'cmp-accordion__button--expanded');
        })
    })

})
