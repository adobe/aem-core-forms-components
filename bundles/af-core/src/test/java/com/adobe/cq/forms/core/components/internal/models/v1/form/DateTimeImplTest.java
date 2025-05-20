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

@ExtendWith(AemContextExtension.class)
public class DateTimeImplTest {

    private static final String BASE = "/form/datetime";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_DATETIME_DATALAYER = CONTENT_ROOT + "/datetime-datalayer";
    private static final String PATH_DATETIME_CUSTOMIZED = CONTENT_ROOT + "/datetime-customized";
    private static final String PATH_DATETIME = CONTENT_ROOT + "/datetime";
    private static final String PATH_DATETIME_MESSAGE = CONTENT_ROOT + "/datetime-message";
    private static final String PATH_DATETIME_BACKWARD_COMPATIBLE = CONTENT_ROOT + "/datetime-backwardcompatible";
    private static final String PATH_DATETIME_WITHOUT_FIELDTYPE = CONTENT_ROOT + "/datetime-without-fieldtype";


    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testFieldType() {
        DateTime dateTime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals(FieldType.DATETIME_INPUT.getValue(), dateTime.getFieldType());
    }

    @Test
    void testGetLabel() {
        DateTime dateTime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals("def", dateTime.getLabel().getValue());
    }

    @Test
    void testGetName() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals("abc", datetime.getName());

    }

    @Test
    void testDorProperties() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals(false, datetime.getDorProperties().get("dorExclusion"));
        assertEquals(null, datetime.getDorProperties().get("dorColspan"));
        assertEquals(null, datetime.getDorProperties().get("dorBindRef"));

    }

    @Test
    void testGetDescription() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals("dummy", datetime.getDescription());
    }

    @Test
    void testGetRequired() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals(false, datetime.isRequired());
    }

    // @Test
    // void testGetPattern() {
    // DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
    // assertEquals("/^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/", datetime.getPattern());
    //
    // }

    @Test
    void testIsEnabled() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals(false, datetime.isEnabled());
    }

    @Test
    void testIsEnabledForCustomized() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals(false, datetime.isEnabled());
    }

    @Test
    void testIsReadOnly() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals(true, datetime.isReadOnly());
    }

    @Test
    void testIsReadOnlyForCustomized() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals(true, datetime.isReadOnly());
    }

    @Test
    void testGetMinimum() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals("2025-05-07T11:21", datetime.getMinimumDateTime());
    }

    @Test
    void testGetMaximum() {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DateTime.class, context);
        assertEquals("2025-05-21T11:21", datetime.getMaximumDateTime());
    }

    @Test
    void testDataLayerProperties() throws IllegalAccessException {
        DateTime datetime = Utils.getComponentUnderTest(PATH_DATETIME_DATALAYER, DateTime.class, context);
        FieldUtils.writeField(datetime, "dataLayerEnabled", true, true);
        FormComponentData dataObject = (FormComponentData) datetime.getData();
        assert (dataObject != null);
        assert (dataObject.getId()).equals("datetime-0ac1fed1fe");
        assert (dataObject.getType()).equals("core/fd/components/form/datetime/v1/datetime");
        assert (dataObject.getTitle()).equals("DoB");
        assert (dataObject.getFieldType()).equals("datetime-input");
        assert (dataObject.getDescription()).equals("Date of Birth");
    }

    // @Test
    // void testGetConstraintMessages() {
    // DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATETIME_CUSTOMIZED, DatePicker.class, context);
    // Map<ConstraintType, String> constraintsMessages = datePicker.getConstraintMessages();
    // assertEquals(constraintsMessages.get(ConstraintType.TYPE), "incorrect type");
    // DatePicker datePickerMock = Mockito.mock(DatePicker.class);
    // Mockito.when(datePickerMock.getConstraintMessages()).thenCallRealMethod();
    // assertEquals(Collections.emptyMap(), datePickerMock.getConstraintMessages());
    // }

    @Test
    void testJSONExport() throws Exception {
        DateTime dateTime = Utils.getComponentUnderTest(PATH_DATETIME, DateTime.class, context);
        Utils.testJSONExport(dateTime, Utils.getTestExporterJSONPath(BASE, PATH_DATETIME));
    }

     @Test
     void testJSONExportBackwardCompatibility() throws Exception {
     DateTime dateTime = Utils.getComponentUnderTest(PATH_DATETIME_BACKWARD_COMPATIBLE, DateTime.class, context);
     Utils.testJSONExport(dateTime, Utils.getTestExporterJSONPath(BASE, PATH_DATETIME_BACKWARD_COMPATIBLE));
     }


    @Test
    void testNoFieldType() throws Exception {
        DateTime dateTime = Utils.getComponentUnderTest(PATH_DATETIME_WITHOUT_FIELDTYPE, DateTime.class, context);
        Utils.testJSONExport(dateTime, Utils.getTestExporterJSONPath(BASE, PATH_DATETIME_WITHOUT_FIELDTYPE));
    }
}
