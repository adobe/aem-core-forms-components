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

These apply to any component whose author dialog uses composite multifields or JavaScript-driven conditional field visibility. `references/editor-clientlib.md` is the canonical source for the patterns and fixes below (JS boilerplate, `getSelectValue`, `setVisible`) — this list only flags the symptoms so you recognize them.

1. **Coral listener ordering race** — a `coral-collection:add` handler never fires for a programmatically-added item. See "Listener registration order" in `references/editor-clientlib.md`.
2. **Both conditional fields visible on new multifield item** — adding an item briefly shows all conditionally-hidden fields before they settle. See "Default-off fields in new items" in `references/editor-clientlib.md`.
3. **`getSelectValue` returns nothing** — reading `.val()` on a `granite:class`-wrapped element instead of the `coral-select` DOM property. See `getSelectValue` in `references/editor-clientlib.md`.
4. **`setVisible` hides more than intended** — `.closest(".coral-Form-fieldwrapper")` traverses past the multifield item boundary to a parent container's fieldwrapper. See "`setVisible` boundary" in `references/editor-clientlib.md`.
5. **Select default not applied when `emptyText` omitted** — the JS may read `val === ""` before Coral finishes upgrading. See "Select Default Behavior" in `references/editor-clientlib.md`.

---
