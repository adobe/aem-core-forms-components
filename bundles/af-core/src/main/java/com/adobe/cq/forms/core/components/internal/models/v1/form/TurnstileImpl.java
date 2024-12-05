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

package com.adobe.cq.forms.core.components.internal.models.v1.form;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.aemds.guide.model.TurnstileConfiguration;
import com.adobe.aemds.guide.service.CloudConfigurationProvider;
import com.adobe.aemds.guide.service.GuideException;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Turnstile;
import com.adobe.cq.forms.core.components.util.AbstractCaptchaImplV2;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Turnstile.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_TURNSTILE_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class TurnstileImpl extends AbstractCaptchaImplV2 implements Turnstile {
    private static final Logger LOGGER = LoggerFactory.getLogger(TurnstileImpl.class);

    @Inject
    private ResourceResolver resourceResolver;

    private Resource resource;
    private String captchaSiteKey;

    @Reference
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    private TurnstileConfiguration turnstileConfiguration;

    @OSGiService
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    private CloudConfigurationProvider cloudConfigurationProvider;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Named("cloudServicePath")
    protected String cloudServicePath;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Named("size")
    protected String size;

    @Override
    public String getCloudServicePath() {
        return cloudServicePath;
    }

    @Override
    public String getProvider() {
        return "turnstile";
    }

    @Override
    public String getSize() {
        return size;
    }

    /**
     * Set the turnstileConfiguration, by fetching it from the cloud configurations.
     * Also sets the captchaSiteKey.
     */
    private void setTurnstileConfiguration() {
        LOGGER.debug("[AF] [Captcha] [TURNSTILE] Fetching cloud configuration for turnstile.");
        if (cloudConfigurationProvider != null) {
            try {
                resource = resourceResolver.getResource(this.getPath());
                turnstileConfiguration = cloudConfigurationProvider.getTurnstileCloudConfiguration(resource);
                if (turnstileConfiguration != null) {
                    captchaSiteKey = turnstileConfiguration.getSiteKey();
                } else {
                    LOGGER.debug("[AF] [Captcha] [TURNSTILE] Cloud configuration for turnstile is not available for " + this.getPath());
                }
            } catch (GuideException e) {
                LOGGER.error(
                    "[AF] [Captcha] [TURNSTILE] Error while fetching cloud configuration, upgrade to latest release to use turnstile.", e);
            }
        } else {
            LOGGER.error(
                "[AF] [Captcha] [TURNSTILE] Error while fetching cloud configuration, upgrade to latest release to use turnstile.");
        }
    }

    @PostConstruct
    @Override
    public Map<String, Object> getCaptchaProperties() {
        Map<String, Object> customCaptchaProperties = new LinkedHashMap<>();
        String siteKey = null, uri = null, widgetType = null;
        if (turnstileConfiguration == null) {
            setTurnstileConfiguration();
        }
        if (turnstileConfiguration != null) {
            customCaptchaProperties.put(CAPTCHA_URI, turnstileConfiguration.getClientSideJsUrl());
            customCaptchaProperties.put(CAPTCHA_WIDGET_TYPE, turnstileConfiguration.getWidgetType());
        }
        customCaptchaProperties.put(CAPTCHA_SIZE, getSize());
        customCaptchaProperties.put(CAPTCHA_THEME, CAPTCHA_THEME_LIGHT);
        return customCaptchaProperties;
    }

    @PostConstruct
    @Override
    public String getCaptchaDisplayMode() {
        CaptchaDisplayMode captchaDisplayMode = CaptchaDisplayMode.VISIBLE;
        if (turnstileConfiguration == null) {
            setTurnstileConfiguration();
        }
        if (turnstileConfiguration != null && CaptchaDisplayMode.INVISIBLE.getValue().equals(turnstileConfiguration.getWidgetType())) {
            captchaDisplayMode = CaptchaDisplayMode.INVISIBLE;
        }
        return captchaDisplayMode.getValue();
    }

    @PostConstruct
    @Override
    public String getCaptchaSiteKey() {
        if (turnstileConfiguration == null) {
            setTurnstileConfiguration();
        }
        return this.captchaSiteKey;
    }
}
