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
(function (window, ns, Coral, channel) {
    const FRAGMENT_CREATION_DIALOG_PATH = "core/fd/components/form/panelcontainer/v1/panelcontainer/saveasfragment_dialog.html";

    const allowedCompFieldTypes = window.CQ.FormsCoreComponents.editorhooks.allowedCompFieldTypes;

    /* Check if fieldType = panel field is present on this component**/
    window.CQ.FormsCoreComponents.editorhooks.isFieldTypePanel = function(editable) {
        const guideContainer = window.CQ.FormsCoreComponents.editorhooks.getGuideContainerProperties(editable.path);
        let fieldType;
        if (guideContainer != null && guideContainer != "") {
            const properties = JSON.parse(guideContainer);
            fieldType = properties['fieldType'];
        }
        return fieldType === "panel";
    }

    const fragmentCreation = {
        getPath : function () {
            return "/mnt/override/libs/" +
                FRAGMENT_CREATION_DIALOG_PATH;
        }
    };
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

    const fragmentCreationDialogConfig = function (componentPath) {
        return {
            src : fragmentCreation.getPath() + componentPath + '?resourceType=' + encodeURIComponent(FRAGMENT_CREATION_DIALOG_PATH),
            isFloating : false,
            loadingMode : "auto",
            layout : "auto"
        };
    };

    // TODO: Fragment creation API integration
    const fragmentCreationDialogDef = (componentPath) =>  {

        const options = {
            data: {
                title: "x",
                name: "y",
                templatePath: "",
                panelPath: componentPath,
                formLocation: "",
                schemaPath: "",
                schemaRoot: "",
                publishDateTime: new Date(),
                unPublishDateTime: "",
                schemaType: "",
            },
            successHandler: () => {},
            errorHandler: () => {}
        };
        return {
            getConfig : function getConfig() {
                return fragmentCreationDialogConfig(componentPath);
            },
            getRequestedData : function getRequestedData() {
                return {
                    resourceType : FRAGMENT_CREATION_DIALOG_PATH
                };
            },
            onOpen : ns.DialogFrame.openDialog,
            onReady : function onReady() {

            },
            onFocus : function onFocus() {

            },
            onClose : ns.DialogFrame.clearDialog,
            resourceType : FRAGMENT_CREATION_DIALOG_PATH
        }
    };


    window.CQ.FormsCoreComponents.editorhooks.saveAsFragment = function (editable) {
        const saveAsFragmentDialog = new ns.ui.Dialog(fragmentCreationDialogDef(editable.path));
        ns.DialogFrame.openDialog(function getDialog() {
            saveAsFragmentDialog.editable = editable;
            // saveAsFragmentDialog.editable = {
            //     path : editable.path,
            //     type : FRAGMENT_CREATION_DIALOG_PATH
            // };
            return saveAsFragmentDialog;
        }());
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

    const initializeFragmentSelect = function (dialog, fragments) {
        const fragmentSelect = dialog.querySelector(".cmp-adaptiveform-saveasfragment__fragmentselect-container");

        var label = '<label class="coral-Form-fieldlabel">' + Granite.I18n.get("Select Fragment Component*") + '</label>';
        var autocomplete = new Coral.Autocomplete().set({
            placeholder: "Select Fragment",
        });
        autocomplete.name = "resourceType"
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

    const attachListener = function (dialog, editable, fragments) {
        const saveButton = dialog.querySelector(".cq-dialog-submit");
        // $(saveButton).off("click");
        saveButton.addEventListener("click", function(event) {
            const name = dialog.querySelector("input[name='name']").value;
            const title = dialog.querySelector("input[name='title']").value;
            const description = dialog.querySelector("input[name='description']").value;
            const folderPath = dialog.querySelector("[name='targetPath']").value;
            const resourceType = dialog.querySelector("[name='resourceType']").value;
            const templatePath = dialog.querySelector("[name='templatePath']").value;

            const selectedIndex = dialog.querySelector("[name='resourceType']").selectedItem.cmpIndex;
            const fragmentComponent = fragments[selectedIndex];

            const options = {
                data: {
                    name, title, description, templatePath, resourceType, folderPath,
                    panelPath: editable.path,
                    themePath: "/libs/fd/af/themes/canvas"
                },
                successHandler: function(response) {
                    console.log("success handler")
                    window.CQ.FormsCoreComponents.editorhooks.doReplace(fragmentComponent, editable, [], { fragmentPath: response.formPath });
                    dialog.querySelector(".cq-dialog-cancel").click()
                },
                errorHandler: function() {
                    console.log("error handler")
                }
            }
            ns.afUtils.createFragmentFromPanelAFV2(options);

            event.preventDefault();
            event.stopPropagation();
        });
    }

    channel.on("foundation-contentloaded", function(e) {
        if ($(e.target).find(".cmp-adaptiveform-saveasfragment").length > 0) {
            Coral.commons.ready(e.target, function(component) {
                const editable = ns.DialogFrame.currentDialog.editable;
                const fragments = getFragmentComponents();
                // Todo: just workaround
                component.querySelector(".cmp-adaptiveform-container__schemaselectorcontainer").hidden = true;
                component.querySelector(".cmp-adaptiveform-container__fdmselectorcontainer").hidden = true;

                initializeFragmentSelect(component, fragments);
                attachListener(component, editable, fragments);
            });
        }
    });

})(window, Granite.author, Coral, jQuery(document));
