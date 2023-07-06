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
class RecaptchaWidget {
    #widget = null
    #model = null // passed by reference
    #options = null
    #lang = 'en'

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
        element.innerHTML = '<div class="g-recaptcha"></div>';
        var gcontainer = document.getElementsByClassName("g-recaptcha")[0];
        var widgetId;
        var url = recaptchaConfigData.properties["fd:captcha"].uri;
        if (recaptchaConfigData.properties["fd:captcha"].size == "invisible") {
            gcontainer.classList.add('g-recaptcha-invisible');
        }
        if (document.getElementsByClassName("g-recaptcha-invisible").length > 0) {
            guideBridge.getFormModel().subscribe((action) => {
                if (action.type === 'preSubmitValidate') {
                    return new Promise((resolve) => {
                        this.recaptchaInvisibleValidate(successCallback, expiredCallback)
                            .then(() => resolve())
                            .catch(() => resolve());
                    });
                }
            }, 'preSubmitValidate');
        }

        var successCallback = function(response) {
            self.setCaptchaModel(response);
        };

        var expiredCallback = function() {
            grecaptcha.reset(widgetId);
            self.setCaptchaModel("");
        };

        var onloadCallbackInternal = function() {
            widgetId = grecaptcha.render(
                gcontainer,
                gparameters
            );
            return widgetId;
        };

        var gparameters = {
            'sitekey': recaptchaConfigData.properties["fd:captcha"].siteKey,
            'size': recaptchaConfigData.properties["fd:captcha"].size,
            'theme': recaptchaConfigData.properties["fd:captcha"].theme || 'light',
            'type': recaptchaConfigData.properties["fd:captcha"].type || 'image',
            'callback': successCallback,
            'expired-callback': expiredCallback
        };

        window.onloadRecaptchaCallback = onloadCallbackInternal;

        var runtimeLocale = this.#lang;

        var scr = document.createElement('script');
        scr.src = url + "?onload=onloadRecaptchaCallback&render=explicit&hl" + runtimeLocale;
        scr.async = true;
        element.appendChild(scr);
    }

    setCaptchaModel = function(response) {
        this.#model.value = (response);
    }

    recaptchaInvisibleValidate = function(successCallback, expiredCallback) {
        return grecaptcha.execute()
            .then(successCallback)
            .catch(expiredCallback);
    }

}