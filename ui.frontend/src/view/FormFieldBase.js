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
        if (labelElement && labelElement.tagName?.toUpperCase() === 'LABEL') {
            labelElement.setAttribute('for', this.getWidgetId());
        } else if (labelElement) {
            //remove the 'for' attribute if it exists on non-label
            labelElement.removeAttribute('for');
        }
    }


    #syncError() {
        let errorElement = typeof this.getErrorDiv === 'function' ? this.getErrorDiv() : null;
        if (errorElement) {
            errorElement.setAttribute('id', `${this.getId()}__errormessage`);
        }
    }   

    #syncShortDesc() {
        let shortDescElement = typeof this.getTooltipDiv === 'function' ? this.getTooltipDiv() : null;
        if (shortDescElement) {
            shortDescElement.setAttribute('id', `${this.getId()}__shortdescription`);
        }
    } 

    #syncLongDesc() {
        let longDescElement = typeof this.getDescription === 'function' ? this.getDescription() : null;
        if (longDescElement) {
            longDescElement.setAttribute('id', `${this.getId()}__longdescription`);
        }
    } 

    #syncAriaDescribedBy() {
        let ariaDescribedby = '';
        let bemClass = Array.from(this.element.classList).filter(bemClass => !bemClass.includes('--'))[0];
        let widgetLabel = this.element.querySelector(`.${bemClass}__widgetlabel`);
        let widgetElement = typeof this.getWidget === 'function' ? this.getWidget() : null;
        let widgetElements = typeof this.getWidgets === 'function' ? this.getWidgets() : null;
        widgetElement = widgetElements || widgetElement;

        function appendDescription(descriptionType, id) {
            if (ariaDescribedby) {
                ariaDescribedby += ` ${id}__${descriptionType}`;
             } else {
                ariaDescribedby = `${id}__${descriptionType}`;
             }
        }

        if (widgetElement) {
            if (this.getDescription()) {
                const descriptionDiv = this.getDescription();
                if (!(descriptionDiv.innerHTML.trim() === '' || descriptionDiv.children.length === 0)) {
                    appendDescription('longdescription', this.getId());
                }
            }

            if (this.getTooltipDiv()) {
                appendDescription('shortdescription', this.getId());
            }

            if (this.getErrorDiv() && this.getErrorDiv().innerHTML) {
                appendDescription('errormessage', this.getId());
            }

            // FileInput starts with a hidden Widget Element
            // So the Error will be pinned to the next most useful element, its widget label
            if (widgetElement.style.display !== "none") {
                widgetElement.setAttribute('aria-describedby', ariaDescribedby);
            } else if (widgetLabel){
                widgetLabel.setAttribute('aria-describedby', ariaDescribedby);
            }
        }
    }

    #syncAriaLabel() {
        const bemClass = Array.from(this.element.classList).filter(bemClass => !bemClass.includes('--'))[0];
        const regionContainer = this.element.querySelector(`.${bemClass}__widget-container`);
        let widgetElement = typeof this.getWidget === 'function' ? this.getWidget() : null;
        let widgetElements = typeof this.getWidgets === 'function' ? this.getWidgets() : null;
        widgetElement = widgetElements || widgetElement;
        const model = this.getModel?.();

        if (model?.screenReaderText){
            // Use DOMPurify to sanitize and strip HTML tags
            const screenReaderText = window.DOMPurify ? window.DOMPurify.sanitize(model.screenReaderText, { ALLOWED_TAGS: [] }) : model.screenReaderText;

            // Some elements have the Widget hidden by default and other are Panels
            // So this container mimics having a single, showing widget to attach the Accessibility label to.
            if(regionContainer && regionContainer.hasAttribute('role') && (regionContainer.getAttribute('role') === 'region')) {
                regionContainer.setAttribute('aria-label', screenReaderText);
            }
            if (widgetElement) {
                widgetElement.setAttribute('aria-label', screenReaderText);
            }
        } else {
            // Aria label gets set to the element label if no screenreader text defined
            // Useful for File Attachment and T&C not being read by NVDA
            let labelElement = typeof this.getLabel === 'function' ? this.getLabel() : null;
            if (labelElement) {
                if(regionContainer && regionContainer.hasAttribute('role') && (regionContainer.getAttribute('role') === 'region')) {
                    regionContainer.setAttribute('aria-label', this.getLabel().innerHTML);
                }
            }
        }
    }

    #syncLabelledBy() {
        let labelElement = typeof this.getLabel === 'function' ? this.getLabel() : null;
        let widgetElement = typeof this.getWidget === 'function' ? this.getWidget() : null;
        let widgetElements = typeof this.getWidgets === 'function' ? this.getWidgets() : null;
        widgetElement = widgetElements || widgetElement;

        if (widgetElement && widgetElement.hasAttribute('role') && (widgetElement.getAttribute('role') === 'group' || widgetElement.getAttribute('role') === 'radiogroup')) {
            if (labelElement) {
                labelElement.setAttribute('id', `${this.getId()}__label`);
                widgetElement.setAttribute('aria-labelledby', `${this.getId()}__label`);
            }
        }
    }

    /**
     * Synchronizes the markup with the model.
     * @method
     */
    syncMarkupWithModel() {
        this.#syncLabel()
        this.#syncWidget()
        this.#syncShortDesc()
        this.#syncLongDesc()
        this.#syncAriaDescribedBy()
        this.#syncError()
        this.#syncAriaLabel()
        this.#syncLabelledBy()
    }

    /**
     * Sets the focus on the component's widget.
     * @param {string} id - The ID of the component's widget.
     */
    setFocus(id) {
        const fieldType = this.parentView?.getModel()?.fieldType;
        if (fieldType !== 'form' && this.parentView?.setFocus) {
            this.parentView.setFocus(this.getId());
        }
        if(!this.isActive()) {
            this.widget = this.getWidget(); // updating to the latest widget in case of datepicker widget with a formatter
            if (this.widget instanceof NodeList) { // only checkbox and radiobutton returns NodeList
                this.widget[0].focus(); // If multiple widgets like radio-button or checkbox-group, then focus on the first widget
            } else if(this.getClass() === 'adaptiveFormFileInput') {
                this.getAttachButtonLabel().focus();
            } else {
                this.widget.focus();
            }
        }
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
        this.updateVisible(state.visible, state)
        this.updateReadOnly(state.readOnly)
        this.updateEnabled(state.enabled, state)
        this.initializeHelpContent(state);
        this.updateLabel(state.label);
        this.updateRequired(state.required, state);
        this.updateDescription(state.description);
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
        const fieldQualifiedName = this._model.qualifiedName;
        const eventPayload = {
            formId,
            formTitle,
            fieldName,
            fieldId,
            panelName,
            fieldQualifiedName,
            ...(originalEventPayload?.prevValue !== undefined ? { prevText: originalEventPayload?.prevValue } : {}),
            ...(originalEventPayload?.currentValue !== undefined ? { newText: originalEventPayload?.currentValue } : {}),
            ...((typeof originalEventPayload === 'object' && originalEventPayload !== null) ? originalEventPayload : {})
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
        return this.parentView?.getModel()?.name;
    }

    setWidgetValueToDisplayValue() {
        if(this._model.displayValueExpression && this._model.displayValue) { // only do this if displayValueExpression is set
            this.widget.value = this._model.displayValue;
        }
    }

    setWidgetValueToModelValue() {
        if(this._model.displayValueExpression && this._model.displayValue) { // only do this if displayValueExpression is set
            this.widget.value = this._model.value;
        }
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
        if (this.getDescription()) {
            this.toggleAttribute(this.getDescription(), show, Constants.DATA_ATTRIBUTE_VISIBLE, false);
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
            this.element.setAttribute(Constants.DATA_ATTRIBUTE_ENABLED, enabled);
            if (enabled === false) {
                this.widget.setAttribute("disabled", "disabled");
            } else {
                this.widget.removeAttribute("disabled");
            }
        }
    }

    /**
     * Updates the HTML state based on the read-only state of the field.
     * @param {boolean} readOnly - The read-only state.
     * @param {Object} state - The state object.
     */
    updateReadOnly(readOnly) {
        if (this.widget) {
            this.element.setAttribute(Constants.DATA_ATTRIBUTE_READONLY, readOnly);
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
            this.element.toggleAttribute("required", required);
            this.element.setAttribute(Constants.DATA_ATTRIBUTE_REQUIRED, required);
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
            this.element.setAttribute(Constants.DATA_ATTRIBUTE_VALID, valid);
            this.widget.setAttribute(Constants.ARIA_INVALID, !valid);
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
            // Check if the validationMessage is different from the current content
            if (this.errorDiv.innerHTML !== state.validationMessage) {
                this.errorDiv.innerHTML = state.validationMessage;
                if (state.validity.valid === false) {
                    // Find the first key whose value is true
                    const validationType = Object.keys(state.validity).find(key => key !== 'valid' && state.validity[key] === true);
                    this.#triggerEventOnGuideBridge(this.ELEMENT_ERROR_SHOWN, {
                        'validationMessage': state.validationMessage,
                        'validationType': validationType
                    });
                    
                    // if there is no error message in model, set a default error in the view
                    if (!state.validationMessage) {
                        this.errorDiv.innerHTML = LanguageUtils.getTranslatedString(this.formContainer.getModel().lang, "defaultError");
                    }
                } 
                this.#syncAriaDescribedBy();
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
        if (!this.getWidget()){
          return;
        }
        let value = '';
        const checkedWidget = ['radio', 'checkbox'];
        // radiobutton, checkbox, datefield(AFv1, not datepicker), etc. have multiple widgets in the form of a NodeList
        if (this.widget instanceof NodeList) {
          value = Array.from(this.widget).map((widget) => checkedWidget.includes(widget.type) ? widget.checked : widget.value).find(value => value);
        } else {
          value = checkedWidget.includes(this.widget.type) ? this.widget.checked : this.widget.value;
        }
        const bemClass = Array.from(this.element.classList).filter(bemClass => !bemClass.includes('--'))[0]
        const filledModifierClass = `${bemClass}--filled`;
        const emptyModifierClass = `${bemClass}--empty`;
        this.element.classList.add(value ? filledModifierClass : emptyModifierClass);
        this.element.classList.remove(value ? emptyModifierClass : filledModifierClass);
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
     * @param {string} descriptionText - The description.
     */
   
    updateDescription(descriptionText) {
        if (typeof descriptionText !== 'undefined') {
            const sanitizedDescriptionText = window.DOMPurify ? window.DOMPurify.sanitize(descriptionText, { ALLOWED_TAGS: [] }).trim() : descriptionText;
            let descriptionElement = this.getDescription();

            if (descriptionElement) {
                 // Check if the content inside the descriptionElement needs updating
                 let currentTextContent = descriptionElement.innerText.trim();

                 if (currentTextContent === sanitizedDescriptionText) {
                   // No update needed if the text content already matches
                   return;
               }
                 
                // Find the existing <p> element
                let pElements = descriptionElement.querySelectorAll('p');

                if (!pElements)  {
                    // If no <p> tag exists, create one and set it as the content
                    pElements = document.createElement('p');
                    descriptionElement.innerHTML = ''; // Clear existing content
                    descriptionElement.appendChild(pElement);
                }

                // Update the <p> element's content with sanitized content
                   pElements.length === 1 ? (pElements[0].innerHTML = sanitizedDescriptionText) : null;
               
            } else {    
                // If no description was set during authoring
                this.#addDescriptionInRuntime(sanitizedDescriptionText);
            }
        }
    }

    #addDescriptionInRuntime(descriptionText) {
        // add question mark icon
        const bemClass = Array.from(this.element.classList).filter(bemClass => !bemClass.includes('--'))[0];
        const labelContainer = this.element.querySelector(`.${bemClass}__label-container`);
        if (labelContainer) {
            const qmButton = document.createElement('button');
            qmButton.className = `${bemClass}__questionmark`;
            qmButton.title = 'Help text';
            labelContainer.appendChild(qmButton);
        } else {
            console.error('label container not found');
            return;
        }
        // add description div
        const descriptionDiv = document.createElement('div');
        descriptionDiv.className = `${bemClass}__longdescription`;
        descriptionDiv.id = `${this.getId()}__longdescription`;
        descriptionDiv.setAttribute('aria-live', 'polite');
        descriptionDiv.setAttribute('data-cmp-visible', false);
        const pElement = document.createElement('p');
        pElement.textContent = descriptionText;
        descriptionDiv.appendChild(pElement)
        var errorDiv = this.getErrorDiv();
        if (errorDiv) {
            this.element.insertBefore(descriptionDiv, errorDiv);
        } else {
            console.log('error div not found');
            return;
        }
        // attach event handler for question mark icon
        this.#addHelpIconHandler();
    }

    /**
     * Adds an event listener for the '?' icon click.
     * @param {Object} state - The state object.
     * @private
     */
    #addHelpIconHandler(state) {
        const questionMarkDiv = this.getQuestionMarkDiv(),
            descriptionDiv = this.getDescription(),
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
                    questionMarkDiv.setAttribute('aria-expanded', true);
                } else {
                    self.#showHideLongDescriptionDiv(false);
                    if (tooltipAlwaysVisible) {
                        self.#showHideTooltipDiv(true);
                    }
                    questionMarkDiv.setAttribute('aria-expanded', false);
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
