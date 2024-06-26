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
package com.adobe.cq.forms.core.components.internal.models.v1.form;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.inject.Inject;
import javax.inject.Named;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.osgi.service.component.annotations.Reference;

import com.adobe.aemds.guide.model.ReCaptchaConfigurationModel;
import com.adobe.aemds.guide.service.CloudConfigurationProvider;
import com.adobe.aemds.guide.service.GuideException;
import com.adobe.aemds.guide.utils.GuideConstants;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Captcha;
import com.adobe.cq.forms.core.components.util.AbstractCaptchaImpl;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Captcha.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_RECAPTCHA_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class RecaptchaImpl extends AbstractCaptchaImpl implements Captcha {

    @Inject
    protected ResourceResolver resourceResolver;

    protected Resource resource;

    @Reference
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    protected ReCaptchaConfigurationModel reCaptchaConfiguration;

    @OSGiService
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    protected CloudConfigurationProvider cloudConfigurationProvider;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @JsonIgnore
    @Named("rcCloudServicePath")
    protected String cloudServicePath;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @JsonIgnore
    @Named("recaptchaSize")
    protected String size;

    public static final String RECAPTCHA_DEFAULT_DOMAIN = "https://www.recaptcha.net/";
    public static final String RECAPTCHA_DEFAULT_URL = RECAPTCHA_DEFAULT_DOMAIN + "recaptcha/api.js";
    public static final String RECAPTCHA_ENTERPRISE_DEFAULT_URL = RECAPTCHA_DEFAULT_DOMAIN + "recaptcha/enterprise.js";

    public static final String RECAPTCHA_VERSION = "version";
    public static final String RECAPTCHA_KEYTYPE = "keyType";

    @Override
    @JsonIgnore
    public String getCloudServicePath() {
        return cloudServicePath;
    }

    @JsonIgnore
    public String getSize() {
        return size;
    }

    @Override
    @JsonIgnore
    public String getProvider() {
        return "recaptcha";
    }

    @JsonIgnore
    @Override
    public Map<String, Object> getCaptchaProperties() throws GuideException {

        Map<String, Object> customCaptchaProperties = new LinkedHashMap<>();
        String siteKey = null;
        String version = null;
        String keyType = null;
        resource = resourceResolver.getResource(this.getPath());
        if (resource != null && cloudConfigurationProvider != null) {
            reCaptchaConfiguration = cloudConfigurationProvider.getRecaptchaCloudConfiguration(resource);
            if (reCaptchaConfiguration != null) {
                siteKey = reCaptchaConfiguration.siteKey();
                version = reCaptchaConfiguration.version();
                keyType = reCaptchaConfiguration.keyType();
            }
        }
        customCaptchaProperties.put(CAPTCHA_SITE_KEY, siteKey);
        if (StringUtils.isNotEmpty(version) && version.equals(GuideConstants.RECAPTCHA_ENTERPRISE_VERSION)) {
            customCaptchaProperties.put(CAPTCHA_URI, RECAPTCHA_ENTERPRISE_DEFAULT_URL);
        } else {
            customCaptchaProperties.put(CAPTCHA_URI, RECAPTCHA_DEFAULT_URL);
        }
        customCaptchaProperties.put(CAPTCHA_SIZE, getSize());
        customCaptchaProperties.put(CAPTCHA_THEME, CAPTCHA_THEME_LIGHT);
        customCaptchaProperties.put(CAPTCHA_TYPE, CAPTCHA_TYPE_IMAGE);
        customCaptchaProperties.put(RECAPTCHA_VERSION, version);
        customCaptchaProperties.put(RECAPTCHA_KEYTYPE, keyType);

        return customCaptchaProperties;

    }

}
