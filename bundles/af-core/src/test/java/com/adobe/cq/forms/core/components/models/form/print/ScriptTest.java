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

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ScriptTest {

    @Test
    public void testGetName() {
        Script mockScript = Mockito.mock(Script.class);
        Mockito.when(mockScript.getName()).thenCallRealMethod();
        assertEquals("", mockScript.getName());
    }

    @Test
    public void testGetRunAt() {
        Script mockScript = Mockito.mock(Script.class);
        Mockito.when(mockScript.getRunAt()).thenCallRealMethod();
        assertEquals("", mockScript.getRunAt());
    }

    @Test
    public void testGetUseHref() {
        Script mockScript = Mockito.mock(Script.class);
        Mockito.when(mockScript.getUseHref()).thenCallRealMethod();
        assertEquals("", mockScript.getUseHref());
    }

    @Test
    public void testGetContentType() {
        Script mockScript = Mockito.mock(Script.class);
        Mockito.when(mockScript.getContentType()).thenCallRealMethod();
        assertEquals("", mockScript.getContentType());
    }

    @Test
    public void testGetContent() {
        Script mockScript = Mockito.mock(Script.class);
        Mockito.when(mockScript.getContent()).thenCallRealMethod();
        assertEquals("", mockScript.getContent());
    }
}
