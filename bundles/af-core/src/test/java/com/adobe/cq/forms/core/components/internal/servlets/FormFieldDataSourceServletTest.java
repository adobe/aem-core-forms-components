/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2026 Adobe
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
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.sling.testing.mock.sling.servlet.MockRequestPathInfo;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.granite.ui.components.ExpressionResolver;
import com.adobe.granite.ui.components.Value;
import com.adobe.granite.ui.components.ds.DataSource;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static com.adobe.cq.forms.core.components.internal.servlets.AbstractDataSourceServlet.PN_VALUE;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith({ AemContextExtension.class, MockitoExtension.class })
class FormFieldDataSourceServletTest {

    private static final String TEST_BASE = "/form/formfields/datasource";
    private static final String APPS_ROOT = "/apps";
    private static final String FORM_CONTAINER_PATH = "/apps/formcontainerWithFields";

    public final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @Mock
    private ExpressionResolver expressionResolver;

    private FormFieldDataSourceServlet servlet;

    @BeforeEach
    void setUp() {
        context.load().json(TEST_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, APPS_ROOT);
        servlet = new FormFieldDataSourceServlet();
        Utils.setInternalState(servlet, "expressionResolver", expressionResolver);
    }

    @Test
    void testEmailFilter() {
        List<String> values = getDataSourceValues("/apps/emailFieldDatasource", FORM_CONTAINER_PATH);
        assertEquals(Arrays.asList("emailText", "signerEmail"), values);
    }

    @Test
    void testPhoneFilter() {
        List<String> values = getDataSourceValues("/apps/phoneFieldDatasource", FORM_CONTAINER_PATH);
        assertEquals(Arrays.asList("emailText", "signerPhone"), values);
    }

    @Test
    void testCountryCodeFilter() {
        List<String> values = getDataSourceValues("/apps/countryCodeFieldDatasource", FORM_CONTAINER_PATH);
        assertEquals(Arrays.asList("countryCode", "emailText", "signerPhone"), values);
    }

    @Test
    void testFormContainerNull() {
        List<String> values = getDataSourceValues("/apps/emailFieldDatasource", "/apps/missing");
        assertTrue(values.isEmpty());
    }

    @Test
    void testEmailFilterWithResponsiveGrid() {
        List<String> values = getDataSourceValues("/apps/emailFieldDatasource",
            "/apps/formcontainerWithResponsiveGrid");
        assertEquals(Arrays.asList("gridEmail"), values);
    }

    @Test
    void testResolveComponentPathFromContentPathAttribute() {
        when(expressionResolver.resolve(any(), any(), any(), any(MockSlingHttpServletRequest.class)))
            .then(returnsFirstArg());
        context.currentResource("/apps/emailFieldDatasource");
        MockSlingHttpServletRequest request = context.request();
        request.setAttribute(Value.CONTENTPATH_ATTRIBUTE, FORM_CONTAINER_PATH);
        MockRequestPathInfo requestPathInfo = (MockRequestPathInfo) request.getRequestPathInfo();
        requestPathInfo.setSuffix(null);
        servlet.doGet(request, context.response());
        DataSource dataSource = (DataSource) request.getAttribute(DataSource.class.getName());
        assertNotNull(dataSource);
        assertTrue(dataSource.iterator().hasNext());
    }

    @Test
    void testResolveFieldFilterFromResource() {
        context.currentResource("/apps/emailFieldDatasource/datasource");
        assertEquals(FormFieldDataSourceServlet.FieldFilter.EMAIL, servlet.resolveFieldFilter(context.request()));
    }

    @Test
    void testResolveFieldTypeFromResourceType() {
        assertEquals("email",
            servlet.resolveFieldType(
                new org.apache.sling.api.wrappers.ValueMapDecorator(java.util.Collections.emptyMap()),
                "core/fd/components/form/emailinput/v1/emailinput"));
        assertEquals("tel",
            servlet.resolveFieldType(
                new org.apache.sling.api.wrappers.ValueMapDecorator(java.util.Collections.emptyMap()),
                "core/fd/components/form/telephoneinput/v1/telephoneinput"));
    }

    @Test
    void testMatchesFieldFilterExcludesCheckbox() {
        org.apache.sling.api.wrappers.ValueMapDecorator vm = new org.apache.sling.api.wrappers.ValueMapDecorator(
            Collections.<String, Object>singletonMap("fieldType", "checkbox"));
        assertFalse(servlet.matchesFieldFilter(vm, "core/fd/components/form/checkbox/v1/checkbox",
            FormFieldDataSourceServlet.FieldFilter.EMAIL));
    }

    private List<String> getDataSourceValues(String datasourceResourcePath, String formContainerSuffix) {
        when(expressionResolver.resolve(any(), any(), any(), any(MockSlingHttpServletRequest.class)))
            .then(returnsFirstArg());
        context.currentResource(datasourceResourcePath);
        MockSlingHttpServletRequest request = context.request();
        MockRequestPathInfo requestPathInfo = (MockRequestPathInfo) request.getRequestPathInfo();
        requestPathInfo.setSuffix(formContainerSuffix);
        servlet.doGet(request, context.response());
        DataSource dataSource = (DataSource) request.getAttribute(DataSource.class.getName());
        assertNotNull(dataSource);
        List<String> values = new ArrayList<>();
        dataSource.iterator()
            .forEachRemaining(resource -> values.add(resource.getValueMap().get(PN_VALUE, String.class)));
        return values.stream().sorted().collect(Collectors.toList());
    }
}