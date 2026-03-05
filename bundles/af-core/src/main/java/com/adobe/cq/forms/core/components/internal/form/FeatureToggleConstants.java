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
 * <p>
 * Toggles are driven by system properties. Code checks only the system property; the property is
 * set/unset by the Granite Toggle API when you wire a toggle to it via OSGi. Setup:
 * <ol>
 * <li><strong>Enable the toggle</strong>: In the Web Console (configMgr), find "Adobe Granite
 * Dynamic Toggle Provider" and add the toggle ID (e.g. {@link #FT_FRAGMENT_MERGE_CONTAINER_RULES_EVENTS})
 * to the <em>Enabled Toggles</em> list. You can verify the toggle is active via the web console.</li>
 * <li><strong>Wire toggle to a system property</strong>: Add an OSGi factory configuration for
 * {@code com.adobe.granite.toggle.monitor.systemproperty} (the ToggleMonitorSystemPropertyFactory).
 * Use the same name for toggle and system property. Example JSON config:
 * 
 * <pre>
 * {@code
 * "com.adobe.granite.toggle.monitor.systemproperty~forms-fragment-merge": {
 *   "toggle.name": "FT_FORMS-24087",
 *   "system.property": "FT_FORMS-24087",
 *   "fail.used": false
 * }
 * }
 * </pre>
 * 
 * The segment after {@code ~} is a unique instance name. When the toggle is enabled, the factory
 * sets the system property; when disabled, it unsets it.</li>
 * <li><strong>In code</strong>: Use {@link com.adobe.cq.forms.core.components.util.ComponentUtils#isToggleEnabled(String)}
 * with the toggle ID; it reads the system property (value {@code "true"} means enabled).</li>
 * </ol>
 * You can also enable a toggle for local or override use by setting the JVM system property
 * directly (e.g. {@code -DFT_FORMS-24087=true}) without the OSGi config.
 */
public final class FeatureToggleConstants {

    private FeatureToggleConstants() {}

    /**
     * When enabled, fragment container rules and events are merged with the fragment placeholder
     * (panel) rules and events: for rules the panel overrides the container for the same key; for
     * events panel handlers run first then fragment handlers are appended. When disabled, only the
     * panel rules and events are used; fragment container rules/events are not merged.
     * <p>
     * System property: same name ({@code FT_FORMS-24087}); set to {@code "true"} to enable when
     * using {@code ToggleMonitorSystemPropertyFactory} or for direct -D JVM override.
     */
    public static final String FT_FRAGMENT_MERGE_CONTAINER_RULES_EVENTS = "FT_FORMS-24087";

    /**
     * When enabled, the default {@code custom:setProperty} event handler ({@code "$event.payload"})
     * is no longer injected into the model JSON by the server. The af2-web-runtime provides this
     * default at the client side, reducing JSON payload size for every form component.
     * <p>
     * <strong>Prerequisite:</strong> the af2-web-runtime must include the corresponding fallback
     * in {@code Scriptable.getCompiledEvent} before this toggle is enabled.
     * <p>
     * System property: same name ({@code FT_FORMS-24343}); set to {@code "true"} to enable.
     */
    public static final String FT_SKIP_DEFAULT_SET_PROPERTY_EVENT = "FT_FORMS-24343";

    /**
     * When enabled, container components (panels, wizards, fragments, form containers) export their
     * children as a flat {@code "items"} JSON array instead of the Sling Model Exporter's default
     * {@code ":items"} map + {@code ":itemsOrder"} array. This reduces JSON payload size by
     * eliminating the redundant resource-name keys and the separate ordering array.
     * <p>
     * <strong>Prerequisite:</strong> the af2-web-runtime already supports the {@code items} array
     * format natively via {@code Container._initialize()}.
     * <p>
     * System property: same name ({@code FT_FORMS-24358}); set to {@code "true"} to enable.
     */
    public static final String FT_SKIP_ITEMS_MAP = "FT_FORMS-24358";
}
