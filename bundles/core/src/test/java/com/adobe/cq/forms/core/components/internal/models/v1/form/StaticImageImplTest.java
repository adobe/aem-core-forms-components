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

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

import javax.jcr.RepositoryException;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Base;
import com.adobe.cq.forms.core.components.models.form.Label;
import com.adobe.cq.forms.core.components.models.form.StaticImage;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.cq.wcm.style.ComponentStyleInfo;
import com.day.cq.wcm.foundation.Image;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(AemContextExtension.class)
public class StaticImageImplTest {

    private static final String BASE = "/form/image";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_IMAGE = CONTENT_ROOT + "/image";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        assertEquals(FormConstants.RT_FD_FORM_IMAGE_V1, staticImage.getExportedType());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getExportedType()).thenCallRealMethod();
        assertEquals("", staticImageMock.getExportedType());
    }

    @Test
    void testFieldType() {
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        assertEquals(Base.FieldType.IMAGE.getValue(), staticImage.getFieldType());
    }

    @Test
    void testGetLabel() {
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        assertEquals("def", staticImage.getLabel().getValue());
        StaticImage staticImageGroup = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageGroup.getLabel()).thenCallRealMethod();
        assertEquals(null, staticImageGroup.getLabel());

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
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        assertEquals("abc", staticImage.getName());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getName()).thenCallRealMethod();
        assertEquals(null, staticImageMock.getName());
    }

    @Test
    void testGetDataRef() {
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        assertEquals("a.b", staticImage.getDataRef());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getDataRef()).thenCallRealMethod();
        assertEquals(null, staticImageMock.getDataRef());
    }

    @Test
    void testGetDescription() {
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        assertEquals("dummy", staticImage.getDescription());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getDescription()).thenCallRealMethod();
        assertEquals(null, staticImageMock.getDescription());
    }

    @Test
    void testGetScreenReaderText() {
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        assertEquals("'Custom screen reader text'", staticImage.getScreenReaderText());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getScreenReaderText()).thenCallRealMethod();
        assertEquals(null, staticImageMock.getScreenReaderText());
    }

    @Test
    void testGetAltText() {
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        assertEquals("abc", staticImage.getAltText());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getAltText()).thenCallRealMethod();
        assertEquals(null, staticImageMock.getAltText());
    }

    @Test
    void testGetWithImageImageSrc() throws RepositoryException, IOException {
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        Image img = new Image(this.context.currentResource());
        img.set("test", "/content/image.img.png");
        img.setSrc("/content/image.img.png");
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getDescription()).thenCallRealMethod();
        assertEquals(img.getSrc(), staticImage.getImageSrc());
    }

    @Test
    void testIsVisible() {
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        assertEquals(false, staticImage.isVisible());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.isVisible()).thenCallRealMethod();
        assertEquals(true, staticImageMock.isVisible());
    }

    @Test
    void testIsEnabled() {
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        assertEquals(true, staticImage.isEnabled());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.isEnabled()).thenCallRealMethod();
        assertEquals(true, staticImageMock.isEnabled());
    }

    @Test
    void testIsReadOnly() {
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        assertEquals(false, staticImage.isReadOnly());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.isReadOnly()).thenCallRealMethod();
        assertEquals(false, staticImageMock.isReadOnly());
    }

    @Test
    void testGetPlaceHolder() {
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        assertEquals(null, staticImage.getPlaceHolder());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getPlaceHolder()).thenCallRealMethod();
        assertEquals(null, staticImageMock.getPlaceHolder());
    }

    @Test
    void testGetDisplayFormat() {
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        assertEquals(null, staticImage.getDisplayFormat());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getDisplayFormat()).thenCallRealMethod();
        assertEquals(null, staticImageMock.getDisplayFormat());
    }

    @Test
    void testGetEditFormat() {
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        assertEquals(null, staticImage.getEditFormat());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getEditFormat()).thenCallRealMethod();
        assertEquals(null, staticImageMock.getEditFormat());
    }

    @Test
    void testGetDataFormat() {
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        assertEquals(null, staticImage.getDataFormat());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getDataFormat()).thenCallRealMethod();
        assertEquals(null, staticImageMock.getDataFormat());
    }

    @Test
    void testGetTooltip() {
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        assertEquals("test-short-description", staticImage.getTooltip());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, staticImageMock.getTooltip());
    }

    @Test
    void testGetConstraintMessages() {
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        Map<Base.ConstraintType, String> constraintsMessages = staticImage.getConstraintMessages();
        assertEquals(constraintsMessages.get(Base.ConstraintType.TYPE), "incorrect type");
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getConstraintMessages()).thenCallRealMethod();
        assertEquals(Collections.emptyMap(), staticImageMock.getConstraintMessages());
    }

    @Test
    void testGetProperties_should_return_empty_if_no_custom_properties() {
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getProperties()).thenCallRealMethod();
        assertTrue(staticImageMock.getProperties().isEmpty());
    }

    @Test
    void testGetShortDescription() {
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getTooltip()).thenCallRealMethod();
        assertEquals(null, staticImageMock.getTooltip());
    }

    @Test
    void testStyleSystemClasses() {
        ComponentStyleInfo componentStyleInfoMock = mock(ComponentStyleInfo.class);
        Resource resource = spy(context.resourceResolver().getResource(PATH_IMAGE));
        Mockito.doReturn(componentStyleInfoMock).when(resource).adaptTo(ComponentStyleInfo.class);
        MockSlingHttpServletRequest request = context.request();
        request.setResource(resource);
        Mockito.doReturn("mystyle").when(componentStyleInfoMock).getAppliedCssClasses();
        StaticImage staticImage = request.adaptTo(StaticImage.class);
        String appliedCssClasses = staticImage.getAppliedCssClasses();
        assertEquals("mystyle", appliedCssClasses);
    }

    private StaticImage getStaticImageUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(StaticImage.class);
    }
}
