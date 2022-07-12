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

import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Base;
import com.adobe.cq.forms.core.components.models.form.BaseConstraint;
import com.adobe.cq.forms.core.components.models.form.Label;
import com.adobe.cq.forms.core.components.models.form.TextInput;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.cq.wcm.style.ComponentStyleInfo;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;

@ExtendWith(AemContextExtension.class)
public class TextInputImplTest {
    private static final String BASE = "/form/textinput";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_TEXTINPUT_1 = CONTENT_ROOT + "/textinput";
    private static final String PATH_TEXTINPUT_2 = CONTENT_ROOT + "/multiline-textinput";
    private static final String PATH_NUMBER_TEXTINPUT = CONTENT_ROOT + "/number-textinput";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals(FormConstants.RT_FD_FORM_TEXT_V1, textInput.getExportedType());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getExportedType()).thenCallRealMethod();
        assertEquals("", textInputMock.getExportedType());
    }

    @Test
    void testFieldType() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals(Base.FieldType.TEXT_INPUT.getValue(), textInput.getFieldType());
    }

    @Test
    void testGetLabel() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals("def", textInput.getLabel().getValue());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getLabel()).thenCallRealMethod();
        assertEquals(null, textInputMock.getLabel());

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
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals("abc", textInput.getName());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getName()).thenCallRealMethod();
        assertEquals(null, textInputMock.getName());
    }

    @Test
    void testGetDataRef() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals("a.b", textInput.getDataRef());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getDataRef()).thenCallRealMethod();
        assertEquals(null, textInputMock.getDataRef());
    }

    @Test
    void testGetDescription() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals("dummy", textInput.getDescription());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getDescription()).thenCallRealMethod();
        assertEquals(null, textInputMock.getDescription());
    }

    @Test
    void testGetDefault() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals("abc", textInput.getDefault());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getDefault()).thenCallRealMethod();
        assertEquals(null, textInputMock.getDefault());
    }

    @Test
    void testGetNumberDefault() {
        TextInput numberTextInput = getTextInputUnderTest(PATH_NUMBER_TEXTINPUT);
        assertEquals(150, ((Long) numberTextInput.getDefault()).intValue());
    }

    @Test
    void testGetScreenReaderText() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals("'Custom screen reader text'", textInput.getScreenReaderText());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getScreenReaderText()).thenCallRealMethod();
        assertEquals(null, textInputMock.getScreenReaderText());
    }

    @Test
    void testGetHtmlScreenReaderText() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals("Custom screen reader text", textInput.getHtmlScreenReaderText());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getHtmlScreenReaderText()).thenCallRealMethod();
        assertEquals(null, textInputMock.getHtmlScreenReaderText());
    }

    @Test
    void testIsVisible() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals(false, textInput.isVisible());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.isVisible()).thenCallRealMethod();
        assertEquals(true, textInputMock.isVisible());
    }

    @Test
    void testIsEnabled() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals(true, textInput.isEnabled());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.isEnabled()).thenCallRealMethod();
        assertEquals(true, textInputMock.isEnabled());
    }

    @Test
    void testIsReadOnly() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals(false, textInput.isReadOnly());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.isReadOnly()).thenCallRealMethod();
        assertEquals(false, textInputMock.isReadOnly());
    }

    @Test
    void testIsMultiLine() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals(false, textInput.isMultiLine());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.isMultiLine()).thenCallRealMethod();
        assertEquals(false, textInputMock.isMultiLine());
    }

    @Test
    void testGetPlaceHolder() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals(null, textInput.getPlaceHolder());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getPlaceHolder()).thenCallRealMethod();
        assertEquals(null, textInputMock.getPlaceHolder());
    }

    @Test
    void testGetDisplayFormat() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals(null, textInput.getDisplayFormat());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getDisplayFormat()).thenCallRealMethod();
        assertEquals(null, textInputMock.getDisplayFormat());
    }

    @Test
    void testGetEditFormat() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals(null, textInput.getEditFormat());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getEditFormat()).thenCallRealMethod();
        assertEquals(null, textInputMock.getEditFormat());
    }

    @Test
    void testGetDataFormat() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals(null, textInput.getDataFormat());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getDataFormat()).thenCallRealMethod();
        assertEquals(null, textInputMock.getDataFormat());
    }

    @Test
    void testGetType() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals(BaseConstraint.Type.STRING, textInput.getType());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getType()).thenCallRealMethod();
        assertEquals(BaseConstraint.Type.STRING, textInputMock.getType());
    }

    @Test
    void testGetNumberType() {
        TextInput numberTextInput = getTextInputUnderTest(PATH_NUMBER_TEXTINPUT);
        assertEquals(BaseConstraint.Type.NUMBER, numberTextInput.getType());
    }

    @Test
    void testGetMaximum() {
        TextInput numberTextInput = getTextInputUnderTest(PATH_NUMBER_TEXTINPUT);
        assertEquals(100, numberTextInput.getMaximum().intValue());
    }

    @Test
    void testGetMinimum() {
        TextInput numberTextInput = getTextInputUnderTest(PATH_NUMBER_TEXTINPUT);
        assertEquals(10, numberTextInput.getMinimum().intValue());
    }

    @Test
    void testGetTooltip() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals("test-short-description", textInput.getTooltip());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, textInputMock.getTooltip());
    }

    @Test
    void testGetConstraintMessages() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        Map<Base.ConstraintType, String> constraintsMessages = textInput.getConstraintMessages();
        assertEquals(constraintsMessages.get(Base.ConstraintType.TYPE), "incorrect type");
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getConstraintMessages()).thenCallRealMethod();
        assertEquals(Collections.emptyMap(), textInputMock.getConstraintMessages());
    }

    @Test
    void testJSONExport() throws Exception {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        Utils.testJSONExport(textInput, Utils.getTestExporterJSONPath(BASE, PATH_TEXTINPUT_1));
    }

    @Test
    void testMultiLineJSONExport() throws Exception {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_2);
        Utils.testJSONExport(textInput, Utils.getTestExporterJSONPath(BASE, PATH_TEXTINPUT_2));
    }

    @Test
    void testGetProperties() throws Exception {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        Map<String, Object> properties = textInput.getProperties();
        assertFalse(properties.isEmpty());
        // get custom properties of "af:layout"
        Map<String, Object> customProperties = (Map<String, Object>) properties.get(Base.CUSTOM_PROPERTY_WRAPPER);
        assertFalse((boolean) customProperties.get("tooltipVisible"));
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
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals(null, textInput.getAutoComplete());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getAutoComplete()).thenCallRealMethod();
        assertEquals(null, textInputMock.getAutoComplete());
    }

    @Test
    void testStyleSystemClasses() {
        ComponentStyleInfo componentStyleInfoMock = mock(ComponentStyleInfo.class);
        Resource resource = spy(context.resourceResolver().getResource(PATH_TEXTINPUT_1));
        Mockito.doReturn(componentStyleInfoMock).when(resource).adaptTo(ComponentStyleInfo.class);
        MockSlingHttpServletRequest request = context.request();
        request.setResource(resource);
        Mockito.doReturn("mystyle").when(componentStyleInfoMock).getAppliedCssClasses();
        TextInput textInput = request.adaptTo(TextInput.class);
        String appliedCssClasses = textInput.getAppliedCssClasses();
        assertEquals("mystyle", appliedCssClasses);
    }

    private TextInput getTextInputUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(TextInput.class);
    }
}
