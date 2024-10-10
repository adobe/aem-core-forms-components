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

(function() {

    "use strict";
    class FormContainerV2 extends FormView.FormContainer {
        static NS = FormView.Constants.NS;
        static IS = "adaptiveFormContainer";
        static bemBlock = 'cmp-adaptiveform-container';
        static hamburgerMenuInstance = '';
        static selectors  = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
        };

        static loadingClass = `${FormContainerV2.bemBlock}--loading`;
        constructor(params) {
            super(params);
            const { hamburgerMenuInstance } = params;
            FormContainerV2.hamburgerMenuInstance = hamburgerMenuInstance;
            let self = this;
            this._model.subscribe((action) => {
                let state = action.target.getState();
                // execute the handler only if there are no rules configured on submitSuccess event.
                if (!state.events.submitSuccess || state.events.submitSuccess.length === 0) {
                    const globals = {
                        form: self.getModel().getRuleNode(),
                        event: {
                            type: action.type,
                            payload: action.payload,
                        }
                    };
                    FormView.customFunctions.defaultSubmitSuccessHandler(globals);
                }
            }, "submitSuccess");
            this._model.subscribe((action) => {
                let state = action.target.getState();
                // execute the handler only if there are no rules configured on submitError event.
                if (!state.events.submitError || state.events.submitError.length === 0) {
                    let defaultSubmissionError = FormView.LanguageUtils.getTranslatedString(self.getLang(), "InternalFormSubmissionError");
                    const globals = {
                        form: self.getModel().getRuleNode(),
                        event: {
                            type: action.type,
                            payload: action.payload,
                        }
                    };
                    FormView.customFunctions.defaultSubmitErrorHandler(defaultSubmissionError, globals);
                }
            }, "submitError");
            this._model.subscribe((action) => {
                let state = action.target.getState();
                // execute the handler only if there are no rules configured on custom:saveSuccess event.
                if (!state.events['custom:saveSuccess'] || state.events['custom:saveSuccess'].length === 0) {
                    console.log("Draft id = " + action?.payload?.body?.draftId);
                    window.alert(FormView.LanguageUtils.getTranslatedString(self.getLang(), "saveDraftSuccessMessage"));
                }
            }, "saveSuccess");
            this._model.subscribe((action) => {
                let state = action.target.getState();
                // execute the handler only if there are no rules configured on custom:saveError event.
                if (!state.events['custom:saveError'] || state.events['custom:saveError'].length === 0) {
                    window.alert(FormView.LanguageUtils.getTranslatedString(self.getLang(), "saveDraftErrorMessage"));
                }
            }, "saveError");
            this.#setupAutoSave(self.getModel());
        }

        /**
         * Register time based auto save
         * @param formModel.
         */
         #setupAutoSave(formModel) {
            const autoSaveProperties = formModel?.properties?.['fd:autoSave'];
            const enableAutoSave = autoSaveProperties?.['fd:enableAutoSave'];
            if (enableAutoSave) {
                const autoSaveStrategyType = autoSaveProperties['fd:autoSaveStrategyType'];
                const autoSaveInterval = autoSaveProperties['fd:autoSaveInterval'];
                const saveEndPoint = FormView.Utils.getContextPath() + '/adobe/forms/af/save/' + formModel.id;
                if (autoSaveStrategyType === 'time' && autoSaveInterval) {
                    console.log("Registering time based auto save");
                    setInterval(() => {
                        formModel.dispatch(new FormView.Actions.Save({
                            'action': saveEndPoint
                        }));
                    }, parseInt(autoSaveInterval) * 1000);
                }
            }
            this._model.subscribe((action) => {
                const { payload } = action;
                const { changes, field } = payload;
                const { items } = field;
                if (changes && changes.length > 0) {
                    changes.forEach((change) => {
                        switch (change.propertyName) {
                            case "activeChild":
                                FormContainerV2.hamburgerMenuInstance.handleActiveItem(field);
                                break;
                            case "items":
                                FormContainerV2.hamburgerMenuInstance.handleItemsChange(change, items);
                                break;
                            case "visible":
                                FormContainerV2.hamburgerMenuInstance.updateAttribute(field.id, 'data-cmp-visible', field.visible);
                                break;
                            case "enabled":
                                FormContainerV2.hamburgerMenuInstance.updateAttribute(field.id, 'data-cmp-enabled', field.enabled);
                                break;
                        }
                    });
                }
            }, "fieldChanged");
        }
    }

    async function onDocumentReady() {
        const startTime = new Date().getTime();
        let elements = document.querySelectorAll(FormContainerV2.selectors.self);
        const hamburgerMenuInstance = new HamburgerMenu();

        for (let i = 0; i < elements.length; i++) {
            let loaderToAdd = document.querySelector("[data-cmp-adaptiveform-container-loader='"+ elements[i].id + "']");
            if(loaderToAdd){
                loaderToAdd.classList.add(FormContainerV2.loadingClass);
            }
            console.debug("Form loading started", elements[i].id);
        }
        function onInit(e) {
            let formContainer =  e.detail;
            // creating hamburger menu
            hamburgerMenuInstance.initializeHamburgerMenu(formContainer);
            let formEl = formContainer.getFormElement();
            setTimeout(() => {
                let loaderToRemove = document.querySelector("[data-cmp-adaptiveform-container-loader='"+ formEl.id + "']");
                if(loaderToRemove){
                    loaderToRemove.classList.remove(FormContainerV2.loadingClass);
                }
                const timeTaken = new Date().getTime() - startTime;
                console.debug("Form loading complete", formEl.id, timeTaken);
                }, 10);
        }
        document.addEventListener(FormView.Constants.FORM_CONTAINER_INITIALISED, onInit);
        await FormView.Utils.setupFormContainer(async ({
            _formJson, _prefillData, _path, _element
        }) => {
            let formContainer = new FormContainerV2({_formJson, _prefillData, _path, _element, hamburgerMenuInstance});
            // before initializing the form container load all the locale specific json resources
            // for runtime
            const formLanguage = formContainer.getLang();
            const aemLangUrl = `/etc.clientlibs/core/fd/af-clientlibs/core-forms-components-runtime-all/resources/i18n/${formLanguage}.json`;
            await FormView.LanguageUtils.loadLang(formLanguage, aemLangUrl, true);
            formContainer.subscribe();
            return formContainer;
        }, FormContainerV2.selectors.self, FormContainerV2.IS);
    }

    // This is to ensure that the there is no WCM Mode cookie when Form Container is rendered.
    // max-age=0 ensures that the cookie is deleted.
    document.cookie="wcmmode=disabled; max-age=0; path=/";
    
    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }
})();
