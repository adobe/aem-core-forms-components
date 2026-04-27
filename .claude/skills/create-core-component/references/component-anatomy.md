# AEM Core Forms Component Anatomy

## Complete File Checklist

To create a new component `{componentname}` at version v1, the following files are required:

### Java Backend (bundles/af-core/src/main/java/com/adobe/cq/forms/core/components/)

| # | File | Purpose |
|---|------|---------|
| 1 | `models/form/{ComponentName}.java` | Public interface |
| 2 | `internal/models/v1/form/{ComponentName}Impl.java` | Sling Model implementation |
| 3 | `internal/form/FormConstants.java` (edit) | Add `RT_FD_FORM_{COMPONENT}_V1` constant |

### Tests (bundles/af-core/src/test/)

| # | File | Purpose |
|---|------|---------|
| 4 | `java/.../internal/models/v1/form/{ComponentName}ImplTest.java` | Unit tests |
| 5 | `resources/form/{componentname}/test-content.json` | Mock JCR content |
| 6 | `resources/form/{componentname}/exporter-{componentname}.json` | Expected JSON export |

### UI AF Apps (ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/)

| # | File | Purpose |
|---|------|---------|
| 7 | `{componentname}/v1/{componentname}/.content.xml` | Component definition |
| 8 | `{componentname}/v1/{componentname}/{componentname}.html` | HTL template |
| 9 | `{componentname}/v1/{componentname}/{componentname}.js` | Renderer path config |
| 10 | `{componentname}/v1/{componentname}/_cq_dialog/.content.xml` | Author dialog |
| 11 | `{componentname}/v1/{componentname}/clientlibs/site/.content.xml` | Runtime clientlib definition |
| 12 | `{componentname}/v1/{componentname}/clientlibs/site/js/{componentname}view.js` | Client-side view class |
| 13 | `{componentname}/v1/{componentname}/clientlibs/site/js.txt` | JS manifest |
| 14 | `{componentname}/v1/{componentname}/clientlibs/site/css/{componentname}.less` | Styles |
| 15 | `{componentname}/v1/{componentname}/clientlibs/site/css.txt` | CSS manifest |
| 16 | `{componentname}/v1/{componentname}/clientlibs/editor/.content.xml` | Editor clientlib |

### Examples

| # | File | Purpose |
|---|------|---------|
| 17 | `examples/ui.apps/.../form/{componentname}/.content.xml` | Example proxy component |
| 18 | `examples/ui.content/.../adaptive-form/{componentname}/.content.xml` | Example content page |

### Integration Tests

| # | File | Purpose |
|---|------|---------|
| 19 | `it/content/.../samples/{componentname}/{componentname}v1/basic/.content.xml` | IT test content |

---

## Interface Hierarchy

```
FormComponent
  └── Base (label, description, tooltip, screenReaderText, enabled, type)
        └── BaseConstraint (required, validationExpression, constraintMessages)
              └── Field (readOnly, placeholder, default, displayFormat, emptyValue)
                    ├── StringConstraint (minLength, maxLength, pattern, format)
                    ├── NumberConstraint (minimum, maximum, exclusiveMinimum/Maximum)
                    ├── DateConstraint (minimumDate, maximumDate)
                    └── OptionsConstraint (enum[], enumNames[], enforceEnum)
```

## Implementation Hierarchy

```
AbstractComponentImpl (WCM Core)
  └── AbstractFormComponentImpl (name, fieldType, dataRef, visible, value, events, rules)
        └── AbstractBaseImpl (label, description, tooltip, type, required, enabled)
              └── AbstractFieldImpl (readOnly, default, placeholder, min/max constraints)
                    ├── AbstractOptionsFieldImpl (enum, enumNames, enforceEnum)
                    └── [Direct subclasses for simple fields]
```

Choose the appropriate base class:
- **Simple text/number field** -> extend `AbstractFieldImpl`
- **Options-based field** (checkboxes, radios, selects) -> extend `AbstractOptionsFieldImpl`
- **Container/panel** -> extend `AbstractContainerImpl`
- **Non-input component** (button, text, image) -> extend `AbstractBaseImpl`

---

## FormConstants Pattern

```java
public final static String RT_FD_FORM_PREFIX = "core/fd/components/form/";
// Pattern: RT_FD_FORM_{COMPONENT}_V{N} = RT_FD_FORM_PREFIX + "{componentname}/v{n}/{componentname}"
public final static String RT_FD_FORM_TEXT_V1 = RT_FD_FORM_PREFIX + "textinput/v1/textinput";
```

## FieldType Values

Common field types (from `FieldType` enum):
- `text-input`, `multiline-input`, `number-input`, `date-input`
- `checkbox`, `checkbox-group`, `radio-group`, `drop-down`
- `file-input`, `button`, `panel`, `form`, `plain-text`, `image`

---

## ReservedProperties

All JCR property names used by the framework are declared in `ReservedProperties.java`. When adding new JCR properties for a custom component, check that names do not collide with existing reserved properties. If the property is framework-level (reusable across components), add it to `ReservedProperties`.

---

## Component Family Layout

A **component family** is a parent container plus one or more child components with a fixed parent/child relationship (parent's drop targets only accept the children, children are hidden from the standard component browser).

### File checklist multiplier

When generating a family, repeat the file checklist (top of this document) **once per component**. A family with one parent and two child components results in **3× the file count** — three Java impls, three HTL templates, three dialogs, three clientlib pairs, three test triplets.

### resourceSuperType chain

Children that share visual or behavioral structure should inherit via `sling:resourceSuperType` rather than duplicating files. Two patterns are valid:

| Inheritance | When to use | `sling:resourceSuperType` value |
|---|---|---|
| Child → `panelcontainer` | Each child has independent HTL/clientlib | `core/fd/components/form/panelcontainer/v1/panelcontainer` |
| Child B → Child A → `panelcontainer` | Child B is a specialization of Child A (e.g. a header variant of a row) | `core/fd/components/form/{childAname}/v1/{childAname}` for B; the standard panelcontainer path for A |

The inheriting child can override individual files (HTL, dialog, edit config) while inheriting the rest from its `resourceSuperType`.

### Cross-component references

| Place | Reference |
|---|---|
| Parent's `_cq_editConfig.xml` `<cq:dropTargets>` `accept` | Regex covering each child's full resource type, e.g. `core/fd/components/form/{childname}/.*` |
| Parent's `_cq_template.xml` | Each pre-seeded child node sets `sling:resourceType` to the child's full resource type |
| Parent's HTL `<sly data-sly-resource>` | Iterates over `{parent}.items` — children are addressed by their own resource type, no special parent-side wiring |
| Family child's `componentGroup` in `.content.xml` | `.hidden` so authors can't drop the child outside its parent |

### When to create a new abstract Java class

Almost never. The family parent extends `PanelImpl`; each family child extends `PanelImpl` (or its sibling's impl, if the resourceSuperType chain calls for shared Java logic). Introduce a new `Abstract*Impl` only when **three or more** components in the family share non-trivial logic that isn't already in `PanelImpl`.

---

## FormPanel Extension Points

When writing a runtime view that extends `FormView.FormPanel`, override the documented hooks below instead of:

- patching `ui.frontend/src/view/FormPanel.js`
- patching `ui.frontend/src/view/InstanceManager.js`
- reaching across the DOM tree to manipulate sibling components
- forking framework files to add component-specific branches

Each hook has a sensible default. Override only when the default breaks for the component's DOM shape.

| Hook | Default behavior | Override when |
|---|---|---|
| `getRepeatableInstancesContainerElement()` | Returns the parent of the panel's first child | The container's child-holding wrapper is not the panel's `parentElement` (e.g. children live inside a nested `<tbody>`, `<ol>`, or named `__body` div) |
| `getRepeatableDomWrapper(childView)` | Returns `childView.element` | Each repeatable child is wrapped in a non-`<div>` element (`<tr>`, `<li>`, `<section>`) that must be the cloned/removed unit |
| `addRepeatableMarkup(instanceManager, addedModel, htmlElement)` | Inserts `htmlElement` as a sibling using model index | Standard sibling insertion places the new instance in the wrong slot, or the container needs custom DOM positioning logic |
| `handleChildAddition(childView)` / `handleChildRemoval(removedInstanceView)` | No-op | The container needs to react to child add/remove (e.g. sync visibility of add/remove buttons against `minOccur`/`maxOccur`, recompute layout) |
| `setModel(model)` | Standard binding | The component needs to defer setup to the next microtask after the model binds (use `queueMicrotask(...)` for DOM-dependent initialization) |
| `applyState(state)` | Standard label/visibility/enabled propagation | The component's HTML doesn't have the standard `__label-container > __label` structure and needs a custom `updateLabel(label)` |
| `getWidget()` / `getErrorDiv()` / `getTooltipDiv()` / `getQuestionMarkDiv()` | Return BEM-derived elements | The container has no widget element, no inline error display, no per-component tooltip, etc. — return `null` to opt out of the corresponding base behavior |

### Touching shared runtime files

Patching `FormPanel.js`, `InstanceManager.js`, `utils.js`, or other runtime files is **a last resort**. Before touching them, verify:

1. None of the documented extension points covers the use case.
2. The change is **generally applicable** — every container with the same DOM shape benefits, not just the one being built.
3. The change preserves backward compatibility for every existing container.

If all three hold, extend the runtime base — typically by **adding a new override hook** (so future containers don't need the same patch) rather than by branching on a specific resource type. Document the new hook in this table when you add it.

---

## Editor Hook File Map

When `_cq_editConfig.xml` references handlers via `CQ.FormsCoreComponents.editorhooks.{name}`, those handlers live in the shared container clientlib:

```
ui.apps/src/main/content/jcr_root/apps/core/wcm/components/container/v2/container/clientlibs/editorhook/
├── .content.xml      (clientlib definition)
├── js.txt            (manifest — register every hook file here)
└── js/
    └── *.js          (hook files)
```

See `editor-hooks.md` for skeletons, registration, and patterns. **Do not** create a per-component editor clientlib for these handlers — the shared clientlib is already an editor dependency, and adding to its `js.txt` makes the new handlers immediately available everywhere.
