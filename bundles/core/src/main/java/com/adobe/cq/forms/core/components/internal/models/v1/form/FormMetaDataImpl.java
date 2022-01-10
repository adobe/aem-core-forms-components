package com.adobe.cq.forms.core.components.internal.models.v1.form;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;

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
import com.adobe.cq.forms.core.components.models.form.FormMetaData;

public class FormMetaDataImpl implements FormMetaData {

    private static final String PN_ACTION = "action";
    private static final String PN_DATA_URL = "dataUrl";

    private ValueMap properties;
    private SlingHttpServletRequest request;

    public FormMetaDataImpl(SlingHttpServletRequest request, Resource field) {
        this.request = request;
        this.properties = field.getValueMap();
    }

    @Override
    public String getAction() {
        return properties.get(PN_ACTION, "");
    }

    @Override
    public String getDataUrl() {
        return properties.get(PN_DATA_URL, "");
    }
}
