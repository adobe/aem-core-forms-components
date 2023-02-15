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
        REST_ENDPOINT = ".rest",
        FDM = ".fdm",
        EMAIL = ".email",


        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    var XSD_EXTENSION = '.xsd',
        JSON_EXTENSION = '.schema.json',
        XML_SCHEMA = 'xmlschema',
        JSON_SCHEMA = 'jsonschema',
        NONE = "none",
        SCHEMA ="schema",
        FORM_DATA_MODEL = "formdatamodel",
        SCHEMA_REF = "input[name='./schemaRef']",
        XSD_REF = "input[name='./xsdRef']",
        SCHEMA_TYPE = "input[name='./schemaType']",
        SCHEMA_CONTAINER = ".cmp-adaptiveform-container__schemaselectorcontainer",
        FDM_CONTAINER = ".cmp-adaptiveform-container__fdmselectorcontainer",
        SCHEMA_DROPDOWN_SELECTOR = ".cmp-adaptiveform-container__schemaselector",
        FDM_DROPDOWN_SELECTOR = ".cmp-adaptiveform-container__fdmselector",
        FORM_MODEL_SELECTOR = ".cmp-adaptiveform-container__selectformmodel",
        SCHEMA_ROOT_ELEMENT_SELECTOR = ".cmp-adaptiveform-container__rootelementselector",
        XSD_ROOT_ELEMENT_SELECTOR = ".cmp-adaptiveform-container__xsdrootelement";

    var lastSelectedXsd,
        configuredFormModel,
        toBeConfiguredFormModel,
        isConfirmationDialogAccept = false,
        doNotShowDialogFlag = false,
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
    });

    channel.on('change', '#doNotShowDialogCheckBox', function(e) {
        if (this.checked) {
            doNotShowDialogFlag = true;
        } else {
            doNotShowDialogFlag = false;
        }
    });

    function selectFormModelOnLoad(dialog) {
        var schemaType = dialog.find(FORM_MODEL_SELECTOR)[0].value;
        hideContainersExcept(schemaType);
        prefillSchema(schemaType, dialog);
        if (!isTemplate() && schemaType != NONE) {
            document.querySelector(FORM_MODEL_SELECTOR).disabled = true;
            dialog.find(SCHEMA_TYPE)[0].removeAttribute("disabled");
        }
        document.body.appendChild(formModelChangeConfirmationDialog);
    };

    function selectFormModelOnChanged(dialog) {
        var schemaTypeSelected = dialog.find(FORM_MODEL_SELECTOR)[0].value;
        hideContainersExcept(schemaTypeSelected);
        if (schemaTypeSelected == SCHEMA) {
            if (lastSelectedXsd) {
                $(SCHEMA_ROOT_ELEMENT_SELECTOR).show();
                createRootElementSelectionMarkup(lastSelectedXsd);
            }
        } else {
            removeXsdRootElementMarkup();
        }
    };

    function prefillSchema(schemaType, dialog){
        var schemaRef = dialog.find(SCHEMA_REF)[0].value,
            xsdRef = dialog.find(XSD_REF)[0].value;
        if (schemaType == SCHEMA) {
            $(SCHEMA_DROPDOWN_SELECTOR).val(schemaRef ? schemaRef : xsdRef);
        } else if (schemaType == FORM_DATA_MODEL) {
            $(FDM_DROPDOWN_SELECTOR).val(schemaRef ? schemaRef : xsdRef);
        }
        if(xsdRef){
            fillXsdDetails(xsdRef);
        }
    };

    function schemaSelectorOnChanged(dialog) {
        var selectedSchema = dialog.find(SCHEMA_DROPDOWN_SELECTOR)[0].value;
        if (selectedSchema.indexOf(XSD_EXTENSION) != -1) {
            $(SCHEMA_ROOT_ELEMENT_SELECTOR).show();
            dialog.find(XSD_REF)[0].value = selectedSchema;
            dialog.find(SCHEMA_REF)[0].value = '';
            createRootElementSelectionMarkup(selectedSchema);
        } else if (selectedSchema.indexOf(JSON_EXTENSION) != -1) {
            $(SCHEMA_ROOT_ELEMENT_SELECTOR).hide();
            removeXsdRootElementMarkup();
            handleJsonSelection(selectedSchema);
            dialog.find(SCHEMA_REF)[0].value = selectedSchema;
            dialog.find(XSD_REF)[0].value = '';
        } else {
            dialog.find(SCHEMA_REF)[0].value = selectedSchema;
            dialog.find(XSD_REF)[0].value = '';
        }
        if (configuredFormModel) {
            confirmFormModelChange(selectedSchema, $(SCHEMA_DROPDOWN_SELECTOR));
        } else {
            toBeConfiguredFormModel = selectedSchema;
        }
    };

    function fdmSelectorOnChanged(dialog) {
        var selectedSchema = dialog.find(FDM_DROPDOWN_SELECTOR)[0].value;
        dialog.find(SCHEMA_REF)[0].value = selectedSchema;
        dialog.find(XSD_REF)[0].value = '';
        if (configuredFormModel) {
            confirmFormModelChange(selectedSchema, $(FDM_DROPDOWN_SELECTOR));
        } else {
            toBeConfiguredFormModel = selectedSchema;
        }
    };

    function handleJsonSelection(selectedSchema) {
        lastSelectedXsd = '';
        $(SCHEMA_DROPDOWN_SELECTOR).val(selectedSchema);
        removeXsdRootElementMarkup();
    };

    function createRootElementSelectionMarkup(selectedSchema, preselectedRootElement) {
        lastSelectedXsd = selectedSchema;
        var path = selectedSchema + '/jcr:content/renditions/original';
        $.ajax({
            type: "POST",
            url: Granite.HTTP.externalize("/libs/fd/fm/gui/content/forms/guide/validate.html?xsdFilePath=" + encodeURIComponent(path) + "&assetType=guide")
        }).done(function(html){
            var autocomplete =  getXsdRootElementDropDown(html, preselectedRootElement);
            var label = '<label class="coral-Form-fieldlabel">' + Granite.I18n.get("XML Schema Root Element *") + '</label>';
            $(SCHEMA_ROOT_ELEMENT_SELECTOR).html(label);
            $(SCHEMA_ROOT_ELEMENT_SELECTOR).append($(autocomplete));
            $(SCHEMA_DROPDOWN_SELECTOR).val(selectedSchema);
        }).fail(function(e){
            console.log(e);
        });
    };

    function getXsdRootElementDropDown(json, preselectedRootElement){
        var placeHolder = Granite.I18n.get("Select or type a Root Element");
        removeXsdRootElementMarkup();
        var autocomplete = new Coral.Autocomplete().set({
            placeholder : placeHolder,
            required : true
        });
        autocomplete.forceSelection = true;
        $(autocomplete).addClass('rootSelect');
        for(var i = 0; i < json.length; i++){
            var key = Object.keys(json[i]);
            var value = json[i][key];
            var selected = preselectedRootElement == value;
            autocomplete.items.add({
                value : _g.shared.XSS.getXSSValue(value),
                content:
                    {
                        innerHTML : _g.shared.XSS.getXSSValue(key)
                    },
                selected: selected
            });
        }
        return autocomplete;
    };

    function fillXsdDetails(xsdRef) {
        var xsdRootElement = $(XSD_ROOT_ELEMENT_SELECTOR).val();
        createRootElementSelectionMarkup(xsdRef, xsdRootElement);
    };

    /**
     * Clears the ./xsdRootElement attr and deletes the rootElement dropdown markup
     */
    function removeXsdRootElementMarkup(){
        $(XSD_ROOT_ELEMENT_SELECTOR).val('');
        const elements = document.getElementsByClassName('rootSelect');
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    };

    function hideContainersExcept(selectedSchemaType) {
        if (selectedSchemaType == SCHEMA || selectedSchemaType == JSON_SCHEMA || selectedSchemaType == XML_SCHEMA) {
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

    function isTemplate() {
        var currentUrl = window.location.href;
        return !currentUrl.includes("editor.html/content/forms/af/");
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
        channel.on('change', '.rootSelect', function() {
            $(XSD_ROOT_ELEMENT_SELECTOR).val($('.rootSelect').val());
        });
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

    Utils.initializeEditDialog(EDIT_DIALOG)(handleAsyncSubmissionAndThankYouOption, handleSubmitAction,
        registerSubmitActionSubDialogClientLibs, registerRestEndPointDialogClientlibs, registerFDMDialogClientlibs, registerEmailDialogClientlibs, initialiseDataModel);

})(jQuery, Granite, jQuery(document), Coral);
