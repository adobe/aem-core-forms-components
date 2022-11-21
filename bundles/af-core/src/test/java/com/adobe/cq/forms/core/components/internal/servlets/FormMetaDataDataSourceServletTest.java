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
package com.adobe.cq.forms.core.components.internal.servlets;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.function.Function;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.assertj.core.util.Lists;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.adobe.aemds.guide.model.FormMetaData;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.granite.ui.components.ExpressionResolver;
import com.adobe.granite.ui.components.ds.DataSource;
import com.day.cq.wcm.foundation.forms.FormsManager;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static com.adobe.cq.forms.core.components.internal.servlets.AbstractDataSourceServlet.PN_TEXT;
import static com.adobe.cq.forms.core.components.internal.servlets.AbstractDataSourceServlet.PN_VALUE;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({ AemContextExtension.class, MockitoExtension.class })
public class FormMetaDataDataSourceServletTest {
    public static final String RT_FD_FORM_CONTAINER_DATASOURCE_V1 = "core/fd/components/form/container/v1/datasource";
    private static final String TEST_BASE = "/form/formcontainer/datasource";
    private static final String APPS_ROOT = "/apps";

    public final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @Mock
    private FormMetaData formMetaDataMock;

    @Mock
    private FormsManager.ComponentDescription description;

    @Mock
    private FormsManager.ComponentDescription formatters;

    @Mock
    private ExpressionResolver expressionResolver;

    @BeforeEach
    public void setUp() {
        context.load().json(TEST_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, APPS_ROOT);
        registerFormMetadataAdapter();
        // note: transient state can't be mocked like this
        // context.registerService(ExpressionResolver.class, expressionResolver);
    }

    @Test
    public void testDataSource() throws Exception {
        context.currentResource("/apps/actiontypedatasource");
        when(expressionResolver.resolve(any(), any(), any(), any(SlingHttpServletRequest.class)))
            .then(returnsFirstArg());
        ArrayList<FormsManager.ComponentDescription> componentDescriptions = new ArrayList<>();
        componentDescriptions.add(description);
        when(formMetaDataMock.getSubmitActions()).thenReturn(componentDescriptions.iterator());
        when(description.getTitle()).thenReturn("Form Action");
        when(description.getResourceType()).thenReturn("form/action");
        FormMetaDataDataSourceServlet dataSourceServlet = new FormMetaDataDataSourceServlet();
        // set expression resolver mock
        Utils.setInternalState(dataSourceServlet, "expressionResolver", expressionResolver);
        dataSourceServlet.doGet(context.request(), context.response());
        DataSource dataSource = (com.adobe.granite.ui.components.ds.DataSource) context.request().getAttribute(
            DataSource.class.getName());
        assertNotNull(dataSource);
        Resource resource = dataSource.iterator().next();
        assertEquals("Form Action", resource.getValueMap().get(PN_TEXT, String.class));
        assertEquals("form/action", resource.getValueMap().get(PN_VALUE, String.class));
        assertEquals(1, Lists.newArrayList(resource.getChildren()).size());
    }

    @Test
    public void testDataSourceForFormattersForNumberInput() throws Exception {

        context.currentResource("/apps/formattertypedatasourcenumberinput");
        when(formatters.getResourceType()).thenReturn("/apps/formattertypedatasourcenumberinput");
        when(expressionResolver.resolve(any(), any(), any(), any(SlingHttpServletRequest.class)))
            .then(returnsFirstArg());
        ArrayList<FormsManager.ComponentDescription> componentDescriptions = new ArrayList<>();
        componentDescriptions.add(formatters);
        when(formMetaDataMock.getFormatters(any())).thenReturn(componentDescriptions.iterator());
        FormMetaDataDataSourceServlet dataSourceServlet = new FormMetaDataDataSourceServlet();
        // set expression resolver mock
        Utils.setInternalState(dataSourceServlet, "expressionResolver", expressionResolver);
        dataSourceServlet.doGet(context.request(), context.response());
        DataSource dataSource = (com.adobe.granite.ui.components.ds.DataSource) context.request().getAttribute(
            DataSource.class.getName());
        assertNotNull(dataSource);
        int size = 0;
        Iterator<Resource> iterator = dataSource.iterator();
        while (iterator.hasNext()) {
            iterator.next();
            size += 1;
        }
        assertEquals(4, size);
    }

    @Test
    public void testDataSourceForFormattersForTextInput() throws Exception {

        context.currentResource("/apps/formattertypedatasourcetextinput");
        when(formatters.getResourceType()).thenReturn("/apps/formattertypedatasourcetextinput");

        when(expressionResolver.resolve(any(), any(), any(), any(SlingHttpServletRequest.class)))
            .then(returnsFirstArg());
        ArrayList<FormsManager.ComponentDescription> componentDescriptions = new ArrayList<>();
        componentDescriptions.add(formatters);
        when(formMetaDataMock.getFormatters(any())).thenReturn(componentDescriptions.iterator());
        FormMetaDataDataSourceServlet dataSourceServlet = new FormMetaDataDataSourceServlet();
        // set expression resolver mock
        Utils.setInternalState(dataSourceServlet, "expressionResolver", expressionResolver);
        dataSourceServlet.doGet(context.request(), context.response());
        DataSource dataSource = (com.adobe.granite.ui.components.ds.DataSource) context.request().getAttribute(
            DataSource.class.getName());
        assertNotNull(dataSource);
        int size = 0;
        Iterator<Resource> iterator = dataSource.iterator();
        while (iterator.hasNext()) {
            size += 1;
            Resource formatterResource = iterator.next();
            ValueMap valueMap = formatterResource.getValueMap();
            for (Map.Entry<String, Object> entry : valueMap.entrySet()) {
                assertFalse(entry.getValue().toString().startsWith("text{") && entry.getValue().toString().endsWith("}"));
            }
        }
        assertEquals(3, size);
    }

    private void registerFormMetadataAdapter() {
        context.registerAdapter(ResourceResolver.class, FormMetaData.class,
            (Function<ResourceResolver, FormMetaData>) input -> formMetaDataMock);
    }

}
