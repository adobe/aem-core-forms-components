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
(function ($, ns) {

    "use strict";
    window.CQ = window.CQ || {};
    window.CQ.FormsCoreComponents = window.CQ.FormsCoreComponents || {};
    window.CQ.FormsCoreComponents.editorhooks =  window.CQ.FormsCoreComponents.editorhooks || {};
    /**
     * Opens the rule editor in a separate iframe for an editable
     * @param editable
     */
    if (typeof window.CQ.FormsCoreComponents.editorhooks.openRuleEditor !== 'function') {
        window.CQ.FormsCoreComponents.editorhooks.openRuleEditor = function (editable) {
            let existingRuleEditorFrame = document.getElementById('af-rule-editor');
            if (existingRuleEditorFrame) {
                existingRuleEditorFrame.parentNode.removeChild(existingRuleEditorFrame);
            }
            let ruleEditorFrame = document.createElement('iframe');
            ruleEditorFrame.setAttribute('id', 'af-rule-editor');
            let formContainerPath = window.CQ.FormsCoreComponents.editorhooks.getFormContainerPath (editable);
            if (!formContainerPath) {
                showAlert();
            } else {
                const ruleEditorUri = '/aem/af/expeditor.html' + window.CQ.FormsCoreComponents.editorhooks.getFormContainerPath(editable) + "?fieldPath=" + editable.path + "&fieldId=" + getFieldId(editable);
                ruleEditorFrame.setAttribute('src', ruleEditorUri);
                ruleEditorFrame.setAttribute('title', 'AF Rule Editor');
                const styles = {
                    display: "block",
                    width: "100%",
                    height: "100%",
                    top: "0",
                    left: "0",
                    position: "fixed",
                    zIndex: "10"
                };

                Object.assign(ruleEditorFrame.style, styles);
                document.body.appendChild(ruleEditorFrame);
            }
        }
    }

    function getFieldId(editable) {
        return editable.dom.find("[data-cmp-adaptiveformcontainer-path]").attr('id');
    }

    function showAlert() {
        var ui = $(window).adaptTo('foundation-ui');
        ui.alert(Granite.I18n.get('Information'), Granite.I18n.get('Please initialise the component to open the rule editor'), 'notice');
    }

    function getRuleEditorUri(editable) {
        return Granite.HTTP.externalize('/aem/af/expeditor.html' + getFormContainerPath(editable) 
                    + "?fieldPath=" + editable.path + "&fieldId=" + getFieldId(editable));
    }

})(jQuery, Granite.author);
