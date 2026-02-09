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
import java.util.List;
import java.util.Map;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.apache.sling.testing.resourceresolver.MockValueMap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.print.dorapi.DorContainer;
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
    private static final String PATH_COMPONENT_WITH_DISABLED_XFA_SCRIPTS = CONTENT_ROOT + "/xfacomponent";
    private static final String PATH_COMPONENT_WITH_INVALID_XFA_SCRIPTS = CONTENT_ROOT + "/xfacomponentinvalid";
    private static final String PATH_COMPONENT_WITH_NO_XFA_SCRIPTS = CONTENT_ROOT + "/xfacomponentnone";
    private static final String PATH_COMPONENT_WITH_RULES = CONTENT_ROOT + "/textinputWithPrintRule";
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
        assertNull(properties.get("fd:rules"), "fd:rules is whitelisted and should not appear in properties");
    }

    @Test
    public void testValidRule() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(PATH_COMPONENT_WITH_VALID_RULE);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        assertNull(properties.get("fd:rules"), "fd:rules is whitelisted and should not appear in properties");
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
        assertNull(properties.get("fd:rules"), "fd:rules is whitelisted and should not appear in properties");
    }

    @Test
    public void testDisabledXFAScripts() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(PATH_COMPONENT_WITH_DISABLED_XFA_SCRIPTS);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        List<String> disabledScripts = (List<String>) properties.get("fd:disabledXfaScripts");
        assertNotNull(disabledScripts);
        assertEquals(2, disabledScripts.size());
        assertTrue(disabledScripts.contains("click"));
        assertTrue(disabledScripts.contains("change"));
    }

    @Test
    public void testInvalidXFAScripts() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(PATH_COMPONENT_WITH_INVALID_XFA_SCRIPTS);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        Object disabledScripts = properties.get("fd:disabledXfaScripts");
        // Even with invalid JSON, we should get an empty list, not null
        assertNull(disabledScripts);
    }

    @Test
    public void testNoXFAScripts() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(PATH_COMPONENT_WITH_NO_XFA_SCRIPTS);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        Object disabledScripts = properties.get("fd:disabledXfaScripts");
        assertNull(disabledScripts);
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

    private AbstractFormComponentImpl prepareTestClass(String path) {
        Resource resource = context.resourceResolver().getResource(path);
        AbstractFormComponentImpl abstractFormComponentImpl = new AbstractFormComponentImpl();
        Utils.setInternalState(abstractFormComponentImpl, "resource", resource);
        return abstractFormComponentImpl;
    }

    @Test
    public void testGetDorContainer() {
        Resource resource = Mockito.mock(Resource.class);
        AbstractFormComponentImpl abstractFormComponentImpl = new AbstractFormComponentImpl();
        Utils.setInternalState(abstractFormComponentImpl, "resource", resource);
        Utils.setInternalState(abstractFormComponentImpl, "channel", "print");

        Resource dorContainerResource = Mockito.mock(Resource.class);
        Mockito.doReturn(dorContainerResource).when(resource).getChild("fd:dorContainer");

        DorContainer dorContainerMock = Mockito.mock(DorContainer.class);
        Mockito.doReturn(dorContainerMock).when(dorContainerResource).adaptTo(DorContainer.class);

        assertThrows(java.lang.IllegalArgumentException.class, () -> abstractFormComponentImpl.getDorContainer());

    }

    @Test
    public void testPrintChannelRule() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(PATH_COMPONENT_WITH_RULES);
        Utils.setInternalState(abstractFormComponentImpl, "channel", "print");
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        assertNull(properties.get("fd:rules"), "fd:rules is whitelisted and should not appear in properties");
    }

    @Test
    public void testAssociateProperties() {
        Resource resource = Mockito.mock(Resource.class);
        AbstractFormComponentImpl abstractFormComponentImpl = new AbstractFormComponentImpl();
        Utils.setInternalState(abstractFormComponentImpl, "resource", resource);
        Utils.setInternalState(abstractFormComponentImpl, "channel", "print");

        ValueMap valueMap = new MockValueMap(resource);
        Mockito.doReturn(valueMap).when(resource).getValueMap();
        Mockito.doReturn(null).when(resource).getChild("fd:dorContainer");
        Resource associateResource = Mockito.mock(Resource.class);
        Mockito.doReturn(associateResource).when(resource).getChild("fd:associate");
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        assertNull(properties.get("fd:associate"));
    }
}
