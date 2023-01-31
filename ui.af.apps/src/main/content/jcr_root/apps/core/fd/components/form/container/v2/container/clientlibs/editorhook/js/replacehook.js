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
    const fieldTypes = {BINARY: 'binary', TEXT: 'text', SELECT_ONE: 'select_one', LIST: 'list', DATE: 'date'}
    const typeMap = {
        'button': fieldTypes.TEXT,
        'checkboxgroup': fieldTypes.LIST,
        'datepicker': fieldTypes.DATE,
        'dropdown': fieldTypes.SELECT_ONE,
        'emailinput': fieldTypes.TEXT,
        'numberinput': fieldTypes.TEXT,
        'radiobutton': fieldTypes.SELECT_ONE,
        'reset': fieldTypes.TEXT,
        'submit': fieldTypes.TEXT,
        'telephoneinput': fieldTypes.TEXT,
        'text': fieldTypes.TEXT,
        'textinput': fieldTypes.TEXT,
        'title': fieldTypes.TEXT
    }
    const nonReplaceable = ['fileinput', 'image'];

    window.CQ.FormsCoreComponents.editorhooks.replace = function (editable) {

        var $searchComponent = null;
        var $clearButton = null;
        var isContainerComponent = editable.config.isContainer;

        var dialog = new Coral.Dialog().set({
            closable: Coral.Dialog.closable.ON,
            header: {
                innerHTML: Granite.I18n.get('Replace Component')
            },
            content: {
                innerHTML: '<coral-search class="ReplaceComponentDialog-search" placeholder="' + Granite.I18n.get("Enter Keyword") + '"></coral-search> <coral-selectlist class="ReplaceComponentDialog-list"></coral-selectlist>'
            }
        });

        dialog.classList.add('ReplaceComponentDialog');
        dialog.content.classList.add('ReplaceComponentDialog-components');

        document.body.appendChild(dialog);

        var components = author.components.allowedComponents,
            parent = author.editables.getParent(editable),
            allowedComponents = author.components.computeAllowedComponents(parent, author.pageDesign),
            selectList;

        var typeHierarchy = author.components.find({resourceType: this.type})[0].componentConfig.cellNames,
            editableType = editable.getResourceTypeName()
        editableSuperType = typeHierarchy[typeHierarchy.length - 2]; // super type is one below guidefield in type hierarchy

        var filterComponent = function (allowedComponents) {
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
            components.forEach(function (c) {
                var cfg = c.componentConfig,
                    g,
                    componentType = cfg.cellNames[0],
                    componentSuperType = cfg.cellNames[cfg.cellNames.length - 2],
                    performReplace = false;

                if (keyword.length > 0) {
                    var isKeywordFound = regExp.test(Granite.I18n.getVar(cfg.title));
                }

                if (!(keyword.length > 0) || isKeywordFound) {
                    // if ((isContainerComponent === c.componentConfig.isContainer && editableType != componentType) ||
                    //     (!nonReplaceable.includes(componentType) &&
                    //         typeMap[editableType] === typeMap[componentType])) {

                    if ((!nonReplaceable.includes(componentType) && editableType != componentType)
                        && ((isContainerComponent && c.componentConfig.isContainer)
                            || (!isContainerComponent && componentSuperType === editableSuperType))) {
                        performReplace = true;
                    }

                    if (performReplace) {
                        if (allowedComponents.indexOf(c.componentConfig.path) > -1 || allowedComponents.indexOf("group:" + c.getGroup()) > -1) {
                            g = c.getGroup();

                            var group = document.createElement('coral-selectlist-group');
                            group.label = Granite.I18n.getVar(g);

                            groups[g] = groups[g] || group;

                            var item = document.createElement('coral-selectlist-item');
                            item.value = cfg.path;
                            item.classList.add('_coral-Menu-item'); //add item css here
                            item.innerHTML = Granite.I18n.getVar(cfg.title);

                            groups[g].items.add(item);
                        }
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
                    author.persistence.replaceParagraph(component[0], editable);
                }
                dialog.hide();
            });
        }

        Coral.commons.ready(dialog, function () {
            selectList = $(dialog).find(".ReplaceComponentDialog-list");
            $searchComponent = $(dialog).find('.ReplaceComponentDialog-search');
            $clearButton = $searchComponent.find('button');

            filterComponent(allowedComponents);
            bindEventToReplaceComponentDialog(allowedComponents, editable);
            dialog.show();
        });
    }

    /**
     * Replace an existing component
     * @param {Object} component The component that has to be instantiated
     * @param {Object} [editable] editable which has to be replaced
     * @return {$.Deferred} A deferred object that will be resolved when the request is completed.
     */
    // delete node
    author.persistence.replaceParagraph = function (component, editable) {
        var args = arguments;

        channel.trigger("cq-persistence-before-replace", args);

        return (
            sendReplaceParagraph({
                resourceType: component.getResourceType(),
                configParams: component.getConfigParams(),
                extraParams: component.getExtraParams(),
                templatePath: component.getTemplatePath()
            }, editable)
                .done(function () {
                    window.CQ.FormsCoreComponents.editorhooks._refreshEditable(editable, component);
                    channel.trigger("cq-persistence-after-replace", args);
                })
                .fail(function () {
                    author.ui.helpers.notify({
                        content: Granite.I18n.get("Paragraph replace operation failed."),
                        type: author.ui.helpers.NOTIFICATION_TYPES.ERROR
                    });
                })
        );
    };

    window.CQ.FormsCoreComponents.editorhooks._refreshEditable = function (editable, component) {
        editable.refresh().done(function () {
            var callbackInvoked = false;
            var addedComponentPath = component.path;
            if (addedComponentPath) {
                guideTouchLib.editLayer.Interactions.onOverlayClick({
                    editable : Granite.author.editables.find(addedComponentPath)[0]
                });
                guidelib.author.editConfigListeners.addedComponentPath = undefined;
            }
        });
    };

    /**
     * Send a request to replace an existing component
     * @param {String} config.resourceType The resource type of the new paragraph.
     * @param {Object} [config.configParams] The config parameters to be set upon the new paragraph's creation.
     * @param {Object} [config.extraParams] The extra parameters (would override other params) to be set upon the new paragraph's creation.
     * @param  {String} [config.templatePath] The path to the template definition that should be used.
     * @param {Object} [editable] editable to replace
     * @return {$.Deferred} A deferred object that will be resolved when the request is completed.
     */
    var sendReplaceParagraph = function (config, editable) {
        return (
            new author.persistence.PostRequest()
                .prepareReplaceParagraph(config, editable)
                .send()
        );
    };

    author.persistence.PostRequest.prototype.prepareReplaceParagraph = function (config, editable) {
        // apply component properties over editable
        if (config.templatePath) {
            var comTemplatePath = Granite.HTTP.externalize(config.templatePath),
                comData = CQ.shared.HTTP.eval(comTemplatePath + ".infinity.json"); // get component default json
            editableJson = CQ.shared.HTTP.eval(editable.path + ".infinity.json"); // get editable json
            comGuideNodeClass = comData.guideNodeClass; // guideNodeClass has to be written in editable so preserve it

            // delete those properties of component which are already present in editable
            for (p in comData) {
                if (editableJson.hasOwnProperty(p)) {
                    delete comData[p];
                }
            }

            // restore guideNodeClass and sling:resourceType of component so that gets written in editable
            comData["guideNodeClass"] = comGuideNodeClass;
            comData["sling:resourceType"] = config.resourceType;
            this.setParam(":content", JSON.stringify(comData));    // write component properties
        }

        // overwrite editable properties with component properties so that data is not lost while replace operation
        return (
            this
                .setURL(editable.path)
                .setParam("_charset_", "utf-8")
                .setParams(config.configParams)
                .setParams(config.extraParams)
                .setParam(":operation", "import")
                .setParam(":contentType", "json")
                .setParam(":replace", true)
                .setParam(":replaceProperties", true)
        );
    };

})(window.parent._afAuthorHook ? window.parent._afAuthorHook._getEditorWindow() : window, Granite.author, Coral, jQuery(document));
