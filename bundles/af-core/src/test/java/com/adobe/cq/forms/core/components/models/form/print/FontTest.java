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

public class FontTest {

    @Test
    public void testGetFontHorizontalScale() {
        Font mockFont = Mockito.mock(Font.class);
        Mockito.when(mockFont.getFontHorizontalScale()).thenCallRealMethod();
        assertEquals("", mockFont.getFontHorizontalScale());
    }

    @Test
    public void testGetFontVerticalScale() {
        Font mockFont = Mockito.mock(Font.class);
        Mockito.when(mockFont.getFontVerticalScale()).thenCallRealMethod();
        assertEquals("", mockFont.getFontVerticalScale());
    }

    @Test
    public void testGetKerningMode() {
        Font mockFont = Mockito.mock(Font.class);
        Mockito.when(mockFont.getKerningMode()).thenCallRealMethod();
        assertEquals("", mockFont.getKerningMode());
    }

    @Test
    public void testGetLetterSpacing() {
        Font mockFont = Mockito.mock(Font.class);
        Mockito.when(mockFont.getLetterSpacing()).thenCallRealMethod();
        assertEquals("", mockFont.getLetterSpacing());
    }

    @Test
    public void testGetUnderline() {
        Font mockFont = Mockito.mock(Font.class);
        Mockito.when(mockFont.getUnderline()).thenCallRealMethod();
        assertEquals("", mockFont.getUnderline());
    }

    @Test
    public void testGetFill() {
        Font mockFont = Mockito.mock(Font.class);
        Mockito.when(mockFont.getFill()).thenCallRealMethod();
        assertEquals(null, mockFont.getFill());
    }

    @Test
    public void testGetBaselineShift() {
        Font mockFont = Mockito.mock(Font.class);
        Mockito.when(mockFont.getBaselineShift()).thenCallRealMethod();
        assertEquals("", mockFont.getBaselineShift());
    }

    @Test
    public void testGetWeight() {
        Font mockFont = Mockito.mock(Font.class);
        Mockito.when(mockFont.getWeight()).thenCallRealMethod();
        assertEquals("", mockFont.getWeight());
    }

    @Test
    public void testGetLineThrough() {
        Font mockFont = Mockito.mock(Font.class);
        Mockito.when(mockFont.getLineThrough()).thenCallRealMethod();
        assertEquals("", mockFont.getLineThrough());
    }

    @Test
    public void testGetPosture() {
        Font mockFont = Mockito.mock(Font.class);
        Mockito.when(mockFont.getPosture()).thenCallRealMethod();
        assertEquals("", mockFont.getPosture());
    }

    @Test
    public void testGetSize() {
        Font mockFont = Mockito.mock(Font.class);
        Mockito.when(mockFont.getSize()).thenCallRealMethod();
        assertEquals("", mockFont.getSize());
    }

    @Test
    public void testGetTypeface() {
        Font mockFont = Mockito.mock(Font.class);
        Mockito.when(mockFont.getTypeface()).thenCallRealMethod();
        assertEquals("", mockFont.getTypeface());
    }
}
