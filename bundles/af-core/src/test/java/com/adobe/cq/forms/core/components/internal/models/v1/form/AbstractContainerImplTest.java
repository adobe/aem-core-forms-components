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

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.components.util.AbstractContainerImpl;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;

@ExtendWith(AemContextExtension.class)
public class AbstractContainerImplTest {

    @Test
    void testGetMinItems() {
        AbstractContainerImpl abstractContainerMock = Mockito.mock(AbstractContainerImpl.class);
        Mockito.when(abstractContainerMock.getMinItems()).thenCallRealMethod();
        assertEquals(null, abstractContainerMock.getMinItems());
    }

    @Test
    void testGetMaxItems() {
        AbstractContainerImpl abstractContainerMock = Mockito.mock(AbstractContainerImpl.class);
        Mockito.when(abstractContainerMock.getMaxItems()).thenCallRealMethod();
        assertEquals(null, abstractContainerMock.getMaxItems());
    }

    @Test
    void testGetMinOccur() {
        AbstractContainerImpl abstractContainerMock = Mockito.mock(AbstractContainerImpl.class);
        Mockito.when(abstractContainerMock.getMinOccur()).thenCallRealMethod();
        assertEquals(null, abstractContainerMock.getMinOccur());
    }

    @Test
    void testGetMaxOccur() {
        AbstractContainerImpl abstractContainerMock = Mockito.mock(AbstractContainerImpl.class);
        Mockito.when(abstractContainerMock.getMaxOccur()).thenCallRealMethod();
        assertEquals(null, abstractContainerMock.getMaxOccur());
    }

    @Test
    void testIsRepeatable() {
        AbstractContainerImpl abstractContainerMock = Mockito.mock(AbstractContainerImpl.class);
        Mockito.when(abstractContainerMock.isRepeatable()).thenCallRealMethod();
        assertEquals(null, abstractContainerMock.isRepeatable());
    }

    @Test
    void testGetDorProperties() {
        AbstractContainerImpl abstractContainerMock = Mockito.mock(AbstractContainerImpl.class);
        Mockito.when(abstractContainerMock.getDorProperties()).thenCallRealMethod();
        assertEquals(null, abstractContainerMock.getDorProperties().get("dorType"));
        assertEquals(null, abstractContainerMock.getDorProperties().get("dorTemplateRef"));
    }

}
