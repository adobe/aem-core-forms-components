/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe
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
package com.adobe.cq.forms.core.components.internal.models.v1.aemform;

import javax.annotation.Nullable;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
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

import com.adobe.aemds.guide.utils.GuideConstants;
import com.adobe.aemds.guide.utils.GuideUtils;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.models.v1.AbstractComponentImpl;
import com.adobe.cq.forms.core.components.models.aemform.AEMForm;
import com.day.cq.commons.LanguageUtil;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.designer.Style;

@Model(
    adaptables = SlingHttpServletRequest.class,
    adapters = { AEMForm.class,
        ComponentExporter.class },
    resourceType = AEMFormImpl.RESOURCE_TYPE)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class AEMFormImpl extends AbstractComponentImpl implements AEMForm {

    public static final String RESOURCE_TYPE = "core/fd/components/aemform/v1/aemform";

    private static final Logger LOGGER = LoggerFactory.getLogger(AEMFormImpl.class);

    @Self
    protected SlingHttpServletRequest request;

    @ScriptVariable
    protected PageManager pageManager;

    @ScriptVariable
    private Page currentPage;

    @ScriptVariable
    protected Style currentStyle;

    @ScriptVariable
    protected ValueMap properties;

    @ValueMapValue(name = AEMForm.PN_THANK_YOU_PAGE, injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(values = "")
    protected String thankyouPage;

    @ValueMapValue(name = AEMForm.PN_THANK_YOU_CONFIG, injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(values = "page")
    protected String thankyouConfig;

    @ValueMapValue(name = AEMForm.PN_SUBMITTYPE, injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(values = "inline")
    protected String submitType;

    @ValueMapValue(name = AEMForm.PN_HEIGHT, injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(values = "auto")
    protected String height;

    @ValueMapValue(name = AEMForm.PN_THANK_YOU_MESSAGE, injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(values = "")
    protected String thankyouMessage;

    @ValueMapValue(name = AEMForm.PN_FORMTYPE, injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String formType;

    @ValueMapValue(name = AEMForm.PN_THEMEREF, injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(values = "")
    private String themeRef;

    @ValueMapValue(name = AEMForm.PN_DOCREF, injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(values = "")
    private String docRef;

    @ValueMapValue(name = AEMForm.PN_FORMREF, injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(values = "")
    private String formRef;

    @ValueMapValue(name = AEMForm.PN_CSSCLIENTLIB, injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(values = "")
    private String cssClientLib;

    @ValueMapValue(name = AEMForm.PN_USEIFRAME, injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(values = "false")
    private String useIframe;

    @ValueMapValue(name = AEMForm.PN_USEPAGELOCALE, injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(values = "false")
    private String usePageLocale;

    protected String getClientLibCategory(String themePath) {
        String clientLibCategory = "";
        if (StringUtils.isNotBlank(themePath)) {
            Resource themeResource = request.getResourceResolver().getResource(themePath + "/jcr:content/metadata");
            if (themeResource != null) {
                ValueMap themeProps = themeResource.getValueMap();
                return themeProps.get("clientlibCategory", "");
            }
        }
        return clientLibCategory;
    }

    @Override
    public String getThankyouConfig() {
        return thankyouConfig;
    }

    @Override
    public String getThankyouMessage() {
        return thankyouMessage;
    }

    @Override
    public String getThemeName() {
        return getClientLibCategory(themeRef);
    }

    private String getFormPath() {
        if ("adaptiveDocument".equals(formType)) {
            return docRef;
        } else {
            return formRef;
        }
    }

    @Override
    public String getFormPagePath() {
        String formPath = getFormPath();
        Boolean isMCDocument = isMCDocument();
        if (isMCDocument) {
            return GuideUtils.guideRefToDocPath(formPath);
        } else {
            return GuideUtils.guideRefToGuidePath(formPath);
        }
    }

    @Override
    public String getFormEditPagePath() {
        String formPagePath = getFormPagePath();
        return StringUtils.substringBefore(formPagePath, "/" + org.apache.jackrabbit.JcrConstants.JCR_CONTENT);
    }

    @Override
    public String getThemePath() {
        return StringUtils.isNotBlank(themeRef) ? themeRef + "/" + org.apache.jackrabbit.JcrConstants.JCR_CONTENT : "";
    }

    @Override
    public String getLocale() {
        String lang = "";
        if (usePageLocale != null && StringUtils.equals(usePageLocale, "true")) {
            lang = getPageLocale();
        }
        if (StringUtils.isBlank(lang) && (isAdaptiveForm() || isMCDocument())) {
            lang = GuideUtils.getLocale(request, request.getResourceResolver().getResource(getFormPagePath()));
        }
        return lang;
    }

    private String getPageLocale() {
        String pagePath = currentPage.getPath(), pageLocaleRoot = LanguageUtil.getLanguageRoot(pagePath), locale = "";
        if (StringUtils.isNotBlank(pageLocaleRoot)) {
            int localeStartIndex = StringUtils.lastIndexOf(pageLocaleRoot, '/');
            locale = StringUtils.substring(pageLocaleRoot, localeStartIndex + 1);
        }
        return locale;
    }

    @Override
    public String getSubmitType() {
        if ("message".equals(getThankyouConfig())) {
            return "inline";
        }
        return submitType;
    }

    @Override
    public String getCssClientlib() {
        return cssClientLib;
    }

    @Override
    public FormType getFormType() {
        FormType formType = FormType.NO_FORM_SELECTED;
        String formPath = getFormPath();
        if (!("".equals(formPath))) {
            ResourceResolver resolver = request.getResourceResolver();
            if (GuideUtils.isValidFormResource(resolver, formPath, GuideConstants.ADAPTIVE_FORM)) {
                formType = FormType.ADAPTIVE_FORM;
            } else if (GuideUtils.isValidFormResource(resolver, formPath, GuideConstants.MC_DOCUMENT)) {
                formType = FormType.MC_DOCUMENT;
            } else if (GuideUtils.isValidFormResource(resolver, formPath, GuideConstants.XFA_FORM)) {
                formType = FormType.MOBILE_FORM;
            }
        }
        return formType;
    }

    @Override
    public String getUseIframe() {
        return useIframe;
    }

    @Override
    public boolean isAdaptiveForm() {
        return FormType.ADAPTIVE_FORM.equals(getFormType());
    }

    @Override
    public boolean isMCDocument() {
        return FormType.MC_DOCUMENT.equals(getFormType());
    }

    @Override
    public boolean isMobileForm() {
        return FormType.MOBILE_FORM.equals(getFormType());
    }

    @Override
    public boolean isMobileFormset() {
        return FormType.MOBILE_FORMSET.equals(getFormType());
    }

    @Override
    public boolean isFormSelected() {
        return !FormType.NO_FORM_SELECTED.equals(getFormType());
    }

    @Override
    public String getThankyouPage() {
        return GuideUtils.getRedirectUrl(thankyouPage, null);
    }

    @Override
    public String getHeight() {
        if (!"auto".equals(height)) {
            try {
                height = Integer.parseInt(height) + "px";
            } catch (NumberFormatException ex) {
                height = "auto";
            }
        }
        return height;
    }
}
