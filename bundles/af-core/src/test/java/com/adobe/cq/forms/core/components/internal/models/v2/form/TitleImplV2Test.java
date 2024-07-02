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

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.caconfig.ConfigurationBuilder;
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
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.FormTitle;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.cq.wcm.core.components.internal.DataLayerConfig;
import com.day.cq.wcm.api.WCMMode;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.lenient;

@ExtendWith(AemContextExtension.class)
public class TitleImplV2Test {
    private static final String BASE = "/form/titleV2";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_TITLE = CONTENT_ROOT + "/title";

    private static final String PATH_TITLE_TYPE = CONTENT_ROOT + "/title-type";

    private static final String PATH_TITLE_NOPROPS = CONTENT_ROOT + "/title-noprops";

    private static final String PATH_TITLE_WRONGTYPE = CONTENT_ROOT + "/title-wrongtype";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testExportedType() {
        FormTitle title = Utils.getComponentUnderTest(PATH_TITLE, FormTitle.class, context);
        assertEquals(FormConstants.RT_FD_FORM_TITLE_V2, title.getExportedType());
        FormTitle titleMock = Mockito.mock(FormTitle.class);
        Mockito.when(titleMock.getExportedType()).thenCallRealMethod();
        assertEquals("", titleMock.getExportedType());
    }

    @Test
    protected void testGetTitleFromResource() {
        FormTitle title = Utils.getComponentUnderTest(PATH_TITLE, FormTitle.class, context);
        assertNull(title.getFormat());
        Utils.testJSONExport(title, Utils.getTestExporterJSONPath(BASE, PATH_TITLE));
    }

    @Test
    protected void testGetTitleFromResourceWithElementInfo() {
        FormTitle title = Utils.getComponentUnderTest(PATH_TITLE_TYPE, FormTitle.class, context);
        assertEquals("Title_custom", title.getText());
        assertEquals("h3", title.getFormat());
        Utils.testJSONExport(title, Utils.getTestExporterJSONPath(BASE, PATH_TITLE_TYPE));
        FormTitle titleMock = Mockito.mock(FormTitle.class);
        Mockito.when(titleMock.getFormat()).thenCallRealMethod();
        Mockito.when(titleMock.getText()).thenCallRealMethod();
        assertEquals(null, titleMock.getFormat());
        assertEquals(null, titleMock.getText());
    }

    @Test
    protected void testGetTitleResourcePageStyleType() {
        FormTitle title = getTitleUnderTest(PATH_TITLE_NOPROPS, FormTitle.PN_DESIGN_DEFAULT_FORMAT, "h2");
        assertEquals("h2", title.getFormat());
        Utils.testJSONExport(title, Utils.getTestExporterJSONPath(BASE, PATH_TITLE_NOPROPS));
    }

    @Test
    protected void defaultTitleShouldBePickedFromGuideContainer()
        throws NoSuchFieldException, IllegalAccessException, NoSuchMethodException, InvocationTargetException {
        FormTitle title = getTitleUnderTest(PATH_TITLE_NOPROPS, FormTitle.PN_DESIGN_DEFAULT_FORMAT, "h2");
        Resource mockGuideContainerResource = Mockito.mock(Resource.class);
        Mockito.when(mockGuideContainerResource.isResourceType(Mockito.anyString())).thenReturn(true);
        ValueMap mockVM = Mockito.mock(ValueMap.class);
        Mockito.when(mockVM.get("title", String.class)).thenReturn("form title");
        Mockito.when(mockVM.get("fieldType", String.class)).thenReturn("form");
        Mockito.when(mockGuideContainerResource.getValueMap()).thenReturn(mockVM);
        Field resourceField = title.getClass().getDeclaredField("resource");
        resourceField.setAccessible(true);
        resourceField.set(title, mockGuideContainerResource);
        Method initModel = title.getClass().getDeclaredMethod("initModel");
        initModel.setAccessible(true);
        initModel.invoke(title);
        assertEquals("form title", title.getText());
    }

    @Test
    protected void testGetTitleResourcePageStyleTypeHea() {
        FormTitle title = getTitleUnderTest(PATH_TITLE_NOPROPS, FormTitle.PN_DESIGN_DEFAULT_FORMAT, "h2");
        assertEquals("h2", title.getFormat());
        Utils.testJSONExport(title, Utils.getTestExporterJSONPath(BASE, PATH_TITLE_NOPROPS));
    }

    @Test
    protected void testGetTitleFromCurrentPageWithWrongElementInfo() {
        FormTitle title = Utils.getComponentUnderTest(PATH_TITLE_WRONGTYPE, FormTitle.class, context);
        assertNull(title.getFormat());
        Utils.testJSONExport(title, Utils.getTestExporterJSONPath(BASE, PATH_TITLE_WRONGTYPE));
    }

    @Test
    void testJSONExport() throws Exception {
        FormTitle title = Utils.getComponentUnderTest(PATH_TITLE, FormTitle.class, context);
        Utils.testJSONExport(title, Utils.getTestExporterJSONPath(BASE, PATH_TITLE));
    }

    @Test
    void testTitleWithWcmEditMode() throws Exception {
        context.request().setAttribute(WCMMode.REQUEST_ATTRIBUTE_NAME, WCMMode.EDIT);
        FormTitle title = Utils.getComponentUnderTest(PATH_TITLE, FormTitle.class, context);
        assertEquals("Title", title.getText());
    }

    @Test
    void testTitleWithLocale() throws Exception {
        context.currentResource(PATH_TITLE);
        // added this since AF API expects this to be present
        GuideLocalizationService guideLocalizationService = context.registerService(GuideLocalizationService.class, Mockito.mock(
            GuideLocalizationService.class));
        Mockito.when(guideLocalizationService.getSupportedLocales()).thenReturn(new String[] { "en", "de" });
        MockResourceBundleProvider bundleProvider = (MockResourceBundleProvider) context.getService(ResourceBundleProvider.class);
        MockResourceBundle resourceBundle = (MockResourceBundle) bundleProvider.getResourceBundle(
            "/content/dam/formsanddocuments/demo/jcr:content/dictionary", new Locale("de"));
        resourceBundle.putAll(new HashMap<String, String>() {
            {
                put("guideContainer##title##text##5648", "Title");
            }
        });
        MockSlingHttpServletRequest request = context.request();
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put(GuideConstants.AF_LANGUAGE_PARAMETER, "de");
        request.setParameterMap(paramMap);
        FormTitle title = request.adaptTo(FormTitle.class);
        assertEquals("Title", title.getText());
    }

    protected FormTitle getTitleUnderTest(String resourcePath, Object... properties) {
        ConfigurationBuilder builder = Mockito.mock(ConfigurationBuilder.class);
        DataLayerConfig dataLayerConfig = Mockito.mock(DataLayerConfig.class);
        lenient().when(dataLayerConfig.enabled()).thenReturn(true);
        lenient().when(dataLayerConfig.skipClientlibInclude()).thenReturn(false);
        lenient().when(builder.as(DataLayerConfig.class)).thenReturn(dataLayerConfig);
        context.registerAdapter(Resource.class, ConfigurationBuilder.class, builder);
        Resource resource = context.currentResource(resourcePath);
        if (resource != null && properties != null) {
            context.contentPolicyMapping(resource.getResourceType(), properties);
        }
        return context.request().adaptTo(FormTitle.class);

    }
}
