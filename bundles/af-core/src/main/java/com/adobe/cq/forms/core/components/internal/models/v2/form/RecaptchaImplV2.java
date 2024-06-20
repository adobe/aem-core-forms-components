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

package com.adobe.cq.forms.core.components.internal.models.v2.form;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;

import com.adobe.aemds.guide.service.GuideException;
import com.adobe.aemds.guide.utils.GuideConstants;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.internal.models.v1.form.RecaptchaImpl;
import com.adobe.cq.forms.core.components.models.form.Captcha;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Captcha.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_RECAPTCHA_V2 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class RecaptchaImplV2 extends RecaptchaImpl {
    public static final String RECAPTCHA_ENT_PROVIDER = "recaptchaEnterprise";
    public static final String RECAPTCHA_V2_PROVIDER = "recaptchaV2";

    private String captchaProvider;
    private CaptchaDisplayMode captchaDisplayMode;
    private String captchaSiteKey;

    @PostConstruct
    @Override
    @JsonIgnore(false)
    public String getProvider() {
        if (reCaptchaConfiguration == null) {
            setReCaptchaConfiguration();
        }
        return this.captchaProvider;
    }

    /**
     * Set the reCaptchaConfiguration, by fetching it from the cloud configurations.
     * Also sets the captchaSiteKey, version, keyType, captchaProvider and captchaDisplayMode.
     */
    private void setReCaptchaConfiguration() {
        resource = resourceResolver.getResource(this.getPath());
        if (resource != null && cloudConfigurationProvider != null) {
            reCaptchaConfiguration = cloudConfigurationProvider.getRecaptchaCloudConfiguration(resource);
            if (reCaptchaConfiguration != null) {
                captchaSiteKey = reCaptchaConfiguration.siteKey();
                String version = reCaptchaConfiguration.version();
                String keyType = reCaptchaConfiguration.keyType();
                if (GuideConstants.RECAPTCHA_ENTERPRISE_VERSION.equals(version)) {
                    captchaDisplayMode = GuideConstants.RECAPTCHA_SCORE_KEY.equals(keyType) ? CaptchaDisplayMode.INVISIBLE
                        : CaptchaDisplayMode.VISIBLE;
                    captchaProvider = RECAPTCHA_ENT_PROVIDER;
                } else {
                    captchaDisplayMode = CaptchaDisplayMode.INVISIBLE.getValue().equals(getSize()) ? CaptchaDisplayMode.INVISIBLE
                        : CaptchaDisplayMode.VISIBLE;
                    captchaProvider = RECAPTCHA_V2_PROVIDER;
                }
            }
        }
    }

    @PostConstruct
    @JsonIgnore
    @Override
    public Map<String, Object> getCaptchaProperties() throws GuideException {

        Map<String, Object> customCaptchaProperties = new LinkedHashMap<>();
        if (reCaptchaConfiguration == null) {
            setReCaptchaConfiguration();
        }
        if (StringUtils.isNotEmpty(captchaProvider) && RECAPTCHA_ENT_PROVIDER.equals(captchaProvider)) {
            customCaptchaProperties.put(CAPTCHA_URI, RECAPTCHA_ENTERPRISE_DEFAULT_URL);
        } else {
            customCaptchaProperties.put(CAPTCHA_URI, RECAPTCHA_DEFAULT_URL);
        }
        customCaptchaProperties.put(CAPTCHA_SIZE, this.getSize());
        customCaptchaProperties.put(CAPTCHA_THEME, CAPTCHA_THEME_LIGHT);
        customCaptchaProperties.put(CAPTCHA_TYPE, CAPTCHA_TYPE_IMAGE);

        return customCaptchaProperties;

    }

    @PostConstruct
    @Override
    public String getCaptchaDisplayMode() {
        if (reCaptchaConfiguration == null) {
            setReCaptchaConfiguration();
        }
        return this.captchaDisplayMode.getValue();
    }

    @PostConstruct
    @Override
    public String getCaptchaSiteKey() {
        if (reCaptchaConfiguration == null) {
            setReCaptchaConfiguration();
        }
        return this.captchaSiteKey;
    }
}
