# Adobe Sign Integration Reference

Use this reference only when the component being built involves document signing, agreement creation, or e-signature workflows.

**Key principle:** The `integration-adobesign` repo owns the entire Adobe Sign service layer. A Core Component that needs signing capability **consumes** these OSGi services — it does not re-implement OAuth, agreement APIs, or cloud config management.

---

## 1. Repo Module Map

| Module | What it provides |
|--------|-----------------|
| `bundles/aem-adobesign-api` | OSGi service interfaces + data model classes |
| `bundles/aem-adobesign-impl` | OSGi service implementations (REST API calls) |
| `bundles/aem-adobesign-sdk` | Bundled Adobe Sign REST SDK (`AgreementsApi`, `WidgetsApi`, etc.) |
| `content/` | Cloud service config UI, OAuth wizard, RTE plugin, clientlibs |

---

## 2. OSGi Services to Reference (never re-implement)

**`com.adobe.aem.adobesign.service.AdobeSignService`**
Primary service for agreement lifecycle operations:
```java
// Create a signing agreement for a document
String agreementId = adobeSignService.createAgreement(agreementInfo, cloudConfigPath);

// Cancel an existing agreement
adobeSignService.cancelAgreement(agreementId, cloudConfigPath);

// Get agreement status
AgreementInfo status = adobeSignService.getAgreementInfo(agreementId, cloudConfigPath);
```

**`com.adobe.aem.adobesign.service.AdobeSignCloudConfigurationService`**
Reads OAuth configuration from a cloud service config node path:
```java
AdobeSignCloudConfig config = cloudConfigService.getCloudConfig(cloudConfigPath, resourceResolver);
String apiAccessPoint = config.getApiAccessPoint();   // e.g., https://api.na1.echosign.com/
String webAccessPoint = config.getWebAccessPoint();   // e.g., https://secure.na1.echosign.com/
String accessToken = cloudConfigService.getAccessToken(cloudConfigPath, resourceResolver);
```

**`com.adobe.aem.adobesign.util.AdobeSignConstants`**
Constants for property names, group names, and config paths — use these rather than string literals.

**Service user:** Both service bundles run as `fd-cloudservice` (Sling service user mapping already configured in the repo's OSGi config).

---

## 3. JCR Properties for Signing Components

**On the component's own JCR node (authored in the component dialog):**

| JCR property | Type | Purpose |
|-------------|------|---------|
| `signingService` | `String` | Path to the Adobe Sign cloud service config node (e.g., `/etc/cloudservices/adobesign/myConfig`) |
| `cq:cloudserviceconfigs` | `String[]` | Multi-value — standard AEM property; alternative way to attach cloud service to a node |
| `displayMsg` | `String` | Message shown to the user before/after signing |
| `fd:targetVersion` | `String` | Target Adobe Sign API version (if version-specific features are needed) |

**On the Adobe Sign cloud service config node** (authored in the cloud service wizard, NOT on the form component):

| Property | Purpose |
|---------|---------|
| `client_id` | OAuth app client ID |
| `client_secret@Encrypted` | Encrypted OAuth client secret |
| `oAuthUrl` | OAuth authorization URL |
| `api_access_point` | REST API base URL |
| `web_access_point` | Web UI base URL |
| `refresh_token@Encrypted` | Encrypted refresh token |
| `signCloudType` | `comCloud` or `govCloud` |

**Cloud service config nodes live at:** `/etc/cloudservices/adobesign/{configName}/jcr:content`

---

## 4. How a Signing Component Reads the Cloud Config

The component's Sling Model reads `signingService` from its own node — or from the parent FormContainer if the signing service is configured at the form level. Then it passes the path to `AdobeSignCloudConfigurationService`:

```java
@Model(adaptables = {SlingHttpServletRequest.class}, ...)
public class SignatureStepImpl extends AbstractBaseImpl implements SignatureStep {

    @OSGiService
    private AdobeSignCloudConfigurationService cloudConfigService;

    @ValueMapValue(name = "signingService", injectionStrategy = InjectionStrategy.OPTIONAL)
    @Nullable
    private String signingService;

    @Override
    public String getSigningServiceConfig() {
        if (signingService == null || signingService.isEmpty()) {
            signingService = getContainerProperty("signingService", "");
        }
        return signingService;
    }

    @Override
    public String getWebAccessPoint() {
        if (getSigningServiceConfig().isEmpty()) return "";
        AdobeSignCloudConfig config = cloudConfigService.getCloudConfig(
            getSigningServiceConfig(), request.getResourceResolver());
        return config != null ? config.getWebAccessPoint() : "";
    }
}
```

---

## 5. What the JS View Does for Signing

The signing step's JS view (`signatureStepView.js`) typically:
1. Reads `data-cmp-webAccessPoint` and `data-cmp-agreementId` attributes written to the HTL root element by the Sling Model
2. Loads the Adobe Sign JS SDK from the web access point
3. Embeds the signing widget in a `<div class="cmp-adaptiveform-signaturestep__widget">` container
4. Calls `this._model.value = "signed"` (or equivalent) when the signature is completed, triggering form progression

The Adobe Sign JS SDK URL pattern:
```javascript
const sdkUrl = `${webAccessPoint}public/js/embed.js`;
// Load dynamically in initialize() — never as a static script tag
```

---

## 6. Component Dialog — Signing Service Field

In the component's `_cq_dialog/.content.xml`, add a path picker for the cloud service config:

```xml
<signingService
    jcr:primaryType="nt:unstructured"
    sling:resourceType="granite/ui/components/coral/foundation/form/pathfield"
    fieldDescription="Select the Adobe Sign cloud configuration."
    fieldLabel="Adobe Sign Configuration"
    name="./signingService"
    rootPath="/etc/cloudservices/adobesign"
    type="cq:Page"/>
```

If the signing service is configured at the form container level instead (one config for the whole form), add this field to the FormContainer dialog overlay (see `phase4-implementation/wiring-and-integration.md#wiring-step-6-formcontainer-dialog-extension-conditional`) rather than to the component's own dialog — and read it from the parent container in the Sling Model (see `phase4-implementation/wiring-and-integration.md#wiring-step-6b-reading-formcontainer-properties-in-the-components-sling-model`).

---

## 7. What NOT to Build (already in integration-adobesign)

| Do NOT build | Already exists in |
|-------------|------------------|
| OAuth authorization flow | `AdobeSignServiceImpl` |
| Access token refresh | `AdobeSignCloudConfigurationServiceImpl` |
| Agreement creation/cancellation | `AdobeSignService` |
| Cloud service config wizard UI | `content/jcr_root/libs/adobesign/cloudservices/` |
| Adobe Sign SDK REST clients | `bundles/aem-adobesign-sdk` |
| RTE plugin for inserting sign fields into documents | `content/jcr_root/libs/adobesign/components/rte/` |
| Sling service user mapping for `fd-cloudservice` | `content/jcr_root/libs/adobesign/config/` |

---

## 8. Adobe Sign Block Core Component (reference implementation)

**Production paths (`aem-core-forms-components`):**

| Artifact | Path |
|----------|------|
| HTL | `ui.af.apps/.../adobesignblock/v1/adobesignblock/adobesignblock.html` |
| Sling Model | `bundles/af-core/.../AdobeSignBlockImpl.java` |
| JS view | `.../clientlibs/runtime/js/adobesignblockview.js` |
| Theme SCSS | `aem-forms-theme-canvas/src/components/adobesignblock/_adobesignblock.scss` |
| Template | `_cq_template.xml` — `jcr:title`, `value` (signature placeholder HTML), `visible=false` |

**Checklist when creating or reviewing an Adobe Sign Block (or clone):**

1. `sling:resourceSuperType="core/fd/components/form/text/v1/text"` on `.content.xml`.
2. `@Model adapters = { Text.class, Base.class, ComponentExporter.class }` on the impl.
3. HTL: `textModel` + `baseModel`; label via `baseModel.label.value` / `.visible` / `.richText`.
4. Dialog: restore `./jcr:title` and `./hideTitle` (parent text dialog hides them).
5. `_cq_editConfig`: inplace RTE on `./value` with `adobesignplugin`; `hideLabel="{Boolean}true"` applies to the RTE field, not the component title.
6. JS: `updateValue` only touches `__value`; guard `updateLabel(null)`; preserve `data-adobesigntype` in DOMPurify `ALLOWED_ATTR`.
7. Embed clientlib category `core.forms.components.adobesignblock.v1.runtime` in `core-forms-components-runtime-all`.
8. **Authoring vs runtime:** `visible=false` on the block is correct — authors still see it in edit mode; signers see it when the Adobe Sign SDK shows the block.

**Placeholder CSS (radio/checkbox/dropdown visuals):**
- Do NOT apply a single underline style to all `[data-adobesigntype]` spans.
- Type-specific rules required:
  - Default types: transparent text + bottom border (signature, text, number, …)
  - `radio` / `checkbox`: **no** bottom border; SVG background icons (`radiobutton.svg`, `checkbox.svg`)
  - `dropdown`: chevron on the right
- Ship SVGs in `aem-forms-theme-canvas/src/resources/images/adobesign/` and mirror rules in `adobesignblockview.css` + runtime `resources/images/` for edit mode without theme rebuild.

**Foundation parity:** Foundation `adobeSignBlock` uses `label.jsp` + `guideField.title` (`jcr:title`). Core parity is the `__label-container` + `baseModel.label`, not a separate Title component sibling.

---

## 9. Inplace RTE Wiring for Adobe Sign Components

This section supplements the generic inplace edit wiring described in `phase4-implementation/htl-templates.md` — "Required wiring for inplace edit (do not skip)" section. Complete everything there first, then apply the following Adobe Sign-specific additions.

**Additional toolbar entry:**

| Control | Purpose |
|---------|---------|
| Adobe Sign Field (`adobesignplugin#adobesigncommand`) | Opens popover: Type dropdown, Name (required), Required checkbox |

Insert before `fullscreen#start` in the inline toolbar string:
`[adobesignplugin#adobesigncommand,format#bold,format#italic,format#underline,fullscreen#start,control#close,control#save]`

Add to the `rtePlugins` block in `_cq_editConfig.xml`:
```xml
<adobesignplugin
    jcr:primaryType="nt:unstructured"
    features="adobesigncommand"/>
```

**Additional clientlib wiring:**
- Category `aem.adobesign.rteplugin` (from `integration-adobesign` — do not reimplement) provides `CUI.rte.plugins.AdobeSignPlugin`.
- Embed on the forms v2 editor: container `editorhook` clientlib `embed="[aem.adobesign.rteplugin]"`.
- Component editor clientlib: `core.forms.components.adobesignblock.v1.editor` with `dependencies="[aem.adobesign.rteplugin, …]"`.

**Placeholder spans:**
Authored tokens use `data-adobesigntype` and `{{fieldName_es_:signer1:type…}}` syntax inside `__value` HTML.

**Placeholder CSS (radio/checkbox/dropdown visuals):**
Type-specific rules required — do NOT apply a single style to all `[data-adobesigntype]` spans:
- Default types (signature, text, number, …): transparent text + bottom border
- `radio` / `checkbox`: **no** bottom border; SVG background icons (`radiobutton.svg`, `checkbox.svg`)
- `dropdown`: chevron on the right
- Ship SVGs in `aem-forms-theme-canvas/src/resources/images/adobesign/` and mirror rules in `adobesignblockview.css` + runtime `resources/images/` for edit mode without theme rebuild.
