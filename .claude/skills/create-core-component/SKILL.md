---
name: create-core-component
description: This skill should be used when creating a new custom AEM Core Form Component, scaffolding all required files (Java model, Sling Model implementation, HTL template, dialog, clientlibs, tests, examples) following established project patterns, WCAG 2.1 AA accessibility standards, and BEM naming conventions. Use when the user asks to "create a component", "add a new form field", "scaffold a component", or "build a new adaptive form component".
---

# Create AEM Core Form Component

Scaffold a complete, production-ready AEM Core Form Component across all layers (Java backend, HTL frontend, clientlibs, dialogs, tests, examples) following the exact patterns established in the `aem-core-forms-components` repository.

## When to Use

- Creating a new adaptive form component from scratch
- Adding a new form field type to the component library
- Scaffolding the full file set for a custom component

## Workflow

### Phase 1: Gather Requirements

Before generating any code, collect the following from the user. Ask **shape** first — it gates which template set to use and whether you scaffold one component or several in lockstep.

1. **Component name(s)** — e.g., `ImageChoice`, `StarRating`, `ColorPicker`
2. **Component shape** — pick exactly one:
   - **a. Single leaf field** — one component, no children. Use `references/templates.md`.
   - **b. Single container** — one component that holds arbitrary children dropped by the author. Use `references/templates-container.md`.
   - **c. Component family** — a parent component plus one or more child components with a fixed parent/child relationship (the parent's drop targets only accept the children, the children's component group is `.hidden`, the children may inherit from each other via `sling:resourceSuperType`). Loop the **template generation** phase once per component in the family. Use `references/templates-container.md` for each, then wire the relationships per the family checklist in that file.
3. **Component type (only for shape 1a)** — which Java base class:
   - **Simple field** (text-like input) → extends `AbstractFieldImpl` / implements `Field`
   - **Options field** (multiple choices) → extends `AbstractOptionsFieldImpl` / implements `OptionsConstraint`
   - **Display-only** (non-input: text, image, separator) → extends `AbstractBaseImpl` / implements `Base`

   For **container shapes (1b, 1c)** the impl extends `PanelImpl` directly and reuses the existing `Panel` interface. **Do not create a new public interface** unless the container exposes new methods to HTL/JSON beyond what `Panel` already provides; in that case create the interface and have the impl `implements` it (the `@Model` `adapters` still lists `Panel.class, ComponentExporter.class`).
4. **Custom properties** — any JCR properties beyond what the base class provides
5. **Widget HTML** — what the interactive element looks like (input, select, custom markup, container skeleton)
6. **Constraints** (leaf fields only) — which constraint interfaces apply (String, Number, Date, Options, File)
7. **Authoring affordances** (containers and families only) — does the component need any of:
   - Pre-seeded children in `_cq_template.xml` so authors get a working skeleton on insert?
   - Custom toolbar actions on the editbar (e.g. Add/Delete/Move children, open Rule Editor, View SOM)?
   - Drop-target restrictions (parent accepts only specific child `resourceTypes`)?
   - Conditional actions (action visible only when editable is first/last child, header vs. body, etc.)?
   - Replace-component policy override (skip the default fieldType-family compatibility check for children inside this container)?

   If any of the last four apply, read `references/editor-hooks.md` and scaffold the matching hook file in Phase 3b. The skill must not silently skip these; ask the user explicitly.

### Phase 2: Derive Naming Conventions

From each component name, derive all naming variants. For example, given `ImageChoice`:

| Variant | Value |
|---------|-------|
| PascalCase | `ImageChoice` |
| lowercase | `imagechoice` |
| UPPER_SNAKE | `IMAGE_CHOICE` |
| kebab-case | `image-choice` |
| BEM block | `cmp-adaptiveform-imagechoice` |
| data-cmp-is | `adaptiveFormImageChoice` |
| Resource type | `core/fd/components/form/imagechoice/v1/imagechoice` |
| Clientlib category | `core.forms.components.imagechoice.v1.runtime` |
| FormConstant | `RT_FD_FORM_IMAGE_CHOICE_V1` |

For a **component family** (shape 1c), repeat this table for every component. Also record the family's **drop-target accept list** (regex patterns for the children's resourceTypes) and **resourceSuperType chain** (which child inherits from which) — both are referenced by templates in Phase 3.

### Phase 3: Generate Files

Read `references/templates.md` for the leaf-field template set, or `references/templates-container.md` for the container/family template set. Read `references/component-anatomy.md` for the file checklist, class hierarchy, and runtime extension points. Generate files in the following order. **For component families (shape 1c), run Phase 3a–3b once per component, then do the family-wiring step at the end of 3b.**

#### 3a. Java Backend

1. **Add FormConstants entry** — Edit `bundles/af-core/src/main/java/com/adobe/cq/forms/core/components/internal/form/FormConstants.java` to add one resource type constant per component.

2. **Add ReservedProperties entries (if needed)** — If the component introduces JCR property names not already listed in `bundles/af-core/.../internal/form/ReservedProperties.java`, add them there before referencing them in `@ValueMapValue(name = …)`. Skip this step for properties already declared.

3. **Create interface** — `bundles/af-core/src/main/java/com/adobe/cq/forms/core/components/models/form/{ComponentName}.java`
   - Annotate with `@ConsumerType`
   - Extend the appropriate base interface
   - Add only component-specific method signatures
   - **Skip this step for shape 1b/1c containers that don't expose new methods** — reuse the existing `Panel` interface.

4. **Create implementation** — `bundles/af-core/src/main/java/com/adobe/cq/forms/core/components/internal/models/v1/form/{ComponentName}Impl.java`
   - `@Model` with `adaptables = { SlingHttpServletRequest.class, Resource.class }`
   - `@Model` `adapters` must list both the public interface (`Panel.class` for containers reusing Panel) AND `ComponentExporter.class`
   - `@Model` `resourceType` must reference the `FormConstants` constant
   - `@Exporter` for JSON model export
   - Extend the correct base class (`AbstractFieldImpl`, `AbstractOptionsFieldImpl`, `AbstractBaseImpl`, or `PanelImpl` for containers)
   - Use `@ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)` for JCR properties
   - For leaf fields: override `getFieldType()` returning the appropriate `FieldType` enum value. For containers extending `PanelImpl`: do not override `getFieldType()` unless emitting a different value than `panel`.
   - Use `@PostConstruct` for initialization logic
   - Use `@JsonInclude(JsonInclude.Include.NON_DEFAULT)` on getters whose default value should be omitted from the JSON model
   - Use `@JsonIgnore` on computed/derived getters that are consumed by HTL only and must not appear in the runtime JSON

#### 3b. UI AF Apps (HTL, Dialogs, Clientlibs)

5. **Component definition** — `.content.xml`
   - Leaf field: `sling:resourceSuperType="core/fd/components/form/base/v1/base"`
   - Container: `sling:resourceSuperType="core/fd/components/form/panelcontainer/v1/panelcontainer"`, plus `cq:isContainer="{Boolean}true"`
   - Hidden child of a family: set `componentGroup=".hidden"` so authors can't drop it directly outside its parent

6. **HTL template** — Follow the standard structure:
   - Include shared templates via `data-sly-use` (label, shortDescription, longDescription, errorMessage, questionMark)
   - Root `<div>` with `data-cmp-is`, `data-cmp-visible`, `data-cmp-enabled`, `data-cmp-required`, `data-cmp-readonly`
   - Label container with label + question mark
   - Widget area (component-specific)
   - Short description, long description, error message sections
   - For containers: render children via `data-sly-resource` over `{componentname}.items`, with edit-mode markers (`cq-Editable-dom`) so the overlay binds correctly to non-`<div>` wrappers
   - **CRITICAL**: Read `references/accessibility-checklist.md` and ensure every applicable item is satisfied

7. **Renderer JS** — Return paths to shared field templates

8. **Dialog XML** — Include base dialog fields via `granite/ui/components/coral/foundation/include`, add component-specific tabs/fields

9. **`_cq_template.xml`** — Pre-seeded JCR skeleton inserted when the author drops the component
   - Leaf field: typically empty body, just `jcr:title` and `fieldType`
   - Container with seed children (per Phase 1.7): nest exemplar child nodes with their `sling:resourceType` set to the child component's resource type. See `references/templates-container.md` for the pattern.

10. **`_cq_editConfig.xml`** — Author-time configuration
    - Always: `cq:actions`, `cq:dialogMode`, `cq:layout`, `cq:disableTargeting`
    - Containers with restricted children: add `<cq:dropTargets>` with an `accept` regex array
    - Containers that need the overlay to repaint after structural edits: add `<cq:listeners>` with `afterchildinsert` / `afterchilddelete` calling `Granite.author.responsive.EditableActions.REFRESH.execute(editable)`
    - Components with custom editbar actions: add `<cq:actionConfigs>` entries pointing to handler functions registered by an editor hook (see step 12)

11. **Site clientlib** — `.content.xml`, `js.txt`, `css.txt`, view JS, LESS styles
    - For containers, the runtime view extends `FormView.FormPanel`. Read the **FormPanel Extension Points** section of `component-anatomy.md` before writing custom child-insertion logic — override the documented hooks instead of reaching into siblings.

12. **Editor clientlib** — `.content.xml` with editor category. If Phase 1.7 flagged custom toolbar actions, drop policies, conditional actions, or replace overrides, also add a hook JS file under `ui.apps/.../container/v2/container/clientlibs/editorhook/js/` and register it in that clientlib's `js.txt`. Use the patterns in `references/editor-hooks.md` — never invent new namespaces; register handlers under `CQ.FormsCoreComponents.editorhooks.*`.

13. **Family wiring (shape 1c only)** — After all components in the family are scaffolded, verify:
    - The parent's `_cq_editConfig.xml` `<cq:dropTargets>` `accept` list contains a regex for every child component's resource type
    - Children that share visual or behavioral structure use `sling:resourceSuperType` to inherit (the inheriting child's `.content.xml` points at the base child's resource path, not at `panelcontainer`)
    - All non-parent components in the family have `componentGroup=".hidden"`
    - The parent's `_cq_template.xml` references the children by their full resource type

#### 3c. Tests

Tests are required for every component, including each member of a component family. Generate one set per component.

14. **Unit test** — JUnit 5 with `@ExtendWith(AemContextExtension.class)`:
    - Use `FormsCoreComponentTestContext.newAemContext()`
    - Load `test-content.json` in `@BeforeEach`
    - Test `getFieldType()`, `getName()`, `getLabel()`, visibility, enabled, readOnly
    - Test JSON export with `Utils.testJSONExport()`
    - Test all custom properties and methods
    - For getters annotated with `@JsonInclude(NON_DEFAULT)`, include at least one test asserting the field is **absent** from the JSON when the underlying value is the default

15. **Test content JSON** — Mock JCR nodes with `sling:resourceType` matching the FormConstants value. For containers with seeded children, the test JSON typically omits the children (the impl-level test covers the parent's own properties; child impls are tested separately).

16. **Exporter JSON** — Expected JSON output for export validation

#### 3d. Examples & IT Content

17. **Example proxy component** — `.content.xml` with `sling:resourceSuperType` pointing to the component (for a family, only the parent typically needs an example proxy; children appear inside the parent's example template)
18. **Example content page** — Page structure with `guideContainer` and a sample instance. For a container, the example template should include exemplar children matching real authoring usage
19. **Register in example index** — Add entry to `examples/ui.content/.../adaptive-form/.content.xml`

### Phase 4: Accessibility Verification

After generating all files, read `references/accessibility-checklist.md` and verify:

1. **HTL template** — Every interactive element has `aria-label` or `<label for>`, error div has `aria-live="assertive"`, descriptions have `aria-live="polite"`
2. **JS view** — `updateValidity()` sets `aria-invalid`, `updateReadOnly()` sets `aria-readonly`, focus/blur handlers call `setActive()`/`setInactive()`
3. **LESS styles** — `:focus` has visible `outline` with `2px` minimum, error states use color + text
4. **Keyboard** — All interactive elements have `tabindex` if not natively focusable
5. **BEM** — All class names follow `cmp-adaptiveform-{componentname}__{element}` convention

### Phase 5: Validation

Run the component validator script to check all files, conventions, and accessibility compliance:

```bash
python3 scripts/validate_component.py {componentname} --repo-root /path/to/aem-core-forms-components
```

The validator performs **90+ checks** across 12 categories:
1. File existence (all 19+ required files)
2. FormConstants registration
3. Java interface annotations (`@ConsumerType`, copyright, base interface)
4. Java implementation annotations (`@Model`, `@Exporter`, adaptables, injection strategy)
5. HTL template (`data-cmp-*` attributes, shared templates, BEM, FormStructureParser)
6. Accessibility (label linkage, ARIA, error containers, focus management, keyboard)
7. Component definition (resourceSuperType, componentGroup)
8. Dialog (resourceType, trackingFeature, extraClientlibs, base includes)
9. Clientlib (naming convention, dependencies, allowProxy, js.txt/css.txt)
10. BEM consistency (all elements present across HTL, JS, CSS, styleConfig)
11. Example content (namespace declarations, guideContainer, proxy resourceSuperType)
12. Tests (AemContext, JSON export, fieldType, resourceType)

Fix all FAILs before proceeding. WARNs should be reviewed but may be acceptable.

### Phase 6: Build Verification

Run the Java build to verify compilation:

```bash
cd bundles/af-core && mvn clean compile -pl . 2>&1 | tail -20
```

Run tests:

```bash
cd bundles/af-core && mvn test -pl . -Dtest={ComponentName}ImplTest 2>&1 | tail -30
```

## Key References

- `references/component-anatomy.md` — Full file checklist, interface/implementation hierarchy, FormConstants pattern, FormPanel extension points, component-family layout
- `references/templates.md` — Copy-paste-ready templates for **leaf field** components
- `references/templates-container.md` — Copy-paste-ready templates for **container** components and **component families** (parent + children, drop targets, seeded `_cq_template`, FormPanel runtime view)
- `references/editor-hooks.md` — Patterns for custom toolbar actions, drop policies, conditional actions, and replace-component overrides; how to register hooks under `CQ.FormsCoreComponents.editorhooks.*`
- `references/accessibility-checklist.md` — WCAG 2.1 AA checklist with AEM-specific ARIA patterns
- `scripts/validate_component.py` — Automated validator (90+ checks) — run after generating all files

## Critical Rules

1. **Never skip the accessibility checklist** — Every component must satisfy WCAG 2.1 AA
2. **Always use existing abstract base classes** — Do not reinvent label/description/tooltip/error handling, and do not invent a new abstract container when `PanelImpl` already covers the case
3. **Always register in FormConstants** — One resource type constant per component, including every member of a component family
4. **Follow BEM strictly** — `cmp-adaptiveform-{componentname}__{element}` with no exceptions
5. **Use shared field templates** — Label, description, error message, question mark templates from `af-commons`
6. **JSON export must validate** — The exporter JSON test validates against the Adaptive Form JSON schema; tests + exporter JSON are required artifacts, not optional
7. **Match existing copyright headers** — Apache License 2.0 headers on all Java, JS, HTL, and LESS files. Use the **current calendar year** (not a hardcoded year) in `Copyright {year} Adobe`
8. **Include `data-cmp-data-layer`** — The root `<div>` in HTL must include `data-cmp-data-layer="${{componentname}.data.json}"` for analytics/data layer integration
9. **Use `@ValueMapValue` with `InjectionStrategy.OPTIONAL`** — Never use `REQUIRED`; missing properties should use defaults
10. **Test both `Resource` and `SlingHttpServletRequest` adaptation** — The `@Model` annotation must list both `adaptables`
11. **Widget ID convention** — Always `{componentId}-widget` via `${'{0}-{1}' @ format=[component.id, 'widget']}`
12. **Never patch shared runtime files for one component** — If a container needs custom child-insertion or repeatable behavior, override the documented `FormPanel` extension points (see `component-anatomy.md` → FormPanel Extension Points). Touching `FormPanel.js`, `InstanceManager.js`, or `utils.js` is a last resort and must be justified by a generally applicable improvement, not a component-specific workaround
13. **Editor hooks live in the container clientlib** — Custom authoring behavior goes in `ui.apps/.../container/v2/container/clientlibs/editorhook/js/`, registered under `CQ.FormsCoreComponents.editorhooks.*`. Do not invent new global namespaces
14. **Hidden children of a family must use `componentGroup=".hidden"`** — Authors must not be able to drop a family child outside its parent
