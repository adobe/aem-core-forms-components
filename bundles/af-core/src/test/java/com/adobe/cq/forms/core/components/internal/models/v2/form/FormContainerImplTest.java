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
package com.adobe.cq.forms.core.components.internal.models.v2.form;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.i18n.ResourceBundleProvider;
import org.apache.sling.testing.mock.sling.MockResourceBundle;
import org.apache.sling.testing.mock.sling.MockResourceBundleProvider;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.aemds.guide.service.GuideLocalizationService;
import com.adobe.aemds.guide.utils.GuideConstants;
import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.models.form.FormContainer;
import com.adobe.cq.forms.core.components.models.form.TextInput;
import com.adobe.cq.forms.core.components.models.form.ThankYouOption;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.i18n.I18n;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.msm.api.MSMNameConstants;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@ExtendWith(AemContextExtension.class)
public class FormContainerImplTest {
    private static final String BASE = "/form/formcontainer";
    private static final String CONTENT_PAGE_ROOT = "/content/forms/af/demo";
    private static final String CONTENT_ROOT = CONTENT_PAGE_ROOT + "/jcr:content";
    private static final String CONTENT_DAM_ROOT = "/content/dam/formsanddocuments/demo";
    private static final String PATH_FORM_1 = CONTENT_ROOT + "/formcontainerv2";
    private static final String LIB_FORM_CONTAINER = "/libs/core/fd/components/form/container/v2/container";

    protected static final String SITES_PATH = "/content/exampleSite";
    protected static final String FORM_CONTAINER_PATH_IN_SITES = SITES_PATH + "/jcr:content/root/sitecontainer/formcontainer";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + "/test-localization-content.json", CONTENT_DAM_ROOT); // required for localization
        context.load().json(BASE + "/test-page-content.json", CONTENT_PAGE_ROOT); // required for localization since we traverse the
                                                                                  // resource up to find page
        context.load().json(BASE + "/test-lib-form-container.json", LIB_FORM_CONTAINER); // required since v2 container resource type should
                                                                                         // be v1 for localization to work
        context.load().json(BASE + "/test-forms-in-sites.json", "/content/exampleSite");

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
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertEquals("core/fd/components/form/container/v2/container", formContainer.getExportedType());
        FormContainer formContainerMock = Mockito.mock(FormContainer.class);
        Mockito.when(formContainerMock.getExportedType()).thenCallRealMethod();
        assertEquals("", formContainerMock.getExportedType());
    }

    @Test
    void testGetId() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertNotNull(formContainer.getId());
        assertEquals("L2NvbnRlbnQvZm9ybXMvYWYvZGVtbw==", formContainer.getId());
    }

    @Test
    void testGetIdForSitePage() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(FORM_CONTAINER_PATH_IN_SITES, FormContainer.class, context);
        assertNotNull(formContainer.getId());
        assertEquals("L2NvbnRlbnQvZXhhbXBsZVNpdGUvamNyOmNvbnRlbnQvcm9vdC9zaXRlY29udGFpbmVyL2Zvcm1jb250YWluZXI=", formContainer.getId());
    }

    @Test
    void testGetAction() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertEquals("/adobe/forms/af/submit/L2NvbnRlbnQvZm9ybXMvYWYvZGVtbw==", formContainer.getAction());
    }

    @Test
    void testGetActionForSitePage() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(FORM_CONTAINER_PATH_IN_SITES, FormContainer.class, context);
        assertEquals("/adobe/forms/af/submit/L2NvbnRlbnQvZXhhbXBsZVNpdGUvamNyOmNvbnRlbnQvcm9vdC9zaXRlY29udGFpbmVyL2Zvcm1jb250YWluZXI=",
            formContainer.getAction());
    }

    @Test
    void testGetDataUrl() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertEquals("/adobe/forms/af/data/L2NvbnRlbnQvZm9ybXMvYWYvZGVtbw==", formContainer
            .getDataUrl());
    }

    @Test
    void testGetDorProperties() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertEquals("generate", formContainer.getDorProperties().get("dorType"));
        assertEquals("xyz", formContainer.getDorProperties().get("dorTemplateRef"));
    }

    @Test
    void testGetLocalizedValue() throws Exception {
        FormContainer formContainer = getFormContainerWithLocaleUnderTest(PATH_FORM_1);
        TextInput textInput = (TextInput) formContainer.getItems().stream()
            .filter(Objects::nonNull)
            .findFirst()
            .orElse(null);
        // assertEquals("dummy 1", textInput.getDescription());
    }

    @Test
    void testFormContainerWithI18nSetter() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        MockResourceBundleProvider bundleProvider = (MockResourceBundleProvider) context.getService(ResourceBundleProvider.class);
        MockResourceBundle resourceBundle = (MockResourceBundle) bundleProvider.getResourceBundle(
            "/content/dam/formsanddocuments/demo/jcr:content/dictionary", new Locale("de"));
        resourceBundle.putAll(new HashMap<String, String>() {
            {
                put("guideContainer##textinput##description##5648", "dummy 1");
            }
        });
        I18n i18n = new I18n(resourceBundle);
        formContainer.setI18n(i18n);
        TextInput textInput = (TextInput) formContainer.getItems().stream()
            .filter(Objects::nonNull)
            .findFirst()
            .orElse(null);
        assertEquals("dummy", textInput.getDescription()); // just a dummy test to make sure i18n is set correctly in the resource hierarchy
    }

    @Test
    void testJSONExport() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        Utils.testJSONExport(formContainer, Utils.getTestExporterJSONPath(BASE, PATH_FORM_1));
    }

    @Test
    void testGetThankYouMessage() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertNotNull(formContainer.getThankYouMessage());
        assertEquals("Thank you for submitting.", formContainer.getThankYouMessage());
    }

    @Test
    void testGetThankYouOption() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertNotNull(formContainer.getThankYouOption());
        assertEquals(ThankYouOption.MESSAGE, formContainer.getThankYouOption());
    }

    @Test
    void testGetRedirectUrl() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertNotNull(formContainer.getRedirectUrl());
        assertEquals("/content/wknd.html", formContainer.getRedirectUrl());
    }

    @Test
    void testGetPrefillService() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertNotNull(formContainer.getPrefillService());
        assertEquals("FDM", formContainer.getPrefillService());
    }

    private FormContainer getFormContainerWithLocaleUnderTest(String resourcePath) throws Exception {
        context.currentResource(resourcePath);
        // added this since AF API expects this to be present
        GuideLocalizationService guideLocalizationService = context.registerService(GuideLocalizationService.class,
            Mockito.mock(GuideLocalizationService.class));
        Mockito.when(guideLocalizationService.getSupportedLocales()).thenReturn(new String[] { "en", "de" });
        MockResourceBundleProvider bundleProvider = (MockResourceBundleProvider) context.getService(ResourceBundleProvider.class);
        MockResourceBundle resourceBundle = (MockResourceBundle) bundleProvider.getResourceBundle(
            "/content/dam/formsanddocuments/demo/jcr:content/dictionary", new Locale("de"));
        resourceBundle.putAll(new HashMap<String, String>() {
            {
                put("guideContainer##textinput##description##5648", "dummy 1");
            }
        });
        MockSlingHttpServletRequest request = context.request();
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put(GuideConstants.AF_LANGUAGE_PARAMETER, "de");
        request.setParameterMap(paramMap);
        context.currentResource().adaptTo(FormContainer.class);
        return request.adaptTo(FormContainer.class);
    }
}
