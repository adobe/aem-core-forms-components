/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2021 Adobe
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

use(function () {

  var clientlibsArr = ['core.forms.components.base.v1.editor'];
  var labelPath = 'core/fd/components/af-commons/v1/fieldTemplates/label.html';
  var shortDescriptionPath = "core/fd/components/af-commons/v1/fieldTemplates/shortDescription.html";
  var longDescriptionPath = "core/fd/components/af-commons/v1/fieldTemplates/longDescription.html";
  var questionMarkPath = "core/fd/components/af-commons/v1/fieldTemplates/questionMark.html";
  var errorMessagePath = "core/fd/components/af-commons/v1/fieldTemplates/errorMessage.html";
  return {
    labelPath: labelPath,
    shortDescriptionPath: shortDescriptionPath,
    longDescriptionPath: longDescriptionPath,
    questionMarkPath: questionMarkPath,
    errorMessagePath: errorMessagePath,
    clientlibs: clientlibsArr
  }
});