/*******************************************************************************
 * Copyright 2022 Adobe
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

import {Constants} from "../constants.js";
import FormField from './FormField.js';

export default class FormFieldBase extends FormField {

    constructor(params) {
        super(params)
        this.widget = this.getWidget();
        this.description = this.getDescription();
        this.label = this.getLabel();
        this.errorDiv = this.getErrorDiv();
        this.qm = this.getQuestionMarkDiv();
        this.tooltip = this.getTooltipDiv()
    }

    /**
     * implementations should return the widget element that is used to capture the value from the user
     * It will be a input/textarea element
     * @returns
     */
    getWidget() {
        throw "method not implemented";
    }

    /**
     * implementations should return the element used to show the description of the field
     * @returns
     */
    getDescription() {
        throw "method not implemented";
    }

    /**
     * implementations should return the element used to show the label of the field
     * @returns
     */
    getLabel() {
        throw "method not implemented";
    }

    /**
     * implementations should return the element used to show the error on the field
     * @returns
     */
    getErrorDiv() {
        throw "method not implemented";
    }

    /**
     * implementation should return the tooltip / short description div
     */
    getTooltipDiv() {
        throw "method not implemented";
    }

    /**
     * Implementation should return the questionMark div
     */
    getQuestionMarkDiv() {
        throw "method not implemented";
    }

    getClass() {
        return this.constructor.IS;
    }

    setModel(model) {
        super.setModel(model);
        const state = this._model.getState();
        this.applyState(state);
    }

    /**
     * Sets the focus on component's widget.
     */
    setFocus() {
        this.widget.focus();
    }

    /**
     * applies full state of the field to the HTML. Generally done just after the model is bound to the field
     * @param state
     */
    applyState(state) {
        if (state.value) {
            this.updateValue(state.value);
        }
        this.updateVisible(state.visible)
        this.updateReadOnly(state.readOnly)
        this.updateEnabled(state.enabled, state)
        this.initializeHelpContent(state);
    }

    /**
     * Initialise Hint ('?') and long description.
     * @param state
     */
    initializeHelpContent(state) {
        this.#showHideLongDescriptionDiv(false);
        if (this.getDescription()) {
            this.#addHelpIconHandler(state);
        }
    }

    /**
     *
     * @param show If true then <div> containing tooltip(Short Description) will be shown else hidden
     * @private
     */
    #showHideTooltipDiv(show) {
        if (this.tooltip) {
            this.toggleAttribute(this.getTooltipDiv(), show, Constants.DATA_ATTRIBUTE_VISIBLE, false);
        }
    }

    /**
     *
     * @param show If true then <div> containing description(Long Description) will be shown
     * @private
     */
    #showHideLongDescriptionDiv(show) {
        if (this.description) {
            this.toggleAttribute(this.description, show, Constants.DATA_ATTRIBUTE_VISIBLE, false);
        }
    }

    #isTooltipAlwaysVisible() {
        return !!this.getLayoutProperties()['tooltipVisible'];
    }

    /**
     * updates html based on visible state
     * @param visible
     */
    updateVisible(visible) {
        this.toggle(visible, Constants.ARIA_HIDDEN, true);
        this.element.setAttribute(Constants.DATA_ATTRIBUTE_VISIBLE, visible);
    }

    /**
     * updates the html state based on enable state of the field
     * @param enabled
     */

    updateEnabled(enabled, state) {
        if (this.widget) {
            this.toggle(enabled, Constants.ARIA_DISABLED, true);
            this.element.setAttribute(Constants.DATA_ATTRIBUTE_ENABLED, enabled);
            if (enabled === false) {
                this.widget.setAttribute("disabled", "disabled");
                this.widget.setAttribute(Constants.ARIA_DISABLED, true);
            } else {
                this.widget.removeAttribute("disabled");
                this.widget.removeAttribute(Constants.ARIA_DISABLED);
            }
        }
    }

    /**
     * udpates the html state based on enable state of the field
     * @param readOnly
     * @private
     */
    updateReadOnly(readOnly, state) {
        if (this.widget) {
            this.toggle(readOnly, "readonly");
            if (readOnly === true) {
                this.widget.setAttribute("readonly","readonly");
            } else {
                this.widget.removeAttribute("readonly");
            }
        }
    }

    /**
     * updates the html state based on valid state of the field
     * @param valid
     * @param state
     */
    updateValid(valid, state) {
        if (this.errorDiv) {
            this.toggle(valid, Constants.ARIA_INVALID, true);
            this.element.setAttribute(Constants.DATA_ATTRIBUTE_VALID, valid);
            this.updateErrorMessage(state.errorMessage, state);
        }
    }

    /**
     * updates the html state based on errorMessage state of the field
     * @param errorMessage
     * @param state
     */
    updateErrorMessage(errorMessage, state) {
        if (this.errorDiv) {
          this.errorDiv.innerHTML = state.errorMessage;
          if (state.valid === false && !state.errorMessage) {
            this.errorDiv.innerHTML = 'There is an error in the field';
          }
        }
    }

    /**
     * updates the html state based on value state of the field
     * @param value
     */
    updateValue(value) {
        // html sets undefined value as undefined string in input value, hence this check is added
        let widgetValue = typeof value === "undefined" ? null :  value;
        if (this.widget) {
            this.widget.value = widgetValue;
        }
    }

    /**
     * updates the html state based on label state of the field
     * @param label
     */
    updateLabel(label) {
        if (this.label) {
            if (label.hasOwnProperty("value")) {
                this.label.innerHTML = label.value;
            }
            if (label.hasOwnProperty("visible")) {
                this.toggleAttribute(this.label, label.visible, Constants.ARIA_HIDDEN, true);
                this.label.setAttribute(Constants.DATA_ATTRIBUTE_VISIBLE, label.visible);
            }
        }
    }

    /**
     * updates the html state based on description state of the field
     * @param description
     */
    updateDescription(description) {
        if (this.description) {
            this.description.querySelector("p").innerHTML = description;
        } else {
            //TODO: handle the case when description is not present initially.
        }
    }


    /**
     * Shows or Hides Description Based on click of '?' mark.
     * @private
     */
    #addHelpIconHandler(state) {
        const questionMarkDiv = this.qm,
            descriptionDiv = this.description,
            tooltipAlwaysVisible = this.#isTooltipAlwaysVisible();
        const self = this;
        if (questionMarkDiv && descriptionDiv) {
            questionMarkDiv.addEventListener('click', (e) => {
                e.preventDefault();
                const longDescriptionVisibleAttribute = descriptionDiv.getAttribute(Constants.DATA_ATTRIBUTE_VISIBLE);
                if (longDescriptionVisibleAttribute === 'false') {
                    self.#showHideLongDescriptionDiv(true);
                    if (tooltipAlwaysVisible) {
                        self.#showHideTooltipDiv(false);
                    }
                } else {
                    self.#showHideLongDescriptionDiv(false);
                    if (tooltipAlwaysVisible) {
                        self.#showHideTooltipDiv(true);
                    }
                }
            });
        }
    }

    subscribe() {
        const changeHandlerName = (propName) => `update${propName[0].toUpperCase() + propName.slice(1)}`
        this._model.subscribe((action) => {
            let state = action.target.getState();
            const changes = action.payload.changes;
            changes.forEach(change => {
                const fn = changeHandlerName(change.propertyName);
                if (typeof this[fn] === "function") {
                    this[fn](change.currentValue, state);
                } else {
                    console.error(`changes to ${change.propertyName} are not supported. Please raise an issue`)
                }
            })
        });
    }
}
