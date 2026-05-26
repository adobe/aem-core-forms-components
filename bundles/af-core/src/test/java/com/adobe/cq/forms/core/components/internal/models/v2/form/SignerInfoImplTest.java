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
package com.adobe.cq.forms.core.components.internal.models.v2.form;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.forms.core.components.models.form.SignerInfo;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

@ExtendWith(AemContextExtension.class)
public class SignerInfoImplTest {

    private static final String BASE = "/form/formcontainer";
    private static final String TEST_CONTENT = BASE + "/test-content-signer.json";
    private static final String SIGNER_ROOT = "/content/forms/af/test/signer";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(TEST_CONTENT, SIGNER_ROOT);
    }

    @Test
    void testDefaultSignerInfo() {
        SignerInfo defaultSigner = new SignerInfo() {};
        assertNull(defaultSigner.getSignerTitle());
        assertNull(defaultSigner.getEmailSource());
        assertNull(defaultSigner.getEmail());
        assertNull(defaultSigner.getEmailAutocomplete());
        assertNull(defaultSigner.getSecurityOption());
        assertNull(defaultSigner.getCountryCodeSource());
        assertNull(defaultSigner.getCountryCode());
        assertNull(defaultSigner.getCountryCodeAutocomplete());
        assertNull(defaultSigner.getPhoneSource());
        assertNull(defaultSigner.getPhone());
        assertNull(defaultSigner.getPhoneAutocomplete());
        assertNull(defaultSigner.getSignFieldBlocks());
        assertNull(defaultSigner.getSignerAfFieldsBlock());
        assertEquals(1, defaultSigner.getSignerNumber());
    }

    @Test
    void testSignerInfoFromResource() {
        SignerInfo signer = context.currentResource(SIGNER_ROOT).adaptTo(SignerInfo.class);
        assertNotNull(signer);
        assertEquals("Lead Signer", signer.getSignerTitle());
        assertEquals("typed", signer.getEmailSource());
        assertEquals("lead@example.com", signer.getEmail());
        assertNull(signer.getEmailAutocomplete());
        assertEquals("PHONE", signer.getSecurityOption());
        assertEquals("typed", signer.getCountryCodeSource());
        assertEquals("+1", signer.getCountryCode());
        assertNull(signer.getCountryCodeAutocomplete());
        assertEquals("typed", signer.getPhoneSource());
        assertEquals("9876543210", signer.getPhone());
        assertNull(signer.getPhoneAutocomplete());
        assertArrayEquals(new String[] { "block1", "block2" }, signer.getSignFieldBlocks());
        assertArrayEquals(new String[] { "emailField" }, signer.getSignerAfFieldsBlock());
        assertEquals(1, signer.getSignerNumber());
    }
}