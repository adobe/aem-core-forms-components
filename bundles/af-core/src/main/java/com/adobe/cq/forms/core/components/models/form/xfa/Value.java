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
package com.adobe.cq.forms.core.components.models.form.xfa;

import org.jetbrains.annotations.Nullable;

import com.adobe.cq.forms.core.components.models.form.xfa.value.DateTimeValue;
import com.adobe.cq.forms.core.components.models.form.xfa.value.DateValue;
import com.adobe.cq.forms.core.components.models.form.xfa.value.FloatValue;
import com.adobe.cq.forms.core.components.models.form.xfa.value.ImageValue;
import com.adobe.cq.forms.core.components.models.form.xfa.value.IntegerValue;
import com.adobe.cq.forms.core.components.models.form.xfa.value.LineValue;
import com.adobe.cq.forms.core.components.models.form.xfa.value.RectangleValue;
import com.adobe.cq.forms.core.components.models.form.xfa.value.RichTextValue;
import com.adobe.cq.forms.core.components.models.form.xfa.value.TextValue;

public interface Value {
    @Nullable
    default TextValue getText() {
        return null;
    }

    @Nullable
    default IntegerValue getInteger() {
        return null;
    }

    @Nullable
    default FloatValue getFloat() {
        return null;
    }

    @Nullable
    default RichTextValue getRichText() {
        return null;
    }

    @Nullable
    default LineValue getLine() {
        return null;
    }

    @Nullable
    default RectangleValue getRectangle() {
        return null;
    }

    @Nullable
    default ImageValue getImage() {
        return null;
    }

    @Nullable
    default DateValue getDate() {
        return null;
    }

    @Nullable
    default DateTimeValue getDateTime() {
        return null;
    }
}
