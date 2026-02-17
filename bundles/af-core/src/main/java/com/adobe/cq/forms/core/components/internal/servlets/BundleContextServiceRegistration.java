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
package com.adobe.cq.forms.core.components.internal.servlets;

import java.util.Hashtable;

import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceRegistration;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;

/**
 * Registers this bundle's {@link BundleContext} as an OSGi service so that Sling Models
 * (e.g. {@link com.adobe.cq.forms.core.components.internal.models.v1.form.FragmentImpl})
 * can inject it via {@code @OSGiService}. BundleContext is not normally published as a
 * service by the framework, so without this component such injection would always be null.
 */
@Component(immediate = true)
public class BundleContextServiceRegistration {

    /** Service property so consumers can target this bundle's context via filter. */
    public static final String SERVICE_PROPERTY_PROVIDER = "provider";

    /** Value for {@link #SERVICE_PROPERTY_PROVIDER} for this bundle's context. */
    public static final String SERVICE_PROPERTY_PROVIDER_VALUE = "aem-core-forms-components";

    private ServiceRegistration<BundleContext> registration;

    @Activate
    private void activate(BundleContext bundleContext) {
        Hashtable<String, String> props = new Hashtable<>();
        props.put(SERVICE_PROPERTY_PROVIDER, SERVICE_PROPERTY_PROVIDER_VALUE);
        registration = bundleContext.registerService(BundleContext.class, bundleContext, props);
    }

    @Deactivate
    private void deactivate() {
        if (registration != null) {
            registration.unregister();
            registration = null;
        }
    }
}
