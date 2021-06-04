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

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Required;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.forms.core.components.internal.models.v1.AbstractComponentImpl;
import com.adobe.cq.forms.core.components.models.formsportal.PortalLister;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { PortalLister.class, ComponentExporter.class },
    resourceType = PortalListerImpl.RESOURCE_TYPE,
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class PortalListerImpl extends AbstractComponentImpl implements PortalLister {
    public static final String RESOURCE_TYPE = "core/fd/components/formsportal/portallister/v1/portallister";

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Inject
    private String title;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Inject
    private String layout;

    @ValueMapValue
    @Inject
    @Default(intValues = 8)
    private Integer limit;

    @Override
    public Integer getLimit() {
        return limit;
    }

    @Self
    @Required
    private SlingHttpServletRequest request;

    protected Integer getOffset() {
        String offsetParam = request.getParameter("offset");
        if (StringUtils.isNumeric(offsetParam)) {
            return Integer.valueOf(offsetParam);
        }
        return 0;
    }

    protected Integer getNextOffset(Integer resultLength) {
        Integer nextOffset = getOffset();
        Integer limit = getLimit();
        if (resultLength < limit) {
            nextOffset = -1;
        } else {
            // in the case fetched results are equal to limit, we don't know if there are more or not
            // determining it lazily
            nextOffset = nextOffset + resultLength;
        }
        return nextOffset;
    }

    @Override
    public Map<String, Object> getSearchResults() {
        List<PortalLister.Item> results = getItemList();
        Integer offset = getOffset();
        Integer nextOffset = getNextOffset(results.size());
        Map<String, Object> jacksonMapping = new HashMap<>();
        jacksonMapping.put("data", results);
        jacksonMapping.put("nextOffset", nextOffset);
        jacksonMapping.put("offset", offset);
        return jacksonMapping;
    }

    /**
     * Function to be implemented by child classes for returning item list
     */
    protected List<PortalLister.Item> getItemList() {
        return Collections.EMPTY_LIST;
    }

    protected String defaultTitle() {
        return StringUtils.EMPTY;
    }

    @Override
    public String getTitle() {
        if (title == null) {
            return defaultTitle();
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

    public static class Item implements PortalLister.Item {
        private String title;
        private String description;
        private String tooltip;
        private String formLink;
        private String formThumbnail;

        public Item(String title, String description, String tooltip, String formLink, String formThumbnail) {
            this.title = title;
            this.description = description;
            this.tooltip = tooltip;
            this.formLink = formLink;
            this.formThumbnail = formThumbnail;
        }

        @Override
        public String getTitle() {
            return title;
        }

        @Override
        public String getDescription() {
            return description;
        }

        @Override
        public String getTooltip() {
            return tooltip;
        }

        @Override
        public String getFormLink() {
            return formLink;
        }

        @Override
        public String getThumbnailLink() {
            return formThumbnail;
        }
    }
}
