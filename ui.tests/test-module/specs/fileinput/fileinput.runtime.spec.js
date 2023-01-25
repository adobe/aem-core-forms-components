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

const getFormObjTest = (fileList, fileAttachmentFormPath="") => {
    cy.window().then(function(win) {
        win.guideBridge.getFormDataObject({
            "success" : function (resultObj) {
                let afFormData = resultObj.data;
                expect(afFormData).to.exist // "af form data object not present in guideBridge#getFormDataObject API");
                expect(afFormData.data).to.exist // "form data not present in guideBridge#getFormDataObject API");
                // let isBoundAF = fileAttachmentFormPath.indexOf("bound") != -1;
                // if (isBoundAF) {
                //     expect(afFormData.contentType).to.equal("application/json");
                // } else {
                //     expect(afFormData.contentType).to.equal("application/xml");
                // }
                assert.equal(afFormData.attachments.length, fileList.length, "incorrect attachments returned from guideBridge#getFormDataObject API");
                // if (afFormData.attachments.length > 0) {
                //     afFormData.attachments.forEach(function(attachment) {
                //         if (isBoundAF) {
                //             expect(attachment.bindRef).to.contain("/");
                //         } else {
                //             expect(attachment.bindRef.indexOf("/")).to.equal(-1);
                //         }
                //     })
                // }
                // explicitly calling this to ensure there are no errors during this API invocation
                let htmlFormData = afFormData.toHTMLFormData();
                // Display the key/value pairs
                for (var pair of htmlFormData.entries()) {
                    console.log(pair[0]+ ', ' + pair[1]);
                }
            }
        });
    });
};

describe("Form with File Input - Basic Tests", () => {

    const pagePath = "content/forms/af/core-components-it/samples/fileinput/basic.html"
    const urls = ["content/forms/af/core-components-it/samples/fileinput/basic.html"]
    const bemBlock = 'cmp-adaptiveform-fileinput'
    const IS = "adaptiveFormFileInput"
    const selectors = {
        fileinput : `[data-cmp-is="${IS}"]`
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
            if(id.startsWith("fileinput"))
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
            if(id.startsWith("fileinput")) {
                checkHTML(model.id, model.getState()).then(() => {
                    model.visible = false
                    return checkHTML(model.id, model.getState())
                }).then(() => {
                    model.enabled = false
                    return checkHTML(model.id, model.getState())
                })
            }
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
        getFormObjTest(['empty.pdf', 'empty.pdf', 'empty.pdf'])
    });

    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, 'tooltip_scenario_test');
    })
})

describe("Form with File Input - Prefill & Submit tests", () => {
    let prefillId;
    const fileInput1 = "input[name='fileinput1']";
    const submitBtn = "submit1673953138924";
    const pagePath = "content/forms/af/core-components-it/samples/fileinput/basic.html"


    beforeEach(() => {
        cy.wrap(prefillId).as('prefillId');
        cy.intercept({
            method: 'POST',
            url: '**/adobe/forms/af/submit/*',
        }).as('afSubmission')
    });

    const submitTest = (fileAttachmentFormPath) => {
        cy.wait('@afSubmission').then(({response}) => {
            const { body } = response;
            assert.equal(response.statusCode, 200, "submission failed since status code is not 200");
            assert.equal(body.redirectUrl.indexOf("guideThankYouPage") !== -1, true, "location header does not contain thank you page in submission response");
            assert.isDefined(body?.thankYouMessage)
            assert.isDefined(body?.metadata?.prefillId, "prefillId not present")
            prefillId = body.metadata.prefillId;
            cy.wrap(prefillId).as("prefillId");
        })
    };

    const checkFilePreviewInFileAttachment = (component) => {
        cy.get(component).then(() => {
            cy.get(".cmp-adaptiveform-fileinput__filename").eq(0).click();
            cy.window().its('open').should('be.called');
        });
    };

    const checkFileNamesInFileAttachmentView = (component, fileNames) => {
        // check if file present in view
        cy.get(component).then((fileInputs) => {
            fileNames.forEach((fileName) => {
                cy.get(".cmp-adaptiveform-fileinput__filename").contains(fileName)
            })
        });
        // check if file present in model
        // cy.window().then(function(win){
        //     let fileAttachmentValue = win.guidelib.__runtime__[componentName].value;
        //     expect(fileAttachmentValue).to.contain(componentValue)
        // });
    }


    it("attach files, check model, view, preview attachment and submit the form", () => {
        cy.previewForm(pagePath, {
            onBeforeLoad : (win) => {
                cy.stub(win, 'open'); // creating a stub to check file preview
            }
        });
        const fileName = "empty.pdf";
        cy.get(fileInput1).attachFile(fileName);
        checkFileNamesInFileAttachmentView(fileInput1, ['empty.pdf']);
        checkFilePreviewInFileAttachment(fileInput1)
        cy.get(".cmp-adaptiveform-button__widget").click();
        submitTest(pagePath);
    })

    it(`prefill of submitted form`, () => {
        cy.get("@prefillId").then(id => {
            const fileAttachmentPrefillPath = pagePath;
            cy.previewForm(fileAttachmentPrefillPath, {
                params: [`prefillId=${id}`],
                onBeforeLoad(win) {
                    cy.stub(win, 'open'); // creating a stub to check file preview
                }
            });

            // check if files were prefilled
            checkFileNamesInFileAttachmentView(fileInput1, ['empty.pdf']);
            getFormObjTest(['empty.pdf'], pagePath);

            // check the preview of the file attachment
            checkFilePreviewInFileAttachment(fileInput1);

            // add new files after preview to both the component
            cy.get(fileInput1).attachFile(['sample.txt'])

            // // check if guideBridge API returns correctly after prefill and attaching more files
            getFormObjTest(['empty.pdf', 'sample.txt'], pagePath);

            // submit the form
            cy.get(".cmp-adaptiveform-button__widget").click();

            // check if submission is success
            submitTest(pagePath);
        });
    });

    it(`prefill of submitted prefilled form`, () => {
        cy.get("@prefillId").then(id => {
            const fileAttachmentPrefillPath = pagePath;
            cy.previewForm(fileAttachmentPrefillPath, {
                params: [`prefillId=${id}`],
                onBeforeLoad(win) {
                    cy.stub(win, 'open'); // creating a stub to check file preview
                }
            });

            checkFileNamesInFileAttachmentView(fileInput1, ['empty.pdf', 'sample.txt']);
            getFormObjTest(['empty.pdf', 'sample.txt'], pagePath);

            // check if file preview works fine after prefill
            checkFilePreviewInFileAttachment(fileInput1);
        });

    });

});
