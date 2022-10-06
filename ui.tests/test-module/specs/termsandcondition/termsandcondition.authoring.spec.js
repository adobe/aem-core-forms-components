const sitesSelectors = require('../../libs/commons/sitesSelectors'),
    afConstants = require('../../libs/commons/formsConstants');

describe('Page - Authoring', function () {

  const dropTermsAndConditionInContainer = function() {
    const dataPath = "/content/forms/af/core-components-it/blank/jcr:content/guideContainer/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Terms And Conditions", afConstants.components.forms.resourceType.termsandcondition);
    cy.get('body').click( 0,0);
  }

  const dropTermsAndConditionInSites = function() {
    const dataPath = "/content/core-components-examples/library/adaptive-form/termsandcondition/jcr:content/root/responsivegrid/demo/component/container/*",
        responsiveGridDropZoneSelector = sitesSelectors.overlays.overlay.component + "[data-path='" + dataPath + "']";
    cy.selectLayer("Edit");
    cy.insertComponent(responsiveGridDropZoneSelector, "Adaptive Form Terms And Conditions", afConstants.components.forms.resourceType.termsandcondition);
    cy.get('body').click( 0,0);
  }

  const testTermsAndConditionBehaviour = function(termsAndConditionContainerEditPathSelector, termsAndConditionContainerDrop, isSites) {
    if (isSites) {
      dropTermsAndConditionInSites();
    } else {
      dropTermsAndConditionInContainer();
    }
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + termsAndConditionContainerEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']");
    cy.get("[name='./name']").should("exist");
    cy.get("[name='./jcr:title']").should("exist");
    cy.get("[name='./showAsLink']").should("exist");

    cy.get('.cq-dialog-cancel').click();
    cy.deleteComponentByPath(termsAndConditionContainerDrop);
  }

  const testTextBehaviour = function(textContainerEditPathSelector, textContainerDrop) {
    dropTermsAndConditionInContainer();
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + textContainerEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']");
    cy.get("[name='./name']").should("exist");
    cy.get('.cq-dialog-cancel').click();
    cy.deleteComponentByPath(textContainerDrop);
  }

  const testCheckboxBehaviour = function(checkboxContainerEditPathSelector, checkboxContainerDrop) {
    dropTermsAndConditionInContainer();
    cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + checkboxContainerEditPathSelector);
    cy.invokeEditableAction("[data-action='CONFIGURE']");
    cy.get("[name='./name']").should("exist");
    cy.get("[name='./jcr:title']").should("exist");
    // cy.get("[name='./hideTitle']").should("exist");
    // cy.get("[name='./enum']").should("exist");
    // cy.get("[name='./enumNames']").should("exist");
    cy.get('.cq-dialog-cancel').click();
    cy.deleteComponentByPath(checkboxContainerDrop);
  }

  context('Open Forms Editor', function() {
    const pagePath = "/content/forms/af/core-components-it/blank",
        termsAndConditionEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/termsandcondition",
        termsAndConditionContainerPathSelector = "[data-path='" + termsAndConditionEditPath + "']",
        textEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/termsandcondition/text",
        textPathSelector = "[data-path='" + termsAndConditionEditPath + "/text']",
        checkboxEditPath = pagePath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX + "/termsandcondition/checkbox",
        checkboxPathSelector = "[data-path='" + termsAndConditionEditPath + "/checkbox']:last";
    beforeEach(function () {
      cy.openAuthoring(pagePath);
    });

    it('insert Terms And Condition in form container', function () {
      dropTermsAndConditionInContainer();
      cy.deleteComponentByPath(termsAndConditionEditPath);
    });

    it ('open edit dialog of Terms And Condition', function(){
      testTermsAndConditionBehaviour(termsAndConditionContainerPathSelector, termsAndConditionEditPath);
    });

    it ('open edit dialog of Text', function(){
      testTextBehaviour(textPathSelector, textEditPath);
    });

    it ('open edit dialog of Checkbox', function(){
      testCheckboxBehaviour(checkboxPathSelector, checkboxEditPath);
    });
  })

  context('Open Sites Editor', function () {
    const pagePath = "/content/core-components-examples/library/adaptive-form/termsandcondition",
        termsAndConditionContainerEditPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/container/termsandcondition",
        termsAndConditionContainerEditPathSelector = "[data-path='" + termsAndConditionContainerEditPath + "']";

    beforeEach(function () {
      cy.openAuthoring(pagePath);
    });

    it('insert aem forms Terms And Condition', function () {
      dropTermsAndConditionInSites();
      cy.deleteComponentByPath(termsAndConditionContainerEditPath);
    });

    it('open edit dialog of aem forms Terms And Condition', function() {
      testTermsAndConditionBehaviour(termsAndConditionContainerEditPathSelector, termsAndConditionContainerEditPath, true);
    });

  });

});