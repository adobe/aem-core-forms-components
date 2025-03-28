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

import com.adobe.cq.forms.core.components.models.form.print.Corner;
import com.adobe.cq.forms.core.components.models.form.print.Corners;
import com.fasterxml.jackson.annotation.JsonInclude;

public class CornersImpl implements Corners {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private CornerImpl top;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private CornerImpl bottom;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private CornerImpl left;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private CornerImpl right;

    @Override
    public Corner getTop() {
        return top;
    }

    @Override
    public Corner getBottom() {
        return bottom;
    }

    @Override
    public Corner getLeft() {
        return left;
    }

    @Override
    public Corner getRight() {
        return right;
    }
}
