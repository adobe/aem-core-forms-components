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

package com.adobe.cq.forms.core.components.internal.models.v1.formsportal.searchlister;

import java.util.ArrayList;
import java.util.List;

import javax.jcr.Session;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.models.formsportal.SearchAndLister;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.SearchResult;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
public class SearchAndListerImplTest {

    public final AemContext context = FormsCoreComponentTestContext.newAemContext();

    private static final String TEST_BASE = "/searchlister";
    private static final String CONTENT_ROOT = "/content";
    private static final String ROOT_PAGE = CONTENT_ROOT + "/fpsnl";
    private static final String DEFAULT_COMPONENT_PATH = ROOT_PAGE + "/searchlister-empty";
    private static final String CONFIGURED_COMPONENT_V1_PATH = ROOT_PAGE + "/searchlister-v1";

    @BeforeEach
    public void setUp() {
        context.load().json(TEST_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
        ResourceResolverFactory mockResolverFactory = Mockito.mock(ResourceResolverFactory.class);
        QueryBuilder mockQB = Mockito.mock(QueryBuilder.class);
        Query mockQuery = Mockito.mock(Query.class);
        SearchResult mockSearchResult = Mockito.mock(SearchResult.class);

        List<Resource> resultList = new ArrayList<>();

        Mockito.when(mockQB.createQuery(Mockito.any(PredicateGroup.class), Mockito.any(Session.class))).thenReturn(mockQuery);
        Mockito.when(mockQuery.getResult()).thenReturn(mockSearchResult);
        Mockito.when(mockSearchResult.getTotalMatches()).thenReturn(Long.valueOf(0));
        Mockito.when(mockSearchResult.getHits()).thenReturn(Mockito.mock(List.class));
        Mockito.when(mockSearchResult.getStartIndex()).thenReturn(Long.valueOf(0));
        Mockito.when(mockSearchResult.getResources()).thenReturn(resultList.listIterator());

        context.registerService(ResourceResolverFactory.class, mockResolverFactory);
        context.registerService(QueryBuilder.class, mockQB);
    }

    @Test
    public void testExportedType() {
        SearchAndLister component = getInstanceUnderTest(CONFIGURED_COMPONENT_V1_PATH);
        Assertions.assertEquals("core/fd/components/formsportal/searchlister/v1/searchlister", component.getExportedType());
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
        Assertions.assertEquals("card", component.getLayout());
        Assertions.assertFalse(component.getSearchDisabled());
        Assertions.assertFalse(component.getSortDisabled());
        Assertions.assertEquals(8, component.getResultLimit());

        // map at top level should have exactly three keys
        Assertions.assertEquals(3, component.getSearchResults().size());
    }

    @Test
    public void testConfiguredSearchAndListerComponent() {
        SearchAndLister component = getInstanceUnderTest(CONFIGURED_COMPONENT_V1_PATH);
        Assertions.assertEquals("Sample Title", component.getTitle());
        Assertions.assertEquals("Custom", component.getLayout());
        Assertions.assertTrue(component.getSearchDisabled());
        Assertions.assertTrue(component.getSortDisabled());
        Assertions.assertEquals(4, component.getResultLimit());
        Assertions.assertEquals(3, component.getSearchResults().size());
    }

    @Test
    public void testMainInterface() {
        SearchAndLister component = Mockito.mock(SearchAndLister.class);
        Mockito.when(component.getTitle()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getTitle);

        Mockito.when(component.getLayout()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getLayout);

        Mockito.when(component.getSearchDisabled()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getSearchDisabled);

        Mockito.when(component.getSortDisabled()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getSortDisabled);

        Mockito.when(component.getResultLimit()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getResultLimit);

        Mockito.when(component.getSearchResults()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getSearchResults);
    }

    private SearchAndLister getInstanceUnderTest(String resourcePath) {
        MockSlingHttpServletRequest mockRequest = context.request();
        mockRequest.setResource(context.currentResource(resourcePath));
        return mockRequest.adaptTo(SearchAndLister.class);
    }

}
