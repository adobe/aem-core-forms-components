/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2023 Adobe
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

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

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
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.cq.wcm.core.components.models.Text;
import com.day.cq.wcm.api.WCMMode;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
public class HeaderFooterTextImplTest {

    private static final String BASE = "/form/text";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_TEXT_HEADER = CONTENT_ROOT + "/text-header";
    private static final String PATH_TEXT_FOOTER = CONTENT_ROOT + "/text-footer";
    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testHeaderText() {
        Text text_header = getTextUnderTest(PATH_TEXT_HEADER);
        assertEquals("<p><b>This is the header text</b></p>", text_header.getText());
        assertTrue(text_header.isRichText());
    }

    @Test
    void testFooterText() {
        Text text_footer = getTextUnderTest(PATH_TEXT_FOOTER);
        assertEquals("© YYYY Company name | All rights reserved", text_footer.getText());
        assertFalse(text_footer.isRichText());
    }

    @Test
    void testExportedType() {
        Text text_header = getTextUnderTest(PATH_TEXT_HEADER);
        Text text_footer = getTextUnderTest(PATH_TEXT_FOOTER);
        assertEquals("core/wcm/components/text/v2/text", text_header.getExportedType());
        assertEquals("core/wcm/components/text/v2/text", text_footer.getExportedType());
    }

    @Test
    void testTextWithLocale() throws Exception {
        context.currentResource(PATH_TEXT_HEADER);
        // added this since AF API expects this to be present
        GuideLocalizationService guideLocalizationService = context.registerService(GuideLocalizationService.class, Mockito.mock(
            GuideLocalizationService.class));
        Mockito.when(guideLocalizationService.getSupportedLocales()).thenReturn(new String[] { "en", "de" });
        MockResourceBundleProvider bundleProvider = (MockResourceBundleProvider) context.getService(ResourceBundleProvider.class);
        MockResourceBundle resourceBundle = (MockResourceBundle) bundleProvider.getResourceBundle(
            "/content/dam/formsanddocuments/demo/jcr:content/dictionary", new Locale("de"));
        resourceBundle.putAll(new HashMap<String, String>() {
            {
                put("parsys1##pageheader##text##text##2271", "<p><b>This is the header text</b></p>");
            }
        });
        MockSlingHttpServletRequest request = context.request();
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put(GuideConstants.AF_LANGUAGE_PARAMETER, "de");
        request.setParameterMap(paramMap);
        Text text = request.adaptTo(Text.class);
        assertEquals("<p><b>This is the header text</b></p>", text.getText());
    }

    @Test
    void testTextWithWcmEditMode() throws Exception {
        context.request().setAttribute(WCMMode.REQUEST_ATTRIBUTE_NAME, WCMMode.EDIT);
        Text text_header = getTextUnderTest(PATH_TEXT_HEADER);
        assertEquals("<p><b>This is the header text</b></p>", text_header.getText());
    }

    private Text getTextUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(Text.class);
    }

}
