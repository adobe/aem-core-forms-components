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
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.aemds.guide.common.GuideContainer;
import com.adobe.aemds.guide.service.GuideSchemaType;
import com.adobe.aemds.guide.utils.GuideConstants;
import com.adobe.aemds.guide.utils.GuideUtils;
import com.adobe.aemds.guide.utils.GuideWCMUtils;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ContainerExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.internal.form.ReservedProperties;
import com.adobe.cq.forms.core.components.internal.models.v1.form.FormMetaDataImpl;
import com.adobe.cq.forms.core.components.models.form.Container;
import com.adobe.cq.forms.core.components.models.form.FormClientLibManager;
import com.adobe.cq.forms.core.components.models.form.FormContainer;
import com.adobe.cq.forms.core.components.models.form.FormMetaData;
import com.adobe.cq.forms.core.components.models.form.ThankYouOption;
import com.adobe.cq.forms.core.components.util.AbstractContainerImpl;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.day.cq.commons.LanguageUtil;
import com.day.cq.commons.jcr.JcrConstants;
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

    private static final Logger logger = LoggerFactory.getLogger(FormContainerImpl.class);
    private static final String DOR_TYPE = "dorType";
    private static final String DOR_TEMPLATE_REF = "dorTemplateRef";
    private static final String DOR_TEMPLATE_TYPE = "dorTemplateType";
    private static final String FD_SCHEMA_TYPE = "fd:schemaType";
    private static final String FD_SCHEMA_REF = "fd:schemaRef";
    private static final String FD_HAMBURGER_MENU = "fd:hamburgerMenu";
    public static final String FD_FORM_DATA_ENABLED = "fd:formDataEnabled";
    public static final String FD_ROLE_ATTRIBUTE = "fd:roleAttribute";

    @SlingObject(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private SlingHttpServletRequest request;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_THANK_YOU_MSG_V2)
    @Nullable
    private String thankYouMessage;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_THANK_YOU_OPTION)
    @Nullable
    private String thankYouOption;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_CLIENTLIB_REF)
    @Nullable
    private String clientLibRef;

    @ValueMapValue(name = FD_HAMBURGER_MENU, injectionStrategy = InjectionStrategy.OPTIONAL)
    private Boolean hamburgerMenu = false;

    protected String contextPath = StringUtils.EMPTY;
    private boolean formDataEnabled = false;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_TITLE)
    @Nullable
    private String title;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_REDIRECT)
    @Nullable
    private String redirect;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_PREFILL_SERVICE)
    @Nullable
    private String prefillService;

    @ValueMapValue(name = FD_ROLE_ATTRIBUTE, injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String roleAttribute;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_DATA)
    @Nullable
    private String data;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_SPEC_VERSION)
    @Default(values = DEFAULT_FORMS_SPEC_VERSION)
    private String specVersion;

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
        return specVersion;
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
        String parentPagePath = getParentPagePath();
        if (GuideWCMUtils.isForms(parentPagePath)) {
            return ComponentUtils.getEncodedPath(parentPagePath);
        } else {
            // handling use-case when AF is used in iframe mode inside embed form component
            if (request != null && request.getAttribute("formRenderingInsideEmbedContainer") != null) {
                return ComponentUtils.getEncodedPath(StringUtils.replace(getPath(), "/" + JcrConstants.JCR_CONTENT + "/"
                    + GuideConstants.GUIDE_CONTAINER_NODE_NAME, ""));
            }
            return ComponentUtils.getEncodedPath(getPath());
        }
    }

    @JsonIgnore
    @Nullable
    public String getRedirectUrl() {
        String redirectURL = GuideUtils.getRedirectUrl(redirect, getPath());
        // Only do this if redirect configured to relative URL, that is, page hosted on same AEM
        if (StringUtils.isNotEmpty(redirectURL) && redirectURL.startsWith("/")) {
            redirectURL = getContextPath() + redirectURL;
        }
        return redirectURL;
    }

    @JsonIgnore
    @Nullable
    public String getPrefillService() {
        return prefillService;
    }

    @JsonIgnore
    public Boolean getHamburgerMenu() {
        return hamburgerMenu;
    }

    @Override
    public String getRoleAttribute() {
        return roleAttribute;
    }

    @Override
    public String getAction() {
        return getContextPath() + ADOBE_GLOBAL_API_ROOT + FORMS_RUNTIME_API_GLOBAL_ROOT + "/submit/" + getId();
    }

    @Override
    @JsonIgnore
    public String getDataUrl() {
        return getContextPath() + ADOBE_GLOBAL_API_ROOT + FORMS_RUNTIME_API_GLOBAL_ROOT + "/data/" + getId();
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
    public String getContainingPageLang() {
        // todo: right now it is copy of aem form because app is part of far, and af-apps is not pare of far
        if (request != null) {
            Page currentPage = getCurrentPage();
            if (!GuideWCMUtils.isForms(currentPage.getPath())) {
                String pagePath = currentPage.getPath(), pageLocaleRoot = LanguageUtil.getLanguageRoot(pagePath), locale = "";
                if (StringUtils.isNotBlank(pageLocaleRoot)) {
                    int localeStartIndex = StringUtils.lastIndexOf(pageLocaleRoot, '/');
                    locale = StringUtils.substring(pageLocaleRoot, localeStartIndex + 1);
                }
                return locale;
            } else {
                return FormContainer.super.getContainingPageLang();
            }
        } else {
            return FormContainer.super.getContainingPageLang();
        }
    }

    @Override
    public String getLanguageDirection() {
        return GuideUtils.getLanguageDirection(getLang());
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
        properties.put(FD_HAMBURGER_MENU, getHamburgerMenu());
        // adding a custom property to know if form data is enabled
        // this is done so that an extra API call from the client can be avoided
        if (StringUtils.isNotBlank(getPrefillService()) ||
            (request != null && StringUtils.isNotBlank(request.getParameter(GuideConstants.AF_DATA_REF)))) {
            formDataEnabled = true;
        }
        properties.put(FD_ROLE_ATTRIBUTE, getRoleAttribute());
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
