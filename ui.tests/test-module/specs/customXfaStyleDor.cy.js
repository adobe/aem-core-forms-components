/*
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 * Copyright 2025 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */

const sitesSelectors = require('../libs/commons/sitesSelectors'),
    afConstants = require('../libs/commons/formsConstants');

describe ('Custom XFA Style in Document of Record', () => {
    const formPath = "/content/forms/af/core-components-it/samples/document-of-record/dor-form",
        textInputEditPath = formPath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/textinput",
        textInputEditPathSelector = "[data-path='" + textInputEditPath + "']",
        formContainerEditPath = formPath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX,
        formContainerPathSelector = "[data-path='" + formContainerEditPath + "']";

    it('select a custom template', () => {
        cy.openAuthoring(formPath);
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + formContainerPathSelector);
        cy.invokeEditableAction("[data-action='dor']");
        cy.get('coral-select[name="template"]').click();
        cy.get('coral-popover:visible').within(() => {
            cy.get('coral-selectlist-item').contains('Custom').click();
        });
        cy.get('foundation-autocomplete[name="./metaTemplateRef"] input[is="coral-textfield"]').type('/content/src/main/content/jcr_root/content/dam/formsanddocuments/core-components-it/customTemplate', { force: true });
    });

    it('dropdown for custom XFA style exist in the field', () => {
        cy.openAuthoring(formPath);
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + textInputEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']");
        cy.get(".cmp-adaptiveform-textinput__editdialog coral-tab-label:contains('Document of Record')").click();
        cy.get('coral-select[name="./dorFieldStyling"]').should('exist');
    });
});