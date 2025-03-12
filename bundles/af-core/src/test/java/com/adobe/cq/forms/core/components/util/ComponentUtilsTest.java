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
package com.adobe.cq.forms.core.components.util;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.components.internal.form.FormConstants;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class ComponentUtilsTest {
    @Test
    public void testGetEncodedPath() {
        // THEN
        assertEquals("L2NvbnRlbnQvZm9ybXMvYWYvYWJj", ComponentUtils.getEncodedPath("/content/forms/af/abc"));
    }

    @Test
    public void testGetFragmentContainer() {
        ResourceResolver resourceResolver = Mockito.mock(ResourceResolver.class);
        String fragmentPath = "/content/forms/af/abc";
        Resource resource = Mockito.mock(Resource.class);
        Mockito.when(resource.isResourceType(Mockito.anyString())).thenReturn(false);
        Mockito.when(resourceResolver.getResource(fragmentPath + "/" + JcrConstants.JCR_CONTENT)).thenReturn(resource);
        ComponentUtils.getFragmentContainer(resourceResolver, fragmentPath);
        Mockito.verify(resource).getChild("guideContainer");
    }

    @Test
    public void testGetFragmentContainerForDamPath() {
        ResourceResolver resourceResolver = Mockito.mock(ResourceResolver.class);
        String fragmentPath = "/content/forms/af/abc";
        String damFragmentPath = "/content/dam/formsanddocuments/abc";
        Resource resource = Mockito.mock(Resource.class);
        Mockito.when(resource.isResourceType(Mockito.anyString())).thenReturn(false);
        Mockito.when(resourceResolver.getResource(fragmentPath + "/" + JcrConstants.JCR_CONTENT)).thenReturn(resource);
        ComponentUtils.getFragmentContainer(resourceResolver, damFragmentPath);
        Mockito.verify(resource).getChild("guideContainer");
    }

    @Test
    public void testGetFragmentContainerForEDS() {
        ResourceResolver resourceResolver = Mockito.mock(ResourceResolver.class);
        String fragmentPath = "/content/forms/af/formfragment";
        Resource resource = Mockito.mock(Resource.class);
        Mockito.when(resource.isResourceType(Mockito.anyString())).thenReturn(true);
        Mockito.when(resourceResolver.getResource(fragmentPath + "/" + JcrConstants.JCR_CONTENT)).thenReturn(resource);
        ComponentUtils.getFragmentContainer(resourceResolver, fragmentPath);
        Mockito.verify(resource).getChild("root/section/form");
    }

    @Test
    public void testIsFragmentComponent() {
        assertFalse(ComponentUtils.isFragmentComponent(null));
        Resource resource = Mockito.mock(Resource.class);
        Map<String, Object> valueMap = new HashMap<>();
        valueMap.put(FormConstants.PROP_FRAGMENT_PATH, "/content/forms/af/abc");
        ValueMap vm = new ValueMapDecorator(valueMap);
        Mockito.when(resource.getValueMap()).thenReturn(vm);
        assertTrue(ComponentUtils.isFragmentComponent(resource));
        vm.remove(FormConstants.PROP_FRAGMENT_PATH);
        assertFalse(ComponentUtils.isFragmentComponent(resource));
    }

    @Test
    public void testParseNumber() {
        // Test valid long string
        assertEquals(123L, ComponentUtils.parseNumber("123"));
        // Test valid float string
        assertEquals(123.45f, ComponentUtils.parseNumber("123.45"));
        // Test invalid number string
        assertNull(ComponentUtils.parseNumber("abc"));
        // Test null input
        assertNull(ComponentUtils.parseNumber(null));
    }

    @Test
    public void testSubmitActionsCaching() throws Exception {
        // Clear cache before test
        resetCache();

        // Set up mocks
        HttpClientBuilderFactory mockClientFactory = mock(HttpClientBuilderFactory.class);
        HttpClientBuilder mockHttpClientBuilder = mock(HttpClientBuilder.class);
        CloseableHttpClient mockHttpClient = mock(CloseableHttpClient.class);
        CloseableHttpResponse mockResponse = mock(CloseableHttpResponse.class);
        StatusLine mockStatusLine = mock(StatusLine.class);

        // Configure mock response
        when(mockStatusLine.getStatusCode()).thenReturn(200);
        when(mockResponse.getStatusLine()).thenReturn(mockStatusLine);
        when(mockResponse.getEntity()).thenReturn(
            new StringEntity("{\"supported\":[\"spreadsheet\",\"email\"]}"));

        // Wire up mock chain
        when(mockClientFactory.newBuilder()).thenReturn(mockHttpClientBuilder);
        when(mockHttpClientBuilder.build()).thenReturn(mockHttpClient);
        when(mockHttpClient.execute(any())).thenReturn(mockResponse);

        // First call should execute HTTP request
        List<String> actions1 = ComponentUtils.getSupportedSubmitActions(mockClientFactory);

        // Second call should use cached result
        List<String> actions2 = ComponentUtils.getSupportedSubmitActions(mockClientFactory);

        // Verify HTTP call only happened once
        verify(mockHttpClient, times(1)).execute(any());

        // Verify returned actions are the same
        assertEquals(actions1, actions2);
        assertEquals(2, actions1.size());
        assertTrue(actions1.contains("spreadsheet"));
        assertTrue(actions1.contains("email"));

        // Simulate TTL expiry and verify HTTP call happens again
        setCacheTimestampToExpired();
        List<String> actions3 = ComponentUtils.getSupportedSubmitActions(mockClientFactory);
        verify(mockHttpClient, times(2)).execute(any());
    }

    // Helper methods to access private cache fields via reflection
    private void resetCache() throws Exception {
        Field cacheField = CacheManager.class.getDeclaredField("SUBMIT_ACTIONS_CACHE");
        cacheField.setAccessible(true);
        ((Map) cacheField.get(null)).clear();

        Field timestampsField = CacheManager.class.getDeclaredField("CACHE_TIMESTAMPS");
        timestampsField.setAccessible(true);
        ((Map) timestampsField.get(null)).clear();
    }

    private void setCacheTimestampToExpired() throws Exception {
        Field timestampsField = CacheManager.class.getDeclaredField("CACHE_TIMESTAMPS");
        timestampsField.setAccessible(true);
        Map<String, Long> timestamps = (Map<String, Long>) timestampsField.get(null);

        // Set timestamp to 25 hours ago (beyond TTL of 24 hours)
        timestamps.put(CacheManager.SUPPORTED_SUBMIT_ACTIONS_CACHE_KEY,
                System.currentTimeMillis() - 25 * 60 * 60 * 1000);
    }
}
