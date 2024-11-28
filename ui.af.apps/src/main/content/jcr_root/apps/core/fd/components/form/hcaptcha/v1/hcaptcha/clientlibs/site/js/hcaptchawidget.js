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

if (typeof window.HCaptchaWidget === 'undefined') {
    window.HCaptchaWidget = class {
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
            this.#widget.classList.add("cmp-adaptiveform-hcaptcha__widget");
            this.#lang = view.formContainer.getModel().lang;

            //Always inserting it in body
            document.body.appendChild(this.#widget);
            this.#options = Object.assign({}, this.#model._jsonModel);

            this.#renderHCaptcha(widget);
        }

        #renderHCaptcha(element) {

            const self = this;
            const hCaptchaConfigData = this.#options;
            element.innerHTML = '<div class="h-captcha"></div>';
            const hcontainer = document.getElementsByClassName("h-captcha")[0];
            let widgetId;
            const url = hCaptchaConfigData.properties[HCaptchaWidget.FD_CAPTCHA].config.uri;

            const successCallback = function(response) {
                self.setCaptchaModel(response);
            };

            const expiredCallback = function() {
                hcaptcha.reset(widgetId);
                self.setCaptchaModel("");
            };

            const onloadCallbackInternal = function() {
                widgetId = hcaptcha.render(
                    hcontainer,
                    hparameters
                );
                return widgetId;
            };

            const hparameters = {
                'sitekey': hCaptchaConfigData.properties[HCaptchaWidget.FD_CAPTCHA].config.siteKey,
                'size': hCaptchaConfigData.properties[HCaptchaWidget.FD_CAPTCHA].config.size,
                'theme': hCaptchaConfigData.properties[HCaptchaWidget.FD_CAPTCHA].config.theme || 'light',
                'callback': successCallback,
                'expired-callback': expiredCallback
            };

            window.onloadHCaptchaCallback = onloadCallbackInternal;

            const runtimeLocale = this.#lang;

            const scr = document.createElement('script');
            scr.src = url + "?onload=onloadHCaptchaCallback&render=explicit&hl=" + runtimeLocale;
            scr.async = true;
            element.appendChild(scr);
        }

        setCaptchaModel = function(response) {
            this.#model.dispatch(new FormView.Actions.UIChange({'value': response}));
        }
    }
}
