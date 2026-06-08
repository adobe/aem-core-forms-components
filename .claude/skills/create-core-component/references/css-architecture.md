# CSS Two-Layer Architecture

## How CSS is Split Between the Two Repos

```
aem-core-forms-components                    aem-forms-theme-canvas
─────────────────────────────────────        ──────────────────────────────────────
ui.af.apps/.../form/{name}/v1/{name}/        src/components/{name}/_{name}.scss
  clientlibs/
    runtime/
      css.txt  ← lists {name}view.css        src/site/_variables.scss (design tokens)
      css/
        {name}view.css  ← EMPTY STUBS        src/theme.scss ← imports all components
                                             dist/theme.css ← compiled output
                                             → deployed as AEM clientlib
```

**Rule**: Never put visual CSS properties in `aem-core-forms-components`. Never put only BEM structure definitions in `aem-forms-theme-canvas`.

## What Goes in Each Layer

| | `aem-core-forms-components` stub CSS | `aem-forms-theme-canvas` SCSS |
|-|--------------------------------------|-------------------------------|
| BEM class declarations | All classes, empty `{ }` | Same class names, with properties |
| Colors, spacing, fonts | Never | Via `$variables` tokens |
| Validation states | Never | `[data-cmp-valid=false/true]` selectors |
| Focus / hover / disabled | Never | Pseudo-class selectors |
| Responsive breakpoints | Never | Media queries |
| Design tokens | Never | `_variables.scss` |
| Build step | None — plain CSS | Parcel 2.0 → `npm run build` |

## Standard BEM Elements for Every Field Component

Every field component's HTL template emits these elements. The stub CSS and theme SCSS must cover all of them:

| BEM element suffix | CSS class | What it wraps |
|-------------------|-----------|---------------|
| *(root block)* | `.cmp-adaptiveform-{name}` | Outer container `<div>` |
| `__label-container` | `.cmp-adaptiveform-{name}__label-container` | Label + question mark row |
| `__label` | `.cmp-adaptiveform-{name}__label` | The `<label>` element |
| `__questionmark` | `.cmp-adaptiveform-{name}__questionmark` | Help icon |
| `__widget` | `.cmp-adaptiveform-{name}__widget` | The `<input>`, `<select>`, `<textarea>`, or custom `<div>` |
| `__shortdescription` | `.cmp-adaptiveform-{name}__shortdescription` | Tooltip / short help text |
| `__longdescription` | `.cmp-adaptiveform-{name}__longdescription` | Long description paragraph |
| `__errormessage` | `.cmp-adaptiveform-{name}__errormessage` | Validation error text |

Validation state attribute selectors (set by JS view at runtime):

```scss
.cmp-adaptiveform-{name}[data-cmp-valid=false] { ... }   // invalid
.cmp-adaptiveform-{name}[data-cmp-valid=true]  { ... }   // valid
```

Visibility/state attributes (set by JS view at runtime):

```scss
.cmp-adaptiveform-{name}[data-cmp-visible=false] { display: none; }
.cmp-adaptiveform-{name}[data-cmp-enabled=false]  { opacity: 0.5; pointer-events: none; }
```

## Build and Deploy the Theme

```bash
# in aem-forms-theme-canvas/
npm run build              # Parcel compiles all SCSS → dist/theme.css
npm run create-clientlib   # packages dist/ as AEM clientlib (outputs to theme-clientlibs/)
# then install theme-clientlibs/ package into AEM via Package Manager
```
