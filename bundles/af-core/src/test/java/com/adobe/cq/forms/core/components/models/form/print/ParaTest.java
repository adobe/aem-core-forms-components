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

public class ParaTest {

    @Test
    public void testGetVAlign() {
        Para mockPara = Mockito.mock(Para.class);
        Mockito.when(mockPara.getVAlign()).thenCallRealMethod();
        assertEquals("", mockPara.getVAlign());
    }

    @Test
    public void testGetHAlign() {
        Para mockPara = Mockito.mock(Para.class);
        Mockito.when(mockPara.getHAlign()).thenCallRealMethod();
        assertEquals("", mockPara.getHAlign());
    }

    @Test
    public void testGetLineHeight() {
        Para mockPara = Mockito.mock(Para.class);
        Mockito.when(mockPara.getLineHeight()).thenCallRealMethod();
        assertEquals("", mockPara.getLineHeight());
    }

    @Test
    public void testGetSpaceAbove() {
        Para mockPara = Mockito.mock(Para.class);
        Mockito.when(mockPara.getSpaceAbove()).thenCallRealMethod();
        assertEquals("", mockPara.getSpaceAbove());
    }

    @Test
    public void testGetSpaceBelow() {
        Para mockPara = Mockito.mock(Para.class);
        Mockito.when(mockPara.getSpaceBelow()).thenCallRealMethod();
        assertEquals("", mockPara.getSpaceBelow());
    }

    @Test
    public void testGetMarginLeft() {
        Para mockPara = Mockito.mock(Para.class);
        Mockito.when(mockPara.getMarginLeft()).thenCallRealMethod();
        assertEquals("", mockPara.getMarginLeft());
    }

    @Test
    public void testGetMarginRight() {
        Para mockPara = Mockito.mock(Para.class);
        Mockito.when(mockPara.getMarginRight()).thenCallRealMethod();
        assertEquals("", mockPara.getMarginRight());
    }

    @Test
    public void testGetTextIndent() {
        Para mockPara = Mockito.mock(Para.class);
        Mockito.when(mockPara.getTextIndent()).thenCallRealMethod();
        assertEquals("", mockPara.getTextIndent());
    }

    @Test
    public void testGetWidows() {
        Para mockPara = Mockito.mock(Para.class);
        Mockito.when(mockPara.getWidows()).thenCallRealMethod();
        assertEquals("", mockPara.getWidows());
    }

    @Test
    public void testGetOrphans() {
        Para mockPara = Mockito.mock(Para.class);
        Mockito.when(mockPara.getOrphans()).thenCallRealMethod();
        assertEquals("", mockPara.getOrphans());
    }

    @Test
    public void testGetPreserve() {
        Para mockPara = Mockito.mock(Para.class);
        Mockito.when(mockPara.getPreserve()).thenCallRealMethod();
        assertEquals("", mockPara.getPreserve());
    }
}
