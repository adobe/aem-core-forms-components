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
import java.util.Map;

import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Base;
import com.adobe.cq.forms.core.components.models.form.Datepicker;
import com.adobe.cq.forms.core.components.models.form.Label;
import com.adobe.cq.forms.core.components.models.form.TextInput;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;

@ExtendWith(AemContextExtension.class)
public class DatepickerImplTest {
    private static final String BASE = "/form/datepicker";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_DATEPICKER = CONTENT_ROOT + "/datepicker";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        Datepicker datepicker = getDatepickerUnderTest(PATH_DATEPICKER);
        assertEquals(FormConstants.RT_FD_FORM_DATE_PICKER_V1, datepicker.getExportedType());
        Datepicker datepickerMock = Mockito.mock(Datepicker.class);
        Mockito.when(datepickerMock.getExportedType()).thenCallRealMethod();
        assertEquals("", datepickerMock.getExportedType());
    }

    @Test
    void testFieldType() {
        Datepicker datepicker = getDatepickerUnderTest(PATH_DATEPICKER);
        assertEquals(Base.FieldType.DATE_INPUT.getValue(), datepicker.getFieldType());
        Datepicker datepickerMock = Mockito.mock(Datepicker.class);
        Mockito.when(datepickerMock.getFieldType()).thenCallRealMethod();
        assertEquals(Base.FieldType.DATE_INPUT.getValue(), datepickerMock.getFieldType());
    }

    @Test
    void testGetLabel() {
        Datepicker datepicker = getDatepickerUnderTest(PATH_DATEPICKER);
        assertEquals("def", datepicker.getLabel().getValue());
        Datepicker datepickerMock = Mockito.mock(Datepicker.class);
        Mockito.when(datepickerMock.getLabel()).thenCallRealMethod();
        assertEquals(null, datepickerMock.getLabel());

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
        Datepicker datepicker = getDatepickerUnderTest(PATH_DATEPICKER);
        assertEquals("abc", datepicker.getName());
        Datepicker datepickerMock = Mockito.mock(Datepicker.class);
        Mockito.when(datepickerMock.getName()).thenCallRealMethod();
        assertEquals(null, datepickerMock.getName());
    }

    @Test
    void testGetDataRef() {
        Datepicker datepicker = getDatepickerUnderTest(PATH_DATEPICKER);
        assertEquals("a.b", datepicker.getDataRef());
        Datepicker datepickerMock = Mockito.mock(Datepicker.class);
        Mockito.when(datepickerMock.getDataRef()).thenCallRealMethod();
        assertEquals(null, datepickerMock.getDataRef());
    }

    @Test
    void testGetDescription() {
        Datepicker datepicker = getDatepickerUnderTest(PATH_DATEPICKER);
        assertEquals("dummy", datepicker.getDescription());
        Datepicker datepickerMock = Mockito.mock(Datepicker.class);
        Mockito.when(datepickerMock.getDescription()).thenCallRealMethod();
        assertEquals(null, datepickerMock.getDescription());
    }

    @Test
    void testGetScreenReaderText() {
        Datepicker datepicker = getDatepickerUnderTest(PATH_DATEPICKER);
        assertEquals("Custom screen reader text", datepicker.getScreenReaderText());
        Datepicker datepickerMock = Mockito.mock(Datepicker.class);
        Mockito.when(datepickerMock.getScreenReaderText()).thenCallRealMethod();
        assertEquals(null, datepickerMock.getScreenReaderText());
    }

    @Test
    void testIsVisible() {
        Datepicker datepicker = getDatepickerUnderTest(PATH_DATEPICKER);
        assertEquals(false, datepicker.isVisible());
        Datepicker datepickerMock = Mockito.mock(Datepicker.class);
        Mockito.when(datepickerMock.isVisible()).thenCallRealMethod();
        assertEquals(true, datepickerMock.isVisible());
    }

    @Test
    void testIsEnabled() {
        Datepicker datepicker = getDatepickerUnderTest(PATH_DATEPICKER);
        assertEquals(true, datepicker.isEnabled());
        Datepicker datepickerMock = Mockito.mock(Datepicker.class);
        Mockito.when(datepickerMock.isEnabled()).thenCallRealMethod();
        assertEquals(true, datepickerMock.isEnabled());
    }

    @Test
    void testIsReadOnly() {
        Datepicker datepicker = getDatepickerUnderTest(PATH_DATEPICKER);
        assertEquals(false, datepicker.isReadOnly());
        Datepicker datepickerMock = Mockito.mock(Datepicker.class);
        Mockito.when(datepickerMock.isReadOnly()).thenCallRealMethod();
        assertEquals(false, datepickerMock.isReadOnly());
    }

    @Test
    void testGetPlaceHolder() {
        Datepicker datepicker = getDatepickerUnderTest(PATH_DATEPICKER);
        assertEquals(null, datepicker.getPlaceHolder());
        Datepicker datepickerMock = Mockito.mock(Datepicker.class);
        Mockito.when(datepickerMock.getPlaceHolder()).thenCallRealMethod();
        assertEquals(null, datepickerMock.getPlaceHolder());
    }

    @Test
    void testGetDisplayFormat() {
        Datepicker datepicker = getDatepickerUnderTest(PATH_DATEPICKER);
        assertEquals(null, datepicker.getDisplayFormat());
        Datepicker datepickerMock = Mockito.mock(Datepicker.class);
        Mockito.when(datepickerMock.getDisplayFormat()).thenCallRealMethod();
        assertEquals(null, datepickerMock.getDisplayFormat());
    }

    @Test
    void testGetEditFormat() {
        Datepicker datepicker = getDatepickerUnderTest(PATH_DATEPICKER);
        assertEquals(null, datepicker.getEditFormat());
        Datepicker datepickerMock = Mockito.mock(Datepicker.class);
        Mockito.when(datepickerMock.getEditFormat()).thenCallRealMethod();
        assertEquals(null, datepickerMock.getEditFormat());
    }

    @Test
    void testGetDataFormat() {
        Datepicker datepicker = getDatepickerUnderTest(PATH_DATEPICKER);
        assertEquals(null, datepicker.getDataFormat());
        Datepicker datepickerMock = Mockito.mock(Datepicker.class);
        Mockito.when(datepickerMock.getDataFormat()).thenCallRealMethod();
        assertEquals(null, datepickerMock.getDataFormat());
    }

    @Test
    void testGetConstraintMessages() {
        Datepicker datepicker = getDatepickerUnderTest(PATH_DATEPICKER);
        Map<Base.ConstraintType, String> constraintsMessages = datepicker.getConstraintMessages();
        assertEquals(constraintsMessages.get(Base.ConstraintType.TYPE), "incorrect type");
        Datepicker datepickerMock = Mockito.mock(Datepicker.class);
        Mockito.when(datepickerMock.getConstraintMessages()).thenCallRealMethod();
        assertEquals(Collections.emptyMap(), datepickerMock.getConstraintMessages());
    }

    @Test
    void testJSONExport() throws Exception {
        Datepicker datepicker = getDatepickerUnderTest(PATH_DATEPICKER);
        Utils.testJSONExport(datepicker, Utils.getTestExporterJSONPath(BASE, PATH_DATEPICKER));
    }

    @Test
    void testGetProperties() throws Exception {
        Datepicker datepicker = getDatepickerUnderTest(PATH_DATEPICKER);
        Map<String, Object> properties = datepicker.getProperties();
        assertFalse(properties.isEmpty());
        assertEquals("test-short-description", String.valueOf(properties.get("shortDescription")));
        assertFalse((boolean) properties.get("shortDescriptionVisible"));
    }

    @Test
    void testGetProperties_should_return_empty_if_no_custom_properties() {
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getProperties()).thenCallRealMethod();
        assertTrue(textInputMock.getProperties().isEmpty());
    }

    @Test
    void testGetShortDescription() {
        Datepicker datepickerMock = Mockito.mock(Datepicker.class);
        Mockito.when(datepickerMock.getShortDescription()).thenCallRealMethod();
        assertEquals(null, datepickerMock.getShortDescription());
    }

    @Test
    void testIsShortDescriptionVisible() {
        Datepicker datepickerMock = Mockito.mock(Datepicker.class);
        Mockito.when(datepickerMock.isShortDescriptionVisible()).thenCallRealMethod();
        assertEquals(false, datepickerMock.isShortDescriptionVisible());
    }

    private Datepicker getDatepickerUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(Datepicker.class);
    }
}
