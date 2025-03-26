
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
package com.adobe.cq.forms.core.components.internal.models.v1.form.xfa.ui;

import com.adobe.cq.forms.core.components.internal.models.v1.form.xfa.BorderImpl;
import com.adobe.cq.forms.core.components.internal.models.v1.form.xfa.MarginImpl;
import com.adobe.cq.forms.core.components.models.form.xfa.Border;
import com.adobe.cq.forms.core.components.models.form.xfa.Margin;
import com.adobe.cq.forms.core.components.models.form.xfa.ui.NumericEdit;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class NumericEditImpl implements NumericEdit {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private MarginImpl margin;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private BorderImpl border;

    @Override
    public Margin getMargin() {
        return margin;
    }

    @Override
    public Border getBorder() {
        return border;
    }

    public static NumericEdit fromString(String val) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(val, NumericEditImpl.class);
        } catch (JsonProcessingException e) {}
        return null;
    }
}
