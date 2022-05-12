/*******************************************************************************
 * Copyright 2021 Adobe
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
(function($) {
    "use strict";

    $.validator.register("foundation.validation.validator", {
        selector : "coral-multifield",
        validate : function(el) {

            var totalPanels = el["0"].items.getAll().length;
            var min;
            var max;
            if ($(el).data("min-item")) {
                min = $(el).data("min-item");
                if (totalPanels < min) {
                    return "Minimum numbers of items required are: " + min;
                }
            }
            if ($(el).data("max-item")) {
                max = $(el).data("max-item");
                if (totalPanels > max) {
                    return "Maximum numbers of items allowed are: " + max;
                }
            }
        }
    });
})(jQuery);