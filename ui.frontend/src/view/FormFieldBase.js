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
import FormField from './FormField'

export default class FormFieldBase extends FormField {

    constructor(params) {
        super(params)
        this.widget = this.getWidget();
        this.description = this.getDescription();
        this.label = this.getLabel();
        this.errorDiv = this.getErrorDiv();
    }

    /**
     * implementations should return the widget element that is used to capture the value from the user
     * It will be a input/textarea element
     * @returns
     */
    getWidget() {

    }

    /**
     * implementations should return the element used to show the description of the field
     * @returns
     */
    getDescription() {

    }

    /**
     * implementations should return the element used to show the label of the field
     * @returns
     */
    getLabel() {

    }

    /**
     * implementations should return the element used to show the error on the field
     * @returns
     */
    getErrorDiv() {

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
        this._updateVisible(state.visible);
        this._updateEnable(state.enabled);
    }

    /**
     * updates html based on visible state
     * @param visible
     * @private
     */
    _updateVisible(visible) {
        this.toggle(visible, Constants.ARIA_HIDDEN, true);
        this.toggle(visible, Constants.DATA_ATTRIBUTE_VISIBLE, false);
    }

    /**
     * udpates the html state based on enable state of the field
     * @param enable
     * @private
     */
    _updateEnable(enable) {
        this.toggle(enable, Constants.ARIA_DISABLED, true);
        this.toggle(enable, Constants.DATA_ATTRIBUTE_ENABLED, false);
        if (enable === false) {
            this.widget.setAttribute("disabled", true);
            this.widget.setAttribute(Constants.ARIA_DISABLED, true);
        } else {
            this.widget.removeAttribute("disabled");
            this.widget.removeAttribute(Constants.ARIA_DISABLED);
        }
    }

    _updateValid(valid, state) {
        this.toggle(valid, Constants.ARIA_INVALID, true);
        this.toggle(valid, Constants.DATA_ATTRIBUTE_VALID, false);
        if (typeof state.errorMessage !== "string" || state.errorMessage === "") {
            const errMessage = valid === true ? '' : 'There is an error in the field';
            this.errorDiv.innerHTML = errMessage;
        }
    }

    _updateErrorMessage(errorMessage, state) {
        this.errorDiv.innerHTML = state.errorMessage;
    }

    _updateValue(value) {
        this.widget.value = value;
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
                    this[fn](change.currentValue, state)
                } else {
                    console.error(`changes to ${change.propertyName} are not supported. Please raise an issue`)
                }
            })
        });
    }
}
