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
import com.adobe.cq.forms.core.components.models.form.CheckBox;
import com.adobe.cq.forms.core.components.models.form.ConstraintType;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.Label;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.cq.wcm.style.ComponentStyleInfo;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;

@ExtendWith(AemContextExtension.class)
public class CheckBoxImplTest {
    private static final String BASE = "/form/checkbox";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_CHECKBOX = CONTENT_ROOT + "/checkbox";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        assertEquals(FormConstants.RT_FD_FORM_CHECKBOX_V1, checkbox.getExportedType());
        CheckBox checkboxMock = Mockito.mock(CheckBox.class);
        Mockito.when(checkboxMock.getExportedType()).thenCallRealMethod();
        assertEquals("", checkboxMock.getExportedType());
    }

    @Test
    void testFieldType() {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        assertEquals(FieldType.CHECKBOX.getValue(), checkbox.getFieldType());
    }

    @Test
    void testGetLabel() {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        assertEquals("def", checkbox.getLabel().getValue());
        CheckBox checkboxMock = Mockito.mock(CheckBox.class);
        Mockito.when(checkboxMock.getLabel()).thenCallRealMethod();
        assertEquals(null, checkboxMock.getLabel());

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
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        assertEquals("abc", checkbox.getName());
        CheckBox checkboxMock = Mockito.mock(CheckBox.class);
        Mockito.when(checkboxMock.getName()).thenCallRealMethod();
        assertEquals(null, checkboxMock.getName());
    }

    @Test
    void testGetDataRef() {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        assertEquals("a.b", checkbox.getDataRef());
        CheckBox checkboxMock = Mockito.mock(CheckBox.class);
        Mockito.when(checkboxMock.getDataRef()).thenCallRealMethod();
        assertEquals(null, checkboxMock.getDataRef());
    }

    @Test
    void testGetDescription() {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        assertEquals("dummy", checkbox.getDescription());
        CheckBox checkboxMock = Mockito.mock(CheckBox.class);
        Mockito.when(checkboxMock.getDescription()).thenCallRealMethod();
        assertEquals(null, checkboxMock.getDescription());
    }

    @Test
    void testGetScreenReaderText() {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        assertEquals("'Custom screen reader text'", checkbox.getScreenReaderText());
        CheckBox checkboxMock = Mockito.mock(CheckBox.class);
        Mockito.when(checkboxMock.getScreenReaderText()).thenCallRealMethod();
        assertEquals(null, checkboxMock.getScreenReaderText());
    }

    @Test
    void testIsVisible() {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        assertEquals(false, checkbox.isVisible());
        CheckBox checkboxMock = Mockito.mock(CheckBox.class);
        Mockito.when(checkboxMock.isVisible()).thenCallRealMethod();
        assertEquals(true, checkboxMock.isVisible());
    }

    @Test
    void testIsEnabled() {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        assertEquals(true, checkbox.isEnabled());
        CheckBox checkboxMock = Mockito.mock(CheckBox.class);
        Mockito.when(checkboxMock.isEnabled()).thenCallRealMethod();
        assertEquals(true, checkboxMock.isEnabled());
    }

    @Test
    void testIsReadOnly() {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        assertEquals(false, checkbox.isReadOnly());
        CheckBox checkboxMock = Mockito.mock(CheckBox.class);
        Mockito.when(checkboxMock.isReadOnly()).thenCallRealMethod();
        assertEquals(false, checkboxMock.isReadOnly());
    }

    @Test
    void testGetPlaceHolder() {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        assertEquals(null, checkbox.getPlaceHolder());
        CheckBox checkboxMock = Mockito.mock(CheckBox.class);
        Mockito.when(checkboxMock.getPlaceHolder()).thenCallRealMethod();
        assertEquals(null, checkboxMock.getPlaceHolder());
    }

    @Test
    void testGetDisplayFormat() {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        assertEquals(null, checkbox.getDisplayFormat());
        CheckBox checkboxMock = Mockito.mock(CheckBox.class);
        Mockito.when(checkboxMock.getDisplayFormat()).thenCallRealMethod();
        assertEquals(null, checkboxMock.getDisplayFormat());
    }

    @Test
    void testGetEditFormat() {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        assertEquals(null, checkbox.getEditFormat());
        CheckBox checkboxMock = Mockito.mock(CheckBox.class);
        Mockito.when(checkboxMock.getEditFormat()).thenCallRealMethod();
        assertEquals(null, checkboxMock.getEditFormat());
    }

    @Test
    void testGetDataFormat() {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        assertEquals(null, checkbox.getDataFormat());
        CheckBox checkboxMock = Mockito.mock(CheckBox.class);
        Mockito.when(checkboxMock.getDataFormat()).thenCallRealMethod();
        assertEquals(null, checkboxMock.getDataFormat());
    }

    @Test
    void testGetTooltip() {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        assertEquals("test-short-description", checkbox.getTooltip());
        CheckBox checkboxMock = Mockito.mock(CheckBox.class);
        Mockito.when(checkboxMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, checkboxMock.getTooltip());
    }

    @Test
    void testGetConstraintMessages() {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        Map<ConstraintType, String> constraintsMessages = checkbox.getConstraintMessages();
        assertEquals(constraintsMessages.get(ConstraintType.TYPE), "incorrect type");
        CheckBox checkboxMock = Mockito.mock(CheckBox.class);
        Mockito.when(checkboxMock.getConstraintMessages()).thenCallRealMethod();
        assertEquals(Collections.emptyMap(), checkboxMock.getConstraintMessages());
    }

    @Test
    void testJSONExport() throws Exception {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        Utils.testJSONExport(checkbox, Utils.getTestExporterJSONPath(BASE, PATH_CHECKBOX));
    }

    @Test
    void testGetProperties() throws Exception {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        Map<String, Object> properties = checkbox.getProperties();
        assertFalse(properties.isEmpty());
        // get custom properties of "afs:layout"
        Map<String, Object> customProperties = (Map<String, Object>) properties.get(Base.CUSTOM_PROPERTY_WRAPPER);
        assertFalse((boolean) customProperties.get("tooltipVisible"));
    }

    @Test
    void testGetProperties_should_return_empty_if_no_custom_properties() {
        CheckBox checkboxMock = Mockito.mock(CheckBox.class);
        Mockito.when(checkboxMock.getProperties()).thenCallRealMethod();
        assertTrue(checkboxMock.getProperties().isEmpty());
    }

    @Test
    void testGetShortDescription() {
        CheckBox checkboxMock = Mockito.mock(CheckBox.class);
        Mockito.when(checkboxMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, checkboxMock.getTooltip());
    }

    @Test
    void testIsShortDescriptionVisible() {
        CheckBox checkboxMock = Mockito.mock(CheckBox.class);
        Mockito.when(checkboxMock.isTooltipVisible()).thenCallRealMethod();
        assertEquals(false, checkboxMock.isTooltipVisible());
    }

    @Test
    void testGetEnum() {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        assertArrayEquals(new Boolean[] { true, false }, checkbox.getEnums());
    }

    @Test
    void testGetEnumNames() {
        CheckBox checkbox = getCheckBoxUnderTest(PATH_CHECKBOX);
        assertArrayEquals(new String[] { "yes", "no" }, checkbox.getEnumNames());
    }

    @Test
    void testStyleSystemClasses() {
        ComponentStyleInfo componentStyleInfoMock = mock(ComponentStyleInfo.class);
        Resource resource = spy(context.resourceResolver().getResource(PATH_CHECKBOX));
        Mockito.doReturn(componentStyleInfoMock).when(resource).adaptTo(ComponentStyleInfo.class);
        MockSlingHttpServletRequest request = context.request();
        request.setResource(resource);
        Mockito.doReturn("mystyle").when(componentStyleInfoMock).getAppliedCssClasses();
        CheckBox checkbox = request.adaptTo(CheckBox.class);
        String appliedCssClasses = checkbox.getAppliedCssClasses();
        assertEquals("mystyle", appliedCssClasses);
    }

    private CheckBox getCheckBoxUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(CheckBox.class);
    }
}
