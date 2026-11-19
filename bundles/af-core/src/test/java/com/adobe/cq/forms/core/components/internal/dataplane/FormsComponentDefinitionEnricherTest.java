package com.adobe.cq.forms.core.components.internal.dataplane;

import com.adobe.aem.wcm.dataplane.openapimodels.pages.PageContentDefinitionComponentDefinitionsInner;
import com.adobe.aem.wcm.dataplane.openapimodels.pages.PageContentDefinitionComponentDefinitionsInnerFieldsInner;
import com.adobe.aem.wcm.dataplane.schema.spi.ComponentDefinitionEnrichmentContext;
import com.adobe.aemds.guide.model.FormMetaData;
import com.day.cq.wcm.foundation.forms.FormsManager;
import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.apache.sling.api.resource.ResourceResolver;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@ExtendWith(AemContextExtension.class)
class FormsComponentDefinitionEnricherTest {

    private final AemContext context = new AemContext();

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
        context.create().resource("/mnt/override/core/fd/components/form/container/v2/container/_cq_dialog/content/items/prefill/datasource",
            "jcr:primaryType", "nt:unstructured");

        context.create().resource("/libs/fd/af/components/guidesubmittype/restendpoint",
            "jcr:primaryType", "cq:Component",
            "guideDataModel", "basic");

        FormMetaData formMetaData = Mockito.mock(FormMetaData.class);
        Mockito.when(formMetaData.getSubmitActions()).thenReturn(iterator(
            componentDescription("fd/af/components/guidesubmittype/restendpoint", "REST Endpoint")
        ));
        Mockito.when(formMetaData.getPrefillActions()).thenReturn(iterator(
            componentDescription("com/adobe/forms/prefill/demo", "Demo Prefill")
        ));
        context.registerAdapter(ResourceResolver.class, FormMetaData.class, formMetaData);

        Map<String, PageContentDefinitionComponentDefinitionsInner> componentDefinitions = new LinkedHashMap<>();
        componentDefinitions.put("core/fd/components/form/container/v2/container",
            schema("Container", "core/fd/components/form/container/v2/container", null,
                field("./actionType"), field("./prefillService")));

        ComponentDefinitionEnrichmentContext enrichmentContext = Mockito.mock(ComponentDefinitionEnrichmentContext.class);
        Mockito.when(enrichmentContext.getResourceResolver()).thenReturn(resourceResolver);
        Mockito.when(enrichmentContext.getComponentDefinitions()).thenReturn(componentDefinitions);
        Mockito.when(enrichmentContext.resolveComponentDialog("fd/af/components/guidesubmittype/restendpoint"))
            .thenReturn(schema("REST Endpoint", "fd/af/components/guidesubmittype/restendpoint", null, field("./restEndpointPostUrl")));
        Mockito.when(enrichmentContext.resolveComponentDialog("com/adobe/forms/prefill/demo"))
            .thenReturn(schema("Demo Prefill", "com/adobe/forms/prefill/demo", null, field("./serviceUrl")));

        new FormsComponentDefinitionEnricher().enrich(enrichmentContext);

        PageContentDefinitionComponentDefinitionsInner containerDefinition =
            componentDefinitions.get("core/fd/components/form/container/v2/container");
        assertNotNull(containerDefinition);

        PageContentDefinitionComponentDefinitionsInnerFieldsInner actionTypeField = fieldByName(containerDefinition, "./actionType");
        assertNotNull(actionTypeField);
        assertEquals(1, actionTypeField.getOptions().size());
        assertEquals("fd/af/components/guidesubmittype/restendpoint", actionTypeField.getOptions().get(0).getValue());

        PageContentDefinitionComponentDefinitionsInnerFieldsInner prefillField = fieldByName(containerDefinition, "./prefillService");
        assertNotNull(prefillField);
        assertEquals(2, prefillField.getOptions().size());
        assertEquals("", prefillField.getOptions().get(0).getValue());
        assertEquals("com/adobe/forms/prefill/demo", prefillField.getOptions().get(1).getValue());

        assertTrue(componentDefinitions.containsKey("fd/af/components/guidesubmittype/restendpoint"));
        assertTrue(componentDefinitions.containsKey("com/adobe/forms/prefill/demo"));
    }

    private PageContentDefinitionComponentDefinitionsInner schema(
        String title,
        String componentType,
        String componentSuperType,
        PageContentDefinitionComponentDefinitionsInnerFieldsInner... fields) {
        PageContentDefinitionComponentDefinitionsInner schema = new PageContentDefinitionComponentDefinitionsInner();
        schema.setTitle(title);
        schema.setComponentType(componentType);
        schema.setComponentSuperType(componentSuperType);
        schema.setFields(new ArrayList<>(List.of(fields)));
        return schema;
    }

    private PageContentDefinitionComponentDefinitionsInnerFieldsInner field(String name) {
        PageContentDefinitionComponentDefinitionsInnerFieldsInner field = new PageContentDefinitionComponentDefinitionsInnerFieldsInner();
        field.setName(name);
        return field;
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

    private PageContentDefinitionComponentDefinitionsInnerFieldsInner fieldByName(
        PageContentDefinitionComponentDefinitionsInner definition,
        String name) {
        return definition.getFields().stream()
            .filter(field -> name.equals(field.getName()))
            .findFirst()
            .orElse(null);
    }
}
