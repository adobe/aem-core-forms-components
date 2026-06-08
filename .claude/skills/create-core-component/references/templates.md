# Component Templates

This file contains copy-paste-ready templates for every file in a new component. Replace all placeholders:

- `{ComponentName}` — PascalCase (e.g., `ImageChoice`)
- `{componentname}` — lowercase no separators (e.g., `imagechoice`)
- `{COMPONENT_NAME}` — UPPER_SNAKE_CASE (e.g., `IMAGE_CHOICE`)
- `{component-name}` — kebab-case (e.g., `image-choice`)
- `{fieldType}` — the FieldType value (e.g., `image-choice`)
- `{cqIcon}` — CQ icon name (e.g., `imageChoice`)
- `{componentTitle}` — human-readable title (e.g., `Image Choice`)
- `{componentDescription}` — short description for dialog/author UI
- `{BaseClass}` — the appropriate abstract base (e.g., `AbstractFieldImpl`, `AbstractOptionsFieldImpl`)
- `{BaseInterface}` — the interface to extend (e.g., `Field`, `CheckBox`)
- `{ViewBaseClass}` — JS base class (e.g., `FormView.FormFieldBase`, `FormView.FormOptionFieldBase`)
- `{FIELD_TYPE_ENUM}` — FieldType enum constant in SCREAMING_SNAKE_CASE (e.g., `CHECKBOX_GROUP`, `TEXT_INPUT`, `RADIO_GROUP`, `DROP_DOWN`, `NUMBER_INPUT`, `DATE_INPUT`, `FILE_INPUT`, `PLAIN_TEXT`, `IMAGE`, `PANEL`, `BUTTON`, `CHECKBOX`, `FORM`)
- `{currentYear}` — the current calendar year for copyright headers

---

## 1. Public Interface

**Path:** `bundles/af-core/src/main/java/com/adobe/cq/forms/core/components/models/form/{ComponentName}.java`

```java
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright {currentYear} Adobe
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
package com.adobe.cq.forms.core.components.models.form;

import org.osgi.annotation.versioning.ConsumerType;

/**
 * Defines the form {@code {ComponentName}} Sling Model used for the
 * {@code /apps/core/fd/components/form/{componentname}} component.
 *
 * @since com.adobe.cq.forms.core.components.models.form 5.8.0
 */
@ConsumerType
public interface {ComponentName} extends {BaseInterface} {
    // Add component-specific methods here
}
```

---

## 2. Sling Model Implementation

**Path:** `bundles/af-core/src/main/java/com/adobe/cq/forms/core/components/internal/models/v1/form/{ComponentName}Impl.java`

```java
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright {currentYear} Adobe
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

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.jetbrains.annotations.NotNull;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.models.form.{ComponentName};
import com.adobe.cq.forms.core.components.models.form.FieldType;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { {ComponentName}.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_{COMPONENT_NAME}_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
          extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class {ComponentName}Impl extends {BaseClass} implements {ComponentName} {

    @PostConstruct
    private void init{ComponentName}Model() {
        // Initialization logic
    }

    @Override
    public String getFieldType() {
        return super.getFieldType(FieldType.{FIELD_TYPE_ENUM});
    }
}
```

---

## 2b. Sling Model – Display/Text Components

Use this variant instead of template #2 when `sling:resourceSuperType` is `core/fd/components/form/text/v1/text` — i.e., components that render authored HTML content in a `__value` div and show a title label above it (e.g., Adobe Sign Block, text component extensions).

**Path:** `bundles/af-core/src/main/java/com/adobe/cq/forms/core/components/internal/models/v1/form/{ComponentName}Impl.java`

```java
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright {currentYear} Adobe
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

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.internal.form.ReservedProperties;
import com.adobe.cq.forms.core.components.models.form.Base;
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.components.models.form.Text;
import com.adobe.cq.forms.core.components.util.AbstractBaseImpl;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Text.class, Base.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_{COMPONENT_NAME}_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
          extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class {ComponentName}Impl extends AbstractBaseImpl implements Text {

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL,
                  name = ReservedProperties.PN_TEXT_IS_RICH)
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
```

**Rules for this variant:**
- `adapters` MUST include both `Text.class` and `Base.class` — `Base.class` wires `getLabel()` into the HTL `baseModel.label.*` calls and the exported form JSON `label` object
- Extend `AbstractBaseImpl`, NOT `TextImpl` — `TextImpl` returns `null` for `getLabel()`
- Use HTL template 7c for the corresponding HTML template

---

## 3. FormConstants Entry

Add to `bundles/af-core/src/main/java/com/adobe/cq/forms/core/components/internal/form/FormConstants.java`:

```java
public final static String RT_FD_FORM_{COMPONENT_NAME}_V1 = RT_FD_FORM_PREFIX + "{componentname}/v1/{componentname}";
```

---

## 4. Unit Test

**Path:** `bundles/af-core/src/test/java/com/adobe/cq/forms/core/components/internal/models/v1/form/{ComponentName}ImplTest.java`

```java
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright {currentYear} Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
package com.adobe.cq.forms.core.components.internal.models.v1.form;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.adobe.cq.forms.core.components.models.form.{ComponentName};
import com.adobe.cq.forms.core.components.models.form.FieldType;
import com.adobe.cq.forms.core.context.FormsCoreComponentTestContext;
import com.adobe.cq.forms.core.Utils;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(AemContextExtension.class)
public class {ComponentName}ImplTest {

    private static final String BASE = "/form/{componentname}";
    private static final String CONTENT_ROOT = "/content";
    private static final String PATH_{COMPONENT_NAME} = CONTENT_ROOT + "/{componentname}";

    private final AemContext context = FormsCoreComponentTestContext.newAemContext();

    @BeforeEach
    void setUp() {
        context.load().json(BASE + FormsCoreComponentTestContext.TEST_CONTENT_JSON, CONTENT_ROOT);
    }

    @Test
    void testFieldType() {
        {ComponentName} component = get{ComponentName}UnderTest(PATH_{COMPONENT_NAME});
        assertEquals("{fieldType}", component.getFieldType());
    }

    @Test
    void testGetName() {
        {ComponentName} component = get{ComponentName}UnderTest(PATH_{COMPONENT_NAME});
        assertEquals("test{componentname}", component.getName());
    }

    @Test
    void testGetLabel() {
        {ComponentName} component = get{ComponentName}UnderTest(PATH_{COMPONENT_NAME});
        assertEquals("Test {componentTitle}", component.getLabel().getValue());
    }

    @Test
    void testJSONExport() throws Exception {
        {ComponentName} component = get{ComponentName}UnderTest(PATH_{COMPONENT_NAME});
        Utils.testJSONExport(component, Utils.getTestExporterJSONPath(BASE, PATH_{COMPONENT_NAME}));
    }

    private {ComponentName} get{ComponentName}UnderTest(String resourcePath) {
        context.currentResource(resourcePath);
        return context.request().adaptTo({ComponentName}.class);
    }
}
```

---

## 5. Test Content JSON

**Path:** `bundles/af-core/src/test/resources/form/{componentname}/test-content.json`

```json
{
  "{componentname}": {
    "jcr:primaryType": "nt:unstructured",
    "sling:resourceType": "core/fd/components/form/{componentname}/v1/{componentname}",
    "name": "test{componentname}",
    "jcr:title": "Test {componentTitle}",
    "fieldType": "{fieldType}",
    "visible": true,
    "enabled": true
  }
}
```

---

## 6. Component Definition XML

**Path:** `ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentname}/v1/{componentname}/.content.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:Component"
    cq:icon="{cqIcon}"
    jcr:title="Adaptive Form {componentTitle} (v1)"
    jcr:description="{componentDescription}"
    sling:resourceSuperType="core/fd/components/form/base/v1/base"
    componentGroup=".core-adaptiveform"/>
```

---

## 6b. Instance Defaults (`_cq_template.xml`)

**Path:** `ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentname}/v1/{componentname}/_cq_template.xml`

Sets the default property values for a newly dropped component instance.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="nt:unstructured"
    jcr:title="{componentTitle}"
    fieldType="{fieldType}"/>
```

For step components that share `fieldType="plain-text"` but need distinct rendering, add `fd:viewType`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:fd="http://www.adobe.com/aemfd/fd/components/adaptive-form/formmetadata/2.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="nt:unstructured"
    jcr:title="{componentTitle}"
    fieldType="plain-text"
    fd:viewType="{component-name}"/>
```

For components that are hidden at runtime but visible in author edit mode (e.g., signing blocks revealed by an external SDK), add:

```xml
    visible="{Boolean}false"
```

The `{fieldType}` value must be kebab-case: `text-input`, `number-input`, `plain-text`, etc. See `references/component-anatomy.md` for the full `FieldType` mapping.

---

## 7. HTL Template – Field Components

**Path:** `ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentname}/v1/{componentname}/{componentname}.html`

Use for components that capture a user value. For step/display components without a widget, use template 7b. For display/text with a title label and rich-text value area, use template 7c.

```html
<!--/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~ Copyright {currentYear} Adobe
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
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/-->
<sly data-sly-use.renderer="${'{componentname}.js'}"
     data-sly-use.clientlib="${'/libs/granite/sightly/templates/clientlib.html'}"
     data-sly-use.label="${renderer.labelPath}"
     data-sly-use.shortDescription="${renderer.shortDescriptionPath}"
     data-sly-use.longDescription="${renderer.longDescriptionPath}"
     data-sly-use.errorMessage="${renderer.errorMessagePath}"
     data-sly-use.questionMark="${renderer.questionMarkPath}"></sly>

<div class="cmp-adaptiveform-{componentname}"
     data-cmp-is="adaptiveForm{ComponentName}"
     id="${{componentname}.id}"
     data-sly-use.{componentname}="com.adobe.cq.forms.core.components.models.form.{ComponentName}"
     data-sly-use.formstructparser="com.adobe.cq.forms.core.components.models.form.FormStructureParser"
     data-cmp-visible="${{componentname}.visible ? 'true' : 'false'}"
     data-cmp-enabled="${{componentname}.enabled ? 'true' : 'false'}"
     data-cmp-required="${{componentname}.required ? 'true': 'false'}"
     data-cmp-readonly="${{componentname}.readOnly ? 'true' : 'false'}"
     data-cmp-data-layer="${{componentname}.data.json}"
     data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"
     data-sly-test.widgetId="${'{0}-{1}' @ format=[{componentname}.id, 'widget']}">

    <!-- Label + Question Mark -->
    <div class="cmp-adaptiveform-{componentname}__label-container">
        <div data-sly-call="${label.label @componentId=widgetId,
             labelValue={componentname}.label.value,
             labelVisible={componentname}.label.visible,
             labelRichText={componentname}.label.richText,
             bemBlock='cmp-adaptiveform-{componentname}'}" data-sly-unwrap></div>
        <div data-sly-call="${questionMark.questionMark @componentId={componentname}.id,
             longDescription={componentname}.description,
             bemBlock='cmp-adaptiveform-{componentname}'}" data-sly-unwrap></div>
    </div>

    <!-- Widget area — customize for your component -->
    <input type="text" id="${widgetId}"
           class="cmp-adaptiveform-{componentname}__widget"
           name="${{componentname}.name}"
           value="${{componentname}.default}"
           disabled="${!{componentname}.enabled}"
           readonly="${{componentname}.readOnly}"
           required="${{componentname}.required}"
           placeholder="${{componentname}.placeHolder}"
           aria-describedby="${{componentname}.id}__errormessage ${{componentname}.id}__longdescription ${{componentname}.id}__shortdescription"
           dir="auto"/>

    <!-- Short Description (tooltip) -->
    <div data-sly-call="${shortDescription.shortDescription @componentId={componentname}.id,
         shortDescriptionVisible={componentname}.tooltipVisible,
         shortDescription={componentname}.tooltip,
         bemBlock='cmp-adaptiveform-{componentname}'}" data-sly-unwrap></div>

    <!-- Long Description -->
    <div data-sly-call="${longDescription.longDescription @componentId={componentname}.id,
         longDescription={componentname}.description,
         bemBlock='cmp-adaptiveform-{componentname}'}" data-sly-unwrap></div>

    <!-- Error Message -->
    <div data-sly-call="${errorMessage.errorMessage @componentId={componentname}.id,
         bemBlock='cmp-adaptiveform-{componentname}'}" data-sly-unwrap></div>
</div>
```

---

## 7b. HTL Template – Step / Display Components

Use for step or display components with no interactive widget. Binds the Impl class directly since step components typically have no separate public interface.

**Path:** `ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentname}/v1/{componentname}/{componentname}.html`

```html
<!--/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~ Copyright {currentYear} Adobe
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
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/-->
<sly data-sly-use.{componentname}="com.adobe.cq.forms.core.components.internal.models.v1.form.{ComponentName}Impl"
     data-sly-use.clientlib="${'/libs/granite/sightly/templates/clientlib.html'}"></sly>

<div data-sly-use.formstructparser="com.adobe.cq.forms.core.components.models.form.FormStructureParser"
     class="cmp-adaptiveform-{componentname}"
     data-cmp-is="adaptiveForm{ComponentName}"
     data-cmp-visible="${{componentname}.visible ? 'true' : 'false'}"
     id="${{componentname}.id}"
     data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}">
    <!--
      Step-specific content here.
      For a step that renders child components:
        <sly data-sly-resource="${'.' @ resourceType='core/fd/components/form/container/v2/container'}"></sly>
      For custom rendering (signature iframe, summary text), put HTML here.
    -->
    <div class="cmp-adaptiveform-{componentname}__content">
        <!-- component-specific structure -->
    </div>
</div>
```

---

## 7c. HTL Template – Display/Text with Label and Rich-Text Value

Use when the component renders authored HTML content (`value`) with a title label above it — e.g., Adobe Sign Block or Text component extensions. Requires two Sling Model bindings: `textModel` for content, `baseModel` for the label. Use Sling Model template 2b.

**Path:** `ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentname}/v1/{componentname}/{componentname}.html`

```html
<!--/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~ Copyright {currentYear} Adobe
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
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/-->
<div data-sly-use.textModel="com.adobe.cq.forms.core.components.models.form.Text"
     data-sly-use.baseModel="com.adobe.cq.forms.core.components.models.form.Base"
     data-sly-use.formstructparser="com.adobe.cq.forms.core.components.models.form.FormStructureParser"
     data-sly-use.templates="core/wcm/components/commons/v1/templates.html"
     data-sly-use.labelTemplate="core/fd/components/af-commons/v1/fieldTemplates/label.html"
     data-cmp-is="adaptiveForm{ComponentName}"
     id="${textModel.id}"
     data-cmp-data-layer="${textModel.data.json}"
     data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"
     data-cmp-visible="${textModel.visible ? 'true' : 'false'}"
     class="cmp-adaptiveform-{componentname} ${resource.properties['styleClass']}">
    <div class="cmp-adaptiveform-{componentname}__label-container">
        <div data-sly-call="${labelTemplate.label @
                 componentId=textModel.id,
                 labelValue=baseModel.label.value,
                 labelVisible=baseModel.label.visible,
                 labelRichText=baseModel.label.richText,
                 bemBlock='cmp-adaptiveform-{componentname}'}"
             data-sly-unwrap></div>
    </div>
    <!--
      Always render __value unconditionally — JS getWidget() must never return null.
      Put conditional content inside using <sly data-sly-test>, never on the outer __value div.
    -->
    <div class="cmp-adaptiveform-{componentname}__value">
        <sly data-sly-test.richContent="${textModel.value}">
            <div data-sly-unwrap="${textModel.isRichText}">${richContent @ context = textModel.isRichText ? 'html' : 'text'}</div>
        </sly>
    </div>
</div>
<sly data-sly-call="${templates.placeholder @ isEmpty = !richContent, classAppend='cmp-adaptiveform-{componentname}'}"></sly>
```

**Notes:**
- Use `baseModel.label.value` (not `resource.properties['jcr:title']`) — it applies i18n translation and correctly reads `hideTitle`
- `Text` has no `getLabel()` — `Base.class` MUST be in the Sling Model `adapters` array (use template 2b)
- `styleClass` is the only acceptable `resource.properties` read in this template

---

## 8. Renderer JS

**Path:** `ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentname}/v1/{componentname}/{componentname}.js`

```javascript
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright {currentYear} Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
use(function () {
  return {
    labelPath: 'core/fd/components/af-commons/v1/fieldTemplates/label.html',
    shortDescriptionPath: 'core/fd/components/af-commons/v1/fieldTemplates/shortDescription.html',
    longDescriptionPath: 'core/fd/components/af-commons/v1/fieldTemplates/longDescription.html',
    questionMarkPath: 'core/fd/components/af-commons/v1/fieldTemplates/questionMark.html',
    errorMessagePath: 'core/fd/components/af-commons/v1/fieldTemplates/errorMessage.html'
  }
});
```

---

## 9. Author Dialog

**Path:** `ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentname}/v1/{componentname}/_cq_dialog/.content.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    xmlns:granite="http://www.adobe.com/jcr/granite/1.0"
    xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    jcr:primaryType="nt:unstructured"
    jcr:title="Adaptive Form {componentTitle}"
    sling:resourceType="cq/gui/components/authoring/dialog"
    extraClientlibs="[core.forms.components.{componentname}.v1.editor]"
    trackingFeature="core-components:adaptiveform-{componentname}:v1">
    <content
        jcr:primaryType="nt:unstructured"
        sling:resourceType="granite/ui/components/coral/foundation/container">
        <items jcr:primaryType="nt:unstructured">
            <tabs
                jcr:primaryType="nt:unstructured"
                sling:resourceType="granite/ui/components/coral/foundation/tabs"
                maximized="{Boolean}true">
                <items jcr:primaryType="nt:unstructured">
                    <basic
                        jcr:primaryType="nt:unstructured"
                        jcr:title="Basic"
                        sling:resourceType="granite/ui/components/coral/foundation/container"
                        margin="{Boolean}true">
                        <items jcr:primaryType="nt:unstructured">
                            <columns
                                jcr:primaryType="nt:unstructured"
                                sling:resourceType="granite/ui/components/coral/foundation/fixedcolumns"
                                margin="{Boolean}true">
                                <items jcr:primaryType="nt:unstructured">
                                    <column
                                        jcr:primaryType="nt:unstructured"
                                        sling:resourceType="granite/ui/components/coral/foundation/container">
                                        <items jcr:primaryType="nt:unstructured">
                                            <!-- Include base dialog fields -->
                                            <base_dialog
                                                jcr:primaryType="nt:unstructured"
                                                sling:resourceType="granite/ui/components/coral/foundation/include"
                                                path="core/fd/components/form/base/v1/base/cq:dialog/content/items/tabs/items/basic/items/columns/items/column/items"/>
                                            <!-- Add component-specific dialog fields here -->
                                        </items>
                                    </column>
                                </items>
                            </columns>
                        </items>
                    </basic>
                    <help
                        jcr:primaryType="nt:unstructured"
                        jcr:title="Help Content"
                        sling:resourceType="granite/ui/components/coral/foundation/include"
                        path="core/fd/components/form/base/v1/base/cq:dialog/content/items/tabs/items/help"/>
                    <accessibility
                        jcr:primaryType="nt:unstructured"
                        jcr:title="Accessibility"
                        sling:resourceType="granite/ui/components/coral/foundation/include"
                        path="core/fd/components/form/base/v1/base/cq:dialog/content/items/tabs/items/accessibility"/>
                </items>
            </tabs>
        </items>
    </content>
</jcr:root>
```

---

## 10. Site Clientlib Definition

**Path:** `ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentname}/v1/{componentname}/clientlibs/site/.content.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:ClientLibraryFolder"
    allowProxy="{Boolean}true"
    categories="[core.forms.components.{componentname}.v1.runtime]"
    dependencies="[core.forms.components.runtime.base]"/>
```

**js.txt:**
```
#base=js
{componentname}view.js
```

**css.txt:**
```
#base=css
{componentname}.less
```

---

## 11. Client-Side View Class

**Path:** `ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentname}/v1/{componentname}/clientlibs/site/js/{componentname}view.js`

```javascript
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright {currentYear} Adobe
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
(function() {
    "use strict";

    class {ComponentName} extends {ViewBaseClass} {
        static NS = FormView.Constants.NS;
        static IS = "adaptiveForm{ComponentName}";
        static bemBlock = 'cmp-adaptiveform-{componentname}';

        static selectors = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            widget: `.${this.bemBlock}__widget`,
            label: `.${this.bemBlock}__label`,
            description: `.${this.bemBlock}__longdescription`,
            qm: `.${this.bemBlock}__questionmark`,
            errorDiv: `.${this.bemBlock}__errormessage`,
            tooltipDiv: `.${this.bemBlock}__shortdescription`,
        };

        constructor(params) {
            super(params);
        }

        getWidget() {
            return this.element.querySelector({ComponentName}.selectors.widget);
        }

        getDescription() {
            return this.element.querySelector({ComponentName}.selectors.description);
        }

        getLabel() {
            return this.element.querySelector({ComponentName}.selectors.label);
        }

        getErrorDiv() {
            return this.element.querySelector({ComponentName}.selectors.errorDiv);
        }

        getTooltipDiv() {
            return this.element.querySelector({ComponentName}.selectors.tooltipDiv);
        }

        getQuestionMarkDiv() {
            return this.element.querySelector({ComponentName}.selectors.qm);
        }

        setModel(model) {
            super.setModel(model);
            // Add event listeners if needed
            let widget = this.getWidget();
            if (widget) {
                widget.addEventListener('change', (e) => {
                    this.setModelValue(e.target.value);
                });
                widget.addEventListener('focus', (e) => {
                    this.setActive();
                });
                widget.addEventListener('blur', (e) => {
                    this.setInactive();
                });
            }
        }

        updateValue(modelValue) {
            let widget = this.getWidget();
            if (widget) {
                widget.value = modelValue;
            }
        }

        updateEnabled(enabled, state) {
            this.toggle(enabled, {ComponentName}.selectors.widget, "disabled");
        }

        updateReadOnly(readonly) {
            let widget = this.getWidget();
            if (widget) {
                if (readonly === true) {
                    widget.setAttribute("readonly", "readonly");
                    widget.setAttribute("aria-readonly", true);
                } else {
                    widget.removeAttribute("readonly");
                    widget.removeAttribute("aria-readonly");
                }
            }
        }

        updateValidity(validity) {
            let widget = this.getWidget();
            if (widget) {
                if (validity.valid === false) {
                    widget.setAttribute("aria-invalid", true);
                } else {
                    widget.removeAttribute("aria-invalid");
                }
            }
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new {ComponentName}({element, formContainer})
    }, {ComponentName}.selectors.self);
})();
```

---

## 11b. Client-Side View – Step / Container Components

Use when the component has no widget and does not capture a value. Extends `FormView.FormContainer` instead of `FormFieldBase`.

**Path:** `ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentname}/v1/{componentname}/clientlibs/site/js/{componentname}view.js`

```javascript
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright {currentYear} Adobe
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
(function() {
    "use strict";

    class {ComponentName}View extends FormView.FormContainer {
        static NS = FormView.Constants.NS;
        static IS = "adaptiveForm{ComponentName}";
        static bemBlock = 'cmp-adaptiveform-{componentname}';

        static selectors = {
            self: "[data-" + {ComponentName}View.NS + '-is="' + {ComponentName}View.IS + '"]'
        };

        constructor(params) {
            super(params);
        }

        initialize() {
            super.initialize();
            // component-specific setup (e.g., load external SDK, observe model state changes)
        }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new {ComponentName}View({element, formContainer});
    }, {ComponentName}View.selectors.self);
})();
```

---

## 11c. updateValue and updateLabel Overrides for Rich-Text Components

Add these method overrides to any view class that renders authored HTML inside a `__value` div alongside a `__label-container`. Without the `updateLabel` guard, the form engine calling `updateLabel(null)` on model bind will throw. Without the `updateValue` guard, the default implementation may overwrite the entire element `innerHTML` and destroy the label.

```javascript
updateValue(value) {
    const actualValue = typeof value === "undefined" ? "" : value;

    const sanitizedValue = window.DOMPurify ? window.DOMPurify.sanitize(actualValue, {
        ALLOWED_TAGS: [
            "b", "strong", "i", "em", "u", "sub", "sup", "small",
            "blockquote", "ul", "ol", "li", "a", "br", "p", "span",
            "h1", "h2", "h3", "h4", "h5", "h6"
        ],
        ALLOWED_ATTR: [
            "href", "target", "rel", "class", "id", "style"
            // add any custom data-* attributes your SDK requires
        ]
    }) : actualValue;

    const widget = this.getWidget();
    if (widget) {
        widget.innerHTML = sanitizedValue;
    }
    // No else fallback — the __value div must always be present in the DOM (see template 7c).
    // If getWidget() returns null, fix the HTL so __value renders unconditionally.
}

updateLabel(label) {
    if (label) {
        super.updateLabel(label);
    }
}
```

---

## 12. CSS Stub and Theme SCSS

Styles are split across two repositories — see `references/css-architecture.md` for the full explanation.

### 12a. CSS Stub (in `aem-core-forms-components`)

**Path:** `ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentname}/v1/{componentname}/clientlibs/site/css/{componentname}.less`

Declares every BEM class the HTL template emits with **empty rules only** — no CSS property values. All visual styling belongs in `aem-forms-theme-canvas`.

```less
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright {currentYear} Adobe
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

.cmp-adaptiveform-{componentname} { }
.cmp-adaptiveform-{componentname}__label-container { }
.cmp-adaptiveform-{componentname}__label { }
.cmp-adaptiveform-{componentname}__widget { }
.cmp-adaptiveform-{componentname}__questionmark { }
.cmp-adaptiveform-{componentname}__shortdescription { }
.cmp-adaptiveform-{componentname}__longdescription { }
.cmp-adaptiveform-{componentname}__errormessage { }
```

Add a rule for every additional BEM element introduced in the HTL template. Do not add any CSS properties here.

### 12b. Theme SCSS (in `aem-forms-theme-canvas`)

**Path:** `aem-forms-theme-canvas/src/components/{componentname}/_{componentname}.scss`

All actual visual styles using design tokens from `src/site/_variables.scss`.

```scss
// {ComponentName} — Core Adaptive Form Component

.cmp-adaptiveform-{componentname} {
    display: flex;
    flex-direction: column;
    margin: $field-margin;
    font-family: $font-family;
    font-size: $font-md;
    color: $dark-gray;
}

.cmp-adaptiveform-{componentname}__label-container {
    display: flex;
    align-items: center;
}

.cmp-adaptiveform-{componentname}__label {
    font-size: $font-sm;
    color: $dark-gray;
}

.cmp-adaptiveform-{componentname}__widget {
    height: $field-height;
    padding-left: $field-padding-left;
    border: 1px solid $very-light-gray;
    border-radius: 4px;
    font-size: $font-md;

    &:focus {
        outline: 2px solid $focus-ring-color;
        outline-offset: 2px;
    }
}

/* Validation states — written by JS view via data-cmp-valid attribute */
.cmp-adaptiveform-{componentname}[data-cmp-valid=false] {
    .cmp-adaptiveform-{componentname}__widget { border-left: 3px solid $error; }
}

.cmp-adaptiveform-{componentname}[data-cmp-valid=true] {
    .cmp-adaptiveform-{componentname}__widget { border-left: 3px solid $success; }
}

.cmp-adaptiveform-{componentname}__errormessage {
    font-size: $font-xsm;
    color: $error;
}

.cmp-adaptiveform-{componentname}__shortdescription,
.cmp-adaptiveform-{componentname}__longdescription {
    font-size: $font-xsm;
    color: $gray;
}
```

After creating the SCSS file, import it in `aem-forms-theme-canvas/src/theme.scss`:

```scss
@import './components/{componentname}/_{componentname}.scss';
```

Then build: `npm run build && npm run create-clientlib` from `aem-forms-theme-canvas/`.

---

## 13. Editor Clientlib

**Path:** `ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentname}/v1/{componentname}/clientlibs/editor/.content.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:ClientLibraryFolder"
    categories="[core.forms.components.{componentname}.v1.editor]"
    dependencies="[core.forms.components.base.v1.editor]"/>
```

---

## 14. Example Proxy Component

**Path:** `examples/ui.apps/.../form/{componentname}/.content.xml`

**IMPORTANT:** The `sling:resourceSuperType` must point to the **latest available version** of the component. Many components in the codebase have v2+ (e.g., checkboxgroup/v2, radiobutton/v2, button/v2, container/v2, fileinput/v4). For a brand-new component starting at v1, use v1. Check existing proxies in `examples/ui.apps/` to match the convention.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:Component"
    jcr:title="Adaptive Form {componentTitle}"
    jcr:description="{componentDescription}"
    sling:resourceSuperType="core/fd/components/form/{componentname}/v1/{componentname}"
    componentGroup="Core Components Examples - Adaptive Form"/>
```

---

## 15. Example Content Page

**Path:** `examples/ui.content/.../adaptive-form/{componentname}/.content.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    xmlns:fd="http://www.adobe.com/aemfd/fd/1.0"
    jcr:primaryType="cq:Page">
    <jcr:content
        jcr:primaryType="cq:PageContent"
        jcr:title="{componentTitle}"
        sling:resourceType="forms-components-examples/components/page">
        <root
            jcr:primaryType="nt:unstructured"
            sling:resourceType="wcm/foundation/components/responsivegrid">
            <responsivegrid
                jcr:primaryType="nt:unstructured"
                sling:resourceType="wcm/foundation/components/responsivegrid">
                <demo
                    jcr:primaryType="nt:unstructured"
                    sling:resourceType="forms-components-examples/components/demo">
                    <component
                        jcr:primaryType="nt:unstructured"
                        sling:resourceType="forms-components-examples/components/demo/component"
                        jcr:title="{componentTitle}">
                        <guideContainer
                            jcr:primaryType="nt:unstructured"
                            sling:resourceType="forms-components-examples/components/form/container"
                            fd:version="2.1"
                            fieldType="form">
                            <{componentname}_demo
                                jcr:primaryType="nt:unstructured"
                                sling:resourceType="forms-components-examples/components/form/{componentname}"
                                jcr:title="{componentTitle}"
                                fieldType="{fieldType}"
                                name="{componentname}1"
                                visible="{Boolean}true"
                                enabled="{Boolean}true"/>
                        </guideContainer>
                    </component>
                </demo>
            </responsivegrid>
        </root>
    </jcr:content>
</jcr:root>
```

---

## 16. Edit Config (`_cq_editConfig.xml`)

**Path:** `ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentname}/v1/{componentname}/_cq_editConfig.xml`

Every form component needs this file to configure the author toolbar. Place it alongside `.content.xml`.

### Standard (all field and step components)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:EditConfig"
    cq:actions="[-,-,copymove,delete,-,-,-]"
    cq:dialogMode="floating"
    cq:layout="editbar"
    cq:disableTargeting="{Boolean}true"/>
```

### Extended – Display/Text Components with Inplace Rich-Text Editing

For components that use HTL template 7c and support inplace editing of the `__value` area:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    jcr:primaryType="cq:EditConfig"
    cq:actions="[-,-,copymove,delete,-,-,-]"
    cq:dialogMode="floating"
    cq:layout="editbar"
    cq:disableTargeting="{Boolean}true">
    <cq:inplaceEditing
        jcr:primaryType="cq:InplaceEditingConfig"
        active="{Boolean}true"
        editorType="text"
        editElementQuery=".cmp-adaptiveform-{componentname}__value"
        name="./value"
        textPropertyName="./value"
        hideLabel="{Boolean}true">
        <config jcr:primaryType="nt:unstructured">
            <rtePlugins jcr:primaryType="nt:unstructured">
                <format jcr:primaryType="nt:unstructured" features="bold,italic,underline"/>
                <fullscreen jcr:primaryType="nt:unstructured" features="*"/>
                <control jcr:primaryType="nt:unstructured" features="close,save"/>
            </rtePlugins>
            <uiSettings jcr:primaryType="nt:unstructured">
                <cui jcr:primaryType="nt:unstructured">
                    <inline jcr:primaryType="nt:unstructured"
                        toolbar="[format#bold,format#italic,format#underline,fullscreen#start,control#close,control#save]"/>
                </cui>
            </uiSettings>
        </config>
    </cq:inplaceEditing>
</jcr:root>
```

For components needing a custom RTE plugin, add the plugin entry to `rtePlugins` and insert the plugin command before `fullscreen#start` in the `toolbar` string.
