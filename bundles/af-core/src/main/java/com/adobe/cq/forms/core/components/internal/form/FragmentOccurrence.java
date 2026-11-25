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

import java.util.Collections;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceWrapper;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.forms.core.components.util.ComponentUtils;

/**
 * Tracks the occurrence of a component inside (possibly nested) adaptive form fragments.
 * <p>
 * A fragment can be referenced several times, directly or through other fragments, while its components are stored only
 * once in the repository. The occurrence path is the concatenation of the paths of all fragment placeholders through
 * which a component is reached. Combined with the physical path of the component, it uniquely identifies a component
 * occurrence within a form, independently of whether the form is rendered as HTML or exported as JSON (with or without a
 * request).
 * <p>
 * The occurrence path is transported in two ways:
 * <ul>
 * <li>Model traversal (JSON export, with or without request): child resources are wrapped in an {@link OccurrenceResource}
 * that keeps the physical path, type and properties of the resource.</li>
 * <li>HTML rendering: the fragment include sets the {@link #REQ_ATTR_OCCURRENCE_PATH} request attribute for the duration of
 * the include.</li>
 * </ul>
 */
public final class FragmentOccurrence {

    /**
     * Request attribute holding the occurrence path while the content of a fragment is included in HTML rendering.
     */
    public static final String REQ_ATTR_OCCURRENCE_PATH = "com.adobe.cq.forms.core.components.fragmentOccurrencePath";

    private FragmentOccurrence() {
        // NOOP
    }

    /**
     * Checks whether occurrence based component ids are enabled.
     *
     * @return {@code true} only when the occurrence id toggle is enabled
     */
    public static boolean isEnabled() {
        return ComponentUtils.isToggleEnabled(FeatureToggleConstants.FT_FRAGMENT_OCCURRENCE_IDS);
    }

    /**
     * Resolves the occurrence path of a component. The occurrence carried by the resource takes precedence over the one
     * set on the request by a fragment include.
     *
     * @param resource the resource of the component
     * @param request the current request, if any
     * @return the occurrence path, empty if the component is not inside a fragment
     */
    @NotNull
    public static String getOccurrencePath(@Nullable Resource resource, @Nullable SlingHttpServletRequest request) {
        Resource current = resource;
        while (current instanceof ResourceWrapper) {
            if (current instanceof OccurrenceResource) {
                return ((OccurrenceResource) current).getOccurrencePath();
            }
            current = ((ResourceWrapper) current).getResource();
        }
        if (request != null) {
            Object occurrencePath = request.getAttribute(REQ_ATTR_OCCURRENCE_PATH);
            if (occurrencePath instanceof String) {
                return (String) occurrencePath;
            }
        }
        return StringUtils.EMPTY;
    }

    /**
     * Wraps the resource so that the models adapted from it know their occurrence.
     *
     * @param resource the physical resource
     * @param occurrencePath the occurrence path
     * @return the wrapped resource, or the resource itself when the occurrence path is empty
     */
    @NotNull
    public static Resource wrap(@NotNull Resource resource, @Nullable String occurrencePath) {
        if (StringUtils.isEmpty(occurrencePath)) {
            return resource;
        }
        return new OccurrenceResource(resource, occurrencePath);
    }

    /**
     * Returns the request attributes to set while including the content of a fragment in HTML rendering.
     *
     * @param occurrencePath the occurrence path of the components inside the fragment
     * @return the request attributes
     */
    @NotNull
    public static Map<String, Object> getIncludeAttributes(@Nullable String occurrencePath) {
        if (StringUtils.isEmpty(occurrencePath)) {
            return Collections.emptyMap();
        }
        return Collections.singletonMap(REQ_ATTR_OCCURRENCE_PATH, occurrencePath);
    }

    /**
     * Resource carrying the occurrence path. All the other methods delegate to the physical resource.
     */
    static final class OccurrenceResource extends ResourceWrapper {

        private final String occurrencePath;

        OccurrenceResource(@NotNull Resource resource, @NotNull String occurrencePath) {
            super(resource);
            this.occurrencePath = occurrencePath;
        }

        @NotNull
        String getOccurrencePath() {
            return occurrencePath;
        }
    }
}
