const commons = require('../../../libs/commons/commons'),
    sitesSelectors = require('../../../libs/commons/sitesSelectors'),
    formsSelectors = require('../../../libs/commons/guideSelectors'),
    afConstants = require('../../../libs/commons/formsConstants');

// @arun to uncomment this soon
describe.skip('Rule editor navigate-in-panel rule authoring',function(){
    let toggle_array = [];

    before(() => {
        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
    });

    context('Open Forms Editor', function() {
        const formPath = "/content/forms/af/core-components-it/samples/ruleeditor/navigate-in-panel/blank",
            formContainerPath = formPath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX,
            buttonEditPath = formContainerPath + "/" + afConstants.components.forms.resourceType.formbutton.split("/").pop(),
            panelEditPath = formContainerPath + "/" + afConstants.components.forms.resourceType.panelcontainer.split("/").pop(),
            buttonEditPathSelector = "[data-path='" + buttonEditPath + "']";

        it('should add rule to focus previousItem in Panel on button click', function () {
            if (toggle_array.includes("FT_FORMS-10781")) {
                cy.openAuthoring(formPath);
                cy.selectLayer("Edit");
                cy.get(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/*']").should("exist");

                cy.insertComponent(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/*']",
                    "Adaptive Form Panel", afConstants.components.forms.resourceType.panelcontainer);
                cy.get(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/panelcontainer/*']").should("exist");
                cy.wait(1000);

                cy.insertComponent(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/panelcontainer/*']",
                    "Adaptive Form Text Box", afConstants.components.forms.resourceType.formtextinput);
                cy.insertComponent(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/panelcontainer/*']",
                    "Adaptive Form Text Box", afConstants.components.forms.resourceType.formtextinput);

                cy.insertComponent(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/*']",
                    "Adaptive Form Button", afConstants.components.forms.resourceType.formbutton);
                cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + buttonEditPathSelector);

                // Edit rule option not existing on button toolbar
                cy.get(formsSelectors.ruleEditor.action.editRule).should("exist");
                cy.initializeEventHandlerOnChannel("af-rule-editor-initialized").as("isRuleEditorInitialized");
                cy.get(formsSelectors.ruleEditor.action.editRule).click();

                // click on  create option from rule editor header
                cy.get("@isRuleEditorInitialized").its('done').should('equal', true);
                createNavigateInPanelRule();

                // check and close rule editor
                cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.closeRuleEditor).should("exist");
                cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.closeRuleEditor).click();

                cy.get(sitesSelectors.overlays.overlay.component + buttonEditPathSelector).should("exist");
                cy.selectLayer("Edit");
                cy.deleteComponentByPath(buttonEditPath);
                cy.deleteComponentByPath(panelEditPath);
            }
        })
    })

    const createNavigateInPanelRule = function() {
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.createRuleButton).should("be.visible").click();
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.sideToggleButton + ":first").click();

        // // Forms Objects option is not existing on side panel
        // cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.sidePanelFormObjectTab).should("exist");
        // cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.sidePanelFormObjectTab).then($el => {
        //     expect($el.text().trim()).to.equal("Form Objects");
        // })
        //
        // // Functions option is not existing on side panel
        // cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.sidePanelFunctionObjectTab).should("exist");
        // cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.sidePanelFunctionObjectTab).then($el => {
        //     expect($el.text().trim()).to.equal("Functions");
        // })

        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.STATEMENT + " .child-choice-name").should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.STATEMENT + " .child-choice-name").click();

        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.STATEMENT + " .expeditor-customoverlay.is-open coral-selectlist-item[value='EVENT_SCRIPTS']")
            .click({force: true});

        // select the component for which rule is to written i.e. Button here
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.EVENT_AND_COMPARISON_OPERATOR + " .choice-view-default").should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.EVENT_AND_COMPARISON_OPERATOR + " .choice-view-default").click();

        // IS CLICKED option not existing in 'OPERATIONS' dropdown
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.operator.IS_CLICKED).should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.operator.IS_CLICKED).click();

        // delete else block if present
        cy.getRuleEditorIframe().find(".else-section-button > .delete-else-button").then($el => {
            if ($el.length == 1) {
                cy.getRuleEditorIframe().find(".else-section-button > .delete-else-button").click();
            }
        });

        // check and click on dropdown to view the actions available
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.BLOCK_STATEMENT + " .choice-view-default").should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.BLOCK_STATEMENT + " .choice-view-default").click({multiple: true, force: true});

        // select HIDE action from dropdown
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.operator.NAVIGATE_IN_PANEL).should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.operator.NAVIGATE_IN_PANEL).click({force: true});

        cy.getRuleEditorIframe().find(".PANEL_FOCUS_OPTION").should("exist");
        cy.getRuleEditorIframe().find(".PANEL_FOCUS_OPTION").click();

        cy.getRuleEditorIframe().find(".PANEL_FOCUS_OPTION coral-selectlist [value='PREVIOUS_ITEM']").click({force: true});

        cy.getRuleEditorIframe().find(".terminal-view.PANEL.VARIABLE").should("be.visible");
        cy.getRuleEditorIframe().find(".terminal-view.PANEL.VARIABLE").click();

        cy.getRuleEditorIframe().find(".terminal-view.PANEL.VARIABLE coral-overlay.is-open .expression-selectlist coral-selectlist-item:first").click({force: true});

        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.saveRule).should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.saveRule).click();

        // check if rule is created
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.ruleSummary.CREATED_RULE).should("exist");
    }
})
