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

const sitesSelectors = require('../../libs/commons/sitesSelectors'),
    afConstants = require('../../libs/commons/formsConstants');

// FT_FORMS-24887 adds an "Exclude file attachments from Document of Record"
// checkbox in the form container's DoR section. The checkbox itself is
// gated on FT_FORMS-24887 and the surrounding DoR section is gated on
// FT_FORMS-21919 — both must be enabled for the field to render and for
// editDialog.js's visibility transitions to be observable.
describe("Form Container - Document of Record Feature Toggles", () => {
    if (cy.af.isLatestAddon()) {

        const EXCLUDE_ATTACHMENTS_FIELD = "[name='./excludeAttachmentsFromDor']";
        const DOR_TEMPLATE_REF_FIELD = ".cmp-adaptiveform-container__dortemplateref";
        const AUTO_GENERATE_DOR_PANEL = ".cmp-adaptiveform-container__dordetails";
        const DOR_TYPE_RADIO = (value) =>
            ".cmp-adaptiveform-container__dortypeselector input[type='radio'][value='" + value + "']";

        // Both toggles must be enabled: FT_FORMS-21919 makes the DoR
        // tab render, FT_FORMS-24887 makes the new checkbox render.
        // Hoisted to the parent describe so the OSGi config is flipped
        // exactly once per spec run rather than per child describe.
        before(() => {
            cy.enableFeatureToggle("FT_FORMS-21919");
            cy.enableFeatureToggle("FT_FORMS-24887");
        });

        after(() => {
            cy.disableFeatureToggle("FT_FORMS-24887");
            cy.disableFeatureToggle("FT_FORMS-21919");
        });

        // Guard: skip silently when toggles are not active in this run
        // (matches the without-ft CI job pattern in panelcontainer.featuretoggles.cy.js).
        const whenTogglesActive = (callback) => {
            cy.fetchFeatureToggles().then((response) => {
                if (response.status !== 200
                    || !response.body.enabled.includes("FT_FORMS-24887")
                    || !response.body.enabled.includes("FT_FORMS-21919")) {
                    return;
                }
                callback();
            });
        };

        // Helper: open the DoR tab inside the form container's edit dialog
        const openDorTab = (formContainerEditPathSelector) => {
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + formContainerEditPathSelector);
            cy.invokeEditableAction("[data-action='CONFIGURE']");
            cy.get('.cmp-adaptiveform-container__editdialog')
                .contains('Document of Record')
                .click({ force: true });
        };

        // Helper: assert that a field is visible (not hidden) in the dialog
        const expectVisible = (selector) => {
            cy.get(selector).should('not.have.attr', 'hidden');
        };

        // Helper: assert that a field is hidden (the [hidden] attribute is set
        // by manageElementVisibility() in editDialog.js — the element stays in
        // the DOM, only its visibility flips)
        const expectHidden = (selector) => {
            cy.get(selector).should('have.attr', 'hidden');
        };

        describe("FT_FORMS-24887 — excludeAttachmentsFromDor checkbox visibility (form editor)", () => {

            const pagePath = "/content/forms/af/core-components-it/blank";
            const formContainerEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX;
            const formContainerEditPathSelector = "[data-path='" + formContainerEditPath + "']";

            beforeEach(() => {
                cy.openAuthoring(pagePath);
            });

            it("checkbox is hidden when DoR type is 'none'", () => {
                whenTogglesActive(() => {
                    openDorTab(formContainerEditPathSelector);

                    cy.get(DOR_TYPE_RADIO("none")).click({ force: true });

                    expectHidden(EXCLUDE_ATTACHMENTS_FIELD);
                    expectHidden(DOR_TEMPLATE_REF_FIELD);
                    expectHidden(AUTO_GENERATE_DOR_PANEL);

                    cy.get('.cq-dialog-cancel').click();
                });
            });

            it("checkbox becomes visible when DoR type is switched to 'select'", () => {
                whenTogglesActive(() => {
                    openDorTab(formContainerEditPathSelector);

                    cy.get(DOR_TYPE_RADIO("select")).click({ force: true });

                    expectVisible(EXCLUDE_ATTACHMENTS_FIELD);
                    expectVisible(DOR_TEMPLATE_REF_FIELD);
                    expectHidden(AUTO_GENERATE_DOR_PANEL);

                    cy.get('.cq-dialog-cancel').click();
                });
            });

            it("checkbox stays visible when DoR type is switched to 'generate' in form editor", () => {
                // In the form editor branch of handleDorTypeSelection, dorType=generate
                // hides the auto-generate panel but keeps the new checkbox visible.
                whenTogglesActive(() => {
                    openDorTab(formContainerEditPathSelector);

                    cy.get(DOR_TYPE_RADIO("generate")).click({ force: true });

                    expectVisible(EXCLUDE_ATTACHMENTS_FIELD);
                    expectHidden(DOR_TEMPLATE_REF_FIELD);
                    expectHidden(AUTO_GENERATE_DOR_PANEL);

                    cy.get('.cq-dialog-cancel').click();
                });
            });

            it("checkbox is hidden again when DoR type is switched back to 'none'", () => {
                whenTogglesActive(() => {
                    openDorTab(formContainerEditPathSelector);

                    // Drive a full transition: select → none. This exercises the
                    // hideElements + deleteFields branch for excludeAttachmentsFromDor.
                    cy.get(DOR_TYPE_RADIO("select")).click({ force: true });
                    expectVisible(EXCLUDE_ATTACHMENTS_FIELD);

                    cy.get(DOR_TYPE_RADIO("none")).click({ force: true });
                    expectHidden(EXCLUDE_ATTACHMENTS_FIELD);

                    // The @Delete hidden input is appended to the form when the
                    // field is in the deleteFields list (manageDeleteFields with
                    // shouldDelete=true). It is the contract that prevents a
                    // stale value from being persisted.
                    cy.get("input[name='./excludeAttachmentsFromDor@Delete']").should('exist');

                    cy.get('.cq-dialog-cancel').click();
                });
            });
        });

        describe("FT_FORMS-24887 — excludeAttachmentsFromDor visibility (sites editor)", () => {

            // In the sites editor branch (isFormEditor() === false), dorType=generate
            // shows BOTH the auto-generate panel AND the exclude-attachments checkbox.
            const pagePath = "/content/core-components-examples/library/adaptive-form/container";
            const formContainerEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/formContainer";
            const formContainerEditPathSelector = "[data-path='" + formContainerEditPath + "']";

            beforeEach(() => {
                cy.openAuthoring(pagePath);
            });

            it("checkbox AND auto-generate panel are both visible when DoR type is 'generate'", () => {
                whenTogglesActive(() => {
                    openDorTab(formContainerEditPathSelector);

                    cy.get(DOR_TYPE_RADIO("generate")).click({ force: true });

                    expectVisible(EXCLUDE_ATTACHMENTS_FIELD);
                    expectVisible(AUTO_GENERATE_DOR_PANEL);
                    expectHidden(DOR_TEMPLATE_REF_FIELD);

                    cy.get(sitesSelectors.confirmDialog.actions.first).click();
                });
            });
        });
    }
});
