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

import java.util.ArrayList;
import java.util.List;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Base;
import com.adobe.cq.forms.core.components.models.form.TermsAndConditions;
import com.adobe.cq.forms.core.components.util.AbstractContainerImpl;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { TermsAndConditions.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_TNC_V1 })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class TermsAndConditionsImpl extends AbstractContainerImpl implements TermsAndConditions {

    private static final String TEXT_INPUT = "text-input";

    @JsonIgnore
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(booleanValues = false)
    private boolean showAsLink;

    public boolean getShowAsLink() {
        return showAsLink;
    }

    @Override
    protected <T> List<T> getChildrenModels(@Nullable SlingHttpServletRequest request, @NotNull Class<T> modelClass) {
        List<T> models = new ArrayList<>();

        int i = 0;  // remove this when <link> logic changes to 'check-box' instead of 'checkbox-grp'.
        for (Resource child : slingModelFilter.filterChildResources(resource.getChildren())) {
            if (!child.getName().startsWith("fd:")) {
                T model = null;
                if (request != null)
                    model = modelFactory.getModelFromWrappedRequest(request, child, modelClass);
                else
                    model = child.adaptTo(modelClass);

                if (model != null) {
                    i++;
                    // i++ / i == 2, this needs to change to actual link hiding. For now, hiding in case of 2nd element.
                    if ((this.showAsLink && ((Base) model).getFieldType().equals(TEXT_INPUT)) || (!this.showAsLink && i == 2))
                        continue;
                    models.add(model);
                }
            }
        }
        return models;
    }
}
