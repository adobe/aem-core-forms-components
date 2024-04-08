const commons = require('../../libs/commons/commons'),
    sitesSelectors = require('../../libs/commons/sitesSelectors'),
    formsSelectors = require('../../libs/commons/guideSelectors'),
    afConstants = require('../../libs/commons/formsConstants');

describe('Rule editor authoring sanity for core-components',function(){

    const createRuleToHideTextInputOnButtonClick = function() {
        // Edit rule option not existing on button toolbar
        cy.get(formsSelectors.ruleEditor.action.editRule).should("exist");
        cy.initializeEventHandlerOnChannel("af-rule-editor-initialized").as("isRuleEditorInitialized");
        cy.get(formsSelectors.ruleEditor.action.editRule).click();

        // click on  create option from rule editor header
        cy.get("@isRuleEditorInitialized").its('done').should('equal', true);
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.createRuleButton).should("be.visible").click();

        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.sideToggleButton + ":first").click();

        // Forms Objects option is not existing on side panel
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.sidePanelFormObjectTab).should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.sidePanelFormObjectTab).then($el => {
            expect($el.text().trim()).to.equal("Form Objects");
        })

        // Functions option is not existing on side panel
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.sidePanelFunctionObjectTab).should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.sidePanelFunctionObjectTab).then($el => {
            expect($el.text().trim()).to.equal("Functions");
        })

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

        // check and click on dropdown to view the actions available
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.BLOCK_STATEMENT + " .choice-view-default").should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.BLOCK_STATEMENT + " .choice-view-default").click();

        // select HIDE action from dropdown
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.operator.HIDE).should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.operator.HIDE).click();

        cy.getRuleEditorIframe().find(".terminal-view.AFCOMPONENT.VARIABLE").should("be.visible");
        cy.getRuleEditorIframe().find(".terminal-view.AFCOMPONENT.VARIABLE").click();

        cy.getRuleEditorIframe().find(".terminal-view.AFCOMPONENT.VARIABLE coral-overlay.is-open .expression-selectlist coral-selectlist-item:first").click({force: true});

        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.saveRule).should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.saveRule).click();

        // check if rule is created
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.ruleSummary.CREATED_RULE).should("exist");

        // check and close rule editor
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.closeRuleEditor).should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.closeRuleEditor).click();
    }

    context('Open Forms Editor', function() {
        const formPath = "/content/forms/af/core-components-it/samples/ruleeditor/blank",
            formContainerPath = formPath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX,
            textinputEditPath = formContainerPath + "/" + afConstants.components.forms.resourceType.formtextinput.split("/").pop(),
            buttonEditPath = formContainerPath + "/" + afConstants.components.forms.resourceType.formbutton.split("/").pop(),
            buttonEditPathSelector = "[data-path='" + buttonEditPath + "']";

        /**
         * RuleSanity for button to change label of textbox
         * [To add rule on button item so that when it get clicked
         * the textbox field gets hidden]
         *
         * 1 Open the AdaptiveForm, check if editables are present.
         * 2 Insert Button component.
         * 3 Click on createRule option for button
         * 4 Click on 'Create Rule' button in rule-editor
         * 5 Click on 'Form Objects and Functions' label
         * 6 Check if Forms Object/Functions' Tabs are visible
         * 7 Select Button state 'is clicked' for rule trigger.
         * 8 Select HIDE action on trigger.
         * 9 select textbox to hide if this button is clicked
         * 10 Save rule.
         * 11 Check if rule is created
         * 12 Close rule editor
         * 13 Check if button is visible
         */
        it('should add rule on button to disable a text box', function () {
            cy.openAuthoring(formPath);
            cy.selectLayer("Edit");
            cy.get(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/*']").should("exist");

            cy.insertComponent(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/*']",
                "Adaptive Form Text Box", afConstants.components.forms.resourceType.formtextinput);
            cy.insertComponent(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/*']",
                "Adaptive Form Button", afConstants.components.forms.resourceType.formbutton);
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + buttonEditPathSelector);

            createRuleToHideTextInputOnButtonClick();
            cy.get(sitesSelectors.overlays.overlay.component + buttonEditPathSelector).should("exist");

            cy.selectLayer("Edit");
            cy.deleteComponentByPath(textinputEditPath);
            cy.deleteComponentByPath(buttonEditPath);
        })
    })

    context('Open Sites Editor', function() {
        const pagePath = "/content/forms/sites/core-components-it/ruleeditor",
            formContainerPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer",
            textinputEditPath = formContainerPath + "/" + afConstants.components.forms.resourceType.formtextinput.split("/").pop(),
            buttonEditPath = formContainerPath + "/" + afConstants.components.forms.resourceType.formbutton.split("/").pop(),
            buttonEditPathSelector = "[data-path='" + buttonEditPath + "']";

        /**
         * RuleSanity for button to change label of textbox
         * [To add rule on button item so that when it get clicked
         * the textbox field gets hidden]
         *
         * 1 Open the AdaptiveForm in sites editor, check if editables are present.
         * 2 Insert Button component.
         * 3 Click on createRule option for button
         * 4 Click on 'Create Rule' button in rule-editor
         * 5 Click on 'Form Objects and Functions' label
         * 6 Check if Forms Object/Functions' Tabs are visible
         * 7 Select Button state 'is clicked' for rule trigger.
         * 8 Select HIDE action on trigger.
         * 9 select textbox to hide if this button is clicked
         * 10 Save rule.
         * 11 Check if rule is created
         * 12 Close rule editor
         * 13 Check if button is visible
         */
        it('should add rule on button to disable a text box', function () {
            cy.openAuthoring(pagePath);
            cy.selectLayer("Edit");
            cy.get(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/*']").should("exist");

            cy.insertComponent(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/*']",
                "Adaptive Form Text Box", afConstants.components.forms.resourceType.formtextinput);
            cy.insertComponent(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/*']",
                "Adaptive Form Button", afConstants.components.forms.resourceType.formbutton);
            cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + buttonEditPathSelector);

            createRuleToHideTextInputOnButtonClick();
            cy.get(sitesSelectors.overlays.overlay.component + buttonEditPathSelector).should("exist");

            cy.selectLayer("Edit");
            cy.deleteComponentByPath(textinputEditPath);
            cy.deleteComponentByPath(buttonEditPath);
        })
    })
})