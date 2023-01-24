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
package com.adobe.cq.forms.core.components.it.service;




import java.util.*;
import java.util.concurrent.ConcurrentHashMap;


import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;


@Component(
        service=DataManager.class,
        immediate = true
)
public class DataManager {
    private static int MAX_ENTRIES = 10000;
    private static int INITIAL_CAPACITY = 100;
    public final static String UNIQUE_ID = "prefillId";

    public static String getFileAttachmentMapKey(String uuid) {
        return uuid + "fileAttachmentMap";
    }

    private Map<Object, Object> cache;

    protected void activate() {
        cache = Collections.synchronizedMap(new LinkedHashMap<Object, Object>(INITIAL_CAPACITY + 1, 1.0f, true) {
            /**
             * Returns <tt>true</tt> if this <code>GuideCache</code> has more entries than the maximum specified when it was
             * created.
             *
             * <p>
             * This method <em>does not</em> modify the underlying <code>Map</code>; it relies on the implementation of
             * <code>LinkedHashMap</code> to do that, but that behavior is documented in the JavaDoc for
             * <code>LinkedHashMap</code>.
             * </p>
             *
             * @param eldest
             *            the <code>Entry</code> in question; this implementation doesn't care what it is, since the
             *            implementation is only dependent on the size of the cache
             * @return <tt>true</tt> if the oldest
             * @see java.util.LinkedHashMap#removeEldestEntry(java.util.Map.Entry)
             */
            protected boolean removeEldestEntry(final Map.Entry eldest) {
                return size() > MAX_ENTRIES;
            }
        });
    }


    public Object get(String key) {
        Object value = null;
        if (cache.containsKey(key)) {
            value = cache.get(key);
        }
        return value;
    }

    public Map <String, String> getCustomContext(String id) {
        Map<String, String> customContext = new HashMap<>();
        customContext.put(UNIQUE_ID, id);
        return customContext;
    }
    public Object put(String key, Object value) {
        return cache.put(key, value);
    }
}