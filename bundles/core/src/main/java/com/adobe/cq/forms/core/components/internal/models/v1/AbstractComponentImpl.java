/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2024 Adobe
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
package com.adobe.cq.forms.core.components.internal.models.v1;

import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.osgi.annotation.versioning.ConsumerType;

import com.adobe.cq.wcm.core.components.internal.ContentFragmentUtils;
import com.adobe.cq.wcm.core.components.models.Component;
import com.adobe.cq.wcm.core.components.util.ComponentUtils;
import com.adobe.cq.wcm.style.ComponentStyleInfo;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.components.ComponentContext;

/**
 * Abstract class that can be used as a base class for {@link Component} implementations.
 */
@ConsumerType
public abstract class AbstractComponentImpl implements Component {

    /**
     * The current request.
     */
    @Self(injectionStrategy = InjectionStrategy.OPTIONAL)
    protected SlingHttpServletRequest request;

    /**
     * The current resource.
     */
    @SlingObject
    protected Resource resource;

    /**
     * The component.
     */
    @ScriptVariable(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected com.day.cq.wcm.api.components.Component component;

    /**
     * The component context.
     */
    @ScriptVariable(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected ComponentContext componentContext;

    /**
     * The current page.
     */
    @ScriptVariable(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private Page currentPage;

    /**
     * The ID for this component.
     */
    private String id;

    @NotNull
    @Override
    public String getId() {
        if (id == null) {
            String resourceCallerPath = (String) request.getAttribute(ContentFragmentUtils.ATTR_RESOURCE_CALLER_PATH);
            this.id = ComponentUtils.getId(this.resource, this.currentPage, resourceCallerPath, this.componentContext);
        }
        return id;
    }

    @NotNull
    @Override
    public String getExportedType() {
        return resource.getResourceType();
    }

    /**
     * See {@link Component#getAppliedCssClasses()}
     *
     * @return The component styles/css class names
     */
    @Override
    @Nullable
    public String getAppliedCssClasses() {

        return Optional.ofNullable(this.resource.adaptTo(ComponentStyleInfo.class))
            .map(ComponentStyleInfo::getAppliedCssClasses)
            .filter(StringUtils::isNotBlank)
            .orElse(null);		// Returning null so sling model exporters don't return anything for this property if not configured
    }

}
