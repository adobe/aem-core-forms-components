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

describe('Form with RUM initialized', () => {
    // rum is only supported in latest addon
    //if (cy.af.isLatestAddon()) {
        const pagePath = "content/forms/af/core-components-it/samples/rum/basic.html";
        let formContainer = null;
        const waitForVariableAndSetSpy = (win, variableName, spyName, timeout) => {
            const startTime = Date.now();
            const checkAndSetSpy = () => {
                if (win?.hlx?.[variableName]) {
                    // Set the spy
                    cy.spy(win.hlx, variableName).as(spyName);
                    // Variable is set, no need to set the spy
                    return;
                }

                if (Date.now() - startTime >= timeout) {
                    // Timeout reached, stop trying
                    return;
                }
                // Check again after a short delay
                setTimeout(checkAndSetSpy, 10);
            };

            checkAndSetSpy();
        };
        let toggle_array = [];

        before(() => {
            cy.fetchFeatureToggles().then((response) => {
                if (response.status === 200) {
                    toggle_array = response.body.enabled;
                }
            });
        });

        /**
         * initialization of form container before every test
         * */
        beforeEach(() => {
            cy.previewForm(pagePath, {onBeforeLoad: (window) => {
                    // Check and set spy if not already set within a timeout of 5 seconds
                    waitForVariableAndSetSpy(window, 'sampleRUM', 'sampleRUMSpy', 5000);
            }}).then(p => {
                formContainer = p;
            })
        });


        it('sampleRUM should have accurate data', () => {
            if (toggle_array.includes("FT_SKYOPS-60870")) {
                expect(formContainer, "formcontainer is initialized").to.not.be.null;
                cy.get(`.cmp-adaptiveform-textinput`).first().find("input").clear().type('random text').blur();
                // Assert the number of calls
                cy.get('@sampleRUMSpy').should('have.callCount', 5);

                // Assert the arguments of the first call
                cy.get('@sampleRUMSpy').should('be.calledWith', "formviews", {
                    source: "/content/forms/af/core-components-it/samples/rum/basic/jcr:content/guideContainer",
                    target: "{\"version\":\"core\"}"
                });

                // Assert the arguments of the second call
                cy.get('@sampleRUMSpy').should((spyCall) => {
                    const args = spyCall.args[1];
                    // Partially match the source
                    expect(args[0]).to.include("formready");
                    // Partially match the source
                    expect(args[1].source).to.include("/content/forms/af/core-components-it/samples/rum/basic/jcr:content/guideContainer");
                    // Check if the target value exists
                    expect(args[1].target).to.exist;
                });

                // Assert the arguments of the third call
                cy.get('@sampleRUMSpy').should('be.calledWith', "formfieldfocus", {
                    source: "textinput-f226352a71",
                    target: "{\"qualifiedName\":\"$form.textinput1\",\"formId\":\"/content/forms/af/core-components-it/samples/rum/basic/jcr:content/guideContainer\"}"
                });

                // Assert the arguments of the fourth call
                cy.get('@sampleRUMSpy').should('be.calledWith', "formfieldchange", {
                    source: "textinput-f226352a71",
                    target: "{\"qualifiedName\":\"$form.textinput1\",\"formId\":\"/content/forms/af/core-components-it/samples/rum/basic/jcr:content/guideContainer\"}"
                });

                // Assert the arguments of the fifth call
                cy.get('@sampleRUMSpy').should('be.calledWith', "formvalidationerrors", {
                    source: "textinput-f226352a71",
                    target: "{\"qualifiedName\":\"$form.textinput1\",\"formId\":\"/content/forms/af/core-components-it/samples/rum/basic/jcr:content/guideContainer\",\"validationType\":\"expressionMismatch\"}"
                });
            }

        });
    //}
});
