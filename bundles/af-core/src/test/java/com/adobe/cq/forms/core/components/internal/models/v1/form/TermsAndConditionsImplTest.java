/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2023 Adobe
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
import org.junit.Assert;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.TermsAndConditions;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.msm.api.MSMNameConstants;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;

@ExtendWith(AemContextExtension.class)
public class TermsAndConditionsImplTest {

    private static final String BASE = "/form/termsandconditions";
    private static final String CONTENT_ROOT = "/content";

    private static final String PATH_TNC = CONTENT_ROOT + "/termsandconditions";

    private static final String PATH_NOWRAP_TNC = CONTENT_ROOT + "/termsandconditionsNoWrapData";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    public void setUp() {
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
        TermsAndConditions tnc = Utils.getComponentUnderTest(PATH_TNC, TermsAndConditions.class, context);
        assertEquals(FormConstants.RT_FD_FORM_TERMS_AND_CONDITIONS_V1, tnc.getExportedType());
        TermsAndConditions tncMock = Mockito.mock(TermsAndConditions.class);
        Mockito.when(tncMock.getExportedType()).thenCallRealMethod();
        assertEquals("", tncMock.getExportedType());
    }

    @Test
    public void testGetProperties() {
        TermsAndConditions tnc = Utils.getComponentUnderTest(PATH_TNC, TermsAndConditions.class, context);
        Assert.assertTrue(tnc.isShowApprovalOption());
        Assert.assertTrue(tnc.isShowAsPopup());
        Assert.assertFalse(tnc.isShowLink());
    }

    @Test
    public void testCustomFDProperty() {
        TermsAndConditions tnc = Utils.getComponentUnderTest(PATH_TNC, TermsAndConditions.class, context);
        Map<String, Object> props = tnc.getProperties();
        Assert.assertTrue(props.containsKey("fd:tnc"));
        Assert.assertTrue((Boolean) props.get("fd:tnc"));

    }

    @Test
    void testJSONExport() throws Exception {
        TermsAndConditions tnc = Utils.getComponentUnderTest(PATH_TNC, TermsAndConditions.class, context);
        Utils.testJSONExport(tnc, Utils.getTestExporterJSONPath(BASE, PATH_TNC));
    }

    @Test
    void testJSONExport_showLink() throws Exception {
        TermsAndConditions tnc = Utils.getComponentUnderTest(PATH_NOWRAP_TNC, TermsAndConditions.class, context);
        Utils.testJSONExport(tnc, Utils.getTestExporterJSONPath(BASE, PATH_NOWRAP_TNC));
    }

    @Test
    void testNoWrap() {
        TermsAndConditions tnc = Utils.getComponentUnderTest(PATH_NOWRAP_TNC, TermsAndConditions.class, context);
        Assert.assertNull(tnc.getType());
    }
}
