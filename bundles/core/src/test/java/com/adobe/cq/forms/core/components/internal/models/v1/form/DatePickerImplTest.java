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

import java.util.Collections;
import java.util.Date;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.*;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;

@ExtendWith(AemContextExtension.class)
public class DatePickerImplTest {
    private static final String BASE = "/form/datepicker";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_DATEPICKER = CONTENT_ROOT + "/datepicker";

    private static final String PATH_DATEPICKER_MESSAGE = CONTENT_ROOT + "/datepicker-message";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER, DatePicker.class, context);
        assertEquals(FormConstants.RT_FD_FORM_DATE_PICKER_V1, datePicker.getExportedType());
        DatePicker datePickerMock = Mockito.mock(DatePicker.class);
        Mockito.when(datePickerMock.getExportedType()).thenCallRealMethod();
        assertEquals("", datePickerMock.getExportedType());
    }

    @Test
    void testFieldType() {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER, DatePicker.class, context);
        assertEquals(FieldType.DATE_INPUT.getValue(), datePicker.getFieldType());
    }

    @Test
    void testGetLabel() {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER, DatePicker.class, context);
        assertEquals("def", datePicker.getLabel().getValue());
        DatePicker datePickerMock = Mockito.mock(DatePicker.class);
        Mockito.when(datePickerMock.getLabel()).thenCallRealMethod();
        assertEquals(null, datePickerMock.getLabel());

        Label labelMock = Mockito.mock(Label.class);
        Mockito.when(labelMock.isRichText()).thenCallRealMethod();
        assertEquals(false, labelMock.isRichText());
        Mockito.when(labelMock.getValue()).thenCallRealMethod();
        assertEquals(null, labelMock.getValue());
        Mockito.when(labelMock.isVisible()).thenCallRealMethod();
        assertEquals(true, labelMock.isVisible());
    }

    @Test
    void testGetName() {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER, DatePicker.class, context);
        assertEquals("abc", datePicker.getName());
        DatePicker datePickerMock = Mockito.mock(DatePicker.class);
        Mockito.when(datePickerMock.getName()).thenCallRealMethod();
        assertEquals(null, datePickerMock.getName());
    }

    @Test
    void testGetDataRef() {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER, DatePicker.class, context);
        assertEquals("a.b", datePicker.getDataRef());
        DatePicker datePickerMock = Mockito.mock(DatePicker.class);
        Mockito.when(datePickerMock.getDataRef()).thenCallRealMethod();
        assertEquals(null, datePickerMock.getDataRef());
    }

    @Test
    void testGetDescription() {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER, DatePicker.class, context);
        assertEquals("dummy", datePicker.getDescription());
        DatePicker datePickerMock = Mockito.mock(DatePicker.class);
        Mockito.when(datePickerMock.getDescription()).thenCallRealMethod();
        assertEquals(null, datePickerMock.getDescription());
    }

    @Test
    void testGetScreenReaderText() {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER, DatePicker.class, context);
        assertEquals("'Custom screen reader text'", datePicker.getScreenReaderText());
        DatePicker datePickerMock = Mockito.mock(DatePicker.class);
        Mockito.when(datePickerMock.getScreenReaderText()).thenCallRealMethod();
        assertEquals(null, datePickerMock.getScreenReaderText());
    }

    @Test
    void testIsVisible() {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER, DatePicker.class, context);
        assertEquals(false, datePicker.isVisible());
        DatePicker datePickerMock = Mockito.mock(DatePicker.class);
        Mockito.when(datePickerMock.isVisible()).thenCallRealMethod();
        assertEquals(true, datePickerMock.isVisible());
    }

    @Test
    void testIsEnabled() {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER, DatePicker.class, context);
        assertEquals(true, datePicker.isEnabled());
        DatePicker datePickerMock = Mockito.mock(DatePicker.class);
        Mockito.when(datePickerMock.isEnabled()).thenCallRealMethod();
        assertEquals(true, datePickerMock.isEnabled());
    }

    @Test
    void testGetMinimumDate() {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER, DatePicker.class, context);
        assertEquals(new Date("Fri Feb 04 2022 05:30:00 GMT+0530"), datePicker.getMinimumDate());
    }

    @Test
    void testGetDefault() {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER, DatePicker.class, context);
        assertArrayEquals(new Object[] { new Date("Mon Feb 07 2022 05:30:00 GMT+0530") }, datePicker.getDefault());
    }

    @Test
    void testIsReadOnly() {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER, DatePicker.class, context);
        assertEquals(false, datePicker.isReadOnly());
        DatePicker datePickerMock = Mockito.mock(DatePicker.class);
        Mockito.when(datePickerMock.isReadOnly()).thenCallRealMethod();
        assertEquals(false, datePickerMock.isReadOnly());
    }

    @Test
    void testGetPlaceHolder() {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER, DatePicker.class, context);
        assertEquals(null, datePicker.getPlaceHolder());
        DatePicker datePickerMock = Mockito.mock(DatePicker.class);
        Mockito.when(datePickerMock.getPlaceHolder()).thenCallRealMethod();
        assertEquals(null, datePickerMock.getPlaceHolder());
    }

    @Test
    void testGetDisplayFormat() {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER, DatePicker.class, context);
        assertEquals(null, datePicker.getDisplayFormat());
        DatePicker datePickerMock = Mockito.mock(DatePicker.class);
        Mockito.when(datePickerMock.getDisplayFormat()).thenCallRealMethod();
        assertEquals(null, datePickerMock.getDisplayFormat());
    }

    @Test
    void testGetEditFormat() {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER, DatePicker.class, context);
        assertEquals(null, datePicker.getEditFormat());
        DatePicker datePickerMock = Mockito.mock(DatePicker.class);
        Mockito.when(datePickerMock.getEditFormat()).thenCallRealMethod();
        assertEquals(null, datePickerMock.getEditFormat());
    }

    @Test
    void testGetDataFormat() {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER, DatePicker.class, context);
        assertEquals(null, datePicker.getDataFormat());
        DatePicker datePickerMock = Mockito.mock(DatePicker.class);
        Mockito.when(datePickerMock.getDataFormat()).thenCallRealMethod();
        assertEquals(null, datePickerMock.getDataFormat());
    }

    @Test
    void testGetConstraintMessages() {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER, DatePicker.class, context);
        Map<ConstraintType, String> constraintsMessages = datePicker.getConstraintMessages();
        assertEquals(constraintsMessages.get(ConstraintType.TYPE), "incorrect type");
        DatePicker datePickerMock = Mockito.mock(DatePicker.class);
        Mockito.when(datePickerMock.getConstraintMessages()).thenCallRealMethod();
        assertEquals(Collections.emptyMap(), datePickerMock.getConstraintMessages());
    }

    @Test
    void testJSONExport() throws Exception {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER, DatePicker.class, context);
        Utils.testJSONExport(datePicker, Utils.getTestExporterJSONPath(BASE, PATH_DATEPICKER));
    }

    @Test
    void testJSONExportMessage() throws Exception {
        DatePicker datePicker = Utils.getComponentUnderTest(PATH_DATEPICKER_MESSAGE, DatePicker.class, context);
        Utils.testJSONExport(datePicker, Utils.getTestExporterJSONPath(BASE, PATH_DATEPICKER_MESSAGE));
    }

    @Test
    void testGetProperties_should_return_empty_if_no_custom_properties() {
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getProperties()).thenCallRealMethod();
        assertTrue(textInputMock.getProperties().isEmpty());
    }

    @Test
    void testGetShortDescription() {
        DatePicker datePickerMock = Mockito.mock(DatePicker.class);
        Mockito.when(datePickerMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, datePickerMock.getTooltip());
    }

    @Test
    void testIsShortDescriptionVisible() {
        DatePicker datePickerMock = Mockito.mock(DatePicker.class);
        Mockito.when(datePickerMock.isTooltipVisible()).thenCallRealMethod();
        assertEquals(false, datePickerMock.isTooltipVisible());
    }
}
