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
import com.adobe.cq.forms.core.components.models.form.Recaptcha;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;

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

    @Reference
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    private ReCaptchaConfigurationModel reCaptchaConfiguration;

    @OSGiService
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    private CloudConfigurationProvider cloudConfigurationProvider;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "rcCloudServicePath")
    protected String rcCloudServicePath;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "recaptchaSize")
    protected String recaptchaSize;

    public static final String RECAPTCHA_DEFAULT_DOMAIN = "https://www.recaptcha.net/";

    public static final String RECAPTCHA_DEFAULT_URL = RECAPTCHA_DEFAULT_DOMAIN + "recaptcha/api.js";

    @Override
    public String getrcCloudServicePath() {
        return rcCloudServicePath;
    }

    @Override
    public String getRecaptchaSize() {
        return recaptchaSize;
    }

    @Override
    public Map<String, Object> getRecaptchaProperties() throws GuideException {

        Map<String, Object> customCaptchaProperties = new LinkedHashMap<>();
        String siteKey = null;
        resource = resourceResolver.getResource(this.getPath());
        if (resource != null) {
            reCaptchaConfiguration = cloudConfigurationProvider.getRecaptchaCloudConfiguration(resource);
            if(reCaptchaConfiguration != null) {
                siteKey = reCaptchaConfiguration.siteKey();
            }
        }
        customCaptchaProperties.put("siteKey", siteKey);
        customCaptchaProperties.put("uri", RECAPTCHA_DEFAULT_URL);
        return customCaptchaProperties;
    }

}
