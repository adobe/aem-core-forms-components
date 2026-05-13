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
        'datetime-input': fieldTypes.TEXT,
        'drop-down': fieldTypes.SELECT,
        'email': fieldTypes.TEXT,
        'multiline-input': fieldTypes.TEXT,
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
        'placeholder', 'readOnly', 'required', 'tooltip', 'visible', 'enum', 'enumNames', 'type'];

    const cannotBeReplacedWith = ['file-input'],
        irreplaceable = ['file-input'],
        editableJsonPath = '.model.json',
        componentJsonPath = '.json';
    const dialogCssClass = 'cmp-replace-dialog-search-components';

    const doReplace = window.CQ.FormsCoreComponents.editorhooks.doReplace;
    const allowedCompFieldTypes = window.CQ.FormsCoreComponents.editorhooks.allowedCompFieldTypes;


    function getComponentType(componentPath, jsonPath) {
        const result = $.ajax({
            type: 'GET',
            async: false,
            url: Granite.HTTP.externalize(componentPath + jsonPath),
            cache: false
        });
        return result.responseJSON && result.responseJSON.fieldType;
    }

    /**
     * Component .json often omits fieldType; default resource model.json has it (used for replace matching).
     */
    function getTemplateFieldType(compTemplatePath) {
        var ft = getComponentType(compTemplatePath, componentJsonPath);
        if (ft) {
            return ft;
        }
        return getComponentType(compTemplatePath, editableJsonPath);
    }

    /**
     * Restrict replace targets to components allowed in the direct parent container (e.g. table row policy).
     * @param {Array} allowedFromParent from author.components.computeAllowedComponents
     * @returns {Set|null} template paths, or null to skip filtering
     */
    function buildAllowedTemplatePathSet(allowedFromParent) {
        if (!allowedFromParent || !allowedFromParent.length) {
            return null;
        }
        var set = new Set();
        allowedFromParent.forEach(function (c) {
            var tp = c.templatePath || (c.componentConfig && c.componentConfig.templatePath);
            if (tp) {
                set.add(tp);
            }
        });
        return set.size ? set : null;
    }

    /**
     * Inside a table row cell, allow replacing with any field allowed in the row (not only same typeMap family),
     * e.g. text input → checkbox, while still respecting row policy and cannotBeReplacedWith.
     */
    function isUnderCoreTableRow(editable) {
        var p = author.editables.getParent(editable);
        while (p) {
            if (typeof p.type === "string" &&
                (p.type.indexOf("/form/tablerow/") !== -1 || p.type.indexOf("/form/tableheader/") !== -1)) {
                return true;
            }
            p = author.editables.getParent(p);
        }
        return false;
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

        dialog.content.classList.add(dialogCssClass);

        document.body.appendChild(dialog);

        var components = author.components.allowedComponents,
            parent = author.editables.getParent(editable),
            allowedComponents = author.components.computeAllowedComponents(parent, author.pageDesign),
            selectList;

        var allowedTemplatePaths = buildAllowedTemplatePathSet(allowedComponents);
        var skipTypeFamilyMatch = isUnderCoreTableRow(editable);

        var filterComponent = function () {
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
                if (allowedTemplatePaths && !allowedTemplatePaths.has(compTemplatePath)) {
                    return;
                }
                if (!allowedCompFieldTypes[compTemplatePath]) {
                    allowedCompFieldTypes[compTemplatePath] = getTemplateFieldType(compTemplatePath);
                }

                var cfg = component.componentConfig,
                    g,
                    componentType = allowedCompFieldTypes[compTemplatePath],
                    performReplace = false;

                if (keyword.length > 0) {
                    var isKeywordFound = regExp.test(Granite.I18n.getVar(cfg.title));
                }

                if (!(keyword.length > 0) || isKeywordFound) {
                    var sameTypeFamily = typeMap[editableType] === typeMap[componentType];
                    if (!cannotBeReplacedWith.includes(componentType)
                        && (skipTypeFamilyMatch || sameTypeFamily)) {
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

        var bindEventToReplaceComponentDialog = function () {
            $searchComponent.off("keydown.replaceComponent.coral-search");
            $searchComponent.on("keydown.replaceComponent.coral-search", $.debounce(150, function (event) {
                filterComponent();
            }));

            $clearButton.off("click.replaceComponent.clearButton");
            $clearButton.on("click.replaceComponent.clearButton", function () {
                if ($searchComponent[0].value.trim().length) {
                    $searchComponent[0].value = "";
                    filterComponent();
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
            $('.' + dialogCssClass).css("min-width", "320px");

            filterComponent();
            bindEventToReplaceComponentDialog();
            dialog.show();
        });
    }

    window.CQ.FormsCoreComponents.editorhooks.replace = function (editable) {
        window.CQ.FormsCoreComponents.editorhooks.openCmpSelectionDialog(editable, "Replace Component", doReplace);
    }

})(window, Granite.author, Coral, jQuery(document));
    