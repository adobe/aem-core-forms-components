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

import org.apache.commons.lang3.reflect.FieldUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.datalayer.FormComponentData;
import com.adobe.cq.forms.core.components.models.form.DateTime;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

@ExtendWith(AemContextExtension.class)
public class DateTimeImplTest {

    private static final String BASE = "/form/datetime";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_DATETIME_DATALAYER = CONTENT_ROOT + "/datetime-datalayer";
    private static final String PATH_DATETIME_CUSTOMIZED = CONTENT_ROOT + "/datetime-customized";
    private static final String PATH_NUMBER_DATETIME_EXCLUSIVE = CONTENT_ROOT + "/number-datetime-exclusive";
    private static final String PATH_NUMBER_DATETIME_INPUT = CONTENT_ROOT + "/number-datetime";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testFieldType() {
        DateTime dateTime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals(FieldType.DATETIME.getValue(), dateTime.getFieldType());
    }

    @Test
    void testGetLabel() {
        DateTime dateTime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals("pwd", dateTime.getLabel().getValue());
    }

    @Test
    void testPlaceholder() {
        DateTime dateTime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals("Enter valid date & time", dateTime.getPlaceHolder());
    }

    @Test
    void testGetName() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals("datetime", datetime.getName());

    }

    @Test
    void testDorProperties() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals(true, datetime.getDorProperties().get("dorExclusion"));
        assertEquals("4", datetime.getDorProperties().get("dorColspan"));
        assertEquals("Text1", datetime.getDorProperties().get("dorBindRef"));

    }

    @Test
    void testGetDescription() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals("datetime field", datetime.getDescription());
    }

    @Test
    void testGetRequired() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals(true, datetime.isRequired());
    }

    @Test
    void testGetPattern() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals("/^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/", datetime.getPattern());

    }

    @Test
    void testIsEnabled() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals(true, datetime.isEnabled());
    }

    @Test
    void testIsEnabledForCustomized() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals(true, datetime.isEnabled());
    }

    @Test
    void testIsReadOnly() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals(false, datetime.isReadOnly());
    }

    @Test
    void testIsReadOnlyForCustomized() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals(false, datetime.isReadOnly());
    }

    @Test
    void testMinLength() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals(5, datetime.getMinLength().intValue());
    }

    @Test
    void testMaxLength() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals(10, datetime.getMaxLength().intValue());
    }

    @Test
    void testGetExclusiveMinimum() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_NUMBER_DATETIME_EXCLUSIVE, DateTime.class, context);
        assertNull(datetime.getMinimum());
        assertEquals(8L, datetime.getExclusiveMinimum().longValue());
    }

    @Test
    void testGetExclusiveMaximum() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_NUMBER_DATETIME_EXCLUSIVE, DateTime.class, context);
        assertNull(datetime.getMaximum());
        assertEquals(16L, datetime.getExclusiveMaximum().longValue());
    }

    @Test
    void testGetMinimum() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_NUMBER_DATETIME_INPUT, DateTime.class, context);
        assertEquals(8, datetime.getMinimum().intValue());
    }

    @Test
    void testGetMaximum() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_NUMBER_DATETIME_INPUT, DateTime.class, context);
        assertEquals(16, datetime.getMaximum().intValue());
    }

    @Test
    void testGetDisplayFormat() throws Exception {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals("datetime", datetime.getFormat());
    }

    @Test
    void testDataLayerProperties() throws IllegalAccessException {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_DATALAYER, DateTime.class, context);
        FieldUtils.writeField(datetime, "dataLayerEnabled", true, true);
        FormComponentData dataObject = (FormComponentData) datetime.getData();
        assert (dataObject != null);
        assert (dataObject.getId()).equals("datetime-1c7bc238a6");
        assert (dataObject.getType()).equals("core/fd/components/form/datetime/v1/datetime");
        assert (dataObject.getTitle()).equals("Full Name");
        assert (dataObject.getFieldType()).equals("datetime");
        assert (dataObject.getDescription()).equals("Enter Full Name");
    }
}
