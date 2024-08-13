/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2024 Adobe
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

import org.apache.commons.lang3.StringUtils;
import org.osgi.annotation.versioning.ProviderType;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Defines the auto save configuration {@code AutoSaveConfiguration}
 *
 * @since com.adobe.cq.forms.core.components.models.form 5.5.4
 */
@ProviderType
public interface AutoSaveConfiguration {

    enum AutoSaveStrategyType {
        TIME("time");

        private String strategyType;

        AutoSaveStrategyType(String strategyType) {
            this.strategyType = strategyType;
        }

        public String getStrategyType() {
            return strategyType;
        }

        /**
         * Given a {@link String} <code>strategyType</code>, this method returns the enum's value that corresponds to the provided string
         * representation
         *
         * @param strategyType the string representation for which an enum value should be returned
         * @return the corresponding enum value, if one was found
         * @since com.adobe.cq.forms.core.components.models.form 5.5.4
         */
        public static AutoSaveStrategyType fromString(String strategyType) {
            for (AutoSaveStrategyType type : AutoSaveStrategyType.values()) {
                if (StringUtils.equals(strategyType, type.strategyType)) {
                    return type;
                }
            }
            return null;
        }

        @Override
        @JsonValue
        public String toString() {
            return getStrategyType();
        }
    }

    default boolean isEnableAutoSave() {
        return false;
    }

    default AutoSaveStrategyType getAutoSaveStrategyType() {
        return AutoSaveStrategyType.TIME;
    }

    default Integer getAutoSaveInterval() {
        return 0;
    }
}
