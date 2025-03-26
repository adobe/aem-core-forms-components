/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2025 Adobe
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

import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.models.v1.form.xfa.DataSetsImpl;
import com.adobe.cq.forms.core.components.models.form.PageTemplate;
import com.adobe.cq.forms.core.components.models.form.Template;
import com.adobe.cq.forms.core.components.models.form.xfa.DataSets;
import com.adobe.cq.forms.core.components.util.AbstractComponentImpl;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { PageTemplate.class, ComponentExporter.class },
    resourceType = { PageTemplateImpl.RESOURCE_TYPE })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class PageTemplateImpl extends AbstractComponentImpl implements PageTemplate {

    protected static final String RESOURCE_TYPE = "core/fd/components/form/pageTemplate/v2/pageTemplate";

    @SlingObject
    private Resource resource;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "config")
    @Nullable
    private String config;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "localeSet")
    @Nullable
    private String localeSet;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "xmpMetaData")
    @Nullable
    private String xmpMetaData;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "datasets")
    @Nullable
    private String datasetsJcr;
    protected DataSets datasets;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "connectionSet")
    @Nullable
    private String connectionSet;

    protected Template template;

    @Override
    public String getConfig() {
        return this.config;
    }

    @Override
    public String getLocaleSet() {
        return this.localeSet;
    }

    @Override
    public String getXmpMetaData() {
        return this.xmpMetaData;
    }

    @Override
    public DataSets getDatasets() {
        return this.datasets;
    }

    @Override
    public String getConnectionSet() {
        return this.connectionSet;
    }

    @Override
    public Template getTemplate() {
        return this.template;
    }

    @PostConstruct
    protected void init() {
        this.datasets = DataSetsImpl.fromString(datasetsJcr);
        Resource templateResource = resource.getChild("template");
        if (templateResource != null) {
            this.template = templateResource.adaptTo(Template.class);
        }
    }
}
