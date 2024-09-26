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

import org.apache.commons.lang3.reflect.FieldUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.datalayer.FormComponentData;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.*;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;

@ExtendWith(AemContextExtension.class)
public class TextImplTest {
    private static final String BASE = "/form/text";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_TEXT_CUSTOMIZED = CONTENT_ROOT + "/text-customized";
    private static final String PATH_TEXT = CONTENT_ROOT + "/text";
    private static final String PATH_TEXT_DATALAYER = CONTENT_ROOT + "/text-datalayer";
    private static final String PATH_TEXT_WITHOUT_FIELDTYPE = CONTENT_ROOT + "/text-without-fieldtype";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        Text text = Utils.getComponentUnderTest(PATH_TEXT_CUSTOMIZED, Text.class, context);
        assertEquals(FormConstants.RT_FD_FORM_TEXT_DRAW_V1, text.getExportedType());
        Text textMock = Mockito.mock(Text.class);
        Mockito.when(textMock.getExportedType()).thenCallRealMethod();
        assertEquals("", textMock.getExportedType());
    }

    @Test
    void testFieldType() {
        Text text = Utils.getComponentUnderTest(PATH_TEXT_CUSTOMIZED, Text.class, context);
        assertEquals(FieldType.PLAIN_TEXT.getValue(), text.getFieldType());
    }

    @Test
    void testGetName() {
        Text text = Utils.getComponentUnderTest(PATH_TEXT_CUSTOMIZED, Text.class, context);
        assertEquals("abc", text.getName());
        Text textMock = Mockito.mock(Text.class);
        Mockito.when(textMock.getName()).thenCallRealMethod();
        assertEquals(null, textMock.getName());
    }

    @Test
    void testGetValue() {
        Text text = Utils.getComponentUnderTest(PATH_TEXT_CUSTOMIZED, Text.class, context);
        assertEquals("<p>xyz</p>", text.getValue());
        Text textMock = Mockito.mock(Text.class);
        Mockito.when(textMock.getValue()).thenCallRealMethod();
        assertEquals(null, textMock.getValue());
    }

    @Test
    void testIsRichText() {
        Text text = Utils.getComponentUnderTest(PATH_TEXT_CUSTOMIZED, Text.class, context);
        assertEquals(true, text.isRichText());
        Text textMock = Mockito.mock(Text.class);
        Mockito.when(textMock.isRichText()).thenCallRealMethod();
        assertEquals(false, textMock.isRichText());
    }

    @Test
    void testGetDataRef() {
        Text text = Utils.getComponentUnderTest(PATH_TEXT_CUSTOMIZED, Text.class, context);
        assertEquals("null", text.getDataRef());
        Text textMock = Mockito.mock(Text.class);
        Mockito.when(textMock.getDataRef()).thenCallRealMethod();
        assertEquals(null, textMock.getDataRef());
    }

    @Test
    void testIsVisible() {
        Text text = Utils.getComponentUnderTest(PATH_TEXT, Text.class, context);
        assertEquals(true, text.isVisible());
        Text textMock = Mockito.mock(Text.class);
        Mockito.when(textMock.isVisible()).thenCallRealMethod();
        assertEquals(null, textMock.isVisible());
    }

    @Test
    void testIsVisibleForCustomized() {
        Text text = Utils.getComponentUnderTest(PATH_TEXT_CUSTOMIZED, Text.class, context);
        assertEquals(true, text.isVisible());
        Text textMock = Mockito.mock(Text.class);
        Mockito.when(textMock.isVisible()).thenCallRealMethod();
        assertEquals(null, textMock.isVisible());
    }

    @Test
    void testJSONExport() throws Exception {
        Text text = Utils.getComponentUnderTest(PATH_TEXT, Text.class, context);
        Utils.testJSONExport(text, Utils.getTestExporterJSONPath(BASE, PATH_TEXT));
    }

    @Test
    void testJSONExportForCustomized() throws Exception {
        Text text = Utils.getComponentUnderTest(PATH_TEXT_CUSTOMIZED, Text.class, context);
        Utils.testJSONExport(text, Utils.getTestExporterJSONPath(BASE, PATH_TEXT_CUSTOMIZED));
    }

    @Test
    void testDataLayerProperties() throws IllegalAccessException {
        Text text = Utils.getComponentUnderTest(PATH_TEXT_DATALAYER, Text.class, context);
        FieldUtils.writeField(text, "dataLayerEnabled", true, true);
        FormComponentData dataObject = (FormComponentData) text.getData();
        assert (dataObject != null);
        assert (dataObject.getId()).equals("text-cfbea91bba");
        assert (dataObject.getType()).equals("core/fd/components/form/text/v1/text");
        assert (dataObject.getText()).equals("This is an AF");
        assert (dataObject.getFieldType()).equals("plain-text");
    }

    @Test
    void testJSONExportForDatalayer() throws Exception {
        Text text = Utils.getComponentUnderTest(PATH_TEXT_DATALAYER, Text.class, context);
        FieldUtils.writeField(text, "dataLayerEnabled", true, true);
        Utils.testJSONExport(text, Utils.getTestExporterJSONPath(BASE, PATH_TEXT_DATALAYER));
    }

    @Test
    void testDorProperties() {
        TextImpl textImpl = Utils.getComponentUnderTest(PATH_TEXT_CUSTOMIZED, TextImpl.class, context);
        assertEquals(true, textImpl.getDorProperties().get("dorExclusion"));
        assertEquals("4", textImpl.getDorProperties().get("dorColspan"));
    }

    @Test
    void testNoFieldType() {
        TextImpl text = Utils.getComponentUnderTest(PATH_TEXT_WITHOUT_FIELDTYPE, TextImpl.class, context);
        assertEquals(FieldType.PLAIN_TEXT.getValue(), text.getFieldType());
    }
}
