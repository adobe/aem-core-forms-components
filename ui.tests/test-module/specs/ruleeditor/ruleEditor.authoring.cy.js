const commons = require('../../libs/commons/commons'),
    sitesSelectors = require('../../libs/commons/sitesSelectors'),
    formsSelectors = require('../../libs/commons/guideSelectors'),
    afConstants = require('../../libs/commons/formsConstants');

describe('Rule editor authoring sanity for core-components',function(){
    let toggle_array = [];

    before(() => {
        cy.fetchFeatureToggles().then((response) => {
            if (response.status === 200) {
                toggle_array = response.body.enabled;
            }
        });
    });

    const createRuleToHideTextInputOnButtonClick = function() {
        // Edit rule option not existing on button toolbar
        cy.get(formsSelectors.ruleEditor.action.editRule).should("exist");
        cy.initializeEventHandlerOnChannel("af-rule-editor-initialized").as("isRuleEditorInitialized");
        cy.get(formsSelectors.ruleEditor.action.editRule).click();

        // click on  create option from rule editor header
        cy.get("@isRuleEditorInitialized").its('done').should('equal', true);
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

    const createRuleToValidateDate = function() {
        // Edit rule option not existing on button toolbar
        cy.get(formsSelectors.ruleEditor.action.editRule).should("exist");
        cy.initializeEventHandlerOnChannel("af-rule-editor-initialized").as("isRuleEditorInitialized");
        cy.get(formsSelectors.ruleEditor.action.editRule).click();

        // click on  create option from rule editor header
        cy.get("@isRuleEditorInitialized").its('done').should('equal', true);
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.createRuleButton).should("be.visible").click();

        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.sideToggleButton + ":first").click();

        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.STATEMENT + " .child-choice-name").should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.STATEMENT + " .child-choice-name").click();

        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.STATEMENT + " .expeditor-customoverlay.is-open coral-selectlist-item[value='VALIDATE_EXPRESSION']")
            .click({force: true});

        // select the component for which rule is to written i.e. Button here
        cy.getRuleEditorIframe().find(".COMPARISON_EXPRESSION .sequence-view-cell .EXPRESSION").first().click();
        cy.getRuleEditorIframe().find(".COMPARISON_EXPRESSION .sequence-view-cell .EXPRESSION").first().find("coral-selectlist-item[title='Date Input']:first").click();

        cy.getRuleEditorIframe().find(".COMPARISON_EXPRESSION .sequence-view-cell .OPERATOR").click();
        cy.getRuleEditorIframe().find("coral-selectlist-item[value='EQUALS_TO']").click();

        cy.getRuleEditorIframe().find(".COMPARISON_EXPRESSION .sequence-view-cell .EXPRESSION").last().click();
        cy.getRuleEditorIframe().find(".COMPARISON_EXPRESSION .sequence-view-cell .EXPRESSION").last().find(".selectlist-header").click();
        cy.getRuleEditorIframe().find("coral-selectlist-item[value='FUNCTION_CALL']").click();
        cy.getRuleEditorIframe().find(".COMPARISON_EXPRESSION .sequence-view-cell .EXPRESSION").last().click();
        cy.getRuleEditorIframe().find(".COMPARISON_EXPRESSION .sequence-view-cell .EXPRESSION").last().find("coral-selectlist-item[value='today']").click();

        cy.intercept('POST', /content\/forms\/af\/core-components-it\/samples\/ruleeditor\/blank.*/).as('ruleEditorRequest');
        
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.saveRule).should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.saveRule).click();
        cy.wait('@ruleEditorRequest').then((interception) => {
            expect(interception.response.statusCode).to.equal(201);
            const submittedData = Object.fromEntries(new URLSearchParams(interception.request.body));
            expect(submittedData[":content"]).contains("dateToDaysSinceEpoch($field.$value)==dateToDaysSinceEpoch(today())");
        });

        // check if rule is created
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.ruleSummary.DATE_PICKER_RULE).should("exist");

        // check and close rule editor
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.closeRuleEditor).should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.closeRuleEditor).click();
    }

    const createRuleToSaveFormOnButtonClick = function() {
        // Edit rule option not existing on button toolbar
        cy.get(formsSelectors.ruleEditor.action.editRule).should("exist");
        cy.initializeEventHandlerOnChannel("af-rule-editor-initialized").as("isRuleEditorInitialized");
        cy.get(formsSelectors.ruleEditor.action.editRule).click();

        // click on  create option from rule editor header
        cy.get("@isRuleEditorInitialized").its('done').should('equal', true);
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.createRuleButton).should("be.visible").click();

        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.sideToggleButton + ":first").click();

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

        // select SAVE FORM action from dropdown
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.operator.SAVE_FORM).should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.operator.SAVE_FORM).click({force: true});

        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.saveRule).should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.saveRule).click();

        // check if rule is created
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.ruleSummary.CREATED_RULE).should("exist");

        // check and close rule editor
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.closeRuleEditor).should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.closeRuleEditor).click();
    }

    const createRuleToHandleFormSubmission = function() {
        // Edit rule option not existing on button toolbar
        cy.get(formsSelectors.ruleEditor.action.editRule).should("exist");
        cy.initializeEventHandlerOnChannel("af-rule-editor-initialized").as("isRuleEditorInitialized");
        cy.get(formsSelectors.ruleEditor.action.editRule).click();

        // click on  create option from rule editor header
        cy.get("@isRuleEditorInitialized").its('done').should('equal', true);

        cy.getRuleEditorIframe().find("#objectNavigationTree li[data-elementid='$form'] > div[role='button']").click();

        createSubmissionSuccessRule();
        createSubmissionErrorRule();

        // check and close rule editor
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.closeRuleEditor).should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.closeRuleEditor).click();
    }

    const createSubmissionSuccessRule = function() {
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.createRuleButton).should("be.visible").click();

        // select the event for which rule is to written
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.EVENT_AND_COMPARISON_OPERATOR + " .choice-view-default").should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.EVENT_AND_COMPARISON_OPERATOR + " .choice-view-default").click();

        // is submitted successfully option existing in 'OPERATIONS' dropdown
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.operator.IS_SUBMITTED_SUCCESSFULLY).should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.operator.IS_SUBMITTED_SUCCESSFULLY).click();

        // check and click on dropdown to view the actions available
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.BLOCK_STATEMENT + " .choice-view-default").should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.BLOCK_STATEMENT + " .choice-view-default").click();

        // select FUNCTION_CALL action from dropdown
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.operator.FUNCTION_CALL).should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.operator.FUNCTION_CALL).click({force: true});

        cy.getRuleEditorIframe().find(".terminal-view.FUNCTION_NAME.VARIABLE").should("be.visible");
        cy.getRuleEditorIframe().find(".terminal-view.FUNCTION_NAME.VARIABLE").click();

        cy.getRuleEditorIframe().find(".terminal-view.FUNCTION_NAME.VARIABLE input[placeholder='Filter Objects']").click().type("default");
        cy.getRuleEditorIframe().find("[value='defaultSubmitSuccessHandler']").click({force: true});
        cy.getRuleEditorIframe().find("[value='defaultSubmitSuccessHandler']").click({force: true});

        // cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.saveRule).should("exist");
        // cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.saveRule).click();
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.cancelRule).should("exist").click();

        // check if rule is created
        // cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.ruleSummary.SUBMISSION_SUCCESS_RULE).should("exist");
    }

    const createSubmissionErrorRule = function() {
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.createRuleButton).should("be.visible").click();

        // select the event for which rule is to written
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.EVENT_AND_COMPARISON_OPERATOR + " .choice-view-default").should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.EVENT_AND_COMPARISON_OPERATOR + " .choice-view-default").click();

        // is submitted successfully option existing in 'OPERATIONS' dropdown
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.operator.SUBMISSION_FAILS).should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.operator.SUBMISSION_FAILS).click();

        // check and click on dropdown to view the actions available
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.BLOCK_STATEMENT + " .choice-view-default").should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.BLOCK_STATEMENT + " .choice-view-default").click();

        // select FUNCTION_CALL action from dropdown
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.operator.FUNCTION_CALL).should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.operator.FUNCTION_CALL).click({force: true});

        cy.getRuleEditorIframe().find(".terminal-view.FUNCTION_NAME.VARIABLE").should("be.visible");
        cy.getRuleEditorIframe().find(".terminal-view.FUNCTION_NAME.VARIABLE").click();

        cy.getRuleEditorIframe().find(".terminal-view.FUNCTION_NAME.VARIABLE input[placeholder='Filter Objects']").click().type("default");
        cy.getRuleEditorIframe().find("[value='defaultSubmitErrorHandler']").click({force: true});
        cy.getRuleEditorIframe().find("[value='defaultSubmitErrorHandler']").click({force: true});

        // select the string literal parameter
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.PARAMETER + " .choice-view-default").should("exist");
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.choiceModels.PARAMETER + " .choice-view-default").click();

        // select STRING_LITERAL action from dropdown
        cy.getRuleEditorIframe().find(".Parameters coral-selectlist [value='STRING_LITERAL']").should("exist");
        cy.getRuleEditorIframe().find(".Parameters coral-selectlist [value='STRING_LITERAL']").click({force: true});

        cy.getRuleEditorIframe().find(".terminal-view.STRING_LITERAL input[placeholder='Enter a String']").should("be.visible").click().type('abc{enter}');

        // cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.saveRule).should("exist");
        // cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.saveRule).click();
        cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.cancelRule).should("exist").click();

        // check if rule is created
        // cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.ruleSummary.SUBMISSION_FAILURE_RULE).should("exist");
    }

    context('Open Forms Editor', function() {
        const formPath = "/content/forms/af/core-components-it/samples/ruleeditor/blank",
            submitFormPath = "/content/forms/af/core-components-it/samples/ruleeditor/submit/blank",
            saveFormPath = "/content/forms/af/core-components-it/samples/ruleeditor/save/blank",
            formContainerPath = formPath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX,
            submitFormContainerPath = submitFormPath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX,
            saveFormContainerPath = saveFormPath + afConstants.FORM_EDITOR_FORM_CONTAINER_SUFFIX,
            textinputEditPath = formContainerPath + "/" + afConstants.components.forms.resourceType.formtextinput.split("/").pop(),
            buttonEditPath = formContainerPath + "/" + afConstants.components.forms.resourceType.formbutton.split("/").pop(),
            datePickerEditPath = formContainerPath + "/" + afConstants.components.forms.resourceType.datepicker.split("/").pop(),
            saveButtonEditPath = saveFormContainerPath + "/" + afConstants.components.forms.resourceType.formbutton.split("/").pop(),
            buttonEditPathSelector = "[data-path='" + buttonEditPath + "']",
            datePickerEditPathSelector = "[data-path='" + datePickerEditPath + "']",
            saveButtonEditPathSelector = "[data-path='" + saveButtonEditPath + "']",
            submitFormButtonEditPath = submitFormContainerPath + "/" + afConstants.components.forms.resourceType.submitButton.split("/").pop(),
            submitFormButtonEditPathSelector = "[data-path='" + submitFormButtonEditPath + "']";

        it('should open rule-editor from spa', function () {
            if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-14068")) {
                cy.openAuthoring(formPath);
                cy.selectLayer("Edit");
                cy.get(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/*']").should("exist");

                cy.insertComponent(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/*']",
                    "Adaptive Form Button", afConstants.components.forms.resourceType.formbutton);
                cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + buttonEditPathSelector);

                cy.intercept('GET', /solutions\/livecycle-ruleeditor-ui-service.*/).as('ruleEditorRequest');

                // Edit rule option not existing on button toolbar
                cy.get(formsSelectors.ruleEditor.action.editRule).should("exist");
                cy.initializeEventHandlerOnChannel("af-rule-editor-initialized").as("isRuleEditorInitialized");
                cy.get(formsSelectors.ruleEditor.action.editRule).click();

                // click on  create option from rule editor header
                cy.get("@isRuleEditorInitialized").its('done').should('equal', true);
                cy.wait('@ruleEditorRequest').its('response.statusCode').should('equal', 200);
                cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.closeRuleEditor).should("exist");
                cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.closeRuleEditor).click();

                cy.get(sitesSelectors.overlays.overlay.component + buttonEditPathSelector).should("exist");

                cy.selectLayer("Edit");
                cy.deleteComponentByPath(buttonEditPath);
            }
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

        if (cy.af.isLatestAddon()) {
            it('should add validation rule on date fields', function () {
                cy.openAuthoring(formPath);
                cy.selectLayer("Edit");
                cy.get(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/*']").should("exist");

                cy.insertComponent(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/*']",
                    "Adaptive Form Date Picker", afConstants.components.forms.resourceType.datepicker);
                cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + datePickerEditPathSelector);

                createRuleToValidateDate();
                cy.get(sitesSelectors.overlays.overlay.component + datePickerEditPathSelector).should("exist");

                cy.selectLayer("Edit");
                cy.deleteComponentByPath(datePickerEditPath);
            })
        }

        it('should add submission handler rules on form', function () {
            if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-13209")) {
                cy.openAuthoring(submitFormPath);
                cy.selectLayer("Edit");
                cy.get(sitesSelectors.overlays.overlay.component + "[data-path='" + submitFormContainerPath + "/*']").should("exist");

                cy.insertComponent(sitesSelectors.overlays.overlay.component + "[data-path='" + submitFormContainerPath + "/*']",
                    "Adaptive Form Submit Button", afConstants.components.forms.resourceType.submitButton);
                cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + submitFormButtonEditPathSelector);

                createRuleToHandleFormSubmission();
                cy.get(sitesSelectors.overlays.overlay.component + submitFormButtonEditPathSelector).should("exist");

                cy.selectLayer("Edit");
                cy.deleteComponentByPath(submitFormButtonEditPath);
            }
        })

        it('should add custom formData submit rule on submit button', function () {
            if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-11541")) {
                cy.openAuthoring(submitFormPath);
                cy.selectLayer("Edit");
                cy.get(sitesSelectors.overlays.overlay.component + "[data-path='" + submitFormContainerPath + "/*']").should("exist");

                cy.insertComponent(sitesSelectors.overlays.overlay.component + "[data-path='" + submitFormContainerPath + "/*']",
                    "Adaptive Form Submit Button", afConstants.components.forms.resourceType.submitButton);
                cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + submitFormButtonEditPathSelector);

                // Edit rule option not existing on button toolbar
                cy.get(formsSelectors.ruleEditor.action.editRule).should("exist");
                cy.initializeEventHandlerOnChannel("af-rule-editor-initialized").as("isRuleEditorInitialized");
                cy.get(formsSelectors.ruleEditor.action.editRule).click();

                // click on  create option from rule editor header
                cy.get("@isRuleEditorInitialized").its('done').should('equal', true);
                cy.getRuleEditorIframe().find("[title='Submit - Click'] .title-cell").should("be.visible").click();
                // select FUNCTION_CALL action from dropdown
                cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.operator.FUNCTION_CALL).should("exist");
                cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.operator.FUNCTION_CALL).click({force: true});

                cy.getRuleEditorIframe().find(".terminal-view.FUNCTION_NAME.VARIABLE").should("be.visible");
                cy.getRuleEditorIframe().find(".terminal-view.FUNCTION_NAME.VARIABLE").click();

                cy.getRuleEditorIframe().find(".terminal-view.FUNCTION_NAME.VARIABLE input[placeholder='Filter Objects']").click().type("testSubmitForm");
                cy.getRuleEditorIframe().find("[value='testSubmitFormPreprocessor']").click({force: true});
                cy.getRuleEditorIframe().find("[value='testSubmitFormPreprocessor']").click({force: true});
                cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.saveRule).should("exist");
                cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.saveRule).click();

                // check if rule is created
                cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.ruleSummary.CUSTOM_SUBMIT_FORM_RULE).should("exist");

                // check and close rule editor
                cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.closeRuleEditor).should("exist");
                cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.closeRuleEditor).click();

                cy.get(sitesSelectors.overlays.overlay.component + submitFormButtonEditPathSelector).should("exist");
                cy.selectLayer("Edit");
                cy.deleteComponentByPath(submitFormButtonEditPath);
            }
        })

        it('should add save form rule on button', function () {
            if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-11581")) {
                cy.openAuthoring(saveFormPath);
                cy.selectLayer("Edit");
                cy.get(sitesSelectors.overlays.overlay.component + "[data-path='" + saveFormContainerPath + "/*']").should("exist");

                cy.insertComponent(sitesSelectors.overlays.overlay.component + "[data-path='" + saveFormContainerPath + "/*']",
                    "Adaptive Form Button", afConstants.components.forms.resourceType.formbutton);
                cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + saveButtonEditPathSelector);

                createRuleToSaveFormOnButtonClick();

                cy.selectLayer("Edit");
                cy.deleteComponentByPath(saveButtonEditPath);
            }
        })

    })

    context('Open Sites Editor', function() {
        const pagePath = "/content/forms/sites/core-components-it/ruleeditor",
            formContainerPath = pagePath + afConstants.RESPONSIVE_GRID_DEMO_SUFFIX + "/guideContainer",
            textinputEditPath = formContainerPath + "/" + afConstants.components.forms.resourceType.formtextinput.split("/").pop(),
            buttonEditPath = formContainerPath + "/" + afConstants.components.forms.resourceType.formbutton.split("/").pop(),
            buttonEditPathSelector = "[data-path='" + buttonEditPath + "']";

        it('should open rule-editor from spa', function () {
            if (cy.af.isLatestAddon() && toggle_array.includes("FT_FORMS-14068")) {
                cy.openAuthoring(pagePath);
                cy.selectLayer("Edit");
                cy.get(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/*']").should("exist");

                cy.insertComponent(sitesSelectors.overlays.overlay.component + "[data-path='" + formContainerPath + "/*']",
                    "Adaptive Form Button", afConstants.components.forms.resourceType.formbutton);
                cy.openEditableToolbar(sitesSelectors.overlays.overlay.component + buttonEditPathSelector);

                cy.intercept('GET', /solutions\/livecycle-ruleeditor-ui-service.*/).as('ruleEditorRequest');

                // Edit rule option not existing on button toolbar
                cy.get(formsSelectors.ruleEditor.action.editRule).should("exist");
                cy.initializeEventHandlerOnChannel("af-rule-editor-initialized").as("isRuleEditorInitialized");
                cy.get(formsSelectors.ruleEditor.action.editRule).click();

                // click on  create option from rule editor header
                cy.get("@isRuleEditorInitialized").its('done').should('equal', true);
                cy.wait('@ruleEditorRequest').its('response.statusCode').should('equal', 200);

                cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.closeRuleEditor).should("exist");
                cy.getRuleEditorIframe().find(formsSelectors.ruleEditor.action.closeRuleEditor).click();

                cy.get(sitesSelectors.overlays.overlay.component + buttonEditPathSelector).should("exist");

                cy.selectLayer("Edit");
                cy.deleteComponentByPath(buttonEditPath);
            }
        })

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
