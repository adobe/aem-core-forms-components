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
package com.adobe.cq.forms.core.components.models.form;

import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ConsumerType;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Interface describing the binding of a variable (floating field).
 * Used by two component-level properties:
 *
 * <ul>
 * <li>{@code fd:variable} on a {@code text-input} (singular) — direct binding of a
 * variable to an IC Fragment. {@code bindType} is always {@code icfragment} and
 * {@code path} is not used.</li>
 * <li>An entry inside {@code fd:variables} on a {@code panel} (per-IC override map) —
 * keyed by variable id, where {@code path} is the relative path of the variable
 * inside the fragment and {@code bindType} is either {@code fdm} or {@code icfragment}.</li>
 * </ul>
 */
@ConsumerType
public interface VariableBinding {

    /**
     * Returns the relative path of the variable inside the fragment.
     * Present on entries of {@code fd:variables}; absent for the singular {@code fd:variable}.
     *
     * @return the relative path, or {@code null} if not applicable
     */
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    default String getPath() {
        return null;
    }

    /**
     * Returns the type of content source the variable is bound to.
     * Allowed values are {@code fdm} and {@code icfragment}.
     *
     * @return the bind type
     */
    @Nullable
    default String getBindType() {
        return null;
    }

    /**
     * Returns the reference to the binding source.
     * <ul>
     * <li>When {@code bindType = fdm}, the absolute JSON path of the FDM data node
     * (e.g. {@code $.InvoiceResponse.InvoiceLevel}).</li>
     * <li>When {@code bindType = icfragment}, the JCR path of the referred IC Fragment.</li>
     * </ul>
     *
     * @return the bind reference
     */
    @Nullable
    default String getBindRef() {
        return null;
    }

    /**
     * Returns the {@code jcr:uuid} of the referred Fragment. Required when
     * {@code bindType = icfragment}; absent when {@code bindType = fdm}.
     *
     * @return the bind identifier, or {@code null} when not applicable
     */
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    default String getBindId() {
        return null;
    }
}
