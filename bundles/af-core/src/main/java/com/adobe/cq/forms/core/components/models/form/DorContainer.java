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

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.ArrayUtils;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ConsumerType;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ContainerExporter;
import com.adobe.cq.forms.core.components.models.form.xfa.Assist;
import com.adobe.cq.forms.core.components.models.form.xfa.Bind;
import com.adobe.cq.forms.core.components.models.form.xfa.Border;
import com.adobe.cq.forms.core.components.models.form.xfa.BreakAfter;
import com.adobe.cq.forms.core.components.models.form.xfa.BreakBefore;
import com.adobe.cq.forms.core.components.models.form.xfa.Desc;
import com.adobe.cq.forms.core.components.models.form.xfa.Event;
import com.adobe.cq.forms.core.components.models.form.xfa.Font;
import com.adobe.cq.forms.core.components.models.form.xfa.Items;
import com.adobe.cq.forms.core.components.models.form.xfa.Keep;
import com.adobe.cq.forms.core.components.models.form.xfa.Margin;
import com.adobe.cq.forms.core.components.models.form.xfa.Para;
import com.adobe.cq.forms.core.components.models.form.xfa.Traversal;
import com.adobe.cq.forms.core.components.models.form.xfa.Ui;
import com.adobe.cq.forms.core.components.models.form.xfa.Value;
import com.adobe.cq.forms.core.components.models.form.xfa.Variables;
import com.fasterxml.jackson.annotation.JsonInclude;

@ConsumerType
public interface DorContainer extends ContainerExporter {

    @Nullable
    default String getType() {
        return "";
    }

    @Nullable
    default String getName() {
        return "";
    }

    @Nullable
    default String getWidth() {
        return "";
    }

    @Nullable
    default String getHeight() {
        return "";
    }

    @Nullable
    default String getLeft() {
        return "";
    }

    @Nullable
    default String getTop() {
        return "";
    }

    @Nullable
    default String getLocale() {
        return "";
    }

    @Nullable
    default String getAccess() {
        return "";
    }

    @Nullable
    default String getMaxH() {
        return "";
    }

    @Nullable
    default String getMaxW() {
        return "";
    }

    @Nullable
    default String getMinH() {
        return "";
    }

    @Nullable
    default String getMinW() {
        return "";
    }

    @Nullable
    default String getLayout() {
        return "";
    }

    @Nullable
    default String getPresence() {
        return "";
    }

    @Nullable
    default String getUseHref() {
        return "";
    }

    @Nullable
    default String getStock() {
        return "";
    }

    @Nullable
    default String getShort() {
        return "";
    }

    @Nullable
    default String getLong() {
        return "";
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
    default Bind getBind() {
        return null;
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
    default Font getFont() {
        return null;
    }

    @Nullable
    default Items getItems() {
        return null;
    }

    @Nullable
    default Traversal getTraversal() {
        return null;
    }

    @Nullable
    default List<? extends Event> getEvents() {
        return null;
    }

    @Nullable
    default Desc getDesc() {
        return null;
    }

    @Nullable
    default BreakBefore getBreakBefore() {
        return null;
    }

    @Nullable
    default BreakAfter getBreakAfter() {
        return null;
    }

    @Nullable
    default Keep getKeep() {
        return null;
    }

    @Nullable
    default Assist getAssist() {
        return null;
    }

    @Nullable
    default Ui getUi() {
        return null;
    }

    @Nullable
    default Caption getCaption() {
        return null;
    }

    @Nullable
    default Variables getVariables() {
        return null;
    }

    /**
     * @see ContainerExporter#getExportedItems()
     * @since com.adobe.cq.forms.core.components.models.form 0.0.1
     */
    @NotNull
    @Override
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    default Map<String, ? extends ComponentExporter> getExportedItems() {
        return Collections.emptyMap();
    }

    @NotNull
    @Override
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    default String[] getExportedItemsOrder() {
        return ArrayUtils.EMPTY_STRING_ARRAY;
    }
}
