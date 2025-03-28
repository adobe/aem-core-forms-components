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

public class NumericEditTest {

    @Test
    public void testGetMargin() {
        NumericEdit mockNumericEdit = Mockito.mock(NumericEdit.class);
        Mockito.when(mockNumericEdit.getMargin()).thenCallRealMethod();
        assertEquals(null, mockNumericEdit.getMargin());
    }

    @Test
    public void testGetBorder() {
        NumericEdit mockNumericEdit = Mockito.mock(NumericEdit.class);
        Mockito.when(mockNumericEdit.getBorder()).thenCallRealMethod();
        assertEquals(null, mockNumericEdit.getBorder());
    }
}
