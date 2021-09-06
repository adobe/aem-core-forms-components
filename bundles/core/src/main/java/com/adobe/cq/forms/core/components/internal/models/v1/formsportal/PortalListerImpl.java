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

import java.net.URISyntaxException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.utils.URIBuilder;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Required;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.forms.core.components.internal.models.v1.AbstractComponentImpl;
import com.adobe.cq.forms.core.components.models.formsportal.PortalLister;
import com.adobe.cq.forms.core.components.models.services.formsportal.Operation;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { PortalLister.class, ComponentExporter.class },
    resourceType = PortalListerImpl.RESOURCE_TYPE,
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class PortalListerImpl extends AbstractComponentImpl implements PortalLister {
    public static final String RESOURCE_TYPE = "core/fd/components/formsportal/portallister/v1/portallister";
    private static final Logger LOGGER = LoggerFactory.getLogger(PortalLister.class);
    private static final String KEY_OFFSET = "offset";

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
        String offsetParam = request.getParameter(KEY_OFFSET);
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
    public Map<String, Object> getElements() {
        List<PortalLister.Item> results = getItemList();
        Integer offset = getOffset();
        Integer nextOffset = getNextOffset(results.size());
        String loadActionURL = null;
        Map<String, Object> jacksonMapping = new HashMap<>();
        jacksonMapping.put("data", results);

        if (nextOffset >= 0) {
            try {
                URIBuilder builder = new URIBuilder(request.getRequestURI() + ((request.getQueryString() != null) ? ("?" + request
                    .getQueryString()) : ""));
                builder.setParameter(KEY_OFFSET, nextOffset.toString());
                loadActionURL = builder.build().toString();
            } catch (URISyntaxException e) {
                LOGGER.error("[FP] Could not read URI {}, Query String {}", request.getRequestURI(), request.getQueryString(), e);
            }
        }

        Map<String, Object> paginationObject = new HashMap<>();
        paginationObject.put("nextOffset", nextOffset);
        paginationObject.put("loadAction", loadActionURL);
        jacksonMapping.put("pagination", paginationObject);
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
        private String id;
        private String title;
        private String description;
        private String tooltip;
        private String formLink;
        private String formThumbnail;
        private List<Operation> operations;
        private String lastModified;

        public Item() {}

        public Item(String title, String description, String tooltip, String formLink, String formThumbnail, String lastModified) {
            this.title = title;
            this.description = description;
            this.tooltip = tooltip;
            this.formLink = formLink;
            this.formThumbnail = formThumbnail;
            this.lastModified = lastModified;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public void setTooltip(String tooltip) {
            this.tooltip = tooltip;
        }

        public void setFormLink(String formLink) {
            this.formLink = formLink;
        }

        public void setFormThumbnail(String formThumbnail) {
            this.formThumbnail = formThumbnail;
        }

        public void setOperations(List<Operation> operations) {
            this.operations = operations;
        }

        public void setId(String id) {
            this.id = id;
        }

        public void setLastModified(String timeInfo) {
            this.lastModified = timeInfo;
        }

        @Override
        public List<Operation> getOperations() {
            return operations;
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

        @Override
        public String getId() {
            return id;
        }

        @Override
        public String getLastModified() {
            return lastModified;
        }
    }
}
