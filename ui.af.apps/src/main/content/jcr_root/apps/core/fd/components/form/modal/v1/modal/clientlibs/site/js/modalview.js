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
            closePopupButton: `.${Modal.bemBlock}__close-button`,
            dialog: `.${Modal.bemBlock}__dialog`,
            panelContainer: `.${Modal.bemBlock}__panel-container`,
            panelContainerHidden: `.${Modal.bemBlock}__panel-container--hidden`,
            button: `.${Modal.bemBlock}__button`,
            overlay: `.${Modal.bemBlock}__overlay`
        };

        constructor(params) {
            super(params);
            this.dialog = this.element.querySelector(Modal.selectors.dialog);
            this.panelContainer = this.element.querySelector(Modal.selectors.panelContainer);
            this.button = this.element.querySelector(Modal.selectors.button);
            this.button.addEventListener('click', this.openModal.bind(this));
            document.addEventListener('keydown', this.handleKeyDown.bind(this));
            this.overlay = this.element.querySelector(Modal.selectors.overlay);
        }

        openModal() {
            this.dialog.style.display = 'block';
            this.panelContainer.classList.remove(Modal.selectors.panelContainerHidden);
            document.body.classList.add(Modal.selectors.overlay.replace('.', ''));
        }

        closeModal() {
            this.dialog.style.display = 'none';
            this.panelContainer.classList.add(Modal.selectors.panelContainerHidden);
            document.body.classList.remove(Modal.selectors.overlay.replace('.', '')

            );
        }

        handleKeyDown(event) {
            if (event.key === 'Escape') {
                this.closeModal();
            }
        }

        getWidget() {
            return null;
        }

        getDescription() {
            return this.element.querySelector(Modal.selectors.description);
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
