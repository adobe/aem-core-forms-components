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
    private ResourceResolver resourceResolver;

    private Resource resource;

    @Reference
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    private ReCaptchaConfigurationModel reCaptchaConfiguration;

    @OSGiService
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    private CloudConfigurationProvider cloudConfigurationProvider;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @JsonIgnore
    @Named("rcCloudServicePath")
    protected String cloudServicePath;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @JsonIgnore
    @Named("recaptchaSize")
    protected String size;

    private String captchaProvider;
    private CaptchaDisplayMode captchaDisplayMode;
    private String captchaSiteKey;
    private String version;
    private String keyType;

    public static final String RECAPTCHA_DEFAULT_DOMAIN = "https://www.recaptcha.net/";
    public static final String RECAPTCHA_DEFAULT_URL = RECAPTCHA_DEFAULT_DOMAIN + "recaptcha/api.js";
    public static final String RECAPTCHA_ENTERPRISE_DEFAULT_URL = RECAPTCHA_DEFAULT_DOMAIN + "recaptcha/enterprise.js";

    private static final String RECAPTCHA_SITE_KEY = "siteKey";
    private static final String RECAPTCHA_URI = "uri";
    private static final String RECAPTCHA_SIZE = "size";
    private static final String RECAPTCHA_THEME = "theme";
    private static final String RECAPTCHA_TYPE = "type";
    private static final String RECAPTCHA_VERSION = "version";
    private static final String RECAPTCHA_KEYTYPE = "keyType";
    private static final String RECAPTCHA_ENT_PROVIDER = "recaptchaEnterprise";
    private static final String RECAPTCHA_V2_PROVIDER = "recaptchaV2";
    private static final String RECAPTCHA_ENT_SCORE_KEY = "score";
    private static final String RECAPTCHA_ENT_VERSION = "enterprise";

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
    public String getProvider() {
        return "recaptcha";
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
                version = reCaptchaConfiguration.version();
                captchaProvider = getProvider() + version;
                keyType = reCaptchaConfiguration.keyType();
                if (RECAPTCHA_ENT_VERSION.equals(version)) {
                    captchaDisplayMode = RECAPTCHA_ENT_SCORE_KEY.equals(keyType) ? CaptchaDisplayMode.INVISIBLE
                        : CaptchaDisplayMode.VISIBLE;
                    captchaProvider = RECAPTCHA_ENT_PROVIDER;
                } else {
                    captchaDisplayMode = CaptchaDisplayMode.INVISIBLE.getDisplayMode().equals(getSize()) ? CaptchaDisplayMode.INVISIBLE
                        : CaptchaDisplayMode.VISIBLE;
                    captchaProvider = RECAPTCHA_V2_PROVIDER;
                }
            }
        }
    }

    @JsonIgnore
    @Override
    public Map<String, Object> getCaptchaProperties() throws GuideException {

        Map<String, Object> customCaptchaProperties = new LinkedHashMap<>();
        if (reCaptchaConfiguration == null) {
            setReCaptchaConfiguration();
        }
        customCaptchaProperties.put(RECAPTCHA_SITE_KEY, this.captchaSiteKey);
        if (StringUtils.isNotEmpty(version) && version.equals(RECAPTCHA_ENT_VERSION)) {
            customCaptchaProperties.put(RECAPTCHA_URI, RECAPTCHA_ENTERPRISE_DEFAULT_URL);
        } else {
            customCaptchaProperties.put(RECAPTCHA_URI, RECAPTCHA_DEFAULT_URL);
        }
        customCaptchaProperties.put(RECAPTCHA_SIZE, getSize());
        customCaptchaProperties.put(RECAPTCHA_THEME, "light");
        customCaptchaProperties.put(RECAPTCHA_TYPE, "image");
        customCaptchaProperties.put(RECAPTCHA_VERSION, this.version);
        customCaptchaProperties.put(RECAPTCHA_KEYTYPE, this.keyType);

        return customCaptchaProperties;

    }

    @Override
    public String getCaptchaProvider() {
        if (reCaptchaConfiguration == null) {
            setReCaptchaConfiguration();
        }
        return this.captchaProvider;
    }

    @Override
    public String getCaptchaDisplayMode() {
        if (reCaptchaConfiguration == null) {
            setReCaptchaConfiguration();
        }
        return this.captchaDisplayMode.getDisplayMode();
    }

    @Override
    public String getCaptchaSiteKey() {
        if (reCaptchaConfiguration == null) {
            setReCaptchaConfiguration();
        }
        return this.captchaSiteKey;
    }
}
