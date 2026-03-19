# ADR-001: JCR Authoring Schema for Adaptive Forms v2

**Status:** Accepted
**Date:** 2026-03-19
**Authors:** AEM Core Forms Components team

---

## Context

AEM Forms AF2 already has two schema layers:

1. **CRISPR / Runtime form spec** — the canonical JSON format that AEM Forms' generation
   pipelines, GenAI tooling (Forms Experience Builder), and AFCS conversion tools produce and
   consume. Owned by the AEM Forms AF2 + GenAI squad. The CRISPR spec validates the final AF2
   JSON model that the runtime reads — it validates _after_ generation/transformation.

2. **Sling models (AbstractFormComponentImpl, AbstractFieldImpl, …)** — Java classes that read
   JCR properties and produce the CRISPR-compatible JSON at request time. They are the bridge
   between JCR content and the runtime, but they contain no declarative schema that tooling can
   consume.

There was no schema layer for **what gets written to JCR** by the Edit Dialog, Content API, or
any programmatic content-creation tool. This ADR documents the decision to introduce one.

---

## Decision

Introduce a set of JSON Schema (Draft-7) YAML files — the **JCR Authoring Schema** — that
describe what properties a valid AF2 component node in JCR may contain. These schemas live in
`docs/authoring-schema/` inside `aem-core-forms-components` and are validated by
`scripts/content_api_forms.py`.

The JCR Authoring Schema is **complementary to CRISPR, not a replacement**. CRISPR validates the
runtime form spec; the authoring schema validates what is written to JCR at authoring time.
Together they cover the full lifecycle.

---

## Why a New Schema Layer and Not Just CRISPR

### 1. Different Validation Points in the Lifecycle

CRISPR/runtime schema validates at **generation / transformation time**: it is the contract that
generation pipelines (XFA → AF2, PDF → AF2) and GenAI tooling must produce. It says nothing
about how that content is stored in JCR or what an Edit Dialog is allowed to write.

The authoring schema validates at **write time**: when an author saves a dialog, when the
Content API submits a payload, or when a migration script creates component nodes. Without this
layer there is no machine-checkable contract for JCR writes.

### 2. AEM Sites Embedded Forms (Edit Dialog → JCR)

When a form is embedded in an AEM Sites page, content authors use the Granite Edit Dialog to
configure each component. The dialog writes directly to JCR. There is no CRISPR pipeline
involved. The authoring schema is the only schema that can validate this authoring path.

### 3. Content API Validation (`POST /adobe/pages`, `PATCH /content/…`)

The AEM Content API (`aem-headless-client` / Sites Content API) creates and mutates content by
writing JCR properties directly. The `scripts/content_api_forms.py` tool uses the authoring
schema to:
- validate payloads **before** submitting them, catching bad property names or wrong types
  before they reach the server;
- validate round-trip: re-read the node after PATCH and confirm what was written matches the
  schema.

CRISPR cannot serve this role because it models the runtime output (after Sling rendering), not
the raw JCR input.

### 4. Authoring-Only Properties That Do Not Exist in CRISPR

Several JCR properties exist only at authoring time and are either filtered out by Sling models
(`@JsonIgnore`) or are never forwarded to the runtime JSON at all. CRISPR has no entry for them.
The authoring schema must document and validate them:

| JCR Property | Where It Is Used | Why CRISPR Has No Entry |
|---|---|---|
| `fd:channel` | `AbstractComponentImpl` — propagated to children for print vs. web channel selection | `@JsonIgnore`; never appears in runtime JSON |
| `langDisplayValue` | Language display label stored in JCR | No public JSON getter; not serialised |
| `fd:rules/fd:click`, `fd:rules/fd:validate`, `fd:rules/fd:valueCommit`, `fd:rules/fd:formReady`, `fd:rules/fd:layoutReady`, `fd:rules/fd:docReady`, `fd:rules/fd:calc`, `fd:rules/fd:init`, `fd:rules/fd:indexChange` | Visual Rule Editor AST blobs (String[]) — written by the rule editor UI, read back by the rule editor UI | AF2 runtime ignores these keys; only the plain rule expressions (category A) in `fd:rules` reach the runtime `"rules"` key |
| `fd:rules/validationStatus` | Rule editor validity marker (`"none"` / `"valid"` / `"invalid"`) — set by the rule editor UI | Purely an authoring-time UI state flag; never in runtime JSON |
| `textIsRich` (`PN_TEXT_IS_RICH`) | Text component — flags whether static text is HTML rich text | Stored as `textIsRich` in JCR but exposed as `richText` in runtime JSON via `@JsonProperty`; CRISPR knows only `richText`, not `textIsRich` |

### 5. Two JCR Properties That Derive One Runtime/CRISPR Property

A concrete example of the authoring ↔ runtime mismatch: the CRISPR/runtime schema defines
`exclusiveMinimum` and `exclusiveMaximum` as a single typed value:

```yaml
# af2-docs/schema/adaptive-form-data-constraints.schema.yaml (CRISPR / runtime)
exclusiveMinimum:
  oneOf:
    - type: string
      format: date   # for DatePicker
    - type: number   # for NumberInput / TextInput
```

At the JCR authoring layer this **one runtime property** is composed from **two separate JCR
properties**:

| JCR Property | Type | Meaning |
|---|---|---|
| `exclusiveMinimum` | `boolean` (default `false`) | Flag: is the minimum exclusive? |
| `minimum` / `minimumDate` | `number` / `Date` | The actual minimum value |

The Sling model (`DatePickerImpl`, `TextInputImpl`, `NumberInputImpl`) combines them at request
time via `ComponentUtils.getExclusiveValue(exclusiveMinimum_flag, value, legacyExcludeFlag)` and
emits a single typed `exclusiveMinimum` in the JSON output. The same pattern applies to
`exclusiveMaximum` / `maximum` / `maximumDate`.

Without the authoring schema there is no documentation or validation of this mapping. A Content
API client writing `"exclusiveMinimum": "2024-01-01"` to JCR would store data in a format the
Sling model cannot read. The authoring schema catches this.

### 6. JCR Storage Quirks Not Modelled in CRISPR

CRISPR models clean property names. JCR imposes restrictions that the authoring schema must
document:

- **Custom events use underscores instead of colons**: the runtime `events` object uses
  `"custom:foo"` as the event name, but JCR cannot store a property named `custom:foo`. The
  authoring schema documents that `custom_foo` is stored in the `fd:events` child node and
  renamed at read time.
- **Boolean / String coercion**: some Granite dialog components write booleans as JCR Strings
  (`"true"` / `"false"`). The authoring schema captures both as `type: [boolean, string]` so
  validators accept both forms.
- **Child nodes vs. flat properties**: `fd:rules` and `fd:events` are JCR child nodes of the
  component node, not flat properties. CRISPR sees only the rendered `rules` and `events` keys in
  the JSON output. The authoring schema documents the two-level JCR structure explicitly.

### 7. Migration and Tooling Safety

Any script that creates or modifies AF2 component nodes in bulk (content migrations, the Content
API tool, import scripts) can validate its payloads against the authoring schema before applying
them. Running the same payload through CRISPR validation would require a full Sling render cycle;
running it against the authoring schema requires only a JSON Schema check.

---

## Limitations

### Does Not Apply to Document Authoring (DA)

Document Authoring uses Microsoft Word / Google Docs as the authoring surface and a different
content model (blocks / UE data attributes). There is no JCR Edit Dialog involved. The authoring
schema does not apply to DA-based forms.

### Does Not Replace Runtime Validation

The authoring schema validates JCR-layer content; it does not guarantee the rendered AF2 JSON
model is valid. End-to-end correctness still requires:
1. Authoring schema check (this work) — validates JCR write.
2. Sling model rendering — transforms JCR → JSON.
3. CRISPR / runtime schema check — validates the rendered JSON.

### Draft-7 `allOf` Limitation

JSON Schema Draft-7 `additionalProperties` does not traverse `allOf` / `$ref` chains. Strict
`additionalProperties: false` is only enforced in the flattened JSON schemas under
`bundles/af-core/src/test/resources/authoring-schema/`. Upgrading the YAML source files to
Draft-2019-09 and using `unevaluatedProperties: false` is the long-term path to strict-mode
enforcement in the YAML layer.

---

## Consequences

- Tooling (Content API scripts, migration scripts) can validate JCR payloads before submission.
- Edit Dialog changes must be reflected in the authoring schema to stay in sync.
- The schema serves as living documentation for the JCR ↔ runtime property mapping, including
  the two-JCR-property-to-one-runtime-property derivations described above.
- DA-based forms are out of scope and require a separate validation approach if needed in future.
