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
package com.adobe.cq.forms.core.components.internal.models.v1.form;

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.SummaryStep;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
public class SummaryStepImplTest {

    private static final String TEST_BASE = "/form/summarystep";
    private static final String APPS_ROOT = "/apps";
    private static final String PATH_SUMMARY_STEP = APPS_ROOT + "/summarystep";
    private static final String PATH_SUMMARY_STEP_DEFAULTS = APPS_ROOT + "/summarystep-defaults";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(TEST_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, APPS_ROOT);
    }

    @Test
    void testGetFieldType() {
        SummaryStep summaryStep = Utils.getComponentUnderTest(PATH_SUMMARY_STEP, SummaryStepImpl.class, context);
        assertEquals(FieldType.PLAIN_TEXT.getValue(), summaryStep.getFieldType());
    }

    @Test
    void testGetFieldTypeOnNewInstance() {
        SummaryStep summaryStep = new SummaryStepImpl();
        assertEquals(FieldType.PLAIN_TEXT.getValue(), summaryStep.getFieldType());
    }

    @Test
    void testGetDisplayMsg() {
        SummaryStep summaryStep = Utils.getComponentUnderTest(PATH_SUMMARY_STEP, SummaryStepImpl.class, context);
        assertEquals("<p>Thank you for submitting the form.</p>", summaryStep.getDisplayMsg());
    }

    @Test
    void testGetDisplayMsgDefault() {
        SummaryStep summaryStep = Utils.getComponentUnderTest(PATH_SUMMARY_STEP_DEFAULTS, SummaryStepImpl.class, context);
        assertNull(summaryStep.getDisplayMsg());
    }

    @Test
    void testIsAutoSubmit() {
        SummaryStep summaryStep = Utils.getComponentUnderTest(PATH_SUMMARY_STEP, SummaryStepImpl.class, context);
        assertTrue(summaryStep.isAutoSubmit());
    }

    @Test
    void testIsAutoSubmitDefault() {
        SummaryStep summaryStep = Utils.getComponentUnderTest(PATH_SUMMARY_STEP_DEFAULTS, SummaryStepImpl.class, context);
        assertFalse(summaryStep.isAutoSubmit());
    }

    @Test
    void testGetProperties() {
        SummaryStep summaryStep = Utils.getComponentUnderTest(PATH_SUMMARY_STEP, SummaryStepImpl.class, context);
        Map<String, Object> properties = summaryStep.getProperties();
        assertNotNull(properties);
        assertEquals("<p>Thank you for submitting the form.</p>", properties.get("fd:displayMsg"));
        assertEquals(true, properties.get("fd:autoSubmit"));
        assertEquals(APPS_ROOT + "/summarystep", properties.get("fd:path"));
    }

    @Test
    void testGetPropertiesDefaults() {
        SummaryStep summaryStep = Utils.getComponentUnderTest(PATH_SUMMARY_STEP_DEFAULTS, SummaryStepImpl.class, context);
        Map<String, Object> properties = summaryStep.getProperties();
        assertNotNull(properties);
        assertFalse(properties.containsKey("fd:displayMsg"));
        assertEquals(false, properties.get("fd:autoSubmit"));
    }

    @Test
    void testGetExportedType() {
        SummaryStep summaryStep = Utils.getComponentUnderTest(PATH_SUMMARY_STEP, SummaryStepImpl.class, context);
        assertEquals("core/fd/components/form/summarystep/v1/summarystep", summaryStep.getExportedType());
    }
}
