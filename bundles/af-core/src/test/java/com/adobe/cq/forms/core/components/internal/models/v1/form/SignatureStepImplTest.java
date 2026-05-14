/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2024 Adobe
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

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.SignatureStep;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
public class SignatureStepImplTest {

    private static final String TEST_BASE = "/form/signaturestep";
    private static final String APPS_ROOT = "/apps";
    private static final String PATH_SIGNATURE_STEP = APPS_ROOT + "/signaturestep";
    private static final String PATH_SIGNATURE_STEP_DEFAULTS = APPS_ROOT + "/signaturestep-defaults";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(TEST_BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, APPS_ROOT);
    }

    @Test
    void testGetFieldType() {
        SignatureStep signatureStep = Utils.getComponentUnderTest(PATH_SIGNATURE_STEP, SignatureStepImpl.class, context);
        assertEquals(FieldType.PLAIN_TEXT.getValue(), signatureStep.getFieldType());
    }

    @Test
    void testGetFieldTypeOnNewInstance() {
        SignatureStep signatureStep = new SignatureStepImpl();
        assertEquals(FieldType.PLAIN_TEXT.getValue(), signatureStep.getFieldType());
    }

    @Test
    void testGetSigningService() {
        SignatureStep signatureStep = Utils.getComponentUnderTest(PATH_SIGNATURE_STEP, SignatureStepImpl.class, context);
        assertEquals("echosign", signatureStep.getSigningService());
    }

    @Test
    void testGetSigningServiceDefault() {
        SignatureStep signatureStep = Utils.getComponentUnderTest(PATH_SIGNATURE_STEP_DEFAULTS, SignatureStepImpl.class, context);
        assertEquals(SignatureStepImpl.DEFAULT_SIGNING_SERVICE, signatureStep.getSigningService());
    }

    @Test
    void testGetDisplayMsg() {
        SignatureStep signatureStep = Utils.getComponentUnderTest(PATH_SIGNATURE_STEP, SignatureStepImpl.class, context);
        assertEquals("Please sign the document", signatureStep.getDisplayMsg());
    }

    @Test
    void testGetDisplayMsgDefault() {
        SignatureStep signatureStep = Utils.getComponentUnderTest(PATH_SIGNATURE_STEP_DEFAULTS, SignatureStepImpl.class, context);
        assertNull(signatureStep.getDisplayMsg());
    }

    @Test
    void testGetCloudServiceConfig() {
        SignatureStep signatureStep = Utils.getComponentUnderTest(PATH_SIGNATURE_STEP, SignatureStepImpl.class, context);
        assertEquals("/etc/cloudservices/echosign/myConfig", signatureStep.getCloudServiceConfig());
    }

    @Test
    void testGetCloudServiceConfigDefault() {
        SignatureStep signatureStep = Utils.getComponentUnderTest(PATH_SIGNATURE_STEP_DEFAULTS, SignatureStepImpl.class, context);
        assertEquals("", signatureStep.getCloudServiceConfig());
    }

    @Test
    void testGetTargetVersion() {
        SignatureStep signatureStep = Utils.getComponentUnderTest(PATH_SIGNATURE_STEP, SignatureStepImpl.class, context);
        assertEquals("1.0", signatureStep.getTargetVersion());
    }

    @Test
    void testGetTargetVersionDefault() {
        SignatureStep signatureStep = Utils.getComponentUnderTest(PATH_SIGNATURE_STEP_DEFAULTS, SignatureStepImpl.class, context);
        assertNull(signatureStep.getTargetVersion());
    }

    @Test
    void testGetProperties() {
        SignatureStep signatureStep = Utils.getComponentUnderTest(PATH_SIGNATURE_STEP, SignatureStepImpl.class, context);
        Map<String, Object> properties = signatureStep.getProperties();
        assertNotNull(properties);
        assertEquals("echosign", properties.get("fd:signingService"));
        assertEquals("/etc/cloudservices/echosign/myConfig", properties.get("fd:cloudServiceConfig"));
        assertEquals("Please sign the document", properties.get("fd:displayMsg"));
        assertEquals("1.0", properties.get("fd:targetVersion"));
        assertEquals(APPS_ROOT + "/signaturestep", properties.get("fd:path"));
    }

    @Test
    void testGetPropertiesDefaults() {
        SignatureStep signatureStep = Utils.getComponentUnderTest(PATH_SIGNATURE_STEP_DEFAULTS, SignatureStepImpl.class, context);
        Map<String, Object> properties = signatureStep.getProperties();
        assertNotNull(properties);
        assertEquals(SignatureStepImpl.DEFAULT_SIGNING_SERVICE, properties.get("fd:signingService"));
        assertFalse(properties.containsKey("fd:cloudServiceConfig"));
        assertFalse(properties.containsKey("fd:displayMsg"));
        assertFalse(properties.containsKey("fd:targetVersion"));
    }

    @Test
    void testGetExportedType() {
        SignatureStep signatureStep = Utils.getComponentUnderTest(PATH_SIGNATURE_STEP, SignatureStepImpl.class, context);
        assertEquals("core/fd/components/form/signaturestep/v1/signaturestep", signatureStep.getExportedType());
    }
}
