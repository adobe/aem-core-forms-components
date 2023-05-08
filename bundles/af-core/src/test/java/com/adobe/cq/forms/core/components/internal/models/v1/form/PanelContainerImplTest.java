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

import org.apache.commons.lang3.reflect.FieldUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.datalayer.FormComponentData;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Panel;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.msm.api.MSMNameConstants;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@ExtendWith(AemContextExtension.class)
public class PanelContainerImplTest {
    private static final String BASE = "/form/panelcontainer";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_PANEL = CONTENT_ROOT + "/panelcontainer";
    private static final String PATH_PANEL_DATALAYER = CONTENT_ROOT + "/panelcontainer-datalayer";
    private static final String PATH_PANEL_CUSTOMIZED = CONTENT_ROOT + "/panelcontainer-customized";
    private static final String PATH_ARRAY_PANEL = CONTENT_ROOT + "/array-panelcontainer";
    private static final String PATH_RULES_PANEL = CONTENT_ROOT + "/rules-panelcontainer";
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
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL_CUSTOMIZED, Panel.class, context);
        assertEquals(FormConstants.RT_FD_FORM_PANEL_CONTAINER_V1, panel.getExportedType());
        Panel panelMock = Mockito.mock(Panel.class);
        Mockito.when(panelMock.getExportedType()).thenCallRealMethod();
        assertEquals("", panelMock.getExportedType());
    }

    @Test
    void testGetId() throws Exception {
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL_CUSTOMIZED, Panel.class, context);
        assertNotNull(panel.getId());
    }

    @Test
    void testGetName() throws Exception {
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL_CUSTOMIZED, Panel.class, context);
        assertEquals("abc", panel.getName());
    }

    @Test
    void testGetReadOnly() throws Exception {
        MockSlingHttpServletRequest request = context.request();
        request.setPathInfo("abc");
        request.setAttribute("WCMMode", "EDIT");
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL_CUSTOMIZED, Panel.class, context);
        assertEquals(true, panel.isReadOnly());
        Panel panelMock = Mockito.mock(Panel.class);
        Mockito.when(panelMock.isReadOnly()).thenCallRealMethod();
        assertEquals(null, panelMock.isReadOnly());
    }

    @Test
    void testJSONExport() throws Exception {
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL, Panel.class, context);
        Utils.testJSONExport(panel, Utils.getTestExporterJSONPath(BASE, PATH_PANEL));
    }

    @Test
    void testJSONExportForCustomized() throws Exception {
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL_CUSTOMIZED, Panel.class, context);
        Utils.testJSONExport(panel, Utils.getTestExporterJSONPath(BASE, PATH_PANEL_CUSTOMIZED));
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
    void testGetDorProperties() throws Exception {
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL_CUSTOMIZED, Panel.class, context);
        assertEquals(true, panel.getDorProperties().get("dorExclusion"));
        assertEquals(false, panel.getDorProperties().get("dorExcludeTitle"));
        assertEquals(false, panel.getDorProperties().get("dorExcludeDescription"));
        assertEquals("Following Previous", panel.getDorProperties().get("breakBeforeText"));
        assertEquals("Continue Filling Parent", panel.getDorProperties().get("breakAfterText"));
        assertEquals("None", panel.getDorProperties().get("overflowText"));
        assertEquals("columnar", panel.getDorProperties().get("dorLayoutType"));
        assertEquals("3", panel.getDorProperties().get("dorNumCols"));
    }

    @Test
    void testDataLayerProperties() throws IllegalAccessException {
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL_DATALAYER, Panel.class, context);
        FieldUtils.writeField(panel, "dataLayerEnabled", true, true);
        FormComponentData dataObject = (FormComponentData) panel.getData();
        assert (dataObject != null);
        assert (dataObject.getId()).equals("panelcontainer-0749d1d943");
        assert (dataObject.getType()).equals("core/fd/components/form/panelcontainer/v1/panelcontainer");
        assert (dataObject.getTitle()).equals("Phone Number");
        assert (dataObject.getFieldType()).equals("panel");
        assert (dataObject.getDescription()).equals("Enter your phone number");
    }

    @Test
    void testJSONExportDatalayer() throws Exception {
        Panel panel = Utils.getComponentUnderTest(PATH_PANEL_DATALAYER, Panel.class, context);
        FieldUtils.writeField(panel, "dataLayerEnabled", true, true);
        Utils.testJSONExport(panel, Utils.getTestExporterJSONPath(BASE, PATH_PANEL_DATALAYER));
    }

}
