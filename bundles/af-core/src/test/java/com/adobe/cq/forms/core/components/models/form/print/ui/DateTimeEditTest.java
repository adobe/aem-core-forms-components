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
package com.adobe.cq.forms.core.components.models.form.print.ui;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class DateTimeEditTest {

    @Test
    public void testGetMargin() {
        DateTimeEdit mockDateTimeEdit = Mockito.mock(DateTimeEdit.class);
        Mockito.when(mockDateTimeEdit.getMargin()).thenCallRealMethod();
        assertEquals(null, mockDateTimeEdit.getMargin());
    }

    @Test
    public void testGetBorder() {
        DateTimeEdit mockDateTimeEdit = Mockito.mock(DateTimeEdit.class);
        Mockito.when(mockDateTimeEdit.getBorder()).thenCallRealMethod();
        assertEquals(null, mockDateTimeEdit.getBorder());
    }
}
