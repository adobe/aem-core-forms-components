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

import java.util.HashMap;
import java.util.Map;

import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.components.internal.form.FormConstants;

import static org.junit.jupiter.api.Assertions.*;

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
        ComponentUtils.getFragmentContainer(resourceResolver, fragmentPath);
        Mockito.verify(resourceResolver).getResource(fragmentPath + "/" + JcrConstants.JCR_CONTENT + "/guideContainer");
        String damFragmentPath = "/content/dam/formsanddocuments/abc";
        resourceResolver = Mockito.mock(ResourceResolver.class);
        ComponentUtils.getFragmentContainer(resourceResolver, damFragmentPath);
        Mockito.verify(resourceResolver).getResource(fragmentPath + "/" + JcrConstants.JCR_CONTENT + "/guideContainer");
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

}
