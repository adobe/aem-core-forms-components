# Common Implementation Mistakes

1. **`data-cmp-is` mismatch** — The single most common failure. The string in HTML must equal `static IS` in JS. One extra capital letter breaks the wiring.

2. **Wrong `fieldType` format** — Core uses kebab-case: `text-input`, not `textInput` or `TEXT_INPUT`. Check `references/component-anatomy.md` (FieldType Values section) for the full list.

3. **`@Inject` instead of `@ValueMapValue`** — `@Inject` uses Sling's default injector chain and may pick up values from places other than the resource value map. Always use `@ValueMapValue` for JCR properties.

4. **Missing `InjectionStrategy.OPTIONAL`** — Without it, Sling Model adaptation fails at runtime if the JCR property is absent on an existing content node.

5. **Foundation package imports in Java** — Any import starting with `com.adobe.guides.*` or `com.adobe.fd.guide.*` means you are cross-referencing foundation. Remove it.

6. **Boolean `data-cmp-*` attributes as bare booleans** — `data-cmp-visible="${model.visible}"` outputs `true`/`false` as strings correctly in some HTL versions but fails in others. Always use `${model.visible ? 'true' : 'false'}`.

7. **Missing `aria-describedby`** — All interactive widgets must reference all three IDs (`{id}__errormessage`, `{id}__longdescription`, `{id}__shortdescription`). Omitting any of them breaks screen reader support and fails accessibility audits.

8. **Clientlib category typo** — The category in `runtime/.content.xml` must exactly match what you embed in the `core-forms-components-runtime-all` clientlib. A single character difference means the component's JS/CSS never loads.

9. **Step component extending FormFieldBase** — Steps have no widget and no value. Extending `FormFieldBase` instead of `FormContainer` causes null errors on `getWidget()`.

10. **`fd:viewType` on field components** — `fd:viewType` is for step/display components that share `fieldType=plain-text` but need distinct rendering. Field components (text-input, number-input, etc.) do not need `fd:viewType`.

11. **CSS properties in the core-forms-components stub file** — `{name}view.css` inside `aem-core-forms-components` must have empty rules only. Visual properties go in `aem-forms-theme-canvas`.

12. **Hardcoded colour or size values in theme SCSS** — Always use design tokens from `_variables.scss`. Hardcoded values (`#666`, `40px`) break when the theme is customised. If no suitable token exists, add one to `_variables.scss`.

13. **Forgetting `[data-cmp-valid]` selectors in theme SCSS** — Without these, validation state changes written by the JS view produce no visual feedback. Add both `[data-cmp-valid=false]` and `[data-cmp-valid=true]` selectors for every interactive field component.

14. **Not importing the new SCSS file in `theme.scss`** — The Parcel build only includes what is imported. A missing `@import` means the component has zero styles even after `npm run build`.

15. **`data-sly-test` on the `__value` div** — Never put `data-sly-test` on the outer `__value` wrapper. `getWidget()` in the JS view must always find `.cmp-adaptiveform-{name}__value`. Put the conditional **inside** the div with a `<sly data-sly-test="…">` wrapper.

16. **Destructive `updateValue` fallback** — Do not set `this.element.innerHTML` when `getWidget()` returns null. That wipes the `__label-container`. Update only `getWidget()`; fix HTL if the widget is missing.

17. **Invented dialog text during migration** *(migration mode only)* — Adding `fieldDescription` to Core dialog fields that had no description in the foundation dialog, or rephrasing foundation `fieldLabel` / option `text` without justification. Rule: copy foundation text verbatim; omit `fieldDescription` when the foundation field had none; only write original text for fields that are genuinely new in Core.

---

## Display/Text Component Mistakes

These apply to any component that uses HTL template 7c and `sling:resourceSuperType="core/fd/components/form/text/v1/text"`.

1. **Title not rendering on display/text components** — Symptom: only rich-text `value` shows but `jcr:title` is set in CRX. Causes and fixes:
    - HTL used `resource.properties['jcr:title']` instead of `baseModel.label.value` → use HTL template 7c with `data-sly-use.baseModel="…Base"` (see "Sling Model – Display/Text" in `references/templates.md`).
    - Sling Model `adapters` omitted `Base.class` → add `Base.class` alongside `Text.class`.
    - Bound only `Text` in HTL for label → `Text` has no `getLabel()`; extend `AbstractBaseImpl` and register `Base.class` in `adapters`.
    - Parent `text/v1/text` dialog hides Title → re-declare `./jcr:title` and `./hideTitle` in child `_cq_dialog`.
    - **Verify:** CRX has `jcr:title`; DevTools shows `label.cmp-adaptiveform-{name}__label` inside `__label-container`.

---

## Author Dialog and Coral Interactivity

These apply to any component whose author dialog uses composite multifields or JavaScript-driven conditional field visibility. See `references/editor-clientlib.md` for the full boilerplate pattern.

1. **Coral listener ordering race** — `Coral.commons.ready(element, callback)` may fire synchronously if the element is already upgraded. If you call any code that adds multifield items BEFORE registering `coral-collection:add`, that event fires with no listener attached. **Fix:** register all dialog event listeners (including `coral-collection:add`) BEFORE calling any code that triggers item insertion.

2. **Both conditional fields visible on new multifield item** — Symptom: when a multifield item is added, fields that should be conditionally hidden all appear. Root cause: `Coral.commons.ready(newItem, callback)` fires after Coral finishes upgrading sub-components; between insertion and that callback the DOM has all fields visible. **Fix:** in the `coral-collection:add` handler, immediately hide default-off fields synchronously on `e.detail.item` using `$(newItem).find(SELECTOR).toggle(false)` BEFORE calling `Coral.commons.ready`. This synchronous hide happens before the browser paints.

3. **`getSelectValue` on a `granite:class`-wrapped element** — `coral-select.value` is only accessible on the `coral-select` DOM element itself, not on its Granite UI fieldwrapper. If the selector targets a wrapper div rather than `coral-select` directly, `$el.val()` returns nothing. **Fix:** always extract the value via `var cs = $el.is("coral-select") ? $el[0] : $el.find("coral-select")[0]; return cs ? (cs.value || "") : "";`

4. **`setVisible` traverses past multifield item boundary** — `$el.closest(".coral-Form-fieldwrapper")` on an element inside a composite multifield item can match a fieldwrapper that wraps the entire `coral-multifield`. **Fix:** cap the search at the item boundary: find the item container first (e.g., `$el.closest(".your-item-class")`), then only use the fieldwrapper if `$.contains(itemContainer, fieldwrapper)` is true.

5. **Select default not applied when `emptyText` omitted** — When `emptyText` is omitted from a Granite UI `form/select` node, Coral selects the first `<items>` child as the default. The JS `getSelectValue` may return `""` before Coral finishes upgrading. Always treat `val === ""` the same as your intended default value in your conditional logic (e.g., `val === "form" || val === ""`) to guarantee correct initial state regardless of upgrade timing.

---

## Adobe Sign-Specific Mistakes

These apply only to components that integrate with the Adobe Sign SDK or use `data-adobesigntype` field placeholders.

1. **Edit opens plain text instead of Adobe Sign RTE** — Symptom: Edit shows no Adobe Sign Field button / no Type-Name-Required popover. Fixes: add `data-richtext` on `__value`; extend `toolbaractionhook.js` for `adaptiveFormAdobeSignBlock`; embed `aem.adobesign.rteplugin` on forms v2 editor; verify `integration-adobesign` content package is installed.

2. **Radio/checkbox placeholders show as plain lines** — Symptom: core form shows underscores only; foundation shows radio circle + gray label bar. Cause: a generic `[data-adobesigntype] { border-bottom; font-size: 0 }` rule applied without type-specific SVG overrides. Fix: add type-specific placeholder CSS for `radio`, `checkbox`, `dropdown` in theme SCSS and include the corresponding SVG assets.
