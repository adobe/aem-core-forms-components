/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2026 Adobe
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
import com.adobe.cq.forms.core.components.internal.form.ReservedProperties;
import com.adobe.cq.forms.core.components.models.form.Base;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.Text;
import com.adobe.cq.forms.core.components.util.AbstractBaseImpl;
import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Sling Model for the Adobe Sign Block core component.
 *
 * <p>
 * Extends {@link AbstractBaseImpl} (same base as all other form field components) so it participates correctly in
 * form-model serialisation and test casting. Implements the {@link Text} interface — replicating the rich-text value
 * and fieldType behaviour from {@link TextImpl} — while inheriting:
 * </p>
 * <ul>
 * <li>{@code getLabel()} from {@link AbstractBaseImpl}: builds a {@code LabelImpl} from {@code jcr:title} and
 * {@code hideTitle}, putting the authored title into the component's JSON model so the form engine and Rules Engine can
 * update it.</li>
 * <li>{@code getDataRef()} from {@link com.adobe.cq.forms.core.components.util.AbstractFormComponentImpl}: serialises
 * the {@code dataRef} JCR property into the JSON model, wiring up the bind-reference backend.</li>
 * </ul>
 */
@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Text.class,
        Base.class,
        ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_ADOBE_SIGN_BLOCK_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class AdobeSignBlockImpl extends AbstractBaseImpl implements Text {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_TEXT_IS_RICH)
    @Default(booleanValues = false)
    private boolean textIsRich;

    @Override
    public String getValue() {
        return translate("value", value);
    }

    @Override
    public boolean isRichText() {
        return textIsRich;
    }

    /**
     * Excluded from JSON; the rich-text content is surfaced via {@link #getValue()}.
     */
    @Override
    @JsonIgnore
    public String getText() {
        return getValue();
    }

    @Override
    public String getFieldType() {
        return super.getFieldType(FieldType.PLAIN_TEXT);
    }
}
