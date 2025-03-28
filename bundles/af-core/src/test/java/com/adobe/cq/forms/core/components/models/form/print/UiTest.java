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

public class UiTest {

    @Test
    public void testGetTextEdit() {
        Ui mockUi = Mockito.mock(Ui.class);
        Mockito.when(mockUi.getTextEdit()).thenCallRealMethod();
        assertEquals(null, mockUi.getTextEdit());
    }

    @Test
    public void testGetCheckButton() {
        Ui mockUi = Mockito.mock(Ui.class);
        Mockito.when(mockUi.getCheckButton()).thenCallRealMethod();
        assertEquals(null, mockUi.getCheckButton());
    }

    @Test
    public void testGetDateTimeEdit() {
        Ui mockUi = Mockito.mock(Ui.class);
        Mockito.when(mockUi.getDateTimeEdit()).thenCallRealMethod();
        assertEquals(null, mockUi.getDateTimeEdit());
    }

    @Test
    public void testGetNumericEdit() {
        Ui mockUi = Mockito.mock(Ui.class);
        Mockito.when(mockUi.getNumericEdit()).thenCallRealMethod();
        assertEquals(null, mockUi.getNumericEdit());
    }

    @Test
    public void testGetImageEdit() {
        Ui mockUi = Mockito.mock(Ui.class);
        Mockito.when(mockUi.getImageEdit()).thenCallRealMethod();
        assertEquals(null, mockUi.getImageEdit());
    }

    @Test
    public void testGetButton() {
        Ui mockUi = Mockito.mock(Ui.class);
        Mockito.when(mockUi.getButton()).thenCallRealMethod();
        assertEquals(null, mockUi.getButton());
    }

    @Test
    public void testGetBarcode() {
        Ui mockUi = Mockito.mock(Ui.class);
        Mockito.when(mockUi.getBarcode()).thenCallRealMethod();
        assertEquals(null, mockUi.getBarcode());
    }

    @Test
    public void testGetPicture() {
        Ui mockUi = Mockito.mock(Ui.class);
        Mockito.when(mockUi.getPicture()).thenCallRealMethod();
        assertEquals(null, mockUi.getPicture());
    }
}
