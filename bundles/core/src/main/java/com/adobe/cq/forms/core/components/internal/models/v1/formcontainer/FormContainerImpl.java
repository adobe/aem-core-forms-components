/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2021 Adobe
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
package com.adobe.cq.forms.core.components.internal.models.v1.formcontainer;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.models.v1.AbstractComponentImpl;
import com.adobe.cq.forms.core.components.models.formcontainer.FormContainer;
import com.day.cq.dam.api.Asset;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { FormContainer.class,
        ComponentExporter.class },
    resourceType = com.adobe.cq.forms.core.components.internal.models.v1.formcontainer.FormContainerImpl.RESOURCE_TYPE)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class FormContainerImpl extends AbstractComponentImpl implements FormContainer {
    public static final String RESOURCE_TYPE = "core/fd/components/formcontainer/v1/formcontainer";

    private static final Logger LOGGER = LoggerFactory.getLogger(FormContainerImpl.class);

    @Self
    protected SlingHttpServletRequest request;

    @ScriptVariable
    protected ValueMap properties;

    @ValueMapValue(name = FormContainer.PN_RUNTIME_DOCUMENT_PATH, injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(values = "")
    protected String documentPath;

    @Override
    @JsonIgnore
    public String getDocumentPath() {
        return documentPath;
    }

    @Override
    @JsonProperty("model")
    public Map<String, Object> getModel() {
        Map<String, Object> jsonMap = null;
        if (StringUtils.isNotEmpty(documentPath)
            && this.request.getResourceResolver().getResource(documentPath) != null) {
            // the json is coming from DAM
            final Resource assetResource = request.getResourceResolver().getResource(documentPath);
            if (assetResource != null) {
                Asset asset = assetResource.adaptTo(Asset.class);
                if (asset != null) {
                    try {
                        InputStream inputStream = asset.getOriginal().getStream();
                        ObjectMapper mapper = new ObjectMapper();
                        jsonMap = mapper.readValue(inputStream, Map.class);
                    } catch (IOException e) {
                        LOGGER.error("Unable to read json from resource '{}'", documentPath);
                    }
                } else {
                    LOGGER.error("Unable to adapt resource '{}' used by form container '{}' to an asset.", documentPath, resource
                        .getPath());
                }
            }
        }
        return jsonMap;
    }
}
