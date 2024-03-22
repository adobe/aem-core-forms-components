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

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.caconfig.resource.ConfigurationResourceResolver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.components.models.form.FormConfigurationProvider;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.msm.api.MSMNameConstants;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;

@ExtendWith(AemContextExtension.class)
public class FormConfigurationProviderImplTest {
    private static final String BASE = "/form/formconfigprovider";

    private static final String TEST_CONTENT_CONF_JSON = "/test-content-conf.json";
    private static final String TEST_CONTENT_JSON = "/test-content.json";
    private static final String CONF_PATH = "/conf/global/settings/cloudconfigs/edge-delivery-service-configuration";
    private static final String CONTENT_ROOT = "/content";

    private static final String CUSTOM_FUNCTION_CONFIG_BUCKET_NAME = "settings/cloudconfigs";
    private static final String CUSTOM_FUNCTION_CONFIG_NAME = "edge-delivery-service-configuration";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    private ConfigurationResourceResolver configurationResourceResolverMock = Mockito.mock(ConfigurationResourceResolver.class);

    @BeforeEach
    void setUp() {
        context.load().json(BASE + TEST_CONTENT_CONF_JSON, CONF_PATH);
        context.load().json(BASE + TEST_CONTENT_JSON, CONTENT_ROOT);
        context.registerService(ConfigurationResourceResolver.class, configurationResourceResolverMock);
        context.registerService(SlingModelFilter.class, new SlingModelFilter() {

            private final Set<String> IGNORED_NODE_NAMES = new HashSet<String>() {
                {
                    add(NameConstants.NN_RESPONSIVE_CONFIG);
                    add(MSMNameConstants.NT_LIVE_SYNC_CONFIG);
                    add("cq:annotations");
                }
            };

            @Override
            public Map<String, Object> filterProperties(Map<String, Object> map) {
                return map;
            }

            @Override
            public Iterable<Resource> filterChildResources(Iterable<Resource> childResources) {
                return StreamSupport
                    .stream(childResources.spliterator(), false)
                    .filter(r -> !IGNORED_NODE_NAMES.contains(r.getName()))
                    .collect(Collectors.toList());
            }
        });
    }

    @Test
    void testGetCustomFunctionModuleUrl() {
        String path = "/content/formcontainerv2";
        FormConfigurationProvider formConfigurationProvider = getFormConfigProviderUnderTest(path);
        Mockito.when(configurationResourceResolverMock.getResource(context.currentResource(), CUSTOM_FUNCTION_CONFIG_BUCKET_NAME,
            CUSTOM_FUNCTION_CONFIG_NAME)).thenReturn(context.resourceResolver().resolve(CONF_PATH));
        assertEquals("https://main--test-repo--testOwner.hlx.live/blocks/form/functions.js", formConfigurationProvider
            .getCustomFunctionModuleUrl());
    }

    private FormConfigurationProvider getFormConfigProviderUnderTest(String resourcePath) {
        Resource resource = context.currentResource(resourcePath);
        FormConfigurationProvider formConfigurationProvider = resource.adaptTo(FormConfigurationProvider.class);
        return formConfigurationProvider;
    }
}