/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2021 Adobe
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

package com.adobe.cq.forms.core.components.internal.models.v1.formsportal.searchnlister;

import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.models.formsportal.SearchAndLister;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
public class SearchAndListerImplTest {

    public final AemContext context = FormsCoreComponentTestContext.newAemContext();

    private static final String TEST_BASE = "/searchnlister";
    private static final String CONTENT_ROOT = "/content";
    private static final String ROOT_PAGE = CONTENT_ROOT + "/fpsnl";
    private static final String DEFAULT_COMPONENT_PATH = ROOT_PAGE + "/searchnlister-empty";
    private static final String CONFIGURED_COMPONENT_V1_PATH = ROOT_PAGE + "/searchnlister-v1";

    @BeforeEach
    public void setUp() {
        context.load().json(TEST_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    public void testExportedType() {
        SearchAndLister component = getInstanceUnderTest(CONFIGURED_COMPONENT_V1_PATH);
        Assertions.assertEquals("core/fd/components/formsportal/searchnlister/v1/searchnlister", component.getExportedType());
    }

    @Test
    public void testExportedJson() {
        SearchAndLister component = getInstanceUnderTest(CONFIGURED_COMPONENT_V1_PATH);
        Utils.testJSONExport(component, Utils.getTestExporterJSONPath(TEST_BASE, CONFIGURED_COMPONENT_V1_PATH));
    }

    @Test
    public void testEmptySearchAndListerComponent() {
        SearchAndLister component = getInstanceUnderTest(DEFAULT_COMPONENT_PATH);
        Assertions.assertEquals("Forms Portal", component.getTitle());
        Assertions.assertEquals("Card", component.getLayout());
        Assertions.assertFalse(component.getAdvancedSearchDisabled());
        Assertions.assertFalse(component.getTextSearchDisabled());
        Assertions.assertEquals(8, component.getResultLimit());
    }

    @Test
    public void testConfiguredSearchAndListerComponent() {
        SearchAndLister component = getInstanceUnderTest(CONFIGURED_COMPONENT_V1_PATH);
        Assertions.assertEquals("Sample Title", component.getTitle());
        Assertions.assertEquals("Custom", component.getLayout());
        Assertions.assertTrue(component.getAdvancedSearchDisabled());
        Assertions.assertTrue(component.getTextSearchDisabled());
        Assertions.assertEquals(4, component.getResultLimit());
    }

    @Test
    public void testMainInterface() {
        SearchAndLister component = Mockito.mock(SearchAndLister.class);
        Mockito.when(component.getTitle()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getTitle);

        Mockito.when(component.getLayout()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getLayout);

        Mockito.when(component.getAdvancedSearchDisabled()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getAdvancedSearchDisabled);

        Mockito.when(component.getTextSearchDisabled()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getTextSearchDisabled);

        Mockito.when(component.getResultLimit()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getResultLimit);
    }

    private SearchAndLister getInstanceUnderTest(String resourcePath) {
        MockSlingHttpServletRequest mockRequest = context.request();
        mockRequest.setResource(context.currentResource(resourcePath));
        return mockRequest.adaptTo(SearchAndLister.class);
    }

}
