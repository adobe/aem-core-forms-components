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

import java.util.*;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.SlingHttpServletRequestWrapper;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.factory.ModelFactory;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.FormClientLibManager;
import com.adobe.cq.forms.core.components.models.form.FormContainer;
import com.adobe.cq.forms.core.components.models.form.Fragment;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Fragment.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_FRAGMENT_V1 })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class FragmentImpl extends PanelImpl implements Fragment {

    public static final String CUSTOM_FRAGMENT_PROPERTY_WRAPPER = "fd:fragment";

    @OSGiService
    private SlingModelFilter slingModelFilter;

    @OSGiService
    private ModelFactory modelFactory;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    private String fragmentPath;

    private Resource fragmentContainer;

    @PostConstruct
    private void initFragmentModel() {
        ResourceResolver resourceResolver = resource.getResourceResolver();
        fragmentContainer = ComponentUtils.getFragmentContainer(resourceResolver, fragmentPath);
        if (request != null) {
            FormClientLibManager formClientLibManager = request.adaptTo(FormClientLibManager.class);
            String clientLibRef = getClientLibForFragment();
            if (formClientLibManager != null && clientLibRef != null) {
                formClientLibManager.addClientLibRef(clientLibRef);
            }
        }
    }

    @JsonIgnore
    public String getFragmentPath() {
        return fragmentPath;
    }

    @Override
    public @NotNull Map<String, ? extends ComponentExporter> getExportedItems() {
        if (itemModels == null) {
            itemModels = getChildrenModels(request, ComponentExporter.class);
        }
        return itemModels;
    }

    protected <T> Map<String, T> getChildrenModels(@Nullable SlingHttpServletRequest request, @NotNull Class<T> modelClass) {
        List<Resource> filteredChildrenResources = getFilteredChildrenResources(fragmentContainer);
        SlingHttpServletRequest wrappedSlingHttpServletRequest = null;
        if (request != null) {
            wrappedSlingHttpServletRequest = new SlingHttpServletRequestWrapper(request) {

                @Override
                public Object getAttribute(String attrName) {
                    if (REQ_ATTR_RESOURCE_CALLER_PATH.equals(attrName)) {
                        String resourceCallerPath = (String) super.getAttribute(REQ_ATTR_RESOURCE_CALLER_PATH);
                        // If the attribute is already defined then we're in a nested situation.
                        // The code for computing the components id uses the root-most resource path
                        // (because of how componentContext is handled in HTML rendering, so we return
                        // that.
                        return (resourceCallerPath != null) ? resourceCallerPath : resource.getPath();
                    }
                    return super.getAttribute(attrName);
                }
            };
        }
        return getChildrenModels(wrappedSlingHttpServletRequest, modelClass, filteredChildrenResources);
    }

    @Override
    @JsonIgnore
    public List<Resource> getFragmentChildren() {
        if (filteredChildComponents == null) {
            filteredChildComponents = getFilteredChildrenResources(fragmentContainer);
        }
        return filteredChildComponents;
    }

    @JsonIgnore
    public String getFragmentTitle() {
        String fragmentTitle = "";
        if (fragmentContainer != null) {
            Resource jcrContentRes = fragmentContainer.getParent();
            if (jcrContentRes != null) {
                ValueMap vm = jcrContentRes.getValueMap();
                fragmentTitle = vm.get("jcr:title", StringUtils.EMPTY);
            }
        }
        return fragmentTitle;
    }

    @JsonIgnore
    public List<String> getTitleListOfChildren() {
        List<String> titleList = new ArrayList<>();
        if (filteredChildComponents == null) {
            filteredChildComponents = getFilteredChildrenResources(fragmentContainer);
        }
        for (Resource child : filteredChildComponents) {
            ValueMap vm = child.getValueMap();
            titleList.add(vm.get("jcr:title", StringUtils.EMPTY));
        }
        return titleList;
    }

    @Override
    public Map<String, Object> getProperties() {
        Map<String, Object> properties = super.getProperties();
        properties.put(CUSTOM_FRAGMENT_PROPERTY_WRAPPER, true);
        return properties;
    }

    private String getClientLibForFragment() {
        String clientLibRef = null;
        if (fragmentContainer != null) {
            FormContainer fragment = fragmentContainer.adaptTo(FormContainer.class);
            clientLibRef = fragment != null ? fragment.getClientLibRef() : null;
        }
        return clientLibRef;
    }
}
