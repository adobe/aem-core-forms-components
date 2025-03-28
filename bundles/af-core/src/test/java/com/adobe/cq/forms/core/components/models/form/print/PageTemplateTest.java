/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2025 Adobe
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
package com.adobe.cq.forms.core.components.models.form.print;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class PageTemplateTest {

    @Test
    public void testGetConfig() {
        // Mock the PageTemplate interface
        PageTemplate mockPageTemplate = Mockito.mock(PageTemplate.class);

        // Define behavior for the mock
        when(mockPageTemplate.getConfig()).thenCallRealMethod();

        // Assert the behavior
        assertEquals("", mockPageTemplate.getConfig());
    }

    @Test
    public void testGetLocaleSet() {
        PageTemplate mockPageTemplate = Mockito.mock(PageTemplate.class);
        when(mockPageTemplate.getLocaleSet()).thenCallRealMethod();
        assertEquals("", mockPageTemplate.getLocaleSet());
    }

    @Test
    public void testGetXmpMetaData() {
        PageTemplate mockPageTemplate = Mockito.mock(PageTemplate.class);
        when(mockPageTemplate.getXmpMetaData()).thenCallRealMethod();
        assertEquals("", mockPageTemplate.getXmpMetaData());
    }

    @Test
    public void testGetDatasets() {
        PageTemplate mockPageTemplate = Mockito.mock(PageTemplate.class);
        when(mockPageTemplate.getDatasets()).thenCallRealMethod();
        assertEquals(null, mockPageTemplate.getDatasets());
    }

    @Test
    public void testGetConnectionSet() {
        PageTemplate mockPageTemplate = Mockito.mock(PageTemplate.class);
        when(mockPageTemplate.getConnectionSet()).thenCallRealMethod();
        assertEquals("", mockPageTemplate.getConnectionSet());
    }

    @Test
    public void testGetTemplate() {
        PageTemplate mockPageTemplate = Mockito.mock(PageTemplate.class);
        when(mockPageTemplate.getTemplate()).thenCallRealMethod();
        assertEquals(null, mockPageTemplate.getTemplate());
    }
}
