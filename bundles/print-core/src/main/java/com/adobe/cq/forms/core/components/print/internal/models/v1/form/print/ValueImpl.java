
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

import com.adobe.cq.forms.core.components.models.form.print.Value;
import com.adobe.cq.forms.core.components.models.form.print.value.DateTimeValue;
import com.adobe.cq.forms.core.components.models.form.print.value.DateValue;
import com.adobe.cq.forms.core.components.models.form.print.value.FloatValue;
import com.adobe.cq.forms.core.components.models.form.print.value.ImageValue;
import com.adobe.cq.forms.core.components.models.form.print.value.IntegerValue;
import com.adobe.cq.forms.core.components.models.form.print.value.LineValue;
import com.adobe.cq.forms.core.components.models.form.print.value.RectangleValue;
import com.adobe.cq.forms.core.components.models.form.print.value.RichTextValue;
import com.adobe.cq.forms.core.components.models.form.print.value.TextValue;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.print.value.DateTimeValueImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.print.value.DateValueImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.print.value.FloatValueImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.print.value.ImageValueImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.print.value.IntegerValueImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.print.value.LineValueImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.print.value.RectangleValueImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.print.value.RichTextValueImpl;
import com.adobe.cq.forms.core.components.print.internal.models.v1.form.print.value.TextValueImpl;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ValueImpl implements Value {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private TextValueImpl text;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("integer")
    private IntegerValueImpl integerValue;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("float")
    private FloatValueImpl floatValue;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private RichTextValueImpl richText;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private LineValueImpl line;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private RectangleValueImpl rectangle;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private ImageValueImpl image;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private DateValueImpl date;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private DateTimeValueImpl dateTime;

    @Override
    public TextValue getText() {
        return text;
    }

    @Override
    public IntegerValue getInteger() {
        return integerValue;
    }

    @Override
    public FloatValue getFloat() {
        return floatValue;
    }

    @Override
    public RichTextValue getRichText() {
        return richText;
    }

    @Override
    public LineValue getLine() {
        return line;
    }

    @Override
    public RectangleValue getRectangle() {
        return rectangle;
    }

    @Override
    public ImageValue getImage() {
        return image;
    }

    @Override
    public DateValue getDate() {
        return date;
    }

    @Override
    public DateTimeValue getDateTime() {
        return dateTime;
    }

    public static Value fromString(String value) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(value, ValueImpl.class);
        } catch (JsonProcessingException e) {}
        return null;
    }
}
