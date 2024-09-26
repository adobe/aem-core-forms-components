/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2022 Adobe
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
package com.adobe.cq.forms.core.components.internal.models.v1.form;

import java.util.Collections;

import org.apache.commons.lang3.ArrayUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.components.models.form.FormContainer;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;

@ExtendWith(AemContextExtension.class)
public class FormContainerTest {
    @Test
    void testGetTitle() {
        FormContainer formContainerMock = Mockito.mock(FormContainer.class);
        Mockito.when(formContainerMock.getTitle()).thenCallRealMethod();
        assertEquals("", formContainerMock.getTitle());
    }

    @Test
    void testGetExportedType() {
        FormContainer formContainerMock = Mockito.mock(FormContainer.class);
        Mockito.when(formContainerMock.getExportedType()).thenCallRealMethod();
        assertEquals("", formContainerMock.getExportedType());
    }

    @Test
    void testGetDescription() {
        FormContainer formContainerMock = Mockito.mock(FormContainer.class);
        Mockito.when(formContainerMock.getDescription()).thenCallRealMethod();
        assertEquals("", formContainerMock.getDescription());
    }

    @Test
    void testGetModel() {
        FormContainer formContainerMock = Mockito.mock(FormContainer.class);
        Mockito.when(formContainerMock.getModel()).thenCallRealMethod();
        assertEquals(Collections.emptyMap(), formContainerMock.getModel());
    }

    @Test
    void testGetRoleAttribute() throws Exception {
        FormContainer formContainerMock = Mockito.mock(FormContainer.class);
        assertEquals(formContainerMock.getRoleAttribute(), null);
    }

    @Test
    void testGetDocumentPath() {
        FormContainer formContainerMock = Mockito.mock(FormContainer.class);
        Mockito.when(formContainerMock.getDocumentPath()).thenCallRealMethod();
        assertEquals(null, formContainerMock.getDocumentPath());
    }

    @Test
    void testGetFormData() {
        FormContainer formContainerMock = Mockito.mock(FormContainer.class);
        Mockito.when(formContainerMock.getFormData()).thenCallRealMethod();
        assertEquals("", formContainerMock.getFormData());
    }

    @Test
    void testGetExportedItems() {
        FormContainer formContainerMock = Mockito.mock(FormContainer.class);
        Mockito.when(formContainerMock.getExportedItems()).thenCallRealMethod();
        assertEquals(Collections.emptyMap(), formContainerMock.getExportedItems());
    }

    @Test
    void testGetExportedItemsOrder() {
        FormContainer formContainerMock = Mockito.mock(FormContainer.class);
        Mockito.when(formContainerMock.getExportedItemsOrder()).thenCallRealMethod();
        assertEquals(ArrayUtils.EMPTY_STRING_ARRAY, formContainerMock.getExportedItemsOrder());
    }

    @Test
    void testGetLanguageDirection() {
        FormContainer formContainerMock = Mockito.mock(FormContainer.class);
        Mockito.when(formContainerMock.getLanguageDirection()).thenCallRealMethod();
        assertEquals("ltr", formContainerMock.getLanguageDirection());
    }

}
