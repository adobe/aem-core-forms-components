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

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.FormClientLibManager;
import com.adobe.cq.forms.core.components.models.form.Fragment;
import com.adobe.cq.forms.core.components.models.form.TextInput;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.msm.api.MSMNameConstants;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@ExtendWith(AemContextExtension.class)
public class FragmentImplTest {

    private static final String BASE = "/form/fragment";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_FRAGMENT = CONTENT_ROOT + "/fragment";
    private static final String PATH_FRAGMENT_DAMPATH = CONTENT_ROOT + "/fragment-dampath";
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
}
