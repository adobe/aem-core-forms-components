# Component Architecture Reference

## Core Forms Component Layers

```
┌──────────────────────────────────────────────────────────────┐
│  Author Dialog   _cq_dialog/.content.xml (Granite UI XML)    │
│  Author edits properties → saved to JCR node                 │
└──────────────────────────┬───────────────────────────────────┘
                           │ JCR properties
┌──────────────────────────▼───────────────────────────────────┐
│  JCR Content Node   /content/forms/af/{form}/{component}     │
│  fieldType, name, required, label, custom properties...       │
└──────────────────────────┬───────────────────────────────────┘
                           │ adapted via Sling
┌──────────────────────────▼───────────────────────────────────┐
│  Sling Model   {ComponentName}Impl extends Abstract{Base}Impl │
│  @Model(adaptables=SlingHttpServletRequest.class)            │
│  Typed getters, computed values, JSON export                  │
└──────────────────────────┬───────────────────────────────────┘
                           │ data-sly-use in HTL
┌──────────────────────────▼───────────────────────────────────┐
│  HTL Template   {componentname}.html                          │
│  Renders BEM HTML with data-cmp-* runtime attributes          │
│  class="cmp-adaptiveform-{componentname}"                     │
│  data-cmp-is="adaptiveForm{ComponentName}"                    │
└──────────────────────────┬───────────────────────────────────┘
                           │ registered via FormView.Utils.setupField,
                           │ scanned during Utils.initializeAllFields
┌──────────────────────────▼───────────────────────────────────┐
│  JS View   {componentname}view.js                             │
│  class {ComponentName}View extends FormView.FormFieldBase     │
│  Manages widget↔model sync, events, accessibility state       │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow at Runtime

The full initialization pipeline — DOM scan, model tree construction, `setModel`
sequencing, repeatable-instance sync, and common crash signatures — is documented
in `docs/architecture/runtime-internals.md`; that file is the canonical source, read
it for the authoritative flow and debugging checklist. Summary of what matters when
writing a new component's view JS:

1. Page renders — HTL outputs BEM HTML with `data-cmp-*` attributes.
2. At module load, the view JS registers itself once via `FormView.Utils.setupField(creator, selector)` — this only registers the creator/selector pair; it does not scan the DOM.
3. When the form container initializes, `Utils.initializeAllFields` scans the DOM for the registered selector and constructs a `{ComponentName}View` for each match (`this.widget` is set from `getWidget()` in the constructor, before any model is attached).
4. `formContainer.addField` resolves the field's model and calls `setModel(model)`; after this, `this._model` is available and `subscribe()` is wired up.
5. Widget DOM events (`change`, `blur`) write back via `this._model.value = value`; the model change propagates reactively, and `data-cmp-*` attribute watchers update the DOM for `visible`/`enabled`/`required`.

## AbstractBaseImpl vs AbstractFieldImpl vs AbstractContainerImpl

This table is the single source of truth for base-class selection; other references and `SKILL.md` Phase 1 point here.

| Class | Use when | Provides |
|-------|----------|----------|
| `AbstractBaseImpl` | Step, display, or non-value component (button, text, image) | `id`, `name`, `visible`, `enabled`, `description`, `label`, `data` |
| `AbstractFieldImpl` | Captures a single user-submitted value (text, number, date) | Everything in Base + `required`, `readOnly`, `default`, `placeholder`, `constraints`, validation |
| `AbstractOptionsFieldImpl` | Options-based field (checkboxes, radios, selects) | Everything in Field + `enum`, `enumNames`, `enforceEnum` |
| `AbstractContainerImpl` | Holds child components (container/panel) | Everything in Base + child enumeration, container-specific behavior |

**Composite / split widget** (e.g. day/month/year — multiple visible inputs feeding one value): still extend the field base that matches the data type (`AbstractFieldImpl` for a date), but render **one hidden combined `<input>`** as the value-bearing widget plus the visible sub-inputs. This category has extra runtime rules — read `references/runtime-view-js.md` before writing the view JS.

## FormView.FormFieldBase vs FormView.FormContainer

| JS Base Class | Use when |
|---------------|----------|
| `FormView.FormFieldBase` | Component captures a value (field) |
| `FormView.FormContainer` | Component is a step, panel, or container |
