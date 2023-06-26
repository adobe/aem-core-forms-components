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

describe("Min Occur Repeatability Tests in Tabs on Top", () => {
    const pagePath = "content/forms/af/core-components-it/samples/tabsontop/minoccurtest.html";

    let formContainer = null;

    beforeEach(() => {
        cy.previewFormWithPanel(pagePath).then(p => {
            formContainer = p;
        });
    });

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
        cy.get(".cmp-tabs__tab").should('have.length', 6).then(() => {
            cy.get(".cmp-tabs__tab").eq(0).should('have.class', 'cmp-tabs__tab--active');
            cy.get(".cmp-tabs__tabpanel").eq(0).should('have.class', 'cmp-tabs__tabpanel--active');
            cy.get(".cmp-tabs__tab").eq(1).should('not.have.class', 'cmp-tabs__tab--active');
            cy.get(".cmp-tabs__tabpanel").eq(1).should('not.have.class', 'cmp-tabs__tabpanel--active');
            cy.get(".cmp-tabs__tab").eq(2).should('not.have.class', 'cmp-tabs__tab--active');
            cy.get(".cmp-tabs__tabpanel").eq(2).should('not.have.class', 'cmp-tabs__tabpanel--active');
            cy.get(".cmp-tabs__tab").eq(3).should('not.have.class', 'cmp-tabs__tab--active');
            cy.get(".cmp-tabs__tabpanel").eq(3).should('not.have.class', 'cmp-tabs__tabpanel--active');
            cy.get(".cmp-tabs__tab").eq(4).should('not.have.class', 'cmp-tabs__tab--active');
            cy.get(".cmp-tabs__tabpanel").eq(4).should('not.have.class', 'cmp-tabs__tabpanel--active');
            cy.get(".cmp-tabs__tab").eq(5).should('not.have.class', 'cmp-tabs__tab--active');
            cy.get(".cmp-tabs__tabpanel").eq(5).should('not.have.class', 'cmp-tabs__tabpanel--active');
        })
    })
})
