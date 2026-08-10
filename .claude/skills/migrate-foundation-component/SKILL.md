---
name: migrate-foundation-component
description: This skill should be used when migrating an existing AEM Foundation (Classic/Guide) Form Component to a Core Form Component. For known standard components (guidetextbox, guidecheckbox, etc.), all foundation data is embedded within the skill. For custom foundation components, the user provides source file paths. Delegates to the create-core-component skill for scaffolding. Use when the user asks to "migrate a foundation component", "convert a guide component to core", "port a classic form field", or "upgrade a foundation field to core".
---

# Migrate Foundation Component to Core Component

Analyze an existing AEM Foundation (Guide) Form Component and migrate it to a fully production-ready AEM Core Form Component, preserving all properties, behaviors, dialog fields, and rendering semantics.

## When to Use

- Migrating an existing foundation/guide form component to the core component framework
- Porting a classic adaptive form field to the modern Core Components architecture
- Converting JSP-based foundation rendering to HTL-based core rendering
- Upgrading a component from the `cq-guides` codebase to `aem-core-forms-components`

## Prerequisites

- The `create-core-component` skill is available in this project
- For **custom** foundation components (not listed in `references/known-components.md`), the user must provide file paths to the source files

## Workflow

### Phase 1: Identify the Foundation Component

Before loading any data, collect the following upfront. Ask in a single message and wait for all answers:

- **Which foundation component** to migrate (name or path)
- **Target repository and component group** — which repo (`aem-core-forms-components`, or a project overlay) and what `componentGroup` for the author toolbar
- **FormContainer-level properties** — does the component need any configuration authored on the parent form container rather than on the component instance itself? If yes: what properties and what tab name?

#### Known Components (data embedded in skill)

If the component matches one listed below, all property, dialog, and rendering data is available in `references/known-components.md` — no external repository access is needed.

| Foundation Component | Directory | Java Class |
|---------------------|-----------|------------|
| Text Box | `guidetextbox` | `GuideTextBox` |
| Checkbox | `guidecheckbox` | `GuideCheckBox` |
| Radio Button | `guideradiobutton` | `GuideRadioButton` |
| Drop-Down List | `guidedropdownlist` | `GuideDropDownList` |
| Date Picker | `guidedatepicker` | `GuideDatePicker` |
| Date Input | `guidedateinput` | *(extends GuideDatePicker)* |
| File Upload | `guidefileupload` | `GuideFileUpload` |
| Numeric Box | `guidenumericbox` | `GuideNumericBox` |
| Numeric Stepper | `guidenumericstepper` | `GuideNumericStepper` |
| Email | `guideemail` | *(extends GuideTextBox)* |
| Telephone | `guidetelephone` | *(extends GuideTextBox)* |
| Password Box | `guidepasswordbox` | `GuidePasswordBox` |
| Button | `guidebutton` | `GuideButton` |
| Image | `guideimage` | `GuideImage` |
| Separator | `guideseparator` | `GuideSeparator` |
| Switch | `guideswitch` | `GuideSwitch` |
| Text Draw | `guidetextdraw` | `GuideTextDraw` |
| Scribble | `guidescribble` | `GuideScribble` |
| Terms & Conditions | `guidetermsandconditions` | `GuideTermsAndConditions` |
| Captcha | `guideCaptcha` | `GuideCaptcha` |
| Chart | `guidechart` | `GuideChart` |
| Panel | `panel` | `GuidePanel` |
| Container | `guideContainer` | `GuideContainer` |

For known components, proceed directly to Phase 2A.

#### Custom / Unknown Components

If the component is NOT in the list above, ask the user to provide paths to the following source files:

1. **Java Model class** (required) — the `.java` file with getter methods and `resourceProps.get()` calls
   - Example: `/path/to/MyCustomField.java`
2. **Widget template** (required) — the `widget.jsp` or `.html` rendering file
   - Example: `/path/to/widget.jsp`
3. **Touch UI Dialog** (required) — the `_cq_dialog/.content.xml` file
   - Example: `/path/to/_cq_dialog/.content.xml`
4. **Component definition** (required) — the `.content.xml` with metadata
   - Example: `/path/to/.content.xml`
5. **Formatters** (optional) — the `formatters.xml` if it exists
   - Example: `/path/to/formatters.xml`
6. **Style config** (optional) — the `_cq_styleConfig/.content.xml` if it exists

For custom components, proceed to Phase 2B.

### Phase 2A: Load Known Component Data

Read the component's section from `references/known-components.md`. This provides:
- Component title, icon, resource superType
- All component-specific JCR properties (name, type, default, Core action)
- Computed logic
- Dialog fields (name, Granite UI type, label)
- Widget rendering structure (HTML elements, conditional branches, attributes)
- Core mapping (target base class, interface, FieldType)

Also read the base class properties from the same file:
- `GuideNode` properties (inherited by all)
- `GuideField` properties (inherited by all field components)

Skip to Phase 3.

### Phase 2B: Analyze Custom Foundation Component

Read ALL the source files provided by the user. Extract information following the patterns documented in `references/foundation-anatomy.md`:

#### 2B-i. Component Metadata (from `.content.xml`)
- `jcr:title` → will become the Core component title
- `jcr:description` → will become the Core component description
- `sling:resourceSuperType` → determines the component hierarchy (guidefield, guideNode, etc.)
- `componentGroup` → note but will change to `.core-adaptiveform`
- `cq:icon` → map to a Core component icon name

#### 2B-ii. Java Model Class
Extract:
- **All public getter methods** — these define the component's properties
- **Property names** from `resourceProps.get("propertyName", ...)` calls — these are the JCR property names
- **Default values** — the fallback values in `resourceProps.get()` calls
- **Data types** — Boolean, String, Integer, etc.
- **Parent class** — determines the Core component base class mapping (see `references/property-mapping.md`)
- **Any computed properties** — logic that derives values from other properties

#### 2B-iii. Touch UI Dialog (from `_cq_dialog/.content.xml`)
Extract:
- All dialog fields (textfield, checkbox, select, numberfield, etc.)
- Field `name` attributes — these are the JCR property names authored by content authors
- Field labels and descriptions
- Any datasources or dynamic field configurations
- Granite UI component types used
- Event listeners (`af.listeners.*`)
- Any custom validation or conditional visibility logic

#### 2B-iv. Widget Rendering (from `widget.jsp` or `.html`)
Extract:
- The HTML structure of the rendered component
- Conditional rendering branches (e.g., multiLine vs single-line for textbox)
- CSS classes used
- ARIA attributes and accessibility patterns
- Data attributes used for client-side behavior
- XSS encoding patterns (these translate to HTL context expressions)
- Any included sub-JSPs

#### 2B-v. Formatters (from `formatters.xml`, if provided)
Extract:
- Display and validation patterns
- Pattern types (phone, SSN, email, zip, custom)

#### 2B-vi. Style Configuration (from `_cq_styleConfig/.content.xml`, if provided)
Extract:
- CSS selectors for styleable elements
- State-based styling (focus, disabled, error, hover)

### Phase 3: Build the Property Mapping

Using `references/property-mapping.md` and the component data (from Phase 2A or 2B), create a detailed mapping table for this specific component:

| Foundation Property | JCR Name | Type | Default | Core Equivalent | Notes |
|---------------------|----------|------|---------|-----------------|-------|
| *(fill for each property)* | | | | | |

For each property, determine:
1. **Direct mapping** — same property exists in Core base classes (most common)
2. **Renamed property** — exists in Core but with a different name
3. **Custom property** — must be added as a new `@ValueMapValue` in the Core implementation
4. **Dropped property** — no longer relevant in Core (e.g., XFA-specific properties)
5. **Computed property** — requires `@PostConstruct` logic in Core implementation

For known components, the `references/known-components.md` entry already has a `Core Action` column for each property — use that as the starting point.

### Phase 4: Determine Core Component Specifications

Based on the analysis, determine the inputs for the `create-core-component` skill:

1. **Component name** — derive from foundation name:
   - Strip `guide` prefix: `guidetextbox` → `textinput` (or use the established Core name if one exists)
   - **IMPORTANT**: Check if a core component already exists for this foundation component. Many common components (textinput, checkbox, radiobutton, dropdown, datepicker, etc.) already exist. If so, inform the user and ask whether they want to extend the existing one or create a variant.

2. **Component type** — map from foundation hierarchy:
   - `GuideField` subclass → Simple field (`AbstractFieldImpl`)
   - `GuideField` with options → Options field (`AbstractOptionsFieldImpl`)
   - `GuidePanel` / `GuideContainer` subclass → Container (`AbstractContainerImpl`)
   - `GuideTextDraw` / `GuideSeparator` → Display-only (`AbstractBaseImpl`)
   See `references/property-mapping.md` for the complete hierarchy mapping.

3. **Custom properties** — all properties identified in Phase 3 that are NOT in the base classes

4. **Widget HTML** — translate the foundation widget rendering to HTL. Read `references/code-patterns.md` for before/after code-level translation examples. Key mappings:
   - `<c:if>` → `data-sly-test`
   - `<c:choose>/<c:when>` → `data-sly-test` chains
   - `<c:forEach>` → `data-sly-list` or `data-sly-repeat`
   - `${guideField.property}` → `${componentname.property}`
   - `guide:encodeForHtmlAttr()` → `@ context='attribute'`
   - `guide:encodeForHtml()` → `@ context='text'`
   - `guide:filterHtml()` → `@ context='html'`
   - CSS class constants (e.g., `GuideConstants.GUIDE_FIELD_WIDGET`) → BEM classes

5. **Constraints** — map from foundation validation to Core constraint interfaces:
   - Text validation patterns → `StringConstraint`
   - Numeric min/max → `NumberConstraint`
   - Date min/max → `DateConstraint`
   - Enum values → `OptionsConstraint`
   - File type/size → `FileConstraint`

### Phase 5: Present Migration Plan to User

Before generating any code, present the migration plan:

```
## Migration Plan: {FoundationName} → {CoreName}

### Source
- Foundation component: `/libs/fd/af/components/{foundationdir}`
- Java model: `com.adobe.aemds.guide.common.{GuideClass}`

### Target
- Core component: `core/fd/components/form/{corename}/v1/{corename}`
- Java model: `com.adobe.cq.forms.core.components.models.form.{CoreClass}`
- Base class: `{BaseClass}` (extends `{AbstractBase}`)

### Property Mapping
| Property | Foundation | Core | Action |
|----------|-----------|------|--------|
| ... | ... | ... | direct / rename / custom / drop |

### Dialog Fields to Migrate
- [ ] Field 1 (type, name)
- [ ] Field 2 (type, name)
...

### Rendering Changes
- JSP → HTL conversion summary
- Conditional branches to preserve
- New accessibility patterns to add

### Properties Dropped (not migrated)
- Property X — reason
...
```

Wait for user confirmation before proceeding.

### Phase 6: Execute Migration via create-core-component Skill

Invoke the `create-core-component` skill with all the specifications gathered above. Specifically:

1. **Pass gathered requirements** — provide the component name, type, custom properties, widget HTML, and constraints so Phase 1 (Gather Requirements) of create-core-component is pre-filled.

2. **Ensure custom properties are included** — for each property identified as "custom" in the mapping, ensure it is declared as a `@ValueMapValue` field in the implementation class with the correct type and default value.

3. **Ensure dialog parity** — for each foundation dialog field, ensure the Core dialog includes an equivalent field. Map Granite UI component types:
   - Foundation `granite/ui/components/coral/foundation/form/textfield` → same in Core
   - Foundation `granite/ui/components/coral/foundation/form/checkbox` → same in Core
   - Foundation `granite/ui/components/coral/foundation/form/select` → same in Core
   - Foundation `granite/ui/components/coral/foundation/form/numberfield` → same in Core
   - Foundation datasources → map to Core datasource patterns

4. **Preserve computed logic** — any Java logic from the foundation model (computed properties, conditional defaults, feature toggle checks) must be replicated in the Core `@PostConstruct` or getter methods.

5. **Translate rendering** — ensure the HTL template handles all conditional rendering branches from the foundation widget, using the JSP→HTL conversion rules from Phase 4.

6. **Follow create-core-component workflow** — let the create-core-component skill handle file generation (Phase 3), accessibility verification (Phase 4), validation (Phase 5), and build verification (Phase 6).

### Phase 7: Post-Migration Verification

After the create-core-component skill completes, perform additional migration-specific checks using `references/migration-checklist.md`:

#### 7a. Feature Parity Audit

For every property in the foundation component data (from known-components.md or the user-provided Java model):
- [ ] Verify there is an equivalent getter in the Core interface or its parent interfaces
- [ ] Verify the return type is compatible
- [ ] Verify default values match

#### 7b. Dialog Parity Audit

For every dialog field in the foundation component data (from known-components.md or the user-provided dialog XML):
- [ ] Verify there is an equivalent field in the Core dialog
- [ ] Verify the `name` attribute (JCR property name) matches or is mapped
- [ ] Verify field types are compatible

#### 7c. Rendering Parity Audit

For every rendering branch in the foundation widget data (from known-components.md or the user-provided widget file):
- [ ] Verify there is an equivalent `data-sly-test` branch in the Core HTL
- [ ] Verify the HTML structure is semantically equivalent
- [ ] Verify CSS class names follow BEM convention

#### 7d. Accessibility Upgrade Audit

Foundation components often have minimal accessibility. Verify that the Core component adds:
- [ ] Proper `aria-label` / `<label for>` linkage (foundation may use different patterns)
- [ ] `aria-live` regions for error/description (not present in most foundation components)
- [ ] `aria-invalid`, `aria-readonly`, `aria-required` states
- [ ] Visible focus indicators (foundation relied on browser defaults)
- [ ] Keyboard navigation beyond what foundation provided

#### 7e. Property Deprecation Report

Generate a report listing:
- Properties carried forward (with any renames)
- Properties dropped (with justification)
- New properties added by Core framework (label.richText, tooltip, events, rules, etc.)

Present this report to the user for review.

## Key References

- `references/known-components.md` — Complete embedded data for all standard foundation components (properties, dialogs, rendering)
- `references/foundation-anatomy.md` — Foundation component file structure, patterns, and Java hierarchy
- `references/property-mapping.md` — Foundation → Core type/property/pattern mapping tables (includes renamed, dropped with Core equivalents, and per-review properties)
- `references/migration-checklist.md` — Post-migration verification checklist
- `references/code-patterns.md` — Code-level before/after translation: JSP→HTL, Foundation Java→Sling Model, jQuery→DOM, dialog XML

## Critical Rules

1. **Use embedded data for known components** — for standard foundation components, use `references/known-components.md` directly; do not ask the user for file paths or external repository access
2. **For custom components, ask for source files explicitly** — request the Java model, widget template, dialog XML, and component definition paths from the user
3. **Check for existing Core equivalent** — many foundation components already have Core counterparts; don't duplicate
4. **Preserve all authored properties** — every JCR property that content authors can set must be migrated or explicitly documented as dropped
5. **JSP→HTL conversion must be exact** — every conditional rendering branch must be preserved; do not simplify rendering logic during migration
6. **Foundation accessibility is the floor, not the ceiling** — Core components must meet WCAG 2.1 AA even if the foundation component did not
7. **Present the plan before generating code** — the user must approve the property mapping and any dropped properties before code generation begins
8. **Delegate to create-core-component** — do not bypass the create-core-component workflow; use it for all file generation, validation, and build verification
9. **Document XFA-specific properties** — properties related to XFA (like `xdpRef`, `dorTemplateRef`) should be flagged for the user; they may or may not be needed in Core
10. **Map formatters to validation patterns** — foundation `formatters.xml` patterns should be mapped to Core validation constraints or pattern properties
