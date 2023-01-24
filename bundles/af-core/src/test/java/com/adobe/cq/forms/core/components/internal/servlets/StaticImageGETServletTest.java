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
package com.adobe.cq.forms.core.components.internal.servlets;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.function.Function;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.json.Json;
import javax.json.JsonReader;
import javax.servlet.ServletException;

import org.apache.sling.api.request.RequestPathInfo;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.models.form.StaticImage;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.fd.fp.api.exception.FormsPortalException;
import com.day.cq.wcm.commons.AbstractImageServlet;
import com.day.cq.wcm.foundation.Image;
import com.day.image.Layer;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;

@ExtendWith({ AemContextExtension.class, MockitoExtension.class })
public class StaticImageGETServletTest {

    private static final String BASE = "/form/image";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_IMAGE = CONTENT_ROOT + "/image";

    public final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @Mock
    private FormMetaDataDataSourceServlet formMetaDataDataSourceServlet;

    @InjectMocks
    private StaticImageGETServlet staticImageGETServlet;

    @Mock
    private AbstractImageServlet.ImageContext imageContext;

    @Mock
    private MockSlingHttpServletRequest request;

    @Mock
    private Layer layer;

    @Mock
    private Image image;

    @Mock
    private ResourceResolver resourceResolver;

    @BeforeEach
    void setUp() throws FormsPortalException {
        MockitoAnnotations.initMocks(this);
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
        context.currentResource(PATH_IMAGE);
        registerFormMetadataAdapter();
        getAEMFormUnderTest(PATH_IMAGE);
        // when(context.request()).thenReturn(request);
        HashMap<String, Object> parameterMap = new HashMap<>();
        parameterMap.put("defaultImagePath", "ddf");
        context.request().setParameterMap(parameterMap);
        imageContext = new AbstractImageServlet.ImageContext(context.request(), "");
    }

    @Test
    void testCreateLayer() throws RepositoryException, IOException {
        Assertions.assertNull(staticImageGETServlet.createLayer(imageContext));
    }

    @Test
    void testCreateImageResource() throws RepositoryException, IOException {
        Assertions.assertNotNull(staticImageGETServlet.createImageResource(context.currentResource()));
    }

    @Test
    void testWriteLayer() throws ServletException, IOException, RepositoryException {
        MockSlingHttpServletResponse response = context.response();
        MockSlingHttpServletRequest request = context.request();
        Image image = mock(Image.class);
        Layer layer = mock(Layer.class);
        staticImageGETServlet.writeLayer(request, response, imageContext, layer);
    }

    @Test
    void testExtracted() throws ServletException, IOException, RepositoryException {
        MockSlingHttpServletResponse response = context.response();
        Image image = mock(Image.class);
        Property property = mock(Property.class);
        Mockito.when(image.getData()).thenReturn(property);
        Mockito.when(property.getStream()).thenReturn(new ByteArrayInputStream("test data".getBytes()));
        Mockito.when(property.getLength()).thenReturn(120l);
        staticImageGETServlet.extracted(response, image);
    }

    @Test
    void testGetImage() throws ServletException, IOException {
        MockSlingHttpServletResponse response = context.response();
        Image image = mock(Image.class);
        Mockito.when(image.hasContent()).thenReturn(false);
        Image tempImage = staticImageGETServlet.getImage(response, imageContext, image);
        Assertions.assertNotNull(tempImage);
    }

    @Test
    void testIsModified() throws ServletException, IOException, RepositoryException {
        MockSlingHttpServletResponse response = context.response();
        Image image = mock(Image.class);
        Layer layer = mock(Layer.class);
        Assertions.assertFalse(staticImageGETServlet.isModified(request, response, imageContext, layer, image, false));
    }

    @Test
    void testIsModifiedWithTrue() throws ServletException, IOException, RepositoryException {
        MockSlingHttpServletResponse response = context.response();
        Image image = mock(Image.class);
        Layer layer = mock(Layer.class);
        Mockito.when(image.crop(layer)).thenReturn(layer);
        Mockito.when(image.getMimeType()).thenReturn("image/svg+xml");
        Assertions.assertTrue(staticImageGETServlet.isModified(request, response, imageContext, layer, image, false));
    }

    @Test
    void testGetLayer() throws ServletException, IOException, RepositoryException {
        MockSlingHttpServletResponse response = context.response();
        Image image = mock(Image.class);
        Layer layer = mock(Layer.class);
        Mockito.when(image.getLayer(anyBoolean(), anyBoolean(), anyBoolean())).thenReturn(layer);
        Assertions.assertNotNull(staticImageGETServlet.getLayer(imageContext, image));
    }

    @Test
    void testGetImageWithException() throws ServletException, IOException {
        MockSlingHttpServletResponse response = context.response();
        Image image = mock(Image.class);
        Mockito.when(image.hasContent()).thenReturn(false);
        AbstractImageServlet.ImageContext tempImageContext = mock(AbstractImageServlet.ImageContext.class);
        Image tempImage = staticImageGETServlet.getImage(response, tempImageContext, image);
        Assertions.assertNull(tempImage);
    }

    @Test
    void testJsonExtension() throws ServletException, IOException {
        MockSlingHttpServletResponse response = context.response();
        RequestPathInfo mockRequestPathInfo = Mockito.mock(RequestPathInfo.class);
        Mockito.when(mockRequestPathInfo.getExtension()).thenReturn("json");
        Mockito.when(request.getRequestPathInfo()).thenReturn(mockRequestPathInfo);
        StaticImage staticImage = getStaticImageUnderTest(PATH_IMAGE);
        Mockito.when(request.adaptTo(StaticImage.class)).thenReturn(staticImage);
        staticImageGETServlet.doGet(request, response);
        Assertions.assertEquals("application/json", response.getContentType());
        InputStream responseStream = new ByteArrayInputStream(response.getOutput());
        JsonReader outputReader = Json.createReader(responseStream);
        String expectedJsonResource = Utils.getTestExporterJSONPath(BASE, PATH_IMAGE);
        InputStream is = Utils.class.getResourceAsStream(expectedJsonResource);
        if (is != null) {
            JsonReader expectedReader = Json.createReader(is);
            Assertions.assertEquals(expectedReader.read(), outputReader.read());
        } else {
            Assertions.fail("Unable to find test file " + expectedJsonResource + ".");
        }
    }

    @Test
    void testNonJsonExtension() throws ServletException, IOException {
        MockSlingHttpServletResponse response = context.response();
        RequestPathInfo mockRequestPathInfo = Mockito.mock(RequestPathInfo.class);
        Mockito.when(mockRequestPathInfo.getExtension()).thenReturn(null);
        Mockito.when(request.getRequestPathInfo()).thenReturn(mockRequestPathInfo);
        Node node = context.request().adaptTo(Node.class);
        Resource resource = Mockito.mock(Resource.class);
        Mockito.when(resource.adaptTo(Node.class)).thenReturn(node);
        Mockito.when(request.getResource()).thenReturn(resource);
        StaticImageGETServlet spy = Mockito.spy(new StaticImageGETServlet());
        spy.doGet(request, response);
        // Assert
        Mockito.verify(spy, times(1)).doGet(Mockito.any(), Mockito.any());
    }

    private void registerFormMetadataAdapter() {
        context.registerAdapter(ResourceResolver.class, AbstractImageServlet.ImageContext.class,
            (Function<ResourceResolver, AbstractImageServlet.ImageContext>) input -> imageContext);
    }

    private StaticImage getAEMFormUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(StaticImage.class);
    }

    private StaticImage getStaticImageUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(StaticImage.class);
    }
}
