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

import java.io.InputStream;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.apache.commons.lang3.reflect.FieldUtils;
import org.apache.http.entity.ContentType;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.FormContainer;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.cq.wcm.core.components.models.datalayer.ComponentData;
import com.day.cq.dam.api.Asset;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.msm.api.MSMNameConstants;
import com.google.common.collect.ImmutableMap;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.apache.jackrabbit.JcrConstants.JCR_CONTENT;
import static org.apache.jackrabbit.JcrConstants.JCR_DATA;
import static org.apache.jackrabbit.JcrConstants.JCR_MIMETYPE;
import static org.apache.jackrabbit.JcrConstants.JCR_PRIMARYTYPE;
import static org.apache.jackrabbit.JcrConstants.NT_RESOURCE;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

@ExtendWith(AemContextExtension.class)
public class FormContainerImplTest {
    private static final String BASE = "/form/formcontainer";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_FORM_1 = CONTENT_ROOT + "/formcontainer";
    private static final String PATH_FORM_DATALAYER = CONTENT_ROOT + "/formcontainer-datalayer";
    private static final String PATH_FORM_WITH_DOCUMENT_PATH = CONTENT_ROOT + "/formcontainerWithDocumentPath";
    private static final String TEST_CONTENT_FORM_MODEL = "/test-content-model.json";
    private static final String FORM_MODEL = "/test-form-model.json";
    private static final String CONTENT_DAM_ROOT = "/content/dam";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
        // load the adaptive form model in "/content/dam/abc.json"
        context.load().json(BASE + TEST_CONTENT_FORM_MODEL, CONTENT_DAM_ROOT);
        context.registerService(SlingModelFilter.class, new SlingModelFilter() {

            private final Set<String> IGNORED_NODE_NAMES = new HashSet<String>() {
                {
                    add(NameConstants.NN_RESPONSIVE_CONFIG);
                    add(MSMNameConstants.NT_LIVE_SYNC_CONFIG);
                    add("cq:annotations");
                }
            };

            @Override
            public Map<String, Object> filterProperties(Map<String, Object> map) {
                return map;
            }

            @Override
            public Iterable<Resource> filterChildResources(Iterable<Resource> childResources) {
                return StreamSupport
                    .stream(childResources.spliterator(), false)
                    .filter(r -> !IGNORED_NODE_NAMES.contains(r.getName()))
                    .collect(Collectors.toList());
            }
        });
    }

    @Test
    void testExportedType() throws Exception {
        FormContainer formContainer = getFormContainerUnderTest(PATH_FORM_1);
        assertEquals(FormConstants.RT_FD_FORM_CONTAINER_V1, formContainer.getExportedType());
        FormContainer formContainerMock = Mockito.mock(FormContainer.class);
        Mockito.when(formContainerMock.getExportedType()).thenCallRealMethod();
        assertEquals("", formContainerMock.getExportedType());
    }

    @Test
    void testGetId() throws Exception {
        FormContainer formContainer = getFormContainerUnderTest(PATH_FORM_1);
        assertNotNull(formContainer.getId());
    }

    // The test is wrong. It was putting a form element inside a form element.
    void testJSONExport() throws Exception {
        FormContainer formContainer = getFormContainerUnderTest(PATH_FORM_1);
        Utils.testJSONExport(formContainer, Utils.getTestExporterJSONPath(BASE, PATH_FORM_1));
    }

    @Test
    void testGetEncodedCurrentPagePath() throws Exception {
        FormContainer formContainer = getFormContainerUnderTest(PATH_FORM_1);
        assertEquals(null, formContainer.getEncodedCurrentPagePath());
    }

    @Test
    void testFormModel() throws Exception {
        FormContainer formContainer = getFormContainerUnderTest(PATH_FORM_WITH_DOCUMENT_PATH);
        assertEquals(((List) formContainer.getModel().get("items")).size(), 1);
    }

    @Test
    void testGetThankYouMessage() throws Exception {
        FormContainer formContainer = getFormContainerUnderTest(PATH_FORM_1);
        assertNotNull(formContainer.getThankYouMessage());
        assertEquals("message", formContainer.getThankYouMessage());
    }

    @Test
    void testGetGridClassNames() throws Exception {
        FormContainer formContainer = getFormContainerUnderTest(PATH_FORM_1);
        assertNull(formContainer.getGridClassNames());
    }

    @Test
    void testGetColumnClassNames() throws Exception {
        FormContainer formContainer = getFormContainerUnderTest(PATH_FORM_1);
        assertEquals(formContainer.getColumnClassNames().isEmpty(), true);
    }

    @Test
    void testGetColumnCount() throws Exception {
        FormContainer formContainer = getFormContainerUnderTest(PATH_FORM_1);
        assertEquals(formContainer.getColumnCount(), 0);
    }

    @Test
    void testGetAppliedCSSClass() throws Exception {
        FormContainer formContainer = getFormContainerUnderTest(PATH_FORM_1);
        assertNull(formContainer.getAppliedCssClasses());
    }

    @Test
    void testGetExportedAllowedComponents() throws Exception {
        FormContainer formContainer = getFormContainerUnderTest(PATH_FORM_1);
        assertNull(formContainer.getExportedAllowedComponents());
    }

    private FormContainer getFormContainerUnderTest(String resourcePath) throws Exception {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        Resource damResource = context.resourceResolver().getResource("/content/dam/sample.json");
        createAsset(damResource.adaptTo(Asset.class), FORM_MODEL);
        return request.adaptTo(FormContainer.class);
    }

    private void createAsset(Asset asset, String path) throws Exception {
        InputStream jsonStream = getClass().getResourceAsStream(BASE + path);
        context.create().resource(asset.getOriginal().getPath() + "/" + JCR_CONTENT, ImmutableMap.of(
            JCR_PRIMARYTYPE, NT_RESOURCE,
            JCR_DATA, jsonStream,
            JCR_MIMETYPE, ContentType.APPLICATION_JSON.toString()));
    }

    @Test
    void testDataLayerProperties() throws IllegalAccessException {
        FormContainer container = Utils.getComponentUnderTest(PATH_FORM_DATALAYER, FormContainer.class, context);
        FieldUtils.writeField(container, "dataLayerEnabled", true, true);
        ComponentData dataObject = container.getData();
        assert (dataObject != null);
        assert (dataObject.getId()).equals("L2NvbnRlbnQvZm9ybXMvYWYvYWYy");
        assert (dataObject.getType()).equals("core/fd/components/form/container/v1/container");
    }

    @Test
    void testGetName() throws Exception {
        FormContainer formContainer = getFormContainerUnderTest(PATH_FORM_1);
        assertNull(formContainer.getName());
    }

    @Test
    void testGetHamburgerMenu() throws Exception {
        FormContainer formContainer = getFormContainerUnderTest(PATH_FORM_1);
        assertFalse(formContainer.getHamburgerMenu());
    }
}
