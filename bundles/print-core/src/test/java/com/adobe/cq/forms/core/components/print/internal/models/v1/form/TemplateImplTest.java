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
package com.adobe.cq.forms.core.components.print.internal.models.v1.form;

import java.io.InputStream;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.json.Json;
import javax.json.JsonReader;

import org.apache.commons.io.IOUtils;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.models.form.Template;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.msm.api.MSMNameConstants;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;

@ExtendWith(AemContextExtension.class)
public class TemplateImplTest {

    private static final String BASE = "/form/template";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_TEMPLATE = CONTENT_ROOT + "/template";

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
    void testJSONExport() throws Exception {
        Template template = Utils.getComponentUnderTest(PATH_TEMPLATE, Template.class, context);
        String expectedJsonResource = Utils.getTestExporterJSONPath(BASE, PATH_TEMPLATE);
        InputStream modeInputStream = Utils.getJson(template);
        JsonReader outputReader = Json.createReader(modeInputStream);
        InputStream is = Utils.class.getResourceAsStream(expectedJsonResource);
        if (is != null) {
            JsonReader expectedReader = Json.createReader(is);
            assertEquals(expectedReader.read(), outputReader.read());
        } else {
            fail("Unable to find test file " + expectedJsonResource + ".");
        }
        IOUtils.closeQuietly(is);
    }
}
