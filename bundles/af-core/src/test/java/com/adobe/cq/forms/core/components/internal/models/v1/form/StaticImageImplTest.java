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

import javax.jcr.RepositoryException;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.FieldType;
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
    private static final String PATH_EMPTY_IMAGE = CONTENT_ROOT + "/empty-image";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        StaticImage staticImage = Utils.getComponentUnderTest(PATH_IMAGE, StaticImage.class, context);
        assertEquals(FormConstants.RT_FD_FORM_IMAGE_V1, staticImage.getExportedType());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getExportedType()).thenCallRealMethod();
        assertEquals("", staticImageMock.getExportedType());
    }

    @Test
    void testFieldType() {
        StaticImage staticImage = Utils.getComponentUnderTest(PATH_IMAGE, StaticImage.class, context);
        assertEquals(FieldType.IMAGE.getValue(), staticImage.getFieldType());
    }

    @Test
    void testGetName() {
        StaticImage staticImage = Utils.getComponentUnderTest(PATH_IMAGE, StaticImage.class, context);
        assertEquals("abc", staticImage.getName());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getName()).thenCallRealMethod();
        assertEquals(null, staticImageMock.getName());
    }

    @Test
    void testGetDataRef() {
        StaticImage staticImage = Utils.getComponentUnderTest(PATH_IMAGE, StaticImage.class, context);
        assertEquals(null, staticImage.getDataRef());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getDataRef()).thenCallRealMethod();
        assertEquals(null, staticImageMock.getDataRef());
    }

    @Test
    void testGetAltText() {
        StaticImage staticImage = Utils.getComponentUnderTest(PATH_IMAGE, StaticImage.class, context);
        assertEquals("abc", staticImage.getAltText());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getAltText()).thenCallRealMethod();
        assertEquals(null, staticImageMock.getAltText());
    }

    @Test
    void testGetWithImageImageSrc() throws RepositoryException, IOException {
        StaticImage staticImage = Utils.getComponentUnderTest(PATH_IMAGE, StaticImage.class, context);
        Image img = new Image(this.context.currentResource());
        img.set("test", "/content/image.img.png");
        img.setSrc("/content/image.img.png");
        assertEquals(img.getSrc(), staticImage.getImageSrc());
    }

    @Test
    void testEmptyImageSrc() throws RepositoryException, IOException {
        StaticImage staticImage = Utils.getComponentUnderTest(PATH_EMPTY_IMAGE, StaticImage.class, context);
        assertNull("image src should be null", staticImage.getImageSrc());
    }

    @Test
    void testEmptyImageJSONExport() throws Exception {
        StaticImage staticImage = Utils.getComponentUnderTest(PATH_EMPTY_IMAGE, StaticImage.class, context);
        Utils.testJSONExport(staticImage, Utils.getTestExporterJSONPath(BASE, PATH_EMPTY_IMAGE));
    }

    @Test
    void testIsVisible() {
        StaticImage staticImage = Utils.getComponentUnderTest(PATH_IMAGE, StaticImage.class, context);
        assertEquals(false, staticImage.isVisible());
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.isVisible()).thenCallRealMethod();
        assertEquals(true, staticImageMock.isVisible());
    }

    @Test
    void testSrcImage() throws RepositoryException, IOException {
        StaticImage staticImage = Utils.getComponentUnderTest(PATH_IMAGE, StaticImage.class, context);
        StaticImage imageMock = Mockito.mock(StaticImage.class);
        Mockito.when(imageMock.getImageSrc()).thenCallRealMethod();
        assertEquals(null, imageMock.getImageSrc());
    }

    @Test
    void testGetProperties_should_return_empty_if_no_custom_properties() {
        StaticImage staticImageMock = Mockito.mock(StaticImage.class);
        Mockito.when(staticImageMock.getProperties()).thenCallRealMethod();
        assertTrue(staticImageMock.getProperties().isEmpty());
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

    @Test
    void testGetValue() {
        StaticImage image = Utils.getComponentUnderTest(PATH_IMAGE, StaticImage.class, context);
        assertEquals(PATH_IMAGE + ".img.png", image.getValue());
        StaticImage textMock = Mockito.mock(StaticImage.class);
        Mockito.when(textMock.getValue()).thenCallRealMethod();
        assertEquals(null, textMock.getValue());
    }

    @Test
    void testJSONExport() throws Exception {
        StaticImage image = Utils.getComponentUnderTest(PATH_IMAGE, StaticImage.class, context);
        Utils.testJSONExport(image, Utils.getTestExporterJSONPath(BASE, PATH_IMAGE));
    }
}
