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

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.aemds.guide.service.GuideException;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Recaptcha;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Recaptcha.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_RECAPTCHA_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class RecaptchaImpl extends AbstractFieldImpl implements Recaptcha {

    @Inject
    private ResourceResolver resourceResolver;

    private Resource resource;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Named("rcCloudServicePath")
    protected String cloudServicePath;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Named("recaptchaSize")
    protected String size;

    public static final String RECAPTCHA_DEFAULT_DOMAIN = "https://www.recaptcha.net/";

    public static final String RECAPTCHA_DEFAULT_URL = RECAPTCHA_DEFAULT_DOMAIN + "recaptcha/api.js";

    private static final String RECAPTCHA_SITE_KEY = "siteKey";

    private static final String RECAPTCHA_URI = "uri";

    @Override
    @JsonIgnore
    public String getCloudServicePath() {
        return cloudServicePath;
    }

    @Override
    @JsonIgnore
    public String getSize() {
        return size;
    }

    @JsonIgnore
    public Map<String, Object> getRecaptchaProperties() throws GuideException {

        Map<String, Object> customCaptchaProperties = new LinkedHashMap<>();
        String siteKey = null;
        resource = resourceResolver.getResource(this.getPath());
        if (resource != null) {
            // todo: Add cloud configuration provider service
        }
        return customCaptchaProperties;
    }

    @Override
    public Map<String, Object> getProperties() {
        Map<String, Object> properties = super.getProperties();
        try {
            Map<String, Object> customCaptchaProperties = getRecaptchaProperties();
            if (customCaptchaProperties != null && customCaptchaProperties.size() > 0) {
                properties.put(CUSTOM_RECAPTCHA_PROPERTY_WRAPPER, getRecaptchaProperties());
            }
        } catch (GuideException e) {
            throw new RuntimeException(e);
        }
        return properties;
    }

}
