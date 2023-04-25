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

import org.apache.commons.lang3.reflect.FieldUtils;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
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
import static org.junit.Assert.assertArrayEquals;

@ExtendWith(AemContextExtension.class)
public class RadioButtonImplTest {
    private static final String BASE = "/form/radiobutton";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_RADIOBUTTON_CUSTOMIZED = CONTENT_ROOT + "/radiobutton-customized";
    private static final String PATH_RADIOBUTTON = CONTENT_ROOT + "/radiobutton";
    private static final String PATH_RADIOBUTTON_DATALAYER = CONTENT_ROOT + "/radiobutton-datalayer";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals(FormConstants.RT_FD_FORM_RADIO_BUTTON_V1, radioButton.getExportedType());
        CheckBoxGroup checkboxGroupMock = Mockito.mock(CheckBoxGroup.class);
        Mockito.when(checkboxGroupMock.getExportedType()).thenCallRealMethod();
        assertEquals("", checkboxGroupMock.getExportedType());
    }

    @Test
    void testFieldType() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals(FieldType.RADIO_GROUP.getValue(), radioButton.getFieldType());
    }

    @Test
    void testGetLabel() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals("Radio Button", radioButton.getLabel().getValue());
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.getLabel()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.getLabel());

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
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals("radiobutton_12345", radioButton.getName());
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.getName()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.getName());
    }

    @Test
    void testGetDataRef() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals("a.b", radioButton.getDataRef());
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.getDataRef()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.getDataRef());
    }

    @Test
    void testGetDescription() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals("long description", radioButton.getDescription());
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.getDescription()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.getDescription());
    }

    @Test
    void testGetScreenReaderText() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals("'custom text'", radioButton.getScreenReaderText());
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.getScreenReaderText()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.getScreenReaderText());
    }

    @Test
    void testIsVisible() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON);
        assertEquals(null, radioButton.isVisible());
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.isVisible()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.isVisible());
    }

    @Test
    void testIsVisibleForCustomized() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals(false, radioButton.isVisible());
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.isVisible()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.isVisible());
    }

    @Test
    void testIsEnabled() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON);
        assertEquals(null, radioButton.isEnabled());
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.isEnabled()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.isEnabled());
    }

    @Test
    void testIsEnabledForCustomized() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals(true, radioButton.isEnabled());
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.isEnabled()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.isEnabled());
    }

    @Test
    void testIsReadOnly() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON);
        assertEquals(null, radioButton.isReadOnly());
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.isReadOnly()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.isReadOnly());
    }

    @Test
    void testIsReadOnlyForCustomized() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals(true, radioButton.isReadOnly());
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.isReadOnly()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.isReadOnly());
    }

    @Test
    void testGetPlaceHolder() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals(null, radioButton.getPlaceHolder());
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.getPlaceHolder()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.getPlaceHolder());
    }

    @Test
    void testGetDisplayFormat() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals(null, radioButton.getDisplayFormat());
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.getDisplayFormat()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.getDisplayFormat());
    }

    @Test
    void testGetEditFormat() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals(null, radioButton.getEditFormat());
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.getEditFormat()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.getEditFormat());
    }

    @Test
    void testGetDataFormat() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals(null, radioButton.getDataFormat());
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.getDataFormat()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.getDataFormat());
    }

    @Test
    void testGetTooltip() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals("<p>short description</p>", radioButton.getTooltip());
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.getTooltip());
    }

    @Test
    void testGetConstraintMessages() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        Map<ConstraintType, String> constraintsMessages = radioButton.getConstraintMessages();
        assertEquals(constraintsMessages.get(ConstraintType.TYPE), null);
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.getConstraintMessages()).thenCallRealMethod();
        assertEquals(Collections.emptyMap(), radioButtonMock.getConstraintMessages());
    }

    @Test
    void testGetProperties() throws Exception {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        Map<String, Object> properties = radioButton.getProperties();
        assertFalse(properties.isEmpty());
        // get custom properties of "af:layout"
        Map<String, Object> customProperties = (Map<String, Object>) properties.get(Base.CUSTOM_PROPERTY_WRAPPER);
        assertTrue((boolean) customProperties.get("tooltipVisible"));
        assertEquals(CheckBox.Orientation.VERTICAL.getValue(), customProperties.get("orientation"));
    }

    @Test
    void testGetProperties_should_return_empty_if_no_custom_properties() {
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.getProperties()).thenCallRealMethod();
        assertTrue(radioButtonMock.getProperties().isEmpty());
    }

    @Test
    void testGetShortDescription() {
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.getTooltip());
    }

    @Test
    void testIsShortDescriptionVisible() {
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.isTooltipVisible()).thenCallRealMethod();
        assertEquals(false, radioButtonMock.isTooltipVisible());
    }

    @Test
    void testGetEnum() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertArrayEquals(new String[] { "0", "1" }, radioButton.getEnums());
    }

    @Test
    void testEnforceEnum() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals(true, radioButton.isEnforceEnum());
    }

    @Test
    void testGetDefault() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertArrayEquals(new String[] { "0" }, radioButton.getDefault());
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.getDefault()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.getDefault());
    }

    @Test
    void testGetType() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals(BaseConstraint.Type.STRING, radioButton.getType());
        RadioButton radioButtonMock = Mockito.mock(RadioButton.class);
        Mockito.when(radioButtonMock.getType()).thenCallRealMethod();
        assertEquals(BaseConstraint.Type.STRING, radioButtonMock.getType());
    }

    @Test
    void testGetEnumNames() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertArrayEquals(new String[] { "Item 1", "Item 2" }, radioButton.getEnumNames());
    }

    @Test
    void testGetOrientation() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals(CheckBox.Orientation.VERTICAL, radioButton.getOrientation());
    }

    @Test
    void testDorProperties() {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        assertEquals(true, radioButton.getDorProperties().get("dorExclusion"));
        assertEquals("4", radioButton.getDorProperties().get("dorColspan"));

    }

    @Test
    void testJSONExport() throws Exception {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON);
        Utils.testJSONExport(radioButton, Utils.getTestExporterJSONPath(BASE, PATH_RADIOBUTTON));
    }

    @Test
    void testJSONExportForCustomized() throws Exception {
        RadioButton radioButton = getRadioButtonUnderTest(PATH_RADIOBUTTON_CUSTOMIZED);
        Utils.testJSONExport(radioButton, Utils.getTestExporterJSONPath(BASE, PATH_RADIOBUTTON_CUSTOMIZED));
    }

    private RadioButton getRadioButtonUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(RadioButton.class);
    }

    @Test
    void testDataLayerProperties() throws IllegalAccessException {
        RadioButton radioButton = Utils.getComponentUnderTest(PATH_RADIOBUTTON_DATALAYER, RadioButton.class, context);
        FieldUtils.writeField(radioButton, "dataLayerEnabled", true, true);
        FormComponentData dataObject = (FormComponentData) radioButton.getData();
        assert (dataObject != null);
        assert (dataObject.getId()).equals("radiobutton-bafbf1a102");
        assert (dataObject.getType()).equals("core/fd/components/form/radiobutton/v1/radiobutton");
        assert (dataObject.getTitle()).equals("Gender");
        assert (dataObject.getFieldType()).equals("radio-group");
        assert (dataObject.getDescription()).equals("Input gender");
    }

    @Test
    void testJSONExportDataLayer() throws Exception {
        RadioButton radioButton = Utils.getComponentUnderTest(PATH_RADIOBUTTON_DATALAYER, RadioButton.class, context);
        FieldUtils.writeField(radioButton, "dataLayerEnabled", true, true);
        Utils.testJSONExport(radioButton, Utils.getTestExporterJSONPath(BASE, PATH_RADIOBUTTON_DATALAYER));
    }
}
