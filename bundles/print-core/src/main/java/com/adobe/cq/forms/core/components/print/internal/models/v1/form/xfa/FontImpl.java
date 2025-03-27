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

import com.adobe.cq.forms.core.components.models.form.xfa.Fill;
import com.adobe.cq.forms.core.components.models.form.xfa.Font;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class FontImpl implements Font {

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String typeface;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String size;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String baselineShift;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String weight;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String lineThrough;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String posture;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String fontHorizontalScale;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String fontVerticalScale;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String kerningMode;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String letterSpacing;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String underline;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Fill fill;

    @Override
    public String getTypeface() {
        return typeface;
    }

    @Override
    public String getSize() {
        return size;
    }

    @Override
    public String getBaselineShift() {
        return baselineShift;
    }

    @Override
    public String getWeight() {
        return weight;
    }

    @Override
    public String getLineThrough() {
        return lineThrough;
    }

    @Override
    public String getPosture() {
        return posture;
    }

    @Override
    public String getFontHorizontalScale() {
        return fontHorizontalScale;
    }

    @Override
    public String getFontVerticalScale() {
        return fontVerticalScale;
    }

    @Override
    public String getKerningMode() {
        return kerningMode;
    }

    @Override
    public String getLetterSpacing() {
        return letterSpacing;
    }

    @Override
    public String getUnderline() {
        return underline;
    }

    @Override
    public Fill getFill() {
        return fill;
    }

    public static Font fromString(String font) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(font, FontImpl.class);
        } catch (JsonProcessingException e) {}
        return null;
    }
}
