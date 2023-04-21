/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2022 Adobe
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

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.osgi.service.component.annotations.Reference;

import com.adobe.aemds.guide.model.ReCaptchaConfigurationModel;
import com.adobe.aemds.guide.service.CloudConfigurationProvider;
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

    @Reference
    private ReCaptchaConfigurationModel reCaptchaConfiguration;

    @OSGiService
    private CloudConfigurationProvider cloudConfigurationProvider;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "rcCloudServicePath")
    protected String rcCloudServicePath;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "rcSize")
    protected String rcSize;

    @Override
    public String getrcCloudServicePath() {
        return rcCloudServicePath;
    }

    @Override
    public String getrcSize() {
        return rcSize;
    }

    @Override
    public Map<String, Object> getRecaptchaProperties() {

        Map<String, Object> customCaptchaProperties = new LinkedHashMap<>();
        String rcSiteKey = null;

        String confPath = (String) this.getCurrentPage().getProperties().get(FormConstants.CONF_REF);
        reCaptchaConfiguration = cloudConfigurationProvider.getConfiguration(rcCloudServicePath, confPath);
        rcSiteKey = reCaptchaConfiguration.siteKey();

        customCaptchaProperties.put("siteKey", rcSiteKey);
        customCaptchaProperties.put("uri", RECAPTCHA_DEFAULT_URL);
        return customCaptchaProperties;

    }

}
