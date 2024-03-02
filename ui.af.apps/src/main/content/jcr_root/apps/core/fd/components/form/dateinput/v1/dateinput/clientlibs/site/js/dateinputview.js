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
      if (this.widget.value !== "") {
        this._model.value = this.widget.value;
      }
      let dateValue = "";
      let map = new Map();
      let widgets = this.getWidgets();
      this.widget.forEach((widget) => {
        if (widget.value !== "") {
          map.set(widget.id, widget.value);
        }
        if (map.size == 3) {
          const dateVal =
            map.get("Year") + "-" + map.get("Month") + "-" + map.get("Day");
          this._model.value = dateVal;
        }
      });
      widgets.addEventListener("focusout", (e) => {
        if (e.target.value != "" && this.widget.value !== "") {
          map.set(e.target.id, e.target.value);
          map.set(e.target.id, e.target.value);
          map.set(e.target.id, e.target.value);
          if (map.size == 3) {
            const dateVal =
              map.get("Year") + "-" + map.get("Month") + "-" + map.get("Day");
            this._model.value = dateVal;
            e.stopPropagation();
          }

          this.setInactive();
        }
      });

      this.widget.forEach((widget) => {
        widget.addEventListener("change", (e) => {
          this._model.value = e.target.value;
        });
        widget.addEventListener("focusin", (e) => {
          this.setActive();
        });
        widget.addEventListener("focusout", (e) => {
          this._model.value = e.target.value;
          this.setInactive();
        });
      });
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
      console.log("hello");
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

    #noFormats() {
      return (
        (this._model.editFormat == null ||
          this._model.editFormat === "date|short") &&
        (this._model.displayFormat == null ||
          this._model.displayFormat === "date|short")
      );
    }
  }

  FormView.Utils.setupField(({ element, formContainer }) => {
    return new DateInput({ element, formContainer });
  }, DateInput.selectors.self);
})();
