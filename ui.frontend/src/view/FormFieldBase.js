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
        this.tooltip = this.getTooltipDiv();
        this.updateEmptyStatus();
    }

    ELEMENT_FOCUS_CHANGED = "elementFocusChanged";

    ELEMENT_HELP_SHOWN = "elementHelpShown";

    ELEMENT_ERROR_SHOWN = "elementErrorShown";

    /**
     * implementations should return the widget element that is used to capture the value from the user
     * It will be a input/textarea element
     * @returns html element corresponding to widget
     */
    getWidget() {
        throw "method not implemented";
    }

    /**
     * implementations should return the element used to show the description of the field
     * @returns html element corresponding to description
     */
    getDescription() {
        throw "method not implemented";
    }

    /**
     * implementations should return the element used to show the label of the field
     * @returns html element corresponding to label
     */
    getLabel() {
        throw "method not implemented";
    }

    /**
     * implementations should return the element used to show the error on the field
     * @returns html element corresponding to error
     */
    getErrorDiv() {
        throw "method not implemented";
    }

    /**
     * implementation should return the tooltip / short description div
     * @returns html element corresponding to tooltip
     */
    getTooltipDiv() {
        throw "method not implemented";
    }

    /**
     * Implementation should return the questionMark div
     * @returns html element corresponding to question mark
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
        this.#registerEventListeners();
    }

    #syncLabel() {
        let labelElement = typeof this.getLabel === 'function' ? this.getLabel() : null;
        if (labelElement) {
            labelElement.setAttribute('for', this.getId());
        }
    }

    syncMarkupWithModel() {
        this.#syncLabel()
    }

    /**
     * Sets the focus on component's widget.
     */
    setFocus(id) {
        const fieldType = this.parentView?.getModel()?.fieldType;
        if (fieldType !== 'form' && this.parentView.setFocus) {
            this.parentView.setFocus(id);
        }
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
     * Register all event listeners on this field
     */
    #registerEventListeners() {
        this.#addOnFocusEventListener();
        this.#addOnHelpIconClickEventListener();
    }

    #addOnHelpIconClickEventListener() {
        const questionMarkDiv = this.qm;
        if (questionMarkDiv) {
            questionMarkDiv.addEventListener('click', () => {
                this.#triggerEventOnGuideBridge(this.ELEMENT_HELP_SHOWN)
            })
        }
    }

    #addOnFocusEventListener() {
        const widget = this.getWidget();
        if (widget) {
            if (widget.length && widget.length > 1) {
                for (let opt of widget) {
                    opt.onfocus = () => {
                        this.#triggerEventOnGuideBridge(this.ELEMENT_FOCUS_CHANGED)
                    };
                }
            } else {
                widget.onfocus = () => {
                    this.#triggerEventOnGuideBridge(this.ELEMENT_FOCUS_CHANGED)
                };
            }
        }
    }

    #triggerEventOnGuideBridge(eventType) {
        const formId = this.formContainer.getFormId();
        const formTitle = this.formContainer.getFormTitle();
        const panelName = this.#getPanelName();
        const fieldName = this._model.name;
        const fieldId = this._model.id;
        const eventPayload = {
            formId,
            formTitle,
            fieldName,
            fieldId,
            panelName
        };
        const formContainerPath = this.formContainer.getPath();
        window.guideBridge.trigger(eventType, eventPayload, formContainerPath);
    }


    #getPanelName() {
        return this.parentView.getModel().name;
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
    updateVisible(visible, state) {
        this.toggle(visible, Constants.ARIA_HIDDEN, true);
        this.element.setAttribute(Constants.DATA_ATTRIBUTE_VISIBLE, visible);
        if (this.parentView != undefined && this.parentView.getModel().fieldType === 'panel') {
            this.parentView.updateChildVisibility(visible, state);
        }
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
                this.widget.setAttribute("readonly", "readonly");
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
                this.#triggerEventOnGuideBridge(this.ELEMENT_ERROR_SHOWN);
            }
        }
    }

    /**
     * updates the html state based on value state of the field
     * @param value
     */
    updateValue(value) {
        // html sets undefined value as undefined string in input value, hence this check is added
        let widgetValue = typeof value === "undefined" ? null : value;
        if (this.widget) {
            this.widget.value = widgetValue;
            this.updateEmptyStatus();
        }
    }

    /**
     * updates the html class based on the existence of a value in a field
     */
    updateEmptyStatus() {
        if (!this.getWidget())
            return;

        const updateModifierClass = (widget, newValue) => {
            const widgetBemClass = widget.className.split(/\s+/).filter(bemClass => bemClass.endsWith("__widget"))[0];
            const filledModifierClass = `${widgetBemClass}--filled`;
            const emptyModifierClass = `${widgetBemClass}--empty`;

            widget.classList.add(newValue ? filledModifierClass : emptyModifierClass);
            widget.classList.remove(newValue ? emptyModifierClass : filledModifierClass);
        };

        // radiobutton, checkbox, datefield(AFv1, not datepicker), etc. have multiple widgets in the form of a NodeList
        if (this.widget instanceof NodeList) {
            this.widget.forEach((widget) => updateModifierClass(widget, (widget.type === "radio" || widget.type === "checkbox") ? widget.checked : widget.value))
        } else {
            updateModifierClass(this.widget, this.widget.value)
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
