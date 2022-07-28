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
(function ($,ExpressionEditorUtil) {

    var form = {};
    var fetchFormMetadata = function () {
        form.path = $("#rule-meta-info").data("formpath");
        form.selectedFieldPath = $("#rule-meta-info").data("fieldpath");
        form.selectedFieldId = $("#rule-meta-info").data("fieldid");
    };
    $(document).on('foundation-contentloaded', function () {
        fetchFormMetadata();
        if (form.path) {
            initialiseExpressionEditor(form.path, form.selectedFieldId);
        }
    });

    var _getConfiguration = function (treeJson, fieldId) {
        var configurator = new expeditor.rb.RuleBuilderConfigurator();
        var grammar = {
            ROOT : {
                rule : "STATEMENT",
                component : 'expeditor.component.RootComponent',
                model : 'expeditor.model.RootModel'
            }
        };

        var operators = configurator.getDefaultOperators();
        var config = configurator.addGrammar(JSON.stringify(grammar))
            .enableOperator(operators)
            .addStatement("CALC_EXPRESSION", true)
            .getConfig();


        var node = _getNodeById(fieldId, treeJson);
        if (node) {
            var jsonModel = {
                "VALUE_FIELD" : {
                    "value" : {
                        "id" : node.id,
                        "type" : expeditor.Utils.filterPrimitiveTypes(node.type),
                        "name" : node.name
                    }
                }
            };
            config["CALC_EXPRESSION"].jsonModel = jsonModel;
        }
        return config;
    };

    var _getNodeById = function (id, json) {
        if (json.id === id) {
            return json;
        }
        if (json.items) {
            var returnJson = null;
            _.find(json.items, function (item, index) {
                returnJson = _getNodeById(id, item);
                return returnJson != null;
            }, this);
            if (returnJson) {
                return returnJson;
            }
        }
    }

    var saveHandler = function (currentModel) {
        var ruleJson = JSON.stringify(currentModel.toJson()); //deep copying the model
        var requestPath = Granite.HTTP.externalize(form.selectedFieldPath) + "?rules=" + ruleJson;

        $.ajax({url : requestPath, method : "post"})
            .then(function () {
               console.log("script saved successfully");
            }).fail(function () {
                console.error("Operation Failed: Unable to complete the last operation");
            });
    }

    var _tranformFormJsonToTreeJson = function (formJson) {
        var treeJson = {};
        generateTreeJson(formJson, treeJson);
        return treeJson;
    };

    var generateTreeJson = function (json, treeJson) {
        if (json.hasOwnProperty("fieldType") && json.fieldType !== 'panel') { //leaf node
            treeJson.items.push(getTreeJsonForNode(json));
        } else { //top level form or a panel
            var parentJson = getTreeJsonForNode(json);
            if (!_.isEmpty(treeJson)) {
                treeJson.items.push(parentJson);
            } else {
                treeJson = Object.assign(treeJson, parentJson)
            }
            for (var i = 0; i < json.items.length; i++) {
                generateTreeJson(json.items[i], parentJson);
            }
        }
    }

    var getExpEditorDataType = function(nodeJson) {
        var type = "";
        if (nodeJson.hasOwnProperty("fieldType")) {
            if (nodeJson.fieldType === 'panel') {
                type = 'PANEL'
            } else {
                switch (nodeJson.type) {
                    case "string": {
                        type = 'STRING';
                        if (nodeJson.format === "date") {
                            type = 'DATE';
                        }
                        break;
                    }
                }
            }
        } else {
            type = "FORM";
        }
        return type;
    };

    var getTreeJsonForNode = function(nodeJson) {
        return {
            id: nodeJson.id || nodeJson.name || "adaptive_form",
            name: nodeJson.name || "FORM",
            displayName: nodeJson.label ? nodeJson.label.value : this.name,
            type: getExpEditorDataType(nodeJson),
            path: nodeJson.name,
            items: []
        }
    }

    var initialiseExpressionEditor =  function (formPath, fieldId) {
        $.get(Granite.HTTP.externalize(formPath) + '.model.json', function(formJson) {
            let treeJson = _tranformFormJsonToTreeJson(formJson)
            _initialiseExpressionEditorInternal(treeJson, fieldId);
        });
    };

    var _initialiseExpressionEditorInternal = function (treeJson, fieldId) {
        var closeHandler = function () {
            let iframe = window.parent.document.getElementById("af-rule-editor");
            if (iframe) {
                iframe.parentNode.removeChild(iframe);
            }
        };
        var getIconFromObjectType = function(node) {
            var typeToIconMap = {
                object: 'group',
                array: 'ungroup',
                integer: '123',
                number: '123',
                string: 'abc',
                date: 'calendar',
                boolean: 'dataCorrelated'
            };
            return typeToIconMap[node.type.toLowerCase()];
        };

        var dragDataHandler = function (elementId) {
            return elementId;
        };

        var functionsConfig = expeditor.rb.FunctionsConfig;
        functionsConfig.dragDataHandler = dragDataHandler;

        var editor = new expeditor.ExpressionEditor({
            config : _getConfiguration(treeJson, fieldId),
            closeHandler : closeHandler,
            saveHandler : saveHandler,
            navigationTreeConfig : {
                json : treeJson,
                defaultTypes : ["FORM"],
                getObjectIcon : getIconFromObjectType,
            },
            treeConfig : {
                json : treeJson,
                defaultTypes : ["FORM"],
                getObjectIcon : getIconFromObjectType,
                dragDataHandler : dragDataHandler
            },
            functionsConfig : functionsConfig,
            summaryTransformer : expeditor.ToSummaryTransformer,
            doNotSaveIncompleteRule : true
        });
        editor.show();
    };


})($, guidelib.author.ExpressionEditorUtil);