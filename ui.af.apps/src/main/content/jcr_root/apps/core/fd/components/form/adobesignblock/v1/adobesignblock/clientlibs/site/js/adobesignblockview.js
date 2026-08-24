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
(function() {
    "use strict";

    class AdobeSignBlockView extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;

        static IS = "adaptiveFormAdobeSignBlock";

        static bemBlock = "cmp-adaptiveform-adobesignblock";

        static selectors = {
            self: "[data-" + AdobeSignBlockView.NS + '-is="' + AdobeSignBlockView.IS + '"]',
            widget: `.${AdobeSignBlockView.bemBlock}__value`,
            label: `.${AdobeSignBlockView.bemBlock}__label`,
            description: `.${AdobeSignBlockView.bemBlock}__longdescription`,
            qm: `.${AdobeSignBlockView.bemBlock}__questionmark`,
            errorDiv: `.${AdobeSignBlockView.bemBlock}__errormessage`,
            tooltipDiv: `.${AdobeSignBlockView.bemBlock}__shortdescription`
        };

        constructor(params) {
            super(params);
        }

        getWidget() {
            return this.element.querySelector(AdobeSignBlockView.selectors.widget);
        }

        getDescription() {
            return null;
        }

        getLabel() {
            return this.element.querySelector(AdobeSignBlockView.selectors.label);
        }

        getErrorDiv() {
            return null;
        }

        getTooltipDiv() {
            return null;
        }

        getQuestionMarkDiv() {
            return null;
        }

        getClass() {
            return AdobeSignBlockView.IS;
        }

        setFocus() {
            const fieldType = this.parentView?.getModel()?.fieldType;
            if (fieldType !== "form" && this.parentView?.setFocus) {
                this.parentView.setFocus(this.getId());
            }
            this.setActive();
            this.element.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        /**
         * Guards against the form engine calling updateLabel(null) when no label
         * is present in the model state — would otherwise throw on .hasOwnProperty.
         */
        updateLabel(label) {
            if (label) {
                super.updateLabel(label);
            }
        }

        /**
         * Updates the block's rich text content, preserving data-adobesigntype
         * attributes so the Adobe Sign SDK can locate placeholder spans after a
         * Rules Engine value change.
         */
        updateValue(value) {
            const actualValue = typeof value === "undefined" ? "" : value;

            const sanitizedValue = window.DOMPurify ? window.DOMPurify.sanitize(actualValue, {
                ALLOWED_TAGS: [
                    "b", "strong", "i", "em", "u", "sub", "sup", "small",
                    "blockquote", "ul", "ol", "li", "a", "br", "p", "span",
                    "h1", "h2", "h3", "h4", "h5", "h6"
                ],
                ALLOWED_ATTR: [
                    "href", "target", "rel", "class", "id", "style",
                    // Preserve Adobe Sign field-type markers on span elements
                    "data-adobesigntype"
                ]
            }) : actualValue;

            const widget = this.getWidget();
            if (widget) {
                widget.innerHTML = sanitizedValue;
            }
        }
    }

    FormView.Utils.setupField(({ element, formContainer }) => {
        return new AdobeSignBlockView({ element, formContainer });
    }, AdobeSignBlockView.selectors.self);

})();
