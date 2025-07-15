/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2025 Adobe
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

import java.util.Map;

import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.Scribble;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.*;

@ExtendWith(AemContextExtension.class)
public class ScribbleImplTest {
    private static final String BASE = "/form/scribble";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_SCRIBBLE = CONTENT_ROOT + "/scribble";
    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + "/test_content.json", CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        Scribble scribble = getScribbleUnderTest(PATH_SCRIBBLE);
        assertEquals("core/fd/components/form/scribble/v1/scribble", scribble.getExportedType());
        Scribble scribbleMock = Mockito.mock(Scribble.class);
        Mockito.when(scribbleMock.getExportedType()).thenCallRealMethod();
        assertEquals("", scribbleMock.getExportedType());
    }

    @Test
    void testFieldType() {
        Scribble scribble = getScribbleUnderTest(PATH_SCRIBBLE);
        assertEquals(FieldType.FILE_INPUT.getValue(), scribble.getFieldType());
    }

    @Test
    void testGetValue() {
        Scribble scribble = getScribbleUnderTest(PATH_SCRIBBLE);
        assertEquals("", scribble.getValue());
    }

    @Test
    void testGetLabel() {
        Scribble scribble = getScribbleUnderTest(PATH_SCRIBBLE);
        assertEquals("Scribble", scribble.getLabel().getValue());
    }

    @Test
    void testGetProperties() {
        Scribble scribble = getScribbleUnderTest(PATH_SCRIBBLE);
        Map<String, Object> properties = scribble.getProperties();
        assertNotNull(properties);
        assertTrue(properties.containsKey("fd:viewType"));
        assertEquals("signature", properties.get("fd:viewType"));
        assertTrue(properties.containsKey("fd:dialogLabel"));
        assertEquals("Scribble", properties.get("fd:dialogLabel"));
    }

    @Test
    void testJSONExport() throws Exception {
        Scribble scribble = getScribbleUnderTest(PATH_SCRIBBLE);
        Utils.testJSONExport(scribble, BASE + "/exporter-scribble.json");
    }

    private Scribble getScribbleUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(Scribble.class);
    }
}
