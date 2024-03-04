const commons = require('../../libs/commons/commons'),
    sitesSelectors = require('../../libs/commons/sitesSelectors'),
    afConstants = require('../../libs/commons/formsConstants');

describe('Rule editor sanity for core-components',function(){
    const formPath = "/content/forms/af/core-components-it/samples/ruleeditor/blank",
        formContainerPath = formPath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX,
        textBoxEditPath = formContainerPath + "/" +  afConstants.components.forms.resourceType.formtextinput.split("/").pop(),
        buttonPath = formContainerPath + "/" +  afConstants.components.forms.resourceType.formbutton.split("/").pop();

    beforeEach(function() {
        // this is done since cypress session results in 403 sometimes
        cy.openAuthoring(pagePath);
    })

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

        cy.insertComponentInPanel(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/*']",
            "Adaptive Form Text Box", afConstants.components.forms.resourceType.formtextinput);
        cy.insertComponentInPanel(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/*']",
            "Adaptive Form Button", afConstants.components.forms.resourceType.formbutton);
        cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + "[data-path='" + buttonPath + "']");
        // Edit rule option not existing on button toolbar
        cy.get(formsSelectors.ruleEditor.action.editRule).should("exist");
        cy.initializeEventHandlerOnChannel("af-rule-editor-initialized").as("isRuleEditorInitialized");
        cy.get(formsSelectors.ruleEditor.action.editRule).click();

        //4 click on  create option from rule editor header
        cy.get("@isRuleEditorInitialized").its('done').should('equal', true);
        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.action.createRuleButton).should("be.visible").click();

        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.action.sideToggleButton + ":first").click();

        // "Forms Objects option is not existing on side panel"
        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.action.formObjectsTab).should("exist");
        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.action.formObjectsTab + ":first").then($el => {
            expect($el.text().trim()).to.equal("Form Objects");
        })

        // Functions option is not existing on side panel
        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.action.functionsTab).should("exist");
        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.action.functionsTab).then($el => {
            expect($el.text().trim()).to.equal("Functions");
        })

        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.choiceModels.STATEMENT + " .child-choice-name").should("exist");
        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.choiceModels.STATEMENT + " .child-choice-name").click();

        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.choiceModels.STATEMENT + " .expeditor-customoverlay.is-open coral-selectlist-item[value='EVENT_SCRIPTS']")
            .click({force: true});

        //7 select the component for which rule is to written i.e. Button here
        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.choiceModels.EVENT_AND_COMPARISON_OPERATOR + " .choice-view-default").should("exist");
        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.choiceModels.EVENT_AND_COMPARISON_OPERATOR + " .choice-view-default").click();

        // IS CLICKED ooption not existing in 'OPERATIONS' dropdown
        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.operator.IS_CLICKED).should("exist");
        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.operator.IS_CLICKED).click();

        // check and click on dropdown to view the actions available
        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.choiceModels.BLOCK_STATEMENT + " .choice-view-default").should("exist");
        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.choiceModels.BLOCK_STATEMENT + " .choice-view-default").click();

        //8 select HIDE action from dropdown
        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.operator.HIDE).should("exist");
        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.operator.HIDE).click();

        cy.getRuleEditorFrame().find(".terminal-view.AFCOMPONENT.VARIABLE").should("be.visible");
        cy.getRuleEditorFrame().find(".terminal-view.AFCOMPONENT.VARIABLE").click();

        cy.getRuleEditorFrame().find(".terminal-view.AFCOMPONENT.VARIABLE coral-overlay.is-open .expression-selectlist coral-selectlist-item:first").click({force:true});

        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.action.saveRule).should("exist");
        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.action.saveRule).click();

        //11 check if rule is created
        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.ruleSummary.CREATED_RULE).should("exist");

        //12 check and close rule editor
        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.action.closeRuleEditor).should("exist");
        cy.getRuleEditorFrame().find(formsSelectors.ruleEditor.action.closeRuleEditor).click();

        cy.get(sitesSelectors.overlays.overlay.component + "[data-path='" + buttonPath + "']").should("exist");
    })


    /**
     * 14 Move to preview mode and check if button is visible.
     * 15 Click on button item.
     * 16 Textbox will get hidden
     * 17 Switch to edit Mode.
     * 18 Delete textbox and button.
     */

    it('should execute rule to hide textbox on button click at runtime', function () {
        cy.openPage(formPath + ".html?wcmmode=disabled");
        cy.waitForFormInit().then(formContainer => {
            console.log("Form container Initialized");
        })
        cy.get(".cmp-adaptiveform-textinput[data-cmp-is='adaptiveFormTextInput']")
            .scrollIntoView()
            .should("be.visible");

        //15 Check if Button is available in preview mode
        cy.get("button[type='button']")
            .should("be.visible")
            .click();

        cy.get(".cmp-adaptiveform-textinput[data-cmp-is='adaptiveFormTextInput']").should("not.be.visible");
    })

    after(function () {
        cy.openAuthoring(formPath);
        cy.selectLayer("Edit");
        cy.deleteComponentByPath(textBoxEditPath);
        cy.deleteComponentByPath(buttonPath);
    })
})
