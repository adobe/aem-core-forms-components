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
package com.adobe.cq.forms.core.components.print.internal.models.v1.form.print;

import com.adobe.cq.forms.core.components.models.form.print.BreakBefore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class BreakBeforeImpl implements BreakBefore {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String target;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String targetType;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String startNew;

    @Override
    public String getTarget() {
        return target;
    }

    @Override
    public String getTargetType() {
        return targetType;
    }

    @Override
    public String getStartNew() {
        return startNew;
    }

    public static BreakBefore fromString(String breakBefore) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(breakBefore, BreakBeforeImpl.class);
        } catch (JsonProcessingException e) {}
        return null;
    }

}
