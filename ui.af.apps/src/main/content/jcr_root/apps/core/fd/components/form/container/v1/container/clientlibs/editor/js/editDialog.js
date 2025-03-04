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
        EDIT_DIALOG_FORM = ".cmp-adaptiveform-formcontainer__editdialog",
        EDIT_DIALOG_FRAGMENT = ".cmp-adaptiveform-fragmentcontainer__editdialog",
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
        ENABLE_AUTO_SAVE = "[name='./fd:enableAutoSave']",
        AUTO_SAVE_STRATEGY_CONTAINER = ".cmp-adaptiveform-container__autoSaveStrategyContainer",

        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    var JSON_SCHEMA = 'jsonschema',
        NONE = 'none',
        FORM_DATA_MODEL = "formdatamodel",
        FORM_TEMPLATE = 'formtemplates',
        CONNECTOR = "connector",
        SCHEMA_REF = "input[name='./schemaRef']",
        XDP_REF = "input[name='./xdpRef']",
        SCHEMA_TYPE = "input[name='./schemaType']",
        SCHEMA_CONTAINER = ".cmp-adaptiveform-container__schemaselectorcontainer",
        FDM_CONTAINER = ".cmp-adaptiveform-container__fdmselectorcontainer",
        CONNECTOR_CONTAINER = ".cmp-adaptiveform-container__marketoselectorcontainer",
        FORM_TEMPLATE_CONTAINER = ".cmp-adaptiveform-container__formtemplateselectorcontainer",
        SCHEMA_DROPDOWN_SELECTOR = ".cmp-adaptiveform-container__schemaselector",
        FDM_DROPDOWN_SELECTOR = ".cmp-adaptiveform-container__fdmselector",
        CONNECTOR_DROPDOWN_SELECTOR = ".cmp-adaptiveform-container__marketoselector",
        FORM_TEMPLATE_DROPDOWN_SELECTOR = ".cmp-adaptiveform-container__formtemplateselector",
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
                addFormParameter(afAssetPath + '/formmodel', schemaType);
                if(schemaType == JSON_SCHEMA){
                    DAM_SCHEMA_REF = "[name='" + afAssetPath + "/schemaRef']";
                    addFormParameter(afAssetPath + '/schemaRef');
                } else if(schemaType == FORM_TEMPLATE){
                    DAM_SCHEMA_REF = "[name='" + afAssetPath + "/xdpRef']";
                    addFormParameter(afAssetPath + '/xdpRef');
                    // we don't want user to change the data model if form template has been selected
                    dialog.find('coral-selectlist-item[value="none"]').remove();
                    dialog.find('coral-selectlist-item[value="jsonschema"]').remove();
                    dialog.find('coral-selectlist-item[value="formdatamodel"]').remove();
                    dialog.find('coral-selectlist-item[value="connector"]').remove();
                }
            } else {
                // when there is no dam asset, remove XFA from selection dynamically
                dialog.find('coral-selectlist-item[value="formtemplates"]').remove();
                // always hide form template container
                $(FORM_TEMPLATE_CONTAINER).hide();
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
            
            // Clear previous form parameters if schema type changes
            if (isForm()) {
                var afAssetPath = getAfAssetMetadataPath();
                if (schemaTypeSelected == FORM_TEMPLATE) {
                    // When changing to form template, ensure xdpRef parameter is added
                    setElementValue(dialog, XDP_REF, "")
                    addFormParameter(afAssetPath + '/xdpRef', "");
                }
            }
        }
    };

    function prefillSchema(schemaType, dialog){
        var schemaRef = dialog.find(SCHEMA_REF);
        // for formtemplates we don't have schemaRef instead xdpRef
        if(schemaType == FORM_TEMPLATE){
            schemaRef = dialog.find(XDP_REF);
        }
        if(schemaRef.length > 0){
            schemaRef = schemaRef[0].value;
            configuredFormModel = schemaRef;
            setElementValue(dialog, DAM_SCHEMA_REF, schemaRef);
            if (schemaType == JSON_SCHEMA) {
                $(SCHEMA_DROPDOWN_SELECTOR).val(schemaRef);
            } else if (schemaType == FORM_DATA_MODEL) {
                $(FDM_DROPDOWN_SELECTOR).val(schemaRef);
            } else if (schemaType == CONNECTOR) {
                $(CONNECTOR_DROPDOWN_SELECTOR).val(schemaRef);
            } else if (schemaType == FORM_TEMPLATE) {
                $(FORM_TEMPLATE_DROPDOWN_SELECTOR).val(schemaRef);
                // Also set the form parameter for xdpRef when prefilling
                if (isForm()) {
                    var afAssetPath = getAfAssetMetadataPath();
                    addFormParameter(afAssetPath + '/xdpRef', schemaRef);
                }
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

    function connectorSelectorOnChanged(dialog) {
        var selectedSchema = dialog.find(CONNECTOR_DROPDOWN_SELECTOR);
        if(selectedSchema.length > 0) {
            selectedSchema = selectedSchema[0].value;
            setElementValue(dialog, SCHEMA_REF, selectedSchema);
            setElementValue(dialog, DAM_SCHEMA_REF, selectedSchema);
            isSchemaChanged = true;
            if (configuredFormModel) {
                confirmFormModelChange(selectedSchema, $(CONNECTOR_DROPDOWN_SELECTOR));
            } else {
                toBeConfiguredFormModel = selectedSchema;
            }
        }
    };

    function formTemplateSelectorOnChanged(dialog) {
        var selectedSchema = dialog.find(FORM_TEMPLATE_DROPDOWN_SELECTOR);
        if(selectedSchema.length > 0) {
            selectedSchema = selectedSchema[0].value;
            setElementValue(dialog, SCHEMA_REF, selectedSchema);
            setElementValue(dialog, XDP_REF, selectedSchema);
            setElementValue(dialog, DAM_SCHEMA_REF, selectedSchema);
            if (isForm()) {
                var afAssetPath = getAfAssetMetadataPath();
                addFormParameter(afAssetPath + '/xdpRef', selectedSchema);
            }
            isSchemaChanged = true;
            if (configuredFormModel) {
                confirmFormModelChange(selectedSchema, $(FORM_TEMPLATE_DROPDOWN_SELECTOR));
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
            $(FORM_TEMPLATE_CONTAINER).hide();
            $(CONNECTOR_CONTAINER).hide();
            $(SCHEMA_CONTAINER).show();
        } else if (selectedSchemaType == FORM_DATA_MODEL) {
            $(SCHEMA_CONTAINER).hide();
            $(FORM_TEMPLATE_CONTAINER).hide();
            $(CONNECTOR_CONTAINER).hide();
            $(FDM_CONTAINER).show();
        } else if (selectedSchemaType == CONNECTOR) {
            $(SCHEMA_CONTAINER).hide();
            $(FDM_CONTAINER).hide();
            $(FORM_TEMPLATE_CONTAINER).hide();
            $(CONNECTOR_CONTAINER).show();
        } else if (selectedSchemaType == FORM_TEMPLATE) {
            $(FDM_CONTAINER).hide();
            $(CONNECTOR_CONTAINER).hide();
            $(SCHEMA_CONTAINER).hide();
            $(FORM_TEMPLATE_CONTAINER).show();
        } else if (selectedSchemaType == NONE) {
            $(FDM_CONTAINER).hide();
            $(SCHEMA_CONTAINER).hide();
            $(CONNECTOR_CONTAINER).hide();
            $(FORM_TEMPLATE_CONTAINER).hide();
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
            fdmSelector = dialog.find(FDM_DROPDOWN_SELECTOR)[0],
            connectorSelector = dialog.find(CONNECTOR_DROPDOWN_SELECTOR)[0],
            formTemplateSelector = dialog.find(FORM_TEMPLATE_DROPDOWN_SELECTOR)[0];
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
        if (connectorSelector) {
            connectorSelector.on("change", function() {
                connectorSelectorOnChanged(dialog);
            });
        };
        if(formTemplateSelector) {
            formTemplateSelector.on("change", function() {
                formTemplateSelectorOnChanged(dialog);
            });
        }
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
        let enableRestEndpointCheckboxElement = dialog.find(REST_END_POINT_POST_CHECK_BOX)[0],
            restEndPointSource = Utils.selectElement("coral-radio", './restEndPointSource'), isPostUrlSelected = false,
            restEndPointUrlTextBox = Utils.selectElement("input", './restEndpointPostUrl')[0],
            restEndpointConfigPath = Utils.selectElement("input", './restEndpointConfigPath')[0];

        if (enableRestEndpointCheckboxElement != null && enableRestEndpointCheckboxElement.checked == true) {
            restEndPointSource.parent('div').parent('div').show();
            Utils.showComponent(restEndPointSource, 'div');
            restEndPointSource.each(function (i, obj) {
                if (obj.checked && obj.value === "posturl") {
                    isPostUrlSelected = true;
                }
            });
            if(restEndPointSource.length == 0 || isPostUrlSelected){
                Utils.showComponent(restEndPointUrlTextBox, 'div');
                Utils.hideComponent(restEndpointConfigPath, 'div');
                restEndPointUrlTextBox?.setAttribute("data-rest-endpoint-url-validation", "");
            } else {
                Utils.showComponent(restEndpointConfigPath, 'div');
                Utils.hideComponent(restEndPointUrlTextBox, 'div');
                restEndPointUrlTextBox?.removeAttribute("data-rest-endpoint-url-validation");
            }
        } else {
            Utils.hideComponent(restEndPointSource, 'div');
            Utils.hideComponent(restEndPointUrlTextBox, 'div');
            Utils.hideComponent(restEndpointConfigPath, 'div');
            restEndPointSource.parent('div').parent('div').hide();
            restEndPointUrlTextBox?.removeAttribute("data-rest-endpoint-url-validation");
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
            registerRestEndpointUrlValidator();
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

    function showHideAutoSave(dialog) {
        var enableAutoSave = dialog.find(ENABLE_AUTO_SAVE);
        if (enableAutoSave[0]) {
            var autoSaveStrategyContainer = dialog.find(AUTO_SAVE_STRATEGY_CONTAINER);
            if (autoSaveStrategyContainer) {
                if (enableAutoSave[0].checked) {
                    autoSaveStrategyContainer.show();
                } else {
                    autoSaveStrategyContainer.hide();
                }
            }
        }
    }

    function registerAutoSaveDialogAction(dialog) {
        var $subDialogContent = dialog.find(SUB_DIALOG_CONTENT);
        $subDialogContent.on('foundation-contentloaded', function() {
            showHideAutoSave(dialog);
        });
        showHideAutoSave(dialog);
        $(document).on('change', ENABLE_AUTO_SAVE, function () {
            showHideAutoSave(dialog);
        });
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

    function registerRestEndpointUrlValidator() {
        $(window).adaptTo("foundation-registry").register("foundation.validation.validator", {
            selector: "[data-rest-endpoint-url-validation]",
            validate: (el) => {
                const url = el.value;
                // Regex to validate absolute URLs starting with http:// or https:// only
                const absoluteUrlPattern = /^https?:\/\/.+$/i;
                if (!absoluteUrlPattern.test(url)) {
                    return Granite.I18n.getMessage(
                       "Please enter the absolute path of the REST endpoint."
                    );
                }
            }
        });
    }

    Utils.initializeEditDialog(EDIT_DIALOG_FORM)(handleAsyncSubmissionAndThankYouOption, handleSubmitAction,
        registerSubmitActionSubDialogClientLibs, registerRestEndPointDialogClientlibs, registerFDMDialogClientlibs, registerEmailDialogClientlibs, initialiseDataModel, registerAutoSaveDialogAction);

    Utils.initializeEditDialog(EDIT_DIALOG_FRAGMENT)(initialiseDataModel);

})(jQuery, Granite, jQuery(document), Coral);
