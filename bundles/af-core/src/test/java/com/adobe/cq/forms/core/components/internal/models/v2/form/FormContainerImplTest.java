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

import org.apache.sling.api.resource.Resource;
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

import com.adobe.aemds.guide.service.GuideLocalizationService;
import com.adobe.aemds.guide.utils.GuideConstants;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.FormClientLibManager;
import com.adobe.cq.forms.core.components.models.form.FormContainer;
import com.adobe.cq.forms.core.components.models.form.TextInput;
import com.adobe.cq.forms.core.components.models.form.ThankYouOption;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.i18n.I18n;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.msm.api.MSMNameConstants;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(AemContextExtension.class)
public class FormContainerImplTest {
    private static final String BASE = "/form/formcontainer";
    private static final String CONTENT_PAGE_ROOT = "/content/forms/af/demo";
    private static final String CONTENT_ROOT = CONTENT_PAGE_ROOT + "/jcr:content";
    private static final String CONTENT_DAM_ROOT = "/content/dam/formsanddocuments/demo";
    private static final String PATH_FORM_1 = CONTENT_ROOT + "/formcontainerv2";
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
        assertEquals("0.14.0", formContainer.getAdaptiveFormVersion());
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
    public void testGetHamburgerMenu() {
        FormContainer formContainer = Utils.getComponentUnderTest(PATH_FORM_1, FormContainer.class, context);
        assertFalse(Boolean.valueOf(formContainer.getHamburgerMenu().toString()));
    }
}
