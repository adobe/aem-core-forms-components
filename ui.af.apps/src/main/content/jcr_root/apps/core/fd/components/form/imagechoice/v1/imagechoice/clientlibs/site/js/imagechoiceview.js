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

(function(document, $) {
    "use strict";

    // Namespace for the form components
    var FORM_VIEW = window.FormView || {};

    // Class representing the ImageChoice component
    FORM_VIEW.ImageChoice = function(element) {
        this.element = element;
        this.optionsContainer = this.element.querySelector('.cmp-adaptiveform-imagechoice__options');
        this.selectionType = this.element.dataset.selectionType;
        this.init();
    };

    // Initialize the ImageChoice component
    FORM_VIEW.ImageChoice.prototype.init = function() {
        var self = this;
        var options = this.optionsContainer.querySelectorAll('input[type="radio"], input[type="checkbox"]');

        // Add event listeners based on the selection type
        if (this.selectionType === 'single') {
            options.forEach(function(option) {
                option.type = 'radio';
                option.addEventListener('change', self.onSingleSelectChange.bind(self));
            });
        } else if (this.selectionType === 'multiple') {
            options.forEach(function(option) {
                option.type = 'checkbox';
                option.addEventListener('change', self.onMultiSelectChange.bind(self));
            });
        }
    };

    // Event handler for single selection change
    FORM_VIEW.ImageChoice.prototype.onSingleSelectChange = function(event) {
        var selectedOption = event.target;
        this.clearSelection();
        selectedOption.checked = true;
    };

    // Event handler for multiple selection change
    FORM_VIEW.ImageChoice.prototype.onMultiSelectChange = function(event) {
        // Multiple selection logic can be implemented if needed
    };

    // Clear all selections
    FORM_VIEW.ImageChoice.prototype.clearSelection = function() {
        var options = this.optionsContainer.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        options.forEach(function(option) {
            option.checked = false;
        });
    };

    // Initialize all ImageChoice components on the page
    document.addEventListener('DOMContentLoaded', function() {
        var imageChoiceElements = document.querySelectorAll('.cmp-adaptiveform-imagechoice');
        imageChoiceElements.forEach(function(element) {
            new FORM_VIEW.ImageChoice(element);
        });
    });

    // Expose the ImageChoice to the global scope
    window.FormView = FORM_VIEW;

})(document, Granite.$);
