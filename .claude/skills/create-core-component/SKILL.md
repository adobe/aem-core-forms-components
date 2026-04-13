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

Before generating any code, collect the following from the user:

1. **Component name** — e.g., `ImageChoice`, `StarRating`, `ColorPicker`
2. **Component type** — which category:
   - **Simple field** (text-like input) → extends `AbstractFieldImpl` / implements `Field`
   - **Options field** (multiple choices) → extends `AbstractOptionsFieldImpl` / implements `OptionsConstraint`
   - **Container** (holds child components) → extends `AbstractContainerImpl`
   - **Display-only** (non-input: text, image, separator) → extends `AbstractBaseImpl` / implements `Base`
3. **Custom properties** — any JCR properties beyond what the base class provides
4. **Widget HTML** — what the interactive element looks like (input, select, custom markup)
5. **Constraints** — which constraint interfaces apply (String, Number, Date, Options, File)

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

4. **Component definition** — `.content.xml` with `sling:resourceSuperType="core/fd/components/form/base/v1/base"`

5. **HTL template** — Follow the standard structure:
   - Include shared templates via `data-sly-use` (label, shortDescription, longDescription, errorMessage, questionMark)
   - Root `<div>` with `data-cmp-is`, `data-cmp-visible`, `data-cmp-enabled`, `data-cmp-required`, `data-cmp-readonly`
   - Label container with label + question mark
   - Widget area (component-specific)
   - Short description, long description, error message sections
   - **CRITICAL**: Read `references/accessibility-checklist.md` and ensure every applicable item is satisfied

6. **Renderer JS** — Return paths to shared field templates

7. **Dialog XML** — Include base dialog fields via `granite/ui/components/coral/foundation/include`, add component-specific tabs/fields

8. **Site clientlib** — `.content.xml`, `js.txt`, `css.txt`, view JS, LESS styles

9. **Editor clientlib** — `.content.xml` with editor category

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

- `references/component-anatomy.md` — Full file checklist, interface/implementation hierarchy, FormConstants pattern
- `references/templates.md` — Copy-paste-ready templates for every file type with placeholders
- `references/accessibility-checklist.md` — WCAG 2.1 AA checklist with AEM-specific ARIA patterns
- `scripts/validate_component.py` — Automated validator (90+ checks) — run after generating all files

## Critical Rules

1. **Never skip the accessibility checklist** — Every component must satisfy WCAG 2.1 AA
2. **Always use existing abstract base classes** — Do not reinvent label/description/tooltip/error handling
3. **Always register in FormConstants** — The resource type constant is required for Sling Model resolution
4. **Follow BEM strictly** — `cmp-adaptiveform-{componentname}__{element}` with no exceptions
5. **Use shared field templates** — Label, description, error message, question mark templates from `af-commons`
6. **JSON export must validate** — The exporter JSON test validates against the Adaptive Form JSON schema
7. **Match existing copyright headers** — Apache License 2.0 headers on all Java, JS, HTL, and LESS files. Use the **current calendar year** (not a hardcoded year) in `Copyright {year} Adobe`
8. **Include `data-cmp-data-layer`** — The root `<div>` in HTL must include `data-cmp-data-layer="${{componentname}.data.json}"` for analytics/data layer integration
9. **Use `@ValueMapValue` with `InjectionStrategy.OPTIONAL`** — Never use `REQUIRED`; missing properties should use defaults
10. **Test both `Resource` and `SlingHttpServletRequest` adaptation** — The `@Model` annotation must list both `adaptables`
11. **Widget ID convention** — Always `{componentId}-widget` via `${'{0}-{1}' @ format=[component.id, 'widget']}`
