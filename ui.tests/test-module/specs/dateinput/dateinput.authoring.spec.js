/*
 *  Copyright 2022 Adobe Systems Incorporated
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

const sitesSelectors = require("../../libs/commons/sitesSelectors"),
  afConstants = require("../../libs/commons/formsConstants");

describe("Page - Authoring", function() {
  const dropDateInputInContainer = function() {
    const dataPath =
        "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
      responsiveGridDropZoneSelector =
        sitesSelectors.overlays.overlay.component +
        "[data-path='" +
        dataPath +
        "']";
    cy.selectLayer("Edit");
    cy.insertComponent(
      responsiveGridDropZoneSelector,
      "Adaptive Form Date Input",
      afConstants.components.forms.resourceType.dateinput
    );
    cy.get("body").click(0, 0);
  };

  const dropDateInputInSites = function() {
    const dataPath =
        "/content/core-components-examples/library/adaptive-form/dateinput/jcr:content/root/responsivegrid/demo/component/guideContainer/*",
      responsiveGridDropZoneSelector =
        sitesSelectors.overlays.overlay.component +
        "[data-path='" +
        dataPath +
        "']";
    cy.selectLayer("Edit");
    cy.log("test step 1" + responsiveGridDropZoneSelector);
    cy.insertComponent(
      responsiveGridDropZoneSelector,
      "Adaptive Form Date Input",
      afConstants.components.forms.resourceType.dateinput
    );
    cy.log("test step 2");
    cy.get("body").click(0, 0);
    cy.log("test step 3");
  };

  const testDateInputEditDialog = function(
    dateInputEditPathSelector,
    dateInputDrop,
    isSites
  ) {
    const bemEditDialog = ".cmp-adaptiveform-dateinput__editdialog";
    if (isSites) {
      dropDateInputInSites();
    } else {
      dropDateInputInContainer();
    }
    cy.openEditableToolbar(
      sitesSelectors.overlays.overlay.component + dateInputEditPathSelector
    );
    cy.invokeEditableAction("[data-action='CONFIGURE']").then(() => {
      cy.get(".cq-dialog-cancel")
        .click()
        .then(() => {
          cy.deleteComponentByPath(dateInputDrop);
        });
    });
  };

  const testDateInputBasicTab = function(
    dateInputEditPathSelector,
    dateInputDrop,
    isSites
  ) {
    const bemEditDialog = ".cmp-adaptiveform-dateinput__editdialog";
    if (isSites) {
      dropDateInputInSites();
    } else {
      dropDateInputInContainer();
    }
    cy.openEditableToolbar(
      sitesSelectors.overlays.overlay.component + dateInputEditPathSelector
    );
    cy.invokeEditableAction("[data-action='CONFIGURE']");
    cy.get("[name='./name']").should("exist");
    cy.get("[name='./jcr:title']").should("exist");

    cy.get(".cq-dialog-cancel").click();
    cy.deleteComponentByPath(dateInputDrop);
  };

  const testDateInputValidationTab = function(
    dateInputEditPathSelector,
    dateInputDrop,
    isSites
  ) {
    const bemEditDialog = ".cmp-adaptiveform-dateinput__editdialog";
    if (isSites) {
      dropDateInputInSites();
    } else {
      dropDateInputInContainer();
    }
    cy.openEditableToolbar(
      sitesSelectors.overlays.overlay.component + dateInputEditPathSelector
    );
    cy.invokeEditableAction("[data-action='CONFIGURE']");
    cy.get(bemEditDialog)
      .contains("Validation")
      .click()
      .then(() => {
        cy.get("[name='./minimumDate']").should("exist");
        cy.get("[name='./minimumMessage']").should("exist");
        cy.get("[name='./maximumDate']").should("exist");
        cy.get("[name='./maximumMessage']").should("exist");
        cy.get(".cq-dialog-cancel")
          .should("be.visible")
          .click()
          .then(() => {
            cy.deleteComponentByPath(dateInputDrop);
          });
      });
  };

  context("Open Forms Editor", function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
      dateInputEditPath =
        pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/dateinput",
      dateInputEditPathSelector = "[data-path='" + dateInputEditPath + "']",
      dateInputDrop =
        pagePath +
        afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX +
        "/" +
        afConstants.components.forms.resourceType.dateinput.split("/").pop();

    beforeEach(function() {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });
    it("default value showing in authoring", function() {
      dropDateInputInContainer();
      const validDate = "2021-12-12";
      cy.openEditableToolbar(
        sitesSelectors.overlays.overlay.component + dateInputEditPathSelector
      );
      cy.invokeEditableAction("[data-action='CONFIGURE']");
      cy.get('[name="./default"]')
        .clear()
        .focus()
        .type(validDate, { force: true });
      cy.get(".cq-dialog-submit")
        .should("be.visible")
        .click();
      cy.getContentIFrameBody()
        .find('.cmp-adaptiveform-dateinputField__widget[name="Year"]')
        .should("have.attr", "value", "2021");
      cy.getContentIFrameBody()
        .find('.cmp-adaptiveform-dateinputField__widget[name="Month"]')
        .should("have.attr", "value", "12");
      cy.getContentIFrameBody()
        .find('.cmp-adaptiveform-dateinputField__widget[name="Day"]')
        .should("have.attr", "value", "12");
      cy.deleteComponentByPath(dateInputDrop);
    });
    it("checking add and delete in form container", function() {
      dropDateInputInContainer();
      cy.deleteComponentByPath(dateInputDrop);
    });

    it("open edit dialog of DateInput", function() {
      testDateInputEditDialog(dateInputEditPathSelector, dateInputDrop);
      cy.deleteComponentByPath(dateInputDrop);
    });

    it(
      "verify Basic tab in edit dialog of DateInput",
      { retries: 3 },
      function() {
        cy.cleanTest(dateInputDrop).then(function() {
          testDateInputBasicTab(dateInputEditPathSelector, dateInputDrop);
        });
      }
    );

    it("verify Validation tab in edit dialog of DateInput", function() {
      testDateInputValidationTab(dateInputEditPathSelector, dateInputDrop);
    });
  });

  context("Open Sites Editor", function() {
    const pagePath =
        "/content/core-components-examples/library/adaptive-form/dateinput",
      dateInputEditPath =
        pagePath +
        afConstants.RESPONSIVE_GRID_DEMO_SUFFIX +
        "/guideContainer/dateinput",
      dateInputInsideSitesContainerEditPath =
        pagePath +
        afConstants.RESPONSIVE_GRID_DEMO_SUFFIX +
        "/guideContainer/container/dateinput_demo",
      dateInputEditPathSelector = "[data-path='" + dateInputEditPath + "']",
      dateInputInsideSitesContainerEditPathSelector =
        "[data-path='" + dateInputInsideSitesContainerEditPath + "']",
      dateInputDrop =
        pagePath +
        afConstants.RESPONSIVE_GRID_DEMO_SUFFIX +
        "/guideContainer/" +
        afConstants.components.forms.resourceType.dateinput.split("/").pop();

    beforeEach(function() {
      // this is done since cypress session results in 403 sometimes
      cy.openAuthoring(pagePath);
    });

    it("checking add and delete in form container", function() {
      dropDateInputInSites();
      cy.deleteComponentByPath(dateInputDrop);
    });

    it("open edit dialog of DateInput", function() {
      testDateInputEditDialog(dateInputEditPathSelector, dateInputDrop, true);
    });

    it("verify Basic tab in edit dialog of DateInput", function() {
      testDateInputBasicTab(dateInputEditPathSelector, dateInputDrop, true);
    });

    it("verify Validation tab in edit dialog of DateInput", function() {
      testDateInputValidationTab(
        dateInputEditPathSelector,
        dateInputDrop,
        true
      );
    });
  });
});
