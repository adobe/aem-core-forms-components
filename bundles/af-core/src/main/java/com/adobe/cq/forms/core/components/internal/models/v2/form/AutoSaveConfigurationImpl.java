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
package com.adobe.cq.forms.core.components.internal.models.v2.form;

import javax.annotation.PostConstruct;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.ReservedProperties;
import com.adobe.cq.forms.core.components.models.form.AutoSaveConfiguration;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = AutoSaveConfiguration.class)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class AutoSaveConfigurationImpl implements AutoSaveConfiguration {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.FD_ENABLE_AUTO_SAVE)
    @Default(booleanValues = false)
    @JsonProperty(ReservedProperties.FD_ENABLE_AUTO_SAVE)
    private boolean enableAutoSave;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.FD_AUTO_SAVE_STRATEGY_TYPE)
    @JsonIgnore
    private String autoSaveStrategyJcr;

    @JsonProperty(ReservedProperties.FD_AUTO_SAVE_STRATEGY_TYPE)
    private AutoSaveStrategyType autoSaveStrategyType;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.FD_AUTO_SAVE_INTERVAL)
    @JsonProperty(ReservedProperties.FD_AUTO_SAVE_INTERVAL)
    private Integer autoSaveInterval;

    @Override
    public boolean isEnableAutoSave() {
        return enableAutoSave;
    }

    @Override
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public AutoSaveStrategyType getAutoSaveStrategyType() {
        return autoSaveStrategyType;
    }

    @Override
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public Integer getAutoSaveInterval() {
        return autoSaveInterval;
    }

    @PostConstruct
    protected void initAutoSaveConfiguration() {
        autoSaveStrategyType = AutoSaveStrategyType.fromString(autoSaveStrategyJcr);
    }

}
