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
                let elemArray = components instanceof Array ? components : [components];
                elemArray.forEach(function(elem) {
                    if (condition()) {
                        elem.show()
                    } else {
                        elem.hide()
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
            let radioComp = component.find('[type="radio"]');
            for (let i = 0; i < radioComp.length; i++) {
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
                let args = Array.prototype.slice.call(arguments);
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
                let args = Array.prototype.slice.call(arguments);
                let $container = $(container);
                let componentPath = $container.data("componentpath");
                let isDialogRendered = false;
                if (componentPath && dialogPath) {
                    $container.empty();
                    let currentDialogPath = dialogPath + "/cq:dialog.html";
                    if (currentDialogPath.indexOf("/") !== 0) {
                        currentDialogPath = "/mnt/overlay/" + currentDialogPath;
                    }
                    let actionPath = currentDialogPath + componentPath;
                    let subDialogResponse = CQ.shared.HTTP.get(actionPath);
                    if (CQ.shared.HTTP.isOk(subDialogResponse)) {
                        let parser = $(window).adaptTo("foundation-util-htmlparser"),
                            html = subDialogResponse.body;
                        parser.parse(html, true).then(function (dialogHtml) {
                            let $subDialogContent = $(dialogHtml).find('.cq-dialog-content');
                            $subDialogContent.addClass("guide-dialog");
                            if ($subDialogContent.length > 0) {
                                isDialogRendered = true;
                                $container.append($subDialogContent);
                                $subDialogContent.trigger('foundation-contentloaded', [componentPath]);
                                callback(isDialogRendered);
                            }
                        });
                    }
                }
                callback(isDialogRendered);
            };
        }

        static handlePatternDropDown(dialog, patternClass, formatClass) {
            let patternComponent = dialog.find(patternClass)[0];
            let formatComponent = dialog.find(formatClass)[0];
            _managePatternDynamicBehaviour();
            patternComponent.addEventListener("change", _managePatternDynamicBehaviour );
            function _managePatternDynamicBehaviour() {
                // below the pattern was compared based on the name rather than the value ("No Pattern" instead of ####.####) which was creating issue in other languages therefore now it has changed to value.
                let displayPatternSelectedValue = patternComponent.selectedItem.value;
                let patternComponentOptionsNodeList=patternComponent.querySelectorAll('coral-select-item');
                if(patternComponentOptionsNodeList.length<=2 ){
                    //there are 2 default options, "Select" and "custom".
                    // For this dropdown to be visible it should have atleast one other option
                    let patternComponentParentDiv=patternComponent.closest("div");
                    patternComponentParentDiv.setAttribute("hidden", true);
                }else {
                    // Dropdown exists and is not hidden
                    // Case 1 : Format component exists and is hidden - Make sure format text field is visible if pattern is not "select"
                    if(formatComponent && formatComponent.closest("div").hasAttribute("hidden") && displayPatternSelectedValue != "select"){
                        formatComponent.closest("div").removeAttribute("hidden");
                    }
                    // Case 2 : Format component exists and is not hidden
                    if (formatComponent && !formatComponent.closest("div").hasAttribute("hidden")) {
                        let displayFormatParentDiv=formatComponent.closest("div");
                        switch (displayPatternSelectedValue) {
                            case ""     :
                            case "#####################.###############" :
                                displayFormatParentDiv.setAttribute("hidden", true);
                                break;
                            default           :
                                displayFormatParentDiv.removeAttribute("hidden");
                        }
                        // Only update format component value if it exists and is not hidden
                        if (displayPatternSelectedValue != "custom") {
                            formatComponent.value = patternComponent.value;
                        }
                    }
                }
            }
        }

        static handlePatternFormat(dialog, patternClass, formatClass){

            let patternComponent = dialog.find(patternClass)[0];
            let formatComponent = dialog.find(formatClass)[0];
            _manageFormatChange()
            formatComponent.addEventListener("change", _manageFormatChange );
            function _manageFormatChange(){
                let itemFound=false;
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
         * Should return one of string|number|boolean, validation will pass if any other type is returned.
         * @param defaultTypeSelector Selector for default value field
         * @param enumSelector Selector for enum values field
         * @param getSelectedDataType Function to return the selected data-type in the dialog.
         * @returns Function that will register data type validator
         */
        static registerDialogDataTypeValidators(defaultTypeSelector, enumSelector, getSelectedDataType) {
            return function (dialog) {
                let isBoolean = function(value) {
                    let isBoolean = false;
                    if (value) {
                        let lowerCaseValue = value.toLowerCase();
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

                let dataTypeValidator = function(el) {
                    let isValid = true;
                    let value = el.value;
                    if (value) {
                        let dataType = getSelectedDataType(dialog);
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

        static selectElement(tag, selectorValue, bStartsWith, bWithoutTypeHint) {
            let $element = null;
            if (bStartsWith) {
                $element = $(tag + "[name^='" + selectorValue + "']");
            } else {
                $element = $(tag + "[name='" + selectorValue + "']");
            }
            if (bWithoutTypeHint) {
                $element = $element.not("[name$='@TypeHint']");
            }
            return $element;
        }

        static showComponent(elem, parentWrapper) {
            let parentTag = $(elem).closest(parentWrapper);
            if ($(parentTag).is("[hidden]")) {
                $(parentTag).removeAttr("hidden");
            } else {
                parentTag.show();
            }
        }

        static hideComponent(elem, parentWrapper) {
            let parentTag = $(elem).closest(parentWrapper);
            $(parentTag).attr("hidden", "");
        }

        /**
        * This function is used to overcome the inability of Granite UI's multifield component to prefill its values in dialogs
         *  Prefills all the multifield values in the first field and deletes the hidden input
         *  @param dialog {HTMLElement} the dialog in which the multified is present
         *  @param visibleFieldSelector {String} BEM class associated with the visible field
         *  @param hiddenFieldSelector {String} BEM class associated with the hidden field
        */
        static prefillMultifieldValues(dialog, visibleFieldSelector, hiddenFieldSelector) {
            const visibleFields = dialog.find(visibleFieldSelector);
            const hiddenFields = dialog.find(hiddenFieldSelector);
            for (let i = 0; i < hiddenFields.length; i++) {
                visibleFields[i].value = hiddenFields[i].value;
                hiddenFields[i].remove();
            }
        }
    }

})(jQuery, jQuery(document), Coral);
