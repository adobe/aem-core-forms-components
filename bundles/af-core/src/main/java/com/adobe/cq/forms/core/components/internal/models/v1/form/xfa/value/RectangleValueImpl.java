
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
package com.adobe.cq.forms.core.components.internal.models.v1.form.xfa.value;

import com.adobe.cq.forms.core.components.internal.models.v1.form.xfa.CornersImpl;
import com.adobe.cq.forms.core.components.internal.models.v1.form.xfa.EdgesImpl;
import com.adobe.cq.forms.core.components.internal.models.v1.form.xfa.FillImpl;
import com.adobe.cq.forms.core.components.models.form.xfa.Corners;
import com.adobe.cq.forms.core.components.models.form.xfa.Edges;
import com.adobe.cq.forms.core.components.models.form.xfa.Fill;
import com.adobe.cq.forms.core.components.models.form.xfa.value.RectangleValue;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class RectangleValueImpl implements RectangleValue {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private EdgesImpl edges;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private CornersImpl corners;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private FillImpl fill;

    public Edges getEdges() {
        return edges;
    }

    public Corners getCorners() {
        return corners;
    }

    public Fill getFill() {
        return fill;
    }

    public static RectangleValue fromString(String recVal) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(recVal, RectangleValueImpl.class);
        } catch (JsonProcessingException e) {}
        return null;
    }

}
