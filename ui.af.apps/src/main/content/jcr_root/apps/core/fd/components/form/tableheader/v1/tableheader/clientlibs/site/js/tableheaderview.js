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

    class TableHeader extends FormView.FormPanel {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormTableHeader";
        static bemBlock = 'cmp-adaptiveform-tableheader';
        static selectors = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]'
        };

        constructor(params) {
            super(params);
            this.children = [];
        }

        getClass() {
            return TableHeader.IS;
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
         * Override updateLabel to handle the table header's specific HTML structure.
         * Table headers don't have labels in the traditional sense.
         * @param {Object} label - The label state object.
         */
        updateLabel(label) {
            // Table headers don't have visible labels, so this is a no-op
        }

        /**
         * Override applyState for table header's specific structure.
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
        return new TableHeader({element, formContainer})
    }, TableHeader.selectors.self);
})();
