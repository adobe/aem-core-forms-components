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
(function () {
  class DateInput extends FormView.FormFieldBase {
    static NS = FormView.Constants.NS;
    static IS = "adaptiveFormDateInput";
    static bemBlock = "cmp-adaptiveform-dateinput";
    static selectors = {
      self: "[data-" + this.NS + '-is="' + this.IS + '"]',
      widgets: `.${DateInput.bemBlock}__widget`,
      widget: `.${DateInput.bemBlock}Field__widget`,
      label: `.${DateInput.bemBlock}__label`,
      labelField: `.${DateInput.bemBlock}__labelField`,
      description: `.${DateInput.bemBlock}__longdescription`,
      qm: `.${DateInput.bemBlock}__questionmark`,
      errorDiv: `.${DateInput.bemBlock}__errormessage`,
      tooltipDiv: `.${DateInput.bemBlock}__shortdescription`,
    };

    constructor(params) {
      super(params);
    }

    getWidgets() {
      return this.element.querySelector(DateInput.selectors.widgets);
    }

    getWidget() {
      return this.element.querySelectorAll(DateInput.selectors.widget);
    }

    getDescription() {
      return this.element.querySelector(DateInput.selectors.description);
    }

    getLabel() {
      return this.element.querySelector(DateInput.selectors.label);
    }

    getErrorDiv() {
      return this.element.querySelector(DateInput.selectors.errorDiv);
    }

    getQuestionMarkDiv() {
      return this.element.querySelector(DateInput.selectors.qm);
    }

    getTooltipDiv() {
      return this.element.querySelector(DateInput.selectors.tooltipDiv);
    }

    setModel(model) {
      super.setModel(model);
      let widgets = this.widget;
      let map = new Map();
      widgets.forEach((widget) => {
        let self = widget;
        this.#updateModelValue(self, map);
        widget.addEventListener("change", (e) => {
          this.#updateModelValue(self, map);
        });
        widget.addEventListener("focusin", (e) => {
          this.setActive();
        });
        widget.addEventListener("blur", (e) => {
          this.setInactive();
        });
      });
    }

    #updateModelValue(widget, map) {
      map.set(widget.id, widget.value);
      if (map.size == 3) {
        const dateVal =
          map.get("Year") + "-" + map.get("Month") + "-" + map.get("Day");
        this._model.value = dateVal;
        if (dateVal == "--") {
          this._model.value = null;
        }
      }
    }

    updateValue(modelValue) {
      modelValue = [].concat(modelValue);
      if (modelValue[0] != null) {
        let dateArray = modelValue[0].split("-");
        this.widget.forEach((widget, index) => {
          if (widget.id == "Year") {
            widget.setAttribute("value", dateArray[0]);
          } else if (widget.id == "Month") {
            widget.setAttribute("value", dateArray[1]);
          } else {
            widget.setAttribute("value", dateArray[2]);
          }
        }, this);
      }
      super.updateEmptyStatus();
    }

    updateEnabled(enabled, state) {
      this.toggle(enabled, FormView.Constants.ARIA_DISABLED, true);
      this.element.setAttribute(
        FormView.Constants.DATA_ATTRIBUTE_ENABLED,
        enabled
      );
      let widgets = this.widget;
      widgets.forEach((widget) => {
        if (enabled === false) {
          if (state.readOnly === false) {
            widget.setAttribute(
              FormView.Constants.HTML_ATTRS.DISABLED,
              "disabled"
            );
            widget.setAttribute(FormView.Constants.ARIA_DISABLED, true);
          }
        } else if (state.readOnly === false) {
          widget.removeAttribute(FormView.Constants.HTML_ATTRS.DISABLED);
          widget.removeAttribute(FormView.Constants.ARIA_DISABLED);
        }
      });
    }

    updateReadOnly(readonly, state) {
      let widgets = this.widget;
      this.element.setAttribute(
        FormView.Constants.DATA_ATTRIBUTE_READONLY,
        readonly
      );
      widgets.forEach((widget) => {
        if (readonly === true) {
          widget.setAttribute(
            FormView.Constants.HTML_ATTRS.DISABLED,
            "disabled"
          );
          widget.setAttribute("aria-readonly", true);
        } else {
          widget.removeAttribute(FormView.Constants.HTML_ATTRS.DISABLED);
          widget.removeAttribute("aria-readonly");
        }
      });
    }

    updateRequired(required, state) {
      let widgets = this.widget;
      this.element.setAttribute(Constants.DATA_ATTRIBUTE_REQUIRED, required);
      widgets.forEach((widget) => {
        if (this.widget) {
          this.toggle(required, "required");
          this.element.setAttribute(
            Constants.DATA_ATTRIBUTE_REQUIRED,
            required
          );
          if (required === true) {
            this.widget.setAttribute("required", "required");
          } else {
            this.widget.removeAttribute("required");
          }
        }
      });
    }
  }

  FormView.Utils.setupField(({ element, formContainer }) => {
    return new DateInput({ element, formContainer });
  }, DateInput.selectors.self);
})();
