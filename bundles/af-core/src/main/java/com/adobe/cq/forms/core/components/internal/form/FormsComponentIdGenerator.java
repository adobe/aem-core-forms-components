/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2026 Adobe
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
package com.adobe.cq.forms.core.components.internal.form;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.wcm.core.components.models.Component;
import com.adobe.cq.wcm.core.components.util.ComponentUtils;

/**
 * Generates the id of form components.
 * <p>
 * The id only depends on the component resource and its {@link FragmentOccurrence occurrence path}. It does not depend on
 * the request, the current page or the component context, so that the same component occurrence gets the same id in HTML
 * rendering and in every JSON export.
 */
public final class FormsComponentIdGenerator {

    private FormsComponentIdGenerator() {
        // NOOP
    }

    /**
     * Returns the authored id of the component if set, otherwise generates an id from the resource type and from the
     * occurrence path concatenated with the physical path of the component, e.g. textinput-5c7e0ef90d.
     *
     * @param resource the resource of the component
     * @param occurrencePath the occurrence path of the component
     * @return the id of the component
     */
    @NotNull
    public static String getId(@NotNull Resource resource, @Nullable String occurrencePath) {
        // same normalization as the WCM core components for authored ids
        String authoredId = resource.getValueMap().get(Component.PN_ID, String.class);
        if (StringUtils.isNotEmpty(authoredId)) {
            return StringUtils.replace(StringUtils.normalizeSpace(StringUtils.trim(authoredId)), " ", ComponentUtils.ID_SEPARATOR);
        }
        String prefix = StringUtils.substringAfterLast(resource.getResourceType(), "/");
        return ComponentUtils.generateId(prefix, StringUtils.defaultString(occurrencePath) + resource.getPath());
    }
}
