/*******************************************************************************
 * Copyright 2022 Adobe
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
(function($, Granite, channel, Coral) {
    "use strict";

    var EDIT_DIALOG = ".cmp-adaptiveform-container__editdialog",
        CONTAINER_ENABLEASYNCSUBMISSION = ".cmp-adaptiveform-container__enableasyncsubmission",
        CONTAINER_THANKYOUOPTION = ".cmp-adaptiveform-container__thankyouoption",
        CONTAINER_REDIRECT = ".cmp-adaptiveform-container__redirect",
        CONTAINER_SUBMITACTION = ".cmp-adaptiveform-container__submitaction",
        CONTAINER_SUBMITACTION_SETTINGS = ".cmp-adaptiveform-container__submitactionsettings",
        CONTAINER_SUBMITACTION_SETTINGS_WRAPPER = ".cmp-adaptiveform-container__submitactionsettingswrapper",
        CONTAINER_THANKYOUMESSAGE = ".cmp-adaptiveform-container__thankyoumessage",
        SUB_DIALOG_CONTENT = ".cq-dialog-content",
        SELECTED_SUBMIT_ACTION = ".cmp-adaptiveform-container__submitaction coral-select-item:selected",
        REST_END_POINT_SUBMIT_ACTION = "fd/af/components/guidesubmittype/restendpoint",
        REST_END_POINT_POST_CHECK_BOX = "coral-checkbox [name='./enableRestEndpointPost']",
        FDM_SUBMIT_ACTION = "fd/afaddon/components/actions/fdm",
        FDM_ENABLE_DOR_CHECK_BOX = "coral-checkbox [name='./enableDoRSubmission']",
        EMAIL_SUBMIT_ACTION = "fd/af/components/guidesubmittype/email",
        EMAIL_PARENT_SELECTOR = '.emailSubmitActionContainer',
        EMAIL_TOGGLE_SWITCH_SELECTOR = '.emailTemplateSwitch',
        EMAIL_TEMPLATE_FIELD_SELECTOR = '.emailTemplate',
        EMAIL_TEMPLATE_PATH_SELECTOR = '.externalTemplatePath',
        GUIDE_CONTAINER_SELECTOR = "[data-cmp-is='adaptiveFormContainer']",
        REST_ENDPOINT = ".rest",
        FDM = ".fdm",
        EMAIL = ".email",

        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    var JSON_SCHEMA = 'jsonschema',
        NONE = "none",
        FORM_DATA_MODEL = "formdatamodel",
        SCHEMA_REF = "input[name='./schemaRef']",
        SCHEMA_TYPE = "input[name='./schemaType']",
        SCHEMA_CONTAINER = ".cmp-adaptiveform-container__schemaselectorcontainer",
        FDM_CONTAINER = ".cmp-adaptiveform-container__fdmselectorcontainer",
        SCHEMA_DROPDOWN_SELECTOR = ".cmp-adaptiveform-container__schemaselector",
        FDM_DROPDOWN_SELECTOR = ".cmp-adaptiveform-container__fdmselector",
        FORM_MODEL_SELECTOR = ".cmp-adaptiveform-container__selectformmodel",
        FM_AF_ROOT = "/content/forms/af/",
        FM_DAM_ROOT ="/content/dam/formsanddocuments/",
        DAM_SCHEMA_TYPE,
        DAM_SCHEMA_REF;

    var configuredFormModel,
        toBeConfiguredFormModel,
        isConfirmationDialogAccept = false,
        doNotShowDialogFlag = false,
        isSchemaChanged = false,
        dialogHeader = Granite.I18n.get("Form Model"),
        dialogContent = "<p>" + Granite.I18n.get("When you replace the old data model with a new model, some data bindings might break and lead to form submission errors.") + "</p>" + "<coral-checkbox id='doNotShowDialogCheckBox'>" + Granite.I18n.get("Don't show this again") + "</coral-checkbox>",
        dialogFooter = '<button id="formModelDialogCancelButton" is="coral-button" variant="default" coral-close>' + Granite.I18n.get("Cancel") + '</button><button id="formModelDialogAcceptButton" is="coral-button" variant="primary" coral-close>' + Granite.I18n.get("Ok") + '</button>';

    var formModelChangeConfirmationDialog = new Coral.Dialog().set({
        id: 'formModelChange',
        header: {
            innerHTML: dialogHeader
        },
        content: {
            innerHTML: dialogContent
        },
        footer: {
            innerHTML: dialogFooter
        },
        variant : 'warning'
    });

    channel.on("dialog-success", function (e) {
        configuredFormModel = toBeConfiguredFormModel;
        isConfirmationDialogAccept = false;
        if(isForm() && isSchemaChanged){
            var customEvent = document.createEvent("CustomEvent");
            customEvent.initCustomEvent("data-model-selected", true, true);
            window.dispatchEvent(customEvent);
        }
    });

    channel.on('change', '#doNotShowDialogCheckBox', function(e) {
        if (this.checked) {
            doNotShowDialogFlag = true;
        } else {
            doNotShowDialogFlag = false;
        }
    });

    function selectFormModelOnLoad(dialog) {
        var schemaType = dialog.find(FORM_MODEL_SELECTOR);
        if(schemaType.length > 0){
            schemaType = schemaType[0].value;
            hideContainersExcept(schemaType);
            if (isForm()){
                var afAssetPath = getAfAssetMetadataPath();
                DAM_SCHEMA_TYPE = "[name='" + afAssetPath + "/formmodel']";
                DAM_SCHEMA_REF = "[name='" + afAssetPath + "/schemaRef']";
                addFormParameter(afAssetPath + '/formmodel', schemaType);
                addFormParameter(afAssetPath + '/schemaRef');
            }
            document.body.appendChild(formModelChangeConfirmationDialog);
            prefillSchema(schemaType, dialog);
        }
    };

    function selectFormModelOnChanged(dialog) {
        var schemaTypeSelected = dialog.find(FORM_MODEL_SELECTOR);
        if(schemaTypeSelected.length > 0){
            schemaTypeSelected = schemaTypeSelected[0].value;
            setElementValue(dialog, DAM_SCHEMA_TYPE, schemaTypeSelected)
            hideContainersExcept(schemaTypeSelected);
        }
    };

    function prefillSchema(schemaType, dialog){
        var schemaRef = dialog.find(SCHEMA_REF);
        if(schemaRef.length > 0){
            schemaRef = schemaRef[0].value;
            configuredFormModel = schemaRef;
            setElementValue(dialog, DAM_SCHEMA_REF, schemaRef);
            if (schemaType == JSON_SCHEMA) {
                $(SCHEMA_DROPDOWN_SELECTOR).val(schemaRef);
            } else if (schemaType == FORM_DATA_MODEL) {
                $(FDM_DROPDOWN_SELECTOR).val(schemaRef);
            }
        }
    };

    function schemaSelectorOnChanged(dialog) {
        var selectedSchema = dialog.find(SCHEMA_DROPDOWN_SELECTOR);
        if(selectedSchema.length > 0){
            selectedSchema = selectedSchema[0].value;
            setElementValue(dialog, SCHEMA_REF, selectedSchema);
            setElementValue(dialog, DAM_SCHEMA_REF, selectedSchema);
            isSchemaChanged = true;
            if (configuredFormModel) {
                confirmFormModelChange(selectedSchema, $(SCHEMA_DROPDOWN_SELECTOR));
            } else {
                toBeConfiguredFormModel = selectedSchema;
            }
        }
    };

    function fdmSelectorOnChanged(dialog) {
        var selectedSchema = dialog.find(FDM_DROPDOWN_SELECTOR);
        if(selectedSchema.length > 0) {
            selectedSchema = selectedSchema[0].value;
            setElementValue(dialog, SCHEMA_REF, selectedSchema);
            setElementValue(dialog, DAM_SCHEMA_REF, selectedSchema);
            isSchemaChanged = true;
            if (configuredFormModel) {
                confirmFormModelChange(selectedSchema, $(FDM_DROPDOWN_SELECTOR));
            } else {
                toBeConfiguredFormModel = selectedSchema;
            }
        }
    };

    function setElementValue(dialog, elementRef, value){
        var element = dialog.find(elementRef);
        if(element.length > 0){
            element[0].value = value;
        }
    }

    function getAfAssetMetadataPath() {
        return getGuideContainerPath().replace(FM_AF_ROOT, FM_DAM_ROOT).replace("/guideContainer", "/metadata");
    }

    function getGuideContainerPath() {
        var afWindow = (Granite.author ? Granite.author.ContentFrame.contentWindow : window);
        return afWindow.$(GUIDE_CONTAINER_SELECTOR).data("cmp-path");
    };

    function isForm(){
        return Granite.author.page.path.startsWith(FM_AF_ROOT);
    }

    function addFormParameter(name, value) {
        var input = channel[0].createElement('input');
        input.setAttribute("type", "hidden");
        input.setAttribute("name", name);
        if(value) {
            input.setAttribute("value", value);
        }
        $("#formmodelparameters").append(input);
    };

    function hideContainersExcept(selectedSchemaType) {
        if (selectedSchemaType == JSON_SCHEMA) {
            $(FDM_CONTAINER).hide();
            $(SCHEMA_CONTAINER).show();
        } else if (selectedSchemaType == FORM_DATA_MODEL) {
            $(SCHEMA_CONTAINER).hide();
            $(FDM_CONTAINER).show();
        } else if (selectedSchemaType == 'none') {
            $(FDM_CONTAINER).hide();
            $(SCHEMA_CONTAINER).hide();
        }
    };

    function confirmFormModelChange(selectedSchema, dataModelSelector) {
        if (!isConfirmationDialogAccept && Granite.author.preferences.cookie.get("form-model-change-dialog") !== "disabled") {
            if (configuredFormModel !== selectedSchema) {
                formModelChangeConfirmationDialog.show();
                $("#formModelDialogCancelButton").on("click", function () {
                    dataModelSelector.val(configuredFormModel);
                });
                $("#formModelDialogAcceptButton").on("click", function () {
                    if (doNotShowDialogFlag) {
                        Granite.author.preferences.cookie.set("form-model-change-dialog","disabled");
                    } else {
                        Granite.author.preferences.cookie.set("form-model-change-dialog","enabled");
                    }
                    isConfirmationDialogAccept = true;
                });
            }
        }
        toBeConfiguredFormModel = selectedSchema;
    }

    function initialiseDataModel(dialog) {
        var formModelSelector = dialog.find(FORM_MODEL_SELECTOR)[0],
            schemaSelector = dialog.find(SCHEMA_DROPDOWN_SELECTOR)[0],
            fdmSelector = dialog.find(FDM_DROPDOWN_SELECTOR)[0];
        if (formModelSelector) {
            formModelSelector.on("change", function() {
                selectFormModelOnChanged(dialog);
            });
        };
        if (schemaSelector) {
            schemaSelector.on("change", function() {
                schemaSelectorOnChanged(dialog);
            });
        };
        if (fdmSelector) {
            fdmSelector.on("change", function() {
                fdmSelectorOnChanged(dialog);
            });
        };
        selectFormModelOnLoad(dialog);
    }

    function handleAsyncSubmissionAndThankYouOption(dialog) {
        var containerAsyncSubmission = dialog.find(CONTAINER_ENABLEASYNCSUBMISSION)[0];
        var containerThankYouOption = dialog.find(CONTAINER_THANKYOUOPTION);
        var containerRedirect = dialog.find(CONTAINER_REDIRECT);
        var containerThankYouMessage = dialog.find(CONTAINER_THANKYOUMESSAGE);
        if (containerAsyncSubmission) {
            var isNotChecked = function() {return !isChecked()};
            var isChecked = function() {return containerAsyncSubmission.checked};
            var hideAndShowElements = function() {
                // hide other elements
                Utils.checkAndDisplay(containerThankYouOption)(isChecked);
                // show rich text
                Utils.checkAndDisplay(containerRedirect)(isNotChecked);
            };
            containerAsyncSubmission.on("change", function() {
                hideAndShowElements();
            });
            hideAndShowElements();
        }
        if (containerThankYouOption.length > 0) {
            var isThankYouOptionAMessage = function() {return (Utils.getSelectedRadioGroupOption(containerThankYouOption) === "message");};
            var isThankYouOptionPage = function() {return !isThankYouOptionAMessage();};
            // show thank you message if async submission and thank you option is set to "message"
            channel.on("change", EDIT_DIALOG + " " + CONTAINER_THANKYOUOPTION, function(e) {
                Utils.checkAndDisplay(containerThankYouMessage)(isThankYouOptionAMessage);
                Utils.checkAndDisplay(containerRedirect)(isThankYouOptionPage);
            });
            Utils.checkAndDisplay(containerThankYouMessage)(isThankYouOptionAMessage);
            Utils.checkAndDisplay(containerRedirect)(isThankYouOptionPage);
        }
    }

    function handleSubmitAction(dialog) {
        var containerSubmitAction = dialog.find(CONTAINER_SUBMITACTION),
            containerSubmitActionSettings = dialog.find(CONTAINER_SUBMITACTION_SETTINGS),
            containerSubmitActionSettingsWrapper = dialog.find(CONTAINER_SUBMITACTION_SETTINGS_WRAPPER);
        if (containerSubmitAction.length > 0) {
            // remove the deprecated submit action
            // this is done in client so that deprecated submit action could still work if configured in form
            containerSubmitAction.find('coral-select-item[data-deprecated="true"]').filter(function () {
                return $(this).prop('selected') === false;
            }).remove();
            // render the sub dialog
            var renderSubDialog = Utils.renderSubDialog(containerSubmitActionSettings[0]);
            var showHideWrapper = function(show){if (show){containerSubmitActionSettingsWrapper.show()} else{containerSubmitActionSettingsWrapper.hide()}};
            renderSubDialog(containerSubmitAction[0].value, showHideWrapper);
            containerSubmitAction[0].on("change", function(){
                renderSubDialog(containerSubmitAction[0].value, showHideWrapper);
            });
        }
    }

    function registerSubmitActionSubDialogClientLibs(dialog) {
        var containerSubmitAction = dialog.find(CONTAINER_SUBMITACTION)[0];
        containerSubmitAction.on("change", function(){
            registerRestEndPointDialogClientlibs(dialog);
            registerFDMDialogClientlibs(dialog);
            registerEmailDialogClientlibs(dialog);
        });
    }

    function showDorBindRefSelector (dialog) {
        var enableDORSubmissionCheckBoxElement = dialog.find(FDM_ENABLE_DOR_CHECK_BOX)[0],
            $dorBindRefSelector = Utils.selectElement("input", './bindRef').parent();
        if (enableDORSubmissionCheckBoxElement != null && enableDORSubmissionCheckBoxElement.checked == true) {
            $dorBindRefSelector.parent().show();
        } else {
            $dorBindRefSelector.parent().hide();
        }
    }

    function showPostUrlTextField(dialog) {
        var enableRestEndpointCheckboxElement = dialog.find(REST_END_POINT_POST_CHECK_BOX)[0],
            restEndPointUrlTextbox = Utils.selectElement("input", './restEndpointPostUrl')[0];
        if (enableRestEndpointCheckboxElement != null && enableRestEndpointCheckboxElement.checked == true) {
            Utils.showComponent(restEndPointUrlTextbox, 'div');
        } else {
            Utils.hideComponent(restEndPointUrlTextbox, 'div');
        }
    }

    function showExternalTemplateInput(dialog) {
        var $toggleSwitch = $(EMAIL_PARENT_SELECTOR).find(EMAIL_TOGGLE_SWITCH_SELECTOR)[0];
        var $templateStringField = $(EMAIL_PARENT_SELECTOR).find(EMAIL_TEMPLATE_FIELD_SELECTOR)[0];
        var $templatePathField = $(EMAIL_PARENT_SELECTOR).find(EMAIL_TEMPLATE_PATH_SELECTOR)[0];
        if (!$toggleSwitch) {
            return;
        }

        // doing this because in the backend email template path has priority over inline template
        if (!$toggleSwitch.checked) {
            $templateStringField.parentElement.hidden = false;
            $templatePathField.parentElement.hidden = true;
        } else {
            // fall back to this if switch is not defined or toggle is on
            $templateStringField.parentElement.hidden = true;
            $templatePathField.parentElement.hidden = false;
        }
    }

    function registerRestEndPointDialogClientlibs(dialog) {
        var $subDialogContent = dialog.find(SUB_DIALOG_CONTENT);
        var selectedSubmitAction = $(SELECTED_SUBMIT_ACTION).val();
        if(selectedSubmitAction === REST_END_POINT_SUBMIT_ACTION) {
            var restCheckBox = dialog.find(REST_END_POINT_POST_CHECK_BOX);
            $subDialogContent.on('foundation-contentloaded', function() {
                showPostUrlTextField(dialog);
            });
            showPostUrlTextField(dialog);
            $(document).off('change' + REST_ENDPOINT).on('change' + REST_ENDPOINT, restCheckBox, function(){
                showPostUrlTextField(dialog);
            });
        }
    }

    function registerFDMDialogClientlibs(dialog) {
        var $subDialogContent = dialog.find(SUB_DIALOG_CONTENT);
        var selectedSubmitAction = $(SELECTED_SUBMIT_ACTION).val();
        if(selectedSubmitAction === FDM_SUBMIT_ACTION) {
            var fdmDorCheckBox = dialog.find(FDM_ENABLE_DOR_CHECK_BOX);
            $subDialogContent.on('foundation-contentloaded', function() {
                showDorBindRefSelector(dialog);
            });
            showDorBindRefSelector(dialog);
            $(document).off('change' + FDM).on('change' + FDM, fdmDorCheckBox, function(){
                showDorBindRefSelector(dialog);
            });
        }
    }

    function registerEmailDialogClientlibs(dialog) {
        var $subDialogContent = dialog.find(SUB_DIALOG_CONTENT);
        var selectedSubmitAction = $(SELECTED_SUBMIT_ACTION).val();
        if(selectedSubmitAction === EMAIL_SUBMIT_ACTION) {
            var useExternalEmailTemplateSwitch = $(EMAIL_PARENT_SELECTOR).find(EMAIL_TOGGLE_SWITCH_SELECTOR);
            $subDialogContent.on('foundation-contentloaded', function() {
                showExternalTemplateInput(dialog);
            });
            showExternalTemplateInput(dialog);
                $(document).off('change' + EMAIL).on('change' + EMAIL, useExternalEmailTemplateSwitch, function(){
                showExternalTemplateInput(dialog);
            });
        }
    }

    $(window).adaptTo("foundation-registry").register("foundation.validation.validator", {
        selector : "[data-validation~='datamodel.config']",
        validate : function (el) {
            let $el = $(el);
            if($el.is(":visible") && $el[0].value === '') {
                return Granite.I18n.getMessage("This is a required field");
            }
        }
    });

    Utils.initializeEditDialog(EDIT_DIALOG)(handleAsyncSubmissionAndThankYouOption, handleSubmitAction,
        registerSubmitActionSubDialogClientLibs, registerRestEndPointDialogClientlibs, registerFDMDialogClientlibs, registerEmailDialogClientlibs, initialiseDataModel);

})(jQuery, Granite, jQuery(document), Coral);
