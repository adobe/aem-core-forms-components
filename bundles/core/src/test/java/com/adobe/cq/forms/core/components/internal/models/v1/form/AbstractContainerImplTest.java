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

}
