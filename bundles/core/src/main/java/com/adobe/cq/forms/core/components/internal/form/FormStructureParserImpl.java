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

import com.adobe.cq.forms.core.components.models.form.FormStructureParser;

import static com.adobe.cq.forms.core.components.internal.form.FormConstants.RT_FD_FORM_CONTAINER_V2;

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

    private String getFormContainerPath(Resource resource) {
        if (resource == null) {
            return null;
        }

        if (resource.isResourceType(RT_FD_FORM_CONTAINER_V2)) {
            return resource.getPath();
        }

        return getFormContainerPath(resource.getParent());
    }

}
