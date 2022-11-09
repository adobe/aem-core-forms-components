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

package com.adobe.cq.forms.core.components.util;

import java.util.Map;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({ AemContextExtension.class, MockitoExtension.class })
public class AbstractFormComponentImplTest {

    private static final String BASE = "/form/componentswithrule";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_COMPONENT_WITH_INVALID_RULE = CONTENT_ROOT + "/textinput";
    private static final String PATH_COMPONENT_WITH_VALID_RULE = CONTENT_ROOT + "/datepicker";
    private static final String PATH_COMPONENT_WITH_NO_RULE = CONTENT_ROOT + "/numberinput";
    public final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    public void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    public void testInvalidRule() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(PATH_COMPONENT_WITH_INVALID_RULE);
        Map<String, Object> rulesProperties = abstractFormComponentImpl.getRulesProperties();
        assertNotNull(rulesProperties);
        assertEquals("invalid", rulesProperties.get("status"));
    }

    @Test
    public void testValidRule() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(PATH_COMPONENT_WITH_VALID_RULE);
        Map<String, Object> rulesProperties = abstractFormComponentImpl.getRulesProperties();
        assertNotNull(rulesProperties);
        assertEquals("valid", rulesProperties.get("status"));
    }

    @Test
    public void testNoneRule() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(PATH_COMPONENT_WITH_NO_RULE);
        Map<String, Object> rulesProperties = abstractFormComponentImpl.getRulesProperties();
        assertTrue(rulesProperties.isEmpty());
    }

    private AbstractFormComponentImpl prepareTestClass(String path) {
        Resource resource = context.resourceResolver().getResource(path);
        AbstractFormComponentImpl abstractFormComponentImpl = new AbstractFormComponentImpl();
        Utils.setInternalState(abstractFormComponentImpl, "resource", resource);
        return abstractFormComponentImpl;
    }
}
