/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2024 Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

(function($, channel, Coral) {
    "use strict";

    // TODO: For now this file is beign picked, while moving to FAR make sure both file are synced

    window.CQ = window.CQ || {};
    window.CQ.FormsCoreComponents = window.CQ.FormsCoreComponents || {};
    window.CQ.FormsCoreComponents.Utils = window.CQ.FormsCoreComponents.Utils || {};
    const DataModel = window.CQ.FormsCoreComponents.Utils.DataModel = window.CQ.FormsCoreComponents.Utils.DataModel || {};

    var FORM_CONTAINER_SELECTOR = "[data-cmp-is='adaptiveFormContainer']";

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
        return afWindow.$(FORM_CONTAINER_SELECTOR).data("cmp-path");
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
    }

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

    $(window).adaptTo("foundation-registry").register("foundation.validation.validator", {
        selector : "[data-validation~='datamodel.config']",
        validate : function (el) {
            let $el = $(el);
            if($el.is(":visible") && $el[0].value === '') {
                return Granite.I18n.getMessage("This is a required field");
            }
        }
    });

    DataModel.initialiseDataModel = function (dialog) {
        var formModelSelector = dialog.find(FORM_MODEL_SELECTOR)[0],
            schemaSelector = dialog.find(SCHEMA_DROPDOWN_SELECTOR)[0],
            fdmSelector = dialog.find(FDM_DROPDOWN_SELECTOR)[0],
            connectorSelector = dialog.find(CONNECTOR_DROPDOWN_SELECTOR)[0];
        if (formModelSelector) {
            formModelSelector.on("change", function() {
                selectFormModelOnChanged(dialog);
            });
        }
        if (schemaSelector) {
            schemaSelector.on("change", function() {
                schemaSelectorOnChanged(dialog);
            });
        }
        if (fdmSelector) {
            fdmSelector.on("change", function() {
                fdmSelectorOnChanged(dialog);
            });
        }
        if (connectorSelector) {
            connectorSelector.on("change", function() {
                connectorSelectorOnChanged(dialog);
            });
        };
        selectFormModelOnLoad(dialog);
    }

    DataModel.initialiseDataModel = function (dialog) {
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

})(jQuery, jQuery(document), Coral);