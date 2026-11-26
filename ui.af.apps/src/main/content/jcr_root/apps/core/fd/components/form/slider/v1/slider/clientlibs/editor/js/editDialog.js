/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2026 Adobe
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
(function($) {
    "use strict";

    var EDIT_DIALOG = ".cmp-adaptiveform-slider__editdialog",
        SLIDER_MINIMUM = EDIT_DIALOG + " .cmp-adaptiveform-slider__minimum",
        SLIDER_MAXIMUM = EDIT_DIALOG + " .cmp-adaptiveform-slider__maximum",
        SLIDER_STEP = EDIT_DIALOG + " .cmp-adaptiveform-slider__step",
        SLIDER_DEFAULT = EDIT_DIALOG + " .cmp-adaptiveform-slider__default",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    function readNumber(dialog, selector) {
        var field = dialog.find(selector)[0];
        if (!field) {
            return null;
        }
        var input = field.querySelector("input");
        var raw = input ? input.value : field.value;
        if (raw === undefined || raw === null || String(raw).trim() === "") {
            return null;
        }
        var parsed = Number(raw);
        return isNaN(parsed) ? null : parsed;
    }

    function isOnStep(value, min, step) {
        var ratio = (value - min) / step;
        return Math.abs(ratio - Math.round(ratio)) < 1e-9;
    }

    // returns an error message, or undefined when the slider configuration is valid
    function validateConfiguration(dialog, field) {
        var min = readNumber(dialog, SLIDER_MINIMUM),
            max = readNumber(dialog, SLIDER_MAXIMUM),
            step = readNumber(dialog, SLIDER_STEP),
            def = readNumber(dialog, SLIDER_DEFAULT);

        if (field === "maximum" && min !== null && max !== null && min >= max) {
            return CQ.I18n.getMessage("Minimum value must be less than the maximum value.");
        }
        if (field === "step" && step !== null && step <= 0) {
            return CQ.I18n.getMessage("Step must be greater than 0.");
        }
        if (field === "default" && def !== null) {
            if ((min !== null && def < min) || (max !== null && def > max)) {
                return CQ.I18n.getMessage("Default value must be within the minimum and maximum values.");
            }
            if (step !== null && step > 0 && min !== null && !isOnStep(def, min, step)) {
                return CQ.I18n.getMessage("Default value must be a multiple of the step, counted from the minimum value.");
            }
        }
        return undefined;
    }

    function registerValidator(className, field) {
        $(window).adaptTo("foundation-registry").register("foundation.validation.validator", {
            selector: EDIT_DIALOG + " ." + className,
            validate: function(element) {
                var dialog = $(element).closest(EDIT_DIALOG).parent();
                if (!dialog.length) {
                    dialog = $(document);
                }
                return validateConfiguration(dialog, field);
            }
        });
    }

    registerValidator("cmp-adaptiveform-slider__maximum", "maximum");
    registerValidator("cmp-adaptiveform-slider__step", "step");
    registerValidator("cmp-adaptiveform-slider__default", "default");

    // revalidate dependent fields whenever min, max or step change
    function handleDependentValidation(dialog) {
        [SLIDER_MINIMUM, SLIDER_MAXIMUM, SLIDER_STEP].forEach(function(selector) {
            var field = dialog.find(selector)[0];
            if (!field) {
                return;
            }
            field.addEventListener("change", function() {
                [SLIDER_MAXIMUM, SLIDER_STEP, SLIDER_DEFAULT].forEach(function(dependent) {
                    var dependentField = dialog.find(dependent)[0];
                    var validation = dependentField && $(dependentField).adaptTo("foundation-validation");
                    if (validation) {
                        validation.checkValidity();
                        validation.updateUI();
                    }
                });
            });
        });
    }

    Utils.initializeEditDialog(EDIT_DIALOG)(handleDependentValidation);
})(jQuery);
