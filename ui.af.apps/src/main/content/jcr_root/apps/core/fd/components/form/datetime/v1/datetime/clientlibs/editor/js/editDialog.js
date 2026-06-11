/*******************************************************************************
 * Copyright 2025 Adobe
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

    var EDIT_DIALOG = ".cmp-adaptiveform-datetime__editdialog",
        DATETIME_MIN_FIELD = ".cmp-adaptiveform-datetime__minimumDateTime coral-datepicker",
        DATETIME_MAX_FIELD = ".cmp-adaptiveform-datetime__maximumDateTime coral-datepicker",
        Utils = window.CQ.FormsCoreComponents.Utils.v1;

    var DATE_COMPARE = function(a, b) {
        var da = new Date(a), db = new Date(b);
        return !isNaN(da) && !isNaN(db) && da > db;
    };

    Utils.registerMinMaxValidator(
        DATETIME_MIN_FIELD, DATETIME_MAX_FIELD,
        "Minimum date-time cannot be after maximum date-time",
        "Maximum date-time cannot be before minimum date-time",
        DATE_COMPARE
    );

    Utils.initializeEditDialog(EDIT_DIALOG)(
        Utils.handleMinMaxValidation(
            DATETIME_MIN_FIELD, DATETIME_MAX_FIELD,
            "Minimum date-time cannot be after maximum date-time",
            "Maximum date-time cannot be before minimum date-time",
            DATE_COMPARE
        )
    );
})(jQuery);
