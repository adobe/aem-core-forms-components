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
package com.adobe.cq.forms.core.components.internal.models.v1.form;

import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.components.models.form.Base;
import com.adobe.cq.forms.core.components.models.form.Container;
import com.adobe.cq.forms.core.components.models.form.ContainerConstraint;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.factory.ModelFactory;
import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.List;


/**
 * Abstract class which can be used as base class for {@link Container} implementations.
 */
public abstract class AbstractContainerImpl extends AbstractBaseImpl implements Base, Container, ContainerConstraint {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(intValues = 0)
    protected int minItems;


    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(intValues = -1)
    protected int maxItems;

    @OSGiService
    private SlingModelFilter slingModelFilter;

    @OSGiService
    private ModelFactory modelFactory;


    @SlingObject
    private Resource resource;


    @Override
    public int getMinItems() {
        return minItems;
    }

    @Override
    public int getMaxItems() {
        return maxItems;
    }

    protected <T> List<T> getChildrenModels(@NotNull SlingHttpServletRequest request, @NotNull Class<T>
            modelClass) {
        List<T> models = new ArrayList<>();
        for (Resource child : slingModelFilter.filterChildResources(resource.getChildren())) {
            T model = modelFactory.getModelFromWrappedRequest(request, child, modelClass);
            if (model != null) {
                models.add(model);
            }
        }
        return models;
    }
}
