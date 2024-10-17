/*******************************************************************************
 * Copyright 2024 Adobe
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
(function (window, ns, Coral, channel) {
    "use strict";

    const SAVE_AS_FRAGMENT_DIALOG_SELECTOR = ".cmp-adaptiveform-saveasfragment",
        NAME_SELECTOR = "input[name='name']",
        TITLE_SELECTOR = "input[name='jcr:title']",
        TARGET_PATH_SELECTOR = "[name='targetPath']",
        TEMPLATE_PATH_SELECTOR = "[name='templatePath']",
        FRAGMENT_COMPONENT_SELECTOR = "[name='fragmentComponent']",
        SCHEMA_REF = "input[name='./schemaRef']",
        FORM_MODEL_SELECTOR = ".cmp-adaptiveform-container__selectformmodel";

    const DEFAULT_THEME_PATH = "/libs/fd/af/themes/canvas";

    let containerProperties = {};

    const fragmentCmpCache = {};
    const getFragmentComponents = () => {
        const components = ns.components.allowedComponents;
        const fragments = [];
        components.forEach(component => {
            const componentPath = component.getPath();
            const compTemplatePath = component.getTemplatePath();
            if (compTemplatePath && !fragmentCmpCache.hasOwnProperty(componentPath)) {
                const templateJson = getComponentJson(compTemplatePath, ".json");
                fragmentCmpCache[componentPath] = templateJson?.fieldType === "panel" && templateJson.hasOwnProperty("fragmentPath");
            }
            if(fragmentCmpCache[componentPath]) {
                fragments.push(component)
            }
        });
        return fragments;
    }

    function getComponentJson(componentPath, jsonPath) {
        const result = $.ajax({
            type: 'GET',
            async: false,
            url: Granite.HTTP.externalize(componentPath + jsonPath),
            cache: false
        });
        return result.responseJSON;
    }

    const initializeFragmentSelector = function (dialog, fragments) {
        const fragmentSelect = dialog.querySelector(".cmp-adaptiveform-saveasfragment__fragmentselector-container");

        var label = '<label class="coral-Form-fieldlabel">' + Granite.I18n.get("Select Fragment Component*") + '</label>';
        var autocomplete = new Coral.Autocomplete().set({
            placeholder: Granite.I18n.getMessage("Select Fragment"),
        });
        autocomplete.name = "fragmentComponent"
        autocomplete.required = true;
        fragments.forEach((fragment, idx) => {
            autocomplete.items.add({
                value: fragment.getResourceType(),
                content: {
                    textContent: fragment.getTitle(),
                    cmpIndex: idx
                },
                selected: idx === 0
            })
        })
        autocomplete.classList.add("coral-Form-field");
        fragmentSelect.innerHTML = label;
        fragmentSelect.appendChild(autocomplete);
    }

    const initializeDataModel = function (dialog, editable) {
        const schemaType = containerProperties.schemaType;
        const schemaRef = containerProperties.schemaRef;
        const schemaTypeElement = dialog.querySelector(FORM_MODEL_SELECTOR);
        if(schemaType) {
            schemaTypeElement && (schemaTypeElement.value = schemaType);
        }
        if(schemaRef) {
            const schemaRefElement = dialog.querySelector(SCHEMA_REF);
            schemaRefElement && (schemaRefElement.value = schemaRef);
        }
        schemaTypeElement.disabled = true;
        window.CQ.FormsCoreComponents.Utils.DataModel.initialiseDataModel($(dialog));
    }

    const initializeTargetPath = function(dialog, editable) {
        const path = editable.path;
        const targetPathElement = dialog.querySelector("[name='targetPath']");
        if(path.startsWith("/content/forms/af/") && path.indexOf("/jcr:content/guideContainer/") > -1) {
            let formPath = path.substring(0, path.indexOf("/jcr:content/guideContainer/"));
            let targetPath = formPath.substring(0, formPath.lastIndexOf("/"));
            targetPath = targetPath.replace("/content/forms/af", "/content/dam/formsanddocuments");
            targetPathElement.value = targetPath;
        } else {
            targetPathElement.value = "/content/dam/formsanddocuments";
        }
    }

    const saveButtonClickHandler = (dialog, editable, fragments) => {
        const name = dialog.querySelector(NAME_SELECTOR).value;
        const title = dialog.querySelector(TITLE_SELECTOR).value;
        const folderPath = dialog.querySelector(TARGET_PATH_SELECTOR).value;
        const templatePath = dialog.querySelector(TEMPLATE_PATH_SELECTOR).value;
        const schemaType = dialog.querySelector(FORM_MODEL_SELECTOR).value;
        const schemaPath = dialog.querySelector(SCHEMA_REF).value;

        const selectedIndex = dialog.querySelector(FRAGMENT_COMPONENT_SELECTOR).selectedItem.cmpIndex;
        const fragmentComponent = fragments[selectedIndex];
        const fragmentComponentPath = fragmentComponent.getPath();

        const options = {
            data: {
                name, templatePath, folderPath, fragmentComponentPath, schemaType, schemaPath,
                title: title || name,
                panelPath: editable.path,
                themePath: containerProperties.themeRef || DEFAULT_THEME_PATH
            },
            successHandler: function(response) {
                editable.refresh();
                dialog.querySelector(".cq-dialog-cancel").click()
            },
            errorHandler: function(response) {
                const responseJson = response.responseJSON;
                let headerMessage = "";
                let contentMessage = "";
                if (responseJson.title === "AEM-FMG-900-002") {
                    headerMessage = "Fragment with same name already exists";
                    contentMessage = "A fragment with this name already exists. Please enter a different name and retry.";
                } else {
                    contentMessage = "Fragment Creation Failed. Please Retry";
                }

                const dialog = new Coral.Dialog().set({
                    header : {
                        innerHTML : Granite.I18n.getMessage(headerMessage)
                    },
                    content : {
                        innerHTML : Granite.I18n.getMessage(contentMessage)
                    },
                    footer : {
                        innerHTML : '<button is="coral-button" variant="primary" coral-close>Ok</button> <button is="coral-button" variant="primary" coral-close>Cancel</button>'
                    },
                    closable : "on"
                });
                document.body.appendChild(dialog);
                dialog.show();
            }
        }
        const fields = $(dialog.querySelector("form")).find(":-foundation-submittable").toArray();
        let isFormValid = true;
        fields.forEach(function(field) {
            const f = $(field).adaptTo("foundation-validation");
            if (!f.checkValidity()) {
                f.updateUI();
                isFormValid = false;
            }
        });
        if (!isFormValid) {
            return;
        }
        ns.afUtils.createFragmentFromPanelAFV2(options);
    }


    const attachEventListeners = function (dialog, editable, fragments) {
        const saveButton = dialog.querySelector(".cq-dialog-submit");
        saveButton.addEventListener("click", function (event) {
            saveButtonClickHandler(dialog, editable, fragments);
            event.preventDefault();
            event.stopPropagation();
        });
    }

    const getFormContainerProperties = function (editable) {
        const elem = editable.dom.find('[data-cmp-adaptiveformcontainer-path]');
        const containerPath = elem?.data('cmp-adaptiveformcontainer-path');
        if (!containerPath) return;
        return window.CQ.FormsCoreComponents.editorhooks.getFormContainerProperties(containerPath);
    }

    channel.on("foundation-contentloaded", function(e) {
        if ($(e.target).find(SAVE_AS_FRAGMENT_DIALOG_SELECTOR).length > 0) {
            Coral.commons.ready(e.target, function(component) {
                const editable = ns.DialogFrame.currentDialog.editable;
                const fragments = getFragmentComponents();
                containerProperties = getFormContainerProperties(editable);
                initializeTargetPath(component, editable);
                initializeFragmentSelector(component, fragments);
                initializeDataModel(component, editable);
                attachEventListeners(component, editable, fragments);
            });
        }
    });

})(window, Granite.author, Coral, jQuery(document));
