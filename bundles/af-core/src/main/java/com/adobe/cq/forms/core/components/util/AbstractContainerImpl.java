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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.annotation.Nonnull;
import javax.annotation.PostConstruct;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.factory.ModelFactory;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.components.models.form.Base;
import com.adobe.cq.forms.core.components.models.form.Container;
import com.adobe.cq.forms.core.components.models.form.ContainerConstraint;
import com.day.cq.wcm.foundation.model.export.AllowedComponentsExporter;
import com.day.cq.wcm.foundation.model.responsivegrid.ResponsiveGrid;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Abstract class which can be used as base class for {@link Container} implementations.
 */
public abstract class AbstractContainerImpl extends AbstractBaseImpl implements Container, ContainerConstraint {

    @OSGiService
    private SlingModelFilter slingModelFilter;

    @OSGiService
    private ModelFactory modelFactory;

    @SlingObject
    protected Resource resource;

    protected List<? extends ComponentExporter> childrenModels;

    protected Map<String, ? extends ComponentExporter> itemModels;

    protected List<Resource> filteredChildComponents;

    /**
     * The name of the child resources in the order they are to be exported.
     */
    private String[] exportedItemsOrder;

    @Nullable
    protected ResponsiveGrid resGrid = null;

    @Override
    public Boolean isRepeatable() {
        return repeatable;
    }

    @Override
    public Integer getMinOccur() {
        return minOccur;
    }

    @Override
    public Integer getMaxOccur() {
        return maxOccur;
    }

    @Override
    public Integer getMinItems() {
        return minItems;
    }

    @Override
    public Integer getMaxItems() {
        return maxItems;
    }

    @PostConstruct
    protected void initBaseModel() {
        super.initBaseModel();
        // initialize responsive grid for all containers, this is used in SPA editor
        // added composition check, since we don't have special container for responsive grid
        if (request != null && resource.isResourceType("wcm/foundation/components/responsivegrid")) {
            resGrid = request.adaptTo(ResponsiveGrid.class);
        }
    }

    @Override
    public List<? extends ComponentExporter> getItems() {
        if (childrenModels == null) {
            childrenModels = new ArrayList<>(getChildrenModels(request, ComponentExporter.class).values());
        }
        return childrenModels;
    }

    @NotNull
    @Override
    public String[] getExportedItemsOrder() {
        if (exportedItemsOrder == null) {
            Map<String, ? extends ComponentExporter> models = getExportedItems();
            if (!models.isEmpty()) {
                exportedItemsOrder = models.keySet().toArray(ArrayUtils.EMPTY_STRING_ARRAY);
            } else {
                exportedItemsOrder = ArrayUtils.EMPTY_STRING_ARRAY;
            }
        }
        return Arrays.copyOf(exportedItemsOrder, exportedItemsOrder.length);
    }

    protected <T> Map<String, T> getChildrenModels(@Nullable SlingHttpServletRequest request, @NotNull Class<T> modelClass) {
        List<Resource> filteredChildrenResources = getFilteredChildrenResources();
        return getChildrenModels(request, modelClass, filteredChildrenResources);
    }

    protected <T> Map<String, T> getChildrenModels(@Nullable SlingHttpServletRequest request, @NotNull Class<T> modelClass,
        List<Resource> filteredChildrenResources) {
        Map<String, T> models = new LinkedHashMap<>();
        for (Resource child : filteredChildrenResources) {
            T model = null;
            if (request != null) {
                // todo: if possible set i18n form parent to child here, this would optimize the first form rendering
                model = modelFactory.getModelFromWrappedRequest(request, child, modelClass);
            } else {
                model = child.adaptTo(modelClass);
                if (model instanceof Base && i18n != null) {
                    ((Base) model).setI18n(i18n);
                }
            }
            if (model != null) {
                models.put(child.getName(), model);
            }
        }
        return models;
    }

    @Override
    public @NotNull Map<String, ? extends ComponentExporter> getExportedItems() {
        if (itemModels == null) {
            itemModels = getChildrenModels(request, ComponentExporter.class);
        }
        return itemModels;
    }

    protected List<Resource> getFilteredChildrenResources() {
        return getFilteredChildrenResources(resource);
    }

    protected List<Resource> getFilteredChildrenResources(Resource containerResource) {
        if (filteredChildComponents == null) {
            filteredChildComponents = new LinkedList<>();
            if (containerResource != null) {
                for (Resource child : slingModelFilter.filterChildResources(containerResource.getChildren())) {
                    if (!child.getName().startsWith("fd:")) {
                        filteredChildComponents.add(child);
                    }
                }
            }
        }
        return filteredChildComponents;
    }

    @Nullable
    @Override
    public String getGridClassNames() {
        if (resGrid != null) {
            return resGrid.getGridClassNames();
        }
        return null;
    }

    @Nonnull
    @Override
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public Map<String, String> getColumnClassNames() {
        if (resGrid != null) {
            return resGrid.getColumnClassNames();
        }
        return Collections.emptyMap();
    }

    @Override
    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    public int getColumnCount() {
        if (resGrid != null) {
            return resGrid.getColumnCount();
        }
        return 0;
    }

    @Override
    public AllowedComponentsExporter getExportedAllowedComponents() {
        if (resGrid != null) {
            return resGrid.getExportedAllowedComponents();
        }
        return null;
    }
}
