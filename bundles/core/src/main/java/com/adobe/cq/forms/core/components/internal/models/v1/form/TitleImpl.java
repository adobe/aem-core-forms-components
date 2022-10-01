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

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.*;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.Heading;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.util.AbstractComponentImpl;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.adobe.cq.wcm.core.components.commons.link.Link;
import com.adobe.cq.wcm.core.components.commons.link.LinkManager;
import com.adobe.cq.wcm.core.components.models.Title;
import com.adobe.cq.wcm.core.components.models.datalayer.ComponentData;
import com.adobe.cq.wcm.core.components.models.datalayer.builder.DataLayerBuilder;
import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.i18n.I18n;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.WCMMode;
import com.day.cq.wcm.api.designer.Style;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Title.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_TITLE_V1, TitleImpl.RESOURCE_TYPE })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class TitleImpl extends AbstractComponentImpl implements Title {

    protected static final String RESOURCE_TYPE = "core/wcm/components/title/v3/title";

    public TitleImpl() {
        // empty
    }

    private boolean linkDisabled = false;

    @Self
    private SlingHttpServletRequest request;

    /**
     * The current resource.
     */
    @SlingObject
    private Resource resource;

    @ScriptVariable
    private PageManager pageManager;

    @ScriptVariable
    private Page currentPage;

    @ScriptVariable(injectionStrategy = InjectionStrategy.OPTIONAL)
    @JsonIgnore
    @Nullable
    private Style currentStyle;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String type;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = JcrConstants.JCR_TITLE)
    @Nullable
    private String title;

    @Self
    private LinkManager linkManager;
    protected Link link;

    private Heading heading;

    /**
     * Translation of the title property
     */
    private I18n i18n;

    public TitleImpl(I18n i18n) {
        this.i18n = i18n;
    }

    @PostConstruct
    private void initModel() {
        if (request != null && i18n == null) {
            i18n = null; // GuideUtils.getI18n(request, resource);
        }
        if (StringUtils.isBlank(title)) {
            title = StringUtils.defaultIfEmpty(currentPage.getPageTitle(), currentPage.getTitle());
        }

        if (heading == null) {
            heading = Heading.getHeading(type);
            if (heading == null && currentStyle != null) {
                heading = Heading.getHeading(currentStyle.get(PN_DESIGN_DEFAULT_TYPE, String.class));
            }
        }

        link = linkManager.get(resource).build();

        if (currentStyle != null) {
            linkDisabled = currentStyle.get(Title.PN_TITLE_LINK_DISABLED, linkDisabled);
        }
    }

    @Override
    public String getText() {
        String propertyName = JcrConstants.JCR_TITLE;
        String propertyValue = title;
        boolean editMode = true;
        if (request != null) {
            editMode = WCMMode.fromRequest(request) == WCMMode.EDIT || WCMMode.fromRequest(request) == WCMMode.DESIGN;
        }
        if (editMode) {
            return propertyValue;
        }
        if (StringUtils.isBlank(propertyValue)) {
            return null;
        }
        return ComponentUtils.translate(propertyValue, propertyName, resource, i18n);
    }

    @Override
    public String getType() {
        if (heading != null) {
            return heading.getElement();
        }
        return null;
    }

    @Override
    @JsonIgnore
    @Deprecated
    public String getLinkURL() {
        return link.getURL();
    }

    @Override
    public Link getLink() {
        return link.isValid() ? link : null;
    }

    @Override
    public boolean isLinkDisabled() {
        return linkDisabled;
    }

    @NotNull
    @Override
    public String getExportedType() {
        return resource.getResourceType();
    }

    @Override
    @NotNull
    protected ComponentData getComponentData() {
        return DataLayerBuilder.extending(super.getComponentData()).asComponent()
            .withTitle(this::getText)
            .withLinkUrl(() -> link.getMappedURL())
            .build();
    }

}
