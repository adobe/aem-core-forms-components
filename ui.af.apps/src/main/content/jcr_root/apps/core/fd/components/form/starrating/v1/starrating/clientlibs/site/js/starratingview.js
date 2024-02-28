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
    class StarRating extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormStarRating";
        static bemBlock = 'cmp-adaptiveform-starrating';
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${StarRating.bemBlock}__option__widget`,
            widgets: `.${StarRating.bemBlock}__widget`,
            label: `.${StarRating.bemBlock}__label`,
            description: `.${StarRating.bemBlock}__longdescription`,
            errorDiv: `.${StarRating.bemBlock}__errormessage`,
            qm: `.${StarRating.bemBlock}__questionmark`,
            tooltipDiv: `.${StarRating.bemBlock}__shortdescription`
        };

        constructor(params) {
            super(params);
        }


        setModel(model) {
            super.setModel(model);
            let widgets = this.widget;
            widgets.forEach(widget => {
                let self = widget;
                this.#updateModelValue(self);
                widget.addEventListener('change', (e) => {
                    this.#updateModelValue(self, e);
                });
            })
        }

        #updateModelValue(widget, e) {
            var value = undefined;
            if(e) {
                value = Number(e.target.value);
            }
            this._model.value = value;
        }

        updateValue(modelValue) {
            this.widget.forEach(w => {
                if(Number(w.value) <= modelValue) {
                    w.checked = true;
                    w.nextElementSibling.classList.add('cmp-adaptiveform-starrating__filled');
                } else {
                    w.checked = false;
                    w.nextElementSibling.classList.remove('cmp-adaptiveform-starrating__filled');
                }
            }, this)
        }        
        updateReadOnly(readonly) {
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

        getClass() {
            return StarRating.IS;
        }

        getWidgets() {
            return this.element.querySelector(StarRating.selectors.widgets);
        }

        getWidget() {
            return this.element.querySelectorAll(StarRating.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(StarRating.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(StarRating.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(StarRating.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector(StarRating.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(StarRating.selectors.qm);
        }

    }


    FormView.Utils.setupField(({element, formContainer}) => {
        return new StarRating({element,formContainer})
    }, StarRating.selectors.self);
})();

