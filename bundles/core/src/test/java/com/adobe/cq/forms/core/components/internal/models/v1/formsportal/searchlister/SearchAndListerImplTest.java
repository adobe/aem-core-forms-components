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

import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.aem.formsndocuments.assets.models.AdaptiveFormAsset;
import com.adobe.aem.formsndocuments.assets.models.FDAsset;
import com.adobe.aem.formsndocuments.assets.models.FMSearchCriteria;
import com.adobe.aem.formsndocuments.assets.service.FMAssetSearch;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.models.formsportal.SearchAndLister;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
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

    private FMAssetSearch searchAPI;
    private FMSearchCriteria searchCriteria;

    @BeforeEach
    public void setUp() {
        context.load().json(TEST_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
        List<FDAsset> resultList = new ArrayList<>();

        searchCriteria = Mockito.mock(FMSearchCriteria.class);
        searchAPI = Mockito.mock(FMAssetSearch.class);
        Mockito.when(searchAPI.searchForms(Mockito.any(), Mockito.any())).thenReturn(resultList);

        FMSearchCriteria.BuilderProvider providerService = Mockito.mock(FMSearchCriteria.BuilderProvider.class);
        FMSearchCriteria.Builder builder = Mockito.mock(FMSearchCriteria.Builder.class, Mockito.RETURNS_SELF);
        Mockito.when(providerService.createBuilder()).thenReturn(builder);
        Mockito.when(builder.build()).thenReturn(searchCriteria);

        context.registerService(FMAssetSearch.class, searchAPI);
        context.registerService(FMSearchCriteria.BuilderProvider.class, providerService);
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

        // map at top level should have exactly two keys
        Assertions.assertEquals(2, component.getElements().size());
    }

    @Test
    public void testConfiguredSearchAndListerComponent() {
        SearchAndLister component = getInstanceUnderTest(CONFIGURED_COMPONENT_V1_PATH);
        Assertions.assertEquals("Sample Title", component.getTitle());
        Assertions.assertEquals("Custom", component.getLayout());
        Assertions.assertTrue(component.getSearchDisabled());
        Assertions.assertTrue(component.getSortDisabled());
        Assertions.assertEquals(Integer.valueOf(1), component.getLimit());

        List<FDAsset> resultList = new ArrayList<>();
        Mockito.when(searchAPI.searchForms(Mockito.any(), Mockito.any())).thenReturn(resultList);
        Assertions.assertEquals(2, component.getElements().size());
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
        requestParams.put("orderby", "title");
        requestParams.put("sort", "asc");
        requestParams.put("offset", "0");
        requestParams.put("limit", "10");

        MockSlingHttpServletRequest request = context.request();

        request.setResource(context.currentResource(CONFIGURED_COMPONENT_V1_PATH));
        request.setParameterMap(requestParams);

        Resource mockFormResource = Mockito.spy(context.resourceResolver().getResource(SAMPLE_FORM));

        List<FDAsset> resultList = new ArrayList<>();
        AdaptiveFormAsset mockAsset = Mockito.mock(AdaptiveFormAsset.class);
        resultList.add(mockAsset);
        context.registerAdapter(Resource.class, AdaptiveFormAsset.class, mockAsset);

        Mockito.when(searchAPI.searchForms(Mockito.any(), Mockito.any())).thenReturn(resultList);
        Mockito.when(mockAsset.getDamPath()).thenReturn(SAMPLE_FORM);
        Mockito.when(mockAsset.getAssetType()).thenReturn(FDAsset.AssetType.ADAPTIVE_FORM);
        Mockito.when(mockAsset.getTitle()).thenReturn("Sample Form");
        Mockito.when(mockAsset.getDescription()).thenReturn("Sample description for Sample Form");
        Mockito.when(mockAsset.getRenderLink()).thenReturn("/content/dam/formsanddocuments/sample-form/jcr:content?wcmmode=disabled");

        // generate model json, after this resourceIterator would need to be reset if called again
        Utils.testJSONExport(component, TEST_BASE + "/searchlister-v1-withResults.json");
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
