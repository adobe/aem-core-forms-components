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

import java.lang.reflect.Method;
import java.util.Base64;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.i18n.ResourceBundleProvider;
import org.apache.sling.testing.mock.sling.MockResourceBundle;
import org.apache.sling.testing.mock.sling.MockResourceBundleProvider;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import com.adobe.aemds.guide.service.CoreComponentCustomPropertiesProvider;
import com.adobe.aemds.guide.service.GuideLocalizationService;
import com.adobe.aemds.guide.utils.GuideConstants;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.internal.form.ReservedProperties;
import com.adobe.cq.forms.core.components.models.form.AutoSaveConfiguration;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.FormClientLibManager;
import com.adobe.cq.forms.core.components.models.form.FormContainer;
import com.adobe.cq.forms.core.components.models.form.FormMetaData;
import com.adobe.cq.forms.core.components.models.form.TextInput;
import com.adobe.cq.forms.core.components.models.form.ThankYouOption;
import com.adobe.cq.forms.core.components.views.Views;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.i18n.I18n;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.foundation.model.export.AllowedComponentsExporter;
import com.day.cq.wcm.msm.api.MSMNameConstants;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(AemContextExtension.class)
public class FormContainerImplTest {
    private static final String BASE = "/form/formcontainer";
    private static final String CONTENT_PAGE_ROOT = "/content/forms/af/demo";
    private static final String CONTENT_ROOT = CONTENT_PAGE_ROOT + "/jcr:content";
    private static final String CONTENT_DAM_ROOT = "/content/dam/formsanddocuments/demo";
    private static final String PATH_FORM_1 = CONTENT_ROOT + "/formcontainerv2";
    private static final String PATH_FORM_SUBMISSION_VIEW = CONTENT_ROOT + "/formcontainer-submissionView";
    private static final String PATH_UE_FORM_WITH_SPREADSHEET_SUBMISSION = CONTENT_ROOT
        + "/formContainer-ue-form-spreadsheet-submission";
    private static final String PATH_UE_FORM_REST_SUBMISSION = CONTENT_ROOT
        + "/formContainer-ue-form-rest-submission";
    private static final String PATH_CC_FORM_SPREADSHEET_SUBMISSION = CONTENT_ROOT
        + "/formContainer-cc-form-spreadsheet-submission";
    private static final String PATH_CC_FORM_REST_SUBMISSION = CONTENT_ROOT
        + "/formContainer-cc-form-rest-submission";
    private static final String PATH_FORM_WITH_FRAGMENT = CONTENT_ROOT + "/formcontainerv2-with-fragment";

    private static final String PATH_FORM_WITHOUT_FIELDTYPE = CONTENT_ROOT + "/formcontainerv2-without-fieldtype";
    private static final String PATH_FORM_WITH_AUTO_SAVE = CONTENT_ROOT + "/formcontainerv2WithAutoSave";
    private static final String PATH_FORM_1_WITHOUT_REDIRECT = CONTENT_ROOT + "/formcontainerv2WithoutRedirect";
    private static final String CONTENT_FORM_WITHOUT_PREFILL_ROOT = "/content/forms/af/formWithoutPrefill";
    private static final String PATH_FORM_WITHOUT_PREFILL = CONTENT_FORM_WITHOUT_PREFILL_ROOT + "/formcontainerv2WithoutPrefill";
    private static final String PATH_FORM_WITH_SPEC = CONTENT_FORM_WITHOUT_PREFILL_ROOT + "/formcontainerv2withspecversion";
    private static final String LIB_FORM_CONTAINER = "/libs/core/fd/components/form/container/v2/container";

    protected static final String SITES_PATH = "/content/exampleSite";
    protected static final String SITES_LANG_PATH = "/content/th/exampleSite";
    protected static final String FORM_CONTAINER_PATH_IN_SITES = SITES_PATH + "/jcr:content/root/sitecontainer/formcontainer";
    protected static final String FORM_CONTAINER_PATH_WITH_LANGUAGE_IN_SITES = SITES_LANG_PATH
        + "/jcr:content/root/sitecontainer/formcontainer";

    protected static final String AF_PATH = "/content/forms/af/testAf";
    private static final String SS_EMAIL = "email";
    private static final String SS_SPREADSHEET = "spreadsheet";

    private static final String PATH_FORM_EXCLUDE_FROM_DOR_IF_HIDDEN = "/content/forms/af/demo/jcr:content/formcontainerv2-excludeFromDoRIfHidden";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + "/test-localization-content.json", CONTENT_DAM_ROOT); // required for localization
        context.load().json(BASE + "/test-page-content.json", CONTENT_PAGE_ROOT); // required for localization since we traverse the
                                                                                  // resource up to find page
        context.load().json(BASE + "/test-lib-form-container.json", LIB_FORM_CONTAINER); // required since v2 container resource type should
                                                                                         // be v1 for localization to work
        context.load().json(BASE + "/test-forms-in-sites.json", SITES_PATH);
        context.load().json(BASE + "/test-forms-in-sites.json", SITES_LANG_PATH);
        context.load().json(BASE + "/test-content.json", CONTENT_FORM_WITHOUT_PREFILL_ROOT);

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
        FormContainer formContainerMock = mock(FormContainer.class);
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
    void testGetAdaptiveFormCustomVersion() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_WITH_SPEC, FormContainer.class, context);
        assertNotNull(formContainer.getAdaptiveFormVersion());
        assertEquals("x.y.z", formContainer.getAdaptiveFormVersion());
    }

    @Test
    void testGetAdaptiveFormDefaultVersion() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertNotNull(formContainer.getAdaptiveFormVersion());
        assertEquals("0.15.2", formContainer.getAdaptiveFormVersion());
    }

    @Test
    void testGetPageLangForSitePage() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(FORM_CONTAINER_PATH_WITH_LANGUAGE_IN_SITES, FormContainer.class, context);
        assertNotNull(formContainer.getContainingPageLang());
        assertEquals("th", formContainer.getContainingPageLang());
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
    void testGetActionWithResourceResolverMapping() throws Exception {
        // Create a spy of the resource resolver to mock the map method
        org.apache.sling.api.resource.ResourceResolver resourceResolver = Mockito.spy(context.resourceResolver());

        // Mock the map method to return a mapped path
        String originalPath = "/adobe/forms/af/submit/L2NvbnRlbnQvZm9ybXMvYWYvZGVtbw==";
        String mappedPath = "/content/adobe/forms/af/submit/L2NvbnRlbnQvZm9ybXMvYWYvZGVtbw==";
        Mockito.when(resourceResolver.map("/adobe/forms/af/submit/L2NvbnRlbnQvZm9ybXMvYWYvZGVtbw==")).thenReturn(mappedPath);

        // Set the mocked resource resolver in the context
        context.registerService(org.apache.sling.api.resource.ResourceResolver.class, resourceResolver);

        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        String action = formContainer.getAction();

        // Verify that the mapped path is used in the action URL
        assertTrue(action.contains(mappedPath));

        // Verify that the map method was called with the correct path (called during mock setup + actual execution)
        Mockito.verify(resourceResolver, times(2)).map("/adobe/forms/af/submit/L2NvbnRlbnQvZm9ybXMvYWYvZGVtbw==");
    }

    @Test
    void testGetDataUrlWithResourceResolverMapping() throws Exception {
        // Create a spy of the resource resolver to mock the map method
        org.apache.sling.api.resource.ResourceResolver resourceResolver = Mockito.spy(context.resourceResolver());

        // Mock the map method to return a mapped path
        String originalPath = "/adobe/forms/af/data/L2NvbnRlbnQvZm9ybXMvYWYvZGVtbw==";
        String mappedPath = "/content/adobe/forms/af/data/L2NvbnRlbnQvZm9ybXMvYWYvZGVtbw==";
        Mockito.when(resourceResolver.map("/adobe/forms/af/data/L2NvbnRlbnQvZm9ybXMvYWYvZGVtbw==")).thenReturn(mappedPath);

        // Set the mocked resource resolver in the context
        context.registerService(org.apache.sling.api.resource.ResourceResolver.class, resourceResolver);

        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        String dataUrl = formContainer.getDataUrl();

        // Verify that the mapped path is used in the data URL
        assertTrue(dataUrl.contains(mappedPath));
        assertEquals(mappedPath, dataUrl);

        // Verify that the map method was called with the correct path (called during mock setup + actual execution)
        Mockito.verify(resourceResolver, times(2)).map("/adobe/forms/af/data/L2NvbnRlbnQvZm9ybXMvYWYvZGVtbw==");
    }

    @Test
    void testResourceResolverMappingIdentityWhenNoMapping() throws Exception {
        // Test the case where resourceResolver.map() returns the same path (no mapping configured)
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);

        String action = formContainer.getAction();
        String dataUrl = formContainer.getDataUrl();

        // These should match the original expected values when no mapping is applied
        assertEquals("/adobe/forms/af/submit/L2NvbnRlbnQvZm9ybXMvYWYvZGVtbw==", action);
        assertEquals("/adobe/forms/af/data/L2NvbnRlbnQvZm9ybXMvYWYvZGVtbw==", dataUrl);
    }

    @Test
    void testGetDorProperties() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertEquals("generate", formContainer.getDorProperties().get("dorType"));
        assertEquals("xyz", formContainer.getDorProperties().get("dorTemplateRef"));
    }

    @Test
    void testGetIdWithFormRenderingInsideEmbedContainer() throws Exception {
        FormContainer formContainer = getFormContainerWithLocaleUnderTest(FORM_CONTAINER_PATH_IN_SITES);
        assertNotNull(formContainer.getId());
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
    void testJSONExportWithAutoSaveEnable() throws Exception {
        context.load().json(BASE + "/test-content-auto-save.json", PATH_FORM_WITH_AUTO_SAVE);
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_WITH_AUTO_SAVE,
            FormContainer.class, context);
        Utils.testJSONExport(formContainer, Utils.getTestExporterJSONPath(BASE, PATH_FORM_WITH_AUTO_SAVE));
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

    @Test
    void testGetRoleAttribute() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertEquals(formContainer.getRoleAttribute(), "test-role-attribute");
    }

    @Test
    void testGetContextPath() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertEquals(formContainer.getRedirectUrl(), "/content/wknd.html");
        // Test with contextPath set
        formContainer.setContextPath("/test");
        assertEquals(formContainer.getRedirectUrl(), "/test/content/wknd.html");
    }

    @Test
    void testGetContextPathWithDefaultRedirect() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1_WITHOUT_REDIRECT, FormContainer.class, context);
        assertEquals(formContainer.getRedirectUrl(),
            "/content/forms/af/demo/jcr:content/formcontainerv2WithoutRedirect.guideThankYouPage.html");
        // Test with contextPath set
        formContainer.setContextPath("/test");
        assertEquals(formContainer.getRedirectUrl(),
            "/test/content/forms/af/demo/jcr:content/formcontainerv2WithoutRedirect.guideThankYouPage.html");
    }

    @Test
    void testGetGridClassNames() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertNull(formContainer.getGridClassNames());
    }

    @Test
    void testGetColumnClassNames() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertEquals(formContainer.getColumnClassNames().isEmpty(), true);
    }

    @Test
    void testGetColumnCount() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertEquals(formContainer.getColumnCount(), 0);
    }

    @Test
    void testGetAppliedCSSClass() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertNull(formContainer.getAppliedCssClasses());
    }

    @Test
    void testGetExportedAllowedComponents() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertNull(formContainer.getExportedAllowedComponents());
    }

    @Test
    void testGetParentPagePathForForm() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertEquals(formContainer.getParentPagePath(), "/content/forms/af/demo");
    }

    @Test
    void testGetParentPagePathInSites() throws Exception {
        FormContainer formContainerInSites = Utils.getComponentUnderTest(FORM_CONTAINER_PATH_IN_SITES, FormContainer.class, context);
        assertEquals(formContainerInSites.getParentPagePath(), SITES_PATH);
    }

    @Test
    void testVisit() throws Exception {
        Consumer<ComponentExporter> callback = mock(Consumer.class);
        // Get the JSON form representation using Utils.getComponentUnderTest
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);

        // Call the visit method on the formContainer
        formContainer.visit(callback);

        // Verify that the callback consumer was called with the expected components
        ArgumentCaptor<ComponentExporter> captor = ArgumentCaptor.forClass(ComponentExporter.class);
        verify(callback, times(1)).accept(captor.capture());

    }

    private FormContainer getFormContainerWithLocaleUnderTest(String resourcePath) throws Exception {
        context.currentResource(resourcePath);
        // added this since AF API expects this to be present
        GuideLocalizationService guideLocalizationService = context.registerService(GuideLocalizationService.class,
            mock(GuideLocalizationService.class));
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
        request.setAttribute("formRenderingInsideEmbedContainer", "");
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put(GuideConstants.AF_LANGUAGE_PARAMETER, "de");
        request.setParameterMap(paramMap);
        context.currentResource().adaptTo(FormContainer.class);
        return request.adaptTo(FormContainer.class);
    }

    private FormContainer getFormContainerWithRTLLocaleUnderTest(String resourcePath) throws Exception {
        context.currentResource(resourcePath);
        // added this since AF API expects this to be present
        GuideLocalizationService guideLocalizationService = context.registerService(GuideLocalizationService.class,
            mock(GuideLocalizationService.class));
        Mockito.when(guideLocalizationService.getSupportedLocales()).thenReturn(new String[] { "en", "ar-ae" });
        MockResourceBundleProvider bundleProvider = (MockResourceBundleProvider) context.getService(ResourceBundleProvider.class);
        MockResourceBundle resourceBundleRTL = (MockResourceBundle) bundleProvider.getResourceBundle(
            "/content/dam/formsanddocuments/demo/jcr:content/dictionary", new Locale("ar-ae"));
        resourceBundleRTL.putAll(new HashMap<String, String>() {
            {
                put("guideContainer##textinput##description##5648", "dummy 1");
            }
        });
        MockSlingHttpServletRequest request = context.request();
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put(GuideConstants.AF_LANGUAGE_PARAMETER, "ar-ae");
        request.setParameterMap(paramMap);
        context.currentResource().adaptTo(FormContainer.class);
        return request.adaptTo(FormContainer.class);
    }

    @Test
    void testGetName() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertNull(formContainer.getName());
    }

    @Test
    public void testRequestAttributeIfContainerPageDifferent() {
        Resource resource = Mockito.mock(Resource.class);
        Mockito.when(resource.getValueMap()).thenReturn(ValueMap.EMPTY);
        Page afPage = Mockito.mock(Page.class);
        Mockito.when(afPage.getPath()).thenReturn(AF_PATH);
        PageManager pageManager = Mockito.mock(PageManager.class);
        Mockito.when(pageManager.getContainingPage(resource)).thenReturn(afPage);
        Page sitePage = Mockito.mock(Page.class);
        Mockito.when(sitePage.getPath()).thenReturn("/content/examplepage");
        Mockito.when(sitePage.getPageManager()).thenReturn(pageManager);
        MockSlingHttpServletRequest request = context.request();

        FormContainerImpl formContainerImpl = new FormContainerImpl();
        Utils.setInternalState(formContainerImpl, "request", request);
        Method initMethod = Utils.getPrivateMethod(FormContainerImpl.class, "initFormContainerModel");
        try {
            // Test when currentPage is null
            initMethod.invoke(formContainerImpl);
            Assertions.assertNull(request.getAttribute(FormConstants.REQ_ATTR_REFERENCED_PATH));
            Utils.setInternalState(formContainerImpl, "currentPage", sitePage);
            // Test when resource is not set somehow
            initMethod.invoke(formContainerImpl);
            Assertions.assertNull(request.getAttribute(FormConstants.REQ_ATTR_REFERENCED_PATH));
            Utils.setInternalState(formContainerImpl, "resource", resource);
            initMethod.invoke(formContainerImpl);
            String referencePage = (String) request.getAttribute(FormConstants.REQ_ATTR_REFERENCED_PATH);
            Assertions.assertEquals(referencePage, AF_PATH, "Reference page should be set to the AF page");
        } catch (Exception e) {
            fail("initFormContainerModel method should have invoked");
        }
    }

    @Test
    void testGetFormDataEnabledWhenPrefillServiceIsSet() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertTrue(Boolean.valueOf(formContainer.getProperties().get(FormContainerImpl.FD_FORM_DATA_ENABLED).toString()));
    }

    @Test
    void testGetFormDataEnabledWhenDataRefIsSet() throws Exception {
        MockSlingHttpServletRequest request = context.request();
        Map<String, Object> tempMap = new HashMap<>();
        tempMap.put(GuideConstants.AF_DATA_REF, "abc");
        request.setParameterMap(tempMap);
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_WITHOUT_PREFILL, FormContainer.class, context);
        assertTrue(Boolean.valueOf(formContainer.getProperties().get(FormContainerImpl.FD_FORM_DATA_ENABLED).toString()));
        // reset the parameter map
        request.setParameterMap(new HashMap<>());
    }

    @Test
    void testDraftIdPropertyWhenDataRefIsSet() throws Exception {
        MockSlingHttpServletRequest request = context.request();
        Map<String, Object> tempMap = new HashMap<>();
        tempMap.put(GuideConstants.AF_DATA_REF, "service://FP/draft/KH5DOFY2RMWVOOVREE324MRXIY");
        request.setParameterMap(tempMap);
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_WITHOUT_PREFILL, FormContainer.class, context);
        assertEquals("KH5DOFY2RMWVOOVREE324MRXIY", formContainer.getProperties().get(ReservedProperties.FD_DRAFT_ID));
        // reset the parameter map
        request.setParameterMap(new HashMap<>());
    }

    @Test
    void testDraftIdPropertyWhenDraftIdIsNotPresentInDataRef() throws Exception {
        MockSlingHttpServletRequest request = context.request();
        Map<String, Object> tempMap = new HashMap<>();
        tempMap.put(GuideConstants.AF_DATA_REF, "service://FP/draft");
        request.setParameterMap(tempMap);
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_WITHOUT_PREFILL, FormContainer.class, context);
        assertNull(formContainer.getProperties().get(ReservedProperties.FD_DRAFT_ID));
        // reset the parameter map
        request.setParameterMap(new HashMap<>());
    }

    @Test
    void testGetFormDataDisabled() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_WITHOUT_PREFILL, FormContainer.class, context);
        assertFalse(Boolean.valueOf(formContainer.getProperties().get(FormContainerImpl.FD_FORM_DATA_ENABLED).toString()));
    }

    @Test
    public void testAddClientLibRef() {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1,
            FormContainer.class, context);
        FormClientLibManager formClientLibManager = context.request().adaptTo(FormClientLibManager.class);
        List<String> clientLibs = formClientLibManager.getClientLibRefList();
        assertEquals(1, clientLibs.size());
        assertEquals("abc", clientLibs.get(0));
    }

    @Test
    public void testGetLanguageDirection() throws Exception {
        FormContainer formContainer = getFormContainerWithRTLLocaleUnderTest(PATH_FORM_1);
        assertEquals("rtl", formContainer.getLanguageDirection());

        FormContainer formContainerLtr = getFormContainerWithLocaleUnderTest(PATH_FORM_1);
        assertEquals("ltr", formContainer.getLanguageDirection());
    }

    @Test
    void testNoFieldType() {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_WITHOUT_FIELDTYPE, FormContainer.class, context);
        assertEquals(FieldType.FORM.getValue(), formContainer.getFieldType());
    }

    @Test
    public void testGetIsHamburgerMenuEnabled() {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertFalse(Boolean.valueOf(formContainer.getIsHamburgerMenuEnabled().toString()));
    }

    /**
     * Test to check if the properties are fetched from the CoreComponentCustomPropertiesProvider are part of form container properties or
     * not
     * Also, if same properties is set in form container, then it should override the properties from CoreComponentCustomPropertiesProvider
     * 
     * @throws Exception
     */
    @Test
    void testGetPropertiesForCoreComponentCustomPropertiesProvider() throws Exception {
        CoreComponentCustomPropertiesProvider coreComponentCustomPropertiesProvider = Mockito.mock(
            CoreComponentCustomPropertiesProvider.class);
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        Utils.setInternalState(formContainer, "coreComponentCustomPropertiesProvider", coreComponentCustomPropertiesProvider);
        Mockito.when(coreComponentCustomPropertiesProvider.getProperties()).thenReturn(new HashMap<String, Object>() {
            {
                put("fd:changeEventBehaviour", "deps");
                put("customProp", "customValue");
            }
        });
        assertEquals("deps", formContainer.getProperties().get("fd:changeEventBehaviour"));
        assertEquals("customPropValue", formContainer.getProperties().get("customProp"));
    }

    @Test
    void testGetPropertiesForCoreComponentCustomPropertiesProviderForNull() throws Exception {
        CoreComponentCustomPropertiesProvider coreComponentCustomPropertiesProvider = Mockito.mock(
            CoreComponentCustomPropertiesProvider.class);
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        Utils.setInternalState(formContainer, "coreComponentCustomPropertiesProvider", coreComponentCustomPropertiesProvider);
        Mockito.when(coreComponentCustomPropertiesProvider.getProperties()).thenReturn(null);
        assertEquals("customPropValue", formContainer.getProperties().get("customProp"));
    }

    @Test
    void testCustomFunctionUrl() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertEquals("/adobe/forms/af/customfunctions/L2NvbnRlbnQvZm9ybXMvYWYvZGVtbw==", formContainer.getCustomFunctionUrl());
    }

    @Test
    void testGetCustomFunctionUrlWithResourceResolverMapping() throws Exception {
        // Create a spy of the resource resolver to mock the map method
        org.apache.sling.api.resource.ResourceResolver resourceResolver = Mockito.spy(context.resourceResolver());

        // Mock the map method to return a mapped path
        String originalPath = "/adobe/forms/af/customfunctions/L2NvbnRlbnQvZm9ybXMvYWYvZGVtbw==";
        String mappedPath = "/content/adobe/forms/af/customfunctions/L2NvbnRlbnQvZm9ybXMvYWYvZGVtbw==";
        Mockito.when(resourceResolver.map("/adobe/forms/af/customfunctions/L2NvbnRlbnQvZm9ybXMvYWYvZGVtbw==")).thenReturn(mappedPath);

        // Set the mocked resource resolver in the context
        context.registerService(org.apache.sling.api.resource.ResourceResolver.class, resourceResolver);

        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        String customFunctionUrl = formContainer.getCustomFunctionUrl();

        // Verify that the mapped path is used in the custom function URL
        assertTrue(customFunctionUrl.contains(mappedPath));
        assertEquals(mappedPath, customFunctionUrl);

        // Verify that the map method was called with the correct path (called during mock setup + actual execution)
        Mockito.verify(resourceResolver, times(2)).map("/adobe/forms/af/customfunctions/L2NvbnRlbnQvZm9ybXMvYWYvZGVtbw==");
    }

    @Test
    public void testGetAutoSaveProperties() throws Exception {
        context.load().json(BASE + "/test-content-auto-save.json", PATH_FORM_WITH_AUTO_SAVE);
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_WITH_AUTO_SAVE,
            FormContainer.class, context);
        assertNotNull(formContainer.getAutoSaveConfig());
        assertTrue(formContainer.getAutoSaveConfig().isEnableAutoSave());
        assertEquals(AutoSaveConfiguration.AutoSaveStrategyType.TIME, formContainer.getAutoSaveConfig().getAutoSaveStrategyType());
    }

    @Test
    public void testDefaultGetAutoSaveConfig() throws Exception {
        FormContainer formContainer1 = new FormContainer() {

            @Override
            public FormMetaData getMetaData() {
                return null;
            }

            @Override
            public String getEncodedCurrentPagePath() {
                return null;
            }

            @Override
            public String getThankYouMessage() {
                return null;
            }

            @Override
            public List<? extends ComponentExporter> getItems() {
                return null;
            }

            @Override
            public String getGridClassNames() {
                return null;
            }

            @Override
            public Map<String, String> getColumnClassNames() {
                return null;
            }

            @Override
            public int getColumnCount() {
                return 0;
            }

            @Override
            public AllowedComponentsExporter getExportedAllowedComponents() {
                return null;
            }
        };
        ;
        assertNull(formContainer1.getAutoSaveConfig());
    }

    private void setMockClientBuilderFactory(FormContainerImpl formContainer) {
        HttpClientBuilderFactory mockClientBuilderFactory = mock(HttpClientBuilderFactory.class);
        HttpClientBuilder mockHttpClientBuilder = mock(HttpClientBuilder.class);
        CloseableHttpClient mockHttpClient = mock(CloseableHttpClient.class);
        CloseableHttpResponse mockResponse = mock(CloseableHttpResponse.class);

        // Configure mock response with 200 status and spreadsheet in supported actions
        when(mockResponse.getStatusLine()).thenReturn(mock(StatusLine.class));
        when(mockResponse.getStatusLine().getStatusCode()).thenReturn(200);
        try {
            when(mockResponse.getEntity()).thenReturn(new StringEntity("{\"supported\":[\"spreadsheet\"]}"));

            // Wire up mock chain
            when(mockClientBuilderFactory.newBuilder()).thenReturn(mockHttpClientBuilder);
            when(mockHttpClientBuilder.build()).thenReturn(mockHttpClient);
            when(mockHttpClient.execute(any())).thenReturn(mockResponse);
        } catch (Exception e) {}

        // Register and inject mocks
        context.registerService(HttpClientBuilderFactory.class, mockClientBuilderFactory);
        Utils.setInternalState(formContainer, "clientBuilderFactory", mockClientBuilderFactory);
    }

    @Test
    public void testJSONExportWithSubmissionAttribute() throws Exception {
        FormContainerImpl formContainer = Utils.getComponentUnderTest(PATH_FORM_SUBMISSION_VIEW, FormContainerImpl.class, context);
        setMockClientBuilderFactory(formContainer);
        context.request().setAttribute(FormConstants.X_ADOBE_FORM_DEFINITION, FormConstants.FORM_DEFINITION_SUBMISSION);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writerWithView(Views.Publish.class).writeValueAsString(formContainer);
        JsonNode formJson = mapper.readTree(json);
        JsonNode submitJson = formJson.get("properties").get("fd:submit");
        assertTrue("Should have fd:submit at top level", submitJson != null);
        assertEquals("fd/af/components/guidesubmittype/franklin/spreadsheet", submitJson.get("actionType").asText());
        assertEquals("test@example.com", submitJson.get(SS_EMAIL).get("mailto").get(0).asText());
        assertEquals("sender@example.com", submitJson.get(SS_EMAIL).get("from").asText());
        assertEquals("Test Subject", submitJson.get(SS_EMAIL).get("subject").asText());
        assertEquals("spreadsheet", submitJson.get("actionName").asText());
        assertEquals("http://localhost/testurl", submitJson.get(SS_SPREADSHEET).get("spreadsheetUrl").asText());

        Utils.testJSONExport(formContainer,
            Utils.getTestExporterJSONPath(BASE, "withSubmissionAttribute"));
    }

    @Test
    public void testJSONExportWithSubmissionHeader() throws Exception {
        FormContainerImpl formContainer = Utils.getComponentUnderTest(PATH_FORM_SUBMISSION_VIEW,
            FormContainerImpl.class, context);
        setMockClientBuilderFactory(formContainer);
        context.request().setHeader(FormConstants.X_ADOBE_FORM_DEFINITION, FormConstants.FORM_DEFINITION_SUBMISSION);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writerWithView(Views.Publish.class).writeValueAsString(formContainer);
        JsonNode formJson = mapper.readTree(json);
        JsonNode submitJson = formJson.get("properties").get("fd:submit");
        assertTrue("Should have fd:submit at top level", submitJson != null);
        assertEquals("fd/af/components/guidesubmittype/franklin/spreadsheet", submitJson.get("actionType").asText());
        assertEquals("test@example.com", submitJson.get(SS_EMAIL).get("mailto").get(0).asText());
        assertEquals("sender@example.com", submitJson.get(SS_EMAIL).get("from").asText());
        assertEquals("Test Subject", submitJson.get(SS_EMAIL).get("subject").asText());
        assertEquals("spreadsheet", submitJson.get("actionName").asText());
        assertEquals("http://localhost/testurl", submitJson.get(SS_SPREADSHEET).get("spreadsheetUrl").asText());

        Utils.testJSONExport(formContainer,
            Utils.getTestExporterJSONPath(BASE, "withSubmissionAttribute"));
    }

    @Test
    public void testJSONExportWithoutSubmissionAttribute() throws Exception {
        FormContainerImpl formContainer = Utils.getComponentUnderTest(PATH_FORM_SUBMISSION_VIEW,
            FormContainerImpl.class, context);
        setMockClientBuilderFactory(formContainer);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writerWithView(Views.Publish.class).writeValueAsString(formContainer);
        JsonNode formJson = mapper.readTree(json);
        assertNull("Should not have fd:submit at top level", formJson.get("properties").get("fd:submit"));
        Utils.testJSONExport(formContainer,
            Utils.getTestExporterJSONPath(BASE, "withoutSubmissionAttribute"));
    }

    @Test
    public void testActionForUEFormSpreadsheetSubmission() throws Exception {
        FormContainerImpl formContainer = Utils.getComponentUnderTest(PATH_UE_FORM_WITH_SPREADSHEET_SUBMISSION,
            FormContainerImpl.class, context);
        setMockClientBuilderFactory(formContainer);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writerWithView(Views.Publish.class).writeValueAsString(formContainer);
        JsonNode formJson = mapper.readTree(json);
        assertEquals("action should be empty for ue form with submit action supported via submission service", "",
            formJson.get("action").asText());
        Utils.testJSONExport(formContainer,
            Utils.getTestExporterJSONPath(BASE, PATH_UE_FORM_WITH_SPREADSHEET_SUBMISSION));
    }

    @Test
    public void testActionForUEFormRestSubmission() throws Exception {
        FormContainerImpl formContainer = Utils.getComponentUnderTest(PATH_UE_FORM_REST_SUBMISSION,
            FormContainerImpl.class, context);
        setMockClientBuilderFactory(formContainer);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writerWithView(Views.Publish.class).writeValueAsString(formContainer);
        JsonNode formJson = mapper.readTree(json);
        assertTrue("action should not be empty for ue form with submit action not supported via submission service",
            formJson.get("action").asText().length() > 0);
        Utils.testJSONExport(formContainer, Utils.getTestExporterJSONPath(BASE, PATH_UE_FORM_REST_SUBMISSION));
    }

    @Test
    public void testActionForCCFormSpreadsheetSubmission() throws Exception {
        FormContainerImpl formContainer = Utils.getComponentUnderTest(PATH_CC_FORM_SPREADSHEET_SUBMISSION,
            FormContainerImpl.class, context);
        setMockClientBuilderFactory(formContainer);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writerWithView(Views.Publish.class).writeValueAsString(formContainer);
        JsonNode formJson = mapper.readTree(json);
        String action = formJson.get("action").asText();
        String[] actionParts = action.split("/");
        String lastPart = actionParts[actionParts.length - 1];
        String decodedAction = new String(Base64.getDecoder().decode(lastPart));
        assertTrue(
            "action should end with .model.json for cc forms for submit action  supported via submission service",
            decodedAction.endsWith(".model.json"));
        Utils.testJSONExport(formContainer, Utils.getTestExporterJSONPath(BASE, PATH_CC_FORM_SPREADSHEET_SUBMISSION));
    }

    @Test
    public void testActionForCCFormRestSubmission() throws Exception {
        FormContainerImpl formContainer = Utils.getComponentUnderTest(PATH_CC_FORM_REST_SUBMISSION,
            FormContainerImpl.class, context);
        setMockClientBuilderFactory(formContainer);
        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writerWithView(Views.Publish.class).writeValueAsString(formContainer);
        JsonNode formJson = mapper.readTree(json);
        String action = formJson.get("action").asText();
        String[] actionParts = action.split("/");
        String lastPart = actionParts[actionParts.length - 1];
        String decodedAction = new String(Base64.getDecoder().decode(lastPart));
        assertTrue(
            "action should notend with .model.json for cc forms for submit action not supported via submission service",
            !decodedAction.endsWith(".model.json"));
        Utils.testJSONExport(formContainer, Utils.getTestExporterJSONPath(BASE, PATH_CC_FORM_REST_SUBMISSION));
    }

    @Test
    void testExcludeFromDoRIfHiddenFromViewPrint() throws Exception {
        // Setup: create a resource structure with fd:view/print child and excludeFromDoRIfHidden property
        context.create().resource(PATH_FORM_EXCLUDE_FROM_DOR_IF_HIDDEN,
            "sling:resourceType", "core/fd/components/form/container/v2/container");
        context.create().resource(PATH_FORM_EXCLUDE_FROM_DOR_IF_HIDDEN + "/fd:view/print",
            "excludeFromDoRIfHidden", true);

        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_EXCLUDE_FROM_DOR_IF_HIDDEN, FormContainer.class, context);
        Map<String, Object> dorProperties = ((FormContainerImpl) formContainer).getDorProperties();
        assertTrue(dorProperties.containsKey("fd:excludeFromDoRIfHidden"));
        assertEquals(true, dorProperties.get("fd:excludeFromDoRIfHidden"));
    }

    @Test
    void testExcludeFromDoRIfHiddenFromViewPrintFalse() throws Exception {
        // Setup: create a resource structure with fd:view/print child and excludeFromDoRIfHidden property set to false
        context.create().resource(PATH_FORM_EXCLUDE_FROM_DOR_IF_HIDDEN,
            "sling:resourceType", "core/fd/components/form/container/v2/container");
        context.create().resource(PATH_FORM_EXCLUDE_FROM_DOR_IF_HIDDEN + "/fd:view/print",
            "excludeFromDoRIfHidden", false);

        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_EXCLUDE_FROM_DOR_IF_HIDDEN, FormContainer.class, context);
        Map<String, Object> dorProperties = ((FormContainerImpl) formContainer).getDorProperties();
        assertTrue(dorProperties.containsKey("fd:excludeFromDoRIfHidden"));
        assertEquals(false, dorProperties.get("fd:excludeFromDoRIfHidden"));
    }

    @Test
    void testJSONExportWithFragment() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_WITH_FRAGMENT, FormContainerImpl.class, context);
        Utils.testJSONExport(formContainer, Utils.getTestExporterJSONPath(BASE, PATH_FORM_WITH_FRAGMENT));
    }

    @Test
    void testSetLang() throws Exception {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        // Test setting a language
        String testLang = "fr";
        formContainer.setLang(testLang);
        // Verify that the language was set correctly
        assertEquals(testLang, formContainer.getLang());
        // Test setting another language
        String anotherLang = "es";
        formContainer.setLang(anotherLang);
        assertEquals(anotherLang, formContainer.getLang());
        // Test setting null language
        formContainer.setLang(null);
        assertEquals(formContainer.getLang(), "en");
    }
}
