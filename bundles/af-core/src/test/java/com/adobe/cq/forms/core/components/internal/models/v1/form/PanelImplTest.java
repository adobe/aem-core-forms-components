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

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.Panel;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.msm.api.MSMNameConstants;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(AemContextExtension.class)
public class PanelImplTest {
    private static final String BASE = "/form/panel";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_PANEL = CONTENT_ROOT + "/panel";
    private static final String PATH_ARRAY_PANEL = CONTENT_ROOT + "/array-panel";
    private static final String PATH_RULES_PANEL = CONTENT_ROOT + "/rules-panel";
    private static final String PATH_BOUND_PANEL = CONTENT_ROOT + "/bound-panel";
    private static final String PATH_PANEL_WITHOUT_FIELDTYPE = CONTENT_ROOT + "/panel-without-fieldtype";
    private static final String PATH_PANEL_WITH_FIELDSET = CONTENT_ROOT + "/panel-with-fieldset";
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
    void testExportedType() throws Exception {
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL, Panel.class, context);
        assertEquals(FormConstants.RT_FD_FORM_PANEL_V1, panel.getExportedType());
        Panel panelMock = Mockito.mock(Panel.class);
        Mockito.when(panelMock.getExportedType()).thenCallRealMethod();
        assertEquals("", panelMock.getExportedType());
    }

    @Test
    void testGetId() throws Exception {
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL, Panel.class, context);
        assertNotNull(panel.getId());
    }

    @Test
    void testGetRoleAttribute() throws Exception {
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL, Panel.class, context);
        assertEquals(null, panel.getRoleAttribute());
    }

    @Test
    void testGetName() throws Exception {
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL, Panel.class, context);
        ;
        assertEquals("abc", panel.getName());
    }

    @Test
    void testJSONExport() throws Exception {
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL, Panel.class, context);
        Utils.testJSONExport(panel, Utils.getTestExporterJSONPath(BASE, PATH_PANEL));
    }

    @Test
    void testArrayPanelJSONExport() throws Exception {
        Panel panel = Utils.getComponentUnderTest(PATH_ARRAY_PANEL, Panel.class, context);
        Utils.testJSONExport(panel, Utils.getTestExporterJSONPath(BASE, PATH_ARRAY_PANEL));
    }

    @Test
    void testRulesPanelJSONExport() throws Exception {
        Panel panel = Utils.getComponentUnderTest(PATH_RULES_PANEL, Panel.class, context);
        Utils.testJSONExport(panel, Utils.getTestExporterJSONPath(BASE, PATH_RULES_PANEL));
    }

    @Test
    void testBoundPanelJSONExport() throws Exception {
        Panel panel = Utils.getComponentUnderTest(PATH_BOUND_PANEL, Panel.class, context);
        Utils.testJSONExport(panel, Utils.getTestExporterJSONPath(BASE, PATH_BOUND_PANEL));
    }

    @Test
    void testNoFieldType() {
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL_WITHOUT_FIELDTYPE, Panel.class, context);
        assertEquals(FieldType.PANEL.getValue(), panel.getFieldType());
    }

    @Test
    void testDorContainer() {
        Panel mockPanel = Mockito.mock(PanelImpl.class);
        Mockito.when(mockPanel.getDorContainer()).thenReturn(new HashMap<>());
        Mockito.when(mockPanel.getDorProperties()).thenCallRealMethod();
        Map<String, Object> dorProperties = mockPanel.getDorProperties();
        assertTrue(dorProperties.containsKey(PanelImpl.CUSTOM_DOR_CONTAINER_WRAPPER));
    }

    @Test
    void testUseFieldsetMethod() throws Exception {
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL_WITH_FIELDSET, Panel.class, context);
        assertEquals(true, panel.useFieldset());
    }

    @Test
    void testUseFieldsetInProperties() throws Exception {
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL_WITH_FIELDSET, Panel.class, context);
        Map<String, Object> properties = panel.getProperties();
        assertEquals(true, properties.get("fd:useFieldset"));
    }

    @Test
    void testPanelWithFieldsetJSONExport() throws Exception {
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL_WITH_FIELDSET, Panel.class, context);
        Utils.testJSONExport(panel, Utils.getTestExporterJSONPath(BASE, PATH_PANEL_WITH_FIELDSET));
    }
}
