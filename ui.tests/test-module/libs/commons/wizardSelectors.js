/*
 *  Copyright 2022 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var selectors = {
    basicTemplate:
        '[data-item-id="/conf/ReferenceEditableTemplates/settings/wcm/templates/basic"]',
    canvas3Theme:
        '[data-item-id="/content/dam/formsanddocuments-themes/reference-themes/canvas-3-0"]',
    wizardCancelButton: "#heading-1 button:first-child",
    wizardCreateButton: "#heading-1 button:last-child",
    modal: {
        create: '[data-testid="modal"]',
        title: '[name="submitDialogTitle"]',
        createButton: '[data-testid="modal"] button:last-child',
    }
};

module.exports = selectors;