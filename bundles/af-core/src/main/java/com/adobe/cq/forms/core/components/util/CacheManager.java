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
package com.adobe.cq.forms.core.components.util;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

public class CacheManager {
    private static final Map<String, List<String>> SUBMIT_ACTIONS_CACHE = new ConcurrentHashMap<>();
    private static final Map<String, Long> CACHE_TIMESTAMPS = new ConcurrentHashMap<>();
    private static final long CACHE_TTL = TimeUnit.HOURS.toMillis(24);
    public static final String SUPPORTED_SUBMIT_ACTIONS_CACHE_KEY = "supportedsubmit_actions";

    public static List<String> getFromCache(String cacheKey) {
        Long timestamp = CACHE_TIMESTAMPS.get(cacheKey);
        if (timestamp == null) {
            return null;
        }

        if (System.currentTimeMillis() - timestamp > CACHE_TTL) {
            SUBMIT_ACTIONS_CACHE.remove(cacheKey);
            CACHE_TIMESTAMPS.remove(cacheKey);
            return null;
        }

        return SUBMIT_ACTIONS_CACHE.get(cacheKey);
    }

    public static void putInCache(String cacheKey, List<String> value) {
        SUBMIT_ACTIONS_CACHE.put(cacheKey, value);
        CACHE_TIMESTAMPS.put(cacheKey, System.currentTimeMillis());
    }
}
