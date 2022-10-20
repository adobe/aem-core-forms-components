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
(function($, ns, channel, Coral) {
    "use strict";

    var EDIT_DIALOG = ".cmp-adaptiveform-base__editdialogbasic",
        BASE_REQUIRED = ".cmp-adaptiveform-base__required",
        BASE_ASSISTPRIORITY = ".cmp-adaptiveform-base__assistpriority",
        BASE_VISIBLE = ".cmp-adaptiveform-base__visible",
        BASE_ENABLED = ".cmp-adaptiveform-base__enabled",
        BASE_ENUMNAMES_VISIBLE = ".cmp-adaptiveform-base__enumNames",
        BASE_ENUMNAMES_HIDDEN = ".cmp-adaptiveform-base__enumNamesHidden",
        BASE_ASSISTPRIORITY_CUSTOMTEXT = ".cmp-adaptiveform-base__assistpriority-customtext",
        BASE_DORBINDREF = ".cmp-adaptiveform-base__dorBindRef";


    /**
     * Toggles the display of the given element based on the actual and the expected values.
     * If the actualValue is equal to the expectedValue, then the element is shown,
     * otherwise the element is hidden.
     *
     * @param {HTMLElement} elements The html element to show/hide.
     * @param {*} expectedValue The value to test against.
     * @param {*} actualValue The value to test.
     */
    function checkAndDisplay(elements, expectedValue, actualValue) {
        var elemArray = elements instanceof Array ? elements : [elements];
        elemArray.forEach(function(elem) {
            if (expectedValue === actualValue) {
                elem.show();
            } else {
                elem.hide();
            }
        });
    }

    /**
     * If the required field property is checked then checkboxes for hiding and disabling the component should be disabled as a component cannot be
     * hidden/disabled and mandatory at the same time.
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function handleRequired(dialog, baseRequired) {
        var baseVisible = dialog.find(BASE_VISIBLE)[0];
        var baseEnabled = dialog.find(BASE_ENABLED)[0];

        if (baseVisible && baseRequired) {
            baseVisible.checked = baseVisible.checked && !(baseRequired.checked);
        }
        if (baseEnabled && baseRequired) {
            baseEnabled.checked = baseEnabled.checked && !(baseRequired.checked);
        }
        if (baseVisible && baseEnabled && baseRequired) {
            baseVisible.disabled = baseEnabled.disabled = baseRequired.checked;
        }
    }

    function showHideDoRBindRefField(dialog) {
        var dorBindRef = document.querySelectorAll('[name="./dorBindRef"]'),
            guideContainer = getGuideContainerProperties();
        if (guideContainer != null && guideContainer != "") {
            var item = JSON.parse(guideContainer),
                dorTemplateType = item.guideContainer['fd:formtype'];
        }
        if ($(dorBindRef) && $(dorBindRef).parent() && $(dorBindRef).parent().parent()) {
            checkAndDisplay($(dorBindRef).parent().parent(), "acroform", dorTemplateType);
        }
    }

    function getGuideContainerProperties() {
        var formPath = getFormPath(ns.ContentFrame.getContentPath());
        var result = $.ajax({
            type: 'GET',
            async: false,
            url: Granite.HTTP.externalize((formPath + "/jcr:content") + ".1.json"),
            cache: false
        });
        return result.responseText;
    }

    var getFormPath = function(contentPath) {
            return contentPath.replace(Granite.HTTP.getContextPath(), "");
        }

    function handleAssistPriority(dialog) {
        var baseAssistPriority = dialog.find(BASE_ASSISTPRIORITY)[0];
        var baseAssistPriorityCustomText = dialog.find(BASE_ASSISTPRIORITY_CUSTOMTEXT);
        if (baseAssistPriority) {
            baseAssistPriority.on("change", function() {
                checkAndDisplay(baseAssistPriorityCustomText,
                    "custom",
                    baseAssistPriority.value)
            });
            checkAndDisplay(baseAssistPriorityCustomText,
            "custom",
                baseAssistPriority.value)
        }
    }

    /**
     * Prefills all the multifield values in enum Names and deletes the hidden input
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function prefillEnumNames(dialog) {
        var visibleEnumNames = dialog.find(BASE_ENUMNAMES_VISIBLE);
        var hiddenEnumNames = dialog.find(BASE_ENUMNAMES_HIDDEN);
        for (var i = 0; i < hiddenEnumNames.length; i++) {
            visibleEnumNames[i].value = hiddenEnumNames[i].value;
            hiddenEnumNames[i].remove();
        }
    }

    /**
     * Initialise the conditional display of the various elements of the dialog.
     *
     * @param {HTMLElement} dialog The dialog on which the operation is to be performed.
     */
    function initialise(dialog) {
        dialog = $(dialog);
        var baseRequired = dialog.find(BASE_REQUIRED)[0];
        if (baseRequired) {
            handleRequired(dialog, baseRequired);
            baseRequired.on("change", function() {
                handleRequired(dialog, baseRequired);
            });
        }
        handleAssistPriority(dialog);
        prefillEnumNames(dialog);
        showHideDoRBindRefField(dialog);
    }

    channel.on("foundation-contentloaded", function(e) {
        if ($(e.target).find(EDIT_DIALOG).length > 0) {
            Coral.commons.ready(e.target, function(component) {
                initialise(component);
            });
        }
    });

})(jQuery, Granite.author, jQuery(document), Coral);
