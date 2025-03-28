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

public class ValueTest {

    @Test
    public void testGetValue() {
        // Mock the Value interface
        Value mockValue = Mockito.mock(Value.class);

        // Define behavior for the mock
        Mockito.when(mockValue.getDate()).thenCallRealMethod();

        // Assert the behavior
        assertEquals(null, mockValue.getDate());
    }

    @Test
    public void testGetText() {
        Value mockValue = Mockito.mock(Value.class);
        Mockito.when(mockValue.getText()).thenCallRealMethod();
        assertEquals(null, mockValue.getText());
    }

    @Test
    public void testGetInteger() {
        Value mockValue = Mockito.mock(Value.class);
        Mockito.when(mockValue.getInteger()).thenCallRealMethod();
        assertEquals(null, mockValue.getInteger());
    }

    @Test
    public void testGetFloat() {
        Value mockValue = Mockito.mock(Value.class);
        Mockito.when(mockValue.getFloat()).thenCallRealMethod();
        assertEquals(null, mockValue.getFloat());
    }

    @Test
    public void testGetRichText() {
        Value mockValue = Mockito.mock(Value.class);
        Mockito.when(mockValue.getRichText()).thenCallRealMethod();
        assertEquals(null, mockValue.getRichText());
    }

    @Test
    public void testGetLine() {
        Value mockValue = Mockito.mock(Value.class);
        Mockito.when(mockValue.getLine()).thenCallRealMethod();
        assertEquals(null, mockValue.getLine());
    }

    @Test
    public void testGetRectangle() {
        Value mockValue = Mockito.mock(Value.class);
        Mockito.when(mockValue.getRectangle()).thenCallRealMethod();
        assertEquals(null, mockValue.getRectangle());
    }

    @Test
    public void testGetImage() {
        Value mockValue = Mockito.mock(Value.class);
        Mockito.when(mockValue.getImage()).thenCallRealMethod();
        assertEquals(null, mockValue.getImage());
    }

    @Test
    public void testGetDate() {
        Value mockValue = Mockito.mock(Value.class);
        Mockito.when(mockValue.getDate()).thenCallRealMethod();
        assertEquals(null, mockValue.getDate());
    }

    @Test
    public void testGetDateTime() {
        Value mockValue = Mockito.mock(Value.class);
        Mockito.when(mockValue.getDateTime()).thenCallRealMethod();
        assertEquals(null, mockValue.getDateTime());
    }
}
