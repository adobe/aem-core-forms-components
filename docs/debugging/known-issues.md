# Known Issues & Debugging Patterns

> **AI-Assisted Debugging Knowledge Base** for AEM Core Forms Components
>
> This is a living document maintained collaboratively by engineers and AI coding assistants (Claude Code, Cursor, GitHub Copilot). Every resolved customer issue, production incident, and hard-to-debug problem is logged here so that **no one — human or AI — wastes time re-discovering a known root cause.**
>
> AI tools like Claude Code automatically read this file when debugging issues in this repository. The structured format (Symptom → Root cause → Fix → Debug steps) is optimized for both human scanning and AI context retrieval.

## How to Contribute

When you resolve a customer issue or discover a non-obvious debugging pattern:

1. Find the relevant section below (or create one)
2. Add an entry using this format:
   ```
   ### Short descriptive title
   **Symptom:** What the user/customer sees
   **Root cause:** Why it happens (one line)
   **Fix:** What to change and where
   **Debug steps:** How to identify this issue next time
   ```
3. Keep entries concise — the value is in the pattern, not the story

---

## General Debugging Checklist

1. **Get the raw model JSON** — `curl -u admin:admin http://localhost:4502/<pagePath>/_jcr_content/guideContainer.model.json` — verify structure, check `items` vs `:items`/`:itemsOrder`, confirm children are present.
2. **Check for double initialization** — look for two different line numbers for `setupFormContainer` or `onDocumentReady` in the **same bundle hash** in a stack trace. That confirms two separate registrations in the compiled bundle.
3. **Check element ownership** — every field's DOM element must have `data-cmp-adaptiveformcontainer-path` matching the form container's `data-cmp-path`. Mismatches mean the element belongs to a different container.
4. **Inspect UUID DOM elements** — after page load, `document.querySelectorAll('[id]')` and look for UUID-style IDs (short alphanumeric, e.g. `TS4CEFHdFLA`). These are created by `InstanceManager.#syncInstancesHTML` for repeatable panel instances beyond the first. They should exist in `form._fields` if the owning form container initialized correctly.
5. **Check model fields** — `formContainer._model._fields` contains every model node indexed by ID. A DOM element whose ID is absent from this map will crash `addField`.
6. **Check toggle state** — `GET /etc.clientlibs/toggles.json` returns `{ enabled: [...] }`. Confirm which toggles are active and whether the code path you're debugging depends on any of them.
7. **Remove exception suppression** — if the test has `cy.on('uncaught:exception', () => false)`, remove it temporarily and re-run. Real crashes will surface as test failures with stack traces.

---

## Runtime Initialization

### `TypeError: Cannot read properties of undefined (reading 'getState')`
**Symptom:** Crash during form initialization — `FormFieldBase.setModel` → `FormContainerV2.addField` → `#createFormContainerFields` → `Utils.initializeAllFields`
**Root cause:** `getModel(id)` returned `undefined`. The field view's ID is not in this form container's model.
**Causes to check (in order):**
1. **Double initialization** — a second `setupFormContainer` call processed the element after the first already ran `initializeAllFields`. The first call's `InstanceManager` may have inserted UUID DOM elements that the second call cannot resolve. Fix: ensure the `data-cmp-adaptiveformcontainer-initialized` guard is in place.
2. **Wrong form container** — `data-cmp-adaptiveformcontainer-path` on the DOM element doesn't match the container's `data-cmp-path`. The path guard in `#createFormContainerFields` should catch this; if it doesn't, check that the attribute is set during server-side rendering.
3. **UUID–model mismatch** — a UUID-based DOM element was inserted by `InstanceManager.#syncInstancesHTML` for a different model instance than the one being processed. Check that the model's IDs and DOM IDs are in sync.

### Fields registered but `formContainer._fields` appears empty
**Symptom:** Form loads but no fields are accessible via `formContainer._fields`.
**Causes:**
- `cy.previewForm` did not wait for `Constants.FORM_CONTAINER_INITIALISED`. This event fires after `initializeAllFields` completes.
- Wrong JSON format: verify `:items`/`:itemsOrder` vs `items` via the model JSON endpoint.
- `sitesModelToFormModel` conversion only runs when both `:items` AND `:itemsOrder` are present. If one is absent, the conversion is skipped.

---

## Cypress Testing

### Exception suppression masking crashes
**Symptom:** Tests pass but the form is broken at runtime.
**Root cause:** `cy.on('uncaught:exception', () => false)` silently swallows all application errors. Tests pass despite runtime crashes.
**Fix:** Use targeted suppression:
```javascript
cy.on('uncaught:exception', (err) => {
    if (err.message.includes('contentWindow')) return false;
    return true; // re-throw everything else
});
```

---

## Clientlibs

### ES6 + YUI Minification Breakage
**Symptom:** JS errors in authoring mode — `"Class constructors cannot be invoked without 'new'"`. Error does not point to minification.
**Root cause:** AEM's YUI compressor cannot handle ES6+ (`class`, `static`, `#private`, `extends`). Minified output is silently broken.
**Fix:** Add `jsProcessor="[default:none,min:none]"` to the clientlib `.content.xml`. Then rebuild cache at `/libs/granite/ui/content/dumplibs.rebuild.html` — AEM does not auto-invalidate cached minified output.
**Debug steps:** Browser console → compare `.min.js` vs source → `grep -r "jsProcessor" ui.af.apps/` → check for ES6 in affected JS.

---

## i18n / Localization

<!-- Add entries here -->

---

## Validation

<!-- Add entries here -->

---

## Navigation (Wizard / Tabs / Accordion)

<!-- Add entries here -->

---

## File Upload

<!-- Add entries here -->

---

## Authoring Dialogs

<!-- Add entries here -->

---

## Sling Models / JSON Export

<!-- Add entries here -->

---

## Submit Actions

<!-- Add entries here -->

---

## Form Data Model (FDM)

<!-- Add entries here -->

---

## OSGi / Bundle Issues

<!-- Add entries here -->
