/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2021 Adobe
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

package com.adobe.cq.forms.core.components.internal.models.v1.formsportal;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceMetadata;
import org.apache.sling.api.resource.ResourceWrapper;
import org.apache.sling.api.resource.SyntheticResource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.via.ResourceSuperType;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.models.v1.AbstractComponentImpl;
import com.adobe.cq.forms.core.components.models.formsportal.PortalLister;
import com.adobe.cq.forms.core.components.models.formsportal.SearchAndLister;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { SearchAndLister.class, ComponentExporter.class },
    resourceType = SearchAndListerImpl.RESOURCE_TYPE,
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class SearchAndListerImpl extends AbstractComponentImpl implements SearchAndLister {
    public static final String RESOURCE_TYPE = "core/fd/components/formsportal/searchlister/v1/searchlister";
    private static final String DEFAULT_TITLE = "Forms Portal";

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Inject
    private String title;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Inject
    private String layout;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(booleanValues = false)
    @Inject
    private boolean disableSearch;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(booleanValues = false)
    @Inject
    private boolean disableSorting;

    @Self
    @Via(type = ResourceSuperType.class)
    private PortalLister commonLister;

    @PostConstruct
    private void init() {
        if (commonLister != null) {
            List<Resource> defaultAssetSources = new ArrayList<>();
            Map<String, Object> valueMap = new HashMap<>();
            valueMap.put("type", "Adaptive Forms");
            valueMap.put("htmlTooltip", "Click Here to view as HTML");
            Resource res = new DefaultValueMapResourceWrapper(new SyntheticResource(resource.getResourceResolver(), new ResourceMetadata(),
                JcrConstants.NT_UNSTRUCTURED), valueMap);
            defaultAssetSources.add(res);
            commonLister.setDefaultAssetSources(defaultAssetSources);
        }
    }

    @Override
    public String getTitle() {
        if (StringUtils.isEmpty(title)) {
            // using isEmpty instead of isBlank to allow only whitespace in title
            return DEFAULT_TITLE;
        }
        return title;
    }

    @Override
    public String getLayout() {
        if (StringUtils.isEmpty(layout)) {
            return PortalLister.LayoutType.CARD;
        }
        return layout;
    }

    @Override
    public boolean getSearchDisabled() {
        return disableSearch;
    }

    @Override
    public boolean getSortDisabled() {
        return disableSorting;
    }

    @Override
    public long getResultLimit() {
        return commonLister.getLimit();
    }

    @Override
    public Map<String, Object> getSearchResults() {
        List<PortalLister.Item> results = commonLister.getItemList();
        Long offset = commonLister.getNextOffset();
        Map<String, Object> jacksonMapping = new HashMap<>();
        jacksonMapping.put("data", results);
        jacksonMapping.put("success", "true");
        jacksonMapping.put("nextOffset", offset);
        return jacksonMapping;
    }

    private static class DefaultValueMapResourceWrapper extends ResourceWrapper {
        private final ValueMap valueMap;

        public DefaultValueMapResourceWrapper(Resource resource, Map<String, Object> properties) {
            super(resource);
            this.valueMap = new ValueMapDecorator(properties);
        }

        @Override
        public <AdapterType> AdapterType adaptTo(Class<AdapterType> type) {
            return type == ValueMap.class ? (AdapterType) this.valueMap : super.adaptTo(type);
        }

        @Override
        public ValueMap getValueMap() {
            return this.valueMap;
        }
    }
}
