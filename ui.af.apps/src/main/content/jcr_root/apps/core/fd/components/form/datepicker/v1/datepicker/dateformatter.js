/*******************************************************************************
 * Copyright 2025 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
use(function () {
    var DefaultValueSerializer = Packages.com.adobe.cq.forms.core.components.util.DefaultValueSerializer;
    date = this.date;

    /**
     * Formats a Java Date object to yyyy-MM-dd string format for HTML5 date input.
     * Uses DefaultValueSerializer.formatDate() to ensure consistent date formatting.
     * @param {java.util.Date} date - The Java Date object to format
     * @return {string} Formatted date string or null if date is null
     */
    var formatDate = function() {
        if (date != null) {
            return DefaultValueSerializer.formatDate(date);
        }
        return null;
    };

    return {
        formatDate: formatDate
    }
});
