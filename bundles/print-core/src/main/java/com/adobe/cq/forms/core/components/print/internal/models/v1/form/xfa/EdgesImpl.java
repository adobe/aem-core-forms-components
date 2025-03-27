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

import com.adobe.cq.forms.core.components.models.form.xfa.Edge;
import com.adobe.cq.forms.core.components.models.form.xfa.Edges;
import com.fasterxml.jackson.annotation.JsonInclude;

public class EdgesImpl implements Edges {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private EdgeImpl top;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private EdgeImpl bottom;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private EdgeImpl left;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private EdgeImpl right;

    public Edge getTop() {
        return top;
    }

    public Edge getBottom() {
        return bottom;
    }

    public Edge getLeft() {
        return left;
    }

    public Edge getRight() {
        return right;
    }
}
