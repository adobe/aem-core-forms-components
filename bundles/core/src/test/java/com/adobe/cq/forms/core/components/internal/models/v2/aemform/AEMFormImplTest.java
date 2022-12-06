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
package com.adobe.cq.forms.core.components.internal.models.v2.aemform;

import java.util.*;

import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.components.models.aemform.AEMForm;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.cq.wcm.core.components.models.HtmlPageItem;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;

@ExtendWith(AemContextExtension.class)
public class AEMFormImplTest {
    private static final String BASE = "/aemform";
    private static final String CONTENT_ROOT = "/content";
    private static final String ROOT_PAGE = "/content/aemform";
    private static final String GRID = ROOT_PAGE + "/jcr:content/root/responsivegrid";
    private static final String FORM_1 = "/aemformv2-1";
    private static final String PATH_FORM_1 = GRID + FORM_1;
    private static final String PATH_FORM_2 = "/content/test/en/home/jcr:content/root/container/container_1578756628/aemform";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    private Map<String, Object> styleAttribute = new HashMap() {
        {
            put("as", "style");
            put("href", "/theme.css");
            put("rel", "preload stylesheet");
            put("type", "text/css");
        }
    };
    private Map<String, Object> scriptAttribute = new LinkedHashMap() {
        {
            put("src", "/theme.js");
            put("async", "true");
            put("type", "text/javascript");
        }
    };

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
        context.load().json(BASE + "/page.json", "/content/test/en/home");
        context.load().json(BASE + "/af2.json", "/content/forms/af/test");
        context.load().json(BASE + "/af2-theme.json", "/conf/forms/test");
    }

    @Test
    void testExportedType() {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_1);
        assertEquals("core/fd/components/aemform/v2/aemform", aemform.getExportedType());
        AEMForm aemFormMock = Mockito.mock(AEMForm.class);
        Mockito.when(aemFormMock.getExportedType()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, aemFormMock::getExportedType);
    }

    private AEMForm getAEMFormUnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        MockSlingHttpServletRequest request = context.request();
        return request.adaptTo(AEMForm.class);
    }

    @Test
    void testTheme() throws Exception {
        AEMForm aemform = getAEMFormUnderTest(PATH_FORM_2);
        List<HtmlPageItem> htmlPageItems = aemform.getHtmlPageItems();
        Assertions.assertNotNull(htmlPageItems, "Expected html pages items to be available");
        assertEquals("Expected 2 page items", 2, htmlPageItems.size());
        htmlPageItems.forEach((htmlPageItem -> {
            validatePageItem(htmlPageItem);
        }));
    }

    void validatePageItem(HtmlPageItem htmlPageItem) {
        Assertions.assertNotNull(htmlPageItem, "Expected html Page to be available");
        Assertions.assertNotNull(htmlPageItem.getElement(), "Expected html pages items to be available");
        Assertions.assertNotNull(htmlPageItem.getLocation(), "Expected html pages items to be available");

        Map<String, Object> attributes = htmlPageItem.getAttributes();
        Assertions.assertNotNull(attributes, "Expected html Page attributes to be available");
        if (htmlPageItem.getElement().getName().equals("script")) {
            assertEquals("Expected link attribute to match", scriptAttribute.toString(), attributes.toString());
        } else {
            assertEquals("Expected style attribute to match", styleAttribute, attributes);
        }

    }
}
