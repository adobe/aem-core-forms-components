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

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.aemds.guide.service.GuideException;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.internal.models.v1.form.HCaptchaImpl;
import com.adobe.cq.forms.core.components.models.form.HCaptcha;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { HCaptcha.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_HCAPTCHA_V2 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class HCaptchaImplV2 extends HCaptchaImpl {
    private static final Logger LOGGER = LoggerFactory.getLogger(HCaptchaImplV2.class);

    private String captchaSiteKey;

    @Override
    @JsonIgnore(false)
    public String getProvider() {
        return super.getProvider();
    }

    /**
     * Set the hCaptchaConfiguration, by fetching it from the cloud configurations.
     * Also sets the captchaSiteKey.
     */
    private void setHCaptchaConfiguration() {
        if (cloudConfigurationProvider != null) {
            try {
                resource = resourceResolver.getResource(this.getPath());
                hCaptchaConfiguration = cloudConfigurationProvider.getHCaptchaCloudConfiguration(resource);
                if (hCaptchaConfiguration != null) {
                    captchaSiteKey = hCaptchaConfiguration.getSiteKey();
                }
            } catch (GuideException e) {
                LOGGER.error(HCAPTCHA_CONFIG_FETCH_ERROR, e);
            }
        } else {
            LOGGER.error(HCAPTCHA_CONFIG_FETCH_ERROR);
        }
    }

    @PostConstruct
    @Override
    public Map<String, Object> getCaptchaProperties() throws GuideException {

        Map<String, Object> customCaptchaProperties = new LinkedHashMap<>();
        String uri = null;
        if (hCaptchaConfiguration == null) {
            setHCaptchaConfiguration();
        }
        if (hCaptchaConfiguration != null) {
            uri = hCaptchaConfiguration.getClientSideJsUrl();
        }
        customCaptchaProperties.put(CAPTCHA_URI, uri);
        customCaptchaProperties.put(CAPTCHA_SIZE, this.size);
        customCaptchaProperties.put(CAPTCHA_THEME, CAPTCHA_THEME_LIGHT);
        customCaptchaProperties.put(CAPTCHA_TYPE, CAPTCHA_TYPE_IMAGE);
        return customCaptchaProperties;
    }

    @PostConstruct
    @Override
    public String getCaptchaDisplayMode() {
        CaptchaDisplayMode captchaDisplayMode = CaptchaDisplayMode.VISIBLE;
        if (CaptchaDisplayMode.INVISIBLE.getValue().equals(this.size)) {
            captchaDisplayMode = CaptchaDisplayMode.INVISIBLE;
        }
        return captchaDisplayMode.getValue();
    }

    @PostConstruct
    @Override
    public String getCaptchaSiteKey() {
        if (hCaptchaConfiguration == null) {
            setHCaptchaConfiguration();
        }
        return this.captchaSiteKey;
    }
}
