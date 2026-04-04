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

    class Table extends FormView.FormPanel {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormTable";
        static bemBlock = 'cmp-adaptiveform-table';
        static selectors = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${Table.bemBlock}__widget`
        };

        constructor(params) {
            super(params);
            this.children = [];
        }

        getClass() {
            return Table.IS;
        }

        getWidget() {
            return null;
        }

        getDescription() {
            return this.element.querySelector(`.${Table.bemBlock}__description`);
        }

        getLabel() {
            return this.element.querySelector(`.${Table.bemBlock}__title`);
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
         * Override updateLabel to handle the table's specific HTML structure.
         * The table uses __title instead of __label-container > __label.
         * @param {Object} label - The label state object.
         */
        updateLabel(label) {
            const labelElement = this.getLabel();
            if (labelElement) {
                if (label.hasOwnProperty("value")) {
                    labelElement.innerHTML = label.value;
                }
                if (label.hasOwnProperty("visible")) {
                    if (label.visible === false) {
                        labelElement.setAttribute("aria-hidden", "true");
                    } else {
                        labelElement.removeAttribute("aria-hidden");
                    }
                    labelElement.setAttribute("data-cmp-visible", label.visible);
                }
            }
        }

        /**
         * Override applyState to use the table's specific updateLabel.
         * @param {Object} state - The state to be applied.
         */
        applyState(state) {
            this.updateVisible(state.visible);
            this.updateEnabled(state.enabled);
            this.initializeHelpContent(state);
            this.updateLabel(state.label);
        }

        /**
         * Repeatable table rows: align add/remove control visibility with minOccur / maxOccur (accordion pattern).
         */
        handleChildAddition(childView) {
            this.#syncTableRowRepeatableControls(childView.getInstanceManager());
        }

        handleChildRemoval(removedInstanceView) {
            this.#syncTableRowRepeatableControls(removedInstanceView.getInstanceManager());
        }

        #syncTableRowRepeatableControls(instanceManager) {
            if (!instanceManager || !instanceManager.children || instanceManager.children.length === 0) {
                return;
            }
            const model = instanceManager._model;
            const items = model.items || [];
            const activeIds = new Set(items.map((item) => item.id));
            const minOccur = model.minOccur;
            const maxOccur = model.maxOccur;
            const dataVisible = FormView.Constants.DATA_ATTRIBUTE_VISIBLE;
            instanceManager.children.forEach((childView) => {
                if (!activeIds.has(childView.id)) {
                    return;
                }
                const rowWrapper = childView.element && childView.element.parentElement;
                if (!rowWrapper) {
                    return;
                }
                const addBtn = rowWrapper.querySelector("[data-cmp-hook-add-instance]");
                const removeBtn = rowWrapper.querySelector("[data-cmp-hook-remove-instance]");
                if (addBtn) {
                    addBtn.setAttribute(dataVisible, !(items.length === maxOccur && maxOccur !== -1));
                }
                if (removeBtn) {
                    removeBtn.setAttribute(dataVisible, items.length > minOccur && minOccur !== -1);
                }
            });
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Table({element, formContainer})
    }, Table.selectors.self);
})();
