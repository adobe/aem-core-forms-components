/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2023 Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
package com.adobe.cq.forms.core.components.util;

import java.util.HashMap;
import java.util.Map;

import com.adobe.aemds.guide.service.GuideException;
import com.adobe.cq.forms.core.components.models.form.Captcha;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Abstract class which can be used as base class for {@link Captcha} implementations.
 */
public abstract class AbstractCaptchaImpl extends AbstractFieldImpl implements Captcha {
    public static final String CUSTOM_RECAPTCHA_PROPERTY_WRAPPER = "fd:captcha";

    @JsonIgnore
    public abstract String getProvider();

    public abstract Map<String, Object> getCaptchaProperties();

    public Map<String, Object> getProperties() {
        Map<String, Object> properties = super.getProperties();
        Map<String, Object> captchaConfig = new HashMap<>();

        try {
            captchaConfig.put("provider", getProvider());
            if (getCaptchaProperties() != null && getCaptchaProperties().size() > 0) {
                captchaConfig.put("config", getCaptchaProperties());
            }
            properties.put(CUSTOM_RECAPTCHA_PROPERTY_WRAPPER, captchaConfig);
        } catch (GuideException e) {
            throw new RuntimeException(e);
        }
        return properties;
    }

}
