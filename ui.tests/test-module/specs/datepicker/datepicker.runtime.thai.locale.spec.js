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
describe("Form Runtime with Date Picker", () => {

    const pagePath = "content/forms/af/core-components-it/samples/datepicker/basic.html"
    const bemBlock = 'cmp-adaptiveform-datepicker'

    let formContainer = null

    beforeEach(() => {
        cy.previewForm(pagePath, {"params" : ["afAcceptLang=th"]}).then(p => {
            formContainer = p;
        })
    });

   // Year should be in Buddhist calendar year for Thai language
   it("Test localisation for date picker for thai", () => {
       const [datePicker7, datePicker7FieldView] = Object.entries(formContainer._fields)[6];
       cy.get(`#${datePicker7}`).find(".cmp-adaptiveform-datepicker__calendar-icon").should("be.visible").click().then(() => {
           let todayDate = new Date();

           const dateFormat = new Intl.DateTimeFormat('th', {
               year: 'numeric',
               month : 'long'
           });

           const dateParts = dateFormat.formatToParts(todayDate);
           const yearObject = dateParts.find(yearObject => yearObject.type === "year");
           const monthObject = dateParts.find(monthObject => monthObject.type === "month");
           const localizedYear = convertNumberToLocale(Number(yearObject.value));
           const localizedMonth = monthObject.value;
           cy.get(".dp-caption").invoke("text").should("eq", localizedMonth + ', ' + localizedYear);
           cy.get(".dp-caption").click();
           cy.get(".dp-caption").invoke("text").should("eq", localizedYear);
           cy.get(".dp-rightnav").click();
       });
   });

      const convertNumberToLocale = function (number) {
           const zeroCode = 3664;
           number += "";
           let newNumber = [];
           for (let i = 0; i < number.length; i++) {
             newNumber.push(
                 String.fromCharCode(zeroCode + parseInt(number.charAt(i))));
           }
           return newNumber.join("");
         }



})