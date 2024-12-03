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

/**
 * This class is responsible for interacting with the turnstile widget. It displays turnstile challenge.
 */

if (typeof window.TurnstileWidget === 'undefined') {
    window.TurnstileWidget = class {
        #widget = null
        #model = null // passed by reference
        #options = null
        #lang = 'en'
        static FD_CAPTCHA = "fd:captcha";

        constructor(view, model, widget) {
            // initialize the widget and model
            this.#widget = widget;
            this.#model = model;
            this.#widget = document.createElement("div");
            this.#widget.classList.add("cmp-adaptiveform-turnstile__widget");
            this.#lang = view.formContainer.getModel().lang;

            //Always inserting it in body
            document.body.appendChild(this.#widget);
            this.#options = Object.assign({}, this.#model._jsonModel);

            this.#renderTurnstile(widget);
        }

        #renderTurnstile(turnstileContainer) {

            const self = this;
            const turnstileConfigData = this.#options;
            let widgetId;
            const url = turnstileConfigData.properties[TurnstileWidget.FD_CAPTCHA].config.uri;

            const successCallback = function(response) {
                self.setCaptchaModel(response);
            };

            const expiredCallback = function() {
                turnstile.reset(widgetId);
                self.setCaptchaModel("");
            };

            const onloadCallbackInternal = function() {
                widgetId = turnstile.render(
                    turnstileContainer,
                    turnstileParameters
                );
                return widgetId;
            };

            const turnstileParameters = {
                'sitekey': this.#model.captchaSiteKey,
                'size': turnstileConfigData.properties[TurnstileWidget.FD_CAPTCHA].config.size,
                'theme': turnstileConfigData.properties[TurnstileWidget.FD_CAPTCHA].config.theme || 'light',
                'callback': successCallback,
                'expired-callback': expiredCallback,
                'language': this.#lang
            };

            window.onloadTurnstileCallback = onloadCallbackInternal;
            const scr = document.createElement('script');
            const queryParams = (this.#model.captchaDisplayMode === 'invisible')
                ? "?render=explicit"
                : "?onload=onloadTurnstileCallback&render=explicit";
            scr.src = url + queryParams;
            scr.async = true;
            turnstileContainer.appendChild(scr);
        }

        setCaptchaModel(response) {
            this.#model.dispatch(new FormView.Actions.UIChange({'value': response}));
        }
    }
}
