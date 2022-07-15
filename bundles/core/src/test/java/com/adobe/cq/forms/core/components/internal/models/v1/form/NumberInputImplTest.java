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
import com.adobe.cq.forms.core.components.models.form.Label;
import com.adobe.cq.forms.core.components.models.form.NumberInput;
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
public class NumberInputImplTest {
    private static final String BASE = "/form/numberinput";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_NUMBER_INPUT = CONTENT_ROOT + "/numberinput";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals(FormConstants.RT_FD_FORM_NUMBER_INPUT_V1, numberInput.getExportedType());
        NumberInput numberInputMock = Mockito.mock(NumberInput.class);
        Mockito.when(numberInputMock.getExportedType()).thenCallRealMethod();
        assertEquals("", numberInputMock.getExportedType());
    }

    @Test
    void testFieldType() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals(Base.FieldType.NUMBER_INPUT.getValue(), numberInput.getFieldType());
    }

    @Test
    void testGetLabel() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals("def", numberInput.getLabel().getValue());
        NumberInput numberInputMock = Mockito.mock(NumberInput.class);
        Mockito.when(numberInputMock.getLabel()).thenCallRealMethod();
        assertEquals(null, numberInputMock.getLabel());

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
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals("abc", numberInput.getName());
        NumberInput numberInputMock = Mockito.mock(NumberInput.class);
        Mockito.when(numberInputMock.getName()).thenCallRealMethod();
        assertEquals(null, numberInputMock.getName());
    }

    @Test
    void testGetDataRef() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals("a.b", numberInput.getDataRef());
        NumberInput numberInputMock = Mockito.mock(NumberInput.class);
        Mockito.when(numberInputMock.getDataRef()).thenCallRealMethod();
        assertEquals(null, numberInputMock.getDataRef());
    }

    @Test
    void testGetDescription() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals("dummy", numberInput.getDescription());
        NumberInput numberInputMock = Mockito.mock(NumberInput.class);
        Mockito.when(numberInputMock.getDescription()).thenCallRealMethod();
        assertEquals(null, numberInputMock.getDescription());
    }

    @Test
    void testGetScreenReaderText() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals("'Custom screen reader text'", numberInput.getScreenReaderText());
        NumberInput numberInputMock = Mockito.mock(NumberInput.class);
        Mockito.when(numberInputMock.getScreenReaderText()).thenCallRealMethod();
        assertEquals(null, numberInputMock.getScreenReaderText());
    }

    @Test
    void testIsVisible() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals(false, numberInput.isVisible());
        NumberInput numberInputMock = Mockito.mock(NumberInput.class);
        Mockito.when(numberInputMock.isVisible()).thenCallRealMethod();
        assertEquals(true, numberInputMock.isVisible());
    }

    @Test
    void testIsEnabled() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals(true, numberInput.isEnabled());
        NumberInput numberInputMock = Mockito.mock(NumberInput.class);
        Mockito.when(numberInputMock.isEnabled()).thenCallRealMethod();
        assertEquals(true, numberInputMock.isEnabled());
    }

    @Test
    void testIsReadOnly() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals(false, numberInput.isReadOnly());
        NumberInput numberInputMock = Mockito.mock(NumberInput.class);
        Mockito.when(numberInputMock.isReadOnly()).thenCallRealMethod();
        assertEquals(false, numberInputMock.isReadOnly());
    }

    @Test
    void testGetPlaceHolder() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals(null, numberInput.getPlaceHolder());
        NumberInput numberInputMock = Mockito.mock(NumberInput.class);
        Mockito.when(numberInputMock.getPlaceHolder()).thenCallRealMethod();
        assertEquals(null, numberInputMock.getPlaceHolder());
    }

    @Test
    void testGetDisplayFormat() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals(null, numberInput.getDisplayFormat());
        NumberInput numberInputMock = Mockito.mock(NumberInput.class);
        Mockito.when(numberInputMock.getDisplayFormat()).thenCallRealMethod();
        assertEquals(null, numberInputMock.getDisplayFormat());
    }

    @Test
    void testGetEditFormat() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals(null, numberInput.getEditFormat());
        NumberInput numberInputMock = Mockito.mock(NumberInput.class);
        Mockito.when(numberInputMock.getEditFormat()).thenCallRealMethod();
        assertEquals(null, numberInputMock.getEditFormat());
    }

    @Test
    void testGetDataFormat() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals(null, numberInput.getDataFormat());
        NumberInput numberInputMock = Mockito.mock(NumberInput.class);
        Mockito.when(numberInputMock.getDataFormat()).thenCallRealMethod();
        assertEquals(null, numberInputMock.getDataFormat());
    }

    @Test
    void testGetTooltip() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals("test-short-description", numberInput.getTooltip());
        NumberInput numberInputMock = Mockito.mock(NumberInput.class);
        Mockito.when(numberInputMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, numberInputMock.getTooltip());
    }

    @Test
    void testGetConstraintMessages() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        Map<Base.ConstraintType, String> constraintsMessages = numberInput.getConstraintMessages();
        assertEquals(constraintsMessages.get(Base.ConstraintType.TYPE), "incorrect type");
        NumberInput numberInputMock = Mockito.mock(NumberInput.class);
        Mockito.when(numberInputMock.getConstraintMessages()).thenCallRealMethod();
        assertEquals(Collections.emptyMap(), numberInputMock.getConstraintMessages());
    }

    @Test
    void testJSONExport() throws Exception {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        Utils.testJSONExport(numberInput, Utils.getTestExporterJSONPath(BASE, PATH_NUMBER_INPUT));
    }

    @Test
    void testGetProperties() throws Exception {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        Map<String, Object> properties = numberInput.getProperties();
        assertFalse(properties.isEmpty());
        // get custom properties of "af:layout"
        Map<String, Object> customProperties = (Map<String, Object>) properties.get(Base.CUSTOM_PROPERTY_WRAPPER);
        assertFalse((boolean) customProperties.get("tooltipVisible"));
    }

    @Test
    void testGetProperties_should_return_empty_if_no_custom_properties() {
        NumberInput numberInputMock = Mockito.mock(NumberInput.class);
        Mockito.when(numberInputMock.getProperties()).thenCallRealMethod();
        assertTrue(numberInputMock.getProperties().isEmpty());
    }

    @Test
    void testGetShortDescription() {
        NumberInput numberInputMock = Mockito.mock(NumberInput.class);
        Mockito.when(numberInputMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, numberInputMock.getTooltip());
    }

    @Test
    void testIsShortDescriptionVisible() {
        NumberInput numberInputMock = Mockito.mock(NumberInput.class);
        Mockito.when(numberInputMock.isTooltipVisible()).thenCallRealMethod();
        assertEquals(false, numberInputMock.isTooltipVisible());
    }

    @Test
    void testGetMinimum() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals(10000L, numberInput.getMinimum().longValue());
    }

    @Test
    void testGetMaximum() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals(2000000, numberInput.getMaximum().longValue());
    }

    @Test
    void testGetExclusiveMinimum() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals(10002L, numberInput.getExclusiveMinimum().longValue());
    }

    @Test
    void testGetExclusiveMaximum() {
        NumberInput numberInput = getNumberInputUnderTest(PATH_NUMBER_INPUT);
        assertEquals(2000002, numberInput.getExclusiveMaximum().longValue());
    }

    @Test
    void testStyleSystemClasses() {
        ComponentStyleInfo componentStyleInfoMock = mock(ComponentStyleInfo.class);
        Resource resource = spy(context.resourceResolver().getResource(PATH_NUMBER_INPUT));
        Mockito.doReturn(componentStyleInfoMock).when(resource).adaptTo(ComponentStyleInfo.class);
        MockSlingHttpServletRequest request = context.request();
        request.setResource(resource);
        Mockito.doReturn("mystyle").when(componentStyleInfoMock).getAppliedCssClasses();
        NumberInput numberInput = request.adaptTo(NumberInput.class);
        String appliedCssClasses = numberInput.getAppliedCssClasses();
        assertEquals("mystyle", appliedCssClasses);
    }

    private NumberInput getNumberInputUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(NumberInput.class);
    }
}
