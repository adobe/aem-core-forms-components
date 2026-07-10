# Cypress tests (runtime + authoring) — REQUIRED, not optional

Unit tests + the exporter JSON only exercise the Java model. They do **not** cover
the HTL render, the runtime view JS, dialogs, or the model↔view sync — which is
where most real defects live. Every new component MUST ship two Cypress specs:

| File | Covers |
|------|--------|
| `ui.tests/test-module/specs/{componentname}/{componentname}.runtime.cy.js` | rendered HTML, model↔view sync, value entry, enable/disable, read-only, visibility, validation/error messages, `--filled`/`--empty`, rule-engine (set/clear/show/hide/enable) |
| `ui.tests/test-module/specs/{componentname}/{componentname}.authoring.cy.js` | edit-dialog tabs/fields in both the Forms editor and the Sites editor |

These depend on content that the file checklist also requires:
- `it/content/.../samples/{componentname}/basic/.content.xml` — the IT form the runtime spec loads (`previewForm`). Include sibling fields + `fd:events` rules if the runtime spec asserts rule-driven behaviour.
- An entry in `ui.tests/test-module/libs/commons/formsConstants.js` (`resourceType.form{componentname}`).
- The component's runtime clientlib category embedded in
  `ui.af.apps/.../af-clientlibs/core-forms-components-runtime-all/.content.xml`
  (the form runtime loads the aggregate; a missing embed silently breaks the spec).

## Running

```bash
cd ui.tests/test-module
./node_modules/.bin/cypress run --browser chrome --headless \
  --spec "specs/{componentname}/{componentname}.runtime.cy.js"
```

`cypress.config.js` `baseUrl` is `http://localhost:4502`. The component must be
deployed first: `mvn -pl ui.af.apps clean install -PautoInstallPackage`. After a
view-JS change, redeploy — the spec loads the aggregated runtime clientlib, not
your source file.

## Cypress gotchas that bite forms components

### 1. Hidden inputs fail `should('be.visible')`

Cypress treats `input[type="hidden"]` as not visible (by design). Composite
components render a hidden combined input, so a blanket descendant visibility check
inside `within()` fails. Exclude hidden inputs:

```js
// BAD — fails on the hidden combined input
cy.get('*').should('be.visible');
// GOOD
cy.get('*:not([type=hidden])').should('be.visible');
```

### 2. Don't chain two `should('(not.)have.attr', name)` calls

`should('have.attr', name)` / `should('not.have.attr', name)` yields the
**attribute value** (`undefined` when absent) as the subject for the next command,
so a chained second attr assertion runs against `undefined` and fails with
`expected undefined not to have attribute ...`. Re-query instead:

```js
// BAD
cy.get(sel).should('not.have.attr', 'disabled').should('not.have.attr', 'readonly');
// GOOD
cy.get(sel).should('not.have.attr', 'disabled');
cy.get(sel).should('not.have.attr', 'readonly');
```

### 3. Real-browser-only bugs

The runtime spec is the only place that catches focus/typing races (e.g. a model
repaint wiping an in-progress edit — see `runtime-view-js.md`). Never sign off a
component on unit tests alone.

## Unit-test coverage the validator and reviewers expect

Beyond `getFieldType` / `getName` / `getLabel` / JSON export, add a test for:
- **every custom getter** (placeholder/title/format/etc.), including the
  absent-when-default case;
- **boolean properties in both states** (e.g. `hideTitleDate` true *and* default false);
- **any overridden `getConstraintMessages()`** — assert the added MINIMUM/MAXIMUM
  (or other) entries are present (this override is commonly left uncovered and
  shows up as a codecov gap);
- **exclusive constraints** — assert both that the exclusive value is set *and*
  that the non-exclusive min/max is nulled out by `@PostConstruct`.
