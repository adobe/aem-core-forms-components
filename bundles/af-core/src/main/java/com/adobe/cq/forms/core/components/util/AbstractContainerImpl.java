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
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

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

    private List<? extends ComponentExporter> childrenModels;

    protected Map<String, ? extends ComponentExporter> itemModels;

    protected List<Resource> filteredChildComponents;

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

    @Override
    public List<? extends ComponentExporter> getItems() {
        if (childrenModels == null) {
            childrenModels = getChildrenModels(request, ComponentExporter.class);
        }
        return childrenModels;
    }

    protected <T> List<T> getChildrenModels(@Nullable SlingHttpServletRequest request, @NotNull Class<T> modelClass) {
        List<T> models = new ArrayList<>();
        List<Resource> filteredChildrenResources = getFilteredChildrenResources();
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
                models.add(model);
            }
        }
        return models;
    }

    @Override
    public @NotNull Map<String, ? extends ComponentExporter> getExportedItems() {
        if (itemModels == null) {
            itemModels = getItemModels(request, ComponentExporter.class);
        }
        return itemModels;
    }

    private List<Resource> getFilteredChildrenResources() {
        if (filteredChildComponents == null) {
            filteredChildComponents = new LinkedList<>();
            for (Resource child : slingModelFilter.filterChildResources(resource.getChildren())) {
                if (!child.getName().startsWith("fd:")) {
                    filteredChildComponents.add(child);
                }
            }
        }
        return filteredChildComponents;
    }

    protected Map<String, ComponentExporter> getItemModels(@NotNull final SlingHttpServletRequest request,
        @NotNull final Class<ComponentExporter> modelClass) {
        Map<String, ComponentExporter> models = new LinkedHashMap<>();
        getFilteredChildrenResources().forEach(child -> {
            ComponentExporter model = modelFactory.getModelFromWrappedRequest(request, child, modelClass);
            if (model != null) {
                models.put(child.getPath(), model);
            }
        });
        return models;
    }
}
