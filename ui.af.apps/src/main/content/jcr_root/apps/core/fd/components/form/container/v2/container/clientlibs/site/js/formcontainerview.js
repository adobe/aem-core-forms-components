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

(function() {

    "use strict";
    class FormContainerV2 extends FormView.FormContainer {
        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormContainer";
        static bemBlock = 'cmp-adaptiveform-container';
        static loader = "loader" ;
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            loader: "[data-" + this.NS + '-' + this.loader + '= "true" ]',
        };
        static loadingClass = `${FormContainerV2.bemBlock}--loading`;
        constructor(params) {
            const triggerEventOnGuideBridge = () => {
                const eventPayload = {
                    formId: this.getFormId(),
                    formTitle: this.getFormTitle(),
                };
                window.guideBridge.trigger("submitStart", eventPayload, this.getPath());
            }
            super(params);
            let self = this;
            this._model.subscribe((action) => {
                triggerEventOnGuideBridge();
                let state = action.target.getState();
                let body = action.payload?.body;
                if (body) {
                    if (body.redirectUrl) {
                        let redirectURL = self._path + '.guideThankYouPage.html';  //default ThankYouPage Path
                        let redirectElement = document.querySelector('[name=":redirect"]');
                        // check to prevent tampering of redirectURL from client
                        if(redirectElement && redirectElement.value === body.redirectUrl) {
                            redirectURL = body.redirectUrl;
                        }
                        window.location.href = redirectURL;
                    } else if (body.thankYouMessage) {
                        let formContainerElement = document.querySelector("[data-cmp-path='"+ self._path +"']");
                        let thankYouMessage = document.createElement("div");
                        thankYouMessage.setAttribute("class", "tyMessage");
                        thankYouMessage.innerHTML = body.thankYouMessage;
                        formContainerElement.replaceWith(thankYouMessage);
                    }
                }
            }, "submitSuccess");
            this._model.subscribe((action) => {
                let state = action.target.getState();
                let defaultSubmissionError = FormView.LanguageUtils.getTranslatedString(this.getLang(), "InternalFormSubmissionError");
                window.alert(defaultSubmissionError);
            }, "submitError");
        }
    }

    async function onDocumentReady() {
        const startTime = new Date().getTime();
        let elements = document.querySelectorAll(FormContainerV2.selectors.loader);
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.add(FormContainerV2.loadingClass);
            console.debug("Form loading started", elements[i].id);
        }
        function onInit(e) {
            let formContainer =  e.detail;
            setTimeout(() => {
                //for loop added to remove the applied loading class from the newly added Div in html
                for (let i = 0; i < elements.length; i++) {
                    elements[i].classList.remove(FormContainerV2.loadingClass);
                    console.debug("Form loading started", elements[i].id);
                }
                // formEl.classList.remove(FormContainerV2.loadingClass);
                const timeTaken = new Date().getTime() - startTime;
                console.debug("Form loading complete", formEl.id, timeTaken);
                }, 10);
        }
        document.addEventListener(FormView.Constants.FORM_CONTAINER_INITIALISED, onInit);
        const formContainer = FormView.Utils.setupFormContainer(({
            _formJson, _prefillData, _path, _element
        }) => {
            return new FormContainerV2({_formJson, _prefillData, _path, _element});
        }, FormContainerV2.selectors.self, FormContainerV2.IS)
    }



    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

})();
