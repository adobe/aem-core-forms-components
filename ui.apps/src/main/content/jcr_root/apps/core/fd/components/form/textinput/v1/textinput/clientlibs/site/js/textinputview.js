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
(function() {

    "use strict";
    class TextInput extends FormView.FormField {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormTextInput";
        static bemBlock = 'cmp-adaptiveform-textinput'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${TextInput.bemBlock}__widget`,
            label: `.${TextInput.bemBlock}__label`,
            description: `.${TextInput.bemBlock}__longdescription`,
            qm: `.${TextInput.bemBlock}__questionmark`,
            errorDiv: `.${TextInput.bemBlock}__errorMessage`,
        };

        constructor(params) {
            super(params);
            this.widget = this.element.querySelector(TextInput.selectors.widget);
            this.description = this.element.querySelector(TextInput.selectors.description)
            this.label = this.descriptionDiv = this.element.querySelector(TextInput.selectors.label)
            this.qm = this.descriptionDiv = this.element.querySelector(TextInput.selectors.qm)
            this.errorDiv = this.element.querySelector(TextInput.selectors.errorDiv)
        }

        setModel(model) {
            super.setModel(model);
            const state = this._model.getState();
            this._applyState(state);
            this.widget.addEventListener('blur', (e) => {
                this._model.value = e.target.value;
            })
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

        _dataAttribute(attr) {
            return `data-${TextInput.NS}-${TextInput.IS}-${attr}`
        }

        _cssClass(clsName) {
            return `cmp-${TextInput.IS}--${clsName}`
        }

        /**
         * toggles the html element based on the property. If the property is false, then adds the data-attribute and
         * css class
         * @param property
         * @param dataAttribute
         * @param className
         * @private
         */
        _toggle(property, dataAttribute, className) {
            if (property === false) {
                this.element.setAttribute(dataAttribute, true);
                this.element.classList.add(className);
            } else {
                this.element.removeAttribute(dataAttribute);
                this.element.classList.remove(className);
            }
        }

        /**
         * updates html based on visible state
         * @param visible
         * @private
         */
        _updateVisible(visible) {
            this._toggle(visible, this._dataAttribute('hidden'), this._cssClass('hidden'))
        }

        /**
         * udpates the html state based on enable state
         * @param enable
         * @private
         */
        _updateEnable(enable) {
            this._toggle(enable, this._dataAttribute('disabled'), this._cssClass('disabled'))
            if (enable === false) {
                this.widget.setAttribute("disabled", true);
            } else {
                this.widget.removeAttribute("disabled");
            }
        }

        getClass() {
            return TextInput.IS;
        }

        _updateValue(value) {
            this.widget.value = value;
            this._runValidations(this.widget);
        }

        _runValidations(widget) {
            const model = this._model._jsonModel;
            let validationObj = {isError: false, errorMessage: ''};
            this._runRequiredValidation(widget, model, validationObj);
            this._toggleErrorMark(validationObj);
        }

        _runRequiredValidation(widget, model, validationObj) {
            if (model.required && widget.value === '') {
                validationObj.isError = true;
                validationObj.errorMessage = model.constraintMessages['required'];
            }
        }

        _toggleErrorMark({isError, errorMessage}) {
            if (isError) {
                this.errorDiv.innerHTML = errorMessage;
            } else {
                this.errorDiv.innerHTML = '';
            }
        }

        subscribe() {
            const changeHandlerName = (propName) => `_update${propName[0].toUpperCase() + propName.slice(1)}`
            this._model.subscribe((action) => {
                let state = action.target.getState();
                const changes = action.payload.changes;
                changes.forEach(change => {
                    const fn = changeHandlerName(change.propertyName);
                    if (typeof this[fn] === "function") {
                        this[fn](change.currentValue)
                    } else {
                        console.error(`changes to ${change.propertyName} are not supported. Please raise an issue`)
                    }
                })
            });
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new TextInput({element})
    }, TextInput.selectors.self);

})();
