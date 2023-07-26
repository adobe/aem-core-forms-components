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

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.aemds.guide.utils.GuideUtils;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.util.AbstractComponentImpl;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.adobe.cq.wcm.core.components.models.Text;
import com.adobe.cq.wcm.core.components.models.datalayer.ComponentData;
import com.adobe.cq.wcm.core.components.models.datalayer.builder.DataLayerBuilder;
import com.day.cq.wcm.api.WCMMode;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { Text.class, ComponentExporter.class },
    resourceType = {
        "core/wcm/components/text/v1/text", "core/wcm/components/text/v2/text" })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)

public class HeaderFooterTextImpl extends AbstractComponentImpl implements Text {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String text;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(booleanValues = false)
    private boolean textIsRich;

    @Inject
    private Resource resource;

    @PostConstruct
    private void initModel() {
        if (request != null && i18n == null) {
            i18n = GuideUtils.getI18n(request, resource);
        }
    }

    @Override
    public String getText() {
        String propertyName = "text";
        String propertyValue = text;
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
    public boolean isRichText() {
        return textIsRich;
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
            .withText(() -> StringUtils.defaultIfEmpty(this.getText(), StringUtils.EMPTY))
            .build();
    }
}
