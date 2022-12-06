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
package com.adobe.cq.forms.core.components.models.aemform;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Nonnull;

import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ConsumerType;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.wcm.core.components.models.Component;
import com.adobe.cq.wcm.core.components.models.HtmlPageItem;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Defines the {@code AEMForm} Sling Model used for the {@code /apps/core/fd/components/aemform} component.
 *
 * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1
 */
@ConsumerType
public interface AEMForm extends Component {

    /**
     * Defines the form type
     */
    enum FormType {
        NO_FORM_SELECTED, MOBILE_FORM, ADAPTIVE_FORM, MC_DOCUMENT, MOBILE_FORMSET
    }

    /**
     * Name of the resource property that defines the thank you config.
     *
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1
     */
    String PN_THANK_YOU_CONFIG = "thankyouConfig";

    /**
     * Name of the resource property that defines the thank you page
     *
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1
     */
    String PN_THANK_YOU_PAGE = "thankyouPage";

    /**
     * Name of the resource property that defines the thank you message.
     *
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1
     */
    String PN_THANK_YOU_MESSAGE = "thankyouMessage";

    /**
     * Name of the resource property that defines the type of the form
     *
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1
     */
    String PN_FORMTYPE = "formType";

    /**
     * Name of the resource property that defines the form reference
     *
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1
     */
    String PN_FORMREF = "formRef";

    /**
     * Name of the resource property that defines the document reference
     *
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1
     */
    String PN_DOCREF = "docRef";

    /**
     * Name of the resource property that defines the theme ref property.
     *
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1
     */
    String PN_THEMEREF = "themeRef";

    /**
     * Name of the resource property that defines the submit type
     *
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1
     */
    String PN_SUBMITTYPE = "submitType";

    /**
     * Name of the resource property that defines the client library
     *
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1
     */
    String PN_CSSCLIENTLIB = "cssClientlib";

    /**
     * Name of the resource property that defines the height
     *
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1
     */
    String PN_HEIGHT = "height";

    /**
     * Name of the resource property that defines whether to use iframe or not
     *
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1
     */
    String PN_USEIFRAME = "useiframe";

    /**
     * Name of the resource property that defines whether to use page locale or not
     *
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1
     */
    String PN_USEPAGELOCALE = "usePageLocale";

    /**
     * Name of the resource property that defines whether to enable focus on first field of form or not
     *
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.14
     */
    String PN_ENABLEFOCUSONFIRSTFIELD = "enableFocusOnFirstField";

    /**
     * Returns the form type
     *
     * @return the form type, if one was set
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1;
     */
    default FormType getFormType() {
        throw new UnsupportedOperationException();
    }

    /**
     * Returns the theme path
     *
     * @return the theme path, if one was set, or {@code null}
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1;
     */
    default String getThemePath() {
        throw new UnsupportedOperationException();
    }

    /**
     * Returns the form edit page path
     *
     * @return the form path, if one was set
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1;
     */
    default String getFormEditPagePath() {
        throw new UnsupportedOperationException();
    }

    /**
     * Returns the form page path (ie) path to the container of the form resource
     *
     * @return the form page path, if one was set
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1;
     */
    @JsonIgnore
    default String getFormPagePath() {
        throw new UnsupportedOperationException();
    }

    /**
     * Returns the form locale
     *
     * @return the form locale, if one was set
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1;
     */
    default String getLocale() {
        throw new UnsupportedOperationException();
    }

    /**
     * Returns the thank you configuration
     *
     * @return the form type, if one was set
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1;
     */
    default String getThankyouConfig() {
        throw new UnsupportedOperationException();
    }

    /**
     * Returns the thank you page
     *
     * @return the form type, if one was set, or {@code null}
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1;
     */
    default String getThankyouPage() {
        throw new UnsupportedOperationException();
    }

    /**
     * Returns the thank you message
     *
     * @return the thank you message, if one was set, or {@code null}
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1;
     */
    default String getThankyouMessage() {
        throw new UnsupportedOperationException();
    }

    /**
     * Returns the name of the theme
     *
     * @return the theme name, if one was set, or {@code null}
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1;
     */
    default String getThemeName() {
        throw new UnsupportedOperationException();
    }

    /**
     * Returns the submit type for the form
     *
     * @return the submit type, if one was set, or {@code null}
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1;
     */
    default String getSubmitType() {
        throw new UnsupportedOperationException();
    }

    /**
     * Returns the CSS client library
     *
     * @return the css client library, if one was set, or {@code null}
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1;
     */
    default String getCssClientlib() {
        throw new UnsupportedOperationException();
    }

    /**
     * Returns the height of the form/document
     *
     * @return the height, if one was set, or {@code null}
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1;
     */
    default String getHeight() {
        throw new UnsupportedOperationException();
    }

    /**
     * Indicates if the form is configured to enable focus on first field or not
     *
     * @return true if the form is configured to enable focus on first field; false otherwise
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.14;
     */
    default boolean getEnableFocusOnFirstField() {
        throw new UnsupportedOperationException();
    }

    /**
     * Indicates if the form is configured to use iframe or not
     *
     * @return "true" if the form is configured to use iframe; "false" otherwise
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1;
     */
    default String getUseIframe() {
        throw new UnsupportedOperationException();
    }

    /**
     * Indicates if the form configured is Adaptive form or not
     *
     * @return true if the form is adaptive form; false otherwise
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1;
     */
    @JsonIgnore
    default boolean isAdaptiveForm() {
        throw new UnsupportedOperationException();
    }

    /**
     * Indicates if the form configured is multi channel document or not
     *
     * @return true if the form is multi channel document; false otherwise
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1;
     */
    @JsonIgnore
    default boolean isMCDocument() {
        throw new UnsupportedOperationException();
    }

    /**
     * Indicates if the form configured is mobile form or not
     *
     * @return true if the form is mobile form; false otherwise
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1;
     */
    @JsonIgnore
    default boolean isMobileForm() {
        throw new UnsupportedOperationException();
    }

    /**
     * Indicates if the form configured is mobile formset or not
     *
     * @return true if the form is mobile formset; false otherwise
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1;
     */
    @JsonIgnore
    default boolean isMobileFormset() {
        throw new UnsupportedOperationException();
    }

    /**
     * Indicates if the form is selector or not
     *
     * @return true if a form is selected; false otherwise
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1;
     */
    @JsonIgnore
    default boolean isFormSelected() {
        throw new UnsupportedOperationException();
    }

    /**
     * @see ComponentExporter#getExportedType()
     * @since com.adobe.cq.forms.core.components.models.aemform 0.0.1
     */
    @Nonnull
    @Override
    default String getExportedType() {
        throw new UnsupportedOperationException();
    }

    /**
     * Returns a list of HTML items that should be included in the form
     *
     * @return list of page items
     * @since com.adobe.cq.forms.core.components.models.aemform 1.2.0
     */
    @Nullable
    @JsonIgnore
    default List<HtmlPageItem> getHtmlPageItems() {
        return new ArrayList();
    }

}
