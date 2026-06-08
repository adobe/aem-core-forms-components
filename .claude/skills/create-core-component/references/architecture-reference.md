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
                           │ detected by FormView.Utils.setupField
┌──────────────────────────▼───────────────────────────────────┐
│  JS View   {componentname}view.js                             │
│  class {ComponentName}View extends FormView.FormFieldBase     │
│  Manages widget↔model sync, events, accessibility state       │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow at Runtime

1. Page renders — HTL outputs BEM HTML with `data-cmp-*` attributes
2. `FormView.Utils.setupField` scans DOM for `[data-cmp-is="adaptiveForm{ComponentName}"]`
3. `{ComponentName}View` is instantiated for each matched element
4. `setModel(model)` is called — `this.widget` is now available
5. Widget DOM events (`change`, `blur`) call `this._model.value = value`
6. Model change propagates reactively to other components and form state
7. `visible`/`enabled`/`required` changes on the model update DOM via `data-cmp-*` attribute watchers

## AbstractBaseImpl vs AbstractFieldImpl vs AbstractContainerImpl

| Class | Use when | Provides |
|-------|----------|----------|
| `AbstractBaseImpl` | Step, display, or non-value component | `id`, `name`, `visible`, `enabled`, `description`, `label`, `data` |
| `AbstractFieldImpl` | Captures a user-submitted value | Everything in Base + `required`, `readOnly`, `default`, `placeholder`, `constraints`, validation |
| `AbstractContainerImpl` | Holds child components | Everything in Base + child enumeration, container-specific behavior |

## FormView.FormFieldBase vs FormView.FormContainer

| JS Base Class | Use when |
|---------------|----------|
| `FormView.FormFieldBase` | Component captures a value (field) |
| `FormView.FormContainer` | Component is a step, panel, or container |
