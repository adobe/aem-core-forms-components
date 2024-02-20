package com.adobe.cq.forms.core.components.internal.models.v1.form;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.models.form.ScribbleSignature;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { ScribbleSignature.class, ComponentExporter.class },
    resourceType = { "core/fd/components/form/scribblesignature/v1/scribblesignature" })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class ScribbleSignatureImpl extends AbstractFieldImpl implements ScribbleSignature {

    @SlingObject
    private Resource resource;

    @ValueMapValue(name = "valueAsBase64")
    @Default(values = "")
    private String valueAsBase64;

    @Override
    public String getValueAsBase64() {
        return valueAsBase64;
    }

    @Override
    public String getExportedType() {
        return resource.getResourceType();
    }
}
