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

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.PasswordInput;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

@ExtendWith(AemContextExtension.class)
public class PasswordInputImplTest {
    private static final String BASE = "/form/textinput";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_PASSWORD = CONTENT_ROOT + "/password-textinput";
    private static final String PATH_PASSWORD_TOGGLE_DISABLED = CONTENT_ROOT + "/password-textinput-toggle-disabled";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testFieldType() {
        PasswordInput passwordInput = Utils.getComponentUnderTest(PATH_PASSWORD, PasswordInput.class, context);
        assertEquals(FieldType.PASSWORD.getValue(), passwordInput.getFieldType());
        assertEquals(FormConstants.RT_FD_FORM_PASSWORD_V1, passwordInput.getExportedType());
    }

    @Test
    void testShowHidePasswordEnabledByDefault() {
        PasswordInput passwordInput = Utils.getComponentUnderTest(PATH_PASSWORD, PasswordInput.class, context);
        assertTrue(passwordInput.isShowHidePasswordEnabled());
        PasswordInput passwordInputMock = Mockito.mock(PasswordInput.class);
        Mockito.when(passwordInputMock.isShowHidePasswordEnabled()).thenCallRealMethod();
        assertTrue(passwordInputMock.isShowHidePasswordEnabled());
    }

    @Test
    void testShowHidePasswordCanBeDisabled() {
        PasswordInput passwordInput = Utils.getComponentUnderTest(PATH_PASSWORD_TOGGLE_DISABLED, PasswordInput.class, context);
        assertFalse(passwordInput.isShowHidePasswordEnabled());
    }

    @Test
    void testDefaultValueIsMaskedForPassword() {
        // password default values must never be exposed in the exported model, regardless of stored content
        PasswordInput passwordInput = Utils.getComponentUnderTest(PATH_PASSWORD, PasswordInput.class, context);
        assertNull(passwordInput.getDefault());
    }

    @Test
    void testJSONExport() throws Exception {
        PasswordInput passwordInput = Utils.getComponentUnderTest(PATH_PASSWORD, PasswordInput.class, context);
        Utils.testJSONExport(passwordInput, Utils.getTestExporterJSONPath(BASE, PATH_PASSWORD));
    }
}
