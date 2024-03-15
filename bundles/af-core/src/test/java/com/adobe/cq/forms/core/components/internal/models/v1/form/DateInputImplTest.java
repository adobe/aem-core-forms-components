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

import java.util.*;

import org.apache.commons.lang3.reflect.FieldUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.datalayer.FormComponentData;
import com.adobe.cq.forms.core.components.models.form.*;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(AemContextExtension.class)
public class DateInputImplTest {
    private static final String BASE = "/form/dateinput";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_DATEINPUT_CUSTOMIZED = CONTENT_ROOT + "/dateinput-customized";
    private static final String PATH_DATEINPUT_CUSTOMIZED_ELSE = CONTENT_ROOT + "/dateinput-customized-else";

    private static final String PATH_DATEINPUT = CONTENT_ROOT + "/dateinput";
    private static final String PATH_DATEINPUT_DATALAYER = CONTENT_ROOT + "/dateinput-datalayer";

    private static final String PATH_DATEINPUT_MESSAGE = CONTENT_ROOT + "/dateinput-message";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testFieldType() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals(FieldType.DATE_INPUT.getValue(), dateInput.getFieldType());
    }

    @Test
    void testGetLabel() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals("def", dateInput.getLabel().getValue());
        DateInput dateInputMock = Mockito.mock(DateInput.class);
        when(dateInputMock.getLabel()).thenCallRealMethod();
        assertEquals(null, dateInputMock.getLabel());

        Label labelMock = Mockito.mock(Label.class);
        when(labelMock.isRichText()).thenCallRealMethod();
        assertEquals(null, labelMock.isRichText());
        when(labelMock.getValue()).thenCallRealMethod();
        assertEquals(null, labelMock.getValue());
        when(labelMock.isVisible()).thenCallRealMethod();
        assertEquals(null, labelMock.isVisible());
    }

    @Test
    void testGetName() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals("abc", dateInput.getName());
        DateInput dateInputMock = Mockito.mock(DateInput.class);
        when(dateInputMock.getName()).thenCallRealMethod();
        assertEquals(null, dateInputMock.getName());
    }

    @Test
    void testGetDataRef() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals("a.b", dateInput.getDataRef());
        DateInput dateInputMock = Mockito.mock(DateInput.class);
        when(dateInputMock.getDataRef()).thenCallRealMethod();
        assertEquals(null, dateInputMock.getDataRef());
    }

    @Test
    void testGetDescription() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals("dummy", dateInput.getDescription());
        DateInput dateInputMock = Mockito.mock(DateInput.class);
        when(dateInputMock.getDescription()).thenCallRealMethod();
        assertEquals(null, dateInputMock.getDescription());
    }

    @Test
    void testGetScreenReaderText() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals("'Custom screen reader text'", dateInput.getScreenReaderText());
        DateInput dateInputMock = Mockito.mock(DateInput.class);
        when(dateInputMock.getScreenReaderText()).thenCallRealMethod();
        assertEquals(null, dateInputMock.getScreenReaderText());
    }

    @Test
    void testIsVisible() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT, DateInput.class, context);
        assertEquals(null, dateInput.isVisible());
        DateInput dateInputMock = Mockito.mock(DateInput.class);
        when(dateInputMock.isVisible()).thenCallRealMethod();
        assertEquals(null, dateInputMock.isVisible());
    }

    @Test
    void testIsVisibleForCustomized() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals(false, dateInput.isVisible());
        DateInput dateInputMock = Mockito.mock(DateInput.class);
        when(dateInputMock.isVisible()).thenCallRealMethod();
        assertEquals(null, dateInputMock.isVisible());
    }

    @Test
    void testIsEnabled() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT, DateInput.class, context);
        assertEquals(null, dateInput.isEnabled());
        DateInput dateInputMock = Mockito.mock(DateInput.class);
        when(dateInputMock.isEnabled()).thenCallRealMethod();
        assertEquals(null, dateInputMock.isEnabled());
    }

    @Test
    void testIsEnabledForCustomized() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals(false, dateInput.isEnabled());
        DateInput dateInputMock = Mockito.mock(DateInput.class);
        when(dateInputMock.isEnabled()).thenCallRealMethod();
        assertEquals(null, dateInputMock.isEnabled());
    }

    @Test
    void testGetMinimumDate() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals(new Date("Fri Feb 04 2022 05:30:00 GMT+0530"), dateInput.getMinimumDate());
    }

    @Test
    void testGetDefault() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_CUSTOMIZED, DateInput.class, context);
        assertArrayEquals(new Object[] { new Date("Mon Feb 07 2022 05:30:00 GMT+0530") }, dateInput.getDefault());
    }

    @Test
    void testGetDefaultElse() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_CUSTOMIZED_ELSE, DateInput.class, context);
        assertArrayEquals(new Object[] { "Mon Feb 07 00:00:00 IST 2022" }, dateInput.getDefault());
    }

    @Test
    void testIsReadOnly() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT, DateInput.class, context);
        assertEquals(null, dateInput.isReadOnly());
        DateInput dateInputMock = Mockito.mock(DateInput.class);
        when(dateInputMock.isReadOnly()).thenCallRealMethod();
        assertEquals(null, dateInputMock.isReadOnly());
    }

    @Test
    void testIsReadOnlyForCustomized() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals(true, dateInput.isReadOnly());
        DateInput dateInputMock = Mockito.mock(DateInput.class);
        when(dateInputMock.isReadOnly()).thenCallRealMethod();
        assertEquals(null, dateInputMock.isReadOnly());
    }

    @Test
    void testGetPlaceHolder() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals(null, dateInput.getPlaceHolder());
        DateInput dateInputMock = Mockito.mock(DateInput.class);
        when(dateInputMock.getPlaceHolder()).thenCallRealMethod();
        assertEquals(null, dateInputMock.getPlaceHolder());
    }

    @Test
    void testGetDisplayFormat() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals(null, dateInput.getDisplayFormat());
        DateInput dateInputMock = Mockito.mock(DateInput.class);
        when(dateInputMock.getDisplayFormat()).thenCallRealMethod();
        assertEquals(null, dateInputMock.getDisplayFormat());
    }

    @Test
    void testGetEditFormat() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals(null, dateInput.getEditFormat());
        DateInput dateInputMock = Mockito.mock(DateInput.class);
        when(dateInputMock.getEditFormat()).thenCallRealMethod();
        assertEquals(null, dateInputMock.getEditFormat());
    }

    @Test
    void testGetDataFormat() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_CUSTOMIZED, DateInput.class, context);
        assertEquals(null, dateInput.getDataFormat());
        DateInput dateInputMock = Mockito.mock(DateInput.class);
        when(dateInputMock.getDataFormat()).thenCallRealMethod();
        assertEquals(null, dateInputMock.getDataFormat());
    }

    @Test
    void testGetConstraintMessages() {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_CUSTOMIZED, DateInput.class, context);
        Map<ConstraintType, String> constraintsMessages = dateInput.getConstraintMessages();
        assertEquals(constraintsMessages.get(ConstraintType.TYPE), "incorrect type");
        DateInput dateInputMock = Mockito.mock(DateInput.class);
        when(dateInputMock.getConstraintMessages()).thenCallRealMethod();
        assertEquals(Collections.emptyMap(), dateInputMock.getConstraintMessages());
    }

    @Test
    void testGetProperties_should_return_empty_if_no_custom_properties() {
        TextInput textInputMock = Mockito.mock(TextInput.class);
        when(textInputMock.getProperties()).thenCallRealMethod();
        assertTrue(textInputMock.getProperties().isEmpty());
    }

    @Test
    void testGetShortDescription() {
        DateInput dateInputMock = Mockito.mock(DateInput.class);
        when(dateInputMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, dateInputMock.getTooltip());
    }

    @Test
    void testIsShortDescriptionVisible() {
        DateInput dateInputMock = Mockito.mock(DateInput.class);
        when(dateInputMock.isTooltipVisible()).thenCallRealMethod();
        assertEquals(false, dateInputMock.isTooltipVisible());
    }

    @Test
    void testDataLayerProperties() throws IllegalAccessException {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_DATALAYER, DateInput.class, context);
        FieldUtils.writeField(dateInput, "dataLayerEnabled", true, true);
        FormComponentData dataObject = (FormComponentData) dateInput.getData();
        assert (dataObject != null);
        assert (dataObject.getId()).equals("dateinput-0ac1fed1fe");
        assert (dataObject.getType()).equals("core/fd/components/form/dateinput/v1/dateinput");
        assert (dataObject.getTitle()).equals("DoB");
        assert (dataObject.getFieldType()).equals("date-input");
        assert (dataObject.getDescription()).equals("Date of Birth");
    }

    @Test
    void testJSONExportDataLayer() throws Exception {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT_DATALAYER, DateInput.class, context);
        FieldUtils.writeField(dateInput, "dataLayerEnabled", true, true);
        Utils.testJSONExport(dateInput, Utils.getTestExporterJSONPath(BASE, PATH_DATEINPUT_DATALAYER));
    }

    @Test
    void testGetCombinedPlaceholder() throws Exception {
        DateInput dateInput = Utils.getComponentUnderTest(PATH_DATEINPUT, DateInputImpl.class, context);

        Map<String, List<String>> expectedResult = getExpectedResultFromJson();
        Map<String, List<String>> result = dateInput.getCombinedPlaceholder();
        assertEquals(expectedResult, result);
    }

    private Map<String, List<String>> getExpectedResultFromJson() throws Exception {
        String json = "{\n" +
            "  \"Year\": [\"Year\", \"YYYY\", \"2022\"],\n" +
            "  \"Month\": [\"Month\", \"MM\", \"02\"],\n" +
            "  \"Day\": [\"Day\", \"DD\", \"02\"]\n" +
            "}";
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(json, Map.class);
    }

}
