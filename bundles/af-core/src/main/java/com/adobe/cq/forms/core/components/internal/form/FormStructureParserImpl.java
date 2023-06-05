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
package com.adobe.cq.forms.core.components.internal.form;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.forms.core.components.models.form.FormContainer;
import com.adobe.cq.forms.core.components.models.form.FormStructureParser;
import com.adobe.cq.forms.core.components.util.ComponentUtils;

@Model(
    adaptables = Resource.class,
    adapters = FormStructureParser.class)
public class FormStructureParserImpl implements FormStructureParser {

    @SlingObject
    private Resource resource;

    @Override
    public String getFormContainerPath() {
        return getFormContainerPath(resource);
    }

    @Override
    public String getThemeClientLibRefFromFormContainer() {
        FormContainer formContainer = getFormContainer(resource);
        return formContainer != null ? formContainer.getThemeClientLibRef() : null;
    }

    @Override
    public String getClientLibRefFromFormContainer() {
        FormContainer formContainer = getFormContainer(resource);
        return formContainer != null ? formContainer.getClientLibRef() : null;
    }

    @Override
    public Boolean containsFormContainer() {
        return containsFormContainer(resource);
    }

    private Boolean containsFormContainer(Resource resource) {
        if (resource == null) {
            return false;
        }
        if (ComponentUtils.isAFContainer(resource)) {
            return true;
        }
        for (Resource child : resource.getChildren()) {
            if (containsFormContainer(child)) {
                return true;
            }
        }
        return false;
    }

    private FormContainer getFormContainer(@Nullable Resource resource) {
        if (resource == null) {
            return null;
        }

        if (ComponentUtils.isAFContainer(resource)) {
            FormContainer formContainer = resource.adaptTo(FormContainer.class);
            return formContainer;
        }

        for (Resource child : resource.getChildren()) {
            FormContainer formContainer = getFormContainer(child);
            if (formContainer != null) {
                return formContainer;
            }
        }
        return null;
    }

    private String getFormContainerPath(Resource resource) {
        if (resource == null) {
            return null;
        }

        if (ComponentUtils.isAFContainer(resource)) {
            return resource.getPath();
        }

        return getFormContainerPath(resource.getParent());
    }

}
