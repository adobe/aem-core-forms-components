# Runtime View JS — the `FormFieldBase` override contract

The client-side view class (`clientlibs/site/js/{componentname}view.js`) extends
`FormView.FormFieldBase`. The base class is not just a registration shim — its
`update*` handlers keep the **root element's `data-cmp-*` attributes**, the
**`--filled`/`--empty` BEM modifier**, the **`aria-invalid` flag**, and the
**rendered error message** in sync with the model. Overriding a handler *replaces*
that behaviour. Most runtime bugs in new components come from overriding a handler
and silently dropping what the base used to do.

> The single most important rule: **when you override an `update*` handler, call
> `super.<handler>(value, state)` first, then do your component-specific work.**
> Handlers are dispatched by `FormFieldBase.subscribe()` as
> `this[fn](change.currentValue, state)`, so always accept and forward the second
> `state` argument.

## What each base handler does (and therefore what you must preserve)

| Handler | Base behaviour you lose if you don't call `super` |
|---------|----------------------------------------------------|
| `updateValue(value)` | sets `this.widget.value`, then calls `updateEmptyStatus()` which toggles `{bem}--filled` / `{bem}--empty` on the root |
| `updateEnabled(enabled, state)` | sets `data-cmp-enabled` on the root **and** toggles `disabled` on the widget |
| `updateReadOnly(readOnly, state)` | sets `data-cmp-readonly` on the root **and** toggles `readonly` on the widget |
| `updateRequired(required, state)` | sets `data-cmp-required` + `required` on the widget |
| `updateValidity(validity, state)` | sets `data-cmp-valid` on the root, `aria-invalid` on the widget, **and calls `updateValidationMessage()` which renders the error text into `__errormessage`** |
| `updateVisible(visible, state)` | sets `data-cmp-visible` + `aria-hidden` |

### Correct override pattern

```js
updateEnabled(enabled, state) {
    super.updateEnabled(enabled, state);              // keeps data-cmp-enabled in sync
    ["D", "M", "Y"].forEach((t) => {                  // then the component-specific work
        const input = this.#getInputByToken(t);
        if (input) input.toggleAttribute("disabled", !enabled);
    });
}

updateValidity(validity, state) {
    super.updateValidity(validity, state);            // renders the error message + data-cmp-valid
    // mirror aria-invalid onto sub-widgets if the component has more than one
}
```

**Anti-pattern (do NOT do this):** an override that only sets `aria-invalid` /
`disabled` on the widget and never calls `super`. The root `data-cmp-*` attributes
go stale and the error message never renders — and unit tests won't catch it because
the initial server-rendered HTML looks correct; the bug only appears after a model
change. The runtime Cypress suite's `checkHTML` helper and the min/max
error-message tests are what surface it.

## `updateEmptyStatus()` — required in any overridden `updateValue`

The base `updateValue` ends with `this.updateEmptyStatus()`. If you override
`updateValue` (almost always necessary for composite widgets), you MUST call
`this.updateEmptyStatus()` yourself or the `--filled`/`--empty` modifier never
updates after the first render.

Also note: `setModelValue(v)` dispatches a `UIChange` that is **not echoed back**
to the originating field's `updateValue`. So when the user types, `updateValue`
does not run — any `--filled`/`--empty` (or other view) sync triggered by typing
must be done in your input handler / value-sync method, not left to `updateValue`.

## Composite / multi-widget components (split widgets, hidden combined input)

A "composite" component renders several visible sub-inputs (e.g. day/month/year)
plus a single hidden `<input type="hidden">` that carries the combined submitted
value. Extra rules:

1. **`getWidget()` returns the hidden combined input** (the value-bearing element
   the model binds to). The visible sub-inputs are UI only.
2. **Do not put `name` on the visible sub-inputs.** Only the hidden combined input
   gets `name="${component.name}"`. Otherwise the browser submits stray
   `name-day` / `name-month` params alongside the real value. Find sub-inputs in
   JS by **class selector**, never by name.
3. **`updateValue` must not clobber a sub-input the user is editing.** Model
   notifications fire on focus/enter, and re-populating the sub-inputs from the
   model value will wipe the digits being typed (classic symptom: typing `2024`
   lands as `024`). Guard it:

   ```js
   updateValue(modelValue) {
       const active = document.activeElement;
       const editing = active && ["D","M","Y"].some(t => active === this.#getInputByToken(t));
       if (!editing) this.#splitValue(modelValue);   // only repopulate when not focused
       const combined = this.getWidget();
       if (combined) combined.value = modelValue || "";
       this.updateEmptyStatus();                       // always
   }
   ```

   This class of bug **only reproduces in a real browser** (Cypress against a live
   instance) — unit tests and static review will not catch it. Always run the
   runtime Cypress spec.
4. Override `updateEnabled` / `updateReadOnly` / `updateValidity` to fan the state
   out to every sub-input (after calling `super`, per the contract above).

## Editor clientlib JS (`clientlibs/editor/js/*.js`)

- **Never assign `innerHTML`** from a value — use `textContent`. Even
  `Granite.I18n.get(...)` output should go through `textContent` (a translator
  could introduce markup).
- **Do not wrap locale-neutral format strings** (e.g. `'YYYY-MM-DD'`) in
  `Granite.I18n.get(...)`. Use a plain constant; only run genuinely translatable
  sentences through `I18n.get`.
