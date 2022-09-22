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
import com.adobe.cq.forms.core.components.models.form.ConstraintType;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.FileInput;
import com.adobe.cq.forms.core.components.models.form.Label;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.cq.wcm.style.ComponentStyleInfo;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.hamcrest.CoreMatchers.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;

@ExtendWith(AemContextExtension.class)
public class FileInputImplTest {
    private static final String BASE = "/form/fileinput";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_FILEINPUT = CONTENT_ROOT + "/fileinput";
    private static final String PATH_MULTISELECT_FILEINPUT = CONTENT_ROOT + "/multiselect-fileinput";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        assertEquals(FormConstants.RT_FD_FORM_FILE_INPUT_V1, fileInput.getExportedType());
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getExportedType()).thenCallRealMethod();
        assertEquals("", fileInputMock.getExportedType());
    }

    @Test
    void testFieldType() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        assertEquals(FieldType.FILE_INPUT.getValue(), fileInput.getFieldType());
    }

    @Test
    void testGetLabel() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        assertEquals("def", fileInput.getLabel().getValue());
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getLabel()).thenCallRealMethod();
        assertEquals(null, fileInputMock.getLabel());

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
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        assertEquals("abc", fileInput.getName());
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getName()).thenCallRealMethod();
        assertEquals(null, fileInputMock.getName());
    }

    @Test
    void testGetDataRef() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        assertEquals("a.b", fileInput.getDataRef());
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getDataRef()).thenCallRealMethod();
        assertEquals(null, fileInputMock.getDataRef());
    }

    @Test
    void testGetDescription() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        assertEquals("dummy", fileInput.getDescription());
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getDescription()).thenCallRealMethod();
        assertEquals(null, fileInputMock.getDescription());
    }

    @Test
    void testGetScreenReaderText() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        assertEquals("'Custom screen reader text'", fileInput.getScreenReaderText());
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getScreenReaderText()).thenCallRealMethod();
        assertEquals(null, fileInputMock.getScreenReaderText());
    }

    @Test
    void testIsVisible() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        assertEquals(false, fileInput.isVisible());
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.isVisible()).thenCallRealMethod();
        assertEquals(true, fileInputMock.isVisible());
    }

    @Test
    void testIsEnabled() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        assertEquals(true, fileInput.isEnabled());
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.isEnabled()).thenCallRealMethod();
        assertEquals(true, fileInputMock.isEnabled());
    }

    @Test
    void testIsReadOnly() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        assertEquals(false, fileInput.isReadOnly());
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.isReadOnly()).thenCallRealMethod();
        assertEquals(false, fileInputMock.isReadOnly());
    }

    @Test
    void testGetPlaceHolder() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        assertEquals(null, fileInput.getPlaceHolder());
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getPlaceHolder()).thenCallRealMethod();
        assertEquals(null, fileInputMock.getPlaceHolder());
    }

    @Test
    void testGetDisplayFormat() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        assertEquals(null, fileInput.getDisplayFormat());
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getDisplayFormat()).thenCallRealMethod();
        assertEquals(null, fileInputMock.getDisplayFormat());
    }

    @Test
    void testGetEditFormat() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        assertEquals(null, fileInput.getEditFormat());
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getEditFormat()).thenCallRealMethod();
        assertEquals(null, fileInputMock.getEditFormat());
    }

    @Test
    void testGetDataFormat() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        assertEquals(null, fileInput.getDataFormat());
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getDataFormat()).thenCallRealMethod();
        assertEquals(null, fileInputMock.getDataFormat());
    }

    @Test
    void testGetMaxFileSize() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        assertEquals("4MB", fileInput.getMaxFileSize());
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getMaxFileSize()).thenCallRealMethod();
        assertEquals(FileInput.DEFAULT_MAX_FILE_SIZE, fileInputMock.getMaxFileSize());
    }

    @Test
    void testGetAccept() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        assertThat(Arrays.asList("audio/*", "video/*", "image/*"), is(fileInput.getAccept()));
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getAccept()).thenCallRealMethod();
        assertThat(FileInput.DEFAULT_ACCEPT, is(fileInputMock.getAccept()));
    }

    @Test
    void testGetTooltip() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        assertEquals("test-short-description", fileInput.getTooltip());
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, fileInputMock.getTooltip());
    }

    @Test
    void testGetConstraintMessages() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        Map<ConstraintType, String> constraintsMessages = fileInput.getConstraintMessages();
        assertEquals(constraintsMessages.get(ConstraintType.TYPE), "incorrect type");
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getConstraintMessages()).thenCallRealMethod();
        assertEquals(Collections.emptyMap(), fileInputMock.getConstraintMessages());
    }

    @Test
    void testJSONExport() throws Exception {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        Utils.testJSONExport(fileInput, Utils.getTestExporterJSONPath(BASE, PATH_FILEINPUT));
    }

    @Test
    void testMultiSelectJSONExport() throws Exception {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_MULTISELECT_FILEINPUT, FileInput.class, context);
        Utils.testJSONExport(fileInput, Utils.getTestExporterJSONPath(BASE, PATH_MULTISELECT_FILEINPUT));
    }

    @Test
    void testGetProperties() throws Exception {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        Map<String, Object> properties = fileInput.getProperties();
        assertFalse(properties.isEmpty());
        // get custom properties of "afs:layout"
        Map<String, Object> customProperties = (Map<String, Object>) properties.get(Base.CUSTOM_PROPERTY_WRAPPER);
        assertFalse((boolean) customProperties.get("tooltipVisible"));
    }

    @Test
    void testGetProperties_should_return_empty_if_no_custom_properties() {
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getProperties()).thenCallRealMethod();
        assertTrue(fileInputMock.getProperties().isEmpty());
    }

    @Test
    void testGetShortDescription() {
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, fileInputMock.getTooltip());
    }

    @Test
    void testIsShortDescriptionVisible() {
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.isTooltipVisible()).thenCallRealMethod();
        assertEquals(false, fileInputMock.isTooltipVisible());
    }

    @Test
    void testGetType() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_FILEINPUT, FileInput.class, context);
        assertEquals(BaseConstraint.Type.FILE, fileInput.getType());
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getType()).thenCallRealMethod();
        assertEquals(BaseConstraint.Type.STRING, fileInputMock.getType());
    }

    @Test
    void testGetMultiSelectType() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_MULTISELECT_FILEINPUT, FileInput.class, context);
        assertEquals(BaseConstraint.Type.FILE_ARRAY, fileInput.getType());
    }

    @Test
    void testGetMultiSelectMinItems() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_MULTISELECT_FILEINPUT, FileInput.class, context);
        assertEquals(1, fileInput.getMinItems().intValue());
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getMinItems()).thenCallRealMethod();
        assertEquals(null, fileInputMock.getMinItems());
    }

    @Test
    void testGetMultiSelectMaxItems() {
        FileInput fileInput = Utils.getComponentUnderTest(PATH_MULTISELECT_FILEINPUT, FileInput.class, context);
        assertEquals(2, fileInput.getMaxItems().intValue());
        FileInput fileInputMock = Mockito.mock(FileInput.class);
        Mockito.when(fileInputMock.getMaxItems()).thenCallRealMethod();
        assertEquals(null, fileInputMock.getMaxItems());
    }

    @Test
    void testStyleSystemClasses() {
        ComponentStyleInfo componentStyleInfoMock = mock(ComponentStyleInfo.class);
        Resource resource = spy(context.resourceResolver().getResource(PATH_FILEINPUT));
        Mockito.doReturn(componentStyleInfoMock).when(resource).adaptTo(ComponentStyleInfo.class);
        MockSlingHttpServletRequest request = context.request();
        request.setResource(resource);
        Mockito.doReturn("mystyle").when(componentStyleInfoMock).getAppliedCssClasses();
        FileInput fileInput = request.adaptTo(FileInput.class);
        String appliedCssClasses = fileInput.getAppliedCssClasses();
        assertEquals("mystyle", appliedCssClasses);
    }
}
