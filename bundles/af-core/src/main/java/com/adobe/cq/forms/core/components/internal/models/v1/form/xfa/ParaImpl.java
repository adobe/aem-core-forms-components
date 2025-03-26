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

import com.adobe.cq.forms.core.components.models.form.xfa.Para;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ParaImpl implements Para {

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @JsonProperty("vAlign")
    private String vAlign;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @JsonProperty("hAlign")
    private String hAlign;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String lineHeight;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String spaceAbove;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String spaceBelow;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String marginLeft;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String marginRight;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String textIndent;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String widows;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String orphans;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String preserve;

    @Override
    public String getVAlign() {
        return vAlign;
    }

    @Override
    public String getHAlign() {
        return hAlign;
    }

    @Override
    public String getLineHeight() {
        return lineHeight;
    }

    @Override
    public String getSpaceAbove() {
        return spaceAbove;
    }

    @Override
    public String getSpaceBelow() {
        return spaceBelow;
    }

    @Override
    public String getMarginLeft() {
        return marginLeft;
    }

    @Override
    public String getMarginRight() {
        return marginRight;
    }

    @Override
    public String getTextIndent() {
        return textIndent;
    }

    @Override
    public String getWidows() {
        return widows;
    }

    @Override
    public String getPreserve() {
        return preserve;
    }

    @Override
    public String getOrphans() {
        return orphans;
    }

    public static Para fromString(String para) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(para, ParaImpl.class);
        } catch (JsonProcessingException e) {}
        return null;
    }
}
