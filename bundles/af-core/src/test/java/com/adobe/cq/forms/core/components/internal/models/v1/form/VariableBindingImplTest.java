/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2026 Adobe
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

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.forms.core.components.models.form.VariableBinding;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

@ExtendWith(AemContextExtension.class)
public class VariableBindingImplTest {

    private static final String BASE = "/form/variablebinding";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_FRAGMENT_VARIABLE = CONTENT_ROOT + "/fragmentVariable";
    private static final String PATH_FDM_ENTRY = CONTENT_ROOT + "/fdmEntry";
    private static final String PATH_ICFRAGMENT_ENTRY = CONTENT_ROOT + "/icfragmentEntry";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testSingularFragmentVariable() {
        VariableBinding binding = adapt(PATH_FRAGMENT_VARIABLE);
        assertNotNull(binding);
        assertNull(binding.getPath(), "fd:variable (singular) must not expose a path");
        assertEquals("icfragment", binding.getBindType());
        assertEquals("/content/forms/af/ford-features/document-text-fragment", binding.getBindRef());
        assertEquals("bb625063-fb52-4f81-8229-07fea6d02c6f", binding.getBindId());
    }

    @Test
    void testFdmEntry() {
        VariableBinding binding = adapt(PATH_FDM_ENTRY);
        assertNotNull(binding);
        assertEquals("variable_ab1fl2kv8zv43ayhj2h", binding.getPath());
        assertEquals("fdm", binding.getBindType());
        assertEquals("$.InvoiceResponse.InvoiceLevel", binding.getBindRef());
        assertNull(binding.getBindId(), "fdm entries must not expose a bindId");
    }

    @Test
    void testIcFragmentEntry() {
        VariableBinding binding = adapt(PATH_ICFRAGMENT_ENTRY);
        assertNotNull(binding);
        assertEquals("panel_123456/variable_mp1fl2kv8zv43ayhj2h", binding.getPath());
        assertEquals("icfragment", binding.getBindType());
        assertEquals("/content/forms/af/ford-features/document-text-fragment", binding.getBindRef());
        assertEquals("bb625063-fb52-4f81-8229-07fea6d02c6f", binding.getBindId());
    }

    @Test
    void testInterfaceDefaultsViaImplementation() {
        VariableBinding empty = new VariableBindingImpl();
        assertNull(empty.getPath());
        assertNull(empty.getBindType());
        assertNull(empty.getBindRef());
        assertNull(empty.getBindId());
    }

    private VariableBinding adapt(String path) {
        Resource resource = context.resourceResolver().getResource(path);
        assertNotNull(resource, "fixture resource missing: " + path);
        return resource.adaptTo(VariableBinding.class);
    }
}
