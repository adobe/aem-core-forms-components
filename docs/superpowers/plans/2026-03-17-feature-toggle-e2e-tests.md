# Feature Toggle E2E Tests Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Cypress e2e tests for the 3 new feature toggles in `FeatureToggleConstants.java`, following the existing pattern used in `xfa.runtime.cy.js` and other toggle-gated tests.

**Architecture:** Each toggle needs: (1) enablement in the IT OSGi config so the Granite toggle endpoint (`/etc.clientlibs/toggles.json`) returns it, (2) a `ToggleMonitorSystemPropertyFactory` OSGi config to wire the toggle to its JVM system property so the Java backend actually changes behavior, and (3) a Cypress test file guarded by both `cy.af.isLatestAddon()` and `toggle_array.includes(...)`. Tests reuse existing form pages where the default behavior is sufficient (FT_FORMS-24343, FT_FORMS-24358) and new IT content is created for FT_FORMS-24087 which requires specific merging behavior to be observable.

**Tech Stack:** Cypress (cy.js), AEM OSGi `.cfg.json`, JCR content XML (`.content.xml`)

---

## Background: Feature Toggles to Test

| Toggle ID | Constant | What Changes When Enabled |
|-----------|----------|--------------------------|
| `FT_FORMS-24087` | `FT_FRAGMENT_MERGE_CONTAINER_RULES_EVENTS` | Fragment container rules/events merged with placeholder panel rules/events in the parent form |
| `FT_FORMS-24343` | `FT_SKIP_DEFAULT_SET_PROPERTY_EVENT` | Server no longer injects default `custom:setProperty` event handler; af2-web-runtime provides it client-side |
| `FT_FORMS-24358` | `FT_SKIP_ITEMS_MAP` | Containers export children as flat `items[]` array instead of `:items` map + `:itemsOrder` array |

## Key Files Reference

- Feature toggle constants: `bundles/af-core/src/main/java/.../internal/form/FeatureToggleConstants.java`
- Backend toggle check: `bundles/af-core/src/main/java/.../util/ComponentUtils.java` — reads JVM system property
- IT OSGi config dir: `it/config/src/main/content/jcr_root/apps/system/config/`
- IT test content dir: `it/content/src/main/content/jcr_root/content/forms/af/core-components-it/samples/`
- Cypress tests dir: `ui.tests/test-module/specs/`
- Toggle endpoint: `cy.fetchFeatureToggles()` → `GET /etc.clientlibs/toggles.json` → `response.body.enabled[]`
- Addon check: `cy.af.isLatestAddon()` in `libs/support/functions.js`

## File Map

| Action | File |
|--------|------|
| Modify | `it/config/src/main/content/jcr_root/apps/system/config/com.adobe.granite.toggle.impl.dev.DynamicToggleProviderImpl.cfg.json` |
| Create | `it/config/src/main/content/jcr_root/apps/system/config/com.adobe.granite.toggle.monitor.systemproperty~forms-24087.cfg.json` |
| Create | `it/config/src/main/content/jcr_root/apps/system/config/com.adobe.granite.toggle.monitor.systemproperty~forms-24343.cfg.json` |
| Create | `it/config/src/main/content/jcr_root/apps/system/config/com.adobe.granite.toggle.monitor.systemproperty~forms-24358.cfg.json` |
| Create | `it/content/src/main/content/jcr_root/content/forms/af/core-components-it/samples/fragment/container-rules/.content.xml` |
| Create | `ui.tests/test-module/specs/fragment/fragment.featuretoggles.cy.js` |
| Create | `ui.tests/test-module/specs/panelcontainer/panelcontainer.featuretoggles.cy.js` |
| Create | `docs/e2e-testing/feature-toggles.md` |
| Create | `CLAUDE.md` |

---

## Task 1: Update IT OSGi Config — Enable Toggles in DynamicToggleProvider

**Files:**
- Modify: `it/config/src/main/content/jcr_root/apps/system/config/com.adobe.granite.toggle.impl.dev.DynamicToggleProviderImpl.cfg.json`

**Why:** `cy.fetchFeatureToggles()` fetches `/etc.clientlibs/toggles.json`, which is driven by the Granite Toggle Service. Adding toggles here makes them appear in `response.body.enabled[]` so the Cypress test guards work.

- [ ] **Step 1: Add 3 new toggles to enabledToggles list**

Current file has 25 entries. Append the 3 new toggle IDs:

```json
{
  "enabledToggles": [
    "ft-cq-4324864",
    "FT_FORMS-3512",
    "FT_FORMS-2494",
    "FT_SKYOPS-60870",
    "FT_FORMS-8965",
    "FT_FORMS-9244",
    "FT_FORMS-13193",
    "FT_FORMS-11541",
    "FT_FORMS-12407",
    "FT_FORMS-11269",
    "FT_FORMS-11714",
    "FT_FORMS-11756",
    "FT_FORMS-12160",
    "FT_FORMS-12570",
    "FT_FORMS-12052",
    "FT_FORMS-13209",
    "FT_FORMS-11581",
    "FT_FORMS-14545",
    "FT_SITES-19631",
    "FT_FORMS-14255",
    "FT_FORMS-14068",
    "FT_FORMS-16351",
    "FT_FORMS-14518",
    "FT_FORMS-13519",
    "FT_FORMS-17107",
    "FT_FORMS-24087",
    "FT_FORMS-24343",
    "FT_FORMS-24358"
  ],
  "disabledToggles": []
}
```

- [ ] **Step 2: Commit**

```bash
git add it/config/src/main/content/jcr_root/apps/system/config/com.adobe.granite.toggle.impl.dev.DynamicToggleProviderImpl.cfg.json
git commit -m "feat(it): enable FT_FORMS-24087, FT_FORMS-24343, FT_FORMS-24358 in DynamicToggleProvider"
```

---

## Task 2: Create ToggleMonitorSystemPropertyFactory OSGi Configs

**Files:**
- Create: `it/config/src/main/content/jcr_root/apps/system/config/com.adobe.granite.toggle.monitor.systemproperty~forms-24087.cfg.json`
- Create: `it/config/src/main/content/jcr_root/apps/system/config/com.adobe.granite.toggle.monitor.systemproperty~forms-24343.cfg.json`
- Create: `it/config/src/main/content/jcr_root/apps/system/config/com.adobe.granite.toggle.monitor.systemproperty~forms-24358.cfg.json`

**Why:** `ComponentUtils.isToggleEnabled(toggleId)` reads `System.getProperty(toggleId)`. The `ToggleMonitorSystemPropertyFactory` OSGi service bridges the Granite toggle to the JVM system property. Without these configs, the Java backend ignores the toggle even when it's enabled in DynamicToggleProvider.

- [ ] **Step 1: Create config for FT_FORMS-24087**

```json
{
  "toggle.name": "FT_FORMS-24087",
  "system.property": "FT_FORMS-24087",
  "fail.used": false
}
```

- [ ] **Step 2: Create config for FT_FORMS-24343**

```json
{
  "toggle.name": "FT_FORMS-24343",
  "system.property": "FT_FORMS-24343",
  "fail.used": false
}
```

- [ ] **Step 3: Create config for FT_FORMS-24358**

```json
{
  "toggle.name": "FT_FORMS-24358",
  "system.property": "FT_FORMS-24358",
  "fail.used": false
}
```

- [ ] **Step 4: Commit**

```bash
git add it/config/src/main/content/jcr_root/apps/system/config/com.adobe.granite.toggle.monitor.systemproperty~forms-24087.cfg.json \
        it/config/src/main/content/jcr_root/apps/system/config/com.adobe.granite.toggle.monitor.systemproperty~forms-24343.cfg.json \
        it/config/src/main/content/jcr_root/apps/system/config/com.adobe.granite.toggle.monitor.systemproperty~forms-24358.cfg.json
git commit -m "feat(it): wire FT_FORMS-24087/24343/24358 to JVM system properties via ToggleMonitorSystemPropertyFactory"
```

---

## Task 3: Create IT Test Content for FT_FORMS-24087

**Files:**
- Create: `it/content/src/main/content/jcr_root/content/forms/af/core-components-it/samples/fragment/container-rules/.content.xml`

**Why:** To verify FT_FORMS-24087 (fragment container rules merge), we need a form where:
1. The fragment placeholder component in the form has rules defined on it (placeholder/panel rules)
2. The fragment itself (test-fragment) has internal rules

The existing `fragment/basic.html` page only has internal fragment rules; the placeholder node has no rules. For the toggle to be observable, the placeholder needs rules too.

**Design:** The new page embeds `test-fragment` (which has a calculate rule: textinput1 mirrors textinput value). The fragment placeholder also has a `custom:initialize` event rule that sets a text value. When toggle ON: both the placeholder event AND the fragment's calculate rule execute. When toggle OFF: only the placeholder event executes; fragment's calculate rule does NOT run.

- [ ] **Step 1: Create container-rules folder marker**

Create `it/content/src/main/content/jcr_root/content/forms/af/core-components-it/samples/fragment/container-rules/.content.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
          xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
          xmlns:fd="http://www.adobe.com/aemfd/fd/1.0"
    jcr:primaryType="cq:Page">
    <jcr:content
        cq:deviceGroups="[mobile/groups/responsive]"
        cq:template="/conf/core-components-examples/settings/wcm/templates/af-blank-v2"
        jcr:language="en"
        jcr:primaryType="cq:PageContent"
        jcr:title="Fragment Container Rules IT"
        sling:resourceType="forms-components-examples/components/page">
        <guideContainer
            fd:version="2.1"
            jcr:primaryType="nt:unstructured"
            sling:resourceType="forms-components-examples/components/form/container"
            dorType="none"
            fieldType="form"
            themeRef="/libs/fd/af/themes/canvas">
            <fragment
                jcr:primaryType="nt:unstructured"
                jcr:title="Fragment With Container Rules"
                sling:resourceType="forms-components-examples/components/form/fragment"
                fieldType="panel"
                fragmentPath="/content/forms/af/core-components-it/samples/fragment/test-fragment"
                name="fragmentwithrules"
                wrapData="{Boolean}true">
                <fd:events
                    jcr:primaryType="nt:unstructured"
                    initialize="[dispatchEvent($form.fragmentwithrules,'custom:setProperty',{value:'initialized'})]"/>
            </fragment>
        </guideContainer>
    </jcr:content>
</jcr:root>
```

**Note:** The `fd:events/initialize` rule on the placeholder dispatches `custom:setProperty` on itself with value `"initialized"`. This is the "placeholder/panel rule". The test-fragment's internal `textinput1` calculate rule (copies `textinput` value → `textinput1`) is the "container rule". With FT_FORMS-24087 ON: both execute. With it OFF: only placeholder event executes.

- [ ] **Step 2: Commit**

```bash
git add it/content/src/main/content/jcr_root/content/forms/af/core-components-it/samples/fragment/container-rules/
git commit -m "feat(it): add fragment/container-rules test page for FT_FORMS-24087 e2e test"
```

---

## Task 4: Cypress Test — fragment.featuretoggles.cy.js

**Files:**
- Create: `ui.tests/test-module/specs/fragment/fragment.featuretoggles.cy.js`

**Why:** Tests all 3 toggles in the context of fragments. Each toggle is independently gated.

**Test design:**
- **FT_FORMS-24087**: Load `fragment/container-rules.html` → type text into textinput → verify textinput1 mirrors the value (fragment container calculate rule executed, meaning the merge worked)
- **FT_FORMS-24343**: Load `fragment/basic.html` → verify the existing `custom:setProperty` data binding still works with toggle enabled (type into textinput, verify textinput1 mirrors, verify panel text shows "Thanks")
- **FT_FORMS-24358**: Load `fragment/basic.html` → verify all fragment children are rendered and accessible (children are available via `items[]` array format)

Pattern: `cy.af.isLatestAddon()` wraps entire describe body. `cy.fetchFeatureToggles()` runs in `before()`. Toggle check is inside each `it()`.

- [ ] **Step 1: Create the test file**

```javascript
/*******************************************************************************
 * Copyright 2025 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
describe("Form Runtime - Fragment Feature Toggles", () => {
    if (cy.af.isLatestAddon()) {
        const basicPagePath = "content/forms/af/core-components-it/samples/fragment/basic.html";
        const containerRulesPagePath = "content/forms/af/core-components-it/samples/fragment/container-rules.html";

        let formContainer = null;
        let toggle_array = [];

        before(() => {
            cy.fetchFeatureToggles().then((response) => {
                if (response.status === 200) {
                    toggle_array = response.body.enabled;
                }
            });
        });

        it("FT_FORMS-24087: fragment container rules should be merged with placeholder panel rules", () => {
            if (toggle_array.includes("FT_FORMS-24087")) {
                cy.previewForm(containerRulesPagePath).then(p => {
                    formContainer = p;
                });
                // textinput and textinput1 are inside the embedded test-fragment
                // The fragment's internal calculate rule: textinput1 = textinput.$value
                // Type into textinput → textinput1 should mirror the value (container rule executed)
                const [textInputId] = Object.entries(formContainer._fields)[0];
                const [textInput1Id] = Object.entries(formContainer._fields)[1];
                const testValue = "mergetest";
                cy.get(`#${textInputId}`).find("input").clear().type(testValue).blur();
                cy.get(`#${textInput1Id}`).find("input").should("have.value", testValue);
            }
        });

        it("FT_FORMS-24343: custom:setProperty data binding should work without server-injected default handler", () => {
            if (toggle_array.includes("FT_FORMS-24343")) {
                cy.previewForm(basicPagePath).then(p => {
                    formContainer = p;
                });
                // test-fragment has: textinput1 calculate rule mirrors textinput, and on valueCommit
                // dispatches custom:setProperty on the panel's text element with value "Thanks"
                const [idTextBox] = Object.entries(formContainer._fields)[0];
                const [idTextBox1] = Object.entries(formContainer._fields)[1];
                const [idPanel] = Object.entries(formContainer._fields)[4];
                const model = formContainer._model.getElement(idPanel);
                const input = "bindingtest";
                cy.get(`#${idTextBox}`).find("input").clear().type(input).blur();
                cy.get(`#${idTextBox1}`).find("input").should("have.value", input);
                cy.get(`#${model.items[0].id}`).should("have.text", "Thanks");
            }
        });

        it("FT_FORMS-24358: fragment children should be accessible when exported as items array", () => {
            if (toggle_array.includes("FT_FORMS-24358")) {
                cy.previewForm(basicPagePath).then(p => {
                    formContainer = p;
                });
                // With items array format, runtime must still initialize all children
                // Verify fragment is initialized and its children are rendered
                expect(formContainer, "formContainer is initialized").to.not.be.null;
                const fields = formContainer.getAllFields();
                expect(Object.keys(fields).length, "all fields are registered").to.be.greaterThan(0);
                // Verify the fragment's text inputs are visible in the DOM
                const [textInputId] = Object.entries(formContainer._fields)[0];
                cy.get(`#${textInputId}`).should("be.visible");
                cy.get(`#${textInputId}`).find("input").should("exist");
            }
        });
    }
});
```

- [ ] **Step 2: Commit**

```bash
git add ui.tests/test-module/specs/fragment/fragment.featuretoggles.cy.js
git commit -m "feat(e2e): add feature toggle tests for FT_FORMS-24087, FT_FORMS-24343, FT_FORMS-24358 in fragment spec"
```

---

## Task 5: Cypress Test — panelcontainer.featuretoggles.cy.js

**Files:**
- Create: `ui.tests/test-module/specs/panelcontainer/panelcontainer.featuretoggles.cy.js`

**Why:** FT_FORMS-24358 also affects panel containers (`AbstractContainerImpl` changes `getExportedItems()` and `getExportedItemsOrder()`). A dedicated panelcontainer test ensures the items-array format works for panels independently.

**Test design:** Load `panelcontainer/basic.html` → verify the panel and its children render correctly → verify model/view are in sync (same assertions as the core panelcontainer.runtime.cy.js test, gated on FT_FORMS-24358).

- [ ] **Step 1: Create the test file**

```javascript
/*******************************************************************************
 * Copyright 2025 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
describe("Form Runtime - Panel Container Feature Toggles", () => {
    if (cy.af.isLatestAddon()) {
        const pagePath = "content/forms/af/core-components-it/samples/panelcontainer/basic.html";

        let formContainer = null;
        let toggle_array = [];

        before(() => {
            cy.fetchFeatureToggles().then((response) => {
                if (response.status === 200) {
                    toggle_array = response.body.enabled;
                }
            });
        });

        it("FT_FORMS-24358: panel container children should be accessible when exported as items array", () => {
            if (toggle_array.includes("FT_FORMS-24358")) {
                cy.previewFormWithPanel(pagePath).then(p => {
                    formContainer = p;
                });
                // With FT_SKIP_ITEMS_MAP enabled, the server returns "items": []
                // instead of ":items": {} + ":itemsOrder": [].
                // The runtime must initialize children correctly from the array format.
                expect(formContainer, "formContainer is initialized").to.not.be.null;
                const fields = formContainer.getAllFields();
                expect(Object.keys(fields).length, "all panel children are registered").to.be.greaterThan(0);
                // Verify the panel component itself exists in the DOM
                cy.get('[data-cmp-is="adaptiveFormPanel"]').should("exist");
                // Verify panel children are visible
                const [firstChildId] = Object.entries(formContainer._fields)[0];
                cy.get(`#${firstChildId}`).should("exist");
            }
        });
    }
});
```

- [ ] **Step 2: Commit**

```bash
git add ui.tests/test-module/specs/panelcontainer/panelcontainer.featuretoggles.cy.js
git commit -m "feat(e2e): add FT_FORMS-24358 panel container feature toggle test"
```

---

## Task 6: Create Documentation and CLAUDE.md

**Files:**
- Create: `docs/e2e-testing/feature-toggles.md`
- Create: `CLAUDE.md`

**Why:** The documentation captures the architecture so future agents don't need to rediscover it. CLAUDE.md references the doc so it's loaded in every session, reducing token cost on repeated e2e work.

- [ ] **Step 1: Create docs/e2e-testing/feature-toggles.md**

See full content in Task 6 Step 1 below (the doc covers: toggle anatomy, IT config pattern, Cypress test pattern, how to add a new toggle test).

- [ ] **Step 2: Create CLAUDE.md at repo root**

```markdown
# aem-core-forms-components

## Key References

### E2E Testing
- **Feature Toggle Tests**: See [`docs/e2e-testing/feature-toggles.md`](docs/e2e-testing/feature-toggles.md)
  Covers: how to add e2e tests for new feature toggles (OSGi config + Cypress pattern).
```

- [ ] **Step 3: Commit**

```bash
git add docs/e2e-testing/feature-toggles.md CLAUDE.md
git commit -m "docs: add feature toggle e2e testing guide and CLAUDE.md"
```
