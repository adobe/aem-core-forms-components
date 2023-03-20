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

describe("Repeatability Tests in Panel Container Responsive Grid Layout", () => {
    const pagePath = "content/forms/af/core-components-it/samples/panelcontainer/repeatabilityInsidePanelResponsiveGrid.html";

    let formContainer = null;

    beforeEach(() => {
        cy.previewFormWithPanel(pagePath).then(p => {
            formContainer = p;
        });
    });

    const getParentPanelView = () => {
        const parentPanelId = formContainer._model.items[0].id;
        const fields = formContainer.getAllFields();
        const parentPanelView = fields[parentPanelId];
        return parentPanelView;
    }

    const getParentPanelElement = () => {
        return getParentPanelView().element;
    }

    const getInstanceModelOfChildAtIndex = (index) => {
        return formContainer._model.items[0].items[index];
    }


    const getChildrenElementOfPanel = () => {
        return getParentPanelElement().lastElementChild.children;
    }

    const getChildrenElementOfPanelByIndex = (index) => {
        return getParentPanelElement().lastElementChild.children[index];
    }

    const getIdOfChildElement = (childElement) => {
        return childElement.querySelector("[data-cmp-is]").id;
    }

    it("check min Instance in view And Model", () => {
        const initialNoOfChildOfPanel = getChildrenElementOfPanel().length;
        const instanceModel = getInstanceModelOfChildAtIndex(0);
        const minOccur = instanceModel.minOccur;
        const initialNoOfChildInInstanceModel = instanceModel._children.length;
        //click on -RP1 and check after every click that no of child in view and in instancemodel is same, similarly do the same with clikcing +RP1
        for (let i = 0; i < (initialNoOfChildInInstanceModel - minOccur) + 2; i++) {
            cy.get("button").contains("-RP1").click().then(() => {
                    if (i < initialNoOfChildInInstanceModel - minOccur) {
                        expect(getChildrenElementOfPanel().length).to.equal(initialNoOfChildOfPanel - (i + 1));
                        expect(instanceModel._children.length).to.equal(initialNoOfChildInInstanceModel - (i + 1));
                    } else {
                        expect(getChildrenElementOfPanel().length).to.equal(initialNoOfChildOfPanel - (initialNoOfChildInInstanceModel - minOccur));
                        expect(instanceModel._children.length).to.equal(initialNoOfChildInInstanceModel - (initialNoOfChildInInstanceModel - minOccur));
                    }
                }
            )
        }
    })

    it("check max Instance in view And Model", () => {
        const instanceModel = getInstanceModelOfChildAtIndex(0);
        const initialNoOfChildOfPanel = getChildrenElementOfPanel().length;
        const initialNoOfChildInInstanceModel = instanceModel._children.length;
        const maxOccur = instanceModel.maxOccur;
        for (let i = 0; i < (maxOccur - initialNoOfChildInInstanceModel) + 2; i++) {
            cy.get("button").contains("+RP1").click().then(() => {
                if (i < maxOccur - initialNoOfChildInInstanceModel) {
                    expect(getChildrenElementOfPanel().length).to.equal(initialNoOfChildOfPanel + (i + 1));
                    expect(instanceModel._children.length).to.equal(initialNoOfChildInInstanceModel + (i + 1));
                } else {
                    expect(getChildrenElementOfPanel().length).to.equal(initialNoOfChildOfPanel + (maxOccur - initialNoOfChildInInstanceModel));
                    expect(instanceModel._children.length).to.equal(initialNoOfChildInInstanceModel + (maxOccur - initialNoOfChildInInstanceModel));
                }
            })
        }
    })

    it("check repeatability when instance added at first index", () => {
        const instanceModel = getInstanceModelOfChildAtIndex(0);
        const initialNoOfChildOfPanel = getChildrenElementOfPanel().length;
        const initialNoOfChildInInstanceModel = instanceModel._children.length;
        const firstChildElementInitially = getChildrenElementOfPanelByIndex(0);
        const secondChildElementInitially = getChildrenElementOfPanelByIndex(1);
        cy.get("button").contains("-RP1").click().then(() => {
            expect(getChildrenElementOfPanel().length).to.equal(initialNoOfChildOfPanel - 1);
            expect(instanceModel._children.length).to.equal(initialNoOfChildInInstanceModel - 1);
            const firstChildElementAfterRemoval = getChildrenElementOfPanelByIndex(0);
            expect(instanceModel._children.length).to.equal(0);
            expect(getIdOfChildElement(firstChildElementInitially)).to.not.equal(getIdOfChildElement(firstChildElementAfterRemoval));
            expect(getIdOfChildElement(firstChildElementAfterRemoval)).to.equal(getIdOfChildElement(secondChildElementInitially));
            cy.get("button").contains("+RP1").click().then(() => {
                //checking if it is added at 0th items instanceManger's 0th index
                expect(instanceModel._children.length).to.equal(1);
                expect(getChildrenElementOfPanel().length).to.equal(initialNoOfChildOfPanel);
                const firstChildElementAfterAddition = getChildrenElementOfPanelByIndex(0);
                const secondChildElementAfterAddition = getChildrenElementOfPanelByIndex(1);
                expect(getIdOfChildElement(firstChildElementAfterAddition)).to.not.equal(getIdOfChildElement(firstChildElementAfterRemoval));
                expect(getIdOfChildElement(firstChildElementAfterAddition)).to.not.equal(getIdOfChildElement(firstChildElementInitially));
                expect(getIdOfChildElement(secondChildElementAfterAddition)).to.equal(getIdOfChildElement(secondChildElementInitially));
            })
        })
    })

    it("check repeatability when instance added at other than first index", () => {
        const instanceModel = getInstanceModelOfChildAtIndex(2);
        const initialNoOfChildOfPanel = getChildrenElementOfPanel().length;
        const initialNoOfChildInInstanceModel = instanceModel._children.length;
        const fourthChildElementInitially = getChildrenElementOfPanelByIndex(3);
        cy.get("button").contains("-RP3").click().then(() => {
            expect(getChildrenElementOfPanel().length).to.equal(initialNoOfChildOfPanel - 1);
            expect(instanceModel._children.length).to.equal(initialNoOfChildInInstanceModel - 1);
            const thirdChildElementAfterRemoval = getChildrenElementOfPanelByIndex(2);
            expect(getIdOfChildElement(fourthChildElementInitially)).to.equal(getIdOfChildElement(thirdChildElementAfterRemoval));
            cy.get("button").contains("+RP3").click().then(() => {
                //checking if it is added at 3rd items instanceManger's 0th index
                expect(instanceModel._children.length).to.equal(1);
                expect(getChildrenElementOfPanel().length).to.equal(initialNoOfChildOfPanel);
                const fourthChildElementAfterAddition = getChildrenElementOfPanelByIndex(3);
                expect(getIdOfChildElement(fourthChildElementAfterAddition)).to.equal(getIdOfChildElement(thirdChildElementAfterRemoval));
                expect(getIdOfChildElement(fourthChildElementAfterAddition)).to.equal(getIdOfChildElement(fourthChildElementInitially));
            })
        })
    })
})