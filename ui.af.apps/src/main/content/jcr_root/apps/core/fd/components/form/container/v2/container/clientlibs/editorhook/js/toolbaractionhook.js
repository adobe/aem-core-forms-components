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
(function (ns) {
    "use strict";
    let superSitesEditorAppendButton = ns.edit.Toolbar.prototype.appendButton;

    /**
     * @override
     */
    ns.edit.Toolbar.prototype.appendButton = function (editable, name, action) {
        correctEditableEditorType(editable, name);
        superSitesEditorAppendButton.apply(this, [editable, name, action]);
    };

    /**
     * @override
     * In case of forms editor we are overriding sites toolbar actions and has a custom toolbar implementation.
     * Therefore, needs a special handling.
     */
    if(window.guidelib){
        var superFormsEditorAppendButton = window.guidelib.touchlib.editToolbar.prototype.appendButton;
        window.guidelib.touchlib.editToolbar.prototype.appendButton = function (editable, name, action) {
            //adding this check because we don't want to change editorType for v1 forms.
            if(window.guidelib.touchlib.utils.checkIfCoreComponentsBasedForm()){
                correctEditableEditorType(editable, name);
            }
            superFormsEditorAppendButton.apply(this, [editable, name, action]);
        };
    };

    const correctEditableEditorType = function (editable, name) {
        if (name === "EDIT") {
            const isAFComponent = editable.dom.find("[data-cmp-is^='adaptiveForm']")[0] != null;
            if (isAFComponent && editable.config.editConfig.inplaceEditingConfig) {
                const isAdobeSignBlock = editable.dom.find("[data-cmp-is='adaptiveFormAdobeSignBlock']")[0] != null;
                if (isAdobeSignBlock) {
                    // Adobe Sign Block stores rich HTML in __value; _cq_editConfig uses editorType=text with adobesignplugin
                    editable.config.editConfig.inplaceEditingConfig.editorType = "text";
                    return;
                }
                const hasRichTextLabel = editable.dom.find("[class$='__label']")[0] && editable.dom.find("[class$='__label']")[0].getAttribute("data-richtext") != null,
                    hasRichTextAttribute = editable.dom.find("[class$='__text']")[0] && editable.dom.find("[class$='__text']")[0].getAttribute("data-richtext") != null,
                    hasRichTextValue = editable.dom.find("[class$='__value']")[0] && editable.dom.find("[class$='__value']")[0].getAttribute("data-richtext") != null;
                // Use data-richtext on label, text, or value to decide rich-text vs plain-text inplace editor
                if (!(hasRichTextLabel || hasRichTextAttribute || hasRichTextValue)) {
                    editable.config.editConfig.inplaceEditingConfig.editorType = "plaintext";
                } else {
                    editable.config.editConfig.inplaceEditingConfig.editorType = "text";
                }
            }
        }
    };

}(Granite.author));
