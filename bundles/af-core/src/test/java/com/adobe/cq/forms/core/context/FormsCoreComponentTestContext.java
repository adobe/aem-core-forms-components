/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe
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
package com.adobe.cq.forms.core.context;

import org.apache.sling.models.impl.ResourceTypeBasedResourcePicker;
import org.apache.sling.models.spi.ImplementationPicker;
import org.apache.sling.testing.mock.sling.ResourceResolverType;

import com.adobe.cq.wcm.core.components.testing.MockResponsiveGrid;
import io.wcm.testing.mock.aem.junit5.AemContextBuilder;

/**
 * Provides a context for unit tests.
 */
public final class FormsCoreComponentTestContext {

    public static final String TEST_CONTENT_JSON = "/test-content.json";
    public static final String TEST_CONTENT_DAM_JSON = "/test-content-dam.json";
    public static final String TEST_APPS_JSON = "/test-apps.json";

    private FormsCoreComponentTestContext() {
        // only static methods
    }

    public static io.wcm.testing.mock.aem.junit5.AemContext newAemContext() {
        return new AemContextBuilder().resourceResolverType(
            ResourceResolverType.JCR_MOCK).<io.wcm.testing.mock.aem.junit5.AemContext>afterSetUp(context -> {
                context.addModelsForClasses(MockResponsiveGrid.class);
                context.addModelsForPackage("com.adobe.cq.forms.core.components.models");
                context.registerService(ImplementationPicker.class, new ResourceTypeBasedResourcePicker());
            }).build();
    }
}
