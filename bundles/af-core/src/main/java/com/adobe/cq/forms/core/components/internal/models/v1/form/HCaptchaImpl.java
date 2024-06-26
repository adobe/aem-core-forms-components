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

import com.adobe.aemds.guide.model.HCaptchaConfiguration;
import com.adobe.aemds.guide.service.CloudConfigurationProvider;
import com.adobe.aemds.guide.service.GuideException;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.HCaptcha;
import com.adobe.cq.forms.core.components.util.AbstractCaptchaImpl;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { HCaptcha.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_HCAPTCHA_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class HCaptchaImpl extends AbstractCaptchaImpl implements HCaptcha {

    private static final Logger LOGGER = LoggerFactory.getLogger(HCaptchaImpl.class);
    protected static final String HCAPTCHA_CONFIG_FETCH_ERROR = "[AF] [CAPTCHA] [HCAPTCHA] Error while fetching cloud configuration, upgrade to latest release to use hCaptcha.";

    @Inject
    protected ResourceResolver resourceResolver;

    protected Resource resource;

    @Reference
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    protected HCaptchaConfiguration hCaptchaConfiguration;

    @OSGiService
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    protected CloudConfigurationProvider cloudConfigurationProvider;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @JsonIgnore
    @Named("cloudServicePath")
    protected String cloudServicePath;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @JsonIgnore
    @Named("size")
    protected String size;

    @Override
    public String getCloudServicePath() {
        return cloudServicePath;
    }

    @Override
    @JsonIgnore
    public String getProvider() {
        return "hcaptcha";
    }

    @Override
    public Map<String, Object> getCaptchaProperties() throws GuideException {

        Map<String, Object> customCaptchaProperties = new LinkedHashMap<>();
        String siteKey = null, uri = null;
        resource = resourceResolver.getResource(this.getPath());
        if (cloudConfigurationProvider == null) {
            LOGGER.info(HCAPTCHA_CONFIG_FETCH_ERROR);
        }
        try {
            if (resource != null && cloudConfigurationProvider != null) {
                hCaptchaConfiguration = cloudConfigurationProvider.getHCaptchaCloudConfiguration(resource);
                if (hCaptchaConfiguration != null) {
                    siteKey = hCaptchaConfiguration.getSiteKey();
                    uri = hCaptchaConfiguration.getClientSideJsUrl();
                }
            }
        } catch (GuideException e) {
            LOGGER.error(HCAPTCHA_CONFIG_FETCH_ERROR, e);
        }
        customCaptchaProperties.put(CAPTCHA_SITE_KEY, siteKey);
        customCaptchaProperties.put(CAPTCHA_URI, uri);
        customCaptchaProperties.put(CAPTCHA_SIZE, this.size);
        customCaptchaProperties.put(CAPTCHA_THEME, CAPTCHA_THEME_LIGHT);
        customCaptchaProperties.put(CAPTCHA_TYPE, CAPTCHA_TYPE_IMAGE);

        return customCaptchaProperties;

    }

}
