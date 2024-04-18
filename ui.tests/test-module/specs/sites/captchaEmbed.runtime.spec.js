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
describe("Captcha In Sites Runtime Test", () => {
    const pagePath = "content/forms/sites/core-components-it/site-with-captcha-afv2-form.html";
    const hCaptchaPagePath = "content/forms/sites/core-components-it/site-with-hcaptcha-afv2-form.html";

    let formContainer = null;


    it("captcha should render when form is embedded in site", () => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
            const [id, fieldView] = Object.entries(formContainer._fields)[0]
            const model = formContainer._model.getElement(id)
            cy.get('#' + id + ' .cmp-adaptiveform-recaptcha__widget > div.g-recaptcha').should('exist');
        })
    })

    it("hcaptcha should render when form is embedded in site", () => {
        cy.previewForm(hCaptchaPagePath).then(p => {
            formContainer = p;
            expect(formContainer, "formcontainer is initialized").to.not.be.null;
            expect(formContainer._model.items.length, "model and view elements match").to.equal(Object.keys(formContainer._fields).length);
            const [id, fieldView] = Object.entries(formContainer._fields)[0]
            const model = formContainer._model.getElement(id)
            cy.get('#' + id + ' .cmp-adaptiveform-hcaptcha__widget > div.h-captcha').should('exist');
        })
    })

})
