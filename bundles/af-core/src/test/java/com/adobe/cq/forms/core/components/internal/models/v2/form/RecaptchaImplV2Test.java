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

package com.adobe.cq.forms.core.components.internal.models.v2.form;

import java.util.Map;

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
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(AemContextExtension.class)

public class RecaptchaImplV2Test {
    private static final String BASE = "/form/recaptchav2";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_RECAPTCHA = CONTENT_ROOT + "/recaptcha";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    ReCaptchaConfigurationModel reCaptchaConfiguration = Mockito.mock(ReCaptchaConfigurationModel.class);

    CloudConfigurationProvider cloudConfigurationProvider = new CloudConfigurationProvider() {
        @Override
        public ReCaptchaConfigurationModel getRecaptchaCloudConfiguration(Resource resource) throws GuideException {
            return reCaptchaConfiguration;
        }

        @Override
        public HCaptchaConfiguration getHCaptchaCloudConfiguration(Resource resource) throws GuideException {
            return null;
        }
    };

    @BeforeEach
    void setUp() throws GuideException {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
        context.registerService(CloudConfigurationProvider.class, cloudConfigurationProvider);
        Mockito.when(reCaptchaConfiguration.siteKey()).thenReturn("dummySiteKey");
        Mockito.when(reCaptchaConfiguration.version()).thenReturn("enterprise");
        Mockito.when(reCaptchaConfiguration.keyType()).thenReturn("score");
    }

    @Test
    void testExportedType() {
        Captcha recaptcha = Utils.getComponentUnderTest(PATH_RECAPTCHA, Captcha.class, context);
        assertEquals(FormConstants.RT_FD_FORM_RECAPTCHA_V2, recaptcha.getExportedType());
        Captcha recaptchaMock = Mockito.mock(Captcha.class);
        when(recaptchaMock.getExportedType()).thenCallRealMethod();
        assertEquals("", recaptchaMock.getExportedType());
    }

    @Test
    void testFieldType() {
        Captcha recaptcha = Utils.getComponentUnderTest(PATH_RECAPTCHA, Captcha.class, context);
        assertEquals(FieldType.CAPTCHA.getValue(), recaptcha.getFieldType());
    }

    @Test
    void testGetName() {
        Captcha recaptcha = Utils.getComponentUnderTest(PATH_RECAPTCHA, Captcha.class, context);
        assertEquals("test-recaptcha", recaptcha.getName());
        Captcha recaptchaMock = Mockito.mock(Captcha.class);
        when(recaptchaMock.getName()).thenCallRealMethod();
        assertEquals(null, recaptchaMock.getName());
    }

    @Test
    void testGetRecaptchaProvider() {
        Captcha recaptcha = Utils.getComponentUnderTest(PATH_RECAPTCHA, Captcha.class, context);
        assertEquals("recaptchaEnterprise", recaptcha.getProvider());
    }

    @Test
    void testGetConfigurationPath() {
        Captcha recaptcha = Utils.getComponentUnderTest(PATH_RECAPTCHA, Captcha.class, context);
        assertEquals("enterpriseScore", recaptcha.getCloudServicePath());
        Captcha recaptchaMock = Mockito.mock(Captcha.class);
        when(recaptchaMock.getCloudServicePath()).thenCallRealMethod();
        assertEquals(null, recaptchaMock.getCloudServicePath());
    }

    @Test
    void testIsVisible() {
        Captcha recaptcha = Utils.getComponentUnderTest(PATH_RECAPTCHA, Captcha.class, context);
        assertEquals(true, recaptcha.isVisible());
        Captcha recaptchaMock = Mockito.mock(Captcha.class);
        when(recaptchaMock.isVisible()).thenCallRealMethod();
        assertEquals(null, recaptchaMock.isVisible());
    }

    @Test
    void testIsEnabled() {
        Captcha recaptcha = Utils.getComponentUnderTest(PATH_RECAPTCHA, Captcha.class, context);
        assertEquals(true, recaptcha.isEnabled());
        Captcha recaptchaMock = Mockito.mock(Captcha.class);
        when(recaptchaMock.isEnabled()).thenCallRealMethod();
        assertEquals(null, recaptchaMock.isEnabled());
    }

    @Test
    void testJSONExport() throws Exception {
        Captcha recaptcha = Utils.getComponentUnderTest(PATH_RECAPTCHA, Captcha.class, context);
        Utils.testJSONExport(recaptcha, Utils.getTestExporterJSONPath(BASE, PATH_RECAPTCHA));
    }

    @Test
    void testEnterpriseUrl() {
        Captcha recaptcha = Utils.getComponentUnderTest(PATH_RECAPTCHA, Captcha.class, context);
        Map<String, Object> captchaProps = recaptcha.getCaptchaProperties();
        String enterpriseUrl = (String) captchaProps.get("uri");
        assertEquals("https://www.recaptcha.net/recaptcha/enterprise.js", enterpriseUrl);
    }

    @Test
    void testCaptchaDisplayMode() {
        Captcha recaptcha = Utils.getComponentUnderTest(PATH_RECAPTCHA, Captcha.class, context);
        assertEquals("invisible", recaptcha.getCaptchaDisplayMode());
        Captcha recaptchaMock = Mockito.mock(Captcha.class);
        when(recaptchaMock.getCaptchaDisplayMode()).thenCallRealMethod();
        assertEquals(null, recaptchaMock.getCaptchaDisplayMode());
    }

    @Test
    void testCaptchaSiteKey() {
        Captcha recaptcha = Utils.getComponentUnderTest(PATH_RECAPTCHA, Captcha.class, context);
        assertEquals("dummySiteKey", recaptcha.getCaptchaSiteKey());
        Captcha recaptchaMock = Mockito.mock(Captcha.class);
        when(recaptchaMock.getCaptchaDisplayMode()).thenCallRealMethod();
        assertEquals(null, recaptchaMock.getCaptchaSiteKey());
    }

}
