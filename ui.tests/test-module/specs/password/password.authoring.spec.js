/*
 *  Copyright 2024 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

const sitesSelectors = require('../../libs/commons/sitesSelectors'),
    afConstants = require('../../libs/commons/formsConstants');

/**
 * Testing Password with Sites Editor
 */
describe('Page - Authoring', function () {
    // we can use these values to log in

    const dropPasswordInContainer = function () {
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Password Box", afConstants.components.forms.resourceType.password);
        cy.get('body').click(0, 0);
    }

    const dropPasswordInSites = function () {
        const dataPath = "/content/core-components-examples/library/adaptive-form/password/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.selectLayer("Edit");
        cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Password Box", afConstants.components.forms.resourceType.password);
        cy.get('body').click(0, 0);
    }

    const testPasswordBehaviour = function (passwordEditPathSelector, passwordDrop, isSites) {
        if (isSites) {
            dropPasswordInSites();
        } else {
            dropPasswordInContainer();
        }
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + passwordEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail

        // Checking some dynamic behaviours
        cy.get(".cmp-adaptiveform-password__maxlength").invoke('css', 'display').should('equal', 'block');
        cy.get(".cmp-adaptiveform-password__minlength").invoke('css', 'display').should('equal', 'block');
        cy.get(".cmp-adaptiveform-base__placeholder").parent('div').invoke('css', 'display').should('equal', 'block');
        cy.get('.cmp-adaptiveform-password__editdialog').contains('Validation').click({force: true}).then(() => {
            cy.get("[name='./validationPattern']").should('have.length', 1);
            cy.get("[name='./validatePictureClauseMessage']").should('have.length', 1);
            cy.get('.cq-dialog-cancel').click();
            cy.deleteComponentByPath(passwordDrop);
        })
    }

    const testCopyPasteComponent = function (passwordEditPathSelector, passwordEditPathSelectorCopy, passwordDrop) {
        dropPasswordInContainer();
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + passwordEditPathSelector);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
        // Check If Dialog Options Are Visible
        cy.get(".cmp-adaptiveform-base__editdialogbasic input[name='./name']")
            .should("exist")
            .should("be.visible");
        cy.get(".cmp-adaptiveform-base__editdialogbasic input[name='./name']").focus().clear();
        cy.get(".cmp-adaptiveform-base__editdialogbasic input[name='./name']").invoke('val', 'Password');
        cy.get(".cmp-adaptiveform-base__editdialogbasic input[name='./name']").focus().type("{enter}");
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + passwordEditPathSelector);
        cy.invokeEditableAction("[data-action='COPY']");
        const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
            responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
        cy.openEditableToolbar(responsiveGridDropZoneSelector);
        cy.invokeEditableAction("[data-action='PASTE']");
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + passwordEditPathSelectorCopy);
        cy.invokeEditableAction("[data-action='CONFIGURE']"); // this line is causing frame busting which is causing cypress to fail
        // Check If Dialog Options Are Visible
        cy.get(".cmp-adaptiveform-base__editdialogbasic [name='./name']")
            .should("exist")
            .should("have.value", "password_copy_1");
        cy.get("coral-dialog.is-open coral-dialog-footer button[variant='default']").click();
        cy.deleteComponentByPath(passwordDrop);
        cy.deleteComponentByPath(passwordDrop + "_copy");
    }

    const getRuleEditorIframe = () => {
        // get the iframe > document > body
        // and retry until the body element is not empty
        return cy
            .get('iframe#af-rule-editor')
            .its('0.contentDocument.body').should('not.be.empty')
            .then(cy.wrap)
    }

    context('Open Forms Editor', function () {
        const pagePath = "/content/forms/af/core-components-it/blank",
            passwordEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/password",
            passwordEditPathSelector = "[data-path='" + passwordEditPath + "']",
            passwordEditPathSelectorCopy = "[data-path='" + passwordEditPath + "_copy']",
            passwordDrop = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/" + afConstants.components.forms.resourceType.password.split("/").pop();
        beforeEach(function () {
            // this is done since cypress session results in 403 sometimes
            cy.openAuthoring(pagePath);
        });

        it('insert Password in form container', function () {
            dropPasswordInContainer();
            cy.deleteComponentByPath(passwordDrop);
        });

        it('open edit dialog of Password', function () {
            testPasswordBehaviour(passwordEditPathSelector, passwordDrop);
        })

        it.skip('pasted component should have unique name', function () {
            testCopyPasteComponent(passwordEditPathSelector, passwordEditPathSelectorCopy, passwordDrop);
        })
    })

  context('Open Sites Editor', function () {
    const   pagePath = "/content/core-components-examples/library/adaptive-form/password",
        passwordEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/password",
        passwordInsideSitesContainerEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer/container/password_demo",
        passwordEditPathSelector = "[data-path='" + passwordEditPath + "']",
        passwordInsideSitesContainerEditPathSelector = "[data-path='" + passwordInsideSitesContainerEditPath + "']",
        passwordDrop = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + '/guideContainer/' + afConstants.components.forms.resourceType.password.split("/").pop();

    beforeEach(function () {
      cy.openAuthoring(pagePath);
    });

    it('insert aem forms Password', function () {
      dropPasswordInSites();
      cy.deleteComponentByPath(passwordDrop);
    });

    it('open edit dialog of aem forms Password', function() {
      testPasswordBehaviour(passwordEditPathSelector, passwordDrop, true);
    });

    it('Test z-index of Rule editor iframe', function () {
            dropPasswordInSites();
            cy.openSidePanelTab("Content Tree");
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + passwordEditPathSelector);
            cy.invokeEditableAction("[data-action='editexpression']");
            cy.get("#af-rule-editor").should("be.visible");
            cy.get("#af-rule-editor")
                .invoke("css", "z-index")
                .should("equal", '10');
            getRuleEditorIframe().find("#objectNavigationTree").should("be.visible");
            getRuleEditorIframe().find("#create-rule-button").should("be.visible");
            cy.wait(1000)
            getRuleEditorIframe().find(".exp-Close-Button").should("be.visible").click();
            cy.deleteComponentByPath(passwordDrop);
        });
   
    it('Test z-index of Rule editor iframe for components inside site container', function () {
          cy.openSidePanelTab("Content Tree");
          cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + passwordInsideSitesContainerEditPathSelector);
          cy.invokeEditableAction("[data-action='editexpression']");
          cy.get("#af-rule-editor").should("be.visible");
          cy.get("#af-rule-editor")
              .invoke("css", "z-index")
              .should("equal", '10');
          getRuleEditorIframe().find("#objectNavigationTree").should("be.visible");
          getRuleEditorIframe().find("#objectNavigationTree " + passwordInsideSitesContainerEditPathSelector).should("be.visible");
          getRuleEditorIframe().find("#create-rule-button").should("be.visible");
          cy.wait(1000);
          getRuleEditorIframe().find(".exp-Close-Button").should("be.visible").click();
      });
  });
});
