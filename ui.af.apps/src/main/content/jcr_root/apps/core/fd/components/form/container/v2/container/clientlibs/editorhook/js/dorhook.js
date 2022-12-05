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
(function (ns, document) {
    var DOR_DIALOG_PATH = "fd/af/authoring/components/dor/dorPropertiesTabs",
        PRINT_NODE_RELATIVE_PATH = "/jcr:content/guideContainer/fd:view/print",
        V2_ADAPTIVE_FORM_CONTAINER_COMPONENT_ATTRIBUTE = "form[data-cmp-is='adaptiveFormContainer']",
        V2_ADAPTIVE_FORM_CONTAINER_COMPONENT_PATH_ATTRIBUTE = "data-cmp-path";

      var getFormPath = function (contentPath) {
                return contentPath.replace(Granite.HTTP.getContextPath(), "");
            },

            options = {
                getPath : function () {
                    return "/mnt/override/libs/" +
                        DOR_DIALOG_PATH +
                        "/cq:dialog.html" + getFormPath(ns.ContentFrame.getContentPath()) +
                        PRINT_NODE_RELATIVE_PATH;
                }
            };
    var dorPropertiesDialogConfig = function () {
            return {
                src : options.getPath() + '?resourceType=' + encodeURIComponent(DOR_DIALOG_PATH),
                isFloating : false,
                loadingMode : "sidePanel",
                layout : "auto"
            };
        };

    var dorPropertiesDialogDef =  {
            getConfig : function getConfig() {
                return dorPropertiesDialogConfig();
            },
            getRequestedData : function getRequestedData() {
                return {
                    resourceType : DOR_DIALOG_PATH
                };
            },
            onOpen : ns.DialogFrame.openDialog,
            onReady : function onReady() {

            },
            onFocus : function onFocus() {

            },
            onSuccess :function() {console.log('success')},

            onClose : ns.DialogFrame.clearDialog,
            resourceType : DOR_DIALOG_PATH
        };
    var dorDialog = new ns.ui.Dialog(dorPropertiesDialogDef);

    window.CQ.FormsCoreComponents.editorhooks.openDorDialog =  function (editable) {
         ns.DialogFrame.openDialog(function getDialog() {
             var editable = {
                 path : ns.ContentFrame.getContentPath().replace(Granite.HTTP.getContextPath(), "") + PRINT_NODE_RELATIVE_PATH,
                 type : DOR_DIALOG_PATH
             };
             dorDialog.editable = editable;
             return dorDialog;
         }());
    }

    window.CQ.FormsCoreComponents.editorhooks.initPreviewDoR = function() {
        var url = getFormPath(ns.ContentFrame.getContentPath()) + "/jcr:content/guideContainer.af.dor.pdf";
        window.open(Granite.HTTP.externalize(url), "_blank");
    }

    window.CQ.FormsCoreComponents.editorhooks.isAutoGenerateDoRConfigured = function(editable) {
        var guideContainer = getGuideContainerProperties();
        if (guideContainer != null && guideContainer != "") {
            var item = JSON.parse(guideContainer),
                dorType = item['dorType'];
        }
        if (dorType == "generate") {
            return true;
        } else
            return false;
    }

    function fetchAuthorContentFrameDocument() {
        var contentFrameDocumentArray = ns.ContentFrame ? ns.ContentFrame.getDocument() : [];
        if (contentFrameDocumentArray && contentFrameDocumentArray.length > 0) {
            return contentFrameDocumentArray[0];
        }
    };

    function getGuideContainerProperties() {
        var contentFrame = fetchAuthorContentFrameDocument();
        var result = $.ajax({
            type: 'GET',
            async: false,
            url: Granite.HTTP.externalize(contentFrame.querySelector(V2_ADAPTIVE_FORM_CONTAINER_COMPONENT_ATTRIBUTE)
                .getAttribute(V2_ADAPTIVE_FORM_CONTAINER_COMPONENT_PATH_ATTRIBUTE) + ".0.json"),
            cache: false
        });
        return result.responseText;
    }

    function getStrongMarkup(strValue) {
        return "<strong>" + Granite.I18n.getMessage(strValue) + "</strong>";
    }

}(Granite.author, document));