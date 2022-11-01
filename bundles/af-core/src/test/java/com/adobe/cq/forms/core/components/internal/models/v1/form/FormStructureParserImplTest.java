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

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.components.models.form.*;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.msm.api.MSMNameConstants;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.*;

@ExtendWith(AemContextExtension.class)
public class FormStructureParserImplTest {
    private static final String BASE = "/form/formstructparser";
    private static final String CONTENT_ROOT = "/content/myTestPage";
    private static final String JCR_CONTENT_PATH = CONTENT_ROOT + "/jcr:content";

    private static final String FORM_CONTAINER_PATH = JCR_CONTENT_PATH + "/formcontainerv2";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
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
    void testFormContainerPath() {
        String path = FORM_CONTAINER_PATH + "/datepicker";
        FormStructureParser formStructureParser = getFormStructureParserUnderTest(path);
        assertEquals(FORM_CONTAINER_PATH, formStructureParser.getFormContainerPath());
    }

    @Test
    void testFormContainerPathInsideContainers() {
        String path = FORM_CONTAINER_PATH + "/container1";
        FormStructureParser formStructureParser = getFormStructureParserUnderTest(path);
        assertEquals(FORM_CONTAINER_PATH, formStructureParser.getFormContainerPath());

        formStructureParser = getFormStructureParserUnderTest(path + "/datepicker1");
        assertEquals(FORM_CONTAINER_PATH, formStructureParser.getFormContainerPath());

        formStructureParser = getFormStructureParserUnderTest(path + "/container2");
        assertEquals(FORM_CONTAINER_PATH, formStructureParser.getFormContainerPath());

        formStructureParser = getFormStructureParserUnderTest(path + "/container2/text");
        assertEquals(FORM_CONTAINER_PATH, formStructureParser.getFormContainerPath());
    }

    @Test
    void testFormContainerPathForPathOutsideFormContainer() {
        String path = JCR_CONTENT_PATH + "/container3";
        FormStructureParser formStructureParser = getFormStructureParserUnderTest(path);
        assertNull(formStructureParser.getFormContainerPath());

        formStructureParser = getFormStructureParserUnderTest(path + "/text1");
        assertNull(formStructureParser.getFormContainerPath());
    }

    @Test
    void testGetClientLibRef() {
        String path = CONTENT_ROOT;
        FormStructureParser formStructureParser = getFormStructureParserUnderTest(path);
        assertEquals("abc", formStructureParser.getClientLibRefFromFormContainer());

        path = FORM_CONTAINER_PATH + "/container1";
        formStructureParser = getFormStructureParserUnderTest(path);
        assertNull(formStructureParser.getClientLibRefFromFormContainer());
    }

    private FormStructureParser getFormStructureParserUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.getResource().adaptTo(FormStructureParser.class);
    }
}
