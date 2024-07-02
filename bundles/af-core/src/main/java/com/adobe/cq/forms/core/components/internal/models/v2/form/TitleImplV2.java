/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2024 Adobe
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
package com.adobe.cq.forms.core.components.internal.models.v2.form;

import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.*;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.aemds.guide.utils.GuideUtils;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.datalayer.FormComponentData;
import com.adobe.cq.forms.core.components.internal.Heading;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.FormTitle;
import com.adobe.cq.forms.core.components.util.AbstractFormComponentImpl;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.wcm.api.WCMMode;
import com.day.cq.wcm.api.designer.Style;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { FormTitle.class, ComponentExporter.class },
    resourceType = FormConstants.RT_FD_FORM_TITLE_V2)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)

public class TitleImplV2 extends AbstractFormComponentImpl implements FormTitle {

    /**
     * The current resource.
     */
    @SlingObject
    private Resource resource;

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

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "format")
    @Nullable
    private String format;

    private Heading heading;

    /**
     * Translation of the title property
     */

    @PostConstruct
    private void initModel() {
        if (request != null && i18n == null) {
            i18n = GuideUtils.getI18n(request, resource);
        }
        if (StringUtils.isBlank(title)) {
            Resource formContainerResource = ComponentUtils.getFormContainer(resource);
            if (formContainerResource != null) {
                title = formContainerResource.getValueMap().get("title", String.class);
            }
        }
        if (heading == null) {
            heading = Heading.getHeading(format);
            if (heading == null && currentStyle != null) {
                heading = Heading.getHeading(currentStyle.get(PN_DESIGN_DEFAULT_FORMAT, String.class));
            }
        }
    }

    @JsonIgnore
    @Override
    public String getText() {
        return getValue();
    }

    @Override
    public String getValue() {
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

    @JsonIgnore
    public String getFormat() {
        if (heading != null) {
            return heading.getElement();
        }
        return null;
    }

    @NotNull
    protected FormComponentData getComponentData() {
        return super.getComponentData();
    }

    @Override
    public String getName() {
        return null;
    }

    @Override
    public @NotNull Map<String, Object> getProperties() {
        Map<String, Object> customProperties = super.getProperties();
        customProperties.put("fd:format", getFormat());
        return customProperties;
    }
}
