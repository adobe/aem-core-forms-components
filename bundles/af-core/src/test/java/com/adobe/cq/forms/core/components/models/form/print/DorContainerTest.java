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

public class DorContainerTest {

    @Test
    public void testGetType() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getType()).thenCallRealMethod();
        assertEquals("", mockDorContainer.getType());
    }

    @Test
    public void testGetName() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getName()).thenCallRealMethod();
        assertEquals("", mockDorContainer.getName());
    }

    @Test
    public void testGetWidth() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getWidth()).thenCallRealMethod();
        assertEquals("", mockDorContainer.getWidth());
    }

    @Test
    public void testGetHeight() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getHeight()).thenCallRealMethod();
        assertEquals("", mockDorContainer.getHeight());
    }

    @Test
    public void testGetLeft() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getLeft()).thenCallRealMethod();
        assertEquals("", mockDorContainer.getLeft());
    }

    @Test
    public void testGetTop() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getTop()).thenCallRealMethod();
        assertEquals("", mockDorContainer.getTop());
    }

    @Test
    public void testGetLocale() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getLocale()).thenCallRealMethod();
        assertEquals("", mockDorContainer.getLocale());
    }

    @Test
    public void testGetAccess() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getAccess()).thenCallRealMethod();
        assertEquals("", mockDorContainer.getAccess());
    }

    @Test
    public void testGetMargin() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getMargin()).thenCallRealMethod();
        assertEquals(null, mockDorContainer.getMargin());
    }

    @Test
    public void testGetBorder() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getBorder()).thenCallRealMethod();
        assertEquals(null, mockDorContainer.getBorder());
    }

    @Test
    public void testGetMaxH() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getMaxH()).thenCallRealMethod();
        assertEquals("", mockDorContainer.getMaxH());
    }

    @Test
    public void testGetMaxW() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getMaxW()).thenCallRealMethod();
        assertEquals("", mockDorContainer.getMaxW());
    }

    @Test
    public void testGetMinH() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getMinH()).thenCallRealMethod();
        assertEquals("", mockDorContainer.getMinH());
    }

    @Test
    public void testGetMinW() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getMinW()).thenCallRealMethod();
        assertEquals("", mockDorContainer.getMinW());
    }

    @Test
    public void testGetLayout() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getLayout()).thenCallRealMethod();
        assertEquals("", mockDorContainer.getLayout());
    }

    @Test
    public void testGetPresence() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getPresence()).thenCallRealMethod();
        assertEquals("", mockDorContainer.getPresence());
    }

    @Test
    public void testGetUseHref() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getUseHref()).thenCallRealMethod();
        assertEquals("", mockDorContainer.getUseHref());
    }

    @Test
    public void testGetStock() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getStock()).thenCallRealMethod();
        assertEquals("", mockDorContainer.getStock());
    }

    @Test
    public void testGetShort() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getShort()).thenCallRealMethod();
        assertEquals("", mockDorContainer.getShort());
    }

    @Test
    public void testGetLong() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getLong()).thenCallRealMethod();
        assertEquals("", mockDorContainer.getLong());
    }

    @Test
    public void testGetBind() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getBind()).thenCallRealMethod();
        assertEquals(null, mockDorContainer.getBind());
    }

    @Test
    public void testGetValue() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getValue()).thenCallRealMethod();
        assertEquals(null, mockDorContainer.getValue());
    }

    @Test
    public void testGetPara() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getPara()).thenCallRealMethod();
        assertEquals(null, mockDorContainer.getPara());
    }

    @Test
    public void testGetFont() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getFont()).thenCallRealMethod();
        assertEquals(null, mockDorContainer.getFont());
    }

    @Test
    public void testGetItems() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getItems()).thenCallRealMethod();
        assertEquals(null, mockDorContainer.getItems());
    }

    @Test
    public void testGetTraversal() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getTraversal()).thenCallRealMethod();
        assertEquals(null, mockDorContainer.getTraversal());
    }

    @Test
    public void testGetEvents() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getEvents()).thenCallRealMethod();
        assertEquals(null, mockDorContainer.getEvents());
    }

    @Test
    public void testGetDesc() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getDesc()).thenCallRealMethod();
        assertEquals(null, mockDorContainer.getDesc());
    }

    @Test
    public void testGetBreakBefore() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getBreakBefore()).thenCallRealMethod();
        assertEquals(null, mockDorContainer.getBreakBefore());
    }

    @Test
    public void testGetBreakAfter() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getBreakAfter()).thenCallRealMethod();
        assertEquals(null, mockDorContainer.getBreakAfter());
    }

    @Test
    public void testGetKeep() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getKeep()).thenCallRealMethod();
        assertEquals(null, mockDorContainer.getKeep());
    }

    @Test
    public void testGetAssist() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getAssist()).thenCallRealMethod();
        assertEquals(null, mockDorContainer.getAssist());
    }

    @Test
    public void testGetUi() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getUi()).thenCallRealMethod();
        assertEquals(null, mockDorContainer.getUi());
    }

    @Test
    public void testGetCaption() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getCaption()).thenCallRealMethod();
        assertEquals(null, mockDorContainer.getCaption());
    }

    @Test
    public void testGetVariables() {
        DorContainer mockDorContainer = Mockito.mock(DorContainer.class);
        Mockito.when(mockDorContainer.getVariables()).thenCallRealMethod();
        assertEquals(null, mockDorContainer.getVariables());
    }
}
