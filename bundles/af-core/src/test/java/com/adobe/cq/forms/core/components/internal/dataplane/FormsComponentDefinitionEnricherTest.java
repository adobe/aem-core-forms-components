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
package com.adobe.cq.forms.core.components.internal.dataplane;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import com.adobe.aem.wcm.dataplane.schema.spi.ComponentDefinition;
import com.adobe.aem.wcm.dataplane.schema.spi.ComponentDefinitionEnrichmentContext;
import com.adobe.aem.wcm.dataplane.schema.spi.Field;
import com.adobe.aem.wcm.dataplane.schema.spi.Option;
import com.adobe.aemds.guide.model.FormMetaData;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.day.cq.wcm.foundation.forms.FormsManager;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(AemContextExtension.class)
class FormsComponentDefinitionEnricherTest {

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @Test
    void testEnrich_AddsRuntimeOptionsAndDefinitions() {
        ResourceResolver resourceResolver = context.resourceResolver();
        context.create().resource("/mnt/override/core/fd/components/form/container/v2/container/_cq_dialog/content/items/action",
            "jcr:primaryType", "nt:unstructured",
            "name", "./actionType");
        context.create().resource("/mnt/override/core/fd/components/form/container/v2/container/_cq_dialog/content/items/action/datasource",
            "jcr:primaryType", "nt:unstructured",
            "guideDataModel", "basic");
        context.create().resource("/mnt/override/core/fd/components/form/container/v2/container/_cq_dialog/content/items/prefill",
            "jcr:primaryType", "nt:unstructured",
            "name", "./prefillService");
        context.create().resource(
            "/mnt/override/core/fd/components/form/container/v2/container/_cq_dialog/content/items/prefill/datasource",
            "jcr:primaryType", "nt:unstructured");

        context.create().resource("/libs/fd/af/components/guidesubmittype/restendpoint",
            "jcr:primaryType", "cq:Component",
            "guideDataModel", "basic");

        FormsManager.ComponentDescription submitAction = componentDescription("fd/af/components/guidesubmittype/restendpoint",
            "REST Endpoint");
        FormsManager.ComponentDescription prefillAction = componentDescription("com/adobe/forms/prefill/demo", "Demo Prefill");
        FormMetaData formMetaData = Mockito.mock(FormMetaData.class);
        Mockito.when(formMetaData.getSubmitActions()).thenReturn(iterator(submitAction));
        Mockito.when(formMetaData.getPrefillActions()).thenReturn(iterator(prefillAction));
        context.registerAdapter(ResourceResolver.class, FormMetaData.class, formMetaData);

        Map<String, ComponentDefinition> componentDefinitions = new LinkedHashMap<>();
        componentDefinitions.put("core/fd/components/form/container/v2/container",
            schema("core/fd/components/form/container/v2/container", null,
                field("./actionType"), field("./prefillService")));

        ComponentDefinitionEnrichmentContext enrichmentContext = Mockito.mock(ComponentDefinitionEnrichmentContext.class);
        Mockito.when(enrichmentContext.getResourceResolver()).thenReturn(resourceResolver);
        Mockito.when(enrichmentContext.getComponentDefinitions()).thenReturn(componentDefinitions);
        Mockito.when(enrichmentContext.resolveComponentDialog("fd/af/components/guidesubmittype/restendpoint"))
            .thenReturn(schema("fd/af/components/guidesubmittype/restendpoint", null, field("./restEndpointPostUrl")));
        Mockito.when(enrichmentContext.resolveComponentDialog("com/adobe/forms/prefill/demo"))
            .thenReturn(schema("com/adobe/forms/prefill/demo", null, field("./serviceUrl")));

        new FormsComponentDefinitionEnricher().enrich(enrichmentContext);

        ComponentDefinition containerDefinition = componentDefinitions.get("core/fd/components/form/container/v2/container");
        assertNotNull(containerDefinition);

        Field actionTypeField = fieldByName(containerDefinition, "./actionType");
        assertNotNull(actionTypeField);
        assertEquals(1, actionTypeField.getOptions().size());
        assertEquals("fd/af/components/guidesubmittype/restendpoint", actionTypeField.getOptions().get(0).getValue());

        Field prefillField = fieldByName(containerDefinition, "./prefillService");
        assertNotNull(prefillField);
        assertEquals(2, prefillField.getOptions().size());
        assertEquals("", prefillField.getOptions().get(0).getValue());
        assertEquals("com/adobe/forms/prefill/demo", prefillField.getOptions().get(1).getValue());

        assertTrue(componentDefinitions.containsKey("fd/af/components/guidesubmittype/restendpoint"));
        assertTrue(componentDefinitions.containsKey("com/adobe/forms/prefill/demo"));
    }

    private ComponentDefinition schema(String componentType, String componentSuperType, Field... fields) {
        return new FakeComponentDefinition(componentType, componentSuperType, new ArrayList<>(Arrays.asList(fields)));
    }

    private Field field(String name) {
        return new FakeField(name);
    }

    private FormsManager.ComponentDescription componentDescription(String resourceType, String title) {
        FormsManager.ComponentDescription description = Mockito.mock(FormsManager.ComponentDescription.class);
        Mockito.when(description.getResourceType()).thenReturn(resourceType);
        Mockito.when(description.getTitle()).thenReturn(title);
        return description;
    }

    @SafeVarargs
    private final <T> Iterator<T> iterator(T... values) {
        List<T> list = new ArrayList<>();
        for (T value : values) {
            list.add(value);
        }
        return list.iterator();
    }

    private Field fieldByName(ComponentDefinition definition, String name) {
        return definition.getFields().stream()
            .filter(field -> name.equals(field.getName()))
            .findFirst()
            .orElse(null);
    }

    private static final class FakeComponentDefinition implements ComponentDefinition {
        private final String componentType;
        private final String componentSuperType;
        private final List<Field> fields;

        FakeComponentDefinition(String componentType, String componentSuperType, List<Field> fields) {
            this.componentType = componentType;
            this.componentSuperType = componentSuperType;
            this.fields = fields;
        }

        @Override
        public String getComponentType() {
            return componentType;
        }

        @Override
        public String getComponentSuperType() {
            return componentSuperType;
        }

        @Override
        public List<Field> getFields() {
            return fields;
        }
    }

    private static final class FakeField implements Field {
        private final String name;
        private List<Option> options = new ArrayList<>();

        FakeField(String name) {
            this.name = name;
        }

        @Override
        public String getName() {
            return name;
        }

        @Override
        public List<Option> getOptions() {
            return options;
        }

        @Override
        public void setOptions(List<Option> options) {
            this.options = options;
        }
    }
}
