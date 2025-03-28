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

public class ImageEditTest {

    @Test
    public void testGetMargin() {
        ImageEdit mockImageEdit = Mockito.mock(ImageEdit.class);
        Mockito.when(mockImageEdit.getMargin()).thenCallRealMethod();
        assertEquals(null, mockImageEdit.getMargin());
    }

    @Test
    public void testGetBorder() {
        ImageEdit mockImageEdit = Mockito.mock(ImageEdit.class);
        Mockito.when(mockImageEdit.getBorder()).thenCallRealMethod();
        assertEquals(null, mockImageEdit.getBorder());
    }

    @Test
    public void testGetData() {
        ImageEdit mockImageEdit = Mockito.mock(ImageEdit.class);
        Mockito.when(mockImageEdit.getData()).thenCallRealMethod();
        assertEquals("", mockImageEdit.getData());
    }
}
