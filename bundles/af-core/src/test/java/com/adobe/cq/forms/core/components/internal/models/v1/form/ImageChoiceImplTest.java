/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2024 Adobe
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

import java.lang.reflect.Method;
import java.util.*;

import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.*;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.*;
import static org.junit.Assert.assertArrayEquals;

@ExtendWith(AemContextExtension.class)
public class ImageChoiceImplTest {
    private static final String BASE = "/form/imagechoice";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_IMAGECHOICE_CUSTOMIZED = CONTENT_ROOT + "/imagechoice-customized";
    private static final String PATH_IMAGECHOICE = CONTENT_ROOT + "/imagechoice";
    private static final String PATH_IMAGECHOICE_DATALAYER = CONTENT_ROOT + "/imagechoice-datalayer";

    private static final String PATH_IMAGECHOICE_FOR_INSERTION_ORDER = CONTENT_ROOT + "/imagechoice-insertion-order";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    private ImageChoice getImageChoiceUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(ImageChoice.class);
    }

    @Test
    void testExportedType() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals(FormConstants.RT_FD_FORM_IMAGECHOICE_V1, imageChoice.getExportedType());
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.getExportedType()).thenCallRealMethod();
        assertEquals("", imageChoiceMock.getExportedType());
    }

    @Test
    void testFieldType() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals(FieldType.IMAGECHOICE.getValue(), imageChoice.getFieldType());
    }

    @Test
    void testGetLabel() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals("Image Choice", imageChoice.getLabel().getValue());
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.getLabel()).thenCallRealMethod();
        assertEquals(null, imageChoiceMock.getLabel());

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
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals("imagechoice_12345", imageChoice.getName());
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.getName()).thenCallRealMethod();
        assertEquals(null, imageChoiceMock.getName());
    }

    @Test
    void testGetDataRef() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals("a.b", imageChoice.getDataRef());
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.getDataRef()).thenCallRealMethod();
        assertEquals(null, imageChoiceMock.getDataRef());
    }

    @Test
    void testGetDescription() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals("long description", imageChoice.getDescription());
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.getDescription()).thenCallRealMethod();
        assertEquals(null, imageChoiceMock.getDescription());
    }

    @Test
    void testGetScreenReaderText() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals("'custom text'", imageChoice.getScreenReaderText());
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.getScreenReaderText()).thenCallRealMethod();
        assertEquals(null, imageChoiceMock.getScreenReaderText());
    }

    @Test
    void testIsVisible() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE);
        assertEquals(null, imageChoice.isVisible());
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.isVisible()).thenCallRealMethod();
        assertEquals(null, imageChoiceMock.isVisible());
    }

    @Test
    void testIsVisibleForCustomized() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals(false, imageChoice.isVisible());
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.isVisible()).thenCallRealMethod();
        assertEquals(null, imageChoiceMock.isVisible());
    }

    @Test
    void testIsEnabled() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE);
        assertEquals(null, imageChoice.isEnabled());
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.isEnabled()).thenCallRealMethod();
        assertEquals(null, imageChoiceMock.isEnabled());
    }

    @Test
    void testIsEnabledForCustomized() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals(true, imageChoice.isEnabled());
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.isEnabled()).thenCallRealMethod();
        assertEquals(null, imageChoiceMock.isEnabled());
    }

    @Test
    void testIsReadOnly() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE);
        assertEquals(null, imageChoice.isReadOnly());
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.isReadOnly()).thenCallRealMethod();
        assertEquals(null, imageChoiceMock.isReadOnly());
    }

    @Test
    void testIsReadOnlyForCustomized() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals(true, imageChoice.isReadOnly());
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.isReadOnly()).thenCallRealMethod();
        assertEquals(null, imageChoiceMock.isReadOnly());
    }

    @Test
    void testGetPlaceHolder() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals(null, imageChoice.getPlaceHolder());
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.getPlaceHolder()).thenCallRealMethod();
        assertEquals(null, imageChoiceMock.getPlaceHolder());
    }

    @Test
    void testGetDisplayFormat() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals(null, imageChoice.getDisplayFormat());
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.getDisplayFormat()).thenCallRealMethod();
        assertEquals(null, imageChoiceMock.getDisplayFormat());
    }

    @Test
    void testGetEditFormat() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals(null, imageChoice.getEditFormat());
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.getEditFormat()).thenCallRealMethod();
        assertEquals(null, imageChoiceMock.getEditFormat());
    }

    @Test
    void testGetDataFormat() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals(null, imageChoice.getDataFormat());
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.getDataFormat()).thenCallRealMethod();
        assertEquals(null, imageChoiceMock.getDataFormat());
    }

    @Test
    void testGetTooltip() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals("<p>short description</p>", imageChoice.getTooltip());
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, imageChoiceMock.getTooltip());
    }

    @Test
    void testGetConstraintMessages() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        Map<ConstraintType, String> constraintsMessages = imageChoice.getConstraintMessages();
        assertEquals(constraintsMessages.get(ConstraintType.TYPE), null);
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.getConstraintMessages()).thenCallRealMethod();
        assertEquals(Collections.emptyMap(), imageChoiceMock.getConstraintMessages());
    }

    @Test
    void testGetProperties() throws Exception {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        Map<String, Object> properties = imageChoice.getProperties();
        assertFalse(properties.isEmpty());
        // get custom properties of "af:layout"
        Map<String, Object> customProperties = (Map<String, Object>) properties.get(Base.CUSTOM_PROPERTY_WRAPPER);
        assertTrue((boolean) customProperties.get("tooltipVisible"));
    }

    @Test
    void testGetProperties_should_return_empty_if_no_custom_properties() {
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.getProperties()).thenCallRealMethod();
        assertTrue(imageChoiceMock.getProperties().isEmpty());
    }

    @Test
    void testGetShortDescription() {
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, imageChoiceMock.getTooltip());
    }

    @Test
    void testIsShortDescriptionVisible() {
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.isTooltipVisible()).thenCallRealMethod();
        assertEquals(false, imageChoiceMock.isTooltipVisible());
    }

    @Test
    void testGetDefault() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertArrayEquals(new String[] { "1" }, imageChoice.getDefault());
        ImageChoice radioButtonMock = Mockito.mock(ImageChoice.class);
        Mockito.when(radioButtonMock.getDefault()).thenCallRealMethod();
        assertEquals(null, radioButtonMock.getDefault());
    }

    @Test
    void testGetType() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals(BaseConstraint.Type.STRING, imageChoice.getType());
        ImageChoice radioButtonMock = Mockito.mock(ImageChoice.class);
        Mockito.when(radioButtonMock.getType()).thenCallRealMethod();
        assertEquals(BaseConstraint.Type.STRING, radioButtonMock.getType());
    }

    @Test
    void testGetOrientation() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals(CheckBox.Orientation.VERTICAL, ((ImageChoiceImpl) imageChoice).getOrientation());
    }

    @Test
    void testDorProperties() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals(true, imageChoice.getDorProperties().get("dorExclusion"));
        assertEquals("4", imageChoice.getDorProperties().get("dorColspan"));

    }

    @Test
    void testGetOptions() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        ImageItem item1 = new ImageItem();
        assertNotNull(imageChoice.getOptions());
        item1.setAltText("aem-corecomponents-logo");
        item1.setImageSrc("/content/dam/core-components-examples/library/aem-corecomponents-logo.svg");
        item1.setImageValue("1");
        item1.setValue("1");
        ImageItem item2 = new ImageItem();
        item2.setAltText("adobe-logo");
        item2.setImageSrc("/content/dam/core-components-examples/library/adobe-logo.svg");
        item2.setImageValue("2");
        item2.setValue("2");
        // Add the mock ImageItem objects to the options list
        imageChoice.getOptions().add(item1);
        imageChoice.getOptions().add(item2);

        assertEquals(2, imageChoice.getOptions().size());

        // Assertions for the first ImageItem
        assertEquals("1", imageChoice.getOptions().get(0).getValue());
        assertEquals("aem-corecomponents-logo", imageChoice.getOptions().get(0).getAltText());
        assertEquals("/content/dam/core-components-examples/library/aem-corecomponents-logo.svg", imageChoice.getOptions().get(0)
            .getImageSrc());
        assertEquals("1", imageChoice.getOptions().get(0).getImageValue());

        // Assertions for the second ImageItem
        assertEquals("2", imageChoice.getOptions().get(1).getValue());
        assertEquals("adobe-logo", imageChoice.getOptions().get(1).getAltText());
        assertEquals("/content/dam/core-components-examples/library/adobe-logo.svg", imageChoice.getOptions().get(1).getImageSrc());
        assertEquals("2", imageChoice.getOptions().get(1).getImageValue());
    }

    @Test
    void testGetOptionsWithNullOptions() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        ((ImageChoiceImpl) imageChoice).options = null;
        List<ImageItem> result = ((ImageChoiceImpl) imageChoice).getOptions();
        assertNull(result);
    }

    @Test
    void testCoerceImageValue() throws Exception {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        Method method = ((ImageChoiceImpl) imageChoice).getClass().getDeclaredMethod("coerceImageValue", BaseConstraint.Type.class,
            Object.class);
        method.setAccessible(true);
        // Test boolean type
        Object coercedBooleanValue = method.invoke(imageChoice, BaseConstraint.Type.BOOLEAN, "true");
        assertTrue(coercedBooleanValue instanceof Boolean);
        assertTrue((Boolean) coercedBooleanValue);
        // Test number type
        Object coercedNumberValue = method.invoke(imageChoice, BaseConstraint.Type.NUMBER, "123");
        assertTrue(coercedNumberValue instanceof Long);
        assertEquals(123L, (long) coercedNumberValue);
        // Test String types
        BaseConstraint.Type type = BaseConstraint.Type.STRING;
        Object value = "test";
        Object coercedNonBooleanValue = method.invoke(imageChoice, type, value);
        assertEquals(value, coercedNonBooleanValue);
    }

    @Test
    void testGetSelectionType() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals("single", ((ImageChoiceImpl) imageChoice).getSelectionType());
    }
}
