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

package com.adobe.cq.forms.core.components.internal.models.v1.formsportal.portallister;

import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.models.formsportal.PortalLister;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
public class PortalListerTest {
    private static final String TEST_BASE = "/portallister";
    private static final String CONTENT_ROOT = "/content";
    private static final String ROOT_PAGE = CONTENT_ROOT + "/fplister";
    private static final String CONFIGURED_COMPONENT_V1_PATH = ROOT_PAGE + "/portallister-v1";
    private static final String SAMPLE_FORM = CONTENT_ROOT + "/dam/formsanddocuments/sample-form";
    public final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    public void setUp() {
        context.load().json(TEST_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    public void testMainInterface() {
        // PortalLister interface tests
        PortalLister component = Mockito.mock(PortalLister.class);

        Mockito.when(component.getTitle()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getTitle);

        Mockito.when(component.getLayout()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getLayout);

        Mockito.when(component.getLimit()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getLimit);

        Mockito.when(component.getSearchResults()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getSearchResults);

        // PortalLister.Item interface tests
        PortalLister.Item item = Mockito.mock(PortalLister.Item.class);

        Mockito.when(item.getTitle()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, item::getTitle);

        Mockito.when(item.getDescription()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, item::getDescription);

        Mockito.when(item.getTooltip()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, item::getTooltip);

        Mockito.when(item.getFormLink()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, item::getFormLink);
    }

    @Test
    public void testExportedJson() {
        PortalLister component = getInstanceUnderTest(CONFIGURED_COMPONENT_V1_PATH);
        Utils.testJSONExport(component, Utils.getTestExporterJSONPath(TEST_BASE, CONFIGURED_COMPONENT_V1_PATH));
    }

    private PortalLister getInstanceUnderTest(String resourcePath) {
        MockSlingHttpServletRequest mockRequest = context.request();
        mockRequest.setResource(context.currentResource(resourcePath));
        return mockRequest.adaptTo(PortalLister.class);
    }
}
