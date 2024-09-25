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

const checkFileNamesInFileAttachmentView = (component, fileNames) => {
    // check if file present in view
    cy.get(component).then(() => {
        fileNames.forEach((fileName) => {
            cy.get(".cmp-adaptiveform-fileinput__filename").contains(fileName)
        })
    });
}

const checkFilePreviewInFileAttachment = (component) => {
    cy.window().then((win) => {
        cy.stub(win, 'open').as('open')
    })
    cy.get(component).then(() => {
        cy.get(".cmp-adaptiveform-fileinput__filename").each(($file) => {
            cy.wrap($file).click();
            cy.get('@open').should('be.called');
        })
    });
};


const getFormObjTest = (fileList) => {
    return cy.window().then((win) => {
        return new Promise((resolve, reject) => {
            win.guideBridge.getFormDataObject({
                "success": function (resultObj) {
                    try {
                        let afFormData = resultObj.data;
                        expect(afFormData).to.exist; // "af form data object not present in guideBridge#getFormDataObject API");
                        expect(afFormData.data).to.exist; // "form data not present in guideBridge#getFormDataObject API");
                        assert.equal(afFormData.attachments.length, fileList.length, "incorrect attachments returned from guideBridge#getFormDataObject API");
                        // checks if the right file names are present
                        fileList.forEach((file) => {
                            expect(afFormData.attachments.filter(e => e.name === file).length, `could not find ${file} attachment`).to.be.greaterThan(0);
                        });
                        // explicitly calling this to ensure there are no errors during this API invocation
                        let htmlFormData = afFormData.toHTMLFormData();
                        // Display the key/value pairs
                        for (var pair of htmlFormData.entries()) {
                            console.log(pair[0] + ', ' + pair[1]);
                        }
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }
            });
        });
    });
};

const multiSelectFileType = "input[name='fileinput1']";
const singleSelectStringType = "input[name='fileinput2']";
const singleSelectFileType = "input[name='fileinput3']";
const multiSelectStringType = "input[name='fileinput4']";

const fileInputs = [
    {
        type: "Single Select String Type",
        selector: singleSelectStringType,
        fileNames: ['empty.pdf'], multiple: false
    },
    {
        type: "Multi Select String Type",
        selector: multiSelectStringType,
        fileNames: ['empty.pdf', 'sample.txt'], multiple: true
    }
];


describe("Form with File Input - Prefill & Submit tests", () => {
    let prefillId;
    const submitBtn = "submit1673953138924";
    const pagePath = "/content/forms/af/core-components-it/samples/fileinput/fileinputstring/basic.html"


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


    fileInputs.forEach((fileInput, idx) => {
        it(`${fileInput.type} - attach files, check model, view, preview attachment and submit the form`, () => {
            cy.previewForm(pagePath, {
                onBeforeLoad: (win) => {
                    cy.stub(win, 'open'); // creating a stub to check file preview
                }
            });

            // attach the file
            cy.attachFile(fileInput.selector, fileInput.fileNames);
            if(fileInput.multiple)
                cy.attachFile(fileInput.selector, ['sample2.txt']);

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

                checkFilePreviewInFileAttachment(fileInput.selector);

                // check if guideBridge API returns file attachments correctly
                getFormObjTest(['empty.pdf', ...(fileInput.multiple ? ['sample2.txt', 'sample.txt']: []) ]).then(() => {
                    // add new files after preview to both the component
                    cy.attachFile(fileInput.selector, ['sample2.txt']).then(() => {
                        // check if guideBridge API returns correctly after prefill and attaching more files
                        getFormObjTest(['sample2.txt', ...(fileInput.multiple ? ['sample.txt', 'empty.pdf', 'sample2.txt']: []) ]).then(() => {
                            // submit the form
                            cy.get(".cmp-adaptiveform-button__widget").click();
                            // check if submission is success
                            submitTest();
                        })
                    });
                });

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
                getFormObjTest(['sample2.txt', ...(fileInput.multiple ? ['sample.txt', 'empty.pdf', 'sample2.txt']: []) ]);

            });

        });
    })

});
