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
import LanguageUtils from '../LanguageUtils.js';

/**
 * @module FormView
 */

/**
 * Base class for form fields.
 * @extends module:FormView~FormField
 */
class FormFieldBase extends FormField {

    /**
     * Constructor for FormFieldBase.
     * @param {object} params - The parameters for initializing the form field.
     */
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

    /**
     * Event constant for element focus change.
     * @type {string}
     */
    ELEMENT_FOCUS_CHANGED = Constants.ELEMENT_FOCUS_CHANGED;

    /**
     * Event constant for element help shown.
     * @type {string}
     */
    ELEMENT_HELP_SHOWN = Constants.ELEMENT_HELP_SHOWN;

    /**
     * Event constant for element error shown.
     * @type {string}
     */
    ELEMENT_ERROR_SHOWN = Constants.ELEMENT_ERROR_SHOWN;


    /**
     * Event constant for value change.
     * @type {string}
     */
    ELEMENT_VALUE_CHANGED = Constants.ELEMENT_VALUE_CHANGED;

    /**
     * Gets the widget element used to capture the value from the user.
     * Implementations should return the widget element that is used to capture the value from the user.
     * @returns {HTMLElement} - The widget element.
     * @throws {string} Throws an error if the method is not implemented.
     */
    getWidget() {
        throw "method not implemented";
    }

    /**
     * Gets the element used to show the description of the field.
     * Implementations should return the description element that is used to capture the description
     * @returns {HTMLElement} - The description element.
     * @throws {string} Throws an error if the method is not implemented.
     */
    getDescription() {
        throw "method not implemented";
    }

    /**
     * Gets the element used to show the label of the field.
     * Implementations should return the label element that is used to capture the label
     * @returns {HTMLElement} - The label element.
     * @throws {string} Throws an error if the method is not implemented.
     */
    getLabel() {
        throw "method not implemented";
    }

    /**
     * Gets the element used to show the error on the field.
     * Implementations should return the error element that is used to capture the error
     * @returns {HTMLElement} - The error element.
     * @throws {string} Throws an error if the method is not implemented.
     */
    getErrorDiv() {
        throw "method not implemented";
    }

    /**
     * Gets the tooltip / short description div.
     * Implementations should return the tooltip element that is used to capture the tooltip or short description
     * @returns {HTMLElement} - The tooltip element.
     * @throws {string} Throws an error if the method is not implemented.
     */
    getTooltipDiv() {
        throw "method not implemented";
    }

    /**
     * Gets the question mark div.
     * Implementations should return the question mark element
     * @returns {HTMLElement} - The question mark element.
     * @throws {string} Throws an error if the method is not implemented.
     */
    getQuestionMarkDiv() {
        throw "method not implemented";
    }

    /**
     * Gets the class of the form field.
     * @returns {string} - The class of the form field.
     */
    getClass() {
        return this.constructor.IS;
    }

    /**
     * Sets the model for the form field.
     * @param {object} model - The model object.
     */
    setModel(model) {
        super.setModel(model);
        const state = this._model.getState();
        this.applyState(state);
        this.#registerEventListeners();
    }

    getWidgetId(){
      return this.getId() + '-widget';
    }

    #syncWidget() {
      let widgetElement = typeof this.getWidget === 'function' ? this.getWidget() : null;
      let widgetElements = typeof this.getWidgets === 'function' ? this.getWidgets() : null;
      widgetElement = widgetElements || widgetElement;
      if (widgetElement) {
          widgetElement.setAttribute('id', this.getWidgetId());
      }
    }

    /**
     * Synchronizes the label element with the model.
     * @private
     */
    #syncLabel() {
        let labelElement = typeof this.getLabel === 'function' ? this.getLabel() : null;
        if (labelElement) {
            labelElement.setAttribute('for', this.getWidgetId());
        }
    }

    /**
     * Synchronizes the markup with the model.
     * @method
     */
    syncMarkupWithModel() {
        this.#syncLabel()
        this.#syncWidget()
    }

    /**
     * Sets the focus on the component's widget.
     * @param {string} id - The ID of the component's widget.
     */
    setFocus(id) {
        const fieldType = this.parentView?.getModel()?.fieldType;
        if (fieldType !== 'form' && this.parentView.setFocus) {
            this.parentView.setFocus(id);
        }
        this.getWidget().focus();
    }

    /**
     * Applies the full state of the field to the HTML.
     * Generally done just after the model is bound to the field.
     * @param {Object} state - The state object.
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
     * Initializes the hint ('?') and long description.
     * @param {Object} state - The state object.
     */
    initializeHelpContent(state) {
        this.#showHideLongDescriptionDiv(false);
        if (this.getDescription()) {
            this.#addHelpIconHandler(state);
        }
    }

    /**
     * Registers all event listeners on this field.
     * @private
     */
    #registerEventListeners() {
        this.#addOnFocusEventListener();
        this.#addOnHelpIconClickEventListener();
    }

    /**
     * Adds an event listener for the help icon click event.
     * @private
     */
    #addOnHelpIconClickEventListener() {
        const questionMarkDiv = this.qm;
        if (questionMarkDiv) {
            questionMarkDiv.addEventListener('click', () => {
                this.#triggerEventOnGuideBridge(this.ELEMENT_HELP_SHOWN)
            })
        }
    }

    /**
     * Adds an event listener for the focus event.
     * @private
     */
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

    /**
     * Triggers an event on GuideBridge.
     * @param {string} eventType - The event type.
     * @private
     */
    #triggerEventOnGuideBridge(eventType, originalEventPayload) {
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
            panelName,
            ...(originalEventPayload?.prevValue !== undefined ? { prevText: originalEventPayload?.prevValue } : {}),
            ...(originalEventPayload?.currentValue !== undefined ? { newText: originalEventPayload?.currentValue } : {})
        };
        const formContainerPath = this.formContainer.getPath();
        window.guideBridge.trigger(eventType, eventPayload, formContainerPath);
    }


    /**
     * Gets the panel name.
     * @returns {string} The panel name.
     * @private
     */
    #getPanelName() {
        return this.parentView.getModel().name;
    }

    /**
     * Shows or hides the tooltip <div> based on the provided flag.
     * @param {boolean} show - If true, the tooltip <div> will be shown; otherwise, it will be hidden.
     * @private
     */
    #showHideTooltipDiv(show) {
        if (this.tooltip) {
            this.toggleAttribute(this.getTooltipDiv(), show, Constants.DATA_ATTRIBUTE_VISIBLE, false);
        }
    }

    /**
     * Shows or hides the long description <div> based on the provided flag.
     * @param {boolean} show - If true, the long description <div> will be shown; otherwise, it will be hidden.
     * @private
     */
    #showHideLongDescriptionDiv(show) {
        if (this.description) {
            this.toggleAttribute(this.description, show, Constants.DATA_ATTRIBUTE_VISIBLE, false);
        }
    }

    /**
     * Checks if the tooltip is always visible.
     * @returns {boolean} True if the tooltip is always visible; otherwise, false.
     * @private
     */
    #isTooltipAlwaysVisible() {
        return !!this.getLayoutProperties()['tooltipVisible'];
    }

    /**
     * Updates the HTML based on the visible state.
     * @param {boolean} visible - The visible state.
     * @param {Object} state - The state object.
     */
    updateVisible(visible, state) {
        this.toggle(visible, Constants.ARIA_HIDDEN, true);
        this.element.setAttribute(Constants.DATA_ATTRIBUTE_VISIBLE, visible);
        if (this.parentView != undefined && this.parentView.getModel().fieldType === 'panel') {
            this.parentView.updateChildVisibility(visible, state);
        }
    }

    /**
     * Updates the HTML state based on the enabled state of the field.
     * @param {boolean} enabled - The enabled state.
     * @param {Object} state - The state object.
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
     * Updates the HTML state based on the read-only state of the field.
     * @param {boolean} readOnly - The read-only state.
     * @param {Object} state - The state object.
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
     * Updates the HTML state based on the required state of the field.
     * @param {boolean} required - The required state.
     * @param {Object} state - The state object.
     */
    updateRequired(required, state) {
        if (this.widget) {
            this.toggle(required, "required");
            if (required === true) {
                this.widget.setAttribute("required", "required");
            } else {
                this.widget.removeAttribute("required");
            }
        }
    }

    /**
     * Updates the HTML state based on the valid state of the field.
     * @param {boolean} valid - The valid state.
     * @param {Object} state - The state object.
     * @deprecated Use the new method updateValidity() instead.
     */
    updateValid(valid, state) {
        // not doing anything, since it would impact performance, as the same functionality
        // is implemented by updateValidity
    }

    /**
     * Updates the HTML state based on the validity state of the field.
     * @param {Object} validity - The validity state.
     * @param {Object} state - The state object.
     */
    updateValidity(validity, state) {
        // todo: handle the type of validity if required later
        const valid = validity.valid;
        if (this.errorDiv) {
            this.toggle(valid, Constants.ARIA_INVALID, true);
            this.element.setAttribute(Constants.DATA_ATTRIBUTE_VALID, valid);
            this.updateValidationMessage(state.validationMessage, state);
        }
    }

    /**
     * Updates the HTML state based on the error message state of the field.
     * @param {string} errorMessage - The error message.
     * @param {Object} state - The state object.
     * @deprecated Use the new method updateValidationMessage() instead.
     */
    updateErrorMessage(errorMessage, state) {
        // not doing anything, since it would impact performance, as the same functionality
        // is implemented by updateValidationMessage
    }


    /**
     * Updates the HTML state based on the validation message state of the field.
     * @param {string} validationMessage - The validation message.
     * @param {Object} state - The state object.
     */
    updateValidationMessage(validationMessage, state) {
        if (this.errorDiv) {
            this.errorDiv.innerHTML = state.validationMessage;
            if (state.validity.valid === false) {
                this.#triggerEventOnGuideBridge(this.ELEMENT_ERROR_SHOWN);
                // if there is no error message in model, set a default error in the view
                if (!state.validationMessage) {
                    this.errorDiv.innerHTML = LanguageUtils.getTranslatedString(this.formContainer.getModel().lang, "defaultError");
                }
            }
        }
    }

    /**
     * Updates the HTML state based on the value state of the field.
     * @param {any} value - The value.
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
     * Updates the HTML class based on the existence of a value in a field.
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
     * Updates the HTML state based on the label state of the field.
     * @param {Object} label - The label.
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
     * Updates the active child of the form container.
     * @param {Object} activeChild - The active child.
     */
    updateActiveChild(activeChild) {
      this.formContainer.setFocus(activeChild?._activeChild?.id || activeChild?.id);
    }

    /**
     * Updates the HTML state based on the description state of the field.
     * @param {string} description - The description.
     */
    updateDescription(description) {
        if (this.description) {
            this.description.querySelector("p").innerHTML = description;
        } else {
            //TODO: handle the case when description is not present initially.
        }
    }


    /**
     * Adds an event listener for the '?' icon click.
     * @param {Object} state - The state object.
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

    /**
     * Subscribes to model changes and updates the corresponding properties in the view.
     * @override
     */
    subscribe() {
        const changeHandlerName = (propName) => `update${propName[0].toUpperCase() + propName.slice(1)}`
        this._model.subscribe((action) => {
            let state = action.target.getState();
            const changes = action.payload.changes;
            changes.forEach(change => {
                const fn = changeHandlerName(change.propertyName);
                if (change.propertyName === 'value') {
                    this.#triggerEventOnGuideBridge(this.ELEMENT_VALUE_CHANGED, change);
                }
                if (typeof this[fn] === "function") {
                    this[fn](change.currentValue, state);
                } else {
                    console.warn(`changes to ${change.propertyName} are not supported. Please raise an issue`)
                }
            })
        });
    }
}

export default FormFieldBase;