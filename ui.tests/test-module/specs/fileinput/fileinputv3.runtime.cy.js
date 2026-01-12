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
const checkFileNamesInFileAttachmentView = (component, fileNames) => {
    // check if file present in view
    cy.get(component).then(() => {
        fileNames.forEach((fileName) => {
            cy.get(".cmp-adaptiveform-fileinput__filename").contains(fileName)
        })
    });
}


const deleteSelectedFiles = (component, fileNames) => {
    cy.get(component).then(() => {
        fileNames.forEach((fileName) => {
            cy.get(".cmp-adaptiveform-fileinput__filename").contains(fileName).next().find('.cmp-adaptiveform-fileinput__filedelete').click();
        })
    });
};

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

describe("Form with File Input V-3 - Basic Tests", () => {

    const pagePath = "/content/forms/af/core-components-it/samples/fileinput/fileinputv3/basic.html"
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
        const passDisabledAttributeCheck = `${state.enabled === false || state.readOnly === true ? "" : "not."}have.attr`;
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
        cy.attachFile(fileInput, [sampleFileName]).then(() => {
            cy.get(".cmp-adaptiveform-fileinput__filename").contains(sampleFileName);
            cy.get(fileInput).should(($element) => {
                const actualValue = $element.val();
                expect(actualValue.includes("")).to.be.true;
            })
        });
        // attaching the same file again to check duplicate file attachment
        cy.attachFile(fileInput, [sampleFileName]).then(() => {
            cy.get(".cmp-adaptiveform-fileinput__filename").should('have.length', 2);
            cy.get(fileInput).should(($element) => {
                const actualValue = $element.val();
                expect(actualValue.includes("")).to.be.true;
            })
        });
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
                    if(model.readOnly) {
                        cy.get(`#${id}`).should('have.attr', 'data-cmp-readonly', 'true');
                    } else {
                        cy.get(`#${id}`).should('have.attr', 'data-cmp-readonly', 'false');
                    }
                    cy.attachFile(`#${id} input`, [fileName]).then(x => {
                        let expectedFileName = Array.isArray(model.getState().value) ? model.getState().value[0].name : model.getState().value.name;
                        expect(expectedFileName).to.equal(fileName)
                        cy.get(`#${id}`).should('have.class', 'cmp-adaptiveform-fileinput--filled');
                        cy.get(`#${id}`).find(".cmp-adaptiveform-fileinput__widget").should('have.attr', 'aria-invalid', 'false');
                    })
                }
            }
        });
        getFormObjTest(['empty.pdf', 'empty.pdf', 'empty.pdf', 'empty.pdf', 'empty.pdf'])
    });

    it("check delete functionality of duplicate files", () => {
        let sampleFileNames = ['sample2.txt', 'sample.txt', 'sample2.txt'];
        const fileInput = "input[name='fileinput1']";
        
        // Attach files
        cy.attachFile(fileInput, [sampleFileNames[0]]);
        cy.attachFile(fileInput, [sampleFileNames[1]]);
        cy.attachFile(fileInput, [sampleFileNames[2]]);

        deleteSelectedFiles(fileInput, sampleFileNames);

        cy.get('.cmp-adaptiveform-fileinput__fileitem').should('have.length', 0);
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

    it(`fielinput is disabled when readonly property is true`, () => {
        const fileInput5 =  "input[name='fileinput5']";
        cy.get(fileInput5).should("have.attr", "disabled", "disabled"); 
        cy.get(fileInput5).should("not.have.attr", "aria-disabled");
    });

})

describe('Click on button tag (V-3)', () => {
    const pagePath = "/content/forms/af/core-components-it/samples/fileinput/fileinputv3/basic.html"
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
    it('should handle click event on attach button', () => {
        const sampleFileName = 'empty.pdf'; // only pdf is alllowed
        const [id, fieldView] = Object.entries(formContainer._fields)[2]
        cy.get(`#${id} > .${bemBlock}__container > .${bemBlock}__dragarea > .${bemBlock}__widgetlabel`).should('exist').click().then(() => {
            cy.attachFile(`#${id} input[type="file"]`, [sampleFileName]).then(() => {
                cy.get('.cmp-adaptiveform-fileinput__filename').should('contain', sampleFileName);
            });
        });
    }); 
    it('should display an alert if the file size exceeds the maximum allowed size', () => {
       // Define the maximum file size (in bytes, e.g., 2MB)
        const maxFileSize = 2 * 1024 * 1024; // 2MB

        // Set up a stub for the alert message
        const expectedAlertMessage = `File(s) FileAttachment3mb.jpg are greater than the expected size: ${maxFileSize / (1024 * 1024)}MBMB.`;

        const fileInput = 'input[name=\'fileinput5\']';
        cy.attachFile(fileInput, ['FileAttachment3mb.jpg']);

        // Stub the window alert function
        cy.on('window:alert', (alertText) => {
            expect(alertText).to.equal(expectedAlertMessage);
        });

    });

    it('should display an error message configured by the user', () => {
        const [id, fieldView] = Object.entries(formContainer._fields)[5];
        const model = formContainer._model.getElement(id);

        const fileInput = 'input[name=\'fileinput6\']';
        cy.attachFile(fileInput, ['FileAttachment3mb.jpg']);
 
        cy.on('window:alert', (alertText) => {
            expect(alertText).to.equal(model.getState().constraintMessages.maxFileSize);
        });
     });

     it('file when uploaded again should give actual size', () => {
        let sampleFileNames = ['sample.svg'];
        const fileInput = "input[name='fileinput2']";
        cy.attachFile(fileInput, [sampleFileNames[0]]);
        cy.get('.cmp-adaptiveform-fileinput__filesize').should('contain.text', '508 bytes');
        cy.attachFile(fileInput, [sampleFileNames[0]]);
        cy.get('.cmp-adaptiveform-fileinput__filesize').should('contain.text', '508 bytes'); 
     })
    it(`file input should not support extenstion which are not in accept property`, () => {
        const fileInput7 =  "input[name='fileinput7']";
        cy.attachFile(fileInput7, ['sample.afe']);
        cy.get('.cmp-adaptiveform-fileinput__filelist')
            .children()
            .should('have.length', 0);
    });

    it(`fileinput should support custom file extensions`, () => {
        const fileInput7 =  "input[name='fileinput7']";
        cy.attachFile(fileInput7, ['sample.ifc']);
        cy.get('.cmp-adaptiveform-fileinput__filelist')
            .children()
            .should('have.length', 1)
            .and('contain.text', 'sample.ifc');
    });
})