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

public class BarcodeEditTest {

    @Test
    public void testGetChecksum() {
        BarcodeEdit mockBarcodeEdit = Mockito.mock(BarcodeEdit.class);
        Mockito.when(mockBarcodeEdit.getChecksum()).thenCallRealMethod();
        assertEquals("", mockBarcodeEdit.getChecksum());
    }

    @Test
    public void testGetDataLength() {
        BarcodeEdit mockBarcodeEdit = Mockito.mock(BarcodeEdit.class);
        Mockito.when(mockBarcodeEdit.getDataLength()).thenCallRealMethod();
        assertEquals("", mockBarcodeEdit.getDataLength());
    }

    @Test
    public void testGetTextLocation() {
        BarcodeEdit mockBarcodeEdit = Mockito.mock(BarcodeEdit.class);
        Mockito.when(mockBarcodeEdit.getTextLocation()).thenCallRealMethod();
        assertEquals("", mockBarcodeEdit.getTextLocation());
    }

    @Test
    public void testGetType() {
        BarcodeEdit mockBarcodeEdit = Mockito.mock(BarcodeEdit.class);
        Mockito.when(mockBarcodeEdit.getType()).thenCallRealMethod();
        assertEquals("", mockBarcodeEdit.getType());
    }

    @Test
    public void testGetWideNarrowRatio() {
        BarcodeEdit mockBarcodeEdit = Mockito.mock(BarcodeEdit.class);
        Mockito.when(mockBarcodeEdit.getWideNarrowRatio()).thenCallRealMethod();
        assertEquals("", mockBarcodeEdit.getWideNarrowRatio());
    }
}
