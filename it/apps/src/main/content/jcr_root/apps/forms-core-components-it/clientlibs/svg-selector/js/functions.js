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


(function () {

    let toggleColour = function (element, checked) {
        element.setAttribute("fill", checked ? "#bee8f6" : "#ffffff");
    };

    let handleFormInitialization = function(event) {
        let formContainerView = event.detail;
        let formElement = formContainerView.getFormElement();
        let svgImageComponents = formElement.querySelectorAll('[data-cmp-is="adaptiveFormSvg"]');
        let handleSvgImage = function(svgImage) {
            let svgContainerModelId = svgImage.closest('[data-cmp-is="adaptiveFormPanel"]').getAttribute("id");
            let svgContainerModel = formContainerView.getModel(svgContainerModelId);
            let svgSelectorModel = svgContainerModel.parent;
            let accessibleContainerModel = svgSelectorModel.items[1];
            accessibleContainerModel.items.forEach((fieldModel) => {
                if (fieldModel.properties['svg-linked-checkbox']) {
                    let fieldName = fieldModel.name;
                    svgImage.querySelectorAll('[data-svg-af-field="' + fieldName + '"]').forEach((svgPathField) => {
                        svgPathField.addEventListener("click", (clickEvent) => {
                            fieldModel.checked = !fieldModel.checked;
                        });
                        fieldModel.subscribe((action) => {
                            let changes = action.payload.changes;
                            changes.forEach(change => {
                                if (change.propertyName === 'checked') {
                                    toggleColour(svgPathField, fieldModel.checked);
                                }
                            });
                        });
                    });
                }
            });
        };
        svgImageComponents.forEach(handleSvgImage);
    };

    document.addEventListener("AF_FormContainerInitialised", handleFormInitialization);

})();
