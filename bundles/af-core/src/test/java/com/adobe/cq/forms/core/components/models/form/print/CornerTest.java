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

public class CornerTest {

    @Test
    public void testGetPresence() {
        Corner mockCorner = Mockito.mock(Corner.class);
        Mockito.when(mockCorner.getPresence()).thenCallRealMethod();
        assertEquals("", mockCorner.getPresence());
    }

    @Test
    public void testGetStroke() {
        Corner mockCorner = Mockito.mock(Corner.class);
        Mockito.when(mockCorner.getStroke()).thenCallRealMethod();
        assertEquals("", mockCorner.getStroke());
    }

    @Test
    public void testGetRadius() {
        Corner mockCorner = Mockito.mock(Corner.class);
        Mockito.when(mockCorner.getRadius()).thenCallRealMethod();
        assertEquals("", mockCorner.getRadius());
    }

    @Test
    public void testGetInverted() {
        Corner mockCorner = Mockito.mock(Corner.class);
        Mockito.when(mockCorner.getInverted()).thenCallRealMethod();
        assertEquals("", mockCorner.getInverted());
    }

    @Test
    public void testGetJoin() {
        Corner mockCorner = Mockito.mock(Corner.class);
        Mockito.when(mockCorner.getJoin()).thenCallRealMethod();
        assertEquals("", mockCorner.getJoin());
    }

    @Test
    public void testGetThickness() {
        Corner mockCorner = Mockito.mock(Corner.class);
        Mockito.when(mockCorner.getThickness()).thenCallRealMethod();
        assertEquals("", mockCorner.getThickness());
    }
}
