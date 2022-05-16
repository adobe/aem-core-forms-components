/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2022 Adobe
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
package com.adobe.cq.forms.core.components.util;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.jetbrains.annotations.NotNull;

/**
 * Utility helper functions for components.
 */
public class ComponentUtils {
    // not making the constructor private as it is used to inject in sightly files
    /**
     * Returns the base64 encoded path
     *
     * @param path page path
     * @return base64 encoded path
     */
    @NotNull
    public static String getEncodedPath(@NotNull String path) {
        return new String(Base64.getEncoder().encode(path.getBytes(StandardCharsets.UTF_8)), StandardCharsets.UTF_8);
    }

}
