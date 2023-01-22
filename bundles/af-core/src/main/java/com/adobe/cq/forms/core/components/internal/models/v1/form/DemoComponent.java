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

import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.models.form.Container;
import com.adobe.cq.forms.core.components.util.AbstractContainerImpl;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { ComponentExporter.class },
    resourceType = { "core-components-examples/components/demo/component__" })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class DemoComponent extends AbstractContainerImpl implements Container {

    @PostConstruct
    private void init() {
        System.out.println("Initializing Demo Component");
    }

    @Override
    public List<? extends ComponentExporter> getItems() {
        return super.getItems();
    }

    @Override
    protected <T> List<T> getChildrenModels(@Nullable SlingHttpServletRequest request, @NotNull Class<T> modelClass) {
        System.out.println("Demo Component Is Working");
        return super.getChildrenModels(request, modelClass);
    }

}
