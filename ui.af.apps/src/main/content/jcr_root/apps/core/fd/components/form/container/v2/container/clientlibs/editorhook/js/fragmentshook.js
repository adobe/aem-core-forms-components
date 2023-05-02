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
    const FRAGMENT_CREATION_DIALOG_PATH = "core/fd/components/form/panelcontainer/v1/panelcontainer/cq:fragmentCreationDialog.html";

    function getGuideContainerProperties(editablePath) {
        const result = $.ajax({
            type: 'GET',
            async: false,
            url: Granite.HTTP.externalize( editablePath + ".0.json"),
            cache: false
        });
        return result.responseText;
    }

    /* Check if fieldType = panel field is present on this component**/
    window.CQ.FormsCoreComponents.editorhooks.isFieldTypePanel = function(editable) {
        const guideContainer = getGuideContainerProperties(editable.path);
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

    const fragmentCreationDialogConfig = function (componentPath) {
        return {
            src : fragmentCreation.getPath() + componentPath + '?resourceType=' + encodeURIComponent(FRAGMENT_CREATION_DIALOG_PATH),
            isFloating : false,
            loadingMode : "auto",
            layout : "auto"
        };
    };

    const fragmentCreationDialogDef = (componentPath) =>  {
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
            onSuccess :function() {console.log('success')},

            onClose : ns.DialogFrame.clearDialog,
            resourceType : FRAGMENT_CREATION_DIALOG_PATH
        }
    };


    window.CQ.FormsCoreComponents.editorhooks.saveAsFragment = function (editable) {
        const saveAsFragmentDialog = new ns.ui.Dialog(fragmentCreationDialogDef(editable.path));
        ns.DialogFrame.openDialog(function getDialog() {
            saveAsFragmentDialog.editable = {
                path : editable.path,
                type : FRAGMENT_CREATION_DIALOG_PATH
            };
            return saveAsFragmentDialog;
        }());
    }
})(window, Granite.author, Coral, jQuery(document));
