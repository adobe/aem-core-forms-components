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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jcr.Session;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
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

    private static final String TEST_BASE = "/searchlister";
    private static final String CONTENT_ROOT = "/content";
    private static final String ROOT_PAGE = CONTENT_ROOT + "/fpsnl";
    private static final String DEFAULT_COMPONENT_PATH = ROOT_PAGE + "/searchlister-empty";
    private static final String CONFIGURED_COMPONENT_V1_PATH = ROOT_PAGE + "/searchlister-v1";
    private static final String SAMPLE_FORM = CONTENT_ROOT + "/dam/formsanddocuments/sample-form";
    public final AemContext context = FormsCoreComponentTestContext.newAemContext();

    private QueryBuilder mockQB;

    @BeforeEach
    public void setUp() {
        context.load().json(TEST_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
        ResourceResolverFactory mockResolverFactory = Mockito.mock(ResourceResolverFactory.class);
        mockQB = Mockito.mock(QueryBuilder.class);
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
        Assertions.assertEquals(Integer.valueOf(8), component.getLimit());

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
        Assertions.assertEquals(Integer.valueOf(4), component.getLimit());
        Assertions.assertEquals(3, component.getSearchResults().size());
    }

    @Test
    public void testPredicateAndResultJson() {
        // Cover all predicates and also match output json
        SearchAndLister component = getInstanceUnderTest(CONFIGURED_COMPONENT_V1_PATH);

        Map<String, Object> requestParams = new HashMap<>();
        requestParams.put("title", "Sample Title");
        requestParams.put("searchText", "Search Text");
        requestParams.put("description", "Desc");
        requestParams.put("tags", "full/path/to/tag");
        requestParams.put("orderby", "@title");
        requestParams.put("sort", "asc");
        requestParams.put("offset", "0");
        requestParams.put("limit", "10");

        MockSlingHttpServletRequest request = context.request();

        request.setResource(context.currentResource(CONFIGURED_COMPONENT_V1_PATH));
        request.setParameterMap(requestParams);

        Resource mockFormResource = Mockito.spy(context.resourceResolver().getResource(SAMPLE_FORM));

        Query mockQuery = Mockito.mock(Query.class);
        SearchResult mockSearchResult = Mockito.mock(SearchResult.class);
        List<Resource> resultList = new ArrayList<>();
        resultList.add(mockFormResource);
        ResourceResolver leakingResourceResolverMock = Mockito.spy(request.getResourceResolver());

        Mockito.when(mockQuery.getResult()).thenReturn(mockSearchResult);
        Mockito.when(mockSearchResult.getTotalMatches()).thenReturn(Long.valueOf(1));
        Mockito.when(mockSearchResult.getHits()).thenReturn(Mockito.mock(List.class));
        Mockito.when(mockSearchResult.getStartIndex()).thenReturn(Long.valueOf(1));
        Mockito.when(mockSearchResult.getResources()).thenReturn(resultList.listIterator());
        Mockito.when(mockFormResource.getResourceResolver()).thenReturn(leakingResourceResolverMock);

        // the resource resolver is not leaking in unit testing, hence mocking a leaky resourceResolver
        Mockito.doNothing().when(leakingResourceResolverMock).close();
        Mockito.when(mockQB.createQuery(Mockito.any(PredicateGroup.class), Mockito.any(Session.class))).thenReturn(mockQuery);

        // generate model json, after this resourceIterator would need to be reset if called again
        Utils.testJSONExport(component, TEST_BASE + "/searchlister-v1-withResults.json");

        // the exported json is already tested above, but still test intermediate predicates and invocation below
        Mockito.verify(mockQB, Mockito.times(1)).createQuery(ArgumentMatchers.argThat(argument -> {
            // Predicate list's top level predicates / predicate groups size should match
            return argument.size() == 8;
        }), Mockito.any(Session.class));
    }

    @Test
    public void testMainInterface() {
        SearchAndLister component = Mockito.mock(SearchAndLister.class);

        Mockito.when(component.getSearchDisabled()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getSearchDisabled);

        Mockito.when(component.getSortDisabled()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getSortDisabled);

        Mockito.when(component.getLimit()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getLimit);

    }

    private SearchAndLister getInstanceUnderTest(String resourcePath) {
        MockSlingHttpServletRequest mockRequest = context.request();
        mockRequest.setResource(context.currentResource(resourcePath));
        return mockRequest.adaptTo(SearchAndLister.class);
    }

}
