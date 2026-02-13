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
package com.adobe.cq.forms.core.components.internal.form;

/**
 * Feature toggle identifiers for form components. When a toggle is enabled, the corresponding
 * behavior is active; when disabled or when the toggle service is absent, legacy behavior is used.
 */
public final class FeatureToggleConstants {

    private FeatureToggleConstants() {}

    /**
     * When enabled, fragment container rules and events are merged with the fragment placeholder
     * (panel) rules and events: for rules the panel overrides the container for the same key; for
     * events panel handlers run first then fragment handlers are appended. When disabled, only the
     * panel rules and events are used; fragment container rules/events are not merged.
     */
    public static final String FT_FRAGMENT_MERGE_CONTAINER_RULES_EVENTS = "FT_FORMS-24087";
}
