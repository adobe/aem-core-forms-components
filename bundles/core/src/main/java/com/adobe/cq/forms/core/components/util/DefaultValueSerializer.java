/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2022 Adobe
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
package com.adobe.cq.forms.core.components.util;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.adobe.cq.forms.core.components.models.form.Base;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

/**
 * Jackson serializer for default value. This handles the use-case to support multiple value types for default field
 */
public class DefaultValueSerializer extends StdSerializer<Object[]> {

    private SimpleDateFormat formatter = new SimpleDateFormat(Base.DATE_FORMATTER);

    public DefaultValueSerializer() {
        this(null);
    }

    public DefaultValueSerializer(Class<Object[]> t) {
        super(t);
    }

    private void serialize(Object value, JsonGenerator gen) throws IOException {
        if (value instanceof Boolean) {
            gen.writeBoolean((Boolean) value);
        } else if (value instanceof Long) {
            gen.writeNumber((Long) value);
        } else if (value instanceof Double) {
            gen.writeNumber((Double) value);
        } else if (value instanceof Integer) {
            gen.writeNumber((Integer) value);
        } else if (value instanceof String) {
            gen.writeString((String) value);
        } else if (value instanceof Date) {
            gen.writeString(formatter.format(value));
        } else if (value instanceof Calendar) {
            gen.writeString(formatter.format(((Calendar) value).getTime()));
        }
    }

    @Override
    public void serialize(
        Object[] value, JsonGenerator gen, SerializerProvider arg2)
        throws IOException, JsonProcessingException {
        if (value.length == 1) {
            serialize(value[0], gen);
        } else {
            gen.writeStartArray();
            for (Object objValue : value) {
                serialize(objValue, gen);
            }
            gen.writeEndArray();
        }
    }
}
