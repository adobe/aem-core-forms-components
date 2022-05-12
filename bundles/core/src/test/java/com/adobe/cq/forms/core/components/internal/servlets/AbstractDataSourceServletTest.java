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

import javax.annotation.Nonnull;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.adobe.granite.ui.components.ExpressionResolver;
import com.day.cq.wcm.foundation.forms.FormsManager;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class AbstractDataSourceServletTest {

    @Test
    public void createResourceReturnsSyntheticResource() {
        // GIVEN
        ResourceResolver resourceResolver = Mockito.mock(ResourceResolver.class);
        String title = "dummy title";
        String value = "fd/af/actions/dor";
        String hint = "abc";

        AbstractDataSourceServlet dataSource = new AbstractDataSourceServlet() {
            @Nonnull
            @Override
            protected ExpressionResolver getExpressionResolver() {
                return Mockito.mock(ExpressionResolver.class);
            }
        };

        FormsManager.ComponentDescription description = Mockito.mock(FormsManager.ComponentDescription.class);
        when(description.getTitle()).thenReturn(title);
        when(description.getResourceType()).thenReturn(value);
        when(description.getHint()).thenReturn(hint);

        // WHEN
        Resource resource = dataSource.createResource(resourceResolver, description);

        // THEN
        assertEquals(title, resource.getValueMap().get("text"));
        assertEquals(value, resource.getValueMap().get("value"));
        assertEquals(hint, resource.getValueMap().get("qtip"));
        assertEquals(Resource.RESOURCE_TYPE_NON_EXISTING, resource.getResourceType());
    }
}
