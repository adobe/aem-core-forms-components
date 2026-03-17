# Feature Toggle E2E Testing

Reference guide for writing Cypress integration tests that are gated behind feature toggles.

---

## Overview

Feature toggles in this project are string identifiers (e.g., `FT_FORMS-24087`) defined as constants in:

```
bundles/af-core/src/main/java/com/adobe/cq/forms/core/components/internal/form/FeatureToggleConstants.java
```

At runtime, a toggle is either enabled or disabled. Tests use the toggle state to conditionally run assertions — this ensures feature-flagged behavior is only validated when the toggle is actually on.

---

## Architecture: Two-Layer Toggle System

### Layer 1 — Granite Toggle Service (client-side)

Controls which toggles are surfaced to the browser via:

```
GET /etc.clientlibs/toggles.json
```

Response shape:
```json
{ "enabled": ["FT_FORMS-XXXXX", "FT_FORMS-YYYYY"] }
```

Config file (IT environment):
```
it/config/src/main/content/jcr_root/apps/system/config/
  com.adobe.granite.toggle.impl.dev.DynamicToggleProviderImpl.cfg.json
```

Add the toggle name to the `enabled` array in that file to turn it on in IT.

### Layer 2 — JVM System Property (server-side)

Java code checks toggles via:

```java
ComponentUtils.isToggleEnabled(toggleId)
// implemented as: "true".equals(System.getProperty(toggleId))
```

Source:
```
bundles/af-core/src/main/java/.../util/ComponentUtils.java
```

To wire a Granite toggle through to the JVM, create an OSGi factory config in the **same directory** as the Granite config above:

Filename: `com.adobe.granite.toggle.monitor.systemproperty~<instance-name>.cfg.json`

```json
{
  "toggle.name": "FT_FORMS-XXXXX",
  "system.property": "FT_FORMS-XXXXX",
  "fail.used": false
}
```

This causes the Granite toggle service to set the JVM system property whenever the toggle is enabled, bridging client-side and server-side activation.

The product already ships `ToggleMonitorSystemPropertyFactory` configs for all `FT_FORMS-*` toggles. You do not need to create these.

---

## IT Config Files

When adding a new toggle, the only config file that requires an update is:

| File | Change |
|------|--------|
| `com.adobe.granite.toggle.impl.dev.DynamicToggleProviderImpl.cfg.json` | Add toggle name to `enabled` array |

---

## Fragment Container Events Pattern (FT_FORMS-24087)

The fragment's `guideContainer` can carry `fd:events` at the container level using the same simple string format as field events.

**Merge order**: placeholder events run FIRST, then fragment container events are appended. This means the last writer wins for the same property, making the merge directly observable in tests.

**Observable test scenario**: the placeholder's `initialize` event sets a field to `"from-placeholder"` and the fragment container's `initialize` event sets the same field to `"from-frag-container"`.

- Toggle ON: final value = `"from-frag-container"` (both ran, fragment container event applied last)
- Toggle OFF: final value = `"from-placeholder"` (only placeholder event ran)

**Placeholder name coupling**: guideContainer-level event scripts that reference child fields must use the full path `$form.<placeholder-name>.<field-name>`. This couples the fragment event to a specific placeholder name, which is acceptable for IT test content.

Example XML for `fd:events` at guideContainer level:
```xml
<guideContainer
    fd:type="fragment"
    ...>
    <fd:events
        jcr:primaryType="nt:unstructured"
        initialize="dispatchEvent($form.myplaceholder.fieldname,'custom:setProperty',{value:'from-frag-container'})"/>
    <textinput ... name="fieldname"/>
</guideContainer>
```

The corresponding placeholder panel in the parent form:
```xml
<fragment
    ...
    name="myplaceholder">
    <fd:events
        jcr:primaryType="nt:unstructured"
        initialize="dispatchEvent($form.myplaceholder.fieldname,'custom:setProperty',{value:'from-placeholder'})"/>
</fragment>
```

---

## Cypress Test Pattern

Canonical example: `ui.tests/test-module/specs/xfa/xfa.runtime.cy.js`

```javascript
describe("Form Runtime - My Feature Toggle", () => {
    if (cy.af.isLatestAddon()) {         // wrap entire body — toggle only tested on latest addon
        const pagePath = "content/forms/af/.../.html";
        let formContainer = null;
        let toggle_array = [];

        before(() => {                    // use before(), not beforeEach()
            cy.fetchFeatureToggles().then((response) => {
                if (response.status === 200) {
                    toggle_array = response.body.enabled;
                }
            });
        });

        it("description of expected behavior", () => {
            if (toggle_array.includes("FT_FORMS-XXXXX")) {   // guard each test individually
                cy.previewForm(pagePath).then(p => { formContainer = p; });
                // assertions...
            }
        });
    }
});
```

Key points:
- `cy.af.isLatestAddon()` — wraps the entire describe body; toggle tests only run on the latest addon build. This is a synchronous guard evaluated at test-collection time.
- `cy.fetchFeatureToggles()` — fetches `/etc.clientlibs/toggles.json` and returns the full response. Call once in `before()`, not `beforeEach()`.
- `toggle_array.includes("FT_FORMS-XXXXX")` — guards each `it()` block so the test is a no-op (passes silently) when the toggle is off.

---

## Test Content

IT content lives under:
```
it/content/src/main/content/jcr_root/content/forms/af/core-components-it/samples/
```

**Reuse an existing page** when:
- The toggle changes internal JSON format or rendering metadata but the observable form behavior (from the user's perspective) is the same.
- Example: FT_FORMS-24343, FT_FORMS-24358 reuse existing fragment/panel pages.

**Create a new page** when:
- The toggle introduces behavior that requires specific content to be present and observable (e.g., new component type, new rule action).
- Example: FT_FORMS-24087 required a new page at `fragment/container-rules/` because it added container-level rule support that did not exist in any existing sample.

---

## Existing Feature Toggle Test Files

| File | Toggles Covered |
|------|----------------|
| `ui.tests/test-module/specs/fragment/fragment.featuretoggles.cy.js` | FT_FORMS-24087, FT_FORMS-24343, FT_FORMS-24358 |
| `ui.tests/test-module/specs/panelcontainer/panelcontainer.featuretoggles.cy.js` | FT_FORMS-24358 |

---

## Common Pitfalls

### Pitfall 1 — Cypress async trap

`expect()` and direct JavaScript access to `formContainer._fields` are synchronous. They execute before `cy.previewForm().then()` resolves, leaving `formContainer` as `null`. All assertions that depend on `formContainer` must be placed inside the `.then()` callback. `cy.get()` is safe outside `.then()` because it queues in the Cypress command chain.

Wrong:
```javascript
cy.previewForm(pagePath).then(p => { formContainer = p; });
expect(formContainer, "initialized").to.not.be.null; // runs before .then() — always null
```

Correct:
```javascript
cy.previewForm(pagePath).then(p => {
    formContainer = p;
    expect(formContainer, "initialized").to.not.be.null; // inside .then() — works
    cy.get(`#${Object.keys(formContainer._fields)[0]}`).should("be.visible");
});
```

### Pitfall 2 — custom:setProperty on a fragment panel throws

Dispatching `custom:setProperty` with `{value: '...'}` on a fragment panel component throws `TypeError: Cannot set property value of #<Fieldset> which has only a getter`. Fragment panels render as `<fieldset>` elements in the DOM, which have a read-only `value` property. Always target a child input field, never the panel itself.

### Pitfall 3 — Stale IT content in AEM

Content packages don't always force-overwrite cached nodes after `mvn install`. If a test page is behaving unexpectedly, verify the deployed content with:
```bash
curl -s -u admin:admin "http://localhost:4502/content/forms/af/core-components-it/samples/<path>.model.json" | python3 -m json.tool | grep -A5 "events"
```

---

## Adding a New Toggle Test: Checklist

1. **Define the constant** — add `public static final String FT_FORMS_XXXXX = "FT_FORMS-XXXXX";` to `FeatureToggleConstants.java`.

2. **Enable in Granite config** — add `"FT_FORMS-XXXXX"` to the `enabled` array in `DynamicToggleProviderImpl.cfg.json`.

3. **Provision test content** — decide whether to reuse an existing IT sample page or create a new one under `it/content/.../samples/`. Create new JCR content only when the toggled behavior requires it.

4. **Write the Cypress test** — use the pattern above. Place the file in the spec directory that matches the component under test (e.g., `specs/fragment/fragment.featuretoggles.cy.js`). If a `*.featuretoggles.cy.js` file already exists for that component, add a new `describe` block to it.

5. **Verify locally** — run the relevant Cypress spec against a local IT instance with the toggle enabled, then again with it disabled to confirm the guard works.
