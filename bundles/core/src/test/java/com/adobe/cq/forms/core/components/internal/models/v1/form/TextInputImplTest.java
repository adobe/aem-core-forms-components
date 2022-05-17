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
import com.adobe.cq.forms.core.components.models.form.Label;
import com.adobe.cq.forms.core.components.models.form.TextInput;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;

@ExtendWith(AemContextExtension.class)
public class TextInputImplTest {
    private static final String BASE = "/form/textinput";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_TEXTINPUT_1 = CONTENT_ROOT + "/textinput";
    private static final String PATH_TEXTINPUT_2 = CONTENT_ROOT + "/multiline-textinput";

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
    void testViewType() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals(Base.ViewType.TEXT_INPUT.getValue(), textInput.getViewType());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getViewType()).thenCallRealMethod();
        assertEquals(Base.ViewType.TEXT_INPUT.getValue(), textInputMock.getViewType());
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
    void testGetScreenReaderText() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals("Custom screen reader text", textInput.getScreenReaderText());
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getScreenReaderText()).thenCallRealMethod();
        assertEquals(null, textInputMock.getScreenReaderText());
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
    void testGetConstraintMessages() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        Map<Base.ConstraintType, String> constraintsMessages = textInput.getConstraintsMessages();
        assertEquals(constraintsMessages.get(Base.ConstraintType.TYPE), "incorrect type");
        TextInput textInputMock = Mockito.mock(TextInput.class);
        Mockito.when(textInputMock.getConstraintsMessages()).thenCallRealMethod();
        assertEquals(Collections.emptyMap(), textInputMock.getConstraintsMessages());
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

    private TextInput getTextInputUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(TextInput.class);
    }
}
