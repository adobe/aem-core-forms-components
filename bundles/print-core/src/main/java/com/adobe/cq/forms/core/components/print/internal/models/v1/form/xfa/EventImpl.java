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

import com.adobe.cq.forms.core.components.models.form.xfa.Event;
import com.adobe.cq.forms.core.components.models.form.xfa.Script;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class EventImpl implements Event {

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String name;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private ScriptImpl script;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String ref;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String activity;

    @Override
    public String getName() {
        return name;
    }

    @Override
    public Script getScript() {
        return script;
    }

    @Override
    public String getRef() {
        return ref;
    }

    @Override
    public String getActivity() {
        return activity;
    }

    public static Event fromString(String event) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(event, EventImpl.class);
        } catch (JsonProcessingException e) {}
        return null;
    }
}
