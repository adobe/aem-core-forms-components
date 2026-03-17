# Architecture Overview — aem-core-forms-components

AEM Core Forms Components is the server-side component library for Adaptive Forms v2 (AF2). It provides Java Sling models, JCR content definitions, OSGi configuration, integration test infrastructure, and Cypress e2e tests for the AF2 runtime.

---

## 1. Module Structure

```
aem-core-forms-components/
├── bundles/af-core/          Java models, utilities, feature toggle constants
│   ├── src/main/java/
│   │   └── .../components/
│   │       ├── internal/form/   Component model implementations (FragmentImpl, etc.)
│   │       ├── util/            Shared utilities (AbstractContainerImpl, AbstractFormComponentImpl, ComponentUtils)
│   │       └── internal/form/FeatureToggleConstants.java   All feature toggle string IDs
│   └── src/test/
│       ├── java/               Unit tests (FragmentImplTest, PanelImplTest, TextInputImplTest)
│       └── resources/form/     Test fixture JSON (exporter-*.json, test-content.json)
├── it/
│   ├── config/                 IT OSGi configs (toggle enablement, Sling configs)
│   │   └── .../apps/system/config/
│   │       └── com.adobe.granite.toggle.impl.dev.DynamicToggleProviderImpl.cfg.json
│   └── content/                IT test pages and fragment definitions (JCR content packages)
│       └── .../content/forms/af/core-components-it/samples/
│           ├── fragment/       Fragment test pages + fragment definitions
│           ├── panelcontainer/ Panel container test pages
│           ├── textinput/      Text input test pages
│           └── [component]/   One directory per component
└── ui.tests/test-module/       Cypress e2e test suite
    ├── cypress.config.js       Base URL: localhost:4502, retries: 2
    ├── specs/                  Test files organized by component (149 spec files)
    ├── libs/support/
    │   ├── commands.js         Custom Cypress commands (previewForm, fetchFeatureToggles, etc.)
    │   └── functions.js        cy.af helpers (isLatestAddon, isReleasedAddon, getFormJsonUrl)
    └── libs/commons/           Shared constants and selectors
```

---

## 2. Java Model Hierarchy

Three key base classes, each responsible for one concern.

### `AbstractFormComponentImpl`

Base class for all form fields (text inputs, checkboxes, dropdowns, etc.).

Key method: `getEvents()` — injects the default `custom:setProperty` handler (`"$event.payload"`) into every component's events unless `FT_FORMS-24343` is enabled. When that toggle is on, the server omits this handler and delegates the behavior to af2-web-runtime instead.

### `AbstractContainerImpl`

Base class for all container components (panels, wizards, form containers).

Key methods:
- `getExportedItems()` — returns empty map when `FT_FORMS-24358` is enabled (flat array mode).
- `getExportedItemsOrder()` — returns empty array when `FT_FORMS-24358` is enabled.
- `getExportedItemsArray()` — returns the flat items list **only** when `FT_FORMS-24358` is enabled. This is the preferred rendering path for AF2 runtime.

### `FragmentImpl`

Extends `AbstractContainerImpl`. Represents an embedded form fragment (a separately authored sub-form included by reference).

Key methods:
- `getRules()` — merges fragment container rules with placeholder rules. Placeholder rules win on conflict. Merge only happens when `FT_FORMS-24087` is enabled.
- `getEvents()` — merges and appends fragment container events after placeholder events when `FT_FORMS-24087` is enabled.

### Toggle check utility

```java
ComponentUtils.isToggleEnabled(String toggleId)
```

Reads `System.getProperty(toggleId)`, returns `true` only when the value is exactly `"true"`. The system property is populated at runtime by the OSGi `DynamicToggleProviderImpl` config deployed via `it/config`.

---

## 3. Form JSON Model

The server renders a page at `<path>.model.json`. This is consumed directly by af2-web-runtime to hydrate the form.

### Root structure

```json
{
  "fieldType": "form",
  "items": [
    { "fieldType": "text-input", ... },
    { "fieldType": "panel", "items": [...] }
  ],
  ":items": { "field1": { ... } },
  ":itemsOrder": ["field1", "field2"]
}
```

- `items` (flat array) — present when `FT_FORMS-24358` is **ON**. AF2 runtime reads from this key.
- `:items` / `:itemsOrder` — Sling default map/order representation, present when `FT_FORMS-24358` is **OFF**.

### Key properties

| Property | Description |
|---|---|
| `fieldType` | Component type consumed by af2-web-runtime (`"text-input"`, `"panel"`, `"form"`, `"fragment"`) |
| `sling:resourceType` | Maps the JCR node to its Sling component implementation |
| `fd:version` | Form version string — `"2.1"` indicates Adaptive Forms v2 |
| `fd:type="fragment"` | Set on `guideContainer` to mark a page as a fragment definition |
| `events` | Map of event name → array of handler script strings |
| `rules` | Map of rule type → expression string (`"visible"`, `"required"`, `"enabled"`, `"calculate"`) |

---

## 4. IT Test Infrastructure

### Content page locations

| Content type | Path pattern |
|---|---|
| Form pages | `content/forms/af/core-components-it/samples/<component>/<variant>.html` |
| Fragment definitions | `content/forms/af/core-components-it/samples/fragment/<name>/` |

Fragment definition pages use `sling:resourceType="forms-components-examples/components/form/fragmentcontainer"` and `fd:type="fragment"` on their `guideContainer` node.

### Deploy commands

Deploy OSGi configs (toggle enablement, Sling configs):
```bash
mvn clean install -pl it/config -PautoInstallPackage \
  -Daem.host=localhost -Daem.port=4502 \
  -Daem.username=admin -Daem.password=admin
```

Deploy test content (form pages, fragments):
```bash
mvn clean install -pl it/content -PautoInstallPackage \
  -Daem.host=localhost -Daem.port=4502 \
  -Daem.username=admin -Daem.password=admin
```

### Verify deployed content

```bash
curl -s -u admin:admin \
  "http://localhost:4502/content/forms/af/core-components-it/samples/<path>.model.json" \
  | python3 -m json.tool
```

---

## 5. Cypress Test Patterns

### Key commands (defined in `libs/support/commands.js`)

| Command | Description |
|---|---|
| `cy.previewForm(pagePath)` | Loads form at `<pagePath>?wcmmode=disabled`, waits for AF runtime init, returns `formContainer` |
| `cy.previewFormWithPanel(pagePath)` | Same as above but waits for panel-specific initialization |
| `cy.fetchFeatureToggles()` | `GET /etc.clientlibs/toggles.json`, returns `{ enabled: ["FT_FORMS-XXXXX", ...] }` |

### Key `cy.af` helpers (defined in `libs/support/functions.js`)

| Helper | Description |
|---|---|
| `cy.af.isLatestAddon()` | `true` when `forms.far` env var is `null` or `"addon-latest"` |
| `cy.af.isReleasedAddon()` | `true` when `forms.far` is `null` or `"addon"` |
| `cy.af.getFormJsonUrl(pagePath)` | Returns `<pagePath>.model.json` URL |

### The `formContainer` object (AF2 runtime)

`formContainer` is the root runtime object returned by `cy.previewForm`. Key properties:

| Property / Method | Description |
|---|---|
| `formContainer._fields` | `{ [id]: fieldView }` map of all registered field views |
| `formContainer._model` | AF2 model tree root |
| `formContainer._model.getElement(id)` | Look up a model element by ID |
| `formContainer.getAllFields()` | Returns `_fields` |
| `Object.entries(formContainer._fields)[N]` | Get Nth field as `[id, view]` pair |

### Typical toggle-gated test structure

```js
it('should behave differently when FT_FORMS-XXXXX is enabled', () => {
  cy.fetchFeatureToggles().then(toggles => {
    if (cy.af.isLatestAddon() && toggles.enabled.includes('FT_FORMS-XXXXX')) {
      // assertions for toggle-on behavior
    } else {
      // assertions for toggle-off (legacy) behavior
    }
  });
});
```

---

## 6. JCR Content XML Patterns

### Fragment definition page

The `guideContainer` on the fragment's own page carries `fd:type="fragment"` to signal it is a reusable sub-form:

```xml
<guideContainer
    fd:type="fragment"
    fd:version="2.1"
    sling:resourceType="forms-components-examples/components/form/fragmentcontainer"
    fieldType="form">
    <fd:events jcr:primaryType="nt:unstructured"
        initialize="dispatchEvent($form.placeholder.fieldname,'custom:setProperty',{value:'x'})"/>
    <textinput
        sling:resourceType=".../form/textinput"
        fieldType="text-input"
        name="fieldname"/>
</guideContainer>
```

### Fragment placeholder in a parent form

A `<fragment>` node embedded in a parent form references the fragment by path:

```xml
<fragment
    sling:resourceType="forms-components-examples/components/form/fragment"
    fieldType="panel"
    fragmentPath="/content/forms/af/core-components-it/samples/fragment/my-fragment"
    name="myplaceholder"
    wrapData="{Boolean}true">
    <fd:events jcr:primaryType="nt:unstructured"
        initialize="scriptExpression"/>
    <fd:rules jcr:primaryType="nt:unstructured"
        visible="expressionString"/>
</fragment>
```

### Rules and events

- Rules and events can be defined on any node — field or container.
- Rule expressions are strings evaluated by the AF2 rule engine.
- Event expressions use `$form.<path>` for absolute component references and `$self` for the current component.
- When `FT_FORMS-24087` is enabled, `FragmentImpl` merges rules and events from both the fragment definition and the placeholder, with placeholder values taking precedence for rules (and appending after for events).

---

## 7. Running Tests

```bash
cd ui.tests/test-module

# Run a specific spec file
npm run cypress:run:specific -- "specs/fragment/fragment.featuretoggles.cy.js"

# Run the full test suite
npm run cypress:run

# Open the interactive Cypress runner
npm run cypress:open
```

Test files live under `specs/` organized by component name. There are approximately 149 spec files covering the full component set.
