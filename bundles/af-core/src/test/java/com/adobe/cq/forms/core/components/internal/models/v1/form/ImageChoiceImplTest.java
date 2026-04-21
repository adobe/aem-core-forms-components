/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2026 Adobe
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

@ExtendWith(AemContextExtension.class)
public class ImageChoiceImplTest {
    private static final String BASE = "/form/imagechoice";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_IMAGECHOICE = CONTENT_ROOT + "/imagechoice";
    private static final String PATH_IMAGECHOICE_CUSTOMIZED = CONTENT_ROOT + "/imagechoice-customized";
    private static final String PATH_IMAGECHOICE_MULTI = CONTENT_ROOT + "/imagechoice-multi";
    private static final String PATH_IMAGECHOICE_NO_IMAGES = CONTENT_ROOT + "/imagechoice-no-images";
    private static final String PATH_IMAGECHOICE_DATALAYER = CONTENT_ROOT + "/imagechoice-datalayer";
    private static final String PATH_IMAGECHOICE_OPTION_SCREEN_READER_LABEL = CONTENT_ROOT + "/imagechoice-option-screenreader-label";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE);
        assertEquals(FormConstants.RT_FD_FORM_IMAGE_CHOICE_V1, imageChoice.getExportedType());
    }

    @Test
    void testFieldType_singleSelect() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE);
        assertEquals(FieldType.RADIO_GROUP.getValue(), imageChoice.getFieldType());
    }

    @Test
    void testFieldType_multiSelect() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_MULTI);
        assertEquals(FieldType.CHECKBOX_GROUP.getValue(), imageChoice.getFieldType());
    }

    @Test
    void testGetLabel() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals("Favorite Animal", imageChoice.getLabel().getValue());
    }

    @Test
    void testGetName() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals("imagechoice_12345", imageChoice.getName());
    }

    @Test
    void testGetDataRef() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals("a.b", imageChoice.getDataRef());
    }

    @Test
    void testGetDescription() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals("Select your favorite animal", imageChoice.getDescription());
    }

    @Test
    void testGetScreenReaderText() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals("custom screen reader text", imageChoice.getScreenReaderText());
    }

    @Test
    void testIsVisible() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE);
        assertEquals(true, imageChoice.isVisible());
    }

    @Test
    void testIsVisibleForCustomized() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals(false, imageChoice.isVisible());
    }

    @Test
    void testIsEnabled() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE);
        assertEquals(true, imageChoice.isEnabled());
    }

    @Test
    void testIsReadOnly() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE);
        assertEquals(false, imageChoice.isReadOnly());
    }

    @Test
    void testIsReadOnlyForCustomized() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals(true, imageChoice.isReadOnly());
    }

    @Test
    void testGetEnum() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertArrayEquals(new String[] { "cat", "dog", "bird" }, imageChoice.getEnums());
    }

    @Test
    void testGetEnumNames() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertArrayEquals(new String[] { "Cat", "Dog", "Bird" }, imageChoice.getEnumNames());
    }

    @Test
    void testGetDefault_singleSelect() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertArrayEquals(new String[] { "cat" }, imageChoice.getDefault());
    }

    @Test
    void testGetDefault_multiSelect() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_MULTI);
        assertArrayEquals(new String[] { "red", "blue" }, imageChoice.getDefault());
    }

    @Test
    void testGetType() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals(BaseConstraint.Type.STRING, imageChoice.getType());
    }

    @Test
    void testGetOrientation_horizontal() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE);
        assertEquals(CheckBox.Orientation.HORIZONTAL, imageChoice.getOrientation());
    }

    @Test
    void testGetOrientation_vertical() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals(CheckBox.Orientation.VERTICAL, imageChoice.getOrientation());
    }

    @Test
    void testGetSelectionType_single() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE);
        assertEquals(ImageChoice.SelectionType.SINGLE, imageChoice.getSelectionType());
    }

    @Test
    void testGetSelectionType_multi() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_MULTI);
        assertEquals(ImageChoice.SelectionType.MULTI, imageChoice.getSelectionType());
    }

    @Test
    void testGetImageSrc() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertArrayEquals(new String[] {
            "/content/dam/animals/cat.png",
            "/content/dam/animals/dog.png",
            "/content/dam/animals/bird.png"
        }, imageChoice.getImageSrc());
    }

    @Test
    void testGetImageSrc_null() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_NO_IMAGES);
        assertNull(imageChoice.getImageSrc());
    }

    @Test
    void testGetProperties() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        Map<String, Object> properties = imageChoice.getProperties();
        assertFalse(properties.isEmpty());
        Map<String, Object> customProperties = (Map<String, Object>) properties.get(Base.CUSTOM_PROPERTY_WRAPPER);
        assertTrue((boolean) customProperties.get("tooltipVisible"));
        assertEquals("vertical", customProperties.get("orientation"));
        assertEquals("single", customProperties.get("selectionType"));
        // selectionType must only be emitted under the layout wrapper, never as a stray top-level custom property
        assertNull(properties.get("selectionType"));
    }

    @Test
    void testDorProperties() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_CUSTOMIZED);
        assertEquals(true, imageChoice.getDorProperties().get("dorExclusion"));
        assertEquals("4", imageChoice.getDorProperties().get("dorColspan"));
    }

    @Test
    void testEnforceEnum() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE);
        assertEquals(true, imageChoice.isEnforceEnum());
    }

    @Test
    void testGetOptionScreenReaderLabels() {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE_OPTION_SCREEN_READER_LABEL);
        String[] screenReaderLabels = imageChoice.getOptionScreenReaderLabels();
        assertEquals("Favorite Pet: Cat", screenReaderLabels[0]);
        assertEquals("Favorite Pet: Dog", screenReaderLabels[1]);
    }

    @Test
    void testDataLayerProperties() throws IllegalAccessException {
        ImageChoice imageChoice = Utils.getComponentUnderTest(PATH_IMAGECHOICE_DATALAYER, ImageChoice.class, context);
        FieldUtils.writeField(imageChoice, "dataLayerEnabled", true, true);
        FormComponentData dataObject = (FormComponentData) imageChoice.getData();
        assert (dataObject != null);
        assert (dataObject.getId()).equals("imagechoice-bafbf1a102");
        assert (dataObject.getType()).equals("core/fd/components/form/imagechoice/v1/imagechoice");
        assert (dataObject.getTitle()).equals("Favorite Color");
        assert (dataObject.getFieldType()).equals("radio-group");
        assert (dataObject.getDescription()).equals("Choose your favorite color");
    }

    @Test
    void testDefaultInterface() {
        ImageChoice imageChoiceMock = Mockito.mock(ImageChoice.class);
        Mockito.when(imageChoiceMock.getOrientation()).thenCallRealMethod();
        assertEquals(CheckBox.Orientation.HORIZONTAL, imageChoiceMock.getOrientation());
        Mockito.when(imageChoiceMock.getSelectionType()).thenCallRealMethod();
        assertEquals(ImageChoice.SelectionType.SINGLE, imageChoiceMock.getSelectionType());
    }

    @Test
    void testSelectionTypeFromString() {
        assertEquals(ImageChoice.SelectionType.SINGLE, ImageChoice.SelectionType.fromString("single"));
        assertEquals(ImageChoice.SelectionType.MULTI, ImageChoice.SelectionType.fromString("multi"));
        assertEquals(ImageChoice.SelectionType.SINGLE, ImageChoice.SelectionType.fromString("invalid"));
        assertEquals(ImageChoice.SelectionType.SINGLE, ImageChoice.SelectionType.fromString(null));
    }

    @Test
    void testJSONExport() throws Exception {
        ImageChoice imageChoice = getImageChoiceUnderTest(PATH_IMAGECHOICE);
        Utils.testJSONExport(imageChoice, Utils.getTestExporterJSONPath(BASE, PATH_IMAGECHOICE));
    }

    private ImageChoice getImageChoiceUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(ImageChoice.class);
    }
}
