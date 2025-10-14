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

import java.io.StringWriter;
import java.io.Writer;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.forms.core.components.internal.constants.ThemeConstants;
import com.adobe.cq.forms.core.components.models.form.FormContainer;
import com.adobe.cq.forms.core.components.models.form.FormStructureParser;
import com.adobe.cq.forms.core.components.models.form.HtlUtil;
import com.adobe.cq.forms.core.components.util.ComponentUtils;
import com.adobe.cq.forms.core.components.views.Views;
import com.fasterxml.jackson.core.SerializableString;
import com.fasterxml.jackson.core.io.CharacterEscapes;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

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
    public String getThemeClientLibRefFromFormContainer() {
        String themeContentPath = null;
        String themeClientLibRef = null;
        if (request != null) {
            themeContentPath = (String) request.getAttribute(ThemeConstants.THEME_OVERRIDE); // theme editor use-case
        }
        if (StringUtils.isBlank(themeContentPath)) {
            if (request != null) {
                themeContentPath = request.getParameter(ThemeConstants.THEME_OVERRIDE); // embed component use-case
            }
            if (StringUtils.isBlank(themeContentPath)) {
                themeContentPath = getPropertyFromFormContainer(resource, ThemeConstants.THEME_REF); // normal including theme in form
                                                                                                     // runtime
            }
        }
        // get client library from theme content path
        if (StringUtils.isNotBlank(themeContentPath)) {
            Resource themeResource = resource.getResourceResolver().getResource(themeContentPath + ThemeConstants.RELATIVE_PATH_METADATA);
            if (themeResource != null) {
                ValueMap themeProps = themeResource.getValueMap();
                themeClientLibRef = themeProps.get(ThemeConstants.PROPERTY_CLIENTLIB_CATEGORY, "");
            } else {
                logger.error("Invalid Theme Name {}", themeContentPath);
            }
        }

        return themeClientLibRef;
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
            HTMLCharacterEscapes htmlCharacterEscapes = new HTMLCharacterEscapes();
            ObjectMapper mapper = new ObjectMapper();
            Writer writer = new StringWriter();
            ObjectWriter objectWriter;
            boolean isSubmissionView = false;
            if (request != null) {
                HtlUtil htlUtil = request.adaptTo(HtlUtil.class);
                isSubmissionView = (htlUtil != null && htlUtil.isEdgeDeliveryRequest())
                    || ComponentUtils.shouldIncludeSubmitProperties(request);
            }

            if (isSubmissionView) {
                request.setAttribute(FormConstants.X_ADOBE_FORM_DEFINITION, FormConstants.FORM_DEFINITION_SUBMISSION);
            }
            objectWriter = mapper.writerWithView(Views.Publish.class);
            objectWriter.getFactory().setCharacterEscapes(htmlCharacterEscapes);
            objectWriter.writeValue(writer, formContainer);
            result = writer.toString();
        } catch (Exception e) {
            logger.error("Unable to generate json from resource", e);
        }
        return result;
    }

    private static final class HTMLCharacterEscapes extends CharacterEscapes {
        private final int[] asciiEscapes;

        public HTMLCharacterEscapes() {
            // start with set of characters known to require escaping (double-quote, backslash etc)
            int[] esc = CharacterEscapes.standardAsciiEscapesForJSON();
            // and force escaping of a few others:
            esc['<'] = CharacterEscapes.ESCAPE_STANDARD;
            esc['>'] = CharacterEscapes.ESCAPE_STANDARD;
            esc['&'] = CharacterEscapes.ESCAPE_STANDARD;
            esc['\''] = CharacterEscapes.ESCAPE_STANDARD;
            asciiEscapes = esc;
        }

        @Override
        public int[] getEscapeCodesForAscii() {
            return asciiEscapes;
        }

        @Override
        public SerializableString getEscapeSequence(int ch) {
            return null;
        }
    }
}
