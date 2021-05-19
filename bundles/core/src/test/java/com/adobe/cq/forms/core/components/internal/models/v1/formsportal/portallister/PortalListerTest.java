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

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jcr.Session;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.models.formsportal.PortalLister;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.SearchResult;
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

    private QueryBuilder queryBuilder;

    @BeforeEach
    public void setUp() {
        context.load().json(TEST_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
        queryBuilder = Mockito.mock(QueryBuilder.class);
        context.registerService(QueryBuilder.class, queryBuilder);
    }

    @Test
    public void testMainInterface() {
        PortalLister component = Mockito.mock(PortalLister.class);
        Mockito.when(component.getItemList()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getItemList);

        Mockito.when(component.getLimit()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getLimit);

        Mockito.when(component.getNextOffset()).thenCallRealMethod();
        Assertions.assertThrows(UnsupportedOperationException.class, component::getNextOffset);

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
    public void onConfiguredComponent() throws IOException {
        // Cover all predicates and also match output json
        PortalLister underTest = getInstanceUnderTest(CONFIGURED_COMPONENT_V1_PATH);

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
        Mockito.when(queryBuilder.createQuery(Mockito.any(PredicateGroup.class), Mockito.any(Session.class))).thenReturn(mockQuery);

        // generate model json, after this resourceIterator would need to be reset if called again
        Utils.testJSONExport(underTest, Utils.getTestExporterJSONPath(TEST_BASE, CONFIGURED_COMPONENT_V1_PATH));

        // the exported json is already tested above, but still test intermediate predicates and invocation below
        Mockito.verify(queryBuilder, Mockito.times(1)).createQuery(ArgumentMatchers.argThat(argument -> {
            // Predicate list's top level predicates / predicate groups size should match
            return argument.size() == 8;
        }), Mockito.any(Session.class));
    }

    private PortalLister getInstanceUnderTest(String resourcePath) {
        MockSlingHttpServletRequest mockRequest = context.request();
        mockRequest.setResource(context.currentResource(resourcePath));
        return mockRequest.adaptTo(PortalLister.class);
    }
}
