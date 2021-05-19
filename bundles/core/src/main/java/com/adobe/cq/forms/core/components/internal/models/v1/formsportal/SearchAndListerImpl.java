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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
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
    public static final String RESOURCE_TYPE = "core/fd/components/formsportal/searchnlister/v1/searchnlister";
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
    private boolean disableTextSearch;

    @Self
    @Via(type = ResourceSuperType.class)
    private PortalLister commonLister;

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
            return "Card";
        }
        return layout;
    }

    @Override
    public boolean getAdvancedSearchDisabled() {
        return disableSearch;
    }

    @Override
    public boolean getTextSearchDisabled() {
        return disableTextSearch;
    }

    @Override
    public long getResultLimit() {
        return Long.parseLong(commonLister.getLimit());
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
}
