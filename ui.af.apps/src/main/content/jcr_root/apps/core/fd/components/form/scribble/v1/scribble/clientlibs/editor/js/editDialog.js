
/*******************************************************************************
 * Copyright 2024 Adobe
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

    var EDIT_DIALOG = ".cmp-adaptiveform-scribble__editdialog";

    $(document).on("dialog-ready", function() {
        var $editDialog = $(EDIT_DIALOG);
        if ($editDialog.length > 0) {
            // Initialize any custom logic for the edit dialog here
            // For example, you might want to add event listeners or validators for your dialog fields
        }
    });

})(jQuery);