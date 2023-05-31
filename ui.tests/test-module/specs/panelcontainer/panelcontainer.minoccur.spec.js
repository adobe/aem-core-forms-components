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

describe("Min Occur Repeatability Tests in Panel Container Responsive Grid Layout", () => {
    const pagePath = "content/forms/af/core-components-it/samples/panelcontainer/repeatability-tests/minoccurtest.html";

    let formContainer = null;

    beforeEach(() => {
        cy.previewFormWithPanel(pagePath).then(p => {
            formContainer = p;
        });
    });

    it("Check min occur instance in view and model", () => {
        const formContainerModel = formContainer.getModel();
        const fields = formContainer.getAllFields();
        const instanceManagerModel = formContainerModel.items[1];
        const instanceManagerView = fields[instanceManagerModel.id];
        expect(instanceManagerModel.items.length, "Instance Manger model should have 5 items").to.equal(5);
        expect(instanceManagerView.children.length, "Instance Manger view should have 5 children").to.equal(5);
        for (var i = 0; i < 5; i++) {
            expect(instanceManagerModel.items[i].id, "Repeatable model id should be in sync with repeatable view id for index " + i).to.equal(instanceManagerView.children[i].id);
            expect(instanceManagerModel.items[i].items[0].id, "Repeatable panel child model id should be in sync with repeatable panel view child id for index " + i).to.equal(instanceManagerView.children[i].children[0].id);
        }
    })

    //TODO Add setfocus test minoccur case
})
