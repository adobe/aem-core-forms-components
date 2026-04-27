# Container & Component-Family Templates

Use this file when **shape 1b** (single container) or **shape 1c** (component family) was selected in Phase 1 of `SKILL.md`. For leaf fields, use `templates.md` instead.

A **container** is a component that holds child components (resourceSuperType chain on `panelcontainer/v1/panelcontainer`). A **component family** is one parent container plus N children with a fixed parent/child relationship — generate one component per family member using these templates and complete the **Family Wiring** checklist at the end.

Placeholders:

- `{ComponentName}` — PascalCase
- `{componentname}` — lowercase
- `{COMPONENT_NAME}` — UPPER_SNAKE_CASE
- `{ParentName}` / `{parentname}` — for child components in a family, the parent's name in the matching case
- `{ChildName}` / `{childname}` — for the parent's drop targets, one entry per child component
- `{currentYear}` — current calendar year

---

## 1. Java Implementation (no new interface)

**Path:** `bundles/af-core/src/main/java/com/adobe/cq/forms/core/components/internal/models/v1/form/{ComponentName}Impl.java`

The container reuses the existing `Panel` interface. Skip creating `{ComponentName}.java` unless the container exposes new HTL/JSON methods beyond `Panel`.

```java
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright {currentYear} Adobe
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
package com.adobe.cq.forms.core.components.internal.models.v1.form;

import javax.annotation.Nullable;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.forms.core.components.internal.form.FormConstants;
import com.adobe.cq.forms.core.components.internal.form.ReservedProperties;
import com.adobe.cq.forms.core.components.models.form.Panel;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@Model(
    adaptables = { SlingHttpServletRequest.class, Resource.class },
    adapters = { Panel.class, ComponentExporter.class },
    resourceType = { FormConstants.RT_FD_FORM_{COMPONENT_NAME}_V1 })
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class {ComponentName}Impl extends PanelImpl {

    // 1. JCR-injected custom properties (use ReservedProperties constants when the name is shared)
    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = ReservedProperties.PN_{PROPERTY_NAME})
    @Nullable
    protected String {propertyName};

    // 2. JSON-exported getters
    //    - Use @JsonInclude(NON_DEFAULT) when the default boolean/null should be omitted from runtime JSON
    //    - Use @JsonIgnore for HTL-only computed values that must not leak into runtime JSON
    @JsonProperty("{propertyName}")
    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    public String get{PropertyName}() {
        return {propertyName};
    }

    // 3. HTL-only computed view helpers (@JsonIgnore so they don't bloat runtime JSON)
    @JsonIgnore
    public boolean is{PropertyName}Configured() {
        return {propertyName} != null && !{propertyName}.isEmpty();
    }
}
```

Notes:

- Do **not** override `getFieldType()` unless emitting a value other than `panel`.
- Do **not** override `getItems()` / `getChildren()` — `PanelImpl` already exposes these.
- For families, every child component (e.g. row, header, step) gets its own impl extending `PanelImpl` the same way.

---

## 2. FormConstants Entry

Add one line per component (parent + each child for a family) to `FormConstants.java`:

```java
public final static String RT_FD_FORM_{COMPONENT_NAME}_V1 = RT_FD_FORM_PREFIX + "{componentname}/v1/{componentname}";
```

If new shared property names are introduced, add them to `ReservedProperties.java`:

```java
public static final String PN_{PROPERTY_NAME} = "{propertyName}";
```

---

## 3. Component Definition

**Path:** `ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{componentname}/v1/{componentname}/.content.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    cq:icon="{cqIcon}"
    cq:isContainer="{Boolean}true"
    jcr:description="{componentDescription}"
    jcr:primaryType="cq:Component"
    jcr:title="Adaptive Form {componentTitle} (v1)"
    sling:resourceSuperType="core/fd/components/form/panelcontainer/v1/panelcontainer"
    componentGroup=".core-adaptiveform"/>
```

For **family children that should never appear in the standard component browser**, change `componentGroup`:

```xml
    componentGroup=".hidden"
```

For **family children that visually inherit from another child** (e.g. a header child reusing a row child's HTL/clientlib), point `sling:resourceSuperType` at the sibling instead of `panelcontainer`:

```xml
    sling:resourceSuperType="core/fd/components/form/{siblingname}/v1/{siblingname}"
```

---

## 4. Pre-Seeded `_cq_template.xml`

**Path:** `ui.af.apps/.../{componentname}/v1/{componentname}/_cq_template.xml`

Containers can ship with exemplar children so authors get a working skeleton on insert. Each child node sets `sling:resourceType` to the **full resource type** of the target component (a sibling in the family, or any reusable form component such as `textinput`, `text`, etc.). Comments in the template document author intent.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~ Copyright {currentYear} Adobe
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
    jcr:primaryType="nt:unstructured"
    jcr:title="{componentTitle}"
    fieldType="panel">

    <!-- Exemplar child #1 — replace resourceType / properties with what makes sense for this container -->
    <{seedChildName1}
        jcr:primaryType="nt:unstructured"
        sling:resourceType="core/fd/components/form/{ChildResourceType}/v1/{ChildResourceType}"
        jcr:title="{Seed Child 1 Title}"
        name="{seedChildName1}"/>

    <!-- Exemplar child #2 (omit if the container should be empty by default) -->
    <{seedChildName2}
        jcr:primaryType="nt:unstructured"
        sling:resourceType="core/fd/components/form/{ChildResourceType}/v1/{ChildResourceType}"
        jcr:title="{Seed Child 2 Title}"
        name="{seedChildName2}"/>
</jcr:root>
```

Leaf containers (no seed) just omit the inner nodes.

---

## 5. `_cq_editConfig.xml`

**Path:** `ui.af.apps/.../{componentname}/v1/{componentname}/_cq_editConfig.xml`

Three optional blocks beyond the base config:

- `<cq:dropTargets>` — restrict which child resourceTypes can be dropped
- `<cq:listeners>` — refresh the overlay after structural edits
- `<cq:actionConfigs>` — custom editbar actions, optionally conditional

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~ Copyright {currentYear} Adobe
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-->
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0"
    xmlns:cq="http://www.day.com/jcr/cq/1.0"
    jcr:primaryType="cq:EditConfig"
    cq:actions="[editannotate,-,copymove,delete,-,insert,-]"
    cq:dialogMode="floating"
    cq:layout="editbar"
    cq:disableTargeting="{Boolean}true">

    <!-- Restrict drop targets — one regex per allowed child resource type -->
    <cq:dropTargets jcr:primaryType="nt:unstructured">
        <{componentname}
            jcr:primaryType="cq:DropTargetConfig"
            accept="[core/fd/components/form/{ChildResourceType1}/.*,core/fd/components/form/{ChildResourceType2}/.*]"
            groups="[adaptiveform-{componentname}]"
            propertyName="./items"/>
    </cq:dropTargets>

    <!-- Repaint overlay when children are inserted or deleted -->
    <cq:listeners
        jcr:primaryType="cq:EditListenersConfig"
        afterchildinsert="function(editable){Granite.author.responsive.EditableActions.REFRESH.execute(editable)}"
        afterchilddelete="function(editable){Granite.author.responsive.EditableActions.REFRESH.execute(editable)}"/>

    <!-- Custom editbar actions — handlers must be registered in an editor hook -->
    <cq:actionConfigs jcr:primaryType="nt:unstructured">

        <!-- Unconditional action -->
        <editexpression
            jcr:primaryType="nt:unstructured"
            handler="CQ.FormsCoreComponents.editorhooks.openRuleEditor"
            order="after CONFIGURE"
            icon="bidRule"
            text="Edit Rules"/>

        <!-- Conditional action (visible only when condition() returns true) -->
        <{customAction}
            jcr:primaryType="nt:unstructured"
            condition="function(editable){return CQ.FormsCoreComponents.editorhooks.{conditionName}(editable);}"
            handler="CQ.FormsCoreComponents.editorhooks.{handlerName}"
            icon="{cqIcon}"
            text="{Action Label}"/>
    </cq:actionConfigs>
</jcr:root>
```

Common `cq:icon` values for structural actions: `tableRowAdd`, `tableRowRemove`, `arrowUp`, `arrowDown`, `bidRule`, `viewSOMExpression`, `fragmentAdd`.

For child components in a family that should not be deleted/moved at the editbar (only via parent-level actions), narrow `cq:actions`:

```xml
    cq:actions="[edit,-,-,-]"
    cq:isContainer="{Boolean}true"
```

---

## 6. HTL Template (Container)

**Path:** `ui.af.apps/.../{componentname}/v1/{componentname}/{componentname}.html`

Containers iterate over `{componentname}.items` and render each child via `data-sly-resource`. When the wrapper element is **not a `<div>`** (e.g. `<table>`, `<tbody>`, `<tr>`, `<ul>`), add the `cq-Editable-dom` marker classes on the right element so the editor overlay binds correctly.

```html
<!--/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~ Copyright {currentYear} Adobe
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/-->
<sly data-sly-use.renderer="${'{componentname}.js'}"
     data-sly-use.label="${renderer.labelPath}"
     data-sly-use.shortDescription="${renderer.shortDescriptionPath}"
     data-sly-use.longDescription="${renderer.longDescriptionPath}"
     data-sly-use.errorMessage="${renderer.errorMessagePath}"
     data-sly-use.questionMark="${renderer.questionMarkPath}"></sly>

<div class="cmp-adaptiveform-{componentname}"
     data-cmp-is="adaptiveForm{ComponentName}"
     id="${{componentname}.id}"
     data-sly-use.{componentname}="com.adobe.cq.forms.core.components.models.form.Panel"
     data-cmp-visible="${{componentname}.visible ? 'true' : 'false'}"
     data-cmp-enabled="${{componentname}.enabled ? 'true' : 'false'}"
     data-cmp-data-layer="${{componentname}.data.json}">

    <div class="cmp-adaptiveform-{componentname}__label-container">
        <div data-sly-call="${label.label @componentId={componentname}.id,
             labelValue={componentname}.label.value,
             labelVisible={componentname}.label.visible,
             bemBlock='cmp-adaptiveform-{componentname}'}" data-sly-unwrap></div>
        <div data-sly-call="${questionMark.questionMark @componentId={componentname}.id,
             longDescription={componentname}.description,
             bemBlock='cmp-adaptiveform-{componentname}'}" data-sly-unwrap></div>
    </div>

    <!-- Container body — render children -->
    <div class="cmp-adaptiveform-{componentname}__body"
         data-sly-list.child="${{componentname}.items}">
        <sly data-sly-resource="${child.path}"/>
    </div>

    <div data-sly-call="${shortDescription.shortDescription @componentId={componentname}.id,
         shortDescriptionValue={componentname}.tooltip,
         bemBlock='cmp-adaptiveform-{componentname}'}" data-sly-unwrap></div>
    <div data-sly-call="${longDescription.longDescription @componentId={componentname}.id,
         longDescriptionValue={componentname}.description,
         bemBlock='cmp-adaptiveform-{componentname}'}" data-sly-unwrap></div>
    <div data-sly-call="${errorMessage.errorMessage @componentId={componentname}.id,
         bemBlock='cmp-adaptiveform-{componentname}'}" data-sly-unwrap></div>
</div>
```

When the container's natural DOM wrapper is not a `<div>`, replace `__body` with the appropriate element (e.g. a `<tbody>`, `<ol>`) and render children directly inside it. The runtime view (Section 8) overrides `getRepeatableInstancesContainerElement()` to point at this element so repeatable insertion lands in the right place.

---

## 7. Renderer JS

**Path:** `ui.af.apps/.../{componentname}/v1/{componentname}/{componentname}.js`

```javascript
"use strict";

use(function () {
    var basePath = "/apps/core/fd/components/form/commons/v1/htmltemplate";
    return {
        labelPath: basePath + "/label/label.html",
        shortDescriptionPath: basePath + "/shortDescription/shortDescription.html",
        longDescriptionPath: basePath + "/longDescription/longDescription.html",
        errorMessagePath: basePath + "/errorMessage/errorMessage.html",
        questionMarkPath: basePath + "/questionMark/questionMark.html"
    };
});
```

---

## 8. Runtime View — extends `FormView.FormPanel`

**Path:** `ui.af.apps/.../{componentname}/v1/{componentname}/clientlibs/site/js/{componentname}view.js`

Containers extend `FormView.FormPanel`, not `FormView.FormFieldBase`. **Override the documented `FormPanel` extension points** (see `component-anatomy.md` → FormPanel Extension Points) instead of reaching across the DOM tree or patching shared runtime files.

```javascript
/*******************************************************************************
 * Copyright {currentYear} Adobe
 ******************************************************************************/
(function () {
    "use strict";

    class {ComponentName} extends FormView.FormPanel {

        static NS = FormView.Constants.NS;
        static IS = "adaptiveForm{ComponentName}";
        static bemBlock = "cmp-adaptiveform-{componentname}";
        static selectors = {
            self: "[data-" + this.NS + '-is="' + this.IS + '"]',
            body: `.${ {ComponentName}.bemBlock }__body`
        };

        constructor(params) {
            super(params);
        }

        getClass() {
            return {ComponentName}.IS;
        }

        getWidget() { return null; }
        getErrorDiv() { return null; }
        getTooltipDiv() { return null; }
        getQuestionMarkDiv() { return null; }

        getDescription() {
            return this.element.querySelector(`.${ {ComponentName}.bemBlock }__description`);
        }

        getLabel() {
            return this.element.querySelector(`.${ {ComponentName}.bemBlock }__label`);
        }

        // === Optional FormPanel overrides — only implement when the default behavior breaks ===

        /**
         * Override when the container's child wrapper is not the default parent element.
         * Return the DOM element that holds repeatable child instances.
         */
        // getRepeatableInstancesContainerElement() {
        //     return this.element.querySelector({ComponentName}.selectors.body);
        // }

        /**
         * Override when each repeatable instance is wrapped in a non-div element (e.g. <tr>, <li>).
         * Return the element that should be cloned/removed as the unit.
         */
        // getRepeatableDomWrapper(childView) {
        //     return childView.element.closest("{wrapperSelector}");
        // }

        /**
         * Override when standard sibling insertion does not place the instance in the right slot.
         * Implement custom insertion using addedModel.index and instanceManager.children.
         */
        // addRepeatableMarkup(instanceManager, addedModel, htmlElement) { ... }

        /**
         * Hooks called by the panel after a child instance is added or removed.
         * Use these to sync visibility of add/remove controls based on minOccur/maxOccur.
         */
        // handleChildAddition(childView) { ... }
        // handleChildRemoval(removedInstanceView) { ... }
    }

    FormView.Utils.setupField(({element, formContainer}) => {
        return new {ComponentName}({element, formContainer});
    }, {ComponentName}.selectors.self);
})();
```

---

## 9. Site Clientlib Definition

**Path:** `ui.af.apps/.../{componentname}/v1/{componentname}/clientlibs/site/.content.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:ClientLibraryFolder"
    allowProxy="{Boolean}true"
    categories="[core.forms.components.{componentname}.v1.runtime]"
    dependencies="[core.forms.components.runtime.base]"/>
```

`js.txt`:

```
#base=js
{componentname}view.js
```

---

## 10. Editor Clientlib Definition

**Path:** `ui.af.apps/.../{componentname}/v1/{componentname}/clientlibs/editor/.content.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:ClientLibraryFolder"
    categories="[core.forms.components.{componentname}.v1.editor]"/>
```

If custom editor behavior is needed, also add `js.txt` and the hook file per `editor-hooks.md`.

---

## 11. Tests (Required)

Tests are not optional, even for containers. Generate the unit test, test-content JSON, and exporter JSON exactly as `templates.md` Section 4–5 describes, with two adjustments:

- Adapt to `Panel.class` (or the family parent's interface) instead of a per-component interface, **unless** the impl exposes new methods — then test those methods explicitly.
- For impls with custom JCR properties, add one `@Test` per property covering the round-trip from `test-content.json` through the getter and into the exporter JSON.
- For impls with `@JsonInclude(NON_DEFAULT)` getters, write at least one test that asserts the field is **absent** from the JSON when the underlying value is the default.

---

## 12. Family Wiring Checklist (shape 1c only)

After all components in the family are scaffolded, verify:

| Check | Where |
|---|---|
| Parent's `<cq:dropTargets>` `accept` regex covers every child component's resource type | parent's `_cq_editConfig.xml` |
| Parent's `_cq_template.xml` references children by their full resource type | parent's `_cq_template.xml` |
| Children that visually inherit from another child point `sling:resourceSuperType` at the sibling, not at `panelcontainer` | each child's `.content.xml` |
| All non-parent components in the family have `componentGroup=".hidden"` | each child's `.content.xml` |
| Each component (parent + every child) has its own `RT_FD_FORM_*_V1` in `FormConstants.java` | `FormConstants.java` |
| Each component has its own unit test + exporter JSON | `bundles/af-core/src/test/...` |
| If parent or any child needs custom editbar actions, the hook file is registered in the container clientlib's `js.txt` | `ui.apps/.../container/v2/container/clientlibs/editorhook/js.txt` |
