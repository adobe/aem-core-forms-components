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

public class EventTest {

    @Test
    public void testGetName() {
        Event mockEvent = Mockito.mock(Event.class);
        Mockito.when(mockEvent.getName()).thenCallRealMethod();
        assertEquals("", mockEvent.getName());
    }

    @Test
    public void testGetScript() {
        Event mockEvent = Mockito.mock(Event.class);
        Mockito.when(mockEvent.getScript()).thenCallRealMethod();
        assertEquals(null, mockEvent.getScript());
    }

    @Test
    public void testGetRef() {
        Event mockEvent = Mockito.mock(Event.class);
        Mockito.when(mockEvent.getRef()).thenCallRealMethod();
        assertEquals("", mockEvent.getRef());
    }

    @Test
    public void testGetActivity() {
        Event mockEvent = Mockito.mock(Event.class);
        Mockito.when(mockEvent.getActivity()).thenCallRealMethod();
        assertEquals("", mockEvent.getActivity());
    }
}
