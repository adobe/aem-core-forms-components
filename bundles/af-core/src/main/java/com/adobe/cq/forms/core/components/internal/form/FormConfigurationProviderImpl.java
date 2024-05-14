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

package com.adobe.cq.forms.core.components.internal.form;

import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.caconfig.resource.ConfigurationResourceResolver;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.forms.core.components.models.form.FormConfigurationProvider;

@Model(
    adaptables = { Resource.class },
    adapters = FormConfigurationProvider.class)
public class FormConfigurationProviderImpl implements FormConfigurationProvider {

    private static final String CUSTOM_FUNCTION_CONFIG_BUCKET_NAME = "settings/cloudconfigs";
    private static final String CUSTOM_FUNCTION_CONFIG_NAME = "edge-delivery-service-configuration";
    private static final String CUSTOM_FUNCTION_FILE_PATH = "/blocks/form/functions.js";
    private static final String HTTPS_PROTOCOL = "https://";
    private static final String EDGE_DELIVERY_DOMAIN = ".hlx.live";
    @SlingObject
    private Resource resource;

    @OSGiService
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    private ConfigurationResourceResolver configurationResourceResolver;

    @Override
    public String getCustomFunctionModuleUrl() {
        String customFunctionUrl = "";
        if (resource != null && configurationResourceResolver != null) {
            Resource configResource = configurationResourceResolver.getResource(resource, CUSTOM_FUNCTION_CONFIG_BUCKET_NAME,
                CUSTOM_FUNCTION_CONFIG_NAME);
            if (configResource != null) {
                Resource jcrResource = configResource.getChild(JcrConstants.JCR_CONTENT);
                if (jcrResource != null) {
                    ValueMap configValueMap = jcrResource.getValueMap();
                    String owner = configValueMap.getOrDefault("owner", "").toString();
                    String repo = configValueMap.getOrDefault("repo", "").toString();
                    String ref = configValueMap.getOrDefault("ref", "main").toString();
                    if (!owner.isEmpty() && !repo.isEmpty()) {
                        customFunctionUrl = HTTPS_PROTOCOL + ref + "--" + repo + "--" + owner + EDGE_DELIVERY_DOMAIN
                            + CUSTOM_FUNCTION_FILE_PATH;
                    }
                }
            }
        }
        return customFunctionUrl;
    }
}
