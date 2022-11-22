/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2022 Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
(function($, channel, Coral) {
    "use strict";

    window.CQ = window.CQ || {};
    window.CQ.FormsCoreComponents = window.CQ.FormsCoreComponents || {};
    window.CQ.FormsCoreComponents.Utils = window.CQ.FormsCoreComponents.Utils || {};

    /**
     * Utility class which can be used during authoring
     */
    window.CQ.FormsCoreComponents.Utils.v1 = class Utils {
        constructor() {
            if (this instanceof Utils) {
                throw Error('A static class cannot be instantiated.');
            }
        }
        /**
         * Toggles the display of the given elements based on the condition
         * @param {HTMLElement} components The html elements to show/hide
         */
        static checkAndDisplay(components) {
            return function(condition) {
                var elemArray = components instanceof Array ? components : [components];
                elemArray.forEach(function(elem) {
                    if (condition()) {
                        elem.show()
                    } else {
                        elem.hide()
                    }
                });
            }
        }

        /**
         * Manipulates the component name and value
         * @param {HTMLElement} components The html elements to show/hide
         */
        static manipulateNameAndValue(components) {
            return function(newNames, newValues) {
                let elemArray = components instanceof Array ? components : [components];
                elemArray.forEach(function(elem, index) {
                    if (typeof newNames[index] !== 'undefined' && newNames[index] != null && elem) {
                        elem.name = newNames[index];
                    }
                    if (typeof newValues[index] !== 'undefined' && newValues[index] != null && elem) {
                        elem.value = newValues[index];
                    }
                });
            }
        }

        /**
         * encodes <script> and </script> with &lt;script&gt; and *lt;/script&gt;
         * and also img,video and audio tag respectively
         *
         * other tags are being removed since scripts can be run through
         * <img onerror="script" /> (same for audio and video)
         */
        static encodeScriptableTags (str) {
            let retStr = str;
            if (typeof str === 'string' || str instanceof String) {
                retStr = str.replace(/<(\/?)(script[^<>]*)>/gi, '&lt;$1$2&gt;')
                    .replace(/<(\/?)(img[^<>]*)>/gi, '&lt;$1$2&gt;')
                    .replace(/<(\/?)(video[^<>]*)>/gi, '&lt;$1$2&gt;')
                    .replace(/<(\/?)(audio[^<>]*)>/gi, '&lt;$1$2&gt;');
            }
            return retStr;
        }

        /**
         * Get selected radio option helper
         * @param component The radio option component
         * @returns {String} Value of the selected radio option
         */
        static getSelectedRadioGroupOption(component) {
            var radioComp = component.find('[type="radio"]');
            for (var i = 0; i < radioComp.length; i++) {
                if ($(radioComp[i]).prop("checked")) {
                    return $(radioComp[i]).val();
                }
            }
            return undefined;
        }

        /**
         * Initialise the edit dialog based on its class name
         * @param {String} editDialogClass CSS class of the edit dialog
         */
        static initializeEditDialog(editDialogClass) {
            return function() {
                var args = Array.prototype.slice.call(arguments);
                /**
                 * Initialise the conditional display of the various elements of the dialog.
                 *
                 * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
                 */
                function initialise(dialog) {
                    dialog = $(dialog);
                    args.forEach(function(x){x(dialog)});
                }
                channel.on("foundation-contentloaded", function(e) {
                    if ($(e.target).find(editDialogClass).length > 0) {
                        Coral.commons.ready(e.target, function(component) {
                            initialise(component);
                        });
                    }
                });
            };
        }

        /**
         * Renders sub dialog inside the container specified for the given component path
         * @param container         {HTMLElement}    container on which the dialog is to be rendered
         * @param dialogPath        {String}        resource type of the dialog
         */
        static renderSubDialog(container) {
            return function(dialogPath, callback) {
                var args = Array.prototype.slice.call(arguments);
                var $container = $(container);
                var componentPath = $container.data("componentpath");
                var isDialogRendered = false;
                if (componentPath && dialogPath) {
                    $container.empty();
                    var currentDialogPath = dialogPath + "/cq:dialog.html";
                    if (currentDialogPath.indexOf("/") !== 0) {
                        currentDialogPath = "/mnt/overlay/" + currentDialogPath;
                    }
                    var actionPath = currentDialogPath + componentPath;
                    var subDialogResponse = CQ.shared.HTTP.get(actionPath);
                    if (CQ.shared.HTTP.isOk(subDialogResponse)) {
                        var parser = $(window).adaptTo("foundation-util-htmlparser"),
                            html = subDialogResponse.body;
                        parser.parse(html, true).then(function (dialogHtml) {
                            var $subDialogContent = $(dialogHtml).find('.cq-dialog-content');
                            $subDialogContent.addClass("guide-dialog");
                            if ($subDialogContent.length > 0) {
                                isDialogRendered = true;
                                $container.append($subDialogContent);
                                $subDialogContent.trigger('foundation-contentloaded');
                                callback(isDialogRendered);
                            }
                        });
                    }
                }
                callback(isDialogRendered);
            };
        }

        static handlePatternDropDown(dialog, patternClass, formatClass) {
            var patternComponent = dialog.find(patternClass)[0];
            var formatComponent = dialog.find(formatClass)[0];
            _managePatternDynamicBehaviour();
            patternComponent.addEventListener("change", _managePatternDynamicBehaviour );
            function _managePatternDynamicBehaviour() {
                var displayPatternSelectedValue = patternComponent.selectedItem.innerHTML;
                var patternComponentOptionsNodeList=patternComponent.querySelectorAll('coral-select-item');
                if(patternComponentOptionsNodeList.length<=2 ){
                  //there are 2 default options, "Select" and "custom".
                    // For this dropdown to be visible it should have atleast one other option
                    var patternComponentParentDiv=patternComponent.closest("div");
                    patternComponentParentDiv.setAttribute("hidden", true);
                }else {
                    var displayFormatParentDiv=formatComponent.closest("div");
                    switch (displayPatternSelectedValue) {
                        case "Select"     :
                        case "No Pattern" :
                            displayFormatParentDiv.setAttribute("hidden", true);
                            break;
                        default           :
                            displayFormatParentDiv.removeAttribute("hidden");
                    }
                }
                if(displayPatternSelectedValue!="Custom") {
                    formatComponent.value = patternComponent.value;
                }
            }
        }

        static handlePatternFormat(dialog, patternClass, formatClass){

            var patternComponent = dialog.find(patternClass)[0];
            var formatComponent = dialog.find(formatClass)[0];
            _manageFormatChange()
            formatComponent.addEventListener("change", _manageFormatChange );
            function _manageFormatChange(){
                var itemFound=false;
                if(formatComponent.value!=patternComponent.value){
                    patternComponent.items.getAll().forEach(function (item) {
                        if (item.value == formatComponent.value) {
                            item.selected = true;
                            itemFound = true;
                        }
                    });
                    if(!itemFound){
                        patternComponent.value="custom";
                    }
                }
            }
        }

        /**
         * Register foundation.validator for DataType Validation of Options fields like Dropdown, Checkbox etc.
         * @param defaultTypeSelector Selector for default value field
         * @param enumSelector Selector for enum values field
         * @param getSelectedDataType Function to return the selected data-type in the dialog.
         * Should return one of string|number|boolean, validation will pass if any other type is returned.
         * @returns {(function(*): void)|*} Function that will register data type validator
         */
        static registerDialogDataTypeValidators(defaultTypeSelector, enumSelector, getSelectedDataType) {
            return function (dialog) {
                var isBoolean = function(value) {
                    var isBoolean = false;
                    if (value) {
                        var lowerCaseValue = value.toLowerCase();
                        isBoolean = lowerCaseValue === 'true' || lowerCaseValue === 'false';
                    }
                    return isBoolean
                }

                function registerValidator(selector, validator) {
                    $(window).adaptTo("foundation-registry").register("foundation.validation.validator", {
                        selector: selector,
                        validate: validator
                    });
                }

                var dataTypeValidator = function(el) {
                    var isValid = true;
                    var value = el.value;
                    if (value) {
                        var dataType = getSelectedDataType(dialog);
                        switch (dataType) {
                            case 'number':
                                isValid = !isNaN(value);
                                break;
                            case 'boolean':
                                isValid = isBoolean(value);
                                break;
                        }
                    }
                    if (!isValid) {
                        return Granite.I18n.getMessage('Value Type Mismatch');
                    }
                };

                registerValidator(defaultTypeSelector, dataTypeValidator);
                registerValidator(enumSelector, dataTypeValidator);
            }
        }

    }

})(jQuery, jQuery(document), Coral);
