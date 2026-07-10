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

Before generating any code or reading any reference files, collect all of the following from the user in a single message. Do not proceed until all answers are received.

1. **Component name and purpose** — e.g., `ImageChoice` (radio group with image thumbnails), `StarRating` (captures 1–5 star rating)
2. **Component type** — which category:
   - **Simple field** (text-like input that captures a single value) → extends `AbstractFieldImpl` / implements `Field`
   - **Options field** (multiple choices: checkboxes, radios, dropdowns) → extends `AbstractOptionsFieldImpl` / implements `OptionsConstraint`
   - **Container** (holds child components) → extends `AbstractContainerImpl`
   - **Step / display** (non-input: text, image, separator) → extends `AbstractBaseImpl` / implements `Base`
   - **Display/text** (renders authored HTML content with a title label) → `sling:resourceSuperType="core/fd/components/form/text/v1/text"`, extends `AbstractBaseImpl`, implements `Text`
3. **Custom properties** — any JCR properties beyond what the base class provides (name, type, default, purpose for each)
4. **Widget HTML** — what the interactive element looks like (input type, select, custom div, etc.)
5. **Constraints** — which constraint interfaces apply (String, Number, Date, Options, File)
6. **Target repository and component group** — which repo (`aem-core-forms-components`, or a project overlay) and what `componentGroup` for the author toolbar (e.g., `".core-adaptiveform"`)
7. **Java backend** — does this component need a custom Sling Model, or can it reuse an existing Core model via `sling:resourceSuperType`? (Reuse is appropriate when the component only adds JS behavior on top of an existing field type; custom Java is required for new authored properties exposed in HTL or JSON)
8. **FormContainer-level properties** — does this component need any configuration authored on the parent form container rather than on the component instance itself? (e.g., a signing service path set once for the whole form) If yes: what properties, and what tab name should they appear under in the form container dialog?

### Phase 2: Derive Naming Conventions

From the component name, derive all naming variants. For example, given `ImageChoice`:

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
| `fd:viewType` (step only) | `image-choice` |

### Phase 3: Generate Files

Read `references/templates.md` for the full template set. Read `references/component-anatomy.md` for the file checklist and class hierarchy. Generate files in the following order:

#### 3a. Java Backend

1. **Add FormConstants entry** — Edit `bundles/af-core/src/main/java/com/adobe/cq/forms/core/components/internal/form/FormConstants.java` to add the resource type constant.

2. **Create interface** — `bundles/af-core/src/main/java/com/adobe/cq/forms/core/components/models/form/{ComponentName}.java`
   - Annotate with `@ConsumerType`
   - Extend the appropriate base interface
   - Add only component-specific method signatures

3. **Create implementation** — `bundles/af-core/src/main/java/com/adobe/cq/forms/core/components/internal/models/v1/form/{ComponentName}Impl.java`
   - `@Model` with `adaptables = { SlingHttpServletRequest.class, Resource.class }`
   - `@Model` `adapters` must list both the interface AND `ComponentExporter.class`
   - `@Model` `resourceType` must reference the `FormConstants` constant
   - `@Exporter` for JSON model export
   - Extend the correct abstract base class
   - Use `@ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL)` for JCR properties
   - Override `getFieldType()` returning the appropriate `FieldType` enum value
   - Use `@PostConstruct` for initialization logic

#### 3b. UI AF Apps (HTL, Dialogs, Clientlibs)

4. **Component definition** — `.content.xml` with `sling:resourceSuperType` set to the appropriate base. Also create `_cq_template.xml` (instance defaults: `jcr:title`, `fieldType`, and `fd:viewType` for step components) and `_cq_editConfig.xml` (author toolbar — use the inplace RTE variant from `references/templates.md` template #16 for display/text components). See `references/templates.md` templates #6, #6b, and #16.

5. **HTL template** — Choose the correct variant from `references/templates.md`:
   - **Template #7** — field components (captures a value)
   - **Template #7b** — step/display components (no widget)
   - **Template #7c** — display/text with label and rich-text value area
   
     Follow the standard structure for the chosen variant:
   - Include shared templates via `data-sly-use` (label, shortDescription, longDescription, errorMessage, questionMark)
   - Root `<div>` with `data-cmp-is`, `data-cmp-visible`, `data-cmp-enabled`, `data-cmp-required`, `data-cmp-readonly`
   - Label container with label + question mark
   - Widget area (component-specific)
   - Short description, long description, error message sections
   - **CRITICAL**: Read `references/accessibility-checklist.md` and ensure every applicable item is satisfied

6. **Renderer JS** — Return paths to shared field templates

7. **Dialog XML** — Include base dialog fields via `granite/ui/components/coral/foundation/include`, add component-specific tabs/fields

8. **Site clientlib** — `.content.xml`, `js.txt`, `css.txt`, view JS (`references/templates.md` #11 or #11b), and the CSS stub (empty BEM rules in `aem-core-forms-components`) plus the theme SCSS (actual styles in `aem-forms-theme-canvas`). See `references/css-architecture.md` and `references/templates.md` #12.

9. **Editor clientlib** — `.content.xml` with editor category. For dialogs with conditional field visibility, see `references/editor-clientlib.md`.

#### 3c. Tests

10. **Unit test** — JUnit 5 with `@ExtendWith(AemContextExtension.class)`:
    - Use `FormsCoreComponentTestContext.newAemContext()`
    - Load `test-content.json` in `@BeforeEach`
    - Test `getFieldType()`, `getName()`, `getLabel()`, visibility, enabled, readOnly
    - Test JSON export with `Utils.testJSONExport()`
    - Test all custom properties and methods

11. **Test content JSON** — Mock JCR nodes with `sling:resourceType` matching the FormConstants value

12. **Exporter JSON** — Expected JSON output for export validation

#### 3d. Examples & IT Content

13. **Example proxy component** — `.content.xml` with `sling:resourceSuperType` pointing to the component
14. **Example content page** — Page structure with `guideContainer` and sample component instance
15. **Register in example index** — Add entry to `examples/ui.content/.../adaptive-form/.content.xml`

#### 3e. Wiring and Registration

After all files are created, complete the wiring steps from `references/wiring-steps.md`:

- **Step 1** — Embed the clientlib category in `core-forms-components-runtime-all/.content.xml`
- **Step 2** — Add `FormConstants` resource type constant (if needed by other Java code)
- **Step 3** — Add i18n strings to all 10 language files (if new constraint messages were added)
- **Step 4** — Content migration (see `migrate-foundation-component` skill — not applicable for new components)
- **Step 5** — Extend FormContainer dialog (if component reads form-level properties)
- **Step 6** — Register component group in the production template policy
- **Step 7** — Create integration test content and register it in the IT template policy

### Phase 4: Accessibility Verification

After generating all files, work through `references/accessibility-checklist.md` and satisfy every applicable item (labels, ARIA states, live regions, keyboard, focus, BEM). That file is the single source of truth for the WCAG 2.1 AA requirements.

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

- `references/component-anatomy.md` — Full file checklist, interface/implementation hierarchy, FormConstants pattern
- `references/templates.md` — Copy-paste-ready templates for every file type with placeholders (including variants 2b, 6b, 7b, 7c, 11b, 11c, 16)
- `references/accessibility-checklist.md` — WCAG 2.1 AA checklist with AEM-specific ARIA patterns
- `references/architecture-reference.md` — Five-layer component architecture diagram and base class selection guide
- `references/css-architecture.md` — Two-layer CSS split: stub in `aem-core-forms-components`, SCSS in `aem-forms-theme-canvas`
- `references/widget-patterns.md` — HTML widget element patterns for each component type
- `references/wiring-steps.md` — Post-generation wiring: clientlib embed, FormConstants, i18n, FormContainer dialog, template policy
- `references/verification-checklist.md` — Post-implementation checklist covering structure, wiring, CSS, HTL, JS, Java, and tests
- `references/common-mistakes.md` — 25 common implementation mistakes with fixes
- `references/editor-clientlib.md` — JS-driven conditional field visibility in author dialogs
- `references/composite-multifield.md` — Composite multifield patterns for repeatable dialog items
- `references/datasource-servlet.md` — Dynamic JCR-sourced options for Granite UI selects
- `scripts/validate_component.py` — Automated validator (90+ checks) — run after generating all files

## Critical Rules

Terse non-negotiables. Where a rule has a detailed rationale or failure mode, it is documented once in the referenced file — do not restate it here.

1. **Never skip accessibility** — satisfy every applicable item in `references/accessibility-checklist.md` (WCAG 2.1 AA).
2. **Always extend an existing abstract base class** — do not reinvent label/description/tooltip/error handling. See `references/architecture-reference.md`.
3. **Always register in FormConstants** — the resource type constant is required for Sling Model resolution.
4. **Follow BEM strictly** — `cmp-adaptiveform-{componentname}__{element}`, no exceptions.
5. **Use shared field templates** from `af-commons` (label, description, error message, question mark).
6. **JSON export must validate** against the Adaptive Form JSON schema (exporter test).
7. **Match existing copyright headers** — Apache License 2.0 on all Java/JS/HTL/LESS files, using the current calendar year.
8. **Include `data-cmp-data-layer`** on the root `<div>` for data-layer integration.
9. **Widget ID convention** — always `{componentId}-widget` via `${'{0}-{1}' @ format=[component.id, 'widget']}`.
10. **`_cq_editConfig.xml` is required** for every component (display/text with inplace editing uses the extended variant — `references/templates.md` template #16).
11. **CSS is split across two repos** — see `references/css-architecture.md` for what goes where.
12. **Read `references/common-mistakes.md` before Phase 3** — it is the source of truth for the recurring failure modes (`@ValueMapValue`/`InjectionStrategy.OPTIONAL`, dual `adaptables`, `data-sly-test` on `__value`, and others); those are not repeated here.
