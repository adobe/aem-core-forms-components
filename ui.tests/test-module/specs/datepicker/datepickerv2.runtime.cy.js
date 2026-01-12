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

describe("Form Runtime with Date Picker v2", () => {

    const pagePath = "content/forms/af/core-components-it/samples/datepicker/basic.html";
    const bemBlock = "cmp-adaptiveform-datepicker";
    let formContainer = null;

    beforeEach(() => {
        cy.previewForm(pagePath).then(p => {
            formContainer = p;
        });
    });

    const openFirstDatepickerCalendar = () => {
        cy.get(`.${bemBlock}__calendar-icon`).first().as("calendarIcon");
        cy.get("@calendarIcon").should("exist").click({ force: true });
        cy.get(".datetimepicker").should("be.visible");
        cy.get(".dp-monthview").should("exist");
    };

    it("should open calendar with keyboard on calendar icon (Space/Enter)", () => {
        expect(formContainer, "formcontainer is initialized").to.not.be.null;
        cy.get(`.${bemBlock}__calendar-icon`).first().as("calendarIcon");
        cy.get("@calendarIcon").should("exist").focus();

        cy.get("@calendarIcon").type(" ", { force: true });
        cy.get(".datetimepicker").should("be.visible");
        cy.get(".dp-monthview").should("exist");

        cy.get("body").click(0, 0, { force: true });
        cy.get(".datetimepicker").should("not.be.visible");

        cy.get("@calendarIcon").focus().type("{enter}", { force: true });
        cy.get(".datetimepicker").should("be.visible");
        cy.get(".dp-monthview").should("exist");
    });
});


