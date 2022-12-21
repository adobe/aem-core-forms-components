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
package com.adobe.cq.forms.core.components.internal.models.v2.aemform;

import java.util.LinkedList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.apache.sling.caconfig.ConfigurationResolver;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.models.v2.HtmlPageItemImpl;
import com.adobe.cq.forms.core.components.models.aemform.AEMForm;
import com.adobe.cq.wcm.core.components.config.HtmlPageItemConfig;
import com.adobe.cq.wcm.core.components.config.HtmlPageItemsConfig;
import com.adobe.cq.wcm.core.components.models.HtmlPageItem;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { AEMForm.class,
        ComponentExporter.class },
    resourceType = AEMFormImpl.RESOURCE_TYPE)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class AEMFormImpl extends com.adobe.cq.forms.core.components.internal.models.v1.aemform.AEMFormImpl implements AEMForm {
    public static final String RESOURCE_TYPE = "core/fd/components/aemform/v2/aemform";

    @OSGiService
    private ConfigurationResolver configurationResolver;

    private List<HtmlPageItem> htmlPageItems;

    @Override
    public @Nullable List<HtmlPageItem> getHtmlPageItems() {
        Resource formResource = request.getResourceResolver().getResource(getFormPagePath());
        if (htmlPageItems == null && formResource != null) {
            htmlPageItems = new LinkedList<>();
            ConfigurationBuilder configurationBuilder = configurationResolver.get(formResource);
            HtmlPageItemsConfig config = configurationBuilder.as(HtmlPageItemsConfig.class);
            for (HtmlPageItemConfig itemConfig : config.items()) {
                HtmlPageItem item = new HtmlPageItemImpl(StringUtils.defaultString(config.prefixPath()), itemConfig);
                if (item.getElement() != null) {
                    htmlPageItems.add(item);
                }
            }
        }
        return htmlPageItems;
    }
}
