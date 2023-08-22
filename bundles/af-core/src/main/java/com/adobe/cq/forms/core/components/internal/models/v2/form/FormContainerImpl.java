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
package com.adobe.cq.forms.core.components.internal.models.v2.form;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Consumer;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.aemds.guide.common.GuideContainer;
import com.adobe.aemds.guide.service.GuideSchemaType;
import com.adobe.aemds.guide.utils.GuideConstants;
import com.adobe.aemds.guide.utils.GuideUtils;
import com.adobe.aemds.guide.utils.GuideWCMUtils;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ContainerExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.internal.models.v1.form.FormMetaDataImpl;
import com.adobe.cq.forms.core.components.models.form.Container;
import com.adobe.cq.forms.core.components.models.form.FormClientLibManager;
import com.adobe.cq.forms.core.components.models.form.FormContainer;
import com.adobe.cq.forms.core.components.models.form.FormMetaData;
import com.adobe.cq.forms.core.components.models.form.ThankYouOption;
import com.adobe.cq.forms.core.components.util.AbstractContainerImpl;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { FormContainer.class, ContainerExporter.class, ComponentExporter.class },
    resourceType = { FormContainerImpl.RESOURCE_TYPE, FormConstants.RT_FD_FRAGMENT_CONTAINER_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class FormContainerImpl extends AbstractContainerImpl implements FormContainer {
    protected static final String RESOURCE_TYPE = "core/fd/components/form/container/v2/container";

    private static final String DOR_TYPE = "dorType";
    private static final String DOR_TEMPLATE_REF = "dorTemplateRef";
    private static final String DOR_TEMPLATE_TYPE = "dorTemplateType";
    private static final String FD_SCHEMA_TYPE = "fd:schemaType";
    private static final String FD_SCHEMA_REF = "fd:schemaRef";
    public static final String FD_FORM_DATA_ENABLED = "fd:formDataEnabled";

    @SlingObject(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private SlingHttpServletRequest request;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String thankYouMessage;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String thankYouOption;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String clientLibRef;

    protected String contextPath = StringUtils.EMPTY;
    private boolean formDataEnabled = false;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String title;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String redirect;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String prefillService;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String data;

    @PostConstruct
    protected void initFormContainerModel() {
        if (request != null) {
            contextPath = request.getContextPath();
            request.setAttribute(FormConstants.REQ_ATTR_FORMCONTAINER_PATH, this.getPath());

            Page currentPage = getCurrentPage();
            if (currentPage != null) {
                PageManager pageManager = currentPage.getPageManager();
                Page resourcePage = pageManager.getContainingPage(resource);
                if (resourcePage != null && !StringUtils.equals(currentPage.getPath(), resourcePage.getPath())) {
                    request.setAttribute(FormConstants.REQ_ATTR_REFERENCED_PATH, resourcePage.getPath());
                }
            }
            FormClientLibManager formClientLibManager = request.adaptTo(FormClientLibManager.class);
            if (formClientLibManager != null && clientLibRef != null) {
                formClientLibManager.addClientLibRef(clientLibRef);
            }
        }
    }

    @Override
    public void setContextPath(String contextPath) {
        this.contextPath = contextPath;
    }

    @JsonIgnore
    public String getContextPath() {
        return contextPath != null ? contextPath : StringUtils.EMPTY;
    }

    @Override
    @Nullable
    @JsonIgnore
    public String getThankYouMessage() {
        return translate("thankYouMessage", thankYouMessage);
    }

    @Override
    @Nullable
    @JsonIgnore
    public ThankYouOption getThankYouOption() {
        return ThankYouOption.fromString(thankYouOption);
    }

    @Override
    public String getAdaptiveFormVersion() {
        return "0.12.0";
    }

    @Override
    @Nullable
    public String getClientLibRef() {
        return clientLibRef;
    }

    @Override
    @Nullable
    public String getSchemaRef() {
        return GuideContainer.from(resource).getSchemaRef();
    }

    @Override
    @Nullable
    public GuideSchemaType getSchemaType() {
        return GuideContainer.from(resource).getSchema();
    }

    @Override
    public FormMetaData getMetaData() {
        return new FormMetaDataImpl();
    }

    @Override
    @Nullable
    public String getTitle() {
        return title;
    }

    @Override
    @Nullable
    public String getFormData() {
        return data;
    }

    @Override
    @JsonIgnore
    public String getEncodedCurrentPagePath() {
        if (getCurrentPage() != null) {
            return getId();
        } else {
            return null;
        }
    }

    @Override
    public String getId() {
        if (getCurrentPage() != null) {
            if (GuideWCMUtils.isForms(getCurrentPage().getPath())) {
                return ComponentUtils.getEncodedPath(getCurrentPage().getPath());
            } else {
                return ComponentUtils.getEncodedPath(getPath());
            }
        } else {
            return super.getId();
        }
    }

    @JsonIgnore
    @Nullable
    public String getRedirectUrl() {
        String redirectURL = GuideUtils.getRedirectUrl(redirect, getPath());
        // Only do this if redirect configured to relative URL, that is, page hosted on same AEM
        if (StringUtils.isNotEmpty(redirect) && redirect.startsWith("/")) {
            redirectURL = getContextPath() + redirectURL;
        }
        return redirectURL;
    }

    @JsonIgnore
    @Nullable
    public String getPrefillService() {
        return prefillService;
    }

    @Override
    public String getAction() {
        if (getCurrentPage() != null) {
            return getContextPath() + ADOBE_GLOBAL_API_ROOT + FORMS_RUNTIME_API_GLOBAL_ROOT + "/submit/" + getId();
        } else {
            return null;
        }
    }

    @Override
    @JsonIgnore
    public String getDataUrl() {
        if (getCurrentPage() != null) {
            return getContextPath() + ADOBE_GLOBAL_API_ROOT + FORMS_RUNTIME_API_GLOBAL_ROOT + "/data/" + ComponentUtils.getEncodedPath(
                getCurrentPage()
                    .getPath());
        } else {
            return null;
        }
    }

    @Override
    public String getLang() {
        // todo: uncomment once forms sdk is released
        if (request != null) {
            return GuideUtils.getAcceptLang(request);
        } else {
            return FormContainer.super.getLang();
        }
    }

    @Override
    public @NotNull Map<String, Object> getProperties() {
        Map<String, Object> properties = super.getProperties();
        if (getSchemaType() != null) {
            properties.put(FD_SCHEMA_TYPE, getSchemaType());
        }
        if (StringUtils.isNotBlank(getSchemaRef())) {
            properties.put(FD_SCHEMA_REF, getSchemaRef());
        }
        // adding a custom property to know if form data is enabled
        // this is done so that an extra API call from the client can be avoided
        if (StringUtils.isNotBlank(getPrefillService()) ||
            (request != null && StringUtils.isNotBlank(request.getParameter(GuideConstants.AF_DATA_REF)))) {
            formDataEnabled = true;
        }
        properties.put(FD_FORM_DATA_ENABLED, formDataEnabled);
        return properties;
    }

    @Override
    @JsonIgnore
    public Map<String, Object> getDorProperties() {
        Map<String, Object> customDorProperties = new LinkedHashMap<>();
        if (dorType != null) {
            customDorProperties.put(DOR_TYPE, dorType);
        }
        if (dorTemplateRef != null) {
            customDorProperties.put(DOR_TEMPLATE_REF, dorTemplateRef);
        }
        if (dorTemplateType != null) {
            customDorProperties.put(DOR_TEMPLATE_TYPE, dorTemplateType);
        }
        return customDorProperties;
    }

    @JsonIgnore
    @Override
    public void visit(Consumer<ComponentExporter> callback) throws Exception {
        traverseChild(this, callback);
    }

    private void traverseChild(Container container, Consumer<ComponentExporter> callback) throws Exception {
        for (ComponentExporter component : container.getItems()) {
            callback.accept(component);

            if (component instanceof Container) {
                traverseChild((Container) component, callback);
            }
        }
    }

    @Override
    @JsonIgnore
    public String getParentPagePath() {
        if (resource != null) {
            PageManager pm = resource.getResourceResolver().adaptTo(PageManager.class);
            if (pm != null) {
                Page page = pm.getContainingPage(resource);
                return page != null ? page.getPath() : StringUtils.EMPTY;
            }
        }
        return StringUtils.EMPTY;
    }

    @Override
    public String getName() {
        return FormContainer.super.getName();
    }

}
