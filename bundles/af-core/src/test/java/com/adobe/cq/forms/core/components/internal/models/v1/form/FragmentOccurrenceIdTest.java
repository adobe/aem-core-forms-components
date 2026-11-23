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

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.scripting.SlingBindings;
import org.apache.sling.models.factory.ModelFactory;
import org.apache.sling.testing.mock.sling.servlet.MockSlingHttpServletRequest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.Utils;
import com.adobe.cq.forms.core.components.internal.form.FeatureToggleConstants;
import com.adobe.cq.forms.core.components.internal.form.FragmentOccurrence;
import com.adobe.cq.forms.core.components.models.form.Container;
import com.adobe.cq.forms.core.components.models.form.FormComponent;
import com.adobe.cq.forms.core.components.models.form.FormContainer;
import com.adobe.cq.forms.core.components.models.form.Fragment;
import com.adobe.cq.forms.core.components.models.form.Panel;
import com.adobe.cq.forms.core.components.models.form.TextInput;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.adobe.cq.forms.core.components.views.Views;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.wcm.api.components.ComponentContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Tests the ids of the components of fragments referenced several times, directly and through other fragments.
 * The same component occurrence must have the same id in HTML rendering and in every JSON export, and different
 * occurrences of the same component must have different ids.
 */
@ExtendWith(AemContextExtension.class)
public class FragmentOccurrenceIdTest {

    private static final String BASE = "/form/fragment-occurrence";
    private static final String CONTENT_ROOT = "/content";

    private static final String FORM_PAGE = "/content/forms/af/demaurya/duplicate-id";
    private static final String FORM = FORM_PAGE + "/jcr:content/guideContainer";
    private static final String ROOT_FIELD = FORM + "/rootfield";
    private static final String OUTER_1 = FORM + "/fragment";
    private static final String OUTER_2 = FORM + "/fragment_2";
    private static final String PANEL = "/content/forms/af/demaurya/fragments/fragment-a/jcr:content/guideContainer/panelcontainer";
    private static final String INNER_1 = PANEL + "/fragment";
    private static final String INNER_2 = PANEL + "/fragment_682876963";
    private static final String SSN = "/content/forms/af/demaurya/fragments/fragment-b/jcr:content/guideContainer/textinput";
    private static final String AUTHORED = "/content/forms/af/demaurya/fragments/fragment-b/jcr:content/guideContainer/authoredid";

    private static final String PRINT_FORM = "/content/forms/af/demaurya/print-form/jcr:content/guideContainer";
    private static final String PRINT_FIELD = "/content/forms/af/demaurya/fragments/fragment-c/jcr:content/guideContainer/printpanel/printfield";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
        context.registerService(SlingModelFilter.class, new SlingModelFilter() {

            @Override
            public Map<String, Object> filterProperties(Map<String, Object> map) {
                return map;
            }

            @Override
            public Iterable<Resource> filterChildResources(Iterable<Resource> childResources) {
                return StreamSupport.stream(childResources.spliterator(), false).collect(Collectors.toList());
            }
        });
    }

    @AfterEach
    void tearDown() {
        System.clearProperty(FeatureToggleConstants.FT_LEGACY_COMPONENT_ID);
        System.clearProperty(FeatureToggleConstants.FT_SKIP_ITEMS_MAP);
    }

    private static String id(String prefix, String... paths) {
        return prefix + "-" + DigestUtils.sha256Hex(String.join("", paths)).substring(0, 10);
    }

    @Test
    void testCustomerNestedFragmentIds() {
        List<String[]> ssn = ssnOccurrences(collect(requestForm()));
        assertEquals(4, ssn.size());
        // ids reported for the customer form: they include the outer and the inner fragment placeholders
        assertEquals("textinput-a3a8daa687", ssn.get(0)[1]);
        assertEquals("textinput-5761b98163", ssn.get(1)[1]);
        assertEquals(id("textinput", OUTER_1, INNER_1, SSN), ssn.get(0)[1]);
        assertEquals(id("textinput", OUTER_1, INNER_2, SSN), ssn.get(1)[1]);
        assertEquals(id("textinput", OUTER_2, INNER_1, SSN), ssn.get(2)[1]);
        assertEquals(id("textinput", OUTER_2, INNER_2, SSN), ssn.get(3)[1]);
        Set<String> uniqueIds = ssn.stream().map(o -> o[1]).collect(Collectors.toSet());
        assertEquals(4, uniqueIds.size(), "every occurrence of the shared field must have its own id");
        for (String[] occurrence : ssn) {
            assertEquals(SSN, occurrence[0], "fd:path must stay the physical path of the shared field");
        }
    }

    @Test
    void testFragmentPlaceholderAndRootIds() {
        List<String[]> occurrences = collect(requestForm());
        assertEquals(id("textinput", ROOT_FIELD), find(occurrences, ROOT_FIELD, 0)[1],
            "components outside of fragments keep an id based on their path only");
        assertEquals(id("fragment", OUTER_1), find(occurrences, OUTER_1, 0)[1]);
        assertEquals(id("panelcontainer", OUTER_1, PANEL), find(occurrences, PANEL, 0)[1]);
        assertEquals(id("panelcontainer", OUTER_2, PANEL), find(occurrences, PANEL, 1)[1]);
        assertEquals(id("fragment", OUTER_1, INNER_1), find(occurrences, INNER_1, 0)[1]);
        assertEquals(id("fragment", OUTER_1, INNER_2), find(occurrences, INNER_2, 0)[1]);
        assertEquals(id("fragment", OUTER_2, INNER_1), find(occurrences, INNER_1, 1)[1]);
        assertEquals(ComponentUtils.getEncodedPath(FORM_PAGE), requestForm().getId(), "the form id is not changed");
        Set<String> ids = new HashSet<>();
        for (String[] occurrence : occurrences) {
            if (!AUTHORED.equals(occurrence[0])) {
                assertTrue(ids.add(occurrence[1]), "duplicate id " + occurrence[1] + " for " + occurrence[0]);
            }
        }
    }

    @Test
    void testSameIdsWithAndWithoutRequest() {
        List<String[]> withRequest = collect(requestForm());
        FormContainer resourceForm = context.resourceResolver().getResource(FORM).adaptTo(FormContainer.class);
        assertNotNull(resourceForm);
        assertSameOccurrences(withRequest, collect(resourceForm));
    }

    @Test
    void testSameIdsInJsonExports() throws Exception {
        List<String[]> expected = collect(requestForm());
        FormContainer resourceForm = context.resourceResolver().getResource(FORM).adaptTo(FormContainer.class);
        // Publish view is used by the runtime and the REST API, Author view by the document of record
        assertSameOccurrences(expected, collectJson(Utils.getJson(requestForm(), Views.Publish.class)));
        assertSameOccurrences(expected, collectJson(Utils.getJson(resourceForm, Views.Publish.class)));
        assertSameOccurrences(expected, collectJson(Utils.getJson(resourceForm, Views.Author.class)));
    }

    @Test
    void testSameIdsInItemsArrayExport() throws Exception {
        List<String[]> expected = collect(requestForm());
        System.setProperty(FeatureToggleConstants.FT_SKIP_ITEMS_MAP, "true");
        FormContainer resourceForm = context.resourceResolver().getResource(FORM).adaptTo(FormContainer.class);
        String json = toString(Utils.getJson(resourceForm, Views.Publish.class));
        assertFalse(json.contains(":items"));
        assertSameOccurrences(expected, collectJson(toStream(json)));
    }

    @Test
    void testIdsDoNotDependOnPageAndComponentContext() {
        List<String[]> expected = collect(requestForm());

        MockSlingHttpServletRequest withoutBindings = newRequest();
        withoutBindings.setAttribute(SlingBindings.class.getName(), null);
        assertSameOccurrences(expected, collect(withoutBindings.adaptTo(FormContainer.class)));

        MockSlingHttpServletRequest withBindings = newRequest();
        SlingBindings bindings = new SlingBindings();
        bindings.put("currentPage", context.pageManager().getPage(FORM_PAGE));
        ComponentContext componentContext = Mockito.mock(ComponentContext.class);
        Mockito.when(componentContext.getResource()).thenReturn(context.resourceResolver().getResource(FORM));
        bindings.put("componentContext", componentContext);
        bindings.put(SlingBindings.RESOURCE, context.resourceResolver().getResource(FORM));
        withBindings.setAttribute(SlingBindings.class.getName(), bindings);
        assertSameOccurrences(expected, collect(withBindings.adaptTo(FormContainer.class)));
    }

    @Test
    void testIdsDoNotDependOnGetterOrder() {
        FormContainer form = requestForm();
        // the exported items map and the items list are computed separately
        List<String[]> fromExportedItems = new ArrayList<>();
        collect(new ArrayList<>(form.getExportedItems().values()), fromExportedItems);
        assertSameOccurrences(collect(form), fromExportedItems);
        assertSameOccurrences(fromExportedItems, collect(requestForm()));
    }

    @Test
    void testHtmlRenderingIdsMatchJsonIds() {
        List<String[]> json = collect(requestForm());
        ModelFactory modelFactory = context.getService(ModelFactory.class);
        MockSlingHttpServletRequest request = newRequest();
        String attribute = FragmentOccurrence.REQ_ATTR_OCCURRENCE_PATH;

        // fragment.html of the outer placeholder
        FragmentImpl outer = (FragmentImpl) modelFactory.getModelFromWrappedRequest(request, resource(OUTER_1), Fragment.class);
        assertEquals(find(json, OUTER_1, 0)[1], outer.getId());
        Map<String, Object> outerAttributes = outer.getIncludeRequestAttributes();
        assertEquals(OUTER_1, outerAttributes.get(attribute));

        // data-sly-resource of the fragment content with requestAttributes, the panel is rendered inside the include
        request.setAttribute(attribute, outerAttributes.get(attribute));
        Panel panel = modelFactory.getModelFromWrappedRequest(request, resource(PANEL), Panel.class);
        assertEquals(find(json, PANEL, 0)[1], panel.getId());
        FragmentImpl inner = (FragmentImpl) modelFactory.getModelFromWrappedRequest(request, resource(INNER_2), Fragment.class);
        assertEquals(find(json, INNER_2, 0)[1], inner.getId());

        // nested include of the inner fragment content
        request.setAttribute(attribute, inner.getIncludeRequestAttributes().get(attribute));
        TextInput ssn = modelFactory.getModelFromWrappedRequest(request, resource(SSN), TextInput.class);
        // the attribute is reset when the include ends, the id was captured when the model was created
        request.removeAttribute(attribute);
        assertEquals("textinput-5761b98163", ssn.getId());
        assertEquals(find(json, SSN, 1)[1], ssn.getId());
        assertEquals(SSN, ssn.getProperties().get("fd:path"));
    }

    @Test
    void testFragmentOutsideOfIncludeHasNoIncludeAttributesFromParent() {
        ModelFactory modelFactory = context.getService(ModelFactory.class);
        FragmentImpl inner = (FragmentImpl) modelFactory.getModelFromWrappedRequest(newRequest(), resource(INNER_1), Fragment.class);
        // a fragment previewed on its own (no enclosing placeholder) only adds its own path
        assertEquals(INNER_1, inner.getIncludeRequestAttributes().get(FragmentOccurrence.REQ_ATTR_OCCURRENCE_PATH));
        assertEquals(id("fragment", INNER_1), inner.getId());
    }

    @Test
    void testAuthoredIdIsKept() {
        List<String[]> occurrences = collect(requestForm());
        List<String[]> authored = occurrences.stream().filter(o -> AUTHORED.equals(o[0])).collect(Collectors.toList());
        assertEquals(4, authored.size());
        for (String[] occurrence : authored) {
            assertEquals("my-authored-id", occurrence[1]);
        }
    }

    @Test
    void testPrintChannelChildrenKeepOccurrence() {
        FormContainer resourceForm = context.resourceResolver().getResource(PRINT_FORM).adaptTo(FormContainer.class);
        List<String[]> occurrences = collect(resourceForm);
        assertEquals(id("textinput", PRINT_FORM + "/fragment", PRINT_FIELD), find(occurrences, PRINT_FIELD, 0)[1]);
        assertSameOccurrences(occurrences, collect(context.resourceResolver().getResource(PRINT_FORM).adaptTo(FormContainer.class)));
    }

    @Test
    void testLegacyToggleRestoresPreviousIds() {
        System.setProperty(FeatureToggleConstants.FT_LEGACY_COMPONENT_ID, "true");
        List<String[]> ssn = ssnOccurrences(collect(requestForm()));
        assertEquals(4, ssn.size());
        // previous behavior: the inner fragment placeholders are not part of the id
        assertEquals(ssn.get(0)[1], ssn.get(1)[1]);
        FragmentImpl outer = (FragmentImpl) context.getService(ModelFactory.class)
            .getModelFromWrappedRequest(newRequest(), resource(OUTER_1), Fragment.class);
        assertTrue(outer.getIncludeRequestAttributes().isEmpty());
    }

    @Test
    void testIdsAreStable() {
        List<String[]> first = collect(requestForm());
        List<String[]> second = collect(context.resourceResolver().getResource(FORM).adaptTo(FormContainer.class));
        assertSameOccurrences(first, second);
        assertNotEquals(find(first, SSN, 0)[1], find(first, SSN, 2)[1]);
    }

    private Resource resource(String path) {
        Resource resource = context.resourceResolver().getResource(path);
        assertNotNull(resource, path);
        return resource;
    }

    private MockSlingHttpServletRequest newRequest() {
        MockSlingHttpServletRequest request = new MockSlingHttpServletRequest(context.resourceResolver(), context.bundleContext());
        request.setResource(resource(FORM));
        return request;
    }

    private FormContainer requestForm() {
        FormContainer form = newRequest().adaptTo(FormContainer.class);
        assertNotNull(form);
        return form;
    }

    private static List<String[]> ssnOccurrences(List<String[]> occurrences) {
        return occurrences.stream().filter(o -> SSN.equals(o[0])).collect(Collectors.toList());
    }

    private static String[] find(List<String[]> occurrences, String path, int index) {
        List<String[]> matches = occurrences.stream().filter(o -> path.equals(o[0])).collect(Collectors.toList());
        assertTrue(matches.size() > index, "occurrence " + index + " of " + path + " not found");
        return matches.get(index);
    }

    private static void assertSameOccurrences(List<String[]> expected, List<String[]> actual) {
        assertEquals(toLines(expected), toLines(actual));
    }

    private static List<String> toLines(List<String[]> occurrences) {
        return occurrences.stream().map(o -> o[0] + "=" + o[1]).collect(Collectors.toList());
    }

    /** Returns the (fd:path, id) pairs of all the components of the form, in document order. */
    private static List<String[]> collect(FormContainer form) {
        assertNotNull(form);
        List<String[]> occurrences = new ArrayList<>();
        collect(form.getItems(), occurrences);
        return occurrences;
    }

    private static void collect(List<? extends ComponentExporter> items, List<String[]> occurrences) {
        for (ComponentExporter item : items) {
            if (item instanceof FormComponent) {
                FormComponent component = (FormComponent) item;
                occurrences.add(new String[] { Objects.toString(component.getProperties().get("fd:path")), component.getId() });
            }
            if (item instanceof Container) {
                collect(((Container) item).getItems(), occurrences);
            }
        }
    }

    private static List<String[]> collectJson(InputStream json) throws Exception {
        List<String[]> occurrences = new ArrayList<>();
        collectJson(new ObjectMapper().readTree(json), occurrences, true);
        return occurrences;
    }

    private static void collectJson(JsonNode node, List<String[]> occurrences, boolean root) {
        if (!root) {
            occurrences.add(new String[] { node.path("properties").path("fd:path").asText(), node.path("id").asText() });
        }
        if (node.has(":itemsOrder")) {
            for (JsonNode name : node.get(":itemsOrder")) {
                collectJson(node.get(":items").get(name.asText()), occurrences, false);
            }
        } else if (node.has("items")) {
            Iterator<JsonNode> children = node.get("items").elements();
            while (children.hasNext()) {
                collectJson(children.next(), occurrences, false);
            }
        }
    }

    private static String toString(InputStream inputStream) throws Exception {
        return org.apache.commons.io.IOUtils.toString(inputStream, StandardCharsets.UTF_8);
    }

    private static InputStream toStream(String value) {
        return org.apache.commons.io.IOUtils.toInputStream(value, StandardCharsets.UTF_8);
    }
}
