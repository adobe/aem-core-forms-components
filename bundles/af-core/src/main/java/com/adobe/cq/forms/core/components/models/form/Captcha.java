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
package com.adobe.cq.forms.core.components.models.form;

import java.util.Map;

import org.osgi.annotation.versioning.ConsumerType;

import com.adobe.aemds.guide.service.GuideException;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Defines a base interface to be extended by all the different types of captcha.
 *
 * @since com.adobe.cq.forms.core.components.models.form 2.0.0
 */
@ConsumerType
public interface Captcha extends Field {

    /**
     * Defines the display mode for captcha.
     * Possible values: {@code visible}, {@code invisible}
     *
     * @since com.adobe.cq.forms.core.components.models.form 5.4.4
     */
    enum CaptchaDisplayMode {
        VISIBLE("visible"),
        INVISIBLE("invisible");

        private String displayMode;

        CaptchaDisplayMode(String displayMode) {
            this.displayMode = displayMode;
        }

        /**
         * Returns the string value of this enum constant.
         *
         * @return the string value of this enum constant
         * @since com.adobe.cq.forms.core.components.models.form 5.4.4
         */
        public String getValue() {
            return displayMode;
        }
    }

    @JsonIgnore
    default String getCloudServicePath() {
        return null;
    }

    @JsonProperty("captchaProvider")
    String getProvider();

    @JsonIgnore
    Map<String, Object> getCaptchaProperties() throws GuideException;

    /**
     * Returns the display mode of the captcha component.
     *
     * @return the string value of the one of the {@link CaptchaDisplayMode} enum
     * @since com.adobe.cq.forms.core.components.models.form 5.4.4
     */
    default String getCaptchaDisplayMode() {
        return null;
    }

    /**
     * Returns the site key of the captcha component.
     *
     * @return the site key
     * @since com.adobe.cq.forms.core.components.models.form 5.4.4
     */
    default String getCaptchaSiteKey() {
        return null;
    }
}
