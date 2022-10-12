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

import com.adobe.aemds.guide.utils.GuideConstants;
import com.adobe.cq.forms.core.components.models.aemform.AEMForm;
import com.adobe.cq.forms.core.components.models.form.FormContainer;
import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import java.util.Locale;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Title;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.i18n.ResourceBundleProvider;
import org.apache.sling.testing.mock.sling.MockResourceBundle;
import org.apache.sling.testing.mock.sling.MockResourceBundleProvider;
import com.adobe.aemds.guide.service.GuideLocalizationService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@ExtendWith(AemContextExtension.class)
public class TitleImplTest {
    private static final String BASE = "/form/title";
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
        Title title = Utils.getComponentUnderTest(PATH_TITLE, Title.class, context);
        assertEquals(FormConstants.RT_FD_FORM_TITLE_V1, title.getExportedType());
        Title titleMock = Mockito.mock(Title.class);
        Mockito.when(titleMock.getExportedType()).thenCallRealMethod();
        assertEquals("", titleMock.getExportedType());
    }

    @Test
    protected void testGetTitleFromResource() {
        Title title = Utils.getComponentUnderTest(PATH_TITLE, Title.class, context);
        assertNull(title.getType());
        Utils.testJSONExport(title, Utils.getTestExporterJSONPath(BASE, PATH_TITLE));
    }

    @Test
    protected void testGetTitleFromResourceWithElementInfo() {
        Title title = Utils.getComponentUnderTest(PATH_TITLE_TYPE, Title.class, context);
        assertEquals("Title_custom", title.getText());
        assertEquals("h3", title.getType());
        Utils.testJSONExport(title, Utils.getTestExporterJSONPath(BASE, PATH_TITLE_TYPE));
        Title titleMock = Mockito.mock(Title.class);
        Mockito.when(titleMock.getType()).thenCallRealMethod();
        assertEquals("", titleMock.getType());
        assertEquals("", titleMock.getText());
    }

    @Test
    protected void testGetTitleResourcePageStyleType() {
        Title title = Utils.getComponentUnderTest(PATH_TITLE_NOPROPS, Title.class, context);
        Resource resource = context.currentResource(PATH_TITLE_NOPROPS);
        context.contentPolicyMapping(resource.getResourceType(), Title.PN_DESIGN_DEFAULT_TYPE, "h2");
        assertEquals("h2", title.getType());
        Utils.testJSONExport(title, Utils.getTestExporterJSONPath(BASE, PATH_TITLE_NOPROPS));
    }

    @Test
    protected void testGetTitleFromCurrentPageWithWrongElementInfo() {
        Title title = Utils.getComponentUnderTest(PATH_TITLE_WRONGTYPE, Title.class, context);
        assertNull(title.getType());
        Utils.testJSONExport(title, Utils.getTestExporterJSONPath(BASE, PATH_TITLE_WRONGTYPE));
    }

    @Test
    void testJSONExport() throws Exception {
        Title title = Utils.getComponentUnderTest(PATH_TITLE, Title.class, context);
        Utils.testJSONExport(title, Utils.getTestExporterJSONPath(BASE, PATH_TITLE));
    }

    @Test
    void testTitleWithLocale() throws Exception {
//        MockResourceBundleProvider bundleProvider = (MockResourceBundleProvider) context.getService(ResourceBundleProvider.class);
//        MockResourceBundle resourceBundle = (MockResourceBundle) bundleProvider.getResourceBundle(
//                "/content/dam/formsanddocuments/demo/jcr:content/dictionary", new Locale("de"));
//        resourceBundle.putAll(new HashMap<String, String>() {
//            {
//                put("guideContainer##textinput##description##5648", "dummy 1");
//            }
//        });
        context.currentResource(PATH_TITLE);
        // added this since AF API expects this to be present
        GuideLocalizationService guideLocalizationService = context.registerService(GuideLocalizationService.class, Mockito.mock(GuideLocalizationService.class));
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
        Title title = request.adaptTo(Title.class);
        assertEquals("Title", title.getText());
    }

}