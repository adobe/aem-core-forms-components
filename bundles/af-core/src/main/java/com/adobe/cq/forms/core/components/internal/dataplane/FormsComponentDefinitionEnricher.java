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
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.osgi.service.component.annotations.Component;

import com.adobe.aem.wcm.dataplane.schema.spi.ComponentDefinition;
import com.adobe.aem.wcm.dataplane.schema.spi.ComponentDefinitionEnricher;
import com.adobe.aem.wcm.dataplane.schema.spi.ComponentDefinitionEnrichmentContext;
import com.adobe.aem.wcm.dataplane.schema.spi.Option;
import com.adobe.aemds.guide.model.FormMetaData;
import com.day.cq.wcm.foundation.forms.FormsManager;

@Component(service = ComponentDefinitionEnricher.class)
public class FormsComponentDefinitionEnricher implements ComponentDefinitionEnricher {

    private static final String GUIDE_CONTAINER_V1 = "core/fd/components/form/container/v1/container";
    private static final String GUIDE_CONTAINER_V2 = "core/fd/components/form/container/v2/container";
    private static final String GUIDE_CONTAINER_EDS = "fd/franklin/components/form/v1/form";
    private static final String ACTION_TYPE_FIELD = "./actionType";
    private static final String PREFILL_SERVICE_FIELD = "./prefillService";
    private static final String DATASOURCE_NODE = "datasource";
    private static final String GUIDE_DATA_MODEL = "guideDataModel";
    private static final String NONE_OPTION_LABEL = "None";

    @Override
    public void enrich(ComponentDefinitionEnrichmentContext context) {
        FormMetaData formMetaData = context.getResourceResolver().adaptTo(FormMetaData.class);
        if (formMetaData == null) {
            return;
        }

        Map<String, ComponentDefinition> componentDefinitions = context.getComponentDefinitions();
        componentDefinitions.entrySet().stream()
            .filter(entry -> isGuideContainerComponent(entry.getValue()))
            .map(Map.Entry::getKey)
            .collect(Collectors.toList())
            .forEach(componentType -> enrichContainer(componentType, componentDefinitions, context, formMetaData));
    }

    private void enrichContainer(
        String componentType,
        Map<String, ComponentDefinition> componentDefinitions,
        ComponentDefinitionEnrichmentContext context,
        FormMetaData formMetaData) {
        ComponentDefinition containerDefinition = componentDefinitions.get(componentType);
        if (containerDefinition == null || containerDefinition.getFields() == null) {
            return;
        }

        setDynamicOptions(
            containerDefinition,
            ACTION_TYPE_FIELD,
            collectSubmitActionOptions(formMetaData, componentType, context, componentDefinitions));
        setDynamicOptions(
            containerDefinition,
            PREFILL_SERVICE_FIELD,
            collectPrefillServiceOptions(formMetaData, context, componentDefinitions));
    }

    private List<Option> collectSubmitActionOptions(
        FormMetaData formMetaData,
        String componentType,
        ComponentDefinitionEnrichmentContext context,
        Map<String, ComponentDefinition> componentDefinitions) {
        String guideDataModel = resolveDatasourceProperty(componentType, ACTION_TYPE_FIELD, GUIDE_DATA_MODEL,
            context.getResourceResolver());
        Set<String> uniqueResourceTypes = new HashSet<>();
        List<Option> options = new ArrayList<>();
        Iterator<FormsManager.ComponentDescription> iterator = formMetaData.getSubmitActions();

        while (iterator != null && iterator.hasNext()) {
            FormsManager.ComponentDescription description = iterator.next();
            if (description == null || !uniqueResourceTypes.add(description.getResourceType())) {
                continue;
            }

            Resource actionResource = findComponentResource(description.getResourceType(),
                context.getResourceResolver());
            if (!matchesGuideDataModel(actionResource, guideDataModel)) {
                continue;
            }

            options.add(option(resolveOptionLabel(description), description.getResourceType()));
            addRuntimeDefinition(description.getResourceType(), componentDefinitions, context);
        }
        return options;
    }

    private List<Option> collectPrefillServiceOptions(
        FormMetaData formMetaData,
        ComponentDefinitionEnrichmentContext context,
        Map<String, ComponentDefinition> componentDefinitions) {
        List<Option> options = new ArrayList<>();
        options.add(option(NONE_OPTION_LABEL, ""));

        Iterator<FormsManager.ComponentDescription> iterator = formMetaData.getPrefillActions();
        while (iterator != null && iterator.hasNext()) {
            FormsManager.ComponentDescription description = iterator.next();
            if (description == null) {
                continue;
            }

            options.add(option(resolveOptionLabel(description), description.getResourceType()));
            addRuntimeDefinition(description.getResourceType(), componentDefinitions, context);
        }
        return options;
    }

    private void addRuntimeDefinition(
        String componentType,
        Map<String, ComponentDefinition> componentDefinitions,
        ComponentDefinitionEnrichmentContext context) {
        if (componentType == null || componentType.isEmpty() || componentDefinitions.containsKey(componentType)) {
            return;
        }

        ComponentDefinition schema = context.resolveComponentDialog(componentType);
        if (schema != null) {
            componentDefinitions.put(componentType, schema);
        }
    }

    private void setDynamicOptions(
        ComponentDefinition schema,
        String fieldName,
        List<Option> options) {
        if (schema.getFields() == null || options == null || options.isEmpty()) {
            return;
        }

        schema.getFields().stream()
            .filter(field -> fieldName.equals(field.getName()))
            .findFirst()
            .ifPresent(field -> field.setOptions(options));
    }

    private boolean isGuideContainerComponent(ComponentDefinition definition) {
        if (definition == null) {
            return false;
        }
        return isGuideContainerType(definition.getComponentType())
            || isGuideContainerType(definition.getComponentSuperType());
    }

    private boolean isGuideContainerType(String componentType) {
        if (componentType == null || componentType.isEmpty()) {
            return false;
        }
        String normalizedComponentType = normalizeComponentType(componentType);
        // TODO: Support EDS form container enrichment for
        // fd/franklin/components/form/v1/form
        // once AEM_EDGE content definition exposes compatible runtime-backed form
        // properties.
        return GUIDE_CONTAINER_V1.equals(normalizedComponentType) || GUIDE_CONTAINER_V2.equals(normalizedComponentType);
    }

    private boolean matchesGuideDataModel(Resource actionResource, String guideDataModel) {
        if (guideDataModel == null || guideDataModel.isEmpty()) {
            return true;
        }
        if (actionResource == null) {
            return false;
        }
        String supportedModels = actionResource.getValueMap().get(GUIDE_DATA_MODEL, "");
        return supportedModels.toLowerCase().contains(guideDataModel.toLowerCase());
    }

    private String resolveDatasourceProperty(
        String componentType,
        String fieldName,
        String propertyName,
        ResourceResolver resourceResolver) {
        Resource componentResource = resolveComponentResource(componentType, resourceResolver);
        if (componentResource == null) {
            return "";
        }

        Resource dialogResource = componentResource.getChild("_cq_dialog");
        if (dialogResource == null) {
            return "";
        }

        Resource fieldResource = findFieldResource(dialogResource, fieldName);
        if (fieldResource == null) {
            return "";
        }

        Resource datasource = fieldResource.getChild(DATASOURCE_NODE);
        if (datasource == null) {
            return "";
        }

        return datasource.getValueMap().get(propertyName, "");
    }

    private Resource resolveComponentResource(String componentType, ResourceResolver resourceResolver) {
        if (componentType == null || componentType.isEmpty()) {
            return null;
        }

        String normalizedComponentType = normalizeComponentType(componentType);
        Resource mergedComponentResource = resourceResolver.getResource("/mnt/override/" + normalizedComponentType);
        if (mergedComponentResource != null) {
            return mergedComponentResource;
        }

        return findComponentResource(componentType, resourceResolver);
    }

    private Resource findComponentResource(String componentType, ResourceResolver resourceResolver) {
        if (componentType == null || componentType.isEmpty()) {
            return null;
        }
        if (componentType.startsWith("/apps/") || componentType.startsWith("/libs/")) {
            return resourceResolver.getResource(componentType);
        }

        Resource appResource = resourceResolver.getResource("/apps/" + componentType);
        if (appResource != null) {
            return appResource;
        }
        return resourceResolver.getResource("/libs/" + componentType);
    }

    private Resource findFieldResource(Resource resource, String fieldName) {
        ValueMap properties = resource.getValueMap();
        if (fieldName.equals(properties.get("name", ""))) {
            return resource;
        }

        for (Resource child : resource.getChildren()) {
            Resource match = findFieldResource(child, fieldName);
            if (match != null) {
                return match;
            }
        }
        return null;
    }

    private String normalizeComponentType(String componentType) {
        return componentType.startsWith("/") ? componentType.substring(1) : componentType;
    }

    private String resolveOptionLabel(FormsManager.ComponentDescription description) {
        String title = description.getTitle();
        return title == null || title.isEmpty() ? description.getResourceType() : title;
    }

    private Option option(String name, String value) {
        return new Option(name, value);
    }
}
