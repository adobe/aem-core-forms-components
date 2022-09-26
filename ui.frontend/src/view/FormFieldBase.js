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

import {Constants} from "../constants";
import FormField from './FormField';

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

    setModel(model) {
        super.setModel(model);
        const state = this._model.getState();
        this._applyState(state);
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
     * @private
     */
    _applyState(state) {
        if (state.value) {
            this._updateValue(state.value);
        }
        this._updateVisible(state.visible)
        this._updateEnable(state.visible)
        this._initializeHelpContent(state);
    }

    _initializeHelpContent(state) {
        // Initializing Hint ('?') and long description.
        this._showHideLongDescriptionDiv(false);
        if (this.getDescription()) {
            this._addHelpIconHandler(state);
        }
    }

    /**
     *
     * @param show If true then <div> containing tooltip(Short Description) will be shown else hidden
     * @private
     */
    _showHideTooltipDiv(show) {
        if (this.tooltip) {
            this.toggleAttribute(this.getTooltipDiv(), show, Constants.DATA_ATTRIBUTE_VISIBLE, false);
        }
    }

    /**
     *
     * @param show If true then <div> containing description(Long Description) will be shown
     * @private
     */
    _showHideLongDescriptionDiv(show) {
        if (this.description) {
            this.toggleAttribute(this.description, show, Constants.DATA_ATTRIBUTE_VISIBLE, false);
        }
    }

    _isTooltipAlwaysVisible() {
        return !!this.getLayoutProperties()['tooltipVisible'];
    }

    /**
     * updates html based on visible state
     * @param visible
     * @private
     */
    _updateVisible(visible) {
        this.toggle(visible, Constants.ARIA_HIDDEN, true);
        this.element.setAttribute(Constants.DATA_ATTRIBUTE_VISIBLE, visible);
    }

    /**
     * udpates the html state based on enable state of the field
     * @param enable
     * @private
     */
    _updateEnable(enable) {
        if (this.widget) {
            this.toggle(enable, Constants.ARIA_DISABLED, true);
            this.element.setAttribute(Constants.DATA_ATTRIBUTE_ENABLED, enable);
            if (enable === false) {
                this.widget.setAttribute("disabled", true);
                this.widget.setAttribute(Constants.ARIA_DISABLED, true);
            } else {
                this.widget.removeAttribute("disabled");
                this.widget.removeAttribute(Constants.ARIA_DISABLED);
            }
        }
    }

    _updateValid(valid, state) {
        if (this.errorDiv) {
            this.toggle(valid, Constants.ARIA_INVALID, true);
            this.element.setAttribute(Constants.DATA_ATTRIBUTE_VALID, valid);
            if (typeof state.errorMessage !== "string" || state.errorMessage === "") {
                const errMessage = valid === true ? '' : 'There is an error in the field';
                this.errorDiv.innerHTML = errMessage;
            }
        }
    }

    _updateErrorMessage(errorMessage, state) {
        if (this.errorDiv) {
            this.errorDiv.innerHTML = state.errorMessage;
        }
    }

    _updateValue(value) {
        if (this.widget) {
            this.widget.value = value;
        }
    }

    /**
     * Shows or Hides Description Based on click of '?' mark.
     * @private
     */
    _addHelpIconHandler(state) {
        const questionMarkDiv = this.qm,
            descriptionDiv = this.description,
            tooltipAlwaysVisible = this._isTooltipAlwaysVisible();
        const self = this;
        if (questionMarkDiv && descriptionDiv) {
            questionMarkDiv.addEventListener('click', (e) => {
                e.preventDefault();
                const longDescriptionVisibleAttribute = descriptionDiv.getAttribute(Constants.DATA_ATTRIBUTE_VISIBLE);
                if (longDescriptionVisibleAttribute === 'false') {
                    self._showHideLongDescriptionDiv(true);
                    if (tooltipAlwaysVisible) {
                        self._showHideTooltipDiv(false);
                    }
                } else {
                    self._showHideLongDescriptionDiv(false);
                    if (tooltipAlwaysVisible) {
                        self._showHideTooltipDiv(true);
                    }
                }
            });
        }
    }

    getClass() {
        return this.constructor.IS;
    }

    subscribe() {
        const changeHandlerName = (propName) => `_update${propName[0].toUpperCase() + propName.slice(1)}`
        this._model.subscribe((action) => {
            let state = action.target.getState();
            const changes = action.payload.changes;
            changes.forEach(change => {
                const fn = changeHandlerName(change.propertyName);
                if (typeof this[fn] === "function") {
                    //items applicable for repeatable panel
                    if ("items" === change.propertyName) {
                        this[fn](change.prevValue, change.currentValue, state);
                    } else {
                        this[fn](change.currentValue, state);
                    }
                } else {
                    console.error(`changes to ${change.propertyName} are not supported. Please raise an issue`)
                }
            })
        });
    }
}
