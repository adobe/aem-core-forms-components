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
package com.adobe.cq.forms.core.components.internal.models.v2.form;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.forms.core.components.models.form.AutoSaveConfiguration;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;

@ExtendWith(AemContextExtension.class)
public class AutoSaveConfigurationTest {

    private static final String BASE = "/form/formcontainer";
    private static final String TEST_CONTENT = BASE + "/test-content-auto-save.json";
    private static final String GUIDE_CONTAINER_ROOT = "/content/forms/af/testform/jcr:content/guideContainer";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(TEST_CONTENT, GUIDE_CONTAINER_ROOT);
        context.request().setResource(context.currentResource(GUIDE_CONTAINER_ROOT));
    }

    @Test
    void testAutoSaveConfigurationForDefaultImplementation() {
        final AutoSaveConfiguration autoSaveConfiguration = new AutoSaveConfiguration() {

        };
        assertEquals(false, autoSaveConfiguration.isEnableAutoSave());
        assertEquals(AutoSaveConfiguration.AutoSaveStrategyType.TIME, autoSaveConfiguration.getAutoSaveStrategyType());
        assertEquals((Integer) 0, autoSaveConfiguration.getAutoSaveInterval());
    }

    @Test
    void testAutoSaveConfigurationForResourceAdaptation() {

        final AutoSaveConfiguration autoSaveConfiguration = context.currentResource(GUIDE_CONTAINER_ROOT).adaptTo(
            AutoSaveConfiguration.class);
        assertEquals(true, autoSaveConfiguration.isEnableAutoSave());
        assertEquals(AutoSaveConfiguration.AutoSaveStrategyType.TIME, autoSaveConfiguration.getAutoSaveStrategyType());
        assertEquals((Integer) 2, autoSaveConfiguration.getAutoSaveInterval());
    }

    @Test
    void testAutoSaveConfigurationForRequestAdaptation() {
        final AutoSaveConfiguration autoSaveConfiguration = context.request().adaptTo(AutoSaveConfiguration.class);
        assertEquals(true, autoSaveConfiguration.isEnableAutoSave());
        assertEquals(AutoSaveConfiguration.AutoSaveStrategyType.TIME, autoSaveConfiguration.getAutoSaveStrategyType());
        assertEquals((Integer) 2, autoSaveConfiguration.getAutoSaveInterval());
    }

}
