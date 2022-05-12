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

import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
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
    void testGetLabel() {
        TextInput textInput = getTextInputUnderTest(PATH_TEXTINPUT_1);
        assertEquals("def", textInput.getLabel().getValue());
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
