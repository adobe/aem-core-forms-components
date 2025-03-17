/*******************************************************************************
 * Copyright 2025 Adobe
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
describe("Form Runtime with Text Input", () => {

    before(() => {
        cy.attachConsoleErrorSpy();
    });

    const pagePath = "content/forms/af/core-components-it/samples/textinput/custom_html.html"
    const bemBlock = 'cmp-adaptiveform-textinput'
    const IS = "adaptiveFormTextInput"
    const selectors = {
        textinput: `[data-cmp-is="${IS}"]`
    }

    let formContainer = null
    let toggle_array = [];

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
    });

    it("html changes are reflected in model while preserving custom structure for first two fields", () => {
        const fieldEntries = Object.entries(formContainer._fields);
        
        // Only test the first two fields
        const fieldsToTest = fieldEntries.slice(0, 2);
        
        // Check if we have at least one field to test
        if (fieldsToTest.length === 0) {
            cy.log('No fields found in the form');
            return;
        }
        
        // Test each of the first two fields
        cy.wrap(fieldsToTest).each((fieldEntry, index) => {
            debugger;
            const [id, fieldView] = fieldEntry;
            const model = formContainer._model.getElement(id);
            
            cy.log(`Testing field ${index + 1} with ID: ${id}`);
            
            // Get the initial label structure
            cy.get(`#${id}`).find("label").then($label => {
                if ($label.length === 0) {
                    cy.log(`Field ${index + 1} has no label, skipping`);
                    return;
                }
                
                const initialHTML = $label[0].innerHTML;
                const initialChildrenCount = $label[0].children.length;
                
                // Update the model with new label text
                const newLabelText = `Updated Label Text for Field ${index + 1}`;
                model.label = { value: newLabelText, richText: model.getState().label.richText };
                
                // Wait for DOM updates
                cy.wait(100);
                
                // Check that the label was updated
                cy.get(`#${id}`).find("label").then($updatedLabel => {
                    const updatedHTML = $updatedLabel[0].innerHTML;
                    const updatedChildrenCount = $updatedLabel[0].children.length;
                    
                    // Verify the model was updated
                    expect(model.getState().label.value).to.equal(newLabelText);
                    
                    // Verify the DOM structure was preserved
                    expect(updatedChildrenCount).to.equal(initialChildrenCount);
                    
                    // If there are child elements, verify they're still there
                    if (initialChildrenCount > 0) {
                        // Get all child element tag names before and after
                        const initialChildTags = Array.from($label[0].children).map(el => el.tagName);
                        const updatedChildTags = Array.from($updatedLabel[0].children).map(el => el.tagName);
                        
                        // Verify the same types of elements exist
                        expect(updatedChildTags).to.deep.equal(initialChildTags);
                        
                        // If there's a span with a specific class (like "Optional"), verify it's still there
                        const initialSpans = Array.from($label[0].querySelectorAll('span')).map(span => span.className);
                        const updatedSpans = Array.from($updatedLabel[0].querySelectorAll('span')).map(span => span.className);
                        
                        expect(updatedSpans).to.deep.equal(initialSpans);
                    }
                    
                    // Verify the text content was updated (should contain the new text)
                    expect($updatedLabel[0].textContent).to.include(newLabelText);
                    
                    cy.log(`Field ${index + 1} label update test passed`);
                });
            });
        });
        
        cy.expectNoConsoleErrors();
    });

});
