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

import Utils from "../utils";
import FormField from './FormField'

export default class FormFieldBase extends FormField {

    constructor(params) {
        super(params)
        this.widget = this.getWidget();
        this.description = this.getDescription();
        this.label = this.getLabel();
        this.errorDiv = this.getErrorDiv();
        this.setId(this.element.id);
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

    /**
     * implementation should return the tooltip / short description div
     */
    getTooltipDiv() {

    }

    /**
     * Implementation should return the questionMark div
     */
    getQuestionMarkDiv() {

    }

    setModel(model) {
        super.setModel(model);
        const state = this._model.getState();
        this._applyState(state);
        this._addQuestionMarkHandler();
        this.widget.addEventListener("mouseover", () => {
            this._showHideTooltip( true);
        });
        this.widget.addEventListener("mouseout", () => {
            this._showHideTooltip(false);
        });
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
    }

    dataAttribute(attr) {
        return `data-${this.constructor.bemBlock}-${attr}`
    }

    /**
     * updates html based on visible state
     * @param visible
     * @private
     */
    _updateVisible(visible) {
        this.toggle(visible, this.dataAttribute('hidden'), true)
    }

    /**
     * udpates the html state based on enable state of the field
     * @param enable
     * @private
     */
    _updateEnable(enable) {
        this.toggle(enable, this.dataAttribute('disabled'), true)
        if (enable === false) {
            this.widget.setAttribute("disabled", true);
        } else {
            this.widget.removeAttribute("disabled");
        }
    }

    _updateValid(valid, state) {
        this.toggle(valid, this.dataAttribute('invalid'), !valid)
        if (typeof state.errorMessage !== "string" || state.errorMessage === "") {
            const errMessage = valid === true ? '' : 'There is an error in the field';
            this.errorDiv.innerHTML = errMessage
        }
    }

    _updateErrorMessage(errorMessage, state) {
        this.errorDiv.innerHTML = state.errorMessage;
    }

    _updateValue(value) {
        this.widget.value = value;
    }


    _showHideTooltip(show) {
        const toolTip = this.getTooltipDiv(),
            bemBlock = this.constructor.bemBlock,
            tooltipVisible = this._model.properties['af:layout'] ? this._model.properties['af:layout'].tooltipVisible : false,
            hiddenBem = bemBlock + '__shortdescription--hidden',
            tooltipBem = bemBlock + '__shortdescription--tooltip';
        // If tooltip is always visible then no need to toggle.
        if (toolTip && !tooltipVisible) {
            if(show) {
                toolTip.classList.remove(hiddenBem);
                toolTip.classList.add(tooltipBem);
            } else {
                toolTip.classList.add(hiddenBem);
                toolTip.classList.remove(tooltipBem);
            }
        }
    }

    /**
     * Shows or Hides Description Based on click of '?' mark.
     * @private
     */
    _addQuestionMarkHandler() {
        const questionMarkDiv = this.getQuestionMarkDiv(),
            descriptionDiv = this.getDescription(),
            longdescriptionHiddenBem = this.constructor.bemBlock + '__longdescription--hidden';
        if (questionMarkDiv && descriptionDiv) {
            questionMarkDiv.onclick = function() {
                if (descriptionDiv.classList.contains(longdescriptionHiddenBem)) {
                    descriptionDiv.classList.remove(longdescriptionHiddenBem);
                } else {
                    descriptionDiv.classList.add(longdescriptionHiddenBem);
                }
            }
        }
    }

    getClass() {
        return this.constructor.IS
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
