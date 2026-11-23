/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2026 Adobe
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

import java.util.Map;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceWrapper;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotSame;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(AemContextExtension.class)
public class FragmentOccurrenceTest {

    private static final String FIELD = "/content/fragment/jcr:content/guideContainer/textinput";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    private Resource field;

    @BeforeEach
    void setUp() {
        field = context.create().resource(FIELD, "sling:resourceType", "core/fd/components/form/textinput/v1/textinput",
            "name", "field");
    }

    @AfterEach
    void tearDown() {
        System.clearProperty(FeatureToggleConstants.FT_LEGACY_COMPONENT_ID);
    }

    @Test
    void testWrapKeepsPhysicalResource() {
        Resource wrapped = FragmentOccurrence.wrap(field, "/content/form/fragment");
        assertNotSame(field, wrapped);
        assertEquals(FIELD, wrapped.getPath());
        assertEquals("textinput", wrapped.getName());
        assertEquals(field.getResourceType(), wrapped.getResourceType());
        assertEquals("field", wrapped.getValueMap().get("name", String.class));
        assertSame(field.getResourceResolver(), wrapped.getResourceResolver());
        assertEquals("/content/form/fragment", FragmentOccurrence.getOccurrencePath(wrapped, null));
    }

    @Test
    void testWrapWithoutOccurrence() {
        assertSame(field, FragmentOccurrence.wrap(field, null));
        assertSame(field, FragmentOccurrence.wrap(field, ""));
        assertEquals("", FragmentOccurrence.getOccurrencePath(field, null));
        assertEquals("", FragmentOccurrence.getOccurrencePath(null, null));
    }

    @Test
    void testOccurrenceFoundThroughOtherWrappers() {
        Resource wrapped = new ResourceWrapper(FragmentOccurrence.wrap(field, "/content/form/fragment"));
        assertEquals("/content/form/fragment", FragmentOccurrence.getOccurrencePath(wrapped, null));
        assertEquals("", FragmentOccurrence.getOccurrencePath(new ResourceWrapper(field), null));
    }

    @Test
    void testOccurrenceFromRequest() {
        MockSlingHttpServletRequest request = context.request();
        request.setAttribute(FragmentOccurrence.REQ_ATTR_OCCURRENCE_PATH, "/content/form/fragment");
        assertEquals("/content/form/fragment", FragmentOccurrence.getOccurrencePath(field, request));
        // the occurrence carried by the resource takes precedence
        Resource wrapped = FragmentOccurrence.wrap(field, "/content/other/fragment");
        assertEquals("/content/other/fragment", FragmentOccurrence.getOccurrencePath(wrapped, request));
        request.setAttribute(FragmentOccurrence.REQ_ATTR_OCCURRENCE_PATH, Boolean.TRUE);
        assertEquals("", FragmentOccurrence.getOccurrencePath(field, request));
    }

    @Test
    void testIncludeAttributes() {
        Map<String, Object> attributes = FragmentOccurrence.getIncludeAttributes("/content/form/fragment");
        assertEquals(1, attributes.size());
        assertEquals("/content/form/fragment", attributes.get(FragmentOccurrence.REQ_ATTR_OCCURRENCE_PATH));
        assertTrue(FragmentOccurrence.getIncludeAttributes(null).isEmpty());
        assertTrue(FragmentOccurrence.getIncludeAttributes("").isEmpty());
    }

    @Test
    void testToggle() {
        assertTrue(FragmentOccurrence.isEnabled());
        System.setProperty(FeatureToggleConstants.FT_LEGACY_COMPONENT_ID, "true");
        assertFalse(FragmentOccurrence.isEnabled());
    }
}
