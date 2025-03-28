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

import java.util.List;

import com.adobe.cq.forms.core.components.models.form.print.Script;
import com.adobe.cq.forms.core.components.models.form.print.Variables;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class VariablesImpl implements Variables {

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<ScriptImpl> scripts;

    @Override
    public List<? extends Script> getScripts() {
        return scripts;
    }

    public static Variables fromString(String variables) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(variables, VariablesImpl.class);
        } catch (JsonProcessingException e) {}
        return null;
    }
}
