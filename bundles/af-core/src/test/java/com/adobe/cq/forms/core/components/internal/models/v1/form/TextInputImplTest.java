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

import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.*;

import org.apache.commons.lang3.reflect.FieldUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.datalayer.FormComponentData;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.*;
import com.adobe.cq.forms.core.components.util.AbstractFormComponentImpl;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.cq.wcm.style.ComponentStyleInfo;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;

@ExtendWith(AemContextExtension.class)
public class TextInputImplTest {
    private static final String BASE = "/form/textinput";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_TEXTINPUT = CONTENT_ROOT + "/textinput";
    private static final String PATH_TEXTINPUT_DATALAYER = CONTENT_ROOT + "/textinput-datalayer";
    private static final String PATH_TEXTINPUT_CUSTOMIZED = CONTENT_ROOT + "/textinput-customized";
    private static final String PATH_TEXTINPUT_2 = CONTENT_ROOT + "/multiline-textinput";
    private static final String PATH_NUMBER_TEXTINPUT = CONTENT_ROOT + "/number-textinput";
    private static final String PATH_NUMBER_TEXTINPUT_EXCLUSIVE = CONTENT_ROOT + "/number-textinput-exclusive";
    private static final String PATH_FORMAT_TEXTINPUT = CONTENT_ROOT + "/textinput-format";
    private static final String PATH_TEXTINPUT_UNBOUNDFORMELEMENT = CONTENT_ROOT + "/textinput_unboundFormElement";
    private static final String PATH_TEXTINPUT_BLANK_DATAREF = CONTENT_ROOT + "/textinput-blank-dataref";
    private static final String PATH_TEXTINPUT_BLANK_VALIDATIONEXPRESSION = CONTENT_ROOT + "/textinput-blank-validationExpression";
    private static final String PATH_TEXTINPUT_DISPLAY_VALUE_EXPRESSION = CONTENT_ROOT + "/textinput-displayValueExpression";
    private static final String PATH_TEXTINPUT_PLACEHOLDER_AUTOCOMPLETE = CONTENT_ROOT + "/textinput-placeholder-autocomplete";
    private static final String PATH_TEXTINPUT_WITH_VIEWTYPE = CONTENT_ROOT + "/textinput-with-viewtype";
    private static final String PATH_TEXTINPUT_WITHOUT_FIELDTYPE = CONTENT_ROOT + "/textinput-without-fieldtype";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals(FormConstants.RT_FD_FORM_TEXT_V1, textInput.getExportedType());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getExportedType()).thenCallRealMethod();
        assertEquals("", textInputMock.getExportedType());
    }

    @Test
    void testFieldType() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals(FieldType.TEXT_INPUT.getValue(), textInput.getFieldType());
    }

    @Test
    void testGetLabel() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals("def", textInput.getLabel().getValue());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getLabel()).thenCallRealMethod();
        assertEquals(null, textInputMock.getLabel());

        Label labelMock = Mockito.mock(Label.class);
        Mockito.when(labelMock.isRichText()).thenCallRealMethod();
        assertEquals(null, labelMock.isRichText());
        Mockito.when(labelMock.getValue()).thenCallRealMethod();
        assertEquals(null, labelMock.getValue());
        Mockito.when(labelMock.isVisible()).thenCallRealMethod();
        assertEquals(null, labelMock.isVisible());
    }

    @Test
    void testGetName() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals("abc", textInput.getName());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getName()).thenCallRealMethod();
        assertEquals(null, textInputMock.getName());
    }

    @Test
    void testGetDataRef() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals("a.b", textInput.getDataRef());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getDataRef()).thenCallRealMethod();
        assertEquals(null, textInputMock.getDataRef());
    }

    @Test
    void testDorProperties() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals(true, textInput.getDorProperties().get("dorExclusion"));
        assertEquals("4", textInput.getDorProperties().get("dorColspan"));
        assertEquals("Text1", textInput.getDorProperties().get("dorBindRef"));

    }

    @Test
    void testGetDescription() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals("dummy", textInput.getDescription());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getDescription()).thenCallRealMethod();
        assertEquals(null, textInputMock.getDescription());
    }

    @Test
    void testGetDefault() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertArrayEquals(new String[] { "abc" }, textInput.getDefault());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getDefault()).thenCallRealMethod();
        assertEquals(null, textInputMock.getDefault());
    }

    @Test
    void testGetNumberDefault() {
        TextInput numberTextInput = Utils.getComponentUnderTest(PATH_NUMBER_TEXTINPUT, TextInput.class, context);
        assertArrayEquals(new Long[] { 150L }, numberTextInput.getDefault());
    }

    @Test
    void testGetScreenReaderText() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals("'Custom screen reader text'", textInput.getScreenReaderText());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getScreenReaderText()).thenCallRealMethod();
        assertEquals(null, textInputMock.getScreenReaderText());
    }

    @Test
    void testGetHtmlScreenReaderText() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals("Custom screen reader text", textInput.getHtmlScreenReaderText());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getHtmlScreenReaderText()).thenCallRealMethod();
        assertEquals(null, textInputMock.getHtmlScreenReaderText());
    }

    @Test
    void testIsVisible() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT, TextInput.class, context);
        assertEquals(true, textInput.isVisible());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.isVisible()).thenCallRealMethod();
        assertEquals(null, textInputMock.isVisible());
    }

    @Test
    void testIsVisibleForCustomized() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals(false, textInput.isVisible());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.isVisible()).thenCallRealMethod();
        assertEquals(null, textInputMock.isVisible());
    }

    @Test
    void testIsEnabled() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT, TextInput.class, context);
        assertEquals(true, textInput.isEnabled());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.isEnabled()).thenCallRealMethod();
        assertEquals(null, textInputMock.isEnabled());
    }

    @Test
    void testIsEnabledForCustomized() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals(true, textInput.isEnabled());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.isEnabled()).thenCallRealMethod();
        assertEquals(null, textInputMock.isEnabled());
    }

    @Test
    void testIsReadOnly() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT, TextInput.class, context);
        assertEquals(false, textInput.isReadOnly());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.isReadOnly()).thenCallRealMethod();
        assertEquals(null, textInputMock.isReadOnly());
    }

    @Test
    void testIsReadOnlyForCustomized() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals(false, textInput.isReadOnly());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.isReadOnly()).thenCallRealMethod();
        assertEquals(null, textInputMock.isReadOnly());
    }

    @Test
    void testIsMultiLine() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals(false, textInput.isMultiLine());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.isMultiLine()).thenCallRealMethod();
        assertEquals(false, textInputMock.isMultiLine());
    }

    @Test
    void testGetPlaceHolder() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals(null, textInput.getPlaceHolder());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getPlaceHolder()).thenCallRealMethod();
        assertEquals(null, textInputMock.getPlaceHolder());
    }

    @Test
    void testGetDisplayFormat() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals(null, textInput.getDisplayFormat());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getDisplayFormat()).thenCallRealMethod();
        assertEquals(null, textInputMock.getDisplayFormat());
    }

    @Test
    void testGetEditFormat() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals(null, textInput.getEditFormat());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getEditFormat()).thenCallRealMethod();
        assertEquals(null, textInputMock.getEditFormat());
    }

    @Test
    void testGetDataFormat() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals(null, textInput.getDataFormat());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getDataFormat()).thenCallRealMethod();
        assertEquals(null, textInputMock.getDataFormat());
    }

    @Test
    void testGetType() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals(BaseConstraint.Type.STRING, textInput.getType());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getType()).thenCallRealMethod();
        assertEquals(BaseConstraint.Type.STRING, textInputMock.getType());
    }

    @Test
    void testGetNumberType() {
        TextInput numberTextInput = Utils.getComponentUnderTest(PATH_NUMBER_TEXTINPUT, TextInput.class, context);
        assertEquals(BaseConstraint.Type.NUMBER, numberTextInput.getType());
    }

    @Test
    void testGetMaximum() {
        TextInput numberTextInput = Utils.getComponentUnderTest(PATH_NUMBER_TEXTINPUT, TextInput.class, context);
        assertEquals(100, numberTextInput.getMaximum().intValue());
    }

    @Test
    void testGetMinimum() {
        TextInput numberTextInput = Utils.getComponentUnderTest(PATH_NUMBER_TEXTINPUT, TextInput.class, context);
        assertEquals(10, numberTextInput.getMinimum().intValue());
    }

    @Test
    void testGetExclusiveMinimum() {
        TextInput numberTextInput = Utils.getComponentUnderTest(PATH_NUMBER_TEXTINPUT_EXCLUSIVE, TextInput.class, context);
        assertNull(numberTextInput.getMinimum());
        assertEquals(10L, numberTextInput.getExclusiveMinimum().longValue());
    }

    @Test
    void testGetExclusiveMaximum() {
        TextInput numberTextInput = Utils.getComponentUnderTest(PATH_NUMBER_TEXTINPUT_EXCLUSIVE, TextInput.class, context);
        assertNull(numberTextInput.getMaximum());
        assertEquals(100L, numberTextInput.getExclusiveMaximum().longValue());
    }

    @Test
    void testGetTooltip() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        assertEquals("test-short-description", textInput.getTooltip());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, textInputMock.getTooltip());
    }

    @Test
    void testGetConstraintMessages() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        Map<ConstraintType, String> constraintsMessages = textInput.getConstraintMessages();
        assertEquals(constraintsMessages.get(ConstraintType.TYPE), "incorrect type");
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getConstraintMessages()).thenCallRealMethod();
        assertEquals(Collections.emptyMap(), textInputMock.getConstraintMessages());
    }

    @Test
    void testJSONExport() throws Exception {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT, TextInput.class, context);
        Utils.testJSONExport(textInput, Utils.getTestExporterJSONPath(BASE, PATH_TEXTINPUT));
    }

    @Test
    void testJSONExportForUnboundFormElement() throws Exception {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_UNBOUNDFORMELEMENT, TextInput.class, context);
        Utils.testJSONExport(textInput, Utils.getTestExporterJSONPath(BASE, PATH_TEXTINPUT_UNBOUNDFORMELEMENT));
    }

    @Test
    void testJSONExportForCustomized() throws Exception {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        Utils.testJSONExport(textInput, Utils.getTestExporterJSONPath(BASE, PATH_TEXTINPUT_CUSTOMIZED));
    }

    @Test
    void testMultiLineJSONExport() throws Exception {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_2, TextInput.class, context);
        Utils.testJSONExport(textInput, Utils.getTestExporterJSONPath(BASE, PATH_TEXTINPUT_2));
    }

    @Test
    void testFormatJSONExport() throws Exception {
        TextInput textInput = Utils.getComponentUnderTest(PATH_FORMAT_TEXTINPUT, TextInput.class, context);
        Utils.testJSONExport(textInput, Utils.getTestExporterJSONPath(BASE, PATH_FORMAT_TEXTINPUT));
    }

    @Test
    void testGetProperties() throws Exception {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        Map<String, Object> properties = textInput.getProperties();
        assertFalse(properties.isEmpty());
        // get custom properties of "afs:layout"
        Map<String, Object> customProperties = (Map<String, Object>) properties.get(Base.CUSTOM_PROPERTY_WRAPPER);
        assertFalse((boolean) customProperties.get("tooltipVisible"));
    }

    @Test
    public void testGetCustomProperties() throws Exception {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT, TextInput.class, context);
        Method method = AbstractFormComponentImpl.class.getDeclaredMethod("getCustomProperties");
        method.setAccessible(true);
        Map<String, Object> result = (Map<String, Object>) method.invoke(textInput);
        Assertions.assertFalse(result.isEmpty());
        Assertions.assertEquals("test-custom-string", result.get("customPropString"));
        assertArrayEquals(new String[] { "a", "b" }, (Object[]) result.get("customPropStringArray"));
        Assertions.assertEquals(true, result.get("customPropBool"));
        Assertions.assertEquals(true, result.get("customPropBoolArray"));
        Assertions.assertEquals(45L, result.get("customPropLong"));
        assertArrayEquals(new Long[] { 345L, 576L }, (Object[]) result.get("customPropLongArray"));
        Assertions.assertEquals(new BigDecimal("45.67"), (BigDecimal) result.get("customPropDecimal"));
        assertArrayEquals(new BigDecimal[] { new BigDecimal("45.67"), new BigDecimal("90.34") }, (BigDecimal[]) result.get(
            "customPropDecimalArray"));
        Assertions.assertEquals(new GregorianCalendar(2022, Calendar.SEPTEMBER, 13, 9, 0, 0) {
            {
                set(Calendar.MILLISECOND, 0);
                setTimeZone(TimeZone.getTimeZone("UTC"));
            }
        }, (Calendar) result.get("customPropDate"));
        assertArrayEquals(
            new Calendar[] {
                new GregorianCalendar(2022, Calendar.SEPTEMBER, 13, 9, 0, 0) {
                    {
                        set(Calendar.MILLISECOND, 0);
                        setTimeZone(TimeZone.getTimeZone("UTC"));
                    }
                },
                new GregorianCalendar(2024, Calendar.JUNE, 22, 14, 0, 0) {
                    {
                        set(Calendar.MILLISECOND, 0);
                        setTimeZone(TimeZone.getTimeZone("UTC"));
                    }
                }
            },
            (Calendar[]) result.get("customPropDateArray"));
        Assertions.assertNull(result.get("fd:accidentalPrefix"));
        Assertions.assertNull(result.get("sling:accidentalPrefix"));
        Assertions.assertNull(result.get("jcr:accidentalPrefix"));
    }

    @Test
    void testGetProperties_should_return_empty_if_no_custom_properties() {
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getProperties()).thenCallRealMethod();
        assertTrue(textInputMock.getProperties().isEmpty());
    }

    @Test
    void testGetShortDescription() {
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, textInputMock.getTooltip());
    }

    @Test
    void testIsShortDescriptionVisible() {
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.isTooltipVisible()).thenCallRealMethod();
        assertEquals(false, textInputMock.isTooltipVisible());
    }

    @Test
    void testGetAutoComplete() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_CUSTOMIZED, TextInput.class, context);
        ;
        assertEquals(null, textInput.getAutoComplete());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getAutoComplete()).thenCallRealMethod();
        assertEquals(null, textInputMock.getAutoComplete());
    }

    @Test
    void testStyleSystemClasses() {
        ComponentStyleInfo componentStyleInfoMock = mock(ComponentStyleInfo.class);
        Resource resource = spy(context.resourceResolver().getResource(PATH_TEXTINPUT_CUSTOMIZED));
        Mockito.doReturn(componentStyleInfoMock).when(resource).adaptTo(ComponentStyleInfo.class);
        MockSlingHttpServletRequest request = context.request();
        request.setResource(resource);
        Mockito.doReturn("mystyle").when(componentStyleInfoMock).getAppliedCssClasses();
        TextInput textInput = context.currentResource().adaptTo(TextInput.class);
        String appliedCssClasses = textInput.getAppliedCssClasses();
        assertEquals("mystyle", appliedCssClasses);
    }

    @Test
    void testDataLayerProperties() throws IllegalAccessException {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_DATALAYER, TextInput.class, context);
        FieldUtils.writeField(textInput, "dataLayerEnabled", true, true);
        FormComponentData dataObject = (FormComponentData) textInput.getData();
        assert (dataObject != null);
        assert (dataObject.getId()).equals("textinput-1c7bc238a6");
        assert (dataObject.getType()).equals("core/fd/components/form/textinput/v1/textinput");
        assert (dataObject.getTitle()).equals("Full Name");
        assert (dataObject.getFieldType()).equals("text-input");
        assert (dataObject.getDescription()).equals("Enter Full Name");
    }

    @Test
    void testJSONExportDataLayer() throws Exception {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_DATALAYER, TextInput.class, context);
        FieldUtils.writeField(textInput, "dataLayerEnabled", true, true);
        Utils.testJSONExport(textInput, Utils.getTestExporterJSONPath(BASE, PATH_TEXTINPUT_DATALAYER));
    }

    @Test
    void testJSONExportForBlankDataRef() throws Exception {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_BLANK_DATAREF, TextInput.class, context);
        Utils.testJSONExport(textInput, Utils.getTestExporterJSONPath(BASE, PATH_TEXTINPUT_BLANK_DATAREF));
    }

    @Test
    void testJSONExportForEmptyValidationExpression() throws Exception {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_BLANK_VALIDATIONEXPRESSION, TextInput.class, context);
        Utils.testJSONExport(textInput, Utils.getTestExporterJSONPath(BASE, PATH_TEXTINPUT_BLANK_VALIDATIONEXPRESSION));
    }

    @Test
    void testPlaceholderAndAutocomplete() throws Exception {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_PLACEHOLDER_AUTOCOMPLETE, TextInput.class, context);
        Utils.testJSONExport(textInput, Utils.getTestExporterJSONPath(BASE, PATH_TEXTINPUT_PLACEHOLDER_AUTOCOMPLETE));
        assertEquals("given-name", textInput.getAutoComplete());
        assertEquals("test-placeholder", textInput.getPlaceHolder());
    }

    @Test
    void testJSONExportForDisplayValueExpression() throws Exception {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_DISPLAY_VALUE_EXPRESSION, TextInput.class, context);
        Utils.testJSONExport(textInput, Utils.getTestExporterJSONPath(BASE, PATH_TEXTINPUT_DISPLAY_VALUE_EXPRESSION));
    }

    @Test
    void testExportTypeWithViewType() throws Exception {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_WITH_VIEWTYPE, TextInput.class, context);
        Utils.testJSONExport(textInput, Utils.getTestExporterJSONPath(BASE, PATH_TEXTINPUT_WITH_VIEWTYPE));
        assertEquals("some/custom/value", textInput.getExportedType());
    }

    @Test
    void testNoFieldType() {
        TextInput textInput = Utils.getComponentUnderTest(PATH_TEXTINPUT_WITHOUT_FIELDTYPE, TextInput.class, context);
        assertEquals(FieldType.TEXT_INPUT.getValue(), textInput.getFieldType());
    }
}
