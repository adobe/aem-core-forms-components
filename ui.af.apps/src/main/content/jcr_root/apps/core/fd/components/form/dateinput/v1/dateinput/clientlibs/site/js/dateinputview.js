/*******************************************************************************
 * Copyright 2026 Adobe
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
    "use strict";

    /**
     * Parses an XFA picture-clause date format string such as {@code date{D/M/YYYY}}
     * and returns an object describing the field order and separator.
     *
     * Returns: { order: ['D','M','Y'] | ['M','D','Y'] | ['Y','M','D'] | ..., separator: '/' }
     * Falls back to DMY order with '/' separator for unrecognised formats.
     */
    function parseDateDisplayFormat(fmt) {
        var DEFAULT = { order: ["D", "M", "Y"], separator: "/" };
        if (!fmt) return DEFAULT;

        // Strip the outer  date{...}  wrapper
        var inner = fmt.replace(/^date\{(.+)\}$/i, "$1");
        if (inner === fmt) return DEFAULT;  // no match — not an XFA format

        // Extract separator: first non-alphanumeric character
        var sepMatch = inner.match(/[^a-zA-Z0-9]/);
        var separator = sepMatch ? sepMatch[0] : "/";

        // Determine order of D, M, Y by their first occurrence in the inner string
        var tokens = ["D", "M", "Y"].map(function (t) {
            // Use case-insensitive search; treat both 'D' and 'DD' etc. as the same token
            var idx = inner.search(new RegExp(t, "i"));
            return { token: t, idx: idx };
        });
        tokens.sort(function (a, b) { return a.idx - b.idx; });
        var order = tokens.map(function (t) { return t.token; });

        return { order: order, separator: separator };
    }

    /** Per-field regex validators matching foundation GuideDateInput behaviour. */
    var VALIDATORS = {
        D: /^(?:0?[1-9]|1[0-9]|2[0-9]|3[01])$/,
        M: /^(?:0?[1-9]|1[012])$/,
        Y: /^[0-9]{4}$/
    };

    class DateInput extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormDateInput";
        static bemBlock = "cmp-adaptiveform-dateinput";

        static selectors = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${DateInput.bemBlock}__widget--combined`,
            wrapperDay: `.${DateInput.bemBlock}__field-wrapper--day`,
            wrapperMonth: `.${DateInput.bemBlock}__field-wrapper--month`,
            wrapperYear: `.${DateInput.bemBlock}__field-wrapper--year`,
            widgetDay: `.${DateInput.bemBlock}__widget--day`,
            widgetMonth: `.${DateInput.bemBlock}__widget--month`,
            widgetYear: `.${DateInput.bemBlock}__widget--year`,
            label: `.${DateInput.bemBlock}__label`,
            description: `.${DateInput.bemBlock}__longdescription`,
            qm: `.${DateInput.bemBlock}__questionmark`,
            errorDiv: `.${DateInput.bemBlock}__errormessage`,
            tooltipDiv: `.${DateInput.bemBlock}__shortdescription`,
            container: `.${DateInput.bemBlock}__widget-container`,
        };

        constructor(params) {
            super(params);
        }

        /** Returns the hidden combined ISO value input used by the base class. */
        getWidget() {
            return this.element.querySelector(DateInput.selectors.widget);
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

        getTooltipDiv() {
            return this.element.querySelector(DateInput.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(DateInput.selectors.qm);
        }

        #getInputByToken(token) {
            return this.element.querySelector(DateInput.selectors["widget" + ({ D: "Day", M: "Month", Y: "Year" }[token])]);
        }

        #getWrapperByToken(token) {
            return this.element.querySelector(DateInput.selectors["wrapper" + ({ D: "Day", M: "Month", Y: "Year" }[token])]);
        }

        /**
         * Reorders the three field-wrapper divs inside the container to match
         * the order derived from dateDisplayFormat (e.g. D→M→Y or M→D→Y).
         */
        #applyFieldOrder(order) {
            var container = this.element.querySelector(DateInput.selectors.container);
            if (!container) return;
            // append wrappers in the desired order — browser reorders naturally
            order.forEach((token) => {
                var wrapper = this.#getWrapperByToken(token);
                if (wrapper) container.appendChild(wrapper);
            });
        }

        /** Builds an ISO YYYY-MM-DD string from the three sub-inputs. Returns "" if any is blank. */
        #buildISOValue() {
            var d = this.#getInputByToken("D").value.trim();
            var m = this.#getInputByToken("M").value.trim();
            var y = this.#getInputByToken("Y").value.trim();
            if (!d || !m || !y) return "";
            return y.padStart(4, "0") + "-" + m.padStart(2, "0") + "-" + d.padStart(2, "0");
        }

        /**
         * Splits an ISO YYYY-MM-DD value and populates the three sub-inputs.
         * Also accepts the format-separator concatenation if value comes in that form.
         */
        #splitISOValue(isoValue) {
            if (!isoValue) {
                ["D", "M", "Y"].forEach((t) => { this.#getInputByToken(t).value = ""; });
                return;
            }
            // ISO format is always YYYY-MM-DD
            var parts = String(isoValue).split("-");
            this.#getInputByToken("Y").value = parts[0] || "";
            this.#getInputByToken("M").value = parts[1] ? String(parseInt(parts[1], 10)) : "";
            this.#getInputByToken("D").value = parts[2] ? String(parseInt(parts[2], 10)) : "";
        }

        /** Validates a single sub-input against its regex and marks aria-invalid accordingly. */
        #validateSubField(token) {
            var input = this.#getInputByToken(token);
            var val = input.value.trim();
            var valid = val === "" || VALIDATORS[token].test(val);
            if (!valid) {
                input.setAttribute("aria-invalid", "true");
            } else {
                input.removeAttribute("aria-invalid");
            }
            return valid;
        }

        #onSubInputChange(token) {
            this.#validateSubField(token);
            var iso = this.#buildISOValue();
            var combined = this.getWidget();
            if (combined) combined.value = iso;
            this.setModelValue(iso || "");
        }

        setModel(model) {
            super.setModel(model);

            // Read and apply the format from the data attribute
            var fmt = this.element.getAttribute("data-cmp-date-display-format") || "date{D/M/YYYY}";
            var parsed = parseDateDisplayFormat(fmt);
            this.#applyFieldOrder(parsed.order);

            if (model.value) {
                this.#splitISOValue(model.value);
            }

            ["D", "M", "Y"].forEach((token) => {
                var input = this.#getInputByToken(token);
                if (!input) return;
                input.addEventListener("change", () => this.#onSubInputChange(token));
                input.addEventListener("input", () => this.#onSubInputChange(token));
                input.addEventListener("focus", () => {
                    this.setActive();
                    this.triggerEnter();
                });
                input.addEventListener("blur", () => {
                    this.#validateSubField(token);
                    this.setInactive();
                    this.triggerExit();
                });
            });
        }

        updateValue(modelValue) {
            this.#splitISOValue(modelValue);
            var combined = this.getWidget();
            if (combined) combined.value = modelValue || "";
        }

        updateEnabled(enabled) {
            ["D", "M", "Y"].forEach((token) => {
                var input = this.#getInputByToken(token);
                if (!input) return;
                if (enabled) {
                    input.removeAttribute("disabled");
                } else {
                    input.setAttribute("disabled", "disabled");
                }
            });
        }

        updateReadOnly(readOnly) {
            ["D", "M", "Y"].forEach((token) => {
                var input = this.#getInputByToken(token);
                if (!input) return;
                if (readOnly) {
                    input.setAttribute("readonly", "readonly");
                    input.setAttribute("aria-readonly", "true");
                } else {
                    input.removeAttribute("readonly");
                    input.removeAttribute("aria-readonly");
                }
            });
        }

        updateValidity(validity) {
            ["D", "M", "Y"].forEach((token) => {
                var input = this.#getInputByToken(token);
                if (!input) return;
                if (validity && validity.valid === false) {
                    input.setAttribute("aria-invalid", "true");
                } else {
                    input.removeAttribute("aria-invalid");
                }
            });
        }
    }

    FormView.Utils.setupField(({ element, formContainer }) => {
        return new DateInput({ element, formContainer });
    }, DateInput.selectors.self);
})();
