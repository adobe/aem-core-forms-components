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
import com.adobe.cq.forms.core.components.models.form.*;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.cq.wcm.style.ComponentStyleInfo;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;

@ExtendWith(AemContextExtension.class)
public class SwitchImplTest {
    private static final String BASE = "/form/switch";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_SWITCH = CONTENT_ROOT + "/switch";

    private static final String PATH_SWITCH_CUSTOMIZED = CONTENT_ROOT + "/switch-customized";

    private static final String PATH_SWITCH_ENABLEUNCHECKEDOFF = CONTENT_ROOT + "/switch-enableUncheckedValueFalse";
    private static final String PATH_SWITCH_ENABLEUNCHECKED_BOOLEAN = CONTENT_ROOT + "/switch-boolean";
    private static final String PATH_SWITCH_ENABLEUNCHECKEDOFF_BOOLEAN = CONTENT_ROOT + "/switch-enableUncheckedValueFalse-boolean";
    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        assertEquals(FormConstants.RT_FD_FORM_SWITCH_V1, switchObj.getExportedType());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.getExportedType()).thenCallRealMethod();
        assertEquals("", switchMock.getExportedType());
    }

    @Test
    void testFieldType() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        assertEquals(FieldType.CHECKBOX.getValue(), switchObj.getFieldType());
    }

    @Test
    void testGetLabel() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        assertEquals("def", switchObj.getLabel().getValue());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.getLabel()).thenCallRealMethod();
        assertEquals(null, switchMock.getLabel());

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
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        assertEquals("abc", switchObj.getName());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.getName()).thenCallRealMethod();
        assertEquals(null, switchMock.getName());
    }

    @Test
    void testGetDataRef() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        assertEquals("a.b", switchObj.getDataRef());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.getDataRef()).thenCallRealMethod();
        assertEquals(null, switchMock.getDataRef());
    }

    @Test
    void testGetDescription() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        assertEquals("dummy", switchObj.getDescription());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.getDescription()).thenCallRealMethod();
        assertEquals(null, switchMock.getDescription());
    }

    @Test
    void testGetScreenReaderText() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        assertEquals("'Custom screen reader text'", switchObj.getScreenReaderText());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.getScreenReaderText()).thenCallRealMethod();
        assertEquals(null, switchMock.getScreenReaderText());
    }

    @Test
    void testIsVisible() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        assertEquals(null, switchObj.isVisible());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.isVisible()).thenCallRealMethod();
        assertEquals(null, switchMock.isVisible());
    }

    @Test
    void testIsVisibleForCustomizedSwitch() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH_CUSTOMIZED);
        assertEquals(false, switchObj.isVisible());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.isVisible()).thenCallRealMethod();
        assertEquals(null, switchMock.isVisible());
    }

    @Test
    void testIsEnabled() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        assertEquals(null, switchObj.isEnabled());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.isEnabled()).thenCallRealMethod();
        assertEquals(null, switchMock.isEnabled());
    }

    @Test
    void testIsEnabledForCustomizedSwitch() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH_CUSTOMIZED);
        assertEquals(false, switchObj.isEnabled());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.isEnabled()).thenCallRealMethod();
        assertEquals(null, switchMock.isEnabled());
    }

    @Test
    void testIsReadOnly() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        assertEquals(null, switchObj.isReadOnly());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.isReadOnly()).thenCallRealMethod();
        assertEquals(null, switchMock.isReadOnly());
    }

    @Test
    void testIsReadOnlyForCustomizedSwitch() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH_CUSTOMIZED);
        assertEquals(true, switchObj.isReadOnly());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.isReadOnly()).thenCallRealMethod();
        assertEquals(null, switchMock.isReadOnly());
    }

    @Test
    void testIsRequired() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        assertEquals(null, switchObj.isRequired());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.isRequired()).thenCallRealMethod();
        assertEquals(null, switchMock.isRequired());
    }

    @Test
    void testIsRequiredForCustomizedSwitch() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH_CUSTOMIZED);
        assertEquals(true, switchObj.isRequired());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.isRequired()).thenCallRealMethod();
        assertEquals(null, switchMock.isRequired());
    }

    @Test
    void testGetPlaceHolder() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        assertEquals(null, switchObj.getPlaceHolder());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.getPlaceHolder()).thenCallRealMethod();
        assertEquals(null, switchMock.getPlaceHolder());
    }

    @Test
    void testGetDisplayFormat() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        assertEquals(null, switchObj.getDisplayFormat());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.getDisplayFormat()).thenCallRealMethod();
        assertEquals(null, switchMock.getDisplayFormat());
    }

    @Test
    void testGetEditFormat() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        assertEquals(null, switchObj.getEditFormat());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.getEditFormat()).thenCallRealMethod();
        assertEquals(null, switchMock.getEditFormat());
    }

    @Test
    void testGetDataFormat() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        assertEquals(null, switchObj.getDataFormat());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.getDataFormat()).thenCallRealMethod();
        assertEquals(null, switchMock.getDataFormat());
    }

    @Test
    void testGetTooltip() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        assertEquals("test-short-description", switchObj.getTooltip());
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, switchMock.getTooltip());
    }

    @Test
    void testGetConstraintMessages() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        Map<ConstraintType, String> constraintsMessages = switchObj.getConstraintMessages();
        assertEquals(constraintsMessages.get(ConstraintType.TYPE), "incorrect type");
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.getConstraintMessages()).thenCallRealMethod();
        assertEquals(Collections.emptyMap(), switchMock.getConstraintMessages());
    }

    @Test
    void testJSONExport() throws Exception {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        Utils.testJSONExport(switchObj, Utils.getTestExporterJSONPath(BASE, PATH_SWITCH));
    }

    @Test
    void testJSONExportForCustomized() throws Exception {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH_CUSTOMIZED);
        Utils.testJSONExport(switchObj, Utils.getTestExporterJSONPath(BASE, PATH_SWITCH_CUSTOMIZED));
    }

    @Test
    void testGetProperties() throws Exception {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        Map<String, Object> properties = switchObj.getProperties();
        assertFalse(properties.isEmpty());
        // get custom properties of "afs:layout"
        Map<String, Object> customProperties = (Map<String, Object>) properties.get(Base.CUSTOM_PROPERTY_WRAPPER);
        assertFalse((boolean) customProperties.get("tooltipVisible"));
    }

    @Test
    void testGetProperties_should_return_empty_if_no_custom_properties() {
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.getProperties()).thenCallRealMethod();
        assertTrue(switchMock.getProperties().isEmpty());
    }

    @Test
    void testGetShortDescription() {
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, switchMock.getTooltip());
    }

    @Test
    void testIsShortDescriptionVisible() {
        Switch switchMock = Mockito.mock(Switch.class);
        Mockito.when(switchMock.isTooltipVisible()).thenCallRealMethod();
        assertEquals(false, switchMock.isTooltipVisible());
    }

    @Test
    void testGetEnum() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH);
        assertArrayEquals(new String[] { "OFF", "ON" }, switchObj.getEnumNames());
        assertArrayEquals(new String[] { "0", "1" }, switchObj.getEnums());
    }

    @Test
    void testStyleSystemClasses() {
        ComponentStyleInfo componentStyleInfoMock = mock(ComponentStyleInfo.class);
        Resource resource = spy(context.resourceResolver().getResource(PATH_SWITCH));
        Mockito.doReturn(componentStyleInfoMock).when(resource).adaptTo(ComponentStyleInfo.class);
        MockSlingHttpServletRequest request = context.request();
        request.setResource(resource);
        Mockito.doReturn("mystyle").when(componentStyleInfoMock).getAppliedCssClasses();
        Switch switchObj = request.adaptTo(Switch.class);
        String appliedCssClasses = switchObj.getAppliedCssClasses();
        assertEquals("mystyle", appliedCssClasses);
    }

    @Test
    void shouldOnlyHaveOnEnumIfEnableUncheckedValueOff() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH_ENABLEUNCHECKEDOFF);
        assertArrayEquals(new String[] { "1" }, switchObj.getEnums());
    }

    @Test
    void shouldOnlyHaveOnEnumValueIfEnableUncheckedValueOff() {
        Switch switchObj = getSwitchUnderTest(PATH_SWITCH_ENABLEUNCHECKEDOFF);
        assertArrayEquals(new String[] { "ON" }, switchObj.getEnumNames());
    }

    @Test
    void shouldOnlyHaveOnEnumAndEnumValueIfEnableUncheckedValueOffBoolean() {
        Switch switchObjBool = getSwitchUnderTest(PATH_SWITCH_ENABLEUNCHECKEDOFF_BOOLEAN);
        assertArrayEquals(new Boolean[] { true }, switchObjBool.getEnums());
        assertArrayEquals(new String[] { "true" }, switchObjBool.getEnumNames());
    }

    @Test
    void shouldOnlyHaveOnEnumAndEnumValueIfEnableUncheckedValueOnBoolean() {
        Switch switchObjBool = getSwitchUnderTest(PATH_SWITCH_ENABLEUNCHECKED_BOOLEAN);
        assertArrayEquals(new Boolean[] { true, false }, switchObjBool.getEnums());
        assertArrayEquals(new String[] { "true", "false" }, switchObjBool.getEnumNames());
    }

    private Switch getSwitchUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(Switch.class);
    }
}
