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
(function (window, author, Coral, channel) {
    "use strict";
    const fieldTypes = {
        BINARY: 'binary',
        TEXT: 'text',
        SELECT: 'select',
        CHECKBOX: 'checkBox',
        LIST: 'list',
        DATE: 'date',
        NON_INPUT: 'nonInputReadOnly',
        CONTAINER: 'container'
    }
    const typeMap = {
        'button': fieldTypes.NON_INPUT,
        'checkbox-group': fieldTypes.SELECT,
        'checkbox': fieldTypes.CHECKBOX,
        'date-input': fieldTypes.TEXT,
        'drop-down': fieldTypes.SELECT,
        'email': fieldTypes.TEXT,
        'number-input': fieldTypes.TEXT,
        'radio-group': fieldTypes.SELECT,
        'reset': fieldTypes.NON_INPUT,
        'submit': fieldTypes.NON_INPUT,
        'text-input': fieldTypes.TEXT,
        'plain-text': fieldTypes.NON_INPUT,
        'title': fieldTypes.NON_INPUT,
        'image': fieldTypes.NON_INPUT,
        'panel': fieldTypes.CONTAINER
    }

    const preservedProperties = ['id', 'description', 'enabled', 'jcr:created', 'jcr:title', 'name',
        'placeholder', 'readOnly', 'required', 'tooltip', 'visible', 'enum', 'enumNames'];

    const cannotBeReplacedWith = ['file-input'],
        irreplaceable = ['file-input'],
        editableJsonPath = '.model.json',
        componentJsonPath = '.json';

    const doReplace = window.CQ.FormsCoreComponents.editorhooks.doReplace;
    const allowedCompFieldTypes = window.CQ.FormsCoreComponents.editorhooks.allowedCompFieldTypes;


    function getComponentType(componentPath, jsonPath) {
        const result = $.ajax({
            type: 'GET',
            async: false,
            url: Granite.HTTP.externalize(componentPath + jsonPath),
            cache: false
        });
        return result.responseJSON.fieldType;
    }

    window.CQ.FormsCoreComponents.editorhooks.isReplaceable = function (editable) {
        return !irreplaceable.includes(getComponentType(editable.path, editableJsonPath));
    }

    window.CQ.FormsCoreComponents.editorhooks.openCmpSelectionDialog = function (editable, title, actionCallback) {
        var $searchComponent = null;
        var $clearButton = null;

        var dialog = new Coral.Dialog().set({
            closable: Coral.Dialog.closable.ON,
            header: {
                innerHTML: Granite.I18n.get(title)
            },
            content: {
                innerHTML: '<coral-search class="cmp-replace-dialog-search" placeholder="' + Granite.I18n.get("Enter Keyword") + '"></coral-search> <coral-selectlist class="cmp-replace-dialog-list"></coral-selectlist>'
            }
        });

        dialog.content.classList.add('cmp-replace-dialog-search-components');

        document.body.appendChild(dialog);

        var components = author.components.allowedComponents,
            parent = author.editables.getParent(editable),
            allowedComponents = author.components.computeAllowedComponents(parent, author.pageDesign),
            selectList;

        var filterComponent = function (allowedComponents) {
            var editableType = getComponentType(editable.path, editableJsonPath);
            var groups = {},
                keyword = $searchComponent[0].value,
                regExp = null;


            selectList.empty();
            if (keyword !== undefined && keyword !== null) {
                keyword = keyword.trim();
            } else {
                keyword = "";
            }

            if (keyword.length > 0) {
                regExp = new RegExp(".*" + keyword + ".*", "i");
            }

            // adding components that can be replaced by current component
            components.forEach(component => {
                var compTemplatePath = component.componentConfig.templatePath;
                if (!compTemplatePath) {
                    return;
                }
                if (!allowedCompFieldTypes[compTemplatePath]) {
                    allowedCompFieldTypes[compTemplatePath] = getComponentType(compTemplatePath, componentJsonPath);
                }

                var cfg = component.componentConfig,
                    g,
                    componentType = allowedCompFieldTypes[compTemplatePath],
                    performReplace = false;

                if (keyword.length > 0) {
                    var isKeywordFound = regExp.test(Granite.I18n.getVar(cfg.title));
                }

                if (!(keyword.length > 0) || isKeywordFound) {
                    if ((!cannotBeReplacedWith.includes(componentType))
                        && typeMap[editableType] === typeMap[componentType]) {
                        performReplace = true;
                    }

                    if (performReplace) {
                        g = component.getGroup();

                        var group = document.createElement('coral-selectlist-group');
                        group.label = Granite.I18n.getVar(g);

                        groups[g] = groups[g] || group;

                        var item = document.createElement('coral-selectlist-item');
                        item.value = cfg.path;
                        item.innerHTML = Granite.I18n.getVar(cfg.title);

                        groups[g].items.add(item);
                    }
                }
            });

            Object.keys(groups).forEach(function (g) {
                selectList.append(groups[g]);
            });
        };

        var bindEventToReplaceComponentDialog = function (allowedComponents, editable) {
            $searchComponent.off("keydown.replaceComponent.coral-search");
            $searchComponent.on("keydown.replaceComponent.coral-search", $.debounce(150, function (event) {
                filterComponent(allowedComponents);
            }));

            $clearButton.off("click.replaceComponent.clearButton");
            $clearButton.on("click.replaceComponent.clearButton", function () {
                if ($searchComponent[0].value.trim().length) {
                    $searchComponent[0].value = "";
                    filterComponent(allowedComponents);
                }
            });

            selectList.off('coral-selectlist:change').on('coral-selectlist:change', function (event) {
                selectList.off('coral-selectlist:change');
                var component = author.components.find(event.detail.selection.value);
                if (component.length > 0) {
                    actionCallback(component[0], editable, preservedProperties);
                }
                dialog.hide();
                dialog.remove();
            });
        }

        Coral.commons.ready(dialog, function () {
            selectList = $(dialog).find(".cmp-replace-dialog-list");
            $searchComponent = $(dialog).find('.cmp-replace-dialog-search');
            $clearButton = $searchComponent.find('button');

            filterComponent(allowedComponents);
            bindEventToReplaceComponentDialog(allowedComponents, editable);
            dialog.show();
        });
    }

    window.CQ.FormsCoreComponents.editorhooks.replace = function (editable) {
        window.CQ.FormsCoreComponents.editorhooks.openCmpSelectionDialog(editable, "Replace Component", doReplace);
    }

})(window, Granite.author, Coral, jQuery(document));
