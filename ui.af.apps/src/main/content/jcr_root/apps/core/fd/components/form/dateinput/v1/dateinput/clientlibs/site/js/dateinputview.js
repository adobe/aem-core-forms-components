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

        var inner = fmt.replace(/^date\{(.+)\}$/i, "$1");
        if (inner === fmt) return DEFAULT;

        var sepMatch = inner.match(/[^a-zA-Z0-9]/);
        var separator = sepMatch ? sepMatch[0] : "/";

        var tokens = ["D", "M", "Y"].map(function (t) {
            var idx = inner.search(new RegExp(t, "i"));
            return { token: t, idx: idx };
        });
        tokens.sort(function (a, b) { return a.idx - b.idx; });
        var order = tokens.map(function (t) { return t.token; });

        return { order: order, separator: separator };
    }

    /**
     * Returns the number of days in the given month (1-based) of the given year.
     * Relies on Date rolling: new Date(year, month, 0) = last day of (month-1).
     * Correctly handles leap years for February.
     */
    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    /**
     * Validates the logical correctness of the complete date (cross-field).
     * Mirrors the foundation GuideDateInput._isValidDate() check.
     * Returns true when any field is empty (partial entry is deferred) or
     * when the assembled date is a real calendar date.
     */
    function isValidFullDate(d, m, y) {
        if (!d || !m || !y) return true; // partial — defer validation
        var day   = parseInt(d, 10);
        var month = parseInt(m, 10);
        var year  = parseInt(y, 10);
        if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
        if (month < 1 || month > 12) return false;
        if (year < 1000 || year > 9999) return false;
        return day >= 1 && day <= daysInMonth(month, year);
    }

    /**
     * Per-field regex validators matching foundation GuideDateInput combFieldControls.
     * D: 1–31, M: 1–12, Y: exactly 4 digits.
     */
    var VALIDATORS = {
        D: /^(?:0?[1-9]|1[0-9]|2[0-9]|3[01])$/,
        M: /^(?:0?[1-9]|1[012])$/,
        Y: /^[0-9]{4}$/
    };

    /** Maximum digit count accepted per sub-field. */
    var MAX_LEN = { D: 2, M: 2, Y: 4 };

    /**
     * Returns true when the single digit typed as the first character of a
     * sub-field cannot possibly start any valid 2-digit value for that field.
     * Mirrors the foundation comb-widget behaviour that prevents over-range input.
     *
     *   Day   — first digit > 3 means 4x–9x which are all > 31.
     *   Month — first digit > 1 means 2x–9x which are all > 12.
     */
    function shouldAutoAdvanceEarly(token, singleDigit) {
        var d = parseInt(singleDigit, 10);
        if (token === "D") return d > 3;
        if (token === "M") return d > 1;
        return false;
    }

    /**
     * Key codes always allowed through the digit-only keydown gate:
     * Backspace(8), Tab(9), Escape(27), Delete(46), Home(35), End(36),
     * Left(37), Up(38), Right(39), Down(40).
     */
    var ALLOWED_KEYS = [8, 9, 27, 46, 35, 36, 37, 38, 39, 40];

    function isDigitKey(e) {
        return (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105);
    }

    function isAllowedKey(e) {
        if (ALLOWED_KEYS.indexOf(e.keyCode) !== -1) return true;
        if ((e.ctrlKey || e.metaKey) && [65, 67, 86, 88].indexOf(e.keyCode) !== -1) return true;
        return isDigitKey(e);
    }

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

        /**
         * Returns the maximum valid day for the month currently entered in the M field.
         * Falls back to 31 when month is empty or invalid (global max, no restriction).
         * Uses year 2000 (a leap year) when the Y field is incomplete so that February
         * allows 29 until the year is confirmed — the conservative permissive choice.
         */
        #getMaxDayForCurrentMonth() {
            var mVal = this.#getInputByToken("M").value.trim();
            if (!mVal || !VALIDATORS.M.test(mVal)) return 31;
            var yVal = this.#getInputByToken("Y").value.trim();
            var year = (yVal && VALIDATORS.Y.test(yVal)) ? parseInt(yVal, 10) : 2000;
            return daysInMonth(parseInt(mVal, 10), year);
        }

        #getWrapperByToken(token) {
            return this.element.querySelector(DateInput.selectors["wrapper" + ({ D: "Day", M: "Month", Y: "Year" }[token])]);
        }

        /**
         * Reorders the three field-wrapper divs inside the container to match
         * the field order derived from dateDisplayFormat (e.g. D→M→Y or M→D→Y).
         */
        #applyFieldOrder(order) {
            var container = this.element.querySelector(DateInput.selectors.container);
            if (!container) return;
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
         * Strips leading zeros from M and D for display (matching foundation behaviour).
         */
        #splitISOValue(isoValue) {
            if (!isoValue) {
                ["D", "M", "Y"].forEach((t) => { this.#getInputByToken(t).value = ""; });
                return;
            }
            var parts = String(isoValue).split("-");
            this.#getInputByToken("Y").value = parts[0] || "";
            this.#getInputByToken("M").value = parts[1] ? String(parseInt(parts[1], 10)) : "";
            this.#getInputByToken("D").value = parts[2] ? String(parseInt(parts[2], 10)) : "";
        }

        /**
         * Allows only digit keys and navigation keys through (keydown gate).
         *
         * For M: prevents a second digit that would produce a month > 12.
         * For D: prevents a second digit that would produce:
         *   (a) a day > 31 (global cap), or
         *   (b) a day > the current month's actual number of days
         *       e.g. "1" already typed in November (30 days) → blocks "1" (31 > 30).
         */
        #onKeyDown(e, token) {
            if (!isAllowedKey(e)) {
                e.preventDefault();
                return;
            }
            if (!isDigitKey(e)) return;
            if (token !== "D" && token !== "M") return;

            var input = this.#getInputByToken(token);
            var current = input.value.replace(/\D/g, "");
            if (current.length !== 1) return; // only gate the second digit

            var newDigit = (e.key && /^\d$/.test(e.key))
                ? e.key
                : String(e.keyCode >= 96 ? e.keyCode - 96 : e.keyCode - 48);
            var candidate = current + newDigit;

            // Global range check (D: 1–31, M: 1–12)
            if (!VALIDATORS[token].test(candidate)) {
                e.preventDefault();
                return;
            }
            // Month-aware max check for day field
            if (token === "D" && parseInt(candidate, 10) > this.#getMaxDayForCurrentMonth()) {
                e.preventDefault();
            }
        }

        /**
         * Fires after every character typed.
         *
         * 1. Strips non-digit characters (defensive — handles paste).
         * 2. Enforces per-field maxLen.
         * 3. Smart auto-advance: if the single digit typed cannot start any valid
         *    2-digit value for this field (e.g. "5" in month → 5x > 12), focus moves
         *    to the next sub-field immediately. Matches foundation comb-widget behaviour.
         * 4. Standard auto-advance when the field reaches maxLen.
         */
        #onInput(token, nextToken) {
            var input = this.#getInputByToken(token);
            var digits = input.value.replace(/\D/g, "");
            var maxLen = MAX_LEN[token];
            if (digits.length > maxLen) {
                digits = digits.slice(0, maxLen);
            }
            // Paste / mobile safety net for D and M: strip back to first digit when
            // (a) global range is violated, or (b) day exceeds the current month's max.
            if ((token === "D" || token === "M") && digits.length === 2) {
                if (!VALIDATORS[token].test(digits)) {
                    digits = digits.slice(0, 1);
                } else if (token === "D" && parseInt(digits, 10) > this.#getMaxDayForCurrentMonth()) {
                    digits = digits.slice(0, 1);
                }
            }
            input.value = digits;

            this.#syncCombinedValue();

            if (!nextToken) return;

            // Smart advance: first digit cannot start any valid 2-digit value.
            // For D: also considers the current month's max (e.g. "3" in February → 3x ≥ 30 > 29).
            var earlyAdvance = shouldAutoAdvanceEarly(token, digits);
            if (!earlyAdvance && digits.length === 1 && token === "D") {
                var maxDay = this.#getMaxDayForCurrentMonth();
                // Smallest possible 2-digit value starting with this digit is digit*10
                if (parseInt(digits, 10) * 10 > maxDay) {
                    earlyAdvance = true;
                }
            }
            if (digits.length === 1 && earlyAdvance) {
                this.#getInputByToken(nextToken).focus();
                return;
            }

            // Standard advance: field is full
            if (digits.length === maxLen) {
                this.#getInputByToken(nextToken).focus();
            }
        }

        /**
         * Validates a single sub-field against its per-field regex.
         * Sets aria-invalid on the input when invalid.
         * Matches foundation GuideDateInput._isCombFieldValid() logic.
         */
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

        /**
         * Cross-field validation: checks that the assembled date is a real calendar
         * date. Mirrors foundation GuideDateInput._isValidDate() which uses
         * xfalib PictureFmt.parseDate under the hood.
         *
         * When all three fields are filled and the date is impossible (e.g. April 31,
         * Feb 30, Feb 29 in a non-leap year) marks the day field as aria-invalid and
         * returns false so the combined value is not committed.
         */
        #validateFullDate() {
            var d = this.#getInputByToken("D").value.trim();
            var m = this.#getInputByToken("M").value.trim();
            var y = this.#getInputByToken("Y").value.trim();

            if (!d || !m || !y) return true; // partial — not yet fully entered

            var valid = isValidFullDate(d, m, y);
            var dayInput = this.#getInputByToken("D");
            if (!valid) {
                dayInput.setAttribute("aria-invalid", "true");
            } else {
                // Only clear aria-invalid on day if the per-field check also passes
                if (VALIDATORS.D.test(d)) {
                    dayInput.removeAttribute("aria-invalid");
                }
            }
            return valid;
        }

        /**
         * Rebuilds the ISO value from the three sub-inputs and pushes it to both
         * the hidden combined input and the AF model.
         *
         * The combined value is only written when the full date passes cross-field
         * validation — matching GuideDateInput.getCommitValue() which returns "" for
         * an invalid parsed date.
         */
        #syncCombinedValue() {
            var combined = this.getWidget();
            var fullValid = this.#validateFullDate();
            var iso = fullValid ? this.#buildISOValue() : "";
            if (combined) combined.value = iso;
            this.setModelValue(iso || "");
        }

        setModel(model) {
            super.setModel(model);

            var fmt = this.element.getAttribute("data-cmp-date-display-format") || "date{D/M/YYYY}";
            var parsed = parseDateDisplayFormat(fmt);
            this.#applyFieldOrder(parsed.order);

            if (model.value) {
                this.#splitISOValue(model.value);
            }

            parsed.order.forEach((token, idx) => {
                var input = this.#getInputByToken(token);
                if (!input) return;
                var nextToken = parsed.order[idx + 1] || null;

                input.addEventListener("keydown", (e) => this.#onKeyDown(e, token));
                input.addEventListener("input", () => this.#onInput(token, nextToken));
                input.addEventListener("focus", () => {
                    this.setActive();
                    this.triggerEnter();
                });
                input.addEventListener("blur", () => {
                    // Per-field range check first, then cross-field calendar check
                    this.#validateSubField(token);
                    this.#validateFullDate();
                    this.#syncCombinedValue();
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
