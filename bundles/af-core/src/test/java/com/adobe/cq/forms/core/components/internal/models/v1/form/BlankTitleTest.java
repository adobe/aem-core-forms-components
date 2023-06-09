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
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.models.form.Panel;
import com.adobe.cq.forms.core.components.util.AbstractBaseImpl;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.msm.api.MSMNameConstants;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;

@ExtendWith(AemContextExtension.class)
public class BlankTitleTest {

    private static final String BASE = "/form/blanktitle";
    private static final String CONTENT_ROOT = "/content";
    private static final String PANEL_PATH_FOR_BLANK_TITLE = CONTENT_ROOT + "/panelcontainer1";
    private static final String PANEL_PATH_FOR_NON_BLANK_TITLE = CONTENT_ROOT + "/panelcontainer2";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setup() {
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
    void testComponentsWithBlankTitle() {
        Panel panel = Utils.getComponentUnderTest(PANEL_PATH_FOR_BLANK_TITLE, Panel.class, context);
        assertEquals("\n", panel.getLabel().getValue());
        for (ComponentExporter items : panel.getItems()) {
            AbstractBaseImpl item = (AbstractBaseImpl) items;
            assertEquals("\n", item.getLabel().getValue());
        }
    }

    @Test
    void testComponentsWithNonBlankTitle() {
        Panel panel = Utils.getComponentUnderTest(PANEL_PATH_FOR_NON_BLANK_TITLE, Panel.class, context);
        assertEquals("Panel Custom Title", panel.getLabel().getValue());
        List<? extends ComponentExporter> items = panel.getItems();
        assertEquals("Check Box Group Custom Title", ((AbstractBaseImpl) items.get(0)).getLabel().getValue());
        assertEquals("Date Input Custom Title", ((AbstractBaseImpl) items.get(1)).getLabel().getValue());
        assertEquals("Dropdown Custom Title", ((AbstractBaseImpl) items.get(2)).getLabel().getValue());
        assertEquals("File Attachment Custom Title", ((AbstractBaseImpl) items.get(3)).getLabel().getValue());
        assertEquals("Number Input Custom Title", ((AbstractBaseImpl) items.get(4)).getLabel().getValue());
        assertEquals("Radio Button Custom Title", ((AbstractBaseImpl) items.get(5)).getLabel().getValue());
        assertEquals("Text Input Custom Title", ((AbstractBaseImpl) items.get(6)).getLabel().getValue());
    }
}
