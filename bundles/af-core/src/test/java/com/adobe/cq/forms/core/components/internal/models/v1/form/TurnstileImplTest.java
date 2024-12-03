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
import com.adobe.aemds.guide.model.TurnstileConfiguration;
import com.adobe.aemds.guide.service.CloudConfigurationProvider;
import com.adobe.aemds.guide.service.GuideException;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Captcha;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.Turnstile;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@ExtendWith(AemContextExtension.class)
public class TurnstileImplTest {
    private static final String BASE = "/form/turnstile";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_TURNSTILE = CONTENT_ROOT + "/turnstile";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    TurnstileConfiguration turnstileConfig = Mockito.mock(TurnstileConfiguration.class);

    CloudConfigurationProvider cloudConfigurationProvider = new CloudConfigurationProvider() {
        @Override
        public ReCaptchaConfigurationModel getRecaptchaCloudConfiguration(Resource resource) throws GuideException {
            return null;
        }

        @Override
        public String getCustomFunctionUrl(Resource resource) {
            return null;
        }

        @Override
        public HCaptchaConfiguration getHCaptchaCloudConfiguration(Resource resource) throws GuideException {
            return null;
        }

        @Override
        public TurnstileConfiguration getTurnstileCloudConfiguration(Resource resource) throws GuideException {
            return turnstileConfig;
        }

    };

    @BeforeEach
    void setUp() throws GuideException {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
        context.registerService(CloudConfigurationProvider.class, cloudConfigurationProvider);
    }

    @Test
    void testExportedType() {
        Captcha turnstile = Utils.getComponentUnderTest(PATH_TURNSTILE, Turnstile.class, context);
        assertEquals(FormConstants.RT_FD_FORM_TURNSTILE_V1, turnstile.getExportedType());
        Turnstile turnstileMock = Mockito.mock(Turnstile.class);
        Mockito.when(turnstileMock.getExportedType()).thenCallRealMethod();
        assertEquals("", turnstileMock.getExportedType());
    }

    @Test
    void testFieldType() {
        Turnstile turnstile = Utils.getComponentUnderTest(PATH_TURNSTILE, Turnstile.class, context);
        assertEquals(FieldType.CAPTCHA.getValue(), turnstile.getFieldType());
    }

    @Test
    void testGetName() {
        Turnstile turnstile = Utils.getComponentUnderTest(PATH_TURNSTILE, Turnstile.class, context);
        assertEquals("turnstile1715230058257", turnstile.getName());
        Turnstile turnstileMock = Mockito.mock(Turnstile.class);
        Mockito.when(turnstileMock.getName()).thenCallRealMethod();
        assertEquals(null, turnstileMock.getName());
    }

    @Test
    void testGetTurnstileProvider() {
        Turnstile turnstile = Utils.getComponentUnderTest(PATH_TURNSTILE, Turnstile.class, context);
        assertEquals("turnstile", turnstile.getProvider());
        Turnstile turnstileMock = Mockito.mock(Turnstile.class);
        Mockito.when(turnstileMock.getName()).thenCallRealMethod();
        assertEquals(null, turnstileMock.getName());
    }

    @Test
    void testGetConfigurationPath() {
        Turnstile turnstile = Utils.getComponentUnderTest(PATH_TURNSTILE, Turnstile.class, context);
        assertEquals("managed", turnstile.getCloudServicePath());
        Turnstile turnstileMock = Mockito.mock(Turnstile.class);
        Mockito.when(turnstileMock.getName()).thenCallRealMethod();
        assertEquals(null, turnstileMock.getName());
    }

    @Test
    void testIsVisible() {
        Turnstile turnstile = Utils.getComponentUnderTest(PATH_TURNSTILE, Turnstile.class, context);
        assertEquals(true, turnstile.isVisible());
        Turnstile turnstileMock = Mockito.mock(Turnstile.class);
        Mockito.when(turnstileMock.isVisible()).thenCallRealMethod();
        assertEquals(null, turnstileMock.isVisible());
    }

    @Test
    void testIsEnabled() {
        Turnstile turnstile = Utils.getComponentUnderTest(PATH_TURNSTILE, Turnstile.class, context);
        assertEquals(true, turnstile.isEnabled());
        Turnstile turnstileMock = Mockito.mock(Turnstile.class);
        Mockito.when(turnstileMock.isEnabled()).thenCallRealMethod();
        assertEquals(null, turnstileMock.isEnabled());
    }

    @Test
    void testJSONExport() throws Exception {
        Mockito.when(turnstileConfig.getSiteKey()).thenReturn("siteKey");
        Mockito.when(turnstileConfig.getWidgetType()).thenReturn("invisible");
        Mockito.when(turnstileConfig.getClientSideJsUrl()).thenReturn("https://challenges.cloudflare.com/turnstile/v0/api.js");
        Turnstile turnstile = Utils.getComponentUnderTest(PATH_TURNSTILE, Turnstile.class, context);
        Utils.testJSONExport(turnstile, Utils.getTestExporterJSONPath(BASE, PATH_TURNSTILE));
    }

    @Test
    void turnstileConfigExceptionTest() throws GuideException {
        Mockito.when(turnstileConfig.getSiteKey()).thenThrow(new GuideException("Error while fetching site key"));
        Turnstile turnstile = Utils.getComponentUnderTest(PATH_TURNSTILE, Turnstile.class, context);
        assertNotNull(turnstile.getCaptchaProperties());
    }
}
