# Post-Migration Verification Checklist

After running the `create-core-component` skill, perform these additional migration-specific verifications.

## 1. Feature Parity — Java Model

For every public getter in the foundation Java model class:

- [ ] **Method exists** — equivalent getter exists in Core interface or inherited from base
- [ ] **Return type compatible** — same type, or acceptable widening (e.g., `Integer` → `Long`)
- [ ] **Default value matches** — foundation default matches Core `@ValueMapValue` default
- [ ] **Computed logic preserved** — any logic in foundation getter is replicated in Core `@PostConstruct` or getter
- [ ] **Null handling matches** — if foundation returns null for missing property, Core does too

### How to verify

For **known components**: compare the property table in `references/known-components.md` against the generated Core interface and its parent interfaces.

For **custom components**: compare the user-provided Java model against the generated Core interface.

```bash
# Check Core interface methods
grep -n "get\|is" bundles/af-core/src/main/java/com/adobe/cq/forms/core/components/models/form/{CoreInterface}.java

# Check what base class provides
grep -n "get\|is" bundles/af-core/src/main/java/com/adobe/cq/forms/core/components/models/form/Field.java
grep -n "get\|is" bundles/af-core/src/main/java/com/adobe/cq/forms/core/components/models/form/Base.java
```

## 2. Dialog Parity

For every field in the foundation `_cq_dialog/.content.xml`:

- [ ] **Field migrated** — equivalent dialog field exists in Core dialog
- [ ] **JCR property name matches** — `name` attribute maps correctly (direct or renamed)
- [ ] **Field type compatible** — Granite UI component type is appropriate
- [ ] **Label matches** — `fieldLabel` or `fieldDescription` preserved
- [ ] **Default value set** — `value` attribute matches foundation default
- [ ] **Validation rules preserved** — `required`, `validation`, pattern constraints

### How to verify

For **known components**: compare the dialog fields table in `references/known-components.md` against the generated Core dialog.

For **custom components**: compare the user-provided dialog XML against the generated Core dialog.

```bash
# Check Core dialog field names
grep -r 'name="' ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{corename}/v1/{corename}/_cq_dialog/.content.xml
```

## 3. Rendering Parity

For every conditional branch in the foundation `widget.jsp`:

- [ ] **Branch preserved** — equivalent `data-sly-test` in Core HTL
- [ ] **HTML structure equivalent** — semantic structure matches (input types, attributes)
- [ ] **Attributes complete** — all HTML attributes from JSP are present in HTL
- [ ] **XSS encoding correct** — every `guide:encodeFor*` has a corresponding HTL `@ context`
- [ ] **Dynamic values work** — EL expressions correctly translated to HTL expressions

### How to verify

For **known components**: compare the widget rendering description in `references/known-components.md` against the generated Core HTL.

For **custom components**: compare the user-provided widget file against the generated Core HTL.

```bash
# Read the generated Core HTL
cat ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/{corename}/v1/{corename}/{corename}.html
```

## 4. Accessibility Upgrade Verification

Foundation components often have minimal ARIA support. The Core component MUST add:

- [ ] **Label linkage** — `<label for="{id}-widget">` present (foundation may use implicit association)
- [ ] **aria-live on error** — `aria-live="assertive"` on error message container
- [ ] **aria-live on descriptions** — `aria-live="polite"` on short/long description
- [ ] **aria-invalid** — set by JS `updateValidity()` on validation failure
- [ ] **aria-readonly** — set by JS `updateReadOnly()` when readonly
- [ ] **aria-required** — present on widget when field is required
- [ ] **Focus indicators** — visible `:focus` styles in LESS (2px minimum outline)
- [ ] **Keyboard support** — all interactions reachable via keyboard
- [ ] **Question mark toggle** — `aria-expanded` toggles on help button

## 5. Client-Side Behavior Parity

- [ ] **Value change handling** — `change` event listener dispatches to model
- [ ] **Focus/blur tracking** — `setActive()`/`setInactive()` called on focus/blur
- [ ] **Enabled/disabled toggle** — `updateEnabled()` toggles `disabled` attribute
- [ ] **ReadOnly toggle** — `updateReadOnly()` toggles `readonly` and `aria-readonly`
- [ ] **Validity display** — `updateValidity()` sets `aria-invalid` and shows error
- [ ] **Value update** — `updateValue()` sets widget value from model

## 6. Property Deprecation Report

Generate this table and present to the user:

### Properties Carried Forward
| Property | Foundation JCR | Core JCR | Change |
|----------|---------------|----------|--------|
| *(list each)* | | | direct / renamed / restructured |

### Properties Dropped
| Property | Foundation JCR | Reason |
|----------|---------------|--------|
| *(list each)* | | *(why it was dropped)* |

### New Properties (from Core framework)
| Property | Core JCR | Source |
|----------|----------|--------|
| `label.richText` | `richTextTitle` | `AbstractBaseImpl` |
| `tooltip` | `tooltip` | `AbstractBaseImpl` |
| `events` | `fd:events` | `AbstractFormComponentImpl` |
| `rules` | `fd:rules` | `AbstractFormComponentImpl` |
| `properties` | custom node | `AbstractFormComponentImpl` |
| `screenReaderText` | `screenReaderText` | `AbstractBaseImpl` |

## 7. Build & Test Verification

After the `create-core-component` skill runs its Phase 5 and Phase 6:

- [ ] **Validator passes** — `validate_component.py` reports no FAILs
- [ ] **Java compiles** — `mvn clean compile` succeeds
- [ ] **Unit tests pass** — `mvn test -Dtest={Component}ImplTest` succeeds
- [ ] **JSON export validates** — exporter JSON matches expected output
- [ ] **No new warnings** — no unexpected compiler warnings introduced

## 8. Migration Documentation

After all verification passes, create a summary comment or note:

```
Migration: {FoundationName} → {CoreName}
- Source: fd/af/components/{foundationdir}
- Target: core/fd/components/form/{corename}/v1/{corename}
- Properties migrated: N
- Properties dropped: M (list)
- Properties added by Core: K
- Accessibility improvements: (list key additions)
- Breaking changes: (any behavioral differences)
```
