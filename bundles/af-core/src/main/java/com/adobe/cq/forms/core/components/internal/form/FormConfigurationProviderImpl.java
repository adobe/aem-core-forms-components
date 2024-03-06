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

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.aem.wcm.franklin.CodeBusInfo;
import com.adobe.aem.wcm.franklin.CodeBusInfoService;
import com.adobe.cq.forms.core.components.models.form.FormConfigurationProvider;

@Model(
    adaptables = { Resource.class },
    adapters = FormConfigurationProvider.class)
public class FormConfigurationProviderImpl implements FormConfigurationProvider {

    private static final String CUSTOM_FUNCTION_CONFIG_BUCKET_NAME = "settings/cloudconfigs";
    private static final String CUSTOM_FUNCTION_CONFIG_NAME = "edge-delivery-service-configuration";

    @SlingObject
    private Resource resource;

    @OSGiService
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    private CodeBusInfoService codeBusInfoService;

    @Override
    public String getCustomFunctionModuleUrl() throws UnsupportedEncodingException {
        CodeBusInfo codeBusInfo = codeBusInfoService.getCodeBusInfo(resource);
        String customFunctionUrl = "";
        if (codeBusInfo != null) {
            String owner = codeBusInfo.getOwner();
            String repo = codeBusInfo.getRepo();
            // ensures removal of html tags
            owner = URLEncoder.encode(owner, "UTF-8");
            repo = URLEncoder.encode(repo, "UTF-8");
            if (!owner.isEmpty() && !repo.isEmpty()) {
                customFunctionUrl = "https://main--" + repo + "--" + owner + ".hlx.live/blocks/form/functions.js";
            }
        }
        return customFunctionUrl;
    }
}
