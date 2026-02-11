/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2023 Adobe
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.UUID;

import javax.annotation.Nonnull;
import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.SlingHttpServletRequestWrapper;
import org.apache.sling.i18n.ResourceBundleProvider;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.factory.ModelFactory;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.aemds.guide.utils.GuideUtils;
import com.adobe.aemds.guide.utils.TranslationUtils;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.internal.form.ReservedProperties;
import com.adobe.cq.forms.core.components.models.form.FormClientLibManager;
import com.adobe.cq.forms.core.components.models.form.FormComponent;
import com.adobe.cq.forms.core.components.models.form.FormContainer;
import com.adobe.cq.forms.core.components.models.form.Fragment;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.adobe.cq.forms.core.components.views.Views;
import com.day.cq.i18n.I18n;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Fragment.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_FRAGMENT_V1 })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class FragmentImpl extends PanelImpl implements Fragment {

    public static final String CUSTOM_FRAGMENT_PROPERTY_WRAPPER = "fd:fragment";
    private static final String PRINT_CHANNEL_PATH = "/" + "print";

    @OSGiService
    private SlingModelFilter slingModelFilter;

    @OSGiService
    private ModelFactory modelFactory;

    @OSGiService(
        filter = "(service.pid=org.apache.sling.i18n.impl.JcrResourceBundleProvider)",
        injectionStrategy = InjectionStrategy.OPTIONAL)
    private ResourceBundleProvider resourceBundleProvider;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_FRAGMENT_PATH)
    private String fragmentPath;

    private Resource fragmentContainer;

    @PostConstruct
    private void initFragmentModel() {
        ResourceResolver resourceResolver = resource.getResourceResolver();

        String updatedFragmentPath = this.getFragmentPathBasedOnChannel(fragmentPath);
        fragmentContainer = ComponentUtils.getFragmentContainer(resourceResolver, updatedFragmentPath);
        if (request != null) {
            FormClientLibManager formClientLibManager = request.adaptTo(FormClientLibManager.class);
            String clientLibRef = getClientLibForFragment();
            if (formClientLibManager != null && clientLibRef != null) {
                formClientLibManager.addClientLibRef(clientLibRef);
            }
        }
    }

    private String getFragmentPathBasedOnChannel(String fragmentPath) {
        if (FormConstants.CHANNEL_PRINT.equals(this.channel)) {
            return fragmentPath + PRINT_CHANNEL_PATH;
        }
        return fragmentPath;
    }

    @JsonView(Views.Author.class)
    public String getFragmentPath() {
        return fragmentPath;
    }

    @Override
    public @NotNull Map<String, ? extends ComponentExporter> getExportedItems() {
        if (itemModels == null) {
            itemModels = getChildrenModels(request, ComponentExporter.class);
        }
        return new LinkedHashMap<>(itemModels);
    }

    protected <T> Map<String, T> getChildrenModels(@Nullable SlingHttpServletRequest request, @NotNull Class<T> modelClass) {
        if (fragmentContainer == null) {
            return new LinkedHashMap<>();
        }
        List<Resource> filteredChildrenResources = getFilteredChildrenResources(fragmentContainer);
        SlingHttpServletRequest wrappedSlingHttpServletRequest = null;
        if (request != null) {
            wrappedSlingHttpServletRequest = new SlingHttpServletRequestWrapper(request) {

                @Override
                public Object getAttribute(String attrName) {
                    if (REQ_ATTR_RESOURCE_CALLER_PATH.equals(attrName)) {
                        String resourceCallerPath = (String) super.getAttribute(REQ_ATTR_RESOURCE_CALLER_PATH);
                        // If the attribute is already defined then we're in a nested situation.
                        // The code for computing the components id uses the root-most resource path
                        // (because of how componentContext is handled in HTML rendering, so we return
                        // that.
                        return (resourceCallerPath != null) ? resourceCallerPath : resource.getPath();
                    }
                    return super.getAttribute(attrName);
                }
            };
        }
        Map<String, T> models = getChildrenModels(wrappedSlingHttpServletRequest, modelClass, filteredChildrenResources);

        // Set i18n for fragment children since they are processed with request != null
        // Use fragment container-specific i18n to ensure correct resource bundle path
        if (i18n != null) {
            String tempLang = request != null ? GuideUtils.getAcceptLang(request) : lang;
            I18n fragmentI18n = getFragmentContainerI18n(tempLang);
            for (T model : models.values()) {
                if (model instanceof FormComponent) {
                    ((FormComponent) model).setI18n(fragmentI18n);
                    ((FormComponent) model).setLang(tempLang);
                }
            }
        }

        return models;
    }

    /**
     * Creates a new I18n object for fragment children using the fragment container resource path
     * instead of the parent form's resource path. This ensures that fragment children use the
     * correct resource bundle path for translations.
     * 
     * @return a new I18n object configured for the fragment container resource
     */
    private @Nonnull I18n getFragmentContainerI18n(@Nonnull String localeLang) {
        // Get the locale from the lang setter
        ResourceBundle resourceBundle = null;
        if (localeLang != null && fragmentContainer != null) {
            Locale desiredLocale = new Locale(localeLang);
            // Get the resource resolver from the fragment container
            ResourceResolver resourceResolver = fragmentContainer.getResourceResolver();
            // Get the dictionary path for the fragment container instead of the parent form
            String baseName = TranslationUtils.getDictionaryPath(resourceResolver, fragmentContainer.getPath());
            Resource baseResource = resourceResolver.getResource(baseName);
            if (resourceBundleProvider != null) {
                if (GuideUtils.isDesiredLocaleDictPresent(baseResource, desiredLocale)) {
                    // Use the fragment container's resource bundle if available
                    resourceBundle = resourceBundleProvider.getResourceBundle(baseName, desiredLocale);
                } else {
                    // Fallback to a random UUID-based resource bundle if fragment-specific translations are not available
                    resourceBundle = resourceBundleProvider.getResourceBundle("/" + UUID.randomUUID(), desiredLocale);
                }
            }
        }
        return new I18n(resourceBundle);
    }

    @Override
    @JsonIgnore
    public List<Resource> getFragmentChildren() {
        if (filteredChildComponents == null) {
            filteredChildComponents = getFilteredChildrenResources(fragmentContainer);
        }
        return new ArrayList<>(filteredChildComponents);
    }

    @JsonIgnore
    public Resource getFragmentContainer() {
        return fragmentContainer;
    }

    @JsonIgnore
    public String getFragmentTitle() {
        String fragmentTitle = "";
        if (fragmentContainer != null) {
            Resource jcrContentRes = fragmentContainer.getParent();
            if (jcrContentRes != null) {
                ValueMap vm = jcrContentRes.getValueMap();
                fragmentTitle = vm.get("jcr:title", StringUtils.EMPTY);
            }
        }
        return fragmentTitle;
    }

    @JsonIgnore
    public List<String> getTitleListOfChildren() {
        List<String> titleList = new ArrayList<>();
        if (filteredChildComponents == null) {
            filteredChildComponents = getFilteredChildrenResources(fragmentContainer);
        }
        for (Resource child : filteredChildComponents) {
            ValueMap vm = child.getValueMap();
            titleList.add(vm.get("jcr:title", StringUtils.EMPTY));
        }
        return titleList;
    }

    @Override
    public Map<String, Object> getProperties() {
        Map<String, Object> properties = super.getProperties();
        properties.put(CUSTOM_FRAGMENT_PROPERTY_WRAPPER, true);
        properties.put(ReservedProperties.PN_VIEWTYPE, "fragment");
        return properties;
    }

    @Override
    public Map<String, String[]> getEvents() {
        if (fragmentContainer != null) {
            Map<String, String[]> userEvents = new LinkedHashMap<>(getEventsForResource(fragmentContainer));
            Map<String, String[]> panelEvents = super.getEvents();
            for (Map.Entry<String, String[]> entry : panelEvents.entrySet()) {
                String[] existing = userEvents.get(entry.getKey());
                if (existing != null) {
                    String[] combined = Arrays.copyOf(existing, existing.length + entry.getValue().length);
                    System.arraycopy(entry.getValue(), 0, combined, existing.length, entry.getValue().length);
                    userEvents.put(entry.getKey(), combined);
                } else {
                    userEvents.put(entry.getKey(), entry.getValue());
                }
            }
            return userEvents;
        }
        return super.getEvents();
    }

    @Override
    public Map<String, String> getRules() {
        if (fragmentContainer != null) {
            Map<String, String> merged = new LinkedHashMap<>(super.getRules());
            merged.putAll(getRulesForResource(fragmentContainer));
            return merged;
        }
        return super.getRules();
    }

    private String getClientLibForFragment() {
        String clientLibRef = null;
        if (fragmentContainer != null) {
            FormContainer fragment = fragmentContainer.adaptTo(FormContainer.class);
            clientLibRef = fragment != null ? fragment.getClientLibRef() : null;
        }
        return clientLibRef;
    }
}
