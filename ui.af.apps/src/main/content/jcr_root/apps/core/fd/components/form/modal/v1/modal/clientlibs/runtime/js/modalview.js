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

    class Modal extends FormView.FormPanel {
        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormModal";
        static bemBlock = 'cmp-adaptiveform-modal';
        static selectors = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            label: `.${Modal.bemBlock}__label`,
            description: `.${Modal.bemBlock}__longdescription`,
            qm: `.${Modal.bemBlock}__questionmark`,
            tooltipDiv: `.${Modal.bemBlock}__shortdescription`,
            closeButton: `.${Modal.bemBlock}__close`,
            openButton: `.${Modal.bemBlock}__button`,
            panelContainer: `.${Modal.bemBlock}__panel-container`,
            overlay: `.${Modal.bemBlock}__overlay`
        };

        constructor(params) {
            super(params);
            this.setupEventListeners();
            this.#handleScroll()
        }

        showModal() {
            var overlay = this.element.querySelector(this.constructor.selectors.overlay);
            overlay.classList.remove(`${this.constructor.bemBlock}__overlay--hidden`);
            overlay.classList.add(`${this.constructor.bemBlock}__overlay--visible`);

            // Prevent background scrolling
            document.body.style.overflow = 'hidden';
        }

        hideModal() {
            var overlay = this.element.querySelector(this.constructor.selectors.overlay);
            overlay.classList.remove(`${this.constructor.bemBlock}__overlay--visible`);
            overlay.classList.add(`${this.constructor.bemBlock}__overlay--hidden`);

            // Allow background scrolling
            document.body.style.overflow = 'auto';
        }


        setupEventListeners() {
            var openButton = this.element.querySelector(Modal.selectors.openButton);
            var closeButton = this.element.querySelector(Modal.selectors.closeButton);

            // Open the modal when the open button is clicked
            openButton.addEventListener('click', () => {
                this.showModal();
            });

            // Close the modal when the close button is clicked
            closeButton.addEventListener('click', () => {
                this.hideModal();
            });

            // Close the modal when the 'Esc' key is pressed
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    this.hideModal();
                }
            });
        }

        #handleScroll() {
            var panelContainer = this.element.querySelector(this.constructor.selectors.panelContainer);

            // Add scroll to the panel container
            panelContainer.style.overflowY = 'auto';
            panelContainer.style.maxHeight = '100vh';
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
            return this.element.querySelector(Modal.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector(Modal.selectors.qm);
        }


    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new Modal({element, formContainer})
    }, Modal.selectors.self);
})();
