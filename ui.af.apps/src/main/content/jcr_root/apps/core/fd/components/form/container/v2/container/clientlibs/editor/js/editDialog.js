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
(function($, ns, channel) {
  "use strict";
  let EDIT_DIALOG = ".cmp-adaptiveform-container__editdialog",
      FILE = EDIT_DIALOG + " .cq-droptarget",
  Utils = window.CQ.FormsCoreComponents.Utils.v1;

  function handleMultiSelection(dialog) {
      dialog = $(dialog);
      let fileElement = dialog.find(FILE)[0];
      var submitButton=dialog.find(".cq-dialog-submit")[0];
      var file = null;
      submitButton.addEventListener("click", function(event) {
        doPost(file)
      })
      fileElement.addEventListener("change", function(d) {
        if(d.target && d.target._elements && d.target._elements.input && d.target._elements.input.files) {
          file = d.target._elements.input.files[0];
        }
      })
  }
  function doPost(file) {
    const dataform = new FormData();
    dataform.append('file', file);
    $.ajax({
      type: "POST",
      url: "/bin/abc",
      data: dataform,
      success: function(data) {
        console.log('===data', data);
      },
      error: function(err) {
        console.log('===err', err);
      }
    });
  }
  Utils.initializeEditDialog(EDIT_DIALOG)(handleMultiSelection);

})(jQuery, Granite.author, jQuery(document));
