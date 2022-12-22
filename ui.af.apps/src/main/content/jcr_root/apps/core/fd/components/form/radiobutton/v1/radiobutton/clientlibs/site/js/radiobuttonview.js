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
    class RadioButton extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormRadioButton";
        static bemBlock = 'cmp-adaptiveform-radiobutton';
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${RadioButton.bemBlock}__option__widget`,
            label: `.${RadioButton.bemBlock}__label`,
            description: `.${RadioButton.bemBlock}__longdescription`,
            qm: `.${RadioButton.bemBlock}__questionmark`,
            errorDiv: `.${RadioButton.bemBlock}__errormessage`,
            tooltipDiv: `.${RadioButton.bemBlock}__shortdescription`
        };

        constructor(params) {
            super(params);
            this.qm = this.element.querySelector(RadioButton.selectors.qm);
        }

        getWidget() {
            return this.element.querySelectorAll(RadioButton.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(RadioButton.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(RadioButton.selectors.label);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(RadioButton.selectors.qm);
        }

        getTooltipDiv() {
            return this.element.querySelector(RadioButton.selectors.tooltipDiv);
        }

        getErrorDiv() {
            return this.element.querySelector(RadioButton.selectors.errorDiv);
        }

        setModel(model) {
            super.setModel(model);
            let widgets = this.widget;
            widgets.forEach(widget => {
                widget.addEventListener('change', (e) => {
                    this._model.value = e.target.value;
                });
            });
        }

        updateEnabled(enabled, state) {
            this.toggle(enabled, FormView.Constants.ARIA_DISABLED, true);
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

        updateReadOnly(readonly, state) {
            this.toggle(readonly, "aria-readonly", true);
            let widgets = this.widget;
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

        updateValue(modelValue) {
            if(modelValue != null) {
                this.widget.forEach(widget => {
                    if (widget.value != null && modelValue.toString() == widget.value.toString()) {
                        widget.checked = true;
                        widget.setAttribute(FormView.Constants.HTML_ATTRS.CHECKED, FormView.Constants.HTML_ATTRS.CHECKED);
                        widget.setAttribute(FormView.Constants.ARIA_CHECKED, true);
                    } else {
                        widget.checked = false;
                        widget.removeAttribute(FormView.Constants.HTML_ATTRS.CHECKED);
                        widget.setAttribute(FormView.Constants.ARIA_CHECKED, false);
                    }
                }, this)
            }
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new RadioButton({element});
    }, RadioButton.selectors.self);

})();
