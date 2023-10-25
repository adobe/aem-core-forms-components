/*******************************************************************************
 * Copyright 2023 Adobe
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

    class TermsAndConditions extends FormView.FormPanel {
        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormTermsAndConditions";
        static bemBlock = 'cmp-adaptiveform-termsandcondition';
        static selectors = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            label: `.${TermsAndConditions.bemBlock}__label`,
            description: `.${TermsAndConditions.bemBlock}__longdescription`,
            qm: `.${TermsAndConditions.bemBlock}__questionmark`,
            tooltipDiv: `.${TermsAndConditions.bemBlock}__shortdescription`,
            tncContentWrapper: `.${TermsAndConditions.bemBlock}__content-container`,
            closePopupButton: `.${TermsAndConditions.bemBlock}__close-button`
        };

        constructor(params) {
            super(params);
            this.#handleScroll()
        }

        addChild(childView) {
            super.addChild(childView);
            if (childView.getModel()._jsonModel.fieldType === 'checkbox-group') {
                this.#addLinkClickListener(childView);
            }
            if (childView.getModel()._jsonModel.fieldType === 'checkbox') {
                this.#handlePopup(childView);
            }
        }

        #addLinkClickListener(childView) {
            childView.getWidgets().querySelectorAll('label').forEach((item) => {
                const checkboxInput = item.querySelector('input');
                item.querySelector('a').addEventListener('click', (e) => {
                    checkboxInput.click();
                })
            })
        }

        #handleScroll() {
            const intersection = this.element.querySelector('.cmp-adaptiveform-termsandcondition__text-intersect');
            if (intersection) {
                const self = this;
                const io = new IntersectionObserver(onIntersection, {
                    threshold: [1],
                })
                function onIntersection ([{isIntersecting}]) {
                    if (isIntersecting) {
                        self.children.filter(c => c.getModel()._jsonModel.fieldType === 'checkbox').forEach(cb => cb.updateEnabled(true))
                        io.unobserve(intersection);
                    }
                }
                io.observe(intersection)
            }
        }

        #handlePopup(approvalCheckbox) {
            const closePopUpBtn = this.getClosePopupButton();
            if (closePopUpBtn) {
                closePopUpBtn.addEventListener('click', () => {
                    this.toggleAttribute(this.getContentDivWrapper(), false, 'data-cmp-visible', false);
                })

                approvalCheckbox.label.addEventListener('click', () => {
                    const contentDiv = this.getContentDivWrapper();
                    if (contentDiv) {
                        this.toggleAttribute(this.getContentDivWrapper(), true, 'data-cmp-visible', false);
                    }
                })
            }
        }

        getContentDivWrapper() {
            return this.element.querySelector(TermsAndConditions.selectors.tncContentWrapper);
        }

        getClosePopupButton() {
            return this.element.querySelector(TermsAndConditions.selectors.closePopupButton);
        }

        getWidget() {
            return null;
        }

        getDescription() {
            return this.element.querySelector(TermsAndConditions.selectors.description);
        }

        getLabel() {
            return null;
        }

        getErrorDiv() {
            return null;
        }

        getTooltipDiv() {
            return this.element.querySelector(TermsAndConditions.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(TermsAndConditions.selectors.qm);
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new TermsAndConditions({element, formContainer})
    }, TermsAndConditions.selectors.self);
})();
