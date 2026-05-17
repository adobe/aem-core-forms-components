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
package com.adobe.cq.forms.core.components.internal.models.v1.form;

import java.util.Map;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.SignatureStep;
import com.adobe.cq.forms.core.components.util.AbstractBaseImpl;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { SignatureStep.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_SIGNATURE_STEP_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class SignatureStepImpl extends AbstractBaseImpl implements SignatureStep {

    static final String PROP_SIGNING_SERVICE = "signingService";
    static final String PROP_CLOUD_SERVICE_CONFIG = "cq:cloudserviceconfigs";
    static final String PROP_DISPLAY_MSG = "displayMsg";
    static final String PROP_TARGET_VERSION = "fd:targetVersion";

    static final String DEFAULT_SIGNING_SERVICE = "echosign";
    static final String DEFAULT_DISPLAY_MSG = "";
    static final String DEFAULT_TARGET_VERSION = "";

    static final String VIEW_TYPE_SIGNATURE_STEP = "signature-step";

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = PROP_SIGNING_SERVICE)
    @Default(values = DEFAULT_SIGNING_SERVICE)
    private String signingService;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = PROP_CLOUD_SERVICE_CONFIG)
    @Nullable
    private String cloudServiceConfig;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = PROP_DISPLAY_MSG)
    @Nullable
    private String displayMsg;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = PROP_TARGET_VERSION)
    @Nullable
    private String targetVersion;

    @Override
    public String getSigningService() {
        return signingService;
    }

    @Override
    public String getCloudServiceConfig() {
        return cloudServiceConfig != null ? cloudServiceConfig : "";
    }

    @Override
    public String getDisplayMsg() {
        return displayMsg;
    }

    @Override
    public String getTargetVersion() {
        return targetVersion;
    }

    @Override
    public String getFieldType() {
        return super.getFieldType(FieldType.PLAIN_TEXT);
    }

    @Override
    public @NotNull Map<String, Object> getProperties() {
        Map<String, Object> properties = super.getProperties();
        properties.put("fd:signingService", getSigningService());
        if (!getCloudServiceConfig().isEmpty()) {
            properties.put("fd:cloudServiceConfig", getCloudServiceConfig());
        }
        if (getDisplayMsg() != null) {
            properties.put("fd:displayMsg", getDisplayMsg());
        }
        if (getTargetVersion() != null && !getTargetVersion().isEmpty()) {
            properties.put("fd:targetVersion", getTargetVersion());
        }
        return properties;
    }
}
