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

package com.adobe.cq.forms.core.components.util;

import java.lang.reflect.Method;
import java.util.Map;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static com.adobe.xfa.HostPseudoModelScript.getCurrentPage;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith({ AemContextExtension.class, MockitoExtension.class })
public class AbstractFormComponentImplTest {

    private static final String BASE = "/form/componentswithrule";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_COMPONENT_WITH_INVALID_RULE = CONTENT_ROOT + "/textinput";
    private static final String PATH_COMPONENT_WITH_VALID_RULE = CONTENT_ROOT + "/datepicker";
    private static final String PATH_COMPONENT_WITH_NO_VALIDATION_STATUS = CONTENT_ROOT + "/datepicker2";
    private static final String PATH_COMPONENT_WITH_INVALID_VALIDATION_STATUS = CONTENT_ROOT + "/datepicker3";
    private static final String PATH_COMPONENT_WITH_NO_RULE = CONTENT_ROOT + "/numberinput";
    private static final String AF_PATH = "/content/forms/af/testAf";
    private static final String PAGE_PATH = "/content/testPage";

    public final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    public void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    public void testInvalidRule() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(PATH_COMPONENT_WITH_INVALID_RULE);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        Map<String, Object> rulesProperties = (Map<String, Object>) properties.get("fd:rules");
        assertNotNull(rulesProperties);
        assertEquals("invalid", rulesProperties.get("validationStatus"));
    }

    @Test
    public void testValidRule() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(PATH_COMPONENT_WITH_VALID_RULE);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        Map<String, Object> rulesProperties = (Map<String, Object>) properties.get("fd:rules");
        assertNotNull(rulesProperties);
        assertEquals("valid", rulesProperties.get("validationStatus"));
    }

    @Test
    public void testNoRule() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(PATH_COMPONENT_WITH_NO_RULE);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        Object rulesProperties = properties.get("fd:rules");
        assertNull(rulesProperties);
    }

    @Test
    public void testNoValidationStatusRule() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(PATH_COMPONENT_WITH_NO_VALIDATION_STATUS);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        Object rulesProperties = properties.get("fd:rules");
        assertNull(rulesProperties);
    }

    @Test
    public void testInvalidValidationStatusRule() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(PATH_COMPONENT_WITH_INVALID_VALIDATION_STATUS);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        Map<String, Object> rulesProperties = (Map<String, Object>) properties.get("fd:rules");
        assertNotNull(rulesProperties);
        assertEquals("invalid", rulesProperties.get("validationStatus"));
    }

    @Test
    public void testEmbedWithIframe() {
        Resource resource = Mockito.mock(Resource.class);
        Page afPage = Mockito.mock(Page.class);
        Mockito.when(afPage.getPath()).thenReturn(AF_PATH);
        PageManager pageManager = Mockito.mock(PageManager.class);
        Mockito.when(pageManager.getContainingPage(AF_PATH)).thenReturn(afPage);
        Page sitePage = Mockito.mock(Page.class);
        Mockito.when(sitePage.getPath()).thenReturn(PAGE_PATH);
        Mockito.when(sitePage.getPageManager()).thenReturn(pageManager);
        MockSlingHttpServletRequest request = context.request();

        class TestAbstractComponent extends AbstractComponentImpl {
            public Page getCurrentPageToTest() {
                return getCurrentPage();
            }
        }
        TestAbstractComponent abstractComponentImpl = new TestAbstractComponent();
        Utils.setInternalState(abstractComponentImpl, "request", request);
        Method initMethod = Utils.getPrivateMethod(AbstractComponentImpl.class, "init");
        try {
            initMethod.invoke(abstractComponentImpl);
            assertNull(abstractComponentImpl.getCurrentPageToTest());
            Utils.setInternalState(abstractComponentImpl, "currentPage", sitePage);
            initMethod.invoke(abstractComponentImpl);
            assertEquals(sitePage.getPath(), PAGE_PATH);
            Utils.setInternalState(abstractComponentImpl, "resource", resource);
            initMethod.invoke(abstractComponentImpl);
            assertEquals(sitePage.getPath(), PAGE_PATH);
            request.setAttribute(FormConstants.REQ_ATTR_REFERENCED_PATH, AF_PATH);
            initMethod.invoke(abstractComponentImpl);
            Page newCurrentPage = abstractComponentImpl.getCurrentPageToTest();
            assertEquals(afPage.getPath(), newCurrentPage.getPath(), "Page should be set to AF page instead of sites page.");

            // If requested page is forms
            Page page2 = Mockito.mock(Page.class);
            Mockito.when(page2.getPath()).thenReturn("/content/forms/af/testform");
            Utils.setInternalState(abstractComponentImpl, "currentPage", page2);
            initMethod.invoke(abstractComponentImpl);
            assertEquals(page2.getPath(), "/content/forms/af/testform");

        } catch (Exception e) {
            fail("Init method should have invoked");
        }
    }

    @Test
    private AbstractFormComponentImpl prepareTestClass(String path) {
        Resource resource = context.resourceResolver().getResource(path);
        AbstractFormComponentImpl abstractFormComponentImpl = new AbstractFormComponentImpl();
        Utils.setInternalState(abstractFormComponentImpl, "resource", resource);
        return abstractFormComponentImpl;
    }
}
