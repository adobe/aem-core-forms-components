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

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Switch;
import com.adobe.cq.forms.core.components.util.AbstractOptionsFieldImpl;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Switch.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_SWITCH_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class SwitchImpl extends AbstractOptionsFieldImpl implements Switch {

    // when a checkbox is not checked, it will still have a value representing its unchecked state, rather than having
    // a null value. This configuration allows for a distinct value when the checkbox is in an unchecked state.
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "enableUncheckedValue")
    private Boolean enableUncheckedValue;

    @PostConstruct
    private void initSwitchModel() {
        String[] enumNameArray = this.getEnumNames();
        if (!Type.BOOLEAN.equals(type)) {
            if (Boolean.TRUE.equals(enableUncheckedValue)) {
                enums = new String[] { this.getEnums()[0].toString(), this.getEnums()[1].toString() };
                enumNames = new String[] { this.getEnumNames()[0], this.getEnumNames()[1] };
            } else {
                enums = new String[] { this.getEnums()[0].toString() };
                enumNames = new String[] { enumNameArray[0] };
            }
        } else {
            if (Boolean.TRUE.equals(enableUncheckedValue)) {
                enums = new String[] { "true", "false" };
                enumNames = new String[] { "true", "false" };
            } else {
                enums = new String[] { "true" };
                enumNames = new String[] { "true" };
            }
        }
    }
}
