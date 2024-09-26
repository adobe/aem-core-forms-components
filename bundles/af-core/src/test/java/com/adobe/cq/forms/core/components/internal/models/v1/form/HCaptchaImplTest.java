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

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.aemds.guide.model.HCaptchaConfiguration;
import com.adobe.aemds.guide.model.ReCaptchaConfigurationModel;
import com.adobe.aemds.guide.service.CloudConfigurationProvider;
import com.adobe.aemds.guide.service.GuideException;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Captcha;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.HCaptcha;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@ExtendWith(AemContextExtension.class)
public class HCaptchaImplTest {
    private static final String BASE = "/form/hcaptcha";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_HCAPTCHA = CONTENT_ROOT + "/hcaptcha";
    private static final String PATH_HCAPTCHA_WITHOUT_FIELDTYPE = CONTENT_ROOT + "/hcaptcha-without-fieldtype";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    HCaptchaConfiguration hCaptchaConfiguration = Mockito.mock(HCaptchaConfiguration.class);

    CloudConfigurationProvider cloudConfigurationProvider = new CloudConfigurationProvider() {
        @Override
        public ReCaptchaConfigurationModel getRecaptchaCloudConfiguration(Resource resource) throws GuideException {
            return null;
        }

        @Override
        public HCaptchaConfiguration getHCaptchaCloudConfiguration(Resource resource) throws GuideException {
            return hCaptchaConfiguration;
        }
    };

    @BeforeEach
    void setUp() throws GuideException {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
        context.registerService(CloudConfigurationProvider.class, cloudConfigurationProvider);
    }

    @Test
    void testExportedType() {
        Captcha hCaptcha = Utils.getComponentUnderTest(PATH_HCAPTCHA, HCaptcha.class, context);
        assertEquals(FormConstants.RT_FD_FORM_HCAPTCHA_V1, hCaptcha.getExportedType());
        HCaptcha hcaptchaMock = Mockito.mock(HCaptcha.class);
        Mockito.when(hcaptchaMock.getExportedType()).thenCallRealMethod();
        assertEquals("", hcaptchaMock.getExportedType());
    }

    @Test
    void testFieldType() {
        HCaptcha hcaptcha = Utils.getComponentUnderTest(PATH_HCAPTCHA, HCaptcha.class, context);
        assertEquals(FieldType.CAPTCHA.getValue(), hcaptcha.getFieldType());
    }

    @Test
    void testGetName() {
        HCaptcha hCaptcha = Utils.getComponentUnderTest(PATH_HCAPTCHA, HCaptcha.class, context);
        assertEquals("test-hcaptcha", hCaptcha.getName());
        HCaptcha hcaptchaMock = Mockito.mock(HCaptcha.class);
        Mockito.when(hcaptchaMock.getName()).thenCallRealMethod();
        assertEquals(null, hcaptchaMock.getName());
    }

    @Test
    void testGetHCaptchaProvider() {
        HCaptcha hCaptcha = Utils.getComponentUnderTest(PATH_HCAPTCHA, HCaptcha.class, context);
        assertEquals("hcaptcha", hCaptcha.getProvider());
        HCaptcha hcaptchaMock = Mockito.mock(HCaptcha.class);
        Mockito.when(hcaptchaMock.getName()).thenCallRealMethod();
        assertEquals(null, hcaptchaMock.getName());
    }

    @Test
    void testGetConfigurationPath() {
        HCaptcha hCaptcha = Utils.getComponentUnderTest(PATH_HCAPTCHA, HCaptcha.class, context);
        assertEquals("always-challenge", hCaptcha.getCloudServicePath());
        HCaptcha hCaptchaMock = Mockito.mock(HCaptcha.class);
        Mockito.when(hCaptchaMock.getName()).thenCallRealMethod();
        assertEquals(null, hCaptchaMock.getName());
    }

    @Test
    void testIsVisible() {
        HCaptcha hCaptcha = Utils.getComponentUnderTest(PATH_HCAPTCHA, HCaptcha.class, context);
        assertEquals(true, hCaptcha.isVisible());
        HCaptcha hCaptchaMock = Mockito.mock(HCaptcha.class);
        Mockito.when(hCaptchaMock.isVisible()).thenCallRealMethod();
        assertEquals(null, hCaptchaMock.isVisible());
    }

    @Test
    void testIsEnabled() {
        HCaptcha hCaptcha = Utils.getComponentUnderTest(PATH_HCAPTCHA, HCaptcha.class, context);
        assertEquals(true, hCaptcha.isEnabled());
        HCaptcha hCaptchaMock = Mockito.mock(HCaptcha.class);
        Mockito.when(hCaptchaMock.isEnabled()).thenCallRealMethod();
        assertEquals(null, hCaptchaMock.isEnabled());
    }

    @Test
    void testJSONExport() throws Exception {
        HCaptcha hCaptcha = Utils.getComponentUnderTest(PATH_HCAPTCHA, HCaptcha.class, context);
        Utils.testJSONExport(hCaptcha, Utils.getTestExporterJSONPath(BASE, PATH_HCAPTCHA));
    }

    @Test
    void hCaptchaConfigExceptionTest() throws GuideException {
        Mockito.when(hCaptchaConfiguration.getSiteKey()).thenThrow(new GuideException("Error while fetching site key"));
        HCaptcha hcaptcha = Utils.getComponentUnderTest(PATH_HCAPTCHA, HCaptcha.class, context);
        assertNotNull(hcaptcha.getCaptchaProperties());
    }

    @Test
    void testNoFieldType() {
        HCaptcha hCaptcha = Utils.getComponentUnderTest(PATH_HCAPTCHA_WITHOUT_FIELDTYPE, HCaptcha.class, context);
        assertEquals(FieldType.CAPTCHA.getValue(), hCaptcha.getFieldType());
    }
}
