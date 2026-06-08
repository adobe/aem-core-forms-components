# Post-Implementation Verification Checklist

Work through every item after all files are written. Fix all failures before declaring the component complete.

---

## Structure

- [ ] Component node path follows `core/fd/components/form/{name}/v1/{name}/`
- [ ] `.content.xml` has `jcr:primaryType="cq:Component"` and correct `sling:resourceSuperType`
- [ ] `_cq_template.xml` has `fieldType` matching the Core Forms schema value (e.g., `text-input`, not `textInput`)
- [ ] `_cq_editConfig.xml` is present alongside `.content.xml` with `cq:disableTargeting="{Boolean}true"`
- [ ] Clientlib category in `runtime/.content.xml` follows `core.forms.components.{name}.v1.runtime`
- [ ] Clientlib `dependencies` includes `core.forms.components.base.runtime`

## Wiring

- [ ] `core-forms-components-runtime-all/.content.xml` — `core.forms.components.{name}.v1.runtime` is present in the `embedsValue` array
- [ ] `aem-forms-theme-canvas/src/theme.scss` — `@import './components/{name}/_{name}.scss'` is present
- [ ] *(if applicable)* `FormConstants.java` — `RT_FD_FORM_{NAME_UPPER}_V1` constant added and matches the JCR path exactly
- [ ] *(if new i18n messages added)* All 10 language files in `resources/i18n/` updated with the new message keys

## Container Registration

- [ ] Component group is allowed in the **integration test** template policy (`it/content/.../wcm/policies/.content.xml`)
- [ ] Component group is allowed in the **production** template policy (`conf/{siteName}/settings/wcm/policies/`) — verify by checking component appears in author picker
- [ ] *(if component needs form-level properties)* FormContainer dialog overlay created with the new tab — dialog opens on the form container and shows the new tab correctly in authoring mode (see `references/wiring-steps.md`)
- [ ] *(if component reads container properties)* `getContainerProperty()` pattern in Sling Model correctly traverses to parent container — verified via unit test with a parent container resource in `test-content.json` (see `references/wiring-steps.md`)
- [ ] No explicit wizard/panel step registration needed — wizard and panel discover child components dynamically via JCR child iteration

## CSS — Two-Layer Check

- [ ] **Layer 1 (stub file in `aem-core-forms-components`):** `clientlibs/runtime/css/{name}view.css` exists and declares every BEM class emitted by the HTL template — all rules are empty (`{ }`)
- [ ] `clientlibs/runtime/css.txt` references `{name}view.css`
- [ ] Every HTML element in the HTL template that carries a `class` attribute has a corresponding empty rule in the stub file
- [ ] **Layer 2 (real styles in `aem-forms-theme-canvas`):** `src/components/{name}/_{name}.scss` exists with actual property values
- [ ] The SCSS file uses only design tokens from `src/site/_variables.scss` — no hardcoded colour or size values
- [ ] `[data-cmp-valid=false]` and `[data-cmp-valid=true]` attribute selectors are present for interactive field components
- [ ] The new SCSS file is imported in `src/theme.scss`
- [ ] `npm run build` runs without errors in `aem-forms-theme-canvas`

## HTL

- [ ] `data-cmp-is` value matches JS `static IS` exactly
- [ ] Boolean `data-cmp-*` attributes use ternary `? 'true' : 'false'`
- [ ] Widget has `aria-describedby` referencing `{id}__errormessage {id}__longdescription {id}__shortdescription`
- [ ] No `<script>` or `<style>` elements in the HTL file
- [ ] `data-sly-use.model` references the correct Sling Model class
- [ ] No `data-sly-test` on the `__value` div (for display/text components)

## JavaScript

- [ ] `static IS` copied verbatim to `data-cmp-is` in HTL
- [ ] `static bemBlock` matches the CSS class on the root `<div>` exactly
- [ ] All 6 selector methods present for `FormFieldBase` subclasses
- [ ] `FormView.Utils.setupField` called with the correct selector
- [ ] No jQuery, no `$`, no `window.jQuery`

## Java (if applicable)

- [ ] `RESOURCE_TYPE` string matches the JCR path exactly
- [ ] `@Model resourceType` includes `RESOURCE_TYPE`
- [ ] Only `@ValueMapValue` used for JCR injection (no `@Inject`)
- [ ] `InjectionStrategy.OPTIONAL` on all optional properties
- [ ] No imports from `com.adobe.guides.*` or `com.adobe.fd.guide.*`
- [ ] `getExportedType()` returns `RESOURCE_TYPE`

## Tests

- [ ] `{NamePascal}ImplTest.java` exists and all tests pass: `mvn test -pl bundles/af-core -Dtest={NamePascal}ImplTest`
- [ ] `test-content.json` has at least two nodes: one fully configured and one with no custom properties
- [ ] JSON export snapshot file exists at `form/{name}/{name}.json` and `testJSONExport()` passes without diff
- [ ] JaCoCo coverage is ≥ 60% — confirmed by running `mvn verify -pl bundles/af-core` (build fails below threshold)
- [ ] *(if `it/` content added)* Integration test content `.content.xml` present and referenced in policy

## Feature Parity for Dropped JCR Properties (migration only)

For every property listed as **dropped** in the migration plan's Property Mapping table, verify the Core equivalent is actually wired up:
- [ ] All expression properties (`visibleExp`, `enabledExp`, `calculateExp`, `initializeExp`) → Rules Editor tab is present in the Core dialog (confirm via the inherited base dialog; add explicitly if custom dialog was created without it)
- [ ] `displayPictureClause` / `validatePictureClause` → `displayFormat` / `editFormat` dialog fields are present and documented with the Core format syntax
- [ ] `css` (CSS Class field) → `_cq_design_dialog` exists with a Style System tab; style classes defined in the template policy; corresponding CSS modifier classes added to theme SCSS
- [ ] `*InlineStyles` / `height` / `width` → equivalent CSS rules exist in the theme SCSS targeting the BEM element selectors
- [ ] `fieldLayout` → HTL template renders the correct layout structure directly in BEM HTML
- [ ] `colspan` → responsibility delegated to the form container / panel
- [ ] `navTitle` → the component's `jcr:title` / `label` is set correctly
- [ ] `clientLibRef` → component's own clientlib node is created and its category is embedded in the form's runtime-all clientlib
- [ ] No dropped property has a blank "Core equivalent" cell — every dropped property has an explicit resolution

## No Cross-Referencing

- [ ] Zero imports or references to foundation packages (`com.adobe.guides`, `com.adobe.fd.guide`, `guideWidget`)
- [ ] No JSP includes or JSP code fragments
- [ ] No XFA model properties included without explicit user approval
- [ ] Component does not require foundation forms overlay to be installed
