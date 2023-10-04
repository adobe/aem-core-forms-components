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
    var _superSitesEditorAppendButton = ns.edit.Toolbar.prototype.appendButton;

    /**
     * @override
     */
    ns.edit.Toolbar.prototype.appendButton = function (editable, name, action) {
        _correctEditableEditorType(editable, name);
        _superSitesEditorAppendButton.apply(this, [editable, name, action]);
    };

    if(window.guidelib){
        var _superFormsEditorAppendButton = window.guidelib.touchlib.editToolbar.prototype.appendButton;
        window.guidelib.touchlib.editToolbar.prototype.appendButton = function (editable, name, action) {
            _correctEditableEditorType(editable, name);
            _superFormsEditorAppendButton.apply(this, [editable, name, action]);
        };
    };

    function _correctEditableEditorType(editable, name) {
        if (name == "EDIT") {
            var hasRichTextLabel = editable.dom.find("[class$='__label']")[0] && editable.dom.find("[class$='__label']")[0].getAttribute("data-richtext") != null,
                hasRichTextAttribute = editable.dom.find("[class$='__text']")[0] && editable.dom.find("[class$='__text']")[0].getAttribute("data-richtext") != null;
            // We are checking for data-richtext in component to decide whether open rich-text inplace editor or plain text editor
            if(!(hasRichTextLabel || hasRichTextAttribute)){
                editable.config.editConfig.inplaceEditingConfig.editorType="plaintext";
            }
        }
    };

}(Granite.author));
