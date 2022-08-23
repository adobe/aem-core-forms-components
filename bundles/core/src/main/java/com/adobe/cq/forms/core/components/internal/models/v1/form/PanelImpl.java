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

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Panel;
import com.adobe.cq.forms.core.components.util.AbstractContainerImpl;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { Panel.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_PANEL_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class PanelImpl extends AbstractContainerImpl implements Panel {

    @JsonIgnore
    @Override
    public boolean isRequired() {
        return false; // overriding since base is defining isRequired, to avoid creating a new interface, added jsonIgnore here
    }

    @Override
    public Type getType() {
        if (minItems != null && maxItems != null) {
            return Type.ARRAY;
        } else {
            return Type.OBJECT;
        }
    }
}
