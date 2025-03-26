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
package com.adobe.cq.forms.core.components.models.form;

import org.jetbrains.annotations.Nullable;

import com.adobe.cq.forms.core.components.models.form.xfa.Border;
import com.adobe.cq.forms.core.components.models.form.xfa.Font;
import com.adobe.cq.forms.core.components.models.form.xfa.Margin;
import com.adobe.cq.forms.core.components.models.form.xfa.Para;
import com.adobe.cq.forms.core.components.models.form.xfa.Value;

public interface Caption {

    @Nullable
    default String getPlacement() {
        return "";
    }

    @Nullable
    default String getReserve() {
        return "";
    }

    @Nullable
    default Value getValue() {
        return null;
    }

    @Nullable
    default Para getPara() {
        return null;
    }

    @Nullable
    default Margin getMargin() {
        return null;
    }

    @Nullable
    default Border getBorder() {
        return null;
    }

    @Nullable
    default Font getFont() {
        return null;
    }
}
