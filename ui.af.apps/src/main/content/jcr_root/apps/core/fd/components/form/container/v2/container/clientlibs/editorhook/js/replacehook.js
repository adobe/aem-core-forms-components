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
    var editConfigListeners = window.guidelib.author.editConfigListeners;

    window.CQ.FormsCoreComponents.editorhooks.replace = function (editable) {
        // Utils.renderSubDialog(editable);
        var dialog = new Coral.Dialog().set({
            closable : Coral.Dialog.closable.ON,
            header : {
                innerHTML : Granite.I18n.get('Replace Component')
            },
            content : {
                innerHTML : '<coral-search class="ReplaceComponentDialog-search" placeholder="' + Granite.I18n.get("Enter Keyword") + '"></coral-search> <coral-selectlist class="ReplaceComponentDialog-list"></coral-selectlist>'
            }
        });
        document.body.appendChild(dialog);

        var AuthorUtils = author.AuthorUtils;
        var parentTablePath = null;
        var parentTableEditable = null;
        var $searchComponent = null;
        var $clearButton = null;

        // calling parent since table would point to table tag, but we need the table wrapper
        // get the parent path
        // use the path to get the editable since we use the allowed components defined in panel
        // parentTableEditable = author.editables.getParent(editConfigListeners._getEditable(parentTablePath));

        var components = author.components.allowedComponents,
            parent = author.editables.getParent(editable),
            allowedComponents = author.components.computeAllowedComponents(parent, author.pageDesign),
            selectList;

        var filterComponent = function (allowedComponents) {
            var groups = {},
                keyword = "",
                regExp = null;
            // keyword = $searchComponent[0].value,

            // rebuild the selectList entries
            // selectList = {};
            selectList.empty();
            // if (keyword !== undefined && keyword !== null) {
            //     keyword = keyword.trim();
            // } else {
            //     keyword = "";
            // }
            //
            // if (keyword.length > 0) {
            //     regExp = new RegExp(".*" + keyword + ".*", "i");
            // }

            components.forEach(function (c) {
                var cfg = c.componentConfig,
                    g,
                    componentType = cfg.cellNames[0],
                    componentSuperType = cfg.cellNames[cfg.cellNames.length - 2],  // super type is one below guidefield in type hierarchy
                    performReplace = true;

                // if (keyword.length > 0) {
                //     var isKeywordFound = regExp.test(Granite.I18n.getVar(cfg.title));
                // }

                if (true) {
                    performReplace = true;

                    if (performReplace) {
                        if (allowedComponents.indexOf(c.componentConfig.path) > -1 || allowedComponents.indexOf("group:" + c.getGroup()) > -1) {
                            g = c.getGroup();

                            var group = document.createElement('coral-selectlist-group');
                            group.label = Granite.I18n.getVar(g);

                            groups[g] = groups[g] || group;

                            var item = document.createElement('coral-selectlist-item');
                            item.value = cfg.path;
                            item.classList.add('js-ReplaceComponentDialog-component');
                            item.classList.add('ReplaceComponentDialog-component');
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
                    var historyEnabled = author.history.Manager.isEnabled(),
                        historyConfig = author.history.Manager,
                        historyStep = author.history.util.Utils.beginStep(),
                        historyAction = new author.history.actions.fd.Replace(editable.path, editable.path, editable.type, {
                            "editable" : editable,
                            "newComponent" : component[0].getResourceType(),
                            "oldComponent" : editable.type});
                    historyStep.addAction(historyAction);
                    historyStep.commit();
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
        // deleteItemsNode(editable)
        //     .done(function () {
        //         var component = getComponent(author);
        //         console.log(author.components.allowedComponents.find(item =>
        //             item.resourceType = "forms-components-examples/components/form/accordion").getResourceType());
        //         sendReplaceParagraph({
        //             resourceType: component.getResourceType(),
        //             configParams: component.getConfigParams(),
        //             extraParams: component.getExtraParams(),
        //             templatePath: component.getTemplatePath()
        //         }, editable)
        //     });
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
            deleteItemsNode(editable)
                .done(function () {
                    sendReplaceParagraph({
                        resourceType : component.getResourceType(),
                        configParams : component.getConfigParams(),
                        extraParams : component.getExtraParams(),
                        templatePath : component.getTemplatePath()
                    }, editable)
                        .done(function () {
                            // refresh the parent panel
                            editConfigListeners.REFRESH_PARENT_PANEL.apply(editable);
                            // refresh editable
                            editable.refresh().done(function () {
                                // check if properties panel is open
                                if (author.DialogFrame.currentDialog && author.DialogFrame.currentDialog.editable.path == editable.path) {
                                    // clear dialog
                                    author.DialogFrame.clearDialog();
                                    // open dialog
                                    author.DialogFrame.openDialog(new author.edit.Dialog(editable));
                                }
                            });
                            // update the form object hierarchy
                            // update the form object hierarchy by checking if initialized
                            // if (guidelib.touchlib.editLayer.editLayerFormObjects.isInitialized()) {
                            //     guidelib.touchlib.editLayer.editLayerFormObjects.refreshFormObjectsTree(editable.path);
                            // }
                            channel.trigger("cq-persistence-after-replace", args);
                        })
                        .fail(function () {
                            author.ui.helpers.notify({
                                content : Granite.I18n.get("Paragraph replace operation failed."),
                                type : author.ui.helpers.NOTIFICATION_TYPES.ERROR
                            });
                        });
                })
        );
    };

    var getComponent = function (author) {
        return author.components.allowedComponents.find(item => item.resourceType = "forms-components-examples/components/form/accordion");
    }

    var deleteItemsNode = function (editable) {
        console.log('deleting');
        return (
            new author.persistence.PostRequest()
                .deleteItemsNode(editable)
                .send()
        )
    }
    author.persistence.PostRequest.prototype.deleteItemsNode = function (editable) {
        // create params to delete the items node present inside composite field node
        console.log('calling prototype for deleting');
        return (
            this
                .setURL(editable.path + "/items")
                .setParam("_charset_", "utf-8")
                .setParam(":operation", "delete")
        );
    }

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

})(window.parent._afAuthorHook ? window.parent._afAuthorHook._getEditorWindow() : window, Granite.author, Coral, jQuery(document));
