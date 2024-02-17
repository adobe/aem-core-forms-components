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

const getFormObjTest = (fileList) => {
    cy.window().then(function(win) {
        win.guideBridge.getFormDataObject({
            "success" : function (resultObj) {
                let afFormData = resultObj.data;
                expect(afFormData).to.exist // "af form data object not present in guideBridge#getFormDataObject API");
                expect(afFormData.data).to.exist // "form data not present in guideBridge#getFormDataObject API");
                assert.equal(afFormData.attachments.length, fileList.length, "incorrect attachments returned from guideBridge#getFormDataObject API");

                // checks if the right file names are present
                fileList.forEach((file) => {
                    expect(afFormData.attachments.filter(e => e.name === file).length, `could not find ${file} attachment`).to.be.greaterThan(0);
                })

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

const checkFilePreviewInFileAttachment = (component) => {
    cy.get(component).then(() => {
        cy.get(".cmp-adaptiveform-fileinput__filename").each(($file) => {
            cy.wrap($file).click();
            cy.window().its('open').should('be.called');
        })
    });
};

const deleteSelectedFiles = (component, fileNames) => {
    cy.get(component).then(() => {
        fileNames.forEach((fileName) => {
            cy.get(".cmp-adaptiveform-fileinput__filename").contains(fileName).next().find('.cmp-adaptiveform-fileinput__filedelete').click();
        })
    });
};

describe("Form with File Input - Basic Tests", () => {

    const pagePath = "content/forms/af/core-components-it/samples/fileinput/basic.html"
    const bemBlock = 'cmp-adaptiveform-fileinput'
    const IS = "adaptiveFormFileInput"
    const selectors = {
        fileinput : `[data-cmp-is="${IS}"]`
    }
    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath, {
            onBeforeLoad : (win) => {
                cy.stub(win, 'open'); // creating a stub to check file preview
            }
        }).then(p => {
            formContainer = p;
        });
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
    it(" after attaching the file widget value is reset to allow duplicate file ", () => {
        const sampleFileName = 'sample2.txt', fileInput = "input[name='fileinput1']";
        cy.get(fileInput).should('have.value', "");
        cy.get(fileInput).attachFile(sampleFileName).then(() => {
            cy.get(".cmp-adaptiveform-fileinput__filename").contains(sampleFileName);
            cy.get(fileInput).should(($element) => {
                const actualValue = $element.val();
                expect(actualValue.includes("")).to.be.true;
            })
        })


    });

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
            if(id.startsWith("fileinput")) {
                let model = field.getModel();
                let fileName = 'empty.pdf';
                if (model.visible && model.enabled) {
                    cy.get(`#${id}`).should('have.class', 'cmp-adaptiveform-fileinput--empty');
                    cy.get(`#${id}`).invoke('attr', 'data-cmp-required').should('eq', 'false');
                    cy.get(`#${id}`).invoke('attr', 'data-cmp-readonly').should('eq', 'false');
                    cy.get(`#${id}`).find("input").attachFile(fileName).then(x => {
                        let expectedFileName = Array.isArray(model.getState().value) ? model.getState().value[0].name : model.getState().value.name;
                        expect(expectedFileName).to.equal(fileName)
                        cy.get(`#${id}`).should('have.class', 'cmp-adaptiveform-fileinput--filled');
                    })
                }
            }
        });
        getFormObjTest(['empty.pdf', 'empty.pdf', 'empty.pdf', 'empty.pdf'])
    });

    it("should toggle description and tooltip", () => {
        cy.toggleDescriptionTooltip(bemBlock, 'fileinput_tooltip_scenario_test');
    })

    it("decoration element should not have same class name", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.wrap().then(() => {
            const id = formContainer._model._children[0].id;
            cy.get(`#${id}`).parent().should("not.have.class", bemBlock);
        })
    })

    it("check preview and delete functionality of duplicate files", () => {
        let sampleFileNames = ['sample2.txt','sample.txt','sample2.txt'];
        const fileInput = "input[name='fileinput1']";
        cy.get(fileInput).attachFile(sampleFileNames[0]);
        cy.get(fileInput).attachFile(sampleFileNames[1]);
        cy.get(fileInput).attachFile(sampleFileNames[0]);
        checkFilePreviewInFileAttachment(fileInput);

        deleteSelectedFiles(fileInput, sampleFileNames)

        cy.get('.cmp-adaptiveform-fileinput__filelist').eq(0).children().should('have.length', 0);
    })

})

describe("Form with File Input - Prefill & Submit tests", () => {
    let prefillId;
    const multiSelectFileInput1 = "input[name='fileinput1']";
    const singleSelectFileInput2 = "input[name='fileinput2']";
    const singleSelectFileInput4 = "input[name='fileinput4']";

    const submitBtn = "submit1673953138924";
    const pagePath = "content/forms/af/core-components-it/samples/fileinput/basic.html"


    beforeEach(() => {
        cy.wrap(prefillId).as('prefillId');
        cy.intercept({
            method: 'POST',
            url: '**/adobe/forms/af/submit/*',
        }).as('afSubmission')
    });

    const submitTest = () => {
        cy.wait('@afSubmission').then(({response}) => {
            const { body } = response;
            assert.equal(response.statusCode, 200, "submission failed since status code is not 200");
            assert.equal(body.redirectUrl.indexOf("guideThankYouPage") !== -1, true, "url does not contain thank you page in submission response");
            assert.isDefined(body?.thankYouMessage)
            assert.isDefined(body?.metadata?.prefillId, "prefillId not present")
            prefillId = body.metadata.prefillId;
            cy.wrap(prefillId).as("prefillId");
        })
    };

    const checkFileNamesInFileAttachmentView = (component, fileNames) => {
        // check if file present in view
        cy.get(component).then(() => {
            fileNames.forEach((fileName) => {
                cy.get(".cmp-adaptiveform-fileinput__filename").contains(fileName)
            })
        });
    }

    const fileInputs = [
        {
            type: "Single Select",
            selector: singleSelectFileInput2,
            fileNames: ['empty.pdf'], multiple: false
        },
        {
            type: "Multi Select",
            selector: multiSelectFileInput1,
            fileNames: ['empty.pdf', 'sample.txt'], multiple: true
        }
    ];

    const unknownMimetypesFileInputs = [
        {
            type: "Single Select",
            selector: singleSelectFileInput4,
            fileNames: ['test.bat'], multiple: false

        },
        {
            type: "Single Select",
            selector: singleSelectFileInput4,
            fileNames: ['test.msg'], multiple: false
        }]

    unknownMimetypesFileInputs.forEach((fileInput, idx) => {
        it(`${fileInput.type} - attach files, check model, view, preview attachment and submit the form with bat and msg extension files`, () => {
            cy.previewForm(pagePath, {
                onBeforeLoad: (win) => {
                    cy.stub(win, 'open'); // creating a stub to check file preview
                }
            });

            // attach the file
            cy.get(fileInput.selector).attachFile(fileInput.fileNames);

            // check for successful attachment of file in the view
            checkFileNamesInFileAttachmentView(fileInput.selector, fileInput.fileNames);

            // check preview of the file
            checkFilePreviewInFileAttachment(fileInput.selector);
        })
    })

    fileInputs.forEach((fileInput, idx) => {
        it(`${fileInput.type} - attach files, check model, view, preview attachment and submit the form`, () => {
            cy.previewForm(pagePath, {
                onBeforeLoad: (win) => {
                    cy.stub(win, 'open'); // creating a stub to check file preview
                }
            });

            // attach the file
            cy.get(fileInput.selector).attachFile(fileInput.fileNames);
            if(fileInput.multiple)
                cy.get(fileInput.selector).attachFile('sample2.txt');

            // check for successful attachment of file in the view
            checkFileNamesInFileAttachmentView(fileInput.selector, fileInput.fileNames);
            if(fileInput.multiple)
                checkFileNamesInFileAttachmentView(fileInput.selector, ['sample2.txt']);

            // check preview of the file
            checkFilePreviewInFileAttachment(fileInput.selector);

            if(fileInput.multiple)
                deleteSelectedFiles(fileInput.selector, ['sample2.txt']);

            // submit the form
            cy.get(".cmp-adaptiveform-button__widget").click();

            // check for successful submission
            submitTest();
        })

        it(`${fileInput.type} - attach files using drag and drop, check model, view, preview attachment and submit the form`, () => {
            cy.previewForm(pagePath, {
                onBeforeLoad : (win) => {
                    cy.stub(win, 'open'); // creating a stub to check file preview
                }
            });

            // attach the file
            cy.get(fileInput.selector).attachFile(fileInput.fileNames, { subjectType: 'drag-n-drop', events: ['dragover', 'drop'] });
            if(fileInput.multiple)
                cy.get(fileInput.selector).attachFile('sample2.txt');

            // check for successful attachment of file in the view
            checkFileNamesInFileAttachmentView(fileInput.selector, fileInput.fileNames);
            if(fileInput.multiple)
                checkFileNamesInFileAttachmentView(fileInput.selector, ['sample2.txt']);

            // check preview of the file
            checkFilePreviewInFileAttachment(fileInput.selector);

            if(fileInput.multiple)
                deleteSelectedFiles(fileInput.selector, ['sample2.txt']);

            // submit the form
            cy.get(".cmp-adaptiveform-button__widget").click();

            // check for successful submission
            submitTest();
        })

        it(`${fileInput.type} - view prefill of submitted form, make changes to attachments and submit`, () => {
            cy.get("@prefillId").then(id => {
                cy.previewForm(pagePath, {
                    params: [`prefillId=${id}`],
                    onBeforeLoad(win) {
                        cy.stub(win, 'open'); // creating a stub to check file preview
                    }
                });

                // check if files were prefilled
                checkFileNamesInFileAttachmentView(fileInput.selector, fileInput.fileNames);

                // check if guideBridge API returns file attachments correctly
                getFormObjTest(['empty.pdf', ...(fileInput.multiple ? ['sample.txt']: []) ]);

                // check the preview of the file attachment
                checkFilePreviewInFileAttachment(fileInput.selector);

                // add new files after preview to both the component
                cy.get(fileInput.selector).attachFile(['sample2.txt'])

                // check if guideBridge API returns correctly after prefill and attaching more files
                getFormObjTest(['sample2.txt', ...(fileInput.multiple ? ['sample.txt', 'empty.pdf']: []) ]);

                // submit the form
                cy.get(".cmp-adaptiveform-button__widget").click();

                // check if submission is success
                submitTest();
            });
        });

        it(`${fileInput.type} - prefill of submitted prefilled form`, () => {
            cy.get("@prefillId").then(id => {
                cy.previewForm(pagePath, {
                    params: [`prefillId=${id}`],
                    onBeforeLoad(win) {
                        cy.stub(win, 'open'); // creating a stub to check file preview
                    }
                });

                // check if files were prefilled
                checkFileNamesInFileAttachmentView(fileInput.selector, ['sample2.txt', ...(fileInput.multiple ? ['sample.txt', 'empty.pdf']: []) ]);
                getFormObjTest(['sample2.txt', ...(fileInput.multiple ? ['sample.txt', 'empty.pdf']: []) ]);

                // check if file preview works fine after prefill
                checkFilePreviewInFileAttachment(fileInput.selector);
            });

        });
    })

});
