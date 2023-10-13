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
(function (window, author, Coral) {
    "use strict";

    /**
     * Get Qualified name for a component
     * @param {Object} component The component that has to be instantiated
     */
    window.CQ.FormsCoreComponents.editorhooks.viewQualifiedName = function (component) {
        author.afUtils.getQualifiedName(component).then(function (componentQualifiedName) {
            const localisedQualifiedNameMessage = CQ.I18n.getMessage('Qualified Name');
            const localizedWaringMessageForQualifiedName = CQ.I18n.getMessage("A Qualified Name is based on the position of the component. It changes if a component is moved.");
            const dialog = new Coral.Dialog().set({
                id: 'getQualifiedNameDialog',
                header: {
                    innerHTML: localisedQualifiedNameMessage
                },
                content: {
                    innerHTML: componentQualifiedName + '<br/> <br/>' + "<strong>*</strong>" + localizedWaringMessageForQualifiedName
                },
                footer: {},
                closable: "on"
            });
            document.body.appendChild(dialog);

            dialog.show();
        });
    };

})(window, Granite.author, Coral);