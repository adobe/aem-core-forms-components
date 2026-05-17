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

    class SignatureStep extends FormView.FormFieldBase {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormSignatureStep";
        static bemBlock = 'cmp-adaptiveform-signaturestep';
        static selectors = {
            self: `[data-${this.NS}-is="${this.IS}"]`,
            header: `.${this.bemBlock}__header`,
            body: `.${this.bemBlock}__body`,
            iframe: `.${this.bemBlock}__iframe`,
            templateMessage: `.${this.bemBlock}__template-message`,
            errorDiv: `.${this.bemBlock}__error`,
        };

        // Target version that indicates multi-user Adobe Sign agreement flow
        static ADOBE_SIGN_MULTI_USER_VERSION = "1.1";

        constructor(params) {
            super(params);
            this._messageHandler = this.#onIframeMessage.bind(this);
        }

        getClass() { return SignatureStep.IS; }

        getWidget() { return null; }
        getLabel() { return null; }
        getErrorDiv() { return null; }
        getTooltipDiv() { return null; }
        getQuestionMarkDiv() { return null; }

        setModel(model) {
            super.setModel(model);
        }

        // Called when the component visibility changes.
        // Initialize the signing flow when the step first becomes visible.
        updateVisible(visible, payload) {
            super.updateVisible(visible, payload);
            if (visible && !this._signingInitialized) {
                this._signingInitialized = true;
                this.#initializeSigning();
            }
        }

        // Determine the signing flow from model properties and begin it.
        #initializeSigning() {
            const props = this.getModel().properties;
            const signingService = props["fd:signingService"];
            const targetVersion = props["fd:targetVersion"];
            const cloudServiceConfig = props["fd:cloudServiceConfig"] || "";

            if (signingService === "echosign" && targetVersion === SignatureStep.ADOBE_SIGN_MULTI_USER_VERSION) {
                // Modern multi-user Adobe Sign flow: submit as agreement to get signing URL
                this.#initAgreementFlow(cloudServiceConfig);
            }
            // Scribble and legacy echosign flows are handled by the AF Runtime submit pipeline.
        }

        // Post the form as an agreement to obtain the Adobe Sign signing URL,
        // then load that URL inside the iframe.
        #initAgreementFlow(cloudServiceConfig) {
            const formContainer = this.formContainer;
            const action = formContainer.getModel().action;

            if (!action) {
                this.#showError("Form action URL is not configured.");
                return;
            }

            const body = new URLSearchParams({
                submissionSelector: 'agreement',
                cloudService: cloudServiceConfig
            });

            fetch(action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString()
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server returned ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data && data.signingURL) {
                    this.#loadSigningIframe(data.signingURL);
                } else {
                    this.#showError("Failed to retrieve signing URL from Adobe Sign.");
                }
            })
            .catch(err => {
                this.#showError("Adobe Sign initialization failed: " + err.message);
            });
        }

        // Show the Adobe Sign iframe with the given signing URL and register
        // the cross-origin message listener for the ESIGN completion event.
        #loadSigningIframe(signingURL) {
            const iframe = this.element.querySelector(SignatureStep.selectors.iframe);
            const templateMsg = this.element.querySelector(SignatureStep.selectors.templateMessage);

            if (templateMsg) templateMsg.style.display = 'none';
            if (iframe) {
                iframe.style.display = 'block';
                iframe.src = signingURL;
            }

            // Listen for the ESIGN message posted by the Adobe Sign iframe on completion.
            window.addEventListener('message', this._messageHandler, false);
        }

        // Handle postMessage events from the Adobe Sign iframe.
        // Adobe Sign sends { type: 'ESIGN' } when the user completes signing.
        #onIframeMessage(event) {
            try {
                const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                if (data && data.type === 'ESIGN') {
                    window.removeEventListener('message', this._messageHandler, false);
                    this.#onSigningComplete();
                }
            } catch (e) {
                // Ignore messages from other origins that are not JSON
            }
        }

        // Signing is complete — navigate to the next step in the wizard.
        #onSigningComplete() {
            try {
                const formModel = this.formContainer.getModel();
                if (formModel && typeof formModel.setFocus === 'function') {
                    formModel.setFocus(null);
                }
            } catch (e) {
                // Guard — do not crash if navigation is unavailable
            }
        }

        #showError(message) {
            const errorDiv = this.element.querySelector(SignatureStep.selectors.errorDiv);
            const templateMsg = this.element.querySelector(SignatureStep.selectors.templateMessage);
            if (templateMsg) templateMsg.style.display = 'none';
            if (errorDiv) {
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
            }
        }
    }

    FormView.Utils.setupField(({ element, formContainer }) => {
        return new SignatureStep({ element, formContainer });
    }, SignatureStep.selectors.self);

})();
