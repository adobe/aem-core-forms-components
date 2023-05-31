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

import com.adobe.aemds.guide.utils.GuideWCMUtils;
import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.components.models.form.Base;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Fragment;
import com.adobe.cq.forms.core.components.util.AbstractContainerImpl;
import org.apache.sling.models.factory.ModelFactory;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.*;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Fragment.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_FRAGMENT_V1 })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class FragmentImpl extends AbstractContainerImpl implements Fragment {

    @OSGiService
    private SlingModelFilter slingModelFilter;

    @OSGiService
    private ModelFactory modelFactory;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    private String fragRef;

    @Override
    public String getFragRef() {
        return fragRef;
    }

    @Override
    protected <T> Map<String, T> getChildrenModels(@Nullable SlingHttpServletRequest request, @NotNull Class<T> modelClass) {
        Map<String, T> models = new LinkedHashMap<>();
        ResourceResolver resourceResolver = resource.getResourceResolver();
        // if dam node is given then convert to page path
        Resource fragmentContainerResource = resourceResolver.getResource(fragRef);
        if(GuideWCMUtils.isForms(fragRef)) {
            fragmentContainerResource  = resourceResolver.getResource(JcrConstants.JCR_CONTENT + "/guideContainer");
        }
        List<Resource> filteredChildrenResources = new ArrayList<>();
        if(fragmentContainerResource != null) {
            filteredChildrenResources = getFilteredChildrenResources(fragmentContainerResource);
        }

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



    private List<Resource> getFilteredChildrenResources(Resource fragResource) {
        if (filteredChildComponents == null) {
            filteredChildComponents = new LinkedList<>();
            for (Resource child : slingModelFilter.filterChildResources(fragResource.getChildren())) {
                if (!child.getName().startsWith("fd:")) {
                    filteredChildComponents.add(child);
                }
            }
        }
        return filteredChildComponents;
    }
}
