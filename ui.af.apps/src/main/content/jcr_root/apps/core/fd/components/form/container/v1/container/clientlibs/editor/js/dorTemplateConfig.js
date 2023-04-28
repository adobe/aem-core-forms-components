/*******************************************************************************
 * Copyright 2023 Adobe
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

(function ($, channel, Coral, Granite, author) {
    "use strict";

    var DOR_NONE = "none";
    var DOR_SELECT = "select";
    var DOR_GENERATE = "generate";
    var DOR_TYPE_SELECTOR_SEL = ".cmp-adaptiveform-container__dortypeselector";
    var DOR_TEMPLATE_SELECTOR_CONTAINER_SEL = ".cmp-adaptiveform-container__dortemplateselectorcontainer";
    var DOR_TYPE_SELECTED_SEL = ".cmp-adaptiveform-container__dorType";
    var DOR_TEMPLATE_REF_SELECTOR = ".cmp-adaptiveform-container__dortemplateref"
    var DOR_TEMPLATE_SELECTOR = ".cmp-adaptiveform-container__dortemplateselector";
    var DEFAULT_TEMPLATE_LIMIT = 20;

    var dorTemplateRef = null;
    var dorType;
    var dorTemplateConfigApi = "/adobe/forms/author/af/dor/template";
    var dorTemplateListingApi = "/adobe/forms/author/af/dor/templates"

    author.afUtils.initialiseDorTemplateConfig = function () {
        dorType = $(DOR_TYPE_SELECTED_SEL).val() || DOR_NONE;
        $(DOR_TYPE_SELECTED_SEL).remove();
        selectDorConfig(dorType);
        if (dorType === DOR_SELECT) {
            var val = $(DOR_TEMPLATE_REF_SELECTOR).val();
            if (val) {
                dorTemplateRef = {
                    path: val,
                    title: val.substring(val.lastIndexOf("/") + 1)
                }
            }
        }
        $(DOR_TEMPLATE_REF_SELECTOR).removeAttr("name");
        channel.on("change", DOR_TYPE_SELECTOR_SEL, selectDorConfigOnChanage);
        createDorTemplateSelector()
    }

    const selectDorConfigOnChanage = function () {
        dorType = selectedDorType();
        showHideDorSelector(dorType);
        if (dorType !== DOR_SELECT) {
            $(DOR_TEMPLATE_SELECTOR).adaptTo("foundation-validation").checkValidity();
            $(DOR_TEMPLATE_SELECTOR).adaptTo("foundation-validation").updateUI();
        }
    }

    function showHideDorSelector(dorType) {
        if (dorType === DOR_NONE) {
            $(DOR_TEMPLATE_SELECTOR_CONTAINER_SEL).hide();
        } else if (dorType === DOR_SELECT) {
            $(DOR_TEMPLATE_SELECTOR_CONTAINER_SEL).show();
        } else {
            $(DOR_TEMPLATE_SELECTOR_CONTAINER_SEL).hide();
        }
    }

    function onDorTemplateChange() {
        var dorTemplateElement = document.querySelector(DOR_TEMPLATE_SELECTOR);
        if (dorTemplateElement.invalid) {
            return;
        }
        var selectedItems = dorTemplateElement.selectedItems;
        if (selectedItems) {
            var selectedItem = selectedItems[selectedItems.length - 1];
            dorTemplateRef = {
                path: selectedItem.value,
                title: selectedItem.innerHTML
            }
            dorTemplateElement.selectedItems.forEach(el => el.remove()); 
        }
        if(dorTemplateRef) {
            dorTemplateElement.items.add({
                value: dorTemplateRef.path,
                content: {
                    innerHTML: dorTemplateRef.title
                },
                selected: true
            }); 
        }
    }

    function selectDorConfig(dorType) {
        var dorTypeSelector = document.querySelectorAll(DOR_TYPE_SELECTOR_SEL + " coral-radio");
        dorTypeSelector.forEach(function (item) {
            if (item.value === dorType) {
                item.checked = true;
            } else {
                item.checked = false;
            }
        })
        showHideDorSelector(dorType);
    }

    function getDorTemplateAutocomplete() {
        var placeholder = Granite.I18n.get("Select or type dor template");
        var autocomplete = new Coral.Autocomplete().set({
            placeholder: placeholder
        });
        autocomplete.classList.add("cmp-adaptiveform-container__dortemplateselector");
        $(autocomplete).attr("data-dor-template-validation", "");
        autocomplete.multiple = false;
        return autocomplete;
    }

    function createDorTemplateSelector() {
        var autocomplete = getDorTemplateAutocomplete();
        var label = '<label class="coral-Form-fieldlabel">' + Granite.I18n.get("Select template for Document of Record *") + '</label>';
        $(DOR_TEMPLATE_SELECTOR_CONTAINER_SEL).html(label);
        $(DOR_TEMPLATE_SELECTOR_CONTAINER_SEL).append($(autocomplete));
        bindSuggestionEvent(autocomplete);
        if (dorTemplateRef) {
            autocomplete.items.add({
                value: dorTemplateRef.path,
                content: {
                    innerHTML: dorTemplateRef.title
                },
                selected: true
            })
        }
        $(document).on("change", DOR_TEMPLATE_SELECTOR, onDorTemplateChange)
    }

    function bindSuggestionEvent(autocomplete, url) {
        var request;
        var startRecord = null;
        autocomplete.on("coral-autocomplete:showsuggestions", function (event) {
            if (request) {
                request.abort();
            }
            event.preventDefault();
            // Get the user input as lowercase
            var userInput = event.detail.value.toLowerCase() || "";
            startRecord = event.detail.start;

            request = fetchTemplates(dorTemplateListingApi + "?limit=" + DEFAULT_TEMPLATE_LIMIT + "&offset=" + startRecord,
                { text: userInput }, function (suggestions) {
                    autocomplete.addSuggestions(suggestions);
                });
        });

        autocomplete.on('coral-autocomplete:hidesuggestions', function () {
            // If the suggestions were hidden, abort the request
            if (request) {
                request.abort();
            }
        });
    }

    function fetchTemplates(url, { text }, callback) {
        var request = $.ajax({
            type: "GET",
            url: Granite.HTTP.externalize(url + "&text=" + text)
        }).done(res => {
            var dorTemplates = res.items;
            var suggestions = []
            for (var i = 0; i < dorTemplates.length; i++) {
                var templateJson = dorTemplates[i];
                suggestions.push({
                    value: templateJson.path,
                    content: _g.shared.XSS.getXSSValue(templateJson.title)
                })
            }
            callback(suggestions);
        })
        return request;
    }

    function selectedDorType() {
        var dorTypeElem = document.querySelectorAll(DOR_TYPE_SELECTOR_SEL + " coral-radio");
        for (var idx = 0; idx < dorTypeElem.length; idx++) {
            if (dorTypeElem[idx].checked) {
                return dorTypeElem[idx].value;
            }
        }
    }

    $(document).on("submit", "form.foundation-form", function (e) {
        var form = $(this);
        var currentEditable = author.DialogFrame.currentDialog.editable;
        if (form.find(".cmp-adaptiveform-container__dortemplate").length > 0
            && currentEditable
            && currentEditable.dom.find("[data-cmp-is='adaptiveFormContainer']").length > 0
            && isForm()) {
            var formContainerPath = currentEditable.dom.find("[data-cmp-is='adaptiveFormContainer']").data("cmp-path");
            var afPath = formContainerPath.substr(0, formContainerPath.indexOf('/jcr:content'));
            $.ajax({
                type: "POST",
                url: Granite.HTTP.externalize(dorTemplateConfigApi + "/" + btoa(afPath)),
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(getDorTemplateConfig())
            }).fail(function (e) {
                console.error("Error while configuring DoR Template", e);
            });
        }
    })

    function getDorTemplateConfig() {
        var data = {};
        if (dorType === DOR_GENERATE) {
            data.dorType = dorType;
        } else if (dorType === DOR_SELECT) {
            data.dorType = dorType;
            data.dorTemplateRef = dorTemplateRef.path;
        } else {
            data.dorType = DOR_NONE;
        }
        return data;
    }

    function isForm() {
        return author.page.path.startsWith("/content/forms/af/");
    }

    $(window).adaptTo("foundation-registry").register("foundation.validation.validator", {
        selector: "[data-dor-template-validation]",
        validate: function (el) {
            let dorTemplate = el.value;
            if ($(DOR_TEMPLATE_SELECTOR_CONTAINER_SEL).is(":visible") && dorTemplate.length === 0) {
                return Granite.I18n.getMessage("This is a required field");
            }
        }
    });

})(jQuery, jQuery(document), Coral, Granite, Granite.author);
