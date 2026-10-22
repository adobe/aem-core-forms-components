/*******************************************************************************
 * Copyright 2026 Adobe
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

describe("Form Runtime with Custom File Upload", () => {
    const pagePath = "/content/forms/af/core-components-it/samples/fileinput/customfileinput/custom-file-uploader.html";
    const bemBlock = 'cmp-adaptiveform-fileinput';
    const selectors = {
        customFileUpload: `[data-cmp-is="adaptiveFormCustomFileInput"]`,
        widget: `.${bemBlock}__widget`,
        button: `.${bemBlock}__widgetlabel`,
        fileName: `.${bemBlock}__filename`,
        fileDelete: `.${bemBlock}__filedelete`,
    };

    let formContainer = null;

    const getSingleFileInput = () => {
        return cy.get(selectors.customFileUpload).find(`${selectors.widget}:not([multiple])`).first();
    };

    const getMultiFileInput = () => {
        return cy.get(selectors.customFileUpload).find(`${selectors.widget}[multiple]`).first();
    };

    const stubConsoleLog = () => {
        cy.window().then((win) => {
            cy.stub(win.console, "log").as("consoleLog");
        });
    };

    const assertExportDataForInput = (inputSelector, expectedFileNames) => {
        const expected = Array.isArray(expectedFileNames) ? expectedFileNames : [expectedFileNames];
        cy.get(inputSelector)
            .invoke("attr", "name")
            .then((fieldName) => {
                cy.window().then((win) => {
                    const bridge = win.guideBridge;
                    cy.wrap(null).should(() => {
                        const data = bridge.getFormModel().exportData();
                        const fieldData = data[fieldName];
                        if (expected.length === 0) {
                            const isEmpty = fieldData == null || (Array.isArray(fieldData) && fieldData.length === 0);
                            expect(isEmpty, "export data should be empty").to.be.true;
                            return;
                        }
                        const values = Array.isArray(fieldData) ? fieldData : [fieldData];
                        expect(values).to.have.length(expected.length);
                        expected.forEach((fileName) => {
                            const value = values.find((item) => item?.name === fileName);
                            expect(value, `export data should include ${fileName}`).to.exist;
                            expect(value).to.include.keys("name", "size", "mediaType", "data");
                            expect(value.data).to.equal(`/services/s3/presign/${fileName}`);
                            expect(value.size).to.equal(0);
                        });
                    });
                });
            });
    };

    before(() => {
        cy.attachConsoleErrorSpy();
    });

    beforeEach(() => {
        cy.previewForm(pagePath, {
            onBeforeLoad : (win) => {
                cy.stub(win, 'open');
            }
        }).then(p => {
            formContainer = p;
        });
        stubConsoleLog();
    });

    it("should render custom file input with button tag", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.get(selectors.customFileUpload).should('have.length.at.least', 1);
        cy.get(selectors.customFileUpload)
            .find(selectors.button)
            .should('have.prop', 'tagName', 'BUTTON')
            .and('have.attr', 'type', 'button');
        cy.get(selectors.customFileUpload)
            .find(selectors.widget)
            .should('have.attr', 'type', 'file')
            .and('not.be.visible');
        cy.expectNoConsoleErrors();
    });

    it("attach file and check for the submitted value", () => {
        const sampleFileName = "sample.txt";
        getSingleFileInput().should("exist").then(($input) => {
            const fileInput = $input;
            cy.wrap(fileInput).should("have.value", "");
            cy.attachFile(fileInput, [sampleFileName]).then(() => {
                cy.get(selectors.fileName).contains(sampleFileName);
            });
            cy.get("@consoleLog").should("be.calledWith", "file uploaded successfully");
            assertExportDataForInput(fileInput, sampleFileName);
        });
        cy.expectNoConsoleErrors();
    });

    it("should not upload invalid files", () => {
        const fileName = "test.bat";
        getSingleFileInput().should("exist").then(($input) => {
            const fileInput = $input;
            cy.attachFile(fileInput, [fileName]);
            cy.get(selectors.fileName).should("have.length", 0);
            cy.get("@consoleLog").should("not.be.calledWith", "file uploaded successfully");
            assertExportDataForInput(fileInput, []);
        });
        cy.expectNoConsoleErrors();
    });

    it("should replace single file on re-attach", () => {
        const firstFile = "sample.txt";
        const secondFile = "sample2.txt";
        getSingleFileInput().should("exist").then(($input) => {
            const fileInput = $input;
            cy.attachFile(fileInput, [firstFile]);
            cy.get("@consoleLog").should("be.calledWith", "file uploaded successfully");
            assertExportDataForInput(fileInput, firstFile);
            cy.attachFile(fileInput, [secondFile]);
            cy.get("@consoleLog").should("be.calledWith", "file uploaded successfully");
            assertExportDataForInput(fileInput, secondFile);
            cy.get(selectors.fileName).should("have.length", 1);
        });
        cy.expectNoConsoleErrors();
    });

    it("should export data for multiple uploaded files, after delete and re-add", () => {
        const initialFiles = ["sample.txt", "sample2.txt"];
        getMultiFileInput().should("exist").then(($input) => {
            const fileInput = $input;
            cy.attachFile(fileInput, initialFiles);
            cy.get("@consoleLog").should("be.calledWith", "file uploaded successfully");
            assertExportDataForInput(fileInput, initialFiles);

            cy.get(selectors.fileDelete).first().click();
            assertExportDataForInput(fileInput, ["sample2.txt"]);

            cy.attachFile(fileInput, ["test.bat"]);
            assertExportDataForInput(fileInput, ["sample2.txt"]);

            cy.attachFile(fileInput, ["sample.svg"]);
            cy.get("@consoleLog").should("be.calledWith", "file uploaded successfully");
            assertExportDataForInput(fileInput, ["sample2.txt", "sample.svg"]);
        });
        cy.expectNoConsoleErrors();
    });

    it("should clear export data after deleting all files", () => {
        const files = ["sample.txt", "sample2.txt"];
        getMultiFileInput().should("exist").then(($input) => {
            const fileInput = $input;
            cy.attachFile(fileInput, files);
            cy.get("@consoleLog").should("be.calledWith", "file uploaded successfully");
            cy.get(selectors.fileDelete).first().click();
            cy.get(selectors.fileDelete).first().click();
            cy.get(selectors.fileName).should("have.length", 0);
            assertExportDataForInput(fileInput, []);
        });
        cy.expectNoConsoleErrors();
    });
});
