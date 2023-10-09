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
package com.adobe.cq.forms.core.components.internal.servlets;

import com.adobe.granite.ui.components.ds.DataSource;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.servlet.MockRequestPathInfo;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith({ AemContextExtension.class, MockitoExtension.class })
public class ReviewDataSourceServletTest {


    public static final String RT_FD_FORM_REVIEW_DATASOURCE_V1 = "core/fd/components/form/review/v1/datasource";
    private static final String TEST_BASE = "/form/review/datasource";
    private static final String APPS_ROOT = "/apps";
    private String componentInstancePath = "/apps/formcontainer/wizard/panel2/review";

    public final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    public void setUp() {
        context.load().json(TEST_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, APPS_ROOT);
    }

    @Test
    public void testDoGet() {

        context.currentResource("/apps");
        ReviewDataSourceServlet reviewDataSourceServlet = new ReviewDataSourceServlet();
        MockSlingHttpServletRequest request = context.request();
        MockSlingHttpServletResponse response = context.response();
        MockRequestPathInfo mockRequestPathInfo = (MockRequestPathInfo) request.getRequestPathInfo();
        mockRequestPathInfo.setSuffix(componentInstancePath);
        reviewDataSourceServlet.doGet(request, response);
        DataSource dataSource = (com.adobe.granite.ui.components.ds.DataSource) request.getAttribute(DataSource.class.getName());
        assertNotNull(dataSource);
        Resource resource = dataSource.iterator().next();
        assertEquals("Item 1", resource.getValueMap().get("text", String.class));
        assertEquals("panelcontainer-ef1afcac03", resource.getValueMap().get("value", String.class));

    }


}