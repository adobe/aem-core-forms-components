/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2024 Adobe
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

import javax.annotation.PostConstruct;

import com.adobe.cq.forms.core.components.models.form.Captcha;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * AbstractCaptchaImplV2 is an updated implementation for handling captcha field types.
 * 
 * This class represents an evolution in the captcha JSON structure where captchaProvider
 * is promoted to a top-level property, improving JSON clarity and eliminating redundancy.
 * 
 * Background:
 * Previous Implementation (AbstractCaptchaImplV1):
 * - Captcha provider information was embedded within the fd:captcha custom property
 * - This led to redundant data and a less clean JSON structure with the updated forms spec
 * 
 * Current Implementation (AbstractCaptchaImplV2):
 * - CaptchaProvider is now a first-class citizen at the root level of the JSON
 * - This change results in a cleaner and more efficient JSON structure
 * 
 * Note: AbstractCaptchaImplV1 is not deprecated yet, as it is still used by
 * recaptcha/hcaptcha v1 implementations in core components. Once these are migrated
 * to AbstractCaptchaImplV2, the V1 implementation will be deprecated.
 */
public abstract class AbstractCaptchaImplV2 extends AbstractCaptchaImpl implements Captcha {

    @Override
    @JsonProperty("captchaProvider")
    @JsonIgnore(false)
    public abstract String getProvider();

    @Override
    public String getFieldType() {
        return super.getFieldType(FieldType.CAPTCHA);
    }

    public abstract Map<String, Object> getCaptchaProperties();

    @PostConstruct
    public Map<String, Object> getProperties() {
        Map<String, Object> properties = super.getProperties();
        Map<String, Object> captchaConfig = new HashMap<>();
        Map<String, Object> captchaProperties = getCaptchaProperties();
        if (captchaProperties != null && captchaProperties.size() > 0) {
            captchaConfig.put(CAPTCHA_CONFIG, captchaProperties);
        }
        properties.put(CUSTOM_RECAPTCHA_PROPERTY_WRAPPER, captchaConfig);
        return properties;
    }

}
