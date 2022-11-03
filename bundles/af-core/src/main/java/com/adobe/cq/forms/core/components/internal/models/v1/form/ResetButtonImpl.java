package com.adobe.cq.forms.core.components.internal.models.v1.form;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.Button;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.Nullable;

@Model(
        adaptables = { SlingHttpServletRequest.class, Resource.class },
        adapters = { Button.class, ComponentExporter.class },
        resourceType = { FormConstants.RT_FD_FORM_RESET_BUTTON_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class ResetButtonImpl extends ButtonImpl {
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "actionType")
    @Nullable
    protected String actionType;

    public String getActionType() {
        return actionType;
    }
}
