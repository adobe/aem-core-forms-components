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
import com.adobe.cq.forms.core.components.models.form.CheckBoxGroup;
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
public class CheckBoxGroupImplTest {
    private static final String BASE = "/form/checkboxgroup";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_CHECKBOX_GROUP = CONTENT_ROOT + "/checkboxgroup";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals(FormConstants.RT_FD_FORM_CHECKBOX_GROUP_V1, checkboxGroup.getExportedType());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getExportedType()).thenCallRealMethod();
        assertEquals("", checkboxGroupMock.getExportedType());
    }

    @Test
    void testFieldType() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals(FieldType.CHECKBOX_GROUP.getValue(), checkboxGroup.getFieldType());
    }

    @Test
    void testGetLabel() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals("def", checkboxGroup.getLabel().getValue());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getLabel()).thenCallRealMethod();
        assertEquals(null, checkboxGroupMock.getLabel());

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
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals("abc", checkboxGroup.getName());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getName()).thenCallRealMethod();
        assertEquals(null, checkboxGroupMock.getName());
    }

    @Test
    void testGetDataRef() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals("a.b", checkboxGroup.getDataRef());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getDataRef()).thenCallRealMethod();
        assertEquals(null, checkboxGroupMock.getDataRef());
    }

    @Test
    void testGetDescription() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals("dummy", checkboxGroup.getDescription());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getDescription()).thenCallRealMethod();
        assertEquals(null, checkboxGroupMock.getDescription());
    }

    @Test
    void testGetScreenReaderText() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals("'Custom screen reader text'", checkboxGroup.getScreenReaderText());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getScreenReaderText()).thenCallRealMethod();
        assertEquals(null, checkboxGroupMock.getScreenReaderText());
    }

    @Test
    void testIsVisible() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals(false, checkboxGroup.isVisible());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.isVisible()).thenCallRealMethod();
        assertEquals(true, checkboxGroupMock.isVisible());
    }

    @Test
    void testIsEnabled() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals(true, checkboxGroup.isEnabled());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.isEnabled()).thenCallRealMethod();
        assertEquals(true, checkboxGroupMock.isEnabled());
    }

    @Test
    void testIsReadOnly() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals(false, checkboxGroup.isReadOnly());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.isReadOnly()).thenCallRealMethod();
        assertEquals(false, checkboxGroupMock.isReadOnly());
    }

    @Test
    void testGetPlaceHolder() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals(null, checkboxGroup.getPlaceHolder());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getPlaceHolder()).thenCallRealMethod();
        assertEquals(null, checkboxGroupMock.getPlaceHolder());
    }

    @Test
    void testGetDisplayFormat() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals(null, checkboxGroup.getDisplayFormat());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getDisplayFormat()).thenCallRealMethod();
        assertEquals(null, checkboxGroupMock.getDisplayFormat());
    }

    @Test
    void testGetEditFormat() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals(null, checkboxGroup.getEditFormat());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getEditFormat()).thenCallRealMethod();
        assertEquals(null, checkboxGroupMock.getEditFormat());
    }

    @Test
    void testGetDataFormat() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals(null, checkboxGroup.getDataFormat());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getDataFormat()).thenCallRealMethod();
        assertEquals(null, checkboxGroupMock.getDataFormat());
    }

    @Test
    void testGetTooltip() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals("test-short-description", checkboxGroup.getTooltip());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, checkboxGroupMock.getTooltip());
    }

    @Test
    void testGetConstraintMessages() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        Map<ConstraintType, String> constraintsMessages = checkboxGroup.getConstraintMessages();
        assertEquals(constraintsMessages.get(ConstraintType.TYPE), "incorrect type");
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getConstraintMessages()).thenCallRealMethod();
        assertEquals(Collections.emptyMap(), checkboxGroupMock.getConstraintMessages());
    }

    @Test
    void testJSONExport() throws Exception {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        Utils.testJSONExport(checkboxGroup, Utils.getTestExporterJSONPath(BASE, PATH_CHECKBOX_GROUP));
    }

    @Test
    void testGetProperties() throws Exception {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        Map<String, Object> properties = checkboxGroup.getProperties();
        assertFalse(properties.isEmpty());
        // get custom properties of "afs:layout"
        Map<String, Object> customProperties = (Map<String, Object>) properties.get(Base.CUSTOM_PROPERTY_WRAPPER);
        assertFalse((boolean) customProperties.get("tooltipVisible"));
    }

    @Test
    void testGetProperties_should_return_empty_if_no_custom_properties() {
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getProperties()).thenCallRealMethod();
        assertTrue(checkboxGroupMock.getProperties().isEmpty());
    }

    @Test
    void testGetShortDescription() {
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, checkboxGroupMock.getTooltip());
    }

    @Test
    void testIsShortDescriptionVisible() {
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.isTooltipVisible()).thenCallRealMethod();
        assertEquals(false, checkboxGroupMock.isTooltipVisible());
    }

    @Test
    void testGetEnum() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertArrayEquals(new Long[] { 0L, 1L, 2L }, checkboxGroup.getEnums());
    }

    @Test
    void testEnforceEnum() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals(true, checkboxGroup.isEnforceEnum());
    }

    @Test
    void testGetDefault() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertArrayEquals(new Long[] { 0L, 1L }, checkboxGroup.getDefault());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getDefault()).thenCallRealMethod();
        assertEquals(null, checkboxGroupMock.getDefault());
    }

    @Test
    void testGetType() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals(BaseConstraint.Type.NUMBER_ARRAY, checkboxGroup.getType());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getType()).thenCallRealMethod();
        assertEquals(BaseConstraint.Type.STRING, checkboxGroupMock.getType());
    }

    @Test
    void testGetEnumNames() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertArrayEquals(new String[] { "m", "f", "o" }, checkboxGroup.getEnumNames());
    }

    @Test
    void testGetMinItems() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals(1, checkboxGroup.getMinItems().intValue());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getMinItems()).thenCallRealMethod();
        assertEquals(null, checkboxGroupMock.getMinItems());
    }

    @Test
    void testGetMaxItems() {
        CheckBoxGroup checkboxGroup = getCheckBoxGroupUnderTest(PATH_CHECKBOX_GROUP);
        assertEquals(2, checkboxGroup.getMaxItems().intValue());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getMaxItems()).thenCallRealMethod();
        assertEquals(null, checkboxGroupMock.getMaxItems());
    }

    @Test
    void testStyleSystemClasses() {
        ComponentStyleInfo componentStyleInfoMock = mock(ComponentStyleInfo.class);
        Resource resource = spy(context.resourceResolver().getResource(PATH_CHECKBOX_GROUP));
        Mockito.doReturn(componentStyleInfoMock).when(resource).adaptTo(ComponentStyleInfo.class);
        MockSlingHttpServletRequest request = context.request();
        request.setResource(resource);
        Mockito.doReturn("mystyle").when(componentStyleInfoMock).getAppliedCssClasses();
        CheckBoxGroup checkboxGroup = request.adaptTo(CheckBoxGroup.class);
        String appliedCssClasses = checkboxGroup.getAppliedCssClasses();
        assertEquals("mystyle", appliedCssClasses);
    }

    private CheckBoxGroup getCheckBoxGroupUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(CheckBoxGroup.class);
    }
}
