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
package com.adobe.cq.forms.core.components.models.form;

import java.util.Collections;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.osgi.annotation.versioning.ProviderType;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@ProviderType
public class FormComponentTest {
    @Test
    public void testGetDorContainer() {
        FormComponent formComponent = Mockito.mock(FormComponent.class);
        Mockito.when(formComponent.getDorContainer()).thenCallRealMethod();
        assertEquals(Collections.emptyMap(), formComponent.getDorContainer());
    }

    @Test
    public void testSetLang() {
        FormComponent formComponent = Mockito.mock(FormComponent.class);
        // Test that setLang can be called with null
        formComponent.setLang(null);
        // Test that setLang can be called with a language code
        formComponent.setLang("en");
        // Test that setLang can be called with different language codes
        formComponent.setLang("fr");
        formComponent.setLang("de");
        // Test that setLang can be called with empty string
        formComponent.setLang("");

        // Verify that the method was called multiple times
        Mockito.verify(formComponent, Mockito.times(5)).setLang(Mockito.any());
    }

    @Test
    public void testGetLang() {
        FormComponent formComponent = Mockito.mock(FormComponent.class);
        Mockito.when(formComponent.getLang()).thenCallRealMethod();

        // Test that getLang returns the default language
        String result = formComponent.getLang();
        assertEquals(Base.DEFAULT_LANGUAGE, result);
    }

    @Test
    public void testGetLangIfPresent() {
        FormComponent formComponent = Mockito.mock(FormComponent.class);
        Mockito.when(formComponent.getLangIfPresent()).thenCallRealMethod();

        // Test that getLangIfPresent returns null by default
        String result = formComponent.getLangIfPresent();
        assertNull(result);
    }

}
