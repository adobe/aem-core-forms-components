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
package com.adobe.cq.forms.core.components.internal.exporter;

import java.util.Map;

import org.apache.sling.models.export.spi.ModelExporter;
import org.apache.sling.models.factory.ExportException;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.osgi.service.component.annotations.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Component(
    service = ModelExporter.class,
    immediate = true)
public class ICJacksonExporter implements ModelExporter {

    @Override
    public String getName() {
        return "ic-jackson";
    }

    @Override
    public boolean isSupported(Class<?> clazz) {
        return true; // Support all classes for this example
    }

    @Override
    public <T> @Nullable T export(@NotNull Object o, @NotNull Class<T> aClass, @NotNull Map<String, String> map) throws ExportException {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode customJson = mapper.createObjectNode();
            customJson.put("dummyKey", "dummyValue");
            // Return the JSON string
            return (T) mapper.writeValueAsString(customJson);
        } catch (Exception e) {
            throw new ExportException("Error exporting model");
        }
    }

}
