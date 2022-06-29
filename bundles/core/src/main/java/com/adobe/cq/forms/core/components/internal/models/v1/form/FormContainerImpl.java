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
package com.adobe.cq.forms.core.components.internal.models.v1.form;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.factory.ModelFactory;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ContainerExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.FormContainer;
import com.adobe.cq.forms.core.components.models.form.FormMetaData;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.adobe.cq.wcm.core.components.util.AbstractComponentImpl;
import com.day.cq.dam.api.Asset;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { FormContainer.class, ContainerExporter.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_CONTAINER_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class FormContainerImpl extends AbstractComponentImpl implements FormContainer {

    private static final Logger logger = LoggerFactory.getLogger(FormContainerImpl.class);

    @Self
    private SlingHttpServletRequest request;

    @ScriptVariable
    private SlingHttpServletResponse response;

    @OSGiService
    private SlingModelFilter slingModelFilter;

    @OSGiService
    private ModelFactory modelFactory;

    @ScriptVariable
    private Resource resource;

    // @ScriptVariable
    // private Page currentPage;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String thankyouMessage;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String thankyouPage;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String title;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String description;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String data;

    @ValueMapValue(name = FormContainer.PN_RUNTIME_DOCUMENT_PATH, injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(values = "")
    protected String documentPath;

    private List<? extends ComponentExporter> childrenModels;

    // overriding since AF 2.0 specification does not have id but we need the API for rendering
    @Override
    @JsonIgnore
    public String getId() {
        return super.getId();
    }

    @Override
    public List<? extends ComponentExporter> getItems() {
        if (childrenModels == null) {
            childrenModels = getChildrenModels(request, ComponentExporter.class);
        }
        return childrenModels;
    }

    @Override
    public FormMetaData getMetaData() {
        return new FormMetaDataImpl(resource);
    }

    @Override
    @Nullable
    public String getTitle() {
        return title;
    }

    @Override
    @Nullable
    public String getDescription() {
        return description;
    }

    @Override
    @Nullable
    public String getThankYouMessage() {
        return thankyouMessage;
    }

    @Override
    @Nullable
    public String getThankYouPage() {
        return thankyouPage;
    }

    @Override
    @Nullable
    public String getFormData() {
        return data;
    }

    @Override
    public @NotNull String getExportedType() {
        return resource.getResourceType();
    }

    @Override
    @JsonIgnore
    public String getDocumentPath() {
        return documentPath;
    }

    @Override
    public String getPath() {
        return resource.getPath();
    }

    @Override
    @JsonIgnore
    public String getEncodedCurrentPagePath() {
        if (getCurrentPage() != null) {
            return ComponentUtils.getEncodedPath(getCurrentPage().getPath());
        } else {
            return null;
        }
    }

    @Override
    @JsonIgnore
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
                        logger.error("Unable to read json from resource '{}'", documentPath);
                    }
                } else {
                    logger.error("Unable to adapt resource '{}' used by form container '{}' to an asset.", documentPath, resource
                        .getPath());
                }
            }
        } else {
            FormContainer formContainer = modelFactory.getModelFromWrappedRequest(request, resource, FormContainer.class);
            ObjectMapper mapper = new ObjectMapper();
            jsonMap = mapper.convertValue(formContainer, new TypeReference<Map<String, Object>>() {});
        }
        return jsonMap;
    }

    // todo: its similar to other container code, but could not find a better way to do this
    protected <T> List<T> getChildrenModels(@NotNull SlingHttpServletRequest request, @NotNull Class<T> modelClass) {
        List<T> models = new ArrayList<>();
        for (Resource child : slingModelFilter.filterChildResources(resource.getChildren())) {
            T model = modelFactory.getModelFromWrappedRequest(request, child, modelClass);
            if (model != null) {
                models.add(model);
            }
        }
        return models;
    }
}
