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

package com.adobe.cq.forms.core.components.internal.servlets;

//@ExtendWith(AemContextExtension.class)
class QueryFormsPortalServletTest {
    // public final AemContext context = FormsCoreComponentTestContext.newAemContext();
    //
    // private static final String TEST_BASE = "/searchnlister";
    // private static final String CONTENT_ROOT = "/content";
    // private static final String ROOT_PAGE = CONTENT_ROOT + "/fpsnl";
    // private static final String DEFAULT_COMPONENT_PATH = ROOT_PAGE + "/searchnlister-empty";
    // private static final String CONFIGURED_COMPONENT_V1_PATH = ROOT_PAGE + "/searchnlister-v1";
    // private static final String SAMPLE_FORM = CONTENT_ROOT + "/dam/formsanddocuments/sample-form";
    // private static final String SERVLET_EXPECTED_JSON = TEST_BASE + "/exporter-queryservlet.json";
    //
    // private QueryBuilder queryBuilder;
    //
    // private QueryFormsPortalServlet underTest;
    //
    // @BeforeEach
    // public void setUp() {
    // context.load().json(TEST_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    // queryBuilder = Mockito.mock(QueryBuilder.class);
    // context.registerService(QueryBuilder.class, queryBuilder);
    // underTest = context.registerInjectActivateService(new QueryFormsPortalServlet());
    // }
    //
    // @Test
    // public void onConfiguredComponent() throws IOException {
    // // Cover all predicates and also match output json
    // Map<String, Object> requestParams = new HashMap<>();
    // requestParams.put("title", "Sample Title");
    // requestParams.put("searchText", "Search Text");
    // requestParams.put("description", "Desc");
    // requestParams.put("tags", "full/path/to/tag");
    // requestParams.put("orderby", "@title");
    // requestParams.put("sort", "asc");
    // requestParams.put("offset", "0");
    // requestParams.put("limit", "10");
    //
    // MockSlingHttpServletRequest request = context.request();
    // MockSlingHttpServletResponse response = context.response();
    //
    // request.setResource(context.currentResource(CONFIGURED_COMPONENT_V1_PATH));
    // request.setParameterMap(requestParams);
    // Resource mockFormResource = Mockito.spy(context.resourceResolver().getResource(SAMPLE_FORM));
    //
    // Query mockQuery = Mockito.mock(Query.class);
    // SearchResult mockSearchResult = Mockito.mock(SearchResult.class);
    // List<Resource> resultList = new ArrayList<>();
    // resultList.add(mockFormResource);
    // ResourceResolver leakingResourceResolverMock = Mockito.spy(request.getResourceResolver());
    //
    // Mockito.when(mockQuery.getResult()).thenReturn(mockSearchResult);
    // Mockito.when(mockSearchResult.getTotalMatches()).thenReturn(Long.valueOf(1));
    // Mockito.when(mockSearchResult.getHits()).thenReturn(Mockito.mock(List.class));
    // Mockito.when(mockSearchResult.getStartIndex()).thenReturn(Long.valueOf(1));
    // Mockito.when(mockSearchResult.getResources()).thenReturn(resultList.listIterator());
    // Mockito.when(mockFormResource.getResourceResolver()).thenReturn(leakingResourceResolverMock);
    //
    // // the resource resolver is not leaking in unit testing, hence mocking a leaky resourceResolver
    // Mockito.doNothing().when(leakingResourceResolverMock).close();
    //
    // Mockito.when(queryBuilder.createQuery(Mockito.any(PredicateGroup.class), Mockito.any(Session.class))).thenReturn(mockQuery);
    // try {
    // underTest.doGet(request, response);
    // } catch (ServletException | IOException e) {
    // Assertions.fail("Request Should have Passed", e);
    // }
    // Mockito.verify(queryBuilder).createQuery(ArgumentMatchers.argThat(argument -> {
    // // Predicate list's top level predicates / predicate groups size should match
    // return argument.size() == 8;
    // }), Mockito.any(Session.class));
    //
    // ObjectMapper mapper = new ObjectMapper();
    // InputStream inputStream = QueryFormsPortalServletTest.class.getResourceAsStream(SERVLET_EXPECTED_JSON);
    // Assertions.assertEquals(mapper.readTree(inputStream), mapper.readTree(response.getOutput()));
    // }
}
