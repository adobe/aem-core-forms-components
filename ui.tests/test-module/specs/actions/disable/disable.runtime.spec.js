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
describe("Disable Form Test", () => {
    const pagePath = "content/forms/af/core-components-it/samples/actions/reset/basic.html"
    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        })
    });
    const components = ["adaptiveFormTextInput", "adaptiveFormNumberInput", "adaptiveFormDropDown", "adaptiveFormDatePicker", "adaptiveFormEmailInput", "adaptiveFormCheckBoxGroup", "adaptiveFormRadioButton", "adaptiveFormFileInput", "adaptiveFormTelephoneInput"];

    it(`Check for disable functionality`,() => {
        // disable form
        cy.window().then($window => {
            $window.guideBridge.disableForm();
        });
        // check if form components are disabled
        components.forEach((coreComponent) => {
            cy.get(`[data-cmp-is="${coreComponent}"]`)
                .should('be.visible')
                .invoke('attr', 'data-cmp-enabled')
                .should('eq', 'false');
        });
    });
});