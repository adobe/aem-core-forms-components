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
    class CheckBoxGroup extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        /**
         * Each FormField has a data attribute class that is prefixed along with the global namespace to
         * distinguish between them. If a component wants to put a data-attribute X, the attribute in HTML would be
         * data-{NS}-{IS}-x=""
         * @type {string}
         */
        static IS = "adaptiveFormCheckBoxGroup";
        static bemBlock = 'cmp-adaptiveform-checkboxgroup'
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${CheckBoxGroup.bemBlock}__widget`,
            widgetLabel: `.${CheckBoxGroup.bemBlock}__widget__label`,
            label: `.${CheckBoxGroup.bemBlock}__label`,
            description: `.${CheckBoxGroup.bemBlock}__longdescription`,
            qm: `.${CheckBoxGroup.bemBlock}__questionmark`,
            errorDiv: `.${CheckBoxGroup.bemBlock}__errormessage`
        };

        constructor(params) {
            super(params);
            this.qm = this.element.querySelector(CheckBoxGroup.selectors.qm)
            this.widgetLabel = this.element.querySelector(CheckBoxGroup.selectors.widgetLabel)
        }

        getWidget() {
            return this.element.querySelectorAll(CheckBoxGroup.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector(CheckBoxGroup.selectors.description);
        }

        getLabel() {
            return this.element.querySelector(CheckBoxGroup.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector(CheckBoxGroup.selectors.errorDiv);
        }

        setModel(model) {
            super.setModel(model);
            const widgets = this.widget
            for (let i = 0; i < widgets.length; i++) {
                let self = widgets[i]
                widgets[i].addEventListener('change', (e) => {
                    this._handleChange(self)
                })
            }
        }

        _handleChange(widget) {
            this._updateModelValue(widget)
        }

        _updateModelValue(widget) {
            let oldValue = (this._model.value|| []).slice()
            let widgetVal = this._getSelectedValue(widget.value)
            let newValue = oldValue

            if (widget.checked)
                newValue.push(widgetVal)
            else {
                const index = oldValue.indexOf(widgetVal);
                if (index > -1) { // only splice array when item is found
                    oldValue.splice(index, 1); // 2nd parameter means remove one item only
                }
                newValue = oldValue
            }
            this._model.value = newValue
        }

        _getSelectedValue(value) {
            let dataType = this._model.type, tmpValue;
            switch (dataType) {
                case "number[]":
                    tmpValue = parseInt(value);
                    break;
                case "boolean[]":
                    tmpValue = (value === 'true');
                    break;
                default:
                    tmpValue = value;
                    break;
            }
            return tmpValue;
        }

        _updateValue(value, t) {
            console.log("aaaaaaa")
            const widgets = this.widget
            for (let i = 0; i < widgets.length; i++) {
                let widget = widgets[i]
                if (value.includes(widget.value)) {
                    widget.setAttribute("checked", "checked")
                    widget.setAttribute("aria-checked", true)
                } else {
                    widget.removeAttribute("checked");
                    widget.setAttribute("aria-checked", false);
                }

            }
        }

        _updateEnable(enable) {
            this.toggle(enable, FormView.Constants.ARIA_DISABLED, true);
            this.element.setAttribute(FormView.Constants.DATA_ATTRIBUTE_ENABLED, enable);
            const widgets = this.widget
            for (let i = 0; i < widgets.length; i++) {
                let widget = widgets[i]
                if (enable === false) {
                    widget.setAttribute("disabled", true);
                    widget.setAttribute(FormView.Constants.ARIA_DISABLED, true);
                } else {
                    widget.removeAttribute("disabled");
                    widget.removeAttribute(FormView.Constants.ARIA_DISABLED);
                }
            }
        }

    }


    FormView.Utils.setupField(({element, formContainer}) => {
        return new CheckBoxGroup({element})
    }, CheckBoxGroup.selectors.self);

})();
