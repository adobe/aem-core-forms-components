package com.adobe.cq.forms.core.components.internal.models.v1.form;

import java.util.Date;

import javax.annotation.Nullable;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.PasswordInput;
import com.adobe.cq.forms.core.components.util.AbstractFieldImpl;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { PasswordInput.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_PASSWORD_V1 })
@Exporter(
    name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
    extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class PasswordInputImpl extends AbstractFieldImpl implements PasswordInput {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Default(booleanValues = false)
    protected boolean multiLine;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String format;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "pattern")
    @Nullable
    protected String pattern;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    protected String autocomplete;

    @Override
    public boolean isMultiLine() {
        return multiLine;
    }

    @Override
    public String getFieldType() {
        if (isMultiLine()) {
            return FieldType.MULTILINE_INPUT.getValue();
        } else {
            return super.getFieldType();
        }
    }

    @Override
    @Nullable
    public Integer getMinLength() {
        return minLength;
    }

    @Override
    @Nullable
    public Integer getMaxLength() {
        return maxLength;
    }

    @Override
    @Nullable
    public String getPattern() {
        return pattern;
    }

    @Override
    public String getAutoComplete() {
        return autocomplete;
    }

    @Override
    @Nullable
    public Long getMinimum() {
        return minimum;
    }

    @Override
    @Nullable
    public Long getMaximum() {
        return maximum;
    }

    @Override
    public Long getExclusiveMaximum() {
        return exclusiveMaximum;
    }

    @Override
    public Long getExclusiveMinimum() {
        return exclusiveMinimum;
    }

    @Override
    public Date getMinimumDate() {
        return null;
    }

    @Override
    public Date getMaximumDate() {
        return null;
    }

    @Override
    public Date getExclusiveMaximumDate() {
        return null;
    }

    @Override
    public Date getExclusiveMinimumDate() {
        return null;
    }

    @Override
    @Nullable
    public String getFormat() {
        return format;
    }
}
