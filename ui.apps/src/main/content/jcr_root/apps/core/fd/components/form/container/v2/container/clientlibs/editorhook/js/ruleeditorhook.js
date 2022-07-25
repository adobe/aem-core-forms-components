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
(function() {

    "use strict";
    window.CQ = window.CQ || {};
    window.CQ.FormsCoreComponents = window.CQ.FormsCoreComponents || {};
    window.CQ.FormsCoreComponents.editorhooks =  window.CQ.FormsCoreComponents.editorhooks || {};
    window.CQ.FormsCoreComponents.editorhooks.openRuleEditor = function (editable) {
        let existingRuleEditorFrame = document.getElementById('af-rule-editor');
        if (existingRuleEditorFrame) {
            existingRuleEditorFrame.parentNode.removeChild(existingRuleEditorFrame);
        }
        let ruleEditorFrame = document.createElement('iframe');
        ruleEditorFrame.setAttribute('id','af-rule-editor');
        let ruleEditorUri = '/aem/af/expeditor.html' + getFormContainerPath(editable) + "?fieldPath="+ editable.path + "&fieldId="+ getFieldId(editable);
        ruleEditorFrame.setAttribute('src', ruleEditorUri);
        ruleEditorFrame.setAttribute('title', 'AF Rule Editor');
        ruleEditorFrame.style.display = "block";
        ruleEditorFrame.style.width = "100%";
        ruleEditorFrame.style.height = "100%";
        ruleEditorFrame.style.position = "fixed";
        document.body.appendChild(ruleEditorFrame);
    }

    function getFormContainerPath(editable) {
        return editable.dom.find("[data-cmp-adaptiveformcontainer-path]").data("cmpAdaptiveformcontainerPath");
    }

    function getFieldId(editable) {
        return editable.dom.find("[data-cmp-adaptiveformcontainer-path]").attr('id');
    }

})();
