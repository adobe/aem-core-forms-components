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
    "use strict";

    class TableRow extends FormView.FormPanel {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormTableRow";
        static bemBlock = 'cmp-adaptiveform-tablerow';
        static selectors = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]'
        };

        constructor(params) {
            super(params);
            this.children = [];
        }

        /**
         * For table rows in a single tbody, the row element is the repeatable unit.
         * In edit mode with div wrappers, return the Sling wrapper div.
         * @returns {HTMLElement}
         */
        getRepeatableDomWrapper() {
            const parent = this.element.parentElement;
            if (parent && parent.classList && parent.classList.contains(TableRow.bemBlock)) {
                return parent;
            }
            return this.element;
        }

        /**
         * Container where sibling rows are inserted — the {@code <tbody>} or div.table__body.
         * @returns {HTMLElement}
         */
        getRepeatableInstancesContainerElement() {
            const tableBody = this.element.closest(".cmp-adaptiveform-table__body") ||
                this.element.closest("tbody");
            return tableBody || this.element.parentElement;
        }

        getClass() {
            return TableRow.IS;
        }

        getWidget() {
            return null;
        }

        getDescription() {
            return null;
        }

        getLabel() {
            return null;
        }

        getErrorDiv() {
            return null;
        }

        getTooltipDiv() {
            return null;
        }

        getQuestionMarkDiv() {
            return null;
        }

        setFocus(id) {
            super.setFocus(id);
            this.setActive();
        }

        getWidgetId() {
            return this.getId();
        }

        /**
         * Override updateLabel to handle the table row's specific HTML structure.
         * Table rows don't have labels in the traditional sense.
         * @param {Object} label - The label state object.
         */
        updateLabel(label) {
            // Table rows don't have visible labels, so this is a no-op
        }

        /**
         * Override applyState for table row's specific structure.
         * @param {Object} state - The state to be applied.
         */
        applyState(state) {
            this.updateVisible(state.visible);
            this.updateEnabled(state.enabled);
            this.initializeHelpContent(state);
            this.updateLabel(state.label);
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new TableRow({element, formContainer})
    }, TableRow.selectors.self);
})();
