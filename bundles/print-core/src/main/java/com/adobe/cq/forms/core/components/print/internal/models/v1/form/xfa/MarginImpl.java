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
package com.adobe.cq.forms.core.components.print.internal.models.v1.form.xfa;

import com.adobe.cq.forms.core.components.models.form.xfa.Margin;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class MarginImpl implements Margin {

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String topInset;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String bottomInset;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String leftInset;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String rightInset;

    @Override
    public String getTopInset() {
        return topInset;
    }

    @Override
    public String getBottomInset() {
        return bottomInset;
    }

    @Override
    public String getLeftInset() {
        return leftInset;
    }

    @Override
    public String getRightInset() {
        return rightInset;
    }

    public static Margin fromString(String margin) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(margin, MarginImpl.class);
        } catch (JsonProcessingException e) {}
        return null;
    }
}
