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

/**
 * This class is responsible for interacting with the recaptcha widget. It displays Google reCAPTCHA challenge.
 */

if (typeof window.RecaptchaWidget === 'undefined') {
    window.RecaptchaWidget = class {
        #widget = null
        #model = null // passed by reference
        #options = null
        #lang = 'en'
        static FD_CAPTCHA = "fd:captcha";
        static RECAPTCHA_ENTERPRISE = "recaptchaEnterprise";
        constructor(view, model, widget) {
            // initialize the widget and model
            this.#widget = widget;
            this.#model = model;
            this.#widget = document.createElement("div");
            this.#widget.classList.add("cmp-adaptiveform-recaptcha__widget");
            this.#lang = view.formContainer.getModel().lang;

            //Always inserting it in body
            document.body.appendChild(this.#widget);
            this.#options = Object.assign({}, this.#model._jsonModel);

            this.#renderRecaptcha(widget);
        }

        #renderRecaptcha(element) {

            var self = this;
            var recaptchaConfigData = this.#options;
            //check if captchaSiteKey property exist in model, if not use the default siteKey
            element.innerHTML = '<div class="g-recaptcha"></div>';
            var gcontainer = document.getElementsByClassName("g-recaptcha")[0];
            var widgetId;
            var url = recaptchaConfigData.properties[RecaptchaWidget.FD_CAPTCHA].config.uri;
            if (recaptchaConfigData.properties[RecaptchaWidget.FD_CAPTCHA].config.size == "invisible") {
                gcontainer.classList.add('g-recaptcha-invisible');
                recaptchaConfigData.required = false;
            }

            const getSiteKey = function () {
                return self.#model.captchaSiteKey == null
                    ? recaptchaConfigData.properties[RecaptchaWidget.FD_CAPTCHA].config.siteKey : self.#model.captchaSiteKey;
            }

            const isRecaptchaEnterprise = function () {
                if (self.#model.captchaProvider != null) {
                    if (self.#model.captchaProvider === RecaptchaWidget.RECAPTCHA_ENTERPRISE) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return recaptchaConfigData.properties[RecaptchaWidget.FD_CAPTCHA].config.version === "enterprise";
                }
            }

            const isScoreBasedKey = function () {
                return isRecaptchaEnterprise() && ( (self.#model.captchaDisplayMode != null && self.#model.captchaDisplayMode === "invisible") ||
                    recaptchaConfigData.properties[RecaptchaWidget.FD_CAPTCHA].config.keyType === "score");
            }

            var successCallback = function(response) {
                self.setCaptchaModel(response);

            };

            var expiredCallback = function() {
                if (isRecaptchaEnterprise()) {
                    grecaptcha.enterprise.reset(widgetId);
                } else {
                    grecaptcha.reset(widgetId);
                }
                self.setCaptchaModel("");
            };

            var onloadCallbackInternal = function() {
                widgetId = isRecaptchaEnterprise() ? grecaptcha.enterprise.render(gcontainer, gparameters)
                    : grecaptcha.render(gcontainer, gparameters);
                return widgetId;
            };
            var gparameters = {
                'sitekey': getSiteKey(),
                'size': recaptchaConfigData.properties[RecaptchaWidget.FD_CAPTCHA].config.size,
                'theme': recaptchaConfigData.properties[RecaptchaWidget.FD_CAPTCHA].config.theme || 'light',
                'type': recaptchaConfigData.properties[RecaptchaWidget.FD_CAPTCHA].config.type || 'image',
                'callback': successCallback,
                'expired-callback': expiredCallback
            };

            window.onloadRecaptchaCallback = onloadCallbackInternal;

            var runtimeLocale = this.#lang;

            var scr = document.createElement('script');
            let queryParams = isScoreBasedKey() ? "?render=" + getSiteKey() : "?onload=onloadRecaptchaCallback&render=explicit";
            queryParams += "&hl=" + runtimeLocale;
            scr.src = url + queryParams;
            scr.async = true;
            element.appendChild(scr);
        }

        setCaptchaModel = function(response) {
            this.#model.value = (response);
        }
    }
}
