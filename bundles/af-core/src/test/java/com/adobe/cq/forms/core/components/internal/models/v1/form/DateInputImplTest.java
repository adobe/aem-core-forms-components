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
package com.adobe.cq.forms.core.components.internal.models.v1.form;

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.ConstraintType;
import com.adobe.cq.forms.core.components.models.form.DateInput;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.*;

@ExtendWith(AemContextExtension.class)
public class DateInputImplTest {

    private static final String BASE = "/form/dateinput";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_DATE_INPUT = CONTENT_ROOT + "/dateinput";
    private static final String PATH_DATE_INPUT_CUSTOMIZED = CONTENT_ROOT + "/dateinput-customized";
    private static final String PATH_DATE_INPUT_MESSAGE = CONTENT_ROOT + "/dateinput-message";
    private static final String PATH_DATE_INPUT_WITHOUT_FIELDTYPE = CONTENT_ROOT + "/dateinput-without-fieldtype";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT, DateInput.class, context);
        assertEquals(FormConstants.RT_FD_FORM_DATE_INPUT_V1, dateInput.getExportedType());
    }

    @Test
    void testFieldType() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT, DateInput.class, context);
        assertEquals(FieldType.DATE_INPUT.getValue(), dateInput.getFieldType());
    }

    @Test
    void testFieldTypeWhenNotSet() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT_WITHOUT_FIELDTYPE, DateInput.class, context);
        assertEquals(FieldType.DATE_INPUT.getValue(), dateInput.getFieldType());
    }

    @Test
    void testGetName() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT, DateInput.class, context);
        assertEquals("testdateinput", dateInput.getName());
    }

    @Test
    void testGetLabel() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT, DateInput.class, context);
        assertEquals("Test Date Input", dateInput.getLabel().getValue());
    }

    @Test
    void testGetPlaceholderDay() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals("DD", dateInput.getPlaceholderDay());
    }

    @Test
    void testGetPlaceholderDayAbsentWhenDefault() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT, DateInput.class, context);
        assertNull(dateInput.getPlaceholderDay());
    }

    @Test
    void testGetPlaceholderMonth() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals("MM", dateInput.getPlaceholderMonth());
    }

    @Test
    void testGetPlaceholderYear() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals("YYYY", dateInput.getPlaceholderYear());
    }

    @Test
    void testGetDateDisplayFormat() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals("date{D/M/YYYY}", dateInput.getDateDisplayFormat());
    }

    @Test
    void testGetDateDisplayFormatAbsentWhenDefault() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT, DateInput.class, context);
        assertNull(dateInput.getDateDisplayFormat());
    }

    @Test
    void testGetTitleDay() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals("Day", dateInput.getTitleDay());
    }

    @Test
    void testGetTitleMonth() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals("Month", dateInput.getTitleMonth());
    }

    @Test
    void testGetTitleYear() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals("Year", dateInput.getTitleYear());
    }

    @Test
    void testIsHideTitleDateDefault() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT, DateInput.class, context);
        assertFalse(dateInput.isHideTitleDate());
    }

    @Test
    void testIsHideTitleDateTrue() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT_CUSTOMIZED, DateInput.class, context);
        assertTrue(dateInput.isHideTitleDate());
    }

    @Test
    void testGetConstraintMessages() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT_MESSAGE, DateInput.class, context);
        Map<ConstraintType, String> messages = dateInput.getConstraintMessages();
        assertEquals("Date must be after 4th Feb 2022", messages.get(ConstraintType.MINIMUM));
        assertEquals("Date must be before 9th Feb 2022", messages.get(ConstraintType.MAXIMUM));
    }

    @Test
    void testGetMinimumDate() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT_CUSTOMIZED, DateInput.class, context);
        assertNotNull(dateInput.getMinimumDate());
    }

    @Test
    void testGetMaximumDate() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT_CUSTOMIZED, DateInput.class, context);
        assertNotNull(dateInput.getMaximumDate());
    }

    @Test
    void testGetMinimumDateNullWhenNotSet() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT, DateInput.class, context);
        assertNull(dateInput.getMinimumDate());
    }

    @Test
    void testGetFormat() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT, DateInput.class, context);
        assertEquals("date", dateInput.getFormat());
    }

    @Test
    void testIsVisible() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals(false, dateInput.isVisible());
    }

    @Test
    void testIsEnabled() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals(false, dateInput.isEnabled());
    }

    @Test
    void testIsReadOnly() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals(true, dateInput.isReadOnly());
    }

    @Test
    void testExclusiveDateConstraints() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT_MESSAGE, DateInput.class, context);
        assertNotNull(dateInput.getExclusiveMinimumDate());
        assertNotNull(dateInput.getExclusiveMaximumDate());
        assertNull(dateInput.getMinimumDate());
        assertNull(dateInput.getMaximumDate());
    }

    @Test
    void testJSONExport() throws Exception {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATE_INPUT, DateInput.class, context);
        Utils.testJSONExport(dateInput, Utils.getTestExporterJSONPath(BASE, PATH_DATE_INPUT));
    }
}
