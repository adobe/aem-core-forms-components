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

(function($, channel, Coral, Granite, author) {
    "use strict";

    var DOR_NONE = "none";
    var DOR_SELECT = "select";
    var DOR_GENERATE = "generate";
    var ACROFORM = "acroform";
    var DOR_TYPE = "dorType";
    var DOR_TEMPLATE_REF = "dorTemplateRef";
    var DOR_TYPE_SELECTOR_SEL = ".cmp-adaptiveform-container__dortypeselector";
    var DOR_TEMPLATE_SELECTOR_CONTAINER_SEL = ".cmp-adaptiveform-container__dortemplateselectorcontainer";
    var DOR_TYPE_SELECTED_SEL = ".cmp-adaptiveform-container__dorType";
    var DOR_TEMPLATE_REF_SELECTOR = ".cmp-adaptiveform-container__dortemplateref"
    var DOR_TEMPLATE_TYPE_SELECTOR = ".cmp-adaptiveform-container__dortemplatetype";
    var DOR_DEFAULT_TEMPLATE_SELECTOR = ".cmp-adaptiveform-container__dordefaulttemplate"
    var DOR_SLING_RESOURCETYPE_SELECTOR = ".cmp-adaptiveform-container__dorslingresourcetype";
    var DOR_TEMPLATE_SELECTOR = ".cmp-adaptiveform-container__dortemplateselector";
    var DOR_GENERATE_VIEW_SEL = ".cmp-adaptiveform-container__dorgenerateview";

    var dorTemplateRef;
    var dorTemplateRef_initial = null;
    var dorDataModelExists = false;
    var baseManageServletPath="/libs/fd/fm/content/basemanage.json?func=";

    author.afUtils.initialiseDorTemplateConfig = function() {
        var dorType = $(DOR_TYPE_SELECTED_SEL).val() || DOR_NONE;
        selectDorConfig(dorType);
        dorTemplateRef_initial = null;
        if(dorType ===  DOR_SELECT) {
            dorTemplateRef = $(DOR_TEMPLATE_REF_SELECTOR).val();
            dorTemplateRef_initial = dorTemplateRef;
        }
        channel.on("change", DOR_TYPE_SELECTOR_SEL, selectDorConfigOnChanage);
        createDorTemplateSelector(dorTemplateRef)
            .then(() => {
                $(document).on("change", DOR_TEMPLATE_SELECTOR, onDorTemplateChange);
            })
    }

    const selectDorConfigOnChanage = function() {
        var dorType = selectedDorType();
        showHideDorSelector(dorType);
        prepareSubmission();
        if(dorType !== DOR_SELECT) {
            $(DOR_TEMPLATE_SELECTOR).adaptTo("foundation-validation").checkValidity();
            $(DOR_TEMPLATE_SELECTOR).adaptTo("foundation-validation").updateUI();
        }
    }

    function showHideDorSelector(dorType) {
        if(dorType === DOR_NONE) {
            $(DOR_TEMPLATE_SELECTOR_CONTAINER_SEL).hide();
        } else if(dorType === DOR_SELECT) {
            $(DOR_TEMPLATE_SELECTOR_CONTAINER_SEL).show();
        } else {
            $(DOR_TEMPLATE_SELECTOR_CONTAINER_SEL).hide();
        }
    }

    function prepareSubmission() {
        var dorType = selectedDorType();
        resetViewForm();
        $(DOR_TYPE_SELECTED_SEL).val(dorType);
        if(dorType === DOR_NONE) {
            $(DOR_TEMPLATE_REF_SELECTOR).attr("name", "./dorTemplateRef@Delete");
            addViewFormParameter("./fd:view@Delete", "")
        } if(dorType === DOR_SELECT) {
            $(DOR_TEMPLATE_REF_SELECTOR).attr("name", "./dorTemplateRef");
            onDorTemplateChange();
            addViewFormParameter("./fd:view@Delete", "")
        } else if(dorType === DOR_GENERATE) {
            $(DOR_TEMPLATE_REF_SELECTOR).attr("name", "./dorTemplateRef@Delete");
            addViewFormParameter("./fd:view/print/jcr:created", "");
            addViewFormParameter("./fd:view/print/jcr:lastModified", "");
            addViewFormParameter("./fd:view/print/metaTemplateRef", $(DOR_DEFAULT_TEMPLATE_SELECTOR).val());
            addViewFormParameter("./fd:view/print/sling:resourceType", $(DOR_SLING_RESOURCETYPE_SELECTOR).val());
        }
    }

    function onDorTemplateChange() {
        var selectedDor = getSelectedDor();
        if(selectedDor) {
            dorTemplateRef = selectedDor.value;
            $(DOR_TEMPLATE_REF_SELECTOR).val(selectedDor.value);
            if(selectedDor.dorTemplateType === ACROFORM) {
                $(DOR_TEMPLATE_TYPE_SELECTOR).attr("name", "./fd:formtype");
                $(DOR_TEMPLATE_TYPE_SELECTOR).val(ACROFORM);
            } else {
                $(DOR_TEMPLATE_TYPE_SELECTOR).attr("name", "./fd:formtype@Delete");
            }
        }
    }

    function getSelectedDor() {
        var dorTemplateElement = document.querySelector(DOR_TEMPLATE_SELECTOR);
        if(dorTemplateElement.invalid) {
            return;
        }
        return dorTemplateElement.selectedItem;

    }

    function resetViewForm() {
        $(DOR_GENERATE_VIEW_SEL).empty();
    }

    function addViewFormParameter(name, value) {
        var input = document.createElement('input');
        input.setAttribute("type", "hidden");
        input.setAttribute("name", name);
        input.setAttribute("value", value);
        $(DOR_GENERATE_VIEW_SEL).append(input);
    };

    function selectDorConfig(dorType) {
        var dorTypeSelector = document.querySelectorAll(DOR_TYPE_SELECTOR_SEL + " coral-radio");
        dorTypeSelector.forEach(function(item) {
            if(item.value === dorType) {
                item.checked = true;
            } else {
                item.checked = false;
            }
        })
        showHideDorSelector(dorType);
    }

    function getDorTemplateAutocomplete(dorTemplates, dorTemplateRef) {
        var placeholder = Granite.I18n.get("Select or type dor template");
        var autocomplete = new Coral.Autocomplete().set({
            placeholder: placeholder
        });
        autocomplete.classList.add("cmp-adaptiveform-container__dortemplateselector");
        $(autocomplete).attr("data-dor-template-validation", "");
        autocomplete.forceSelection = true;
        for(var i = 0; i < dorTemplates.length; i++) {
            var templateJson = dorTemplates[i];
            autocomplete.items.add({
                value: templateJson.path,
                content: {
                    dorTemplateType: templateJson.dorTemplateType,
                    dorDataModelExists: templateJson.dorDataModelExists,
                    innerHTML: _g.shared.XSS.getXSSValue(templateJson.title)
                },
                selected: dorTemplateRef === templateJson.path
            })
        }
        return autocomplete;
    }

    function createDorTemplateSelector(dorTemplateRef) {
        var path = "/libs/fd/af/components/info.json";
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: Granite.HTTP.externalize(path + "?type=dor")
            }).done(function(result){
                var autocomplete =  getDorTemplateAutocomplete(result, dorTemplateRef);
                /**
                 * Edge case when an AFCS conversion done from a non-acro form PDF,and the PDF is not listed in DoR listing from server.
                 * We need to add the current dorTempRef explicitly to the auto complete list marking it selected
                 */
                if (!autocomplete.selectedItem && dorTemplateRef) {
                    autocomplete.items.add({
                        value: dorTemplateRef,
                        content: {
                            innerHTML: _g.shared.XSS.getXSSValue(dorTemplateRef.substring(dorTemplateRef.lastIndexOf('/')+1))
                        },
                        selected: true
                    })
                }
                var label = '<label class="coral-Form-fieldlabel">' + Granite.I18n.get("Select template for Document of Record *") + '</label>';
                $(DOR_TEMPLATE_SELECTOR_CONTAINER_SEL).html(label);
                $(DOR_TEMPLATE_SELECTOR_CONTAINER_SEL).append($(autocomplete));
                resolve();
            }).fail(function(e){
                console.log(e);
                reject();
            });
        })
    }

    function getDorMetaData() {
        var data = {};
        var dorType = selectedDorType();
        data[DOR_TYPE] = dorType;
        dorDataModelExists = false;
        if(dorType === DOR_SELECT) {
            data[DOR_TEMPLATE_REF] = dorTemplateRef;
            var selectedDor = getSelectedDor();
            if(selectedDor) {
                if(selectedDor.dorTemplateType === ACROFORM) {
                    data["fd:formtype"] = ACROFORM;
                    if(dorTemplateRef_initial !== dorTemplateRef) {
                        data["dorTemplateChanged"] = true;
                    }
                    dorDataModelExists = !!selectedDor.dorDataModelExists;
                }
                data["metaTemplateRef@Delete"] = "";
            }
        } else if(dorType === DOR_GENERATE) {
            data["dorTemplateRef@Delete"] = "";

        } else if(dorType === DOR_NONE) {
            data["dorTemplateRef@Delete"] = "";
            data["metaTemplateRef@Delete"] = "";
        }
        return data;
    }

    function selectedDorType() {
        var dorTypeElem = document.querySelectorAll(DOR_TYPE_SELECTOR_SEL +" coral-radio");
        for(var idx = 0; idx < dorTypeElem.length; idx++){
            if(dorTypeElem[idx].checked) {
                return dorTypeElem[idx].value;
            }
        }
    }

    $(document).on("submit", "form.foundation-form", function(e) {
        var form = $(this);
        var currentEditable = author.DialogFrame.currentDialog.editable;
        if(form.find(".cmp-adaptiveform-container__dortemplate").length > 0
            && currentEditable
            && currentEditable.dom.find("[data-cmp-is='adaptiveFormContainer']").length > 0
            && isForm()) {
            var dorMetaData = getDorMetaData();
            var formContainerPath = currentEditable.dom.find("[data-cmp-is='adaptiveFormContainer']").data("cmp-path");
            var afPath = formContainerPath.substr(0, formContainerPath.indexOf('/jcr:content'));
            var formPath = afPath.replace("/content/forms/af/", "/content/dam/formsanddocuments/");
            $.ajax({
                type: "POST",
                url: Granite.HTTP.externalize(formPath + "/jcr:content/metadata"),
                data: dorMetaData
            }).done(function(result) {
                if(!(result && result.hasOwnProperty("code") && result.hasOwnProperty("rootCause"))) {
                    if (dorMetaData.dorType === DOR_GENERATE) {
                        let urlSuffix = 'downloadDOR&formPath=' + encodeURIComponent(formPath);
                        formService(urlSuffix);
                    }
                    if (dorMetaData.dorType === DOR_SELECT) {
                        // we need to check whether dor template type is acroform
                        if (dorMetaData["fd:formtype"]&& !dorDataModelExists ) {
                            //check whether dorDataModel exists or not, if it exists we dont create it again
                            let urlSuffix = "createDoRDataModel&dorTemplateRef="+ encodeURIComponent(dorMetaData.dorTemplateRef)
                            formService(urlSuffix);
                        }
                    }
                }
            }).fail(function(e){
                console.log(e);
            });
        }
    })

    function formService(urlSuffix) {
        var url = Granite.HTTP.externalize(baseManageServletPath + urlSuffix);
        $.ajax({
            type: 'POST',
            url: url,
            data : {_charset_ : "UTF-8"}
        }).fail(function(error) {
            console.log(error);
        })
    }

    function isForm(){
        return author.page.path.startsWith("/content/forms/af/");
    }

    $(window).adaptTo("foundation-registry").register("foundation.validation.validator", {
        selector : "[data-dor-template-validation]",
        validate : function (el) {
            let dorTemplate = el.value;
            if($(DOR_TEMPLATE_SELECTOR_CONTAINER_SEL).is(":visible") && dorTemplate.length === 0) {
                return Granite.I18n.getMessage("This is a required field");
            }
        }
    });

})(jQuery, jQuery(document), Coral, Granite, Granite.author);
