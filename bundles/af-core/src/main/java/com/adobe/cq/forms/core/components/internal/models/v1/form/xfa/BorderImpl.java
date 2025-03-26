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
package com.adobe.cq.forms.core.components.internal.models.v1.form.xfa;

import com.adobe.cq.forms.core.components.models.form.xfa.Border;
import com.adobe.cq.forms.core.components.models.form.xfa.Corners;
import com.adobe.cq.forms.core.components.models.form.xfa.Edges;
import com.adobe.cq.forms.core.components.models.form.xfa.Fill;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class BorderImpl implements Border {

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String presence;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private EdgesImpl edges;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private CornersImpl corners;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private FillImpl fill;

    @Override
    public String getPresence() {
        return presence;
    }

    @Override
    public Edges getEdges() {
        return edges;
    }

    @Override
    public Corners getCorners() {
        return corners;
    }

    @Override
    public Fill getFill() {
        return fill;
    }

    public static Border fromString(String border) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(border, BorderImpl.class);
        } catch (JsonProcessingException e) {}
        return null;
    }
}
