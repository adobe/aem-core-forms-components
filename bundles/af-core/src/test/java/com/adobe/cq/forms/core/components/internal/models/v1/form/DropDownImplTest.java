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

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.reflect.FieldUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.datalayer.FormComponentData;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.*;
import com.adobe.cq.forms.core.components.models.form.BaseConstraint.Type;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.cq.wcm.style.ComponentStyleInfo;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;

@ExtendWith(AemContextExtension.class)
public class DropDownImplTest {
    private static final String BASE = "/form/dropdown";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_DROPDOWN_1 = CONTENT_ROOT + "/dropdown-1";
    private static final String PATH_MULTISELECT_DROPDOWN = CONTENT_ROOT + "/multiselect-dropdown";
    private static final String PATH_MULTISELECT_DROPDOWN_WITH_VARIANT_PROPERTY = CONTENT_ROOT + "/multiselect-dropdown-2";
    private static final String PATH_DROPDOWN2 = CONTENT_ROOT + "/dropdown2";

    private static final String PATH_DROPDOWN = CONTENT_ROOT + "/dropdown";
    private static final String PATH_DROPDOWN_DATALAYER = CONTENT_ROOT + "/dropdown-datalayer";

    private static final String PATH_DROPDOWN_WITH_DUPLICATE_ENUMS = CONTENT_ROOT + "/dropdown-duplicate-enum";
    private static final String PATH_DROPDOWN_FOR_INSERTION_ORDER = CONTENT_ROOT + "/dropdown-insertion-order";
    private static final String PATH_DROPDOWN_FOR_NO_ENUM_NAMES = CONTENT_ROOT + "/dropdown-without-enumNames";
    private static final String PATH_DROPDOWN_FOR_LESSER_ENUM_NAMES = CONTENT_ROOT + "/dropdown-with-lesser-enumNames";
    private static final String PATH_DROPDOWN_FOR_EXTRA_ENUM_NAMES = CONTENT_ROOT + "/dropdown-with-extra-enumNames";
    private static final String PATH_DROPDOWN_WITHOUT_FIELDTYPE = CONTENT_ROOT + "/dropdown-without-fieldtype";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertEquals(FormConstants.RT_FD_FORM_DROP_DOWN_V1, dropdown.getExportedType());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.getExportedType()).thenCallRealMethod();
        assertEquals("", dropdownMock.getExportedType());
    }

    @Test
    void testFieldType() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertEquals(FieldType.DROP_DOWN.getValue(), dropdown.getFieldType());
    }

    @Test
    void testGetLabel() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertEquals("def", dropdown.getLabel().getValue());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.getLabel()).thenCallRealMethod();
        assertEquals(null, dropdownMock.getLabel());

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
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertEquals("abc", dropdown.getName());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.getName()).thenCallRealMethod();
        assertEquals(null, dropdownMock.getName());
    }

    @Test
    void testGetDataRef() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertEquals("a.b", dropdown.getDataRef());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.getDataRef()).thenCallRealMethod();
        assertEquals(null, dropdownMock.getDataRef());
    }

    @Test
    void testGetDescription() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertEquals("dummy", dropdown.getDescription());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.getDescription()).thenCallRealMethod();
        assertEquals(null, dropdownMock.getDescription());
    }

    @Test
    void testGetScreenReaderText() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertEquals("'Custom screen reader text'", dropdown.getScreenReaderText());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.getScreenReaderText()).thenCallRealMethod();
        assertEquals(null, dropdownMock.getScreenReaderText());
    }

    @Test
    void testIsVisible() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN, DropDown.class, context);
        assertEquals(true, dropdown.isVisible());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.isVisible()).thenCallRealMethod();
        assertEquals(null, dropdownMock.isVisible());
    }

    @Test
    void testIsVisibleForCustomized() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertEquals(false, dropdown.isVisible());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.isVisible()).thenCallRealMethod();
        assertEquals(null, dropdownMock.isVisible());
    }

    @Test
    void testIsEnabled() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN, DropDown.class, context);
        assertEquals(true, dropdown.isEnabled());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.isEnabled()).thenCallRealMethod();
        assertEquals(null, dropdownMock.isEnabled());
    }

    @Test
    void testIsEnabledForCustomized() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertEquals(true, dropdown.isEnabled());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.isEnabled()).thenCallRealMethod();
        assertEquals(null, dropdownMock.isEnabled());
    }

    @Test
    void testIsReadOnly() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN, DropDown.class, context);
        assertEquals(false, dropdown.isReadOnly());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.isReadOnly()).thenCallRealMethod();
        assertEquals(null, dropdownMock.isReadOnly());
    }

    @Test
    void testIsReadOnlyForCustomized() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertEquals(false, dropdown.isReadOnly());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.isReadOnly()).thenCallRealMethod();
        assertEquals(null, dropdownMock.isReadOnly());
    }

    @Test
    void testIsRequired() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN, DropDown.class, context);
        assertEquals(false, dropdown.isRequired());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.isRequired()).thenCallRealMethod();
        assertEquals(null, dropdownMock.isRequired());
    }

    @Test
    void testIsRequiredForCustomized() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertEquals(false, dropdown.isRequired());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.isRequired()).thenCallRealMethod();
        assertEquals(null, dropdownMock.isRequired());
    }

    @Test
    void testGetPlaceHolder() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertEquals(null, dropdown.getPlaceHolder());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.getPlaceHolder()).thenCallRealMethod();
        assertEquals(null, dropdownMock.getPlaceHolder());
    }

    @Test
    void testGetDisplayFormat() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertEquals(null, dropdown.getDisplayFormat());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.getDisplayFormat()).thenCallRealMethod();
        assertEquals(null, dropdownMock.getDisplayFormat());
    }

    @Test
    void testGetEditFormat() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertEquals(null, dropdown.getEditFormat());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.getEditFormat()).thenCallRealMethod();
        assertEquals(null, dropdownMock.getEditFormat());
    }

    @Test
    void testGetDataFormat() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertEquals(null, dropdown.getDataFormat());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.getDataFormat()).thenCallRealMethod();
        assertEquals(null, dropdownMock.getDataFormat());
    }

    @Test
    void testGetTooltip() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertEquals("test-short-description", dropdown.getTooltip());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, dropdownMock.getTooltip());
    }

    @Test
    void testGetConstraintMessages() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        Map<ConstraintType, String> constraintsMessages = dropdown.getConstraintMessages();
        assertEquals(constraintsMessages.get(ConstraintType.TYPE), "incorrect type");
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.getConstraintMessages()).thenCallRealMethod();
        assertEquals(Collections.emptyMap(), dropdownMock.getConstraintMessages());
    }

    @Test
    void testJSONExport() throws Exception {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN, DropDown.class, context);
        Utils.testJSONExport(dropdown, Utils.getTestExporterJSONPath(BASE, PATH_DROPDOWN));
    }

    @Test
    void testJSONExportForDropDown1() throws Exception {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        Utils.testJSONExport(dropdown, Utils.getTestExporterJSONPath(BASE, PATH_DROPDOWN_1));
    }

    @Test
    void testMultiSelectJSONExport() throws Exception {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_MULTISELECT_DROPDOWN, DropDown.class, context);
        Utils.testJSONExport(dropdown, Utils.getTestExporterJSONPath(BASE, PATH_MULTISELECT_DROPDOWN));
    }

    @Test
    void testGetProperties() throws Exception {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        Map<String, Object> properties = dropdown.getProperties();
        assertFalse(properties.isEmpty());
        // get custom properties of "afs:layout"
        Map<String, Object> customProperties = (Map<String, Object>) properties.get(Base.CUSTOM_PROPERTY_WRAPPER);
        assertFalse((boolean) customProperties.get("tooltipVisible"));
    }

    @Test
    void testGetProperties_should_return_empty_if_no_custom_properties() {
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.getProperties()).thenCallRealMethod();
        assertTrue(dropdownMock.getProperties().isEmpty());
    }

    @Test
    void testGetShortDescription() {
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, dropdownMock.getTooltip());
    }

    @Test
    void testIsShortDescriptionVisible() {
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.isTooltipVisible()).thenCallRealMethod();
        assertEquals(false, dropdownMock.isTooltipVisible());
    }

    @Test
    void testGetEnum() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertArrayEquals(new Long[] { 0L, 1L, 2L }, dropdown.getEnums());
    }

    @Test
    void testDuplicateEnum() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_WITH_DUPLICATE_ENUMS, DropDown.class, context);
        Map<Object, String> map = new HashMap<>();
        map.put("0", "Item 1");
        map.put("1", "Item 2");
        map.put("0", "Item 3");
        assertArrayEquals(map.keySet().toArray(new Object[0]), dropdown.getEnums());
    }

    @Test
    void testGetType() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertEquals(BaseConstraint.Type.NUMBER, dropdown.getType());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.getType()).thenCallRealMethod();
        assertEquals(BaseConstraint.Type.STRING, dropdownMock.getType());
    }

    @Test
    void testGetMultiSelectType() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_MULTISELECT_DROPDOWN, DropDown.class, context);
        assertEquals(BaseConstraint.Type.NUMBER_ARRAY, dropdown.getType());
    }

    @Test
    void testGetMultiSelectDefault() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_MULTISELECT_DROPDOWN, DropDown.class, context);
        assertArrayEquals(new Long[] { 0L, 1L }, dropdown.getDefault());
    }

    @Test
    void testGetMultiSelectDefault_WithDiffProperty() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_MULTISELECT_DROPDOWN_WITH_VARIANT_PROPERTY, DropDown.class, context);
        assertArrayEquals(new Long[] { 0L, 1L }, dropdown.getDefault());
    }

    @Test
    void testGetMultiSelectDefault_InvalidType() throws IllegalAccessException {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN2, DropDown.class, context);
        FieldUtils.writeField(dropdown, "type", Type.NUMBER, true);
        assertNull(dropdown.getDefault());
    }

    @Test
    void testGetMultiSelectMinItems() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_MULTISELECT_DROPDOWN, DropDown.class, context);
        assertEquals(1, dropdown.getMinItems().intValue());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.getMinItems()).thenCallRealMethod();
        assertEquals(null, dropdownMock.getMinItems());
    }

    @Test
    void testGetMultiSelectMaxItems() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_MULTISELECT_DROPDOWN, DropDown.class, context);
        assertEquals(2, dropdown.getMaxItems().intValue());
        DropDown dropdownMock = Mockito.mock(DropDown.class);
        Mockito.when(dropdownMock.getMaxItems()).thenCallRealMethod();
        assertEquals(null, dropdownMock.getMaxItems());
    }

    @Test
    void testGetEnumNames() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_1, DropDown.class, context);
        assertArrayEquals(new String[] { "m", "f", "o" }, dropdown.getEnumNames());
    }

    @Test
    void testGetEnumNamesWithDuplicateEnumValues() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_WITH_DUPLICATE_ENUMS, DropDown.class, context);
        Map<Object, String> map = new HashMap<>();
        map.put("0", "Item 1");
        map.put("1", "Item 2");
        map.put("0", "Item 3");
        assertArrayEquals(map.values().toArray(new String[0]), dropdown.getEnumNames());
    }

    @Test
    void testStyleSystemClasses() {
        ComponentStyleInfo componentStyleInfoMock = mock(ComponentStyleInfo.class);
        Resource resource = spy(context.resourceResolver().getResource(PATH_DROPDOWN_1));
        Mockito.doReturn(componentStyleInfoMock).when(resource).adaptTo(ComponentStyleInfo.class);
        MockSlingHttpServletRequest request = context.request();
        request.setResource(resource);
        Mockito.doReturn("mystyle").when(componentStyleInfoMock).getAppliedCssClasses();
        DropDown dropdown = request.adaptTo(DropDown.class);
        String appliedCssClasses = dropdown.getAppliedCssClasses();
        assertEquals("mystyle", appliedCssClasses);
    }

    @Test
    void testDataLayerProperties() throws IllegalAccessException {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_DATALAYER, DropDown.class, context);
        FieldUtils.writeField(dropdown, "dataLayerEnabled", true, true);
        FormComponentData dataObject = (FormComponentData) dropdown.getData();
        assert (dataObject != null);
        assert (dataObject.getId()).equals("dropdown-bb1c9e883e");
        assert (dataObject.getType()).equals("core/fd/components/form/dropdown/v1/dropdown");
        assert (dataObject.getTitle()).equals("Favorite Animal");
        assert (dataObject.getFieldType()).equals("drop-down");
        assert (dataObject.getDescription()).equals("What is your favorite animal?");
    }

    @Test
    void testJSONExportDataLayer() throws Exception {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_DATALAYER, DropDown.class, context);
        FieldUtils.writeField(dropdown, "dataLayerEnabled", true, true);
        Utils.testJSONExport(dropdown, Utils.getTestExporterJSONPath(BASE, PATH_DROPDOWN_DATALAYER));
    }

    @Test
    void testInsertionOrderForEnums() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_FOR_INSERTION_ORDER, DropDown.class, context);
        Set<String> set = new LinkedHashSet<>(Arrays.asList("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14",
            "15", "16", "17", "18", "19", "20"));
        assertArrayEquals(set.toArray(new String[0]), dropdown.getEnums());
    }

    @Test
    void testInsertionOrderForEnumNames() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_FOR_INSERTION_ORDER, DropDown.class, context);
        Set<String> set = new LinkedHashSet<>(Arrays.asList("Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
            "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"));
        assertArrayEquals(set.toArray(new String[0]), dropdown.getEnumNames());
    }

    @Test
    void testEnumsWithoutEnumNames() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_FOR_NO_ENUM_NAMES, DropDown.class, context);
        Set<String> set = new LinkedHashSet<>(Arrays.asList("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14",
            "15", "16", "17", "18", "19", "20"));
        assertArrayEquals(set.toArray(new String[0]), dropdown.getEnums());
        assertNull(dropdown.getEnumNames());
    }

    @Test
    void testEnumsWithLesserEnumNames() {
        DropDown dropdown1 = Utils.getComponentUnderTest(PATH_DROPDOWN_FOR_LESSER_ENUM_NAMES, DropDown.class, context);
        Set<String> set1 = new LinkedHashSet<>(Arrays.asList("zero", "one", "two", "three", "4", "5", "6", "7", "8", "9"));
        assertArrayEquals(set1.toArray(new String[0]), dropdown1.getEnumNames());
    }

    @Test
    void testEnumsWithExtraEnumNames() {
        DropDown dropdown2 = Utils.getComponentUnderTest(PATH_DROPDOWN_FOR_EXTRA_ENUM_NAMES, DropDown.class, context);
        Set<String> set2 = new LinkedHashSet<>(Arrays.asList("zero", "one"));
        assertArrayEquals(set2.toArray(new String[0]), dropdown2.getEnumNames());
    }

    @Test
    void testNoFieldType() {
        DropDown dropdown = Utils.getComponentUnderTest(PATH_DROPDOWN_WITHOUT_FIELDTYPE, DropDown.class, context);
        Utils.testJSONExport(dropdown, Utils.getTestExporterJSONPath(BASE, PATH_DROPDOWN_WITHOUT_FIELDTYPE));
    }
}
