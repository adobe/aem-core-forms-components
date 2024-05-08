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
 * This class is responsible for interacting with the hCaptcha widget. It displays hCaptcha challenge.
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

        #renderTurnstile(element) {

            var self = this;
            var turnstileConfigData = this.#options;
            element.innerHTML = '<div class="cf-turnstile"></div>';
            var hcontainer = document.getElementsByClassName("cf-turnstile")[0];
            var widgetId;
            var url = turnstileConfigData.properties[TurnstileWidget.FD_CAPTCHA].config.uri;

            var successCallback = function(response) {
                self.setCaptchaModel(response);
            };

            var expiredCallback = function() {
                turnstile.reset(widgetId);
                self.setCaptchaModel("");
            };

            var onloadCallbackInternal = function() {
                widgetId = turnstile.render(
                    hcontainer,
                    hparameters
                );
                return widgetId;
            };

            var hparameters = {
                'sitekey': turnstileConfigData.properties[TurnstileWidget.FD_CAPTCHA].config.siteKey,
                'size': turnstileConfigData.properties[TurnstileWidget.FD_CAPTCHA].config.size,
                'theme': turnstileConfigData.properties[TurnstileWidget.FD_CAPTCHA].config.theme || 'light',
                'callback': successCallback,
                'expired-callback': expiredCallback,
                'language': this.#lang
            };

            window.onloadTurnstileCallback = onloadCallbackInternal;

            var runtimeLocale = this.#lang;

            var scr = document.createElement('script');
            scr.src = url + "?onload=onloadTurnstileCallback&render=explicit" + runtimeLocale;
            scr.async = true;
            element.appendChild(scr);
        }

        setCaptchaModel = function(response) {
            this.#model.value = (response);
        }
    }
}
