/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2023 Adobe
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
package com.adobe.cq.forms.core.components.internal.servlets;

import java.lang.reflect.Method;
import java.util.Dictionary;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceRegistration;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BundleContextServiceRegistrationTest {

    @Mock
    private BundleContext bundleContext;

    @Mock
    @SuppressWarnings("unchecked")
    private ServiceRegistration<BundleContext> serviceRegistration;

    @Test
    void activateRegistersBundleContextWithProviderProperty() throws Exception {
        when(bundleContext.registerService(eq(BundleContext.class), eq(bundleContext), any(Dictionary.class)))
            .thenReturn(serviceRegistration);

        BundleContextServiceRegistration component = new BundleContextServiceRegistration();
        Method activate = BundleContextServiceRegistration.class.getDeclaredMethod("activate", BundleContext.class);
        activate.setAccessible(true);
        activate.invoke(component, bundleContext);

        ArgumentCaptor<Dictionary> propsCaptor = ArgumentCaptor.forClass(Dictionary.class);
        verify(bundleContext).registerService(eq(BundleContext.class), eq(bundleContext), propsCaptor.capture());
        Dictionary<String, String> props = propsCaptor.getValue();
        assertNotNull(props);
        assertEquals(BundleContextServiceRegistration.SERVICE_PROPERTY_PROVIDER_VALUE,
            props.get(BundleContextServiceRegistration.SERVICE_PROPERTY_PROVIDER));
    }

    @Test
    void deactivateUnregistersService() throws Exception {
        when(bundleContext.registerService(eq(BundleContext.class), eq(bundleContext), any(Dictionary.class)))
            .thenReturn(serviceRegistration);

        BundleContextServiceRegistration component = new BundleContextServiceRegistration();
        Method activate = BundleContextServiceRegistration.class.getDeclaredMethod("activate", BundleContext.class);
        activate.setAccessible(true);
        activate.invoke(component, bundleContext);

        Method deactivate = BundleContextServiceRegistration.class.getDeclaredMethod("deactivate");
        deactivate.setAccessible(true);
        deactivate.invoke(component);

        verify(serviceRegistration).unregister();
    }

    @Test
    void deactivateWhenNeverActivatedDoesNotThrow() throws Exception {
        BundleContextServiceRegistration component = new BundleContextServiceRegistration();
        Method deactivate = BundleContextServiceRegistration.class.getDeclaredMethod("deactivate");
        deactivate.setAccessible(true);
        deactivate.invoke(component);
    }

    @Test
    void servicePropertyConstantsMatchExpectedFilterValues() {
        assertEquals("provider", BundleContextServiceRegistration.SERVICE_PROPERTY_PROVIDER);
        assertEquals("aem-core-forms-components", BundleContextServiceRegistration.SERVICE_PROPERTY_PROVIDER_VALUE);
    }
}
