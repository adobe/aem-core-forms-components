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

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Defines the form {@code DateInput} Sling Model used for the
 * {@code /apps/core/fd/components/form/dateinput/v1/dateinput} component.
 * Renders a split date widget with separate day, month, and year text boxes
 * in parity with the foundation {@code guidedateinput} component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 5.9.0
 */
@ConsumerType
public interface DateInput extends Field, DateConstraint {

    /**
     * Returns the placeholder text for the day input box.
     *
     * @return placeholder for the day field, or {@code null} if not set
     * @since com.adobe.cq.forms.core.components.models.form 5.9.0
     */
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String getPlaceholderDay();

    /**
     * Returns the placeholder text for the month input box.
     *
     * @return placeholder for the month field, or {@code null} if not set
     * @since com.adobe.cq.forms.core.components.models.form 5.9.0
     */
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String getPlaceholderMonth();

    /**
     * Returns the placeholder text for the year input box.
     *
     * @return placeholder for the year field, or {@code null} if not set
     * @since com.adobe.cq.forms.core.components.models.form 5.9.0
     */
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String getPlaceholderYear();

    /**
     * Returns the date display format as an XFA picture clause string that controls
     * the field order and separator of the three-box widget.
     * Examples: {@code date{D/M/YYYY}} (DD-MM-YYYY), {@code date{M/D/YYYY}} (MM-DD-YYYY),
     * {@code date{YYYY/M/D}} (YYYY-MM-DD).
     *
     * @return XFA format string, or {@code null} if not set (defaults to {@code date{D/M/YYYY}})
     * @since com.adobe.cq.forms.core.components.models.form 5.9.0
     */
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String getDateDisplayFormat();

    /**
     * Returns the visible label text for the day input box.
     *
     * @return day label, or {@code null} if not set
     * @since com.adobe.cq.forms.core.components.models.form 5.9.0
     */
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String getTitleDay();

    /**
     * Returns the visible label text for the month input box.
     *
     * @return month label, or {@code null} if not set
     * @since com.adobe.cq.forms.core.components.models.form 5.9.0
     */
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String getTitleMonth();

    /**
     * Returns the visible label text for the year input box.
     *
     * @return year label, or {@code null} if not set
     * @since com.adobe.cq.forms.core.components.models.form 5.9.0
     */
    @Nullable
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String getTitleYear();

    /**
     * Returns whether the per-sub-field labels (day/month/year titles) are hidden.
     *
     * @return {@code true} if labels are hidden, {@code false} otherwise
     * @since com.adobe.cq.forms.core.components.models.form 5.9.0
     */
    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    boolean isHideTitleDate();

    /**
     * @see Field#getDefault()
     * @since com.adobe.cq.forms.core.components.models.form 5.9.0
     */
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = Base.DATE_FORMATTER, timezone = "UTC")
    @Override
    default Object[] getDefault() {
        return null;
    }
}
