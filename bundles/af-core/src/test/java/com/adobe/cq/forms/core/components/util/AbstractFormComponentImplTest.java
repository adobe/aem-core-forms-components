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
import java.util.Arrays;
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
import com.adobe.cq.forms.core.components.internal.models.v1.form.VariableBindingImpl;
import com.adobe.cq.forms.core.components.models.form.VariableBinding;
import com.adobe.cq.forms.core.components.models.form.print.dorapi.DorContainer;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMMode;
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
    public void testInvalidRuleNotInPublish() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(PATH_COMPONENT_WITH_INVALID_RULE);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        assertNull(properties.get("fd:rules"), "fd:rules should not appear in publish mode");
    }

    @Test
    public void testValidRuleNotInPublish() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(PATH_COMPONENT_WITH_VALID_RULE);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        assertNull(properties.get("fd:rules"), "fd:rules should not appear in publish mode");
    }

    @Test
    public void testNoRule() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(PATH_COMPONENT_WITH_NO_RULE);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        assertNull(properties.get("fd:rules"));
    }

    @Test
    public void testNoValidationStatusRule() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(PATH_COMPONENT_WITH_NO_VALIDATION_STATUS);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        assertNull(properties.get("fd:rules"));
    }

    @Test
    public void testInvalidValidationStatusRuleNotInPublish() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(PATH_COMPONENT_WITH_INVALID_VALIDATION_STATUS);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        assertNull(properties.get("fd:rules"), "fd:rules should not appear in publish mode");
    }

    @Test
    public void testValidRuleInAuthorMode() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClassWithAuthorMode(PATH_COMPONENT_WITH_VALID_RULE);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        Map<String, Object> rulesProperties = (Map<String, Object>) properties.get("fd:rules");
        assertNotNull(rulesProperties, "fd:rules should appear in author mode");
        assertEquals("valid", rulesProperties.get("validationStatus"));
    }

    @Test
    public void testInvalidRuleInAuthorMode() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClassWithAuthorMode(PATH_COMPONENT_WITH_INVALID_RULE);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        Map<String, Object> rulesProperties = (Map<String, Object>) properties.get("fd:rules");
        assertNotNull(rulesProperties, "fd:rules should appear in author mode");
        assertEquals("invalid", rulesProperties.get("validationStatus"));
    }

    @Test
    public void testNoRuleInAuthorMode() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClassWithAuthorMode(PATH_COMPONENT_WITH_NO_RULE);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        assertNull(properties.get("fd:rules"), "fd:rules should not appear when no fd:rules node exists");
    }

    @Test
    public void testInvalidValidationStatusInAuthorMode() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClassWithAuthorMode(PATH_COMPONENT_WITH_INVALID_VALIDATION_STATUS);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        Map<String, Object> rulesProperties = (Map<String, Object>) properties.get("fd:rules");
        assertNotNull(rulesProperties, "fd:rules should appear in author mode even with invalid status");
        assertEquals("invalid", rulesProperties.get("validationStatus"));
    }

    @Test
    public void testRulesExcludedWhenPublishViewAttributeSetOnAuthor() {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClassWithAuthorMode(PATH_COMPONENT_WITH_VALID_RULE);
        context.request().setAttribute(FormConstants.REQ_ATTR_PUBLISH_VIEW, Boolean.TRUE);
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        assertNull(properties.get("fd:rules"),
            "fd:rules should not appear when publish view attribute is set even in author WCMMode");
    }

    @Test
    public void testIsAuthorModeUtility() {
        assertFalse(ComponentUtils.isAuthorMode(null), "null request should not be author mode");
        assertFalse(ComponentUtils.isAuthorMode(context.request()), "default request should not be author mode");
        WCMMode.EDIT.toRequest(context.request());
        assertTrue(ComponentUtils.isAuthorMode(context.request()), "EDIT mode should be author mode");
        context.request().setAttribute(FormConstants.REQ_ATTR_PUBLISH_VIEW, Boolean.TRUE);
        assertFalse(ComponentUtils.isAuthorMode(context.request()),
            "publish view attribute should override WCMMode");
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

    private AbstractFormComponentImpl prepareTestClassWithAuthorMode(String path) {
        AbstractFormComponentImpl abstractFormComponentImpl = prepareTestClass(path);
        WCMMode.EDIT.toRequest(context.request());
        Utils.setInternalState(abstractFormComponentImpl, "request", context.request());
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
        Object rulesProperties = properties.get("fd:rules");
        // Print Channel requires this to be present in both author and publish environments.
        assertNotNull(rulesProperties);
        Object formReadyRule = ((Map<String, Object>) rulesProperties).get("fd:formReady");
        assertNotNull(formReadyRule);
    }

    @Test
    public void testAssociateProperties() {
        Resource resource = Mockito.mock(Resource.class);
        AbstractFormComponentImpl abstractFormComponentImpl = new AbstractFormComponentImpl();
        Utils.setInternalState(abstractFormComponentImpl, "resource", resource);
        Utils.setInternalState(abstractFormComponentImpl, "channel", "print");
        Mockito.doReturn(null).when(resource).getChild("fd:rules");
        ValueMap valueMap = new MockValueMap(resource);
        Mockito.doReturn(valueMap).when(resource).getValueMap();
        Mockito.doReturn(null).when(resource).getChild("fd:dorContainer");
        Resource associateResource = Mockito.mock(Resource.class);
        Mockito.doReturn(associateResource).when(resource).getChild("fd:associate");
        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        assertNull(properties.get("fd:associate"));
    }

    @Test
    public void testVariablePropertyOnPrintChannel() {
        Resource resource = newBaseMockResource();
        AbstractFormComponentImpl abstractFormComponentImpl = newPrintComponent(resource);

        Resource variableResource = Mockito.mock(Resource.class);
        Mockito.doReturn(variableResource).when(resource).getChild("fd:variable");
        VariableBinding binding = newBinding(null, "icfragment",
            "/content/forms/af/ford-features/document-text-fragment",
            "bb625063-fb52-4f81-8229-07fea6d02c6f");
        Mockito.doReturn(binding).when(variableResource).adaptTo(VariableBinding.class);

        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        Map<String, Object> variable = (Map<String, Object>) properties.get("fd:variable");
        assertNotNull(variable);
        assertEquals("icfragment", variable.get("bindType"));
        assertEquals("/content/forms/af/ford-features/document-text-fragment", variable.get("bindRef"));
        assertEquals("bb625063-fb52-4f81-8229-07fea6d02c6f", variable.get("bindId"));
        // path is null on the singular case and must be elided by @JsonInclude(NON_NULL)
        assertFalse(variable.containsKey("path"));
    }

    @Test
    public void testVariablePropertySkippedOnNonPrintChannel() {
        Resource resource = Mockito.mock(Resource.class);
        Mockito.lenient().doReturn(new MockValueMap(resource)).when(resource).getValueMap();
        AbstractFormComponentImpl abstractFormComponentImpl = new AbstractFormComponentImpl();
        Utils.setInternalState(abstractFormComponentImpl, "resource", resource);
        // intentionally no channel set — defaults are not print

        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        assertNull(properties.get("fd:variable"));
        assertNull(properties.get("fd:variables"));
        // verify the child was never even fetched when not on print channel
        Mockito.verify(resource, Mockito.never()).getChild("fd:variable");
        Mockito.verify(resource, Mockito.never()).getChild("fd:variables");
    }

    @Test
    public void testVariablesPropertyOnPrintChannel() {
        Resource resource = newBaseMockResource();
        AbstractFormComponentImpl abstractFormComponentImpl = newPrintComponent(resource);

        Resource variablesResource = Mockito.mock(Resource.class);
        Mockito.doReturn(variablesResource).when(resource).getChild("fd:variables");

        Resource icEntry = Mockito.mock(Resource.class);
        Mockito.doReturn("variable_mp1fl2kv8zv43ayhj2h").when(icEntry).getName();
        Mockito.doReturn(newBinding("variable_mp1fl2kv8zv43ayhj2h", "icfragment",
            "/content/forms/af/ford-features/document-text-fragment",
            "bb625063-fb52-4f81-8229-07fea6d02c6f")).when(icEntry).adaptTo(VariableBinding.class);

        Resource fdmEntry = Mockito.mock(Resource.class);
        Mockito.doReturn("variable_ab1fl2kv8zv43ayhj2h").when(fdmEntry).getName();
        Mockito.doReturn(newBinding("variable_ab1fl2kv8zv43ayhj2h", "fdm",
            "$.InvoiceResponse.InvoiceLevel", null)).when(fdmEntry).adaptTo(VariableBinding.class);

        Mockito.doReturn(Arrays.asList(icEntry, fdmEntry)).when(variablesResource).getChildren();

        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        Map<String, Object> variables = (Map<String, Object>) properties.get("fd:variables");
        assertNotNull(variables);
        assertEquals(2, variables.size());

        Map<String, Object> ic = (Map<String, Object>) variables.get("variable_mp1fl2kv8zv43ayhj2h");
        assertNotNull(ic);
        assertEquals("variable_mp1fl2kv8zv43ayhj2h", ic.get("path"));
        assertEquals("icfragment", ic.get("bindType"));
        assertEquals("/content/forms/af/ford-features/document-text-fragment", ic.get("bindRef"));
        assertEquals("bb625063-fb52-4f81-8229-07fea6d02c6f", ic.get("bindId"));

        Map<String, Object> fdm = (Map<String, Object>) variables.get("variable_ab1fl2kv8zv43ayhj2h");
        assertNotNull(fdm);
        assertEquals("variable_ab1fl2kv8zv43ayhj2h", fdm.get("path"));
        assertEquals("fdm", fdm.get("bindType"));
        assertEquals("$.InvoiceResponse.InvoiceLevel", fdm.get("bindRef"));
        assertFalse(fdm.containsKey("bindId"), "fdm entries must elide bindId");
    }

    @Test
    public void testVariablesPropertyAbsentWhenNoNode() {
        Resource resource = newBaseMockResource();
        AbstractFormComponentImpl abstractFormComponentImpl = newPrintComponent(resource);
        Mockito.doReturn(null).when(resource).getChild("fd:variables");

        Map<String, Object> properties = abstractFormComponentImpl.getProperties();
        assertNull(properties.get("fd:variables"));
    }

    private Resource newBaseMockResource() {
        Resource resource = Mockito.mock(Resource.class);
        ValueMap valueMap = new MockValueMap(resource);
        Mockito.doReturn(valueMap).when(resource).getValueMap();
        // Strict-stubbing-safe defaults for every getChild lookup that getProperties() performs
        // on the print channel. Individual tests override these by calling doReturn(...) again
        // for the specific key they care about.
        Mockito.lenient().doReturn(null).when(resource).getChild("fd:rules");
        Mockito.lenient().doReturn(null).when(resource).getChild("fd:dorContainer");
        Mockito.lenient().doReturn(null).when(resource).getChild("fd:associate");
        Mockito.lenient().doReturn(null).when(resource).getChild("fd:variable");
        Mockito.lenient().doReturn(null).when(resource).getChild("fd:variables");
        return resource;
    }

    private AbstractFormComponentImpl newPrintComponent(Resource resource) {
        AbstractFormComponentImpl impl = new AbstractFormComponentImpl();
        Utils.setInternalState(impl, "resource", resource);
        Utils.setInternalState(impl, "channel", "print");
        return impl;
    }

    private VariableBinding newBinding(String path, String bindType, String bindRef, String bindId) {
        VariableBindingImpl binding = new VariableBindingImpl();
        Utils.setInternalState(binding, "path", path);
        Utils.setInternalState(binding, "bindType", bindType);
        Utils.setInternalState(binding, "bindRef", bindRef);
        Utils.setInternalState(binding, "bindId", bindId);
        return binding;
    }
}
