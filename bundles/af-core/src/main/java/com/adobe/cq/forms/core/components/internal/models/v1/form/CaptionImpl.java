/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2025 Adobe
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

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.internal.models.v1.form.xfa.BorderImpl;
import com.adobe.cq.forms.core.components.internal.models.v1.form.xfa.FontImpl;
import com.adobe.cq.forms.core.components.internal.models.v1.form.xfa.MarginImpl;
import com.adobe.cq.forms.core.components.internal.models.v1.form.xfa.ParaImpl;
import com.adobe.cq.forms.core.components.internal.models.v1.form.xfa.ValueImpl;
import com.adobe.cq.forms.core.components.models.form.Caption;
import com.adobe.cq.forms.core.components.models.form.xfa.Border;
import com.adobe.cq.forms.core.components.models.form.xfa.Font;
import com.adobe.cq.forms.core.components.models.form.xfa.Margin;
import com.adobe.cq.forms.core.components.models.form.xfa.Para;
import com.adobe.cq.forms.core.components.models.form.xfa.Value;
import com.adobe.cq.forms.core.components.util.AbstractComponentImpl;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Caption.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_CAPTION_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class CaptionImpl extends AbstractComponentImpl implements Caption {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "placement")
    protected String placement;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "reserve")
    protected String reserve;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "value")
    protected String valueJcr;
    protected Value value;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "para")
    protected String paraJcr;
    protected Para para;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "margin")
    protected String marginJcr;
    protected Margin margin;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "border")
    protected String borderJcr;
    protected Border border;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "font")
    protected String fontJcr;
    protected Font font;

    @PostConstruct
    protected void init() {

        if (StringUtils.isNotBlank(marginJcr)) {
            margin = MarginImpl.fromString(marginJcr);
        }
        if (StringUtils.isNotBlank(borderJcr)) {
            border = BorderImpl.fromString(borderJcr);
        }
        if (StringUtils.isNotBlank(valueJcr)) {
            value = ValueImpl.fromString(valueJcr);
        }
        if (StringUtils.isNotBlank(paraJcr)) {
            para = ParaImpl.fromString(paraJcr);
        }
        if (StringUtils.isNotBlank(fontJcr)) {
            font = FontImpl.fromString(fontJcr);
        }
    }

    @Override
    public String getPlacement() {
        return placement;
    }

    @Override
    public String getReserve() {
        return reserve;
    }

    @Override
    public Value getValue() {
        return value;
    }

    @Override
    public Para getPara() {
        return para;
    }

    @Override
    public Margin getMargin() {
        return margin;
    }

    @Override
    public Border getBorder() {
        return border;
    }

    @Override
    public Font getFont() {
        return font;
    }
}
