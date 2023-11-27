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
describe("Next Previous Button Test", () => {
    const pagePath = "content/forms/af/core-components-it/samples/actions/navigation/basic.html"
    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        });

    });
    const nextButton = '#nextitemnav-1d6ec8c53f > button';
    const prevButton = '#previtemnav-12d6415369 > button';
    const componentSelectors = ['#emailinput-d4b1212f37', '#numberinput-def5e91275', '#datepicker-b6ae4d4266', '#emailinput-142c629dd1','#textinput-6b40c861e9'] 

    it('Next button navigation - (FocusOption: nextItem)',() => {
        componentSelectors.forEach((component) => {
            cy.get(nextButton).click().then(() => {
                cy.get(component).should('be.visible').invoke('attr', 'data-cmp-active').should('eq', 'true');
            })
        });
    });

    // TODO: nextItemDeep test cases once implemented

    it('Previous button navigation - (FocusOption: previousItem)',() => {
        cy.get('#numberinput-88843055c8 > input').type(1);// setting active the last element in the form by typing
        componentSelectors.reverse().forEach((component) => {
            cy.get(prevButton).click().then(() => {
                cy.get(component).should('be.visible').invoke('attr', 'data-cmp-active').should('eq', 'true');
            })
        });
    });

    // TODO: previousItemDeep test cases once implemented
    
});