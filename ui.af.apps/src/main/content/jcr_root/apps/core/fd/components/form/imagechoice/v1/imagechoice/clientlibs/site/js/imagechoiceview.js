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
(function() {

    "use strict";
    class ImageChoice extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormImageChoice";
        static bemBlock = 'cmp-adaptiveform-imagechoice'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widgets: `.${ImageChoice.bemBlock}__widget`,
            widget: `.${ImageChoice.bemBlock}__option__widget`,
            widgetLabel: `.${ImageChoice.bemBlock}__label`,
            label: `.${ImageChoice.bemBlock}__label`,
            description: `.${ImageChoice.bemBlock}__longdescription`,
            qm: `.${ImageChoice.bemBlock}__questionmark`,
            errorDiv: `.${ImageChoice.bemBlock}__errormessage`,
            tooltipDiv: `.${ImageChoice.bemBlock}__shortdescription`,
            option:  `.${ImageChoice.bemBlock}-option`,
            optionLabel: `${ImageChoice.bemBlock}__option-label`
        };

        constructor(params) {
            super(params);
            this.qm = this.element.querySelector(ImageChoice.selectors.qm)
            this.widgetLabel = this.element.querySelector(ImageChoice.selectors.widgetLabel)
        }

        getWidgets() {
            return this.element.querySelector(ImageChoice.selectors.widgets);
        }

        getWidget() {
          return this.element.querySelectorAll(ImageChoice.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(ImageChoice.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(ImageChoice.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(ImageChoice.selectors.errorDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(ImageChoice.selectors.qm);
        }

        getTooltipDiv() {
            return this.element.querySelector(ImageChoice.selectors.tooltipDiv);
        }

        getOptions() {
            return this.element.querySelectorAll(ImageChoice.selectors.option);
        }

        setModel(model) {
            super.setModel(model);
            let widgets = this.widget;
            widgets.forEach(widget => {
                let self = widget;
                this.#updateModelValue(self);
                widget.addEventListener('change', (e) => {
                    this.#updateModelValue(self);
                });
                widget.addEventListener('focus', (e) => {
                    this.setActive();
                });
                widget.addEventListener('blur', (e) => {
                    this.setInactive();
                });
            })
        }

        #updateModelValue(widget) {
            let value = [];
            this.widget.forEach(widget => {
                if (widget.checked) {
                    value.push(widget.value)
                }
            }, this);
            if (value.length !== 0 || this._model.value != null) {
                this._model.value = value;
            }
        }

        updateValue(modelValue) {
            modelValue = [].concat(modelValue);
            let selectedWidgetValues = modelValue.map(String);
            this.widget.forEach(widget => {
                if (selectedWidgetValues.includes((widget.value))) {
                    widget.checked = true
                    widget.setAttribute(FormView.Constants.HTML_ATTRS.CHECKED, FormView.Constants.HTML_ATTRS.CHECKED)
                    widget.setAttribute(FormView.Constants.ARIA_CHECKED, true)
                } else {
                    widget.checked = false
                    widget.removeAttribute(FormView.Constants.HTML_ATTRS.CHECKED);
                    widget.setAttribute(FormView.Constants.ARIA_CHECKED, false);
                }
            }, this)
            super.updateEmptyStatus();
        }

        updateEnabled(enabled, state) {
            this.element.setAttribute(FormView.Constants.DATA_ATTRIBUTE_ENABLED, enabled);
            let widgets = this.widget;
            widgets.forEach(widget => {
                if (enabled === false) {
                    if(state.readOnly === false){
                        widget.setAttribute(FormView.Constants.HTML_ATTRS.DISABLED, "disabled");
                        widget.setAttribute(FormView.Constants.ARIA_DISABLED, true);
                    }
                } else if (state.readOnly === false) {
                    widget.removeAttribute(FormView.Constants.HTML_ATTRS.DISABLED);
                    widget.removeAttribute(FormView.Constants.ARIA_DISABLED);
                }
            });
        }

        updateReadOnly(readonly) {
            let widgets = this.widget;
            this.element.setAttribute(FormView.Constants.DATA_ATTRIBUTE_READONLY, readonly);
            widgets.forEach(widget => {
                if (readonly === true) {
                    widget.setAttribute(FormView.Constants.HTML_ATTRS.DISABLED, "disabled");
                    widget.setAttribute("aria-readonly", true);
                } else {
                    widget.removeAttribute(FormView.Constants.HTML_ATTRS.DISABLED);
                    widget.removeAttribute("aria-readonly");
                }
            });
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new ImageChoice({element, formContainer})
    }, ImageChoice.selectors.self);

})();