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

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.osgi.services.HttpClientBuilderFactory;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.*;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.aemds.guide.common.GuideContainer;
import com.adobe.aemds.guide.service.CoreComponentCustomPropertiesProvider;
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
import com.adobe.cq.forms.core.components.models.form.AutoSaveConfiguration;
import com.adobe.cq.forms.core.components.models.form.Container;
import com.adobe.cq.forms.core.components.models.form.FieldType;
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
import com.fasterxml.jackson.annotation.JsonProperty;

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
    private static final String FD_IS_HAMBURGER_MENU_ENABLED = "fd:isHamburgerMenuEnabled";
    public static final String FD_FORM_DATA_ENABLED = "fd:formDataEnabled";
    public static final String FD_ROLE_ATTRIBUTE = "fd:roleAttribute";
    private static final String FD_CUSTOM_FUNCTIONS_URL = "fd:customFunctionsUrl";
    private static final String FD_DATA_URL = "fd:dataUrl";
    private static final String FD_VIEW_PRINT_PATH = "fd:view/print";
    private static final String EXCLUDE_FROM_DOR_IF_HIDDEN = "excludeFromDoRIfHidden";

    /** Constant representing email submit action type */
    private static final String SS_EMAIL = "email";

    /** Constant representing spreadsheet submit action type */
    private static final String SS_SPREADSHEET = "spreadsheet";

    @OSGiService(injectionStrategy = InjectionStrategy.OPTIONAL)
    private CoreComponentCustomPropertiesProvider coreComponentCustomPropertiesProvider;

    @OSGiService(injectionStrategy = InjectionStrategy.OPTIONAL)
    private HttpClientBuilderFactory clientBuilderFactory;

    private static final String DRAFT_PREFILL_SERVICE = "service://FP/draft/";

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

    @ValueMapValue(name = FD_IS_HAMBURGER_MENU_ENABLED, injectionStrategy = InjectionStrategy.OPTIONAL)
    private Boolean isHamburgerMenuEnabled = false;

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

    @Nullable
    private Boolean excludeFromDoRIfHidden;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_SPEC_VERSION)
    @Default(values = DEFAULT_FORMS_SPEC_VERSION)
    private String specVersion;

    @Self(injectionStrategy = InjectionStrategy.OPTIONAL)
    private AutoSaveConfiguration autoSaveConfig;

    @Inject
    private ResourceResolver resourceResolver;

    @Override
    public String getFieldType() {
        return super.getFieldType(FieldType.FORM);
    }

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

    @PostConstruct
    private void initExcludeFromDoRIfHidden() {
        Resource viewPrintResource = resource.getChild(FD_VIEW_PRINT_PATH);
        if (viewPrintResource != null) {
            ValueMap vm = viewPrintResource.getValueMap();
            if (vm.containsKey(EXCLUDE_FROM_DOR_IF_HIDDEN)) {
                excludeFromDoRIfHidden = vm.get(EXCLUDE_FROM_DOR_IF_HIDDEN, Boolean.class);
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

    public Boolean getIsHamburgerMenuEnabled() {
        return isHamburgerMenuEnabled;
    }

    @Override
    public String getRoleAttribute() {
        return roleAttribute;
    }

    @Override
    public String getAction() {
        String resourceType = resource.getValueMap().get("sling:resourceType", String.class);
        if (resourceType != null && resourceType.contains("/franklin")) {
            return "";
        } else {
            return getContextPath() + resourceResolver.map(ADOBE_GLOBAL_API_ROOT + FORMS_RUNTIME_API_GLOBAL_ROOT + "/submit/" + getId());
        }
    }

    @Override
    @JsonIgnore
    public String getDataUrl() {
        return getContextPath() + resourceResolver.map(ADOBE_GLOBAL_API_ROOT + FORMS_RUNTIME_API_GLOBAL_ROOT + "/data/" + getId());
    }

    @Override
    @JsonProperty("lang")
    public String getLang() {
        if (lang != null) {
            return lang;
        } else if (request != null) {
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
        Map<String, Object> properties = new LinkedHashMap<>();
        if (coreComponentCustomPropertiesProvider != null) {
            Map<String, Object> customProperties = coreComponentCustomPropertiesProvider.getProperties();
            if (customProperties != null) {
                properties.putAll(customProperties);
            }
        }
        properties.putAll(super.getProperties());
        if (getSchemaType() != null) {
            properties.put(FD_SCHEMA_TYPE, getSchemaType());
        }
        if (StringUtils.isNotBlank(getSchemaRef())) {
            properties.put(FD_SCHEMA_REF, getSchemaRef());
        }
        properties.put(FD_IS_HAMBURGER_MENU_ENABLED, getIsHamburgerMenuEnabled());
        // adding a custom property to know if form data is enabled
        // this is done so that an extra API call from the client can be avoided
        if (StringUtils.isNotBlank(getPrefillService()) ||
            (request != null && StringUtils.isNotBlank(request.getParameter(GuideConstants.AF_DATA_REF)))) {
            formDataEnabled = true;
        }

        // set draftId in properties in case of forms portal prefill
        if (request != null && StringUtils.isNotBlank(request.getParameter(GuideConstants.AF_DATA_REF))) {
            final String dataRef = request.getParameter(GuideConstants.AF_DATA_REF);
            if (dataRef.startsWith(DRAFT_PREFILL_SERVICE)) {
                properties.put(ReservedProperties.FD_DRAFT_ID, StringUtils.substringAfter(dataRef, DRAFT_PREFILL_SERVICE));
            }
        }
        properties.put(FD_ROLE_ATTRIBUTE, getRoleAttribute());
        properties.put(FD_FORM_DATA_ENABLED, formDataEnabled);
        if (this.autoSaveConfig != null && this.autoSaveConfig.isEnableAutoSave()) {
            properties.put(ReservedProperties.FD_AUTO_SAVE_PROPERTY_WRAPPER, this.autoSaveConfig);
        }
        properties.put(FD_CUSTOM_FUNCTIONS_URL, getCustomFunctionUrl());
        properties.put(FD_DATA_URL, getDataUrl());
        Map<String, Object> submitProperties = getSubmitProperties();
        if (submitProperties != null && !submitProperties.isEmpty()) {
            properties.put(ReservedProperties.FD_SUBMIT_PROPERTIES, submitProperties);
        }
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
        if (excludeFromDoRIfHidden != null) {
            customDorProperties.put(ReservedProperties.FD_EXCLUDE_FROM_DOR_IF_HIDDEN, excludeFromDoRIfHidden);
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

    @Override
    public String getCustomFunctionUrl() {
        return getContextPath() + resourceResolver.map(ADOBE_GLOBAL_API_ROOT + FORMS_RUNTIME_API_GLOBAL_ROOT + "/customfunctions/"
            + getId());
    }

    @JsonIgnore
    @Override
    public AutoSaveConfiguration getAutoSaveConfig() {
        return autoSaveConfig;
    }

    private Map<String, Object> getSubmitProperties() {

        Map<String, Object> submitProps = null;

        if (request == null || ComponentUtils.shouldIncludeSubmitProperties(request)) {
            submitProps = new LinkedHashMap<>();
            List<String> submitActionProperties = Arrays.asList(
                ReservedProperties.PN_SUBMIT_ACTION_TYPE,
                ReservedProperties.PN_SUBMIT_ACTION_NAME);

            List<String> submitEmailProperties = Arrays.asList(
                ReservedProperties.PN_SUBMIT_EMAIL_TO,
                ReservedProperties.PN_SUBMIT_EMAIL_FROM,
                ReservedProperties.PN_SUBMIT_EMAIL_SUBJECT,
                ReservedProperties.PN_SUBMIT_EMAIL_CC,
                ReservedProperties.PN_SUBMIT_EMAIL_BCC);

            List<String> submitSpreadsheetProperties = Arrays.asList(
                ReservedProperties.PN_SUBMIT_SPREADSHEETURL);
            ValueMap resourceMap = resource.getValueMap();
            for (Map.Entry<String, Object> entry : resourceMap.entrySet()) {
                if (submitActionProperties.contains(entry.getKey())) {
                    submitProps.put(entry.getKey(), entry.getValue());
                } else if (submitEmailProperties.contains(entry.getKey())) {
                    submitProps.computeIfAbsent(SS_EMAIL, k -> new LinkedHashMap<String, Object>());
                    ((Map<String, Object>) submitProps.get(SS_EMAIL)).put(entry.getKey(), entry.getValue());
                } else if (submitSpreadsheetProperties.contains(entry.getKey())) {
                    submitProps.computeIfAbsent(SS_SPREADSHEET, k -> new LinkedHashMap<String, Object>());
                    ((Map<String, Object>) submitProps.get(SS_SPREADSHEET)).put(entry.getKey(), entry.getValue());
                }
            }
            submitProps.put("aemDomainPublish", System.getenv("AEM_DOMAIN_PUBLISH"));
        }
        return submitProps;
    }

}
