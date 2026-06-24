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

(function () {
    "use strict";

    class SummaryStep extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormSummaryStep";
        static bemBlock = 'cmp-adaptiveform-summarystep';
        static selectors = {
            self: `[data-${this.NS}-is="${this.IS}"]`,
            message: `.${this.bemBlock}__message`,
        };

        constructor(params) {
            super(params);
        }

        getClass() { return SummaryStep.IS; }

        getWidget() { return null; }
        getLabel() { return null; }
        getErrorDiv() { return null; }
        getTooltipDiv() { return null; }
        getQuestionMarkDiv() { return null; }

        setModel(model) {
            super.setModel(model);
            // Sanitize any anchor links in the displayed message to same-origin only.
            // This mirrors foundation summary.js behaviour (SummaryDataUpdated handler).
            this.#sanitizeMessageLinks();

            // If autoSubmit is configured, trigger form submission immediately.
            if (model.properties["fd:autoSubmit"] === true) {
                this.#autoSubmitForm();
            }
        }

        // Restrict all anchor hrefs in the message div to same-origin URLs.
        #sanitizeMessageLinks() {
            const messageEl = this.element.querySelector(SummaryStep.selectors.message);
            if (!messageEl) return;
            const origin = window.location.origin;
            messageEl.querySelectorAll('a[href]').forEach(anchor => {
                const href = anchor.getAttribute('href');
                if (href && !href.startsWith(origin) && !href.startsWith('/') && !href.startsWith('#')) {
                    anchor.removeAttribute('href');
                }
            });
        }

        // Dispatch a submit action through the AF Runtime model.
        #autoSubmitForm() {
            try {
                const formModel = this.formContainer.getModel();
                if (formModel && typeof formModel.dispatch === 'function') {
                    formModel.dispatch({ type: FormView.Constants.SUBMIT_EVENT || 'submit' });
                }
            } catch (e) {
                // Guard — do not crash the component if dispatch is unavailable
            }
        }
    }

    FormView.Utils.setupField(({ element, formContainer }) => {
        return new SummaryStep({ element, formContainer });
    }, SummaryStep.selectors.self);

})();
