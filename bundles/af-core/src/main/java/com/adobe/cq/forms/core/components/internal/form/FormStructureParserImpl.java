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
package com.adobe.cq.forms.core.components.internal.form;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.forms.core.components.models.form.FormContainer;
import com.adobe.cq.forms.core.components.models.form.FormStructureParser;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.adobe.cq.forms.core.components.views.Views;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = FormStructureParser.class)
public class FormStructureParserImpl implements FormStructureParser {
    private static final Logger logger = LoggerFactory.getLogger(FormStructureParserImpl.class);
    @SlingObject(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private SlingHttpServletRequest request;

    @SlingObject
    private Resource resource;

    @Override
    public String getFormContainerPath() {
        return getFormContainerPath(resource);
    }

    @Override
    public String getClientLibRefFromFormContainer() {
        return getPropertyFromFormContainer(resource, FormContainer.PN_CLIENT_LIB_REF);
    }

    @Override
    public Boolean containsFormContainer() {
        return containsFormContainer(resource);
    }

    private Boolean containsFormContainer(Resource resource) {
        if (resource == null) {
            return false;
        }
        if (ComponentUtils.isAFContainer(resource)) {
            return true;
        }
        for (Resource child : resource.getChildren()) {
            if (containsFormContainer(child)) {
                return true;
            }
        }
        return false;
    }

    private String getPropertyFromFormContainer(@Nullable Resource resource, @NotNull String propertyName) {
        if (resource == null) {
            return null;
        }

        if (ComponentUtils.isAFContainer(resource)) {
            FormContainer formContainer = resource.adaptTo(FormContainer.class);
            if (formContainer != null) {
                return formContainer.getClientLibRef();
            }
        }

        for (Resource child : resource.getChildren()) {
            String clientLibRef = getPropertyFromFormContainer(child, propertyName);
            if (clientLibRef != null) {
                return clientLibRef;
            }
        }
        return null;
    }

    private String getFormContainerPath(Resource resource) {
        if (request != null && request.getAttribute(FormConstants.REQ_ATTR_FORMCONTAINER_PATH) != null) {
            return (String) request.getAttribute(FormConstants.REQ_ATTR_FORMCONTAINER_PATH);
        }
        if (resource == null) {
            return null;
        }

        if (ComponentUtils.isAFContainer(resource)) {
            return resource.getPath();
        }

        return getFormContainerPath(resource.getParent());
    }

    public String getFormDefinition() {
        String result = null;
        FormContainer formContainer = resource.adaptTo(FormContainer.class);
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new SimpleModule().addSerializer(String.class, new FormStructureParserImpl.EncodeHTMLSerializer()));
            Writer writer = new StringWriter();
            // return publish view specific properties only for runtime
            mapper.writerWithView(Views.Publish.class).writeValue(writer, formContainer);
            result = writer.toString();
        } catch (IOException e) {
            logger.error("Unable to generate json from resource");
        }
        return result;
    }

    private static class EncodeHTMLSerializer extends JsonSerializer<String> {
        private final Set<String> richTextFields = new HashSet<>(Arrays.asList("description", "tooltip"));
        private final Set<String> regexFields = new HashSet<>(Arrays.asList("pattern"));

        @Override
        public void serialize(String value, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
            if (value != null) {
                String finalValue = value;
                if (richTextFields.contains(jsonGenerator.getOutputContext().getCurrentName())) {
                    finalValue = StringEscapeUtils.escapeJson(StringEscapeUtils.escapeJson(StringEscapeUtils.escapeHtml4(value)));
                } else if (regexFields.contains(jsonGenerator.getOutputContext().getCurrentName())) {
                    finalValue = StringEscapeUtils.escapeJson(StringEscapeUtils.escapeJson(value));
                }
                jsonGenerator.writeString(finalValue);
            }
        }
    }
}
