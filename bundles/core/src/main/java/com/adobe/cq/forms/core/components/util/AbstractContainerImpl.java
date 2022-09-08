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
import java.util.List;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.factory.ModelFactory;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.SlingModelFilter;
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

    //
    // @Self
    // protected LinkManager linkManager;

    private List<? extends ComponentExporter> childrenModels;

    @Override
    public Integer getMinItems() {
        return minItems;
    }

    @Override
    public Integer getMaxItems() {
        return maxItems;
    }
    //
    // /**
    // * The list of child items.
    // */
    // protected List<ListItem> items;
    // protected List<Resource> childComponents;
    //
    // @NotNull
    // protected abstract List<? extends ListItem> readItems();
    //
    // @NotNull
    // protected Resource getEffectiveResource() {
    // if (this.resource instanceof TemplatedResource) {
    // return this.resource;
    // }
    // return Optional.ofNullable((Resource)this.resource.adaptTo(TemplatedResource.class))
    // .orElse(Optional.ofNullable((Resource)this.request.adaptTo(TemplatedResource.class))
    // .orElse(this.resource));
    // }
    //
    // @NotNull
    // protected List<Resource> getChildren() {
    // if (childComponents == null) {
    // Resource effectiveResource = this.getEffectiveResource();
    // childComponents = Optional.ofNullable(request.getResourceResolver().adaptTo(ComponentManager.class))
    // .map(componentManager ->
    // StreamSupport.stream(effectiveResource.getChildren().spliterator(), false)
    // .filter(res -> Objects.nonNull(componentManager.getComponentOfResource(res))))
    // .orElseGet(Stream::empty)
    // .collect(Collectors.toList());
    // }
    // return childComponents;
    // }
    //
    // @JsonIgnore
    // @NotNull
    // public List<ListItem> getItems2() {
    // if (items == null) {
    // items = readItems().stream().map(i -> (ListItem) i).collect(Collectors.toList());
    // }
    // return items;
    // }

    @Override
    public List<? extends ComponentExporter> getItems() {
        if (childrenModels == null) {
            childrenModels = getChildrenModels(request, ComponentExporter.class);
        }
        return childrenModels;
    }

    protected <T> List<T> getChildrenModels(@Nullable SlingHttpServletRequest request, @NotNull Class<T> modelClass) {
        List<T> models = new ArrayList<>();

        for (Resource child : slingModelFilter.filterChildResources(resource.getChildren())) {
            if (!child.getName().startsWith("fd:")) {
                T model = null;
                if (request != null) {
                    model = modelFactory.getModelFromWrappedRequest(request, child, modelClass);
                } else {
                    model = child.adaptTo(modelClass);
                }
                if (model != null) {
                    models.add(model);
                }
            }
        }
        return models;
    }
}
