/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2026 Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
(function() {

    "use strict";
    class Slider extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormSlider";
        static bemBlock = 'cmp-adaptiveform-slider';
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${Slider.bemBlock}__widget`,
            label: `.${Slider.bemBlock}__label`,
            description: `.${Slider.bemBlock}__longdescription`,
            errorDiv: `.${Slider.bemBlock}__errormessage`,
            qm: `.${Slider.bemBlock}__questionmark`,
            tooltipDiv: `.${Slider.bemBlock}__shortdescription`,
            valueOutput: `.${Slider.bemBlock}__value`
        };

        constructor(params) {
            super(params);
        }

        getClass() {
            return Slider.IS;
        }

        getWidget() {
            return this.element.querySelector(Slider.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(Slider.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(Slider.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(Slider.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector(Slider.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(Slider.selectors.qm);
        }

        getValueOutput() {
            return this.element.querySelector(Slider.selectors.valueOutput);
        }

        #renderValue(value) {
            const output = this.getValueOutput();
            const widget = this.getWidget();
            const text = (value === null || value === undefined || value === '') ? '' : String(value);
            if (output) {
                output.textContent = text;
            }
            if (widget) {
                if (text === '') {
                    widget.removeAttribute('aria-valuetext');
                } else {
                    widget.setAttribute('aria-valuetext', text);
                }
            }
        }

        updateValue(value) {
            const widget = this.getWidget();
            if (widget && value !== null && value !== undefined && value !== '') {
                widget.value = value;
            }
            this.#renderValue(widget ? widget.value : value);
            super.updateEmptyStatus();
        }

        updateReadOnly(readonly) {
            const widget = this.getWidget();
            if (widget) {
                if (readonly === true) {
                    widget.setAttribute('aria-readonly', 'true');
                    widget.setAttribute('data-cmp-readonly', 'true');
                } else {
                    widget.removeAttribute('aria-readonly');
                    widget.removeAttribute('data-cmp-readonly');
                }
            }
            super.updateReadOnly(readonly);
        }

        updateValidity(validity, state) {
            const widget = this.getWidget();
            if (widget) {
                if (validity && validity.valid === false) {
                    widget.setAttribute('aria-invalid', 'true');
                } else {
                    widget.removeAttribute('aria-invalid');
                }
            }
            super.updateValidity(validity, state);
        }

        setModel(model) {
            super.setModel(model);
            const widget = this.getWidget();
            if (!widget) {
                return;
            }
            widget.addEventListener('input', (e) => {
                if (this.isReadOnly()) {
                    // browsers do not block range changes on aria-readonly, so restore the model value
                    this.#renderValue(this._model.value);
                    if (this._model.value !== null && this._model.value !== undefined) {
                        widget.value = this._model.value;
                    }
                    return;
                }
                this.#renderValue(e.target.value);
            });
            widget.addEventListener('change', (e) => {
                if (this.isReadOnly()) {
                    return;
                }
                this.setModelValue(e.target.value);
            });
            widget.addEventListener('focus', () => {
                if (this.element) {
                    this.setActive();
                    this.triggerEnter();
                }
            });
            widget.addEventListener('blur', () => {
                if (this.element) {
                    this.setInactive();
                    this.triggerExit();
                }
            });
            if (widget.value !== '' && (this._model.value === null || this._model.value === undefined)) {
                this.setModelValue(widget.value);
            }
            this.#renderValue(widget.value);
        }

        isReadOnly() {
            return this.element && this.element.getAttribute('data-cmp-readonly') === 'true';
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Slider({element, formContainer})
    }, Slider.selectors.self);
})();
