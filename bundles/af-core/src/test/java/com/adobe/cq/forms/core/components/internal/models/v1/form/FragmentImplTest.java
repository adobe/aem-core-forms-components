/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2023 Adobe
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

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.i18n.ResourceBundleProvider;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.FormClientLibManager;
import com.adobe.cq.forms.core.components.models.form.Fragment;
import com.adobe.cq.forms.core.components.models.form.TextInput;
import com.adobe.cq.forms.core.components.views.Views;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.i18n.I18n;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.msm.api.MSMNameConstants;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

@ExtendWith(AemContextExtension.class)
public class FragmentImplTest {

    private static final String BASE = "/form/fragment";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_FRAGMENT = CONTENT_ROOT + "/fragment";
    private static final String PATH_FRAGMENT_DAMPATH = CONTENT_ROOT + "/fragment-dampath";
    private static final String PATH_FRAGMENT_WITHOUT_FIELDTYPE = CONTENT_ROOT + "/fragment-without-fieldtype";
    private static final String PATH_FRAGMENT_WITH_FRAGMENT_PATH = CONTENT_ROOT + "/fragment-with-fragment-path";
    private static final String PATH_FRAGMENT_WITH_INVALID_PATH = CONTENT_ROOT + "/fragment-with-invalid-path";
    private static final String PATH_FRAGMENT_WITH_PLACEHOLDER_RULES = CONTENT_ROOT + "/fragment-with-placeholder-rules";
    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
        context.registerService(SlingModelFilter.class, new SlingModelFilter() {

            private final Set<String> IGNORED_NODE_NAMES = new HashSet<String>() {
                {
                    add(NameConstants.NN_RESPONSIVE_CONFIG);
                    add(MSMNameConstants.NT_LIVE_SYNC_CONFIG);
                    add("cq:annotations");
                }
            };

            @Override
            public Map<String, Object> filterProperties(Map<String, Object> map) {
                return map;
            }

            @Override
            public Iterable<Resource> filterChildResources(Iterable<Resource> childResources) {
                return StreamSupport
                    .stream(childResources.spliterator(), false)
                    .filter(r -> !IGNORED_NODE_NAMES.contains(r.getName()))
                    .collect(Collectors.toList());
            }
        });
    }

    @Test
    void testExportedType() throws Exception {
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT, Fragment.class, context);
        assertEquals(FormConstants.RT_FD_FORM_FRAGMENT_V1, fragment.getExportedType());
        Fragment fragmentMock = Mockito.mock(Fragment.class);
        Mockito.when(fragmentMock.getExportedType()).thenCallRealMethod();
        assertEquals("", fragmentMock.getExportedType());
    }

    @Test
    void testGetId() throws Exception {
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT, Fragment.class, context);
        assertNotNull(fragment.getId());
    }

    @Test
    void testGetName() throws Exception {
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT, Fragment.class, context);
        assertEquals("fragment-123", fragment.getName());
    }

    @Test
    void testFragmentChildren() {
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT, Fragment.class, context);
        assertEquals(1, fragment.getFragmentChildren().size());
        assertEquals("textinput", fragment.getFragmentChildren().get(0).getName());
    }

    @Test
    void testFragmentContainerResource() {
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT, Fragment.class, context);
        Resource fragmentContainer = fragment.getFragmentContainer();
        assertNotNull(fragmentContainer);
        assertEquals("/content/affragment/jcr:content/guideContainer", fragmentContainer.getPath());
    }

    @Test
    void testFragmentContainerRulesNotInProperties() {
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT, Fragment.class, context);
        Map<String, Object> properties = fragment.getProperties();
        assertNotNull(properties);
        assertTrue("fd:rules is whitelisted and should not appear in properties (rules are at root level)",
            !properties.containsKey("fd:rules"));
    }

    @Test
    void testFragmentContainerEventsIncludedInGetEvents() {
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT, Fragment.class, context);
        Map<String, String[]> events = fragment.getEvents();
        assertNotNull(events);
        assertTrue("Stitched fragment should include events from referenced fragment container",
            events.containsKey("change"));
        Assertions.assertArrayEquals(new String[] { "fragmentChangeHandler" }, events.get("change"));
        assertTrue("Stitched fragment should include default custom:setProperty", events.containsKey("custom:setProperty"));
    }

    @Test
    void testFragmentContainerRulesParallelToEvents() {
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT, Fragment.class, context);
        Map<String, String> rules = fragment.getRules();
        Map<String, String[]> events = fragment.getEvents();
        assertNotNull(rules);
        assertNotNull(events);
        assertTrue("Stitched fragment should include root-level rules from referenced fragment container (parallel to events)",
            rules.containsKey("visible"));
        assertEquals("fragmentVisibleRule", rules.get("visible"));
        assertTrue("Rules and events should both be present at same level", events.containsKey("change"));
    }

    @Test
    void testPlaceholderAndFragmentContainerRulesEventsMerged() {
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT_WITH_PLACEHOLDER_RULES, Fragment.class, context);
        Map<String, String> rules = fragment.getRules();
        Map<String, String[]> events = fragment.getEvents();
        Map<String, Object> properties = fragment.getProperties();

        assertNotNull(rules);
        assertNotNull(events);
        assertNotNull(properties);

        assertTrue("Merged rules should include placeholder rule (required)", rules.containsKey("required"));
        assertEquals("placeholderRequired", rules.get("required"));
        assertTrue("Merged rules should include visible; panel has priority over fragment container", rules.containsKey("visible"));
        assertEquals("panelVisibleRule", rules.get("visible"));

        assertTrue("Merged events should include placeholder event (click)", events.containsKey("click"));
        Assertions.assertArrayEquals(new String[] { "placeholderClick" }, events.get("click"));
        assertTrue("Merged events should include fragment container event (change)", events.containsKey("change"));
        Assertions.assertArrayEquals(new String[] { "fragmentChangeHandler" }, events.get("change"));
        assertTrue("Merged events should include default custom:setProperty", events.containsKey("custom:setProperty"));
        assertTrue("Merged events should include initialize with panel handler first, then fragment appended", events.containsKey(
            "initialize"));
        Assertions.assertArrayEquals(new String[] { "panelInit", "fragInit" }, events.get("initialize"));

        assertTrue("fd:rules is whitelisted and should not appear in properties", !properties.containsKey("fd:rules"));
    }

    @Test
    void testJSONExport() throws Exception {
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT, Fragment.class, context);
        Utils.testJSONExport(fragment, Utils.getTestExporterJSONPath(BASE, PATH_FRAGMENT));
    }

    @Test
    void testJSONExportWithDamPath() throws Exception {
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT_DAMPATH, Fragment.class, context);
        Utils.testJSONExport(fragment, Utils.getTestExporterJSONPath(BASE, PATH_FRAGMENT_DAMPATH));
    }

    @Test
    void testJSONExportWithFragmentPath() throws Exception {
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT_WITH_FRAGMENT_PATH, Fragment.class, context);
        Utils.testJSONExport(fragment, Utils.getTestExporterJSONPath(BASE, PATH_FRAGMENT_WITH_FRAGMENT_PATH), Views.Author.class);
    }

    @Test
    void testGetChildrenModels() {
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT, Fragment.class, context);
        Map<String, ComponentExporter> childrenModels = ((FragmentImpl) fragment).getChildrenModels(context.request(),
            ComponentExporter.class);
        Assertions.assertEquals(1, childrenModels.size());
        Assertions.assertNotNull(childrenModels.get("textinput"));
        TextInput textInput = (TextInput) childrenModels.get("textinput");
        Assertions.assertEquals("core/fd/components/form/textinput/v1/textinput", textInput.getExportedType());
        Assertions.assertEquals("textinput-233cc688ba", textInput.getId());
        Assertions.assertEquals("fragmenttextinput", textInput.getName());
    }

    @Test
    void testGetChildrenModelsForNullRequest() {
        Resource resource = context.resourceResolver().getResource(PATH_FRAGMENT);
        Fragment fragment = resource.adaptTo(Fragment.class);
        Assertions.assertNotNull(fragment);
        Map<String, TextInput> childrenModels = ((FragmentImpl) fragment).getChildrenModels(null,
            TextInput.class);
        Assertions.assertEquals(1, childrenModels.size());
        Assertions.assertNotNull(childrenModels.get("textinput"));
        TextInput textInput = childrenModels.get("textinput");
        Assertions.assertEquals("textinput-233cc688ba", textInput.getId());
        Assertions.assertEquals("fragmenttextinput", textInput.getName());
    }

    @Test
    void testFragmentPlaceholderTitleAndElement() {
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT, Fragment.class, context);
        Assertions.assertEquals("AF Fragment (v2)", ((FragmentImpl) fragment).getFragmentTitle());

        List<String> childrenList = ((FragmentImpl) fragment).getTitleListOfChildren();
        Assertions.assertEquals(1, childrenList.size());
        Assertions.assertEquals("Text Input", childrenList.get(0));

        Assertions.assertEquals("/content/affragment", fragment.getFragmentPath());
    }

    @Test
    public void testAddClientLibRefWithNoRef() {
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT, Fragment.class, context);
        FormClientLibManager formClientLibManager = context.request().adaptTo(FormClientLibManager.class);
        List<String> clientLibs = formClientLibManager.getClientLibRefList();
        assertEquals(0, clientLibs.size());
    }

    @Test
    public void testAddClientLibRef() {
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT_DAMPATH, Fragment.class, context);
        FormClientLibManager formClientLibManager = context.request().adaptTo(FormClientLibManager.class);
        List<String> clientLibs = formClientLibManager.getClientLibRefList();
        assertEquals(1, clientLibs.size());
    }

    @Test
    void testNoFieldType() {
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT_WITHOUT_FIELDTYPE, Fragment.class, context);
        assertEquals(FieldType.PANEL.getValue(), fragment.getFieldType());
    }

    @Test
    void testGetFragmentContainerI18n() throws Exception {
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT, Fragment.class, context);
        FragmentImpl fragmentImpl = (FragmentImpl) fragment;

        // Use reflection to access the private method
        Method getFragmentContainerI18nMethod = FragmentImpl.class.getDeclaredMethod("getFragmentContainerI18n", String.class);
        getFragmentContainerI18nMethod.setAccessible(true);

        // Create mocks for the dependencies
        Resource mockFragmentContainer = Mockito.mock(Resource.class);
        ResourceResolver mockResourceResolver = Mockito.mock(ResourceResolver.class);
        Resource mockBaseResource = Mockito.mock(Resource.class);
        ResourceBundle mockResourceBundle = Mockito.mock(ResourceBundle.class);
        ResourceBundleProvider mockResourceBundleProvider = Mockito.mock(ResourceBundleProvider.class);

        // Use reflection to set the private fragmentContainer field
        Field fragmentContainerField = FragmentImpl.class.getDeclaredField("fragmentContainer");
        fragmentContainerField.setAccessible(true);
        fragmentContainerField.set(fragmentImpl, mockFragmentContainer);

        // Use reflection to set the private resourceBundleProvider field
        Field resourceBundleProviderField = FragmentImpl.class.getDeclaredField("resourceBundleProvider");
        resourceBundleProviderField.setAccessible(true);
        resourceBundleProviderField.set(fragmentImpl, mockResourceBundleProvider);

        // Setup mock behaviors
        Mockito.when(mockFragmentContainer.getResourceResolver()).thenReturn(mockResourceResolver);
        Mockito.when(mockFragmentContainer.getPath()).thenReturn("/content/fragment");
        Mockito.when(mockResourceResolver.getResource(Mockito.anyString())).thenReturn(mockBaseResource);
        Mockito.when(mockResourceBundleProvider.getResourceBundle(Mockito.anyString(), Mockito.any(Locale.class)))
            .thenReturn(mockResourceBundle);

        // Test case 1: When localeLang is null - should return I18n with null resource bundle
        I18n result1 = (I18n) getFragmentContainerI18nMethod.invoke(fragmentImpl, (String) null);
        Assertions.assertNotNull(result1, "getFragmentContainerI18n should return a non-null I18n object even when localeLang is null");

        // Test case 2: When localeLang is set and resourceBundleProvider is available - should return I18n with resource bundle
        I18n result2 = (I18n) getFragmentContainerI18nMethod.invoke(fragmentImpl, "en");
        Assertions.assertNotNull(result2, "getFragmentContainerI18n should return a non-null I18n object when localeLang is set");

        // Verify that the method called the expected dependencies
        Mockito.verify(mockFragmentContainer, Mockito.atLeastOnce()).getResourceResolver();
        Mockito.verify(mockFragmentContainer, Mockito.atLeastOnce()).getPath();
        Mockito.verify(mockResourceResolver, Mockito.atLeastOnce()).getResource(Mockito.anyString());
        Mockito.verify(mockResourceBundleProvider, Mockito.atLeastOnce())
            .getResourceBundle(Mockito.anyString(), Mockito.any(Locale.class));

        // Test case 3: When resourceBundleProvider is null - should still return I18n object
        resourceBundleProviderField.set(fragmentImpl, null);
        I18n result3 = (I18n) getFragmentContainerI18nMethod.invoke(fragmentImpl, "fr");
        Assertions.assertNotNull(result3,
            "getFragmentContainerI18n should return a non-null I18n object even when resourceBundleProvider is null");

        // Test case 4: When baseResource is null - should still work
        Mockito.when(mockResourceResolver.getResource(Mockito.anyString())).thenReturn(null);
        resourceBundleProviderField.set(fragmentImpl, mockResourceBundleProvider);
        I18n result4 = (I18n) getFragmentContainerI18nMethod.invoke(fragmentImpl, "de");
        Assertions.assertNotNull(result4, "getFragmentContainerI18n should handle null baseResource");

        // Test case 5: Test with empty string localeLang
        I18n result5 = (I18n) getFragmentContainerI18nMethod.invoke(fragmentImpl, "");
        Assertions.assertNotNull(result5, "getFragmentContainerI18n should handle empty string localeLang");
    }

    @Test
    void testNullFragmentContainerHandling() throws Exception {
        // This test verifies the fix when fragmentContainer is null
        Fragment fragment = Utils.getComponentUnderTest(PATH_FRAGMENT_WITH_INVALID_PATH, Fragment.class, context);
        FragmentImpl fragmentImpl = (FragmentImpl) fragment;

        // Verify that fragmentContainer is null due to invalid path
        Assertions.assertNull(fragmentImpl.getFragmentContainer(),
            "Fragment container should be null for invalid fragment path");

        // Test that getChildrenModels returns empty map instead of throwing NPE
        Map<String, ComponentExporter> childrenModels = fragmentImpl.getChildrenModels(context.request(),
            ComponentExporter.class);
        Assertions.assertNotNull(childrenModels, "getChildrenModels should return non-null map even with null fragmentContainer");
        Assertions.assertTrue(childrenModels.isEmpty(),
            "getChildrenModels should return empty map when fragmentContainer is null");

        // Test that getExportedItems doesn't throw NPE
        Map<String, ? extends ComponentExporter> exportedItems = fragmentImpl.getExportedItems();
        Assertions.assertNotNull(exportedItems, "getExportedItems should return non-null map even with null fragmentContainer");
        Assertions.assertTrue(exportedItems.isEmpty(),
            "getExportedItems should return empty map when fragmentContainer is null");

        // Test that getExportedItemsOrder doesn't throw NPE
        String[] exportedItemsOrder = fragmentImpl.getExportedItemsOrder();
        Assertions.assertNotNull(exportedItemsOrder, "getExportedItemsOrder should return non-null array even with null fragmentContainer");
        Assertions.assertEquals(0, exportedItemsOrder.length,
            "getExportedItemsOrder should return empty array when fragmentContainer is null");

        // Test getFragmentContainerI18n with null fragmentContainer
        Method getFragmentContainerI18nMethod = FragmentImpl.class.getDeclaredMethod("getFragmentContainerI18n", String.class);
        getFragmentContainerI18nMethod.setAccessible(true);

        // Should not throw NPE and should return non-null I18n object
        I18n result = (I18n) getFragmentContainerI18nMethod.invoke(fragmentImpl, "en");
        Assertions.assertNotNull(result,
            "getFragmentContainerI18n should return non-null I18n object even when fragmentContainer is null");
    }

    @Test
    void testNullFragmentContainerWithNullRequest() throws Exception {
        // Test with null request to cover both code paths
        Resource resource = context.resourceResolver().getResource(PATH_FRAGMENT_WITH_INVALID_PATH);
        Fragment fragment = resource.adaptTo(Fragment.class);
        Assertions.assertNotNull(fragment, "Fragment should be created even with invalid path");

        FragmentImpl fragmentImpl = (FragmentImpl) fragment;

        // Verify that fragmentContainer is null
        Assertions.assertNull(fragmentImpl.getFragmentContainer(),
            "Fragment container should be null for invalid fragment path");

        // Test that getChildrenModels with null request returns empty map instead of throwing NPE
        Map<String, TextInput> childrenModels = fragmentImpl.getChildrenModels(null, TextInput.class);
        Assertions.assertNotNull(childrenModels,
            "getChildrenModels should return non-null map with null request and null fragmentContainer");
        Assertions.assertTrue(childrenModels.isEmpty(),
            "getChildrenModels should return empty map when fragmentContainer is null and request is null");
    }
}
