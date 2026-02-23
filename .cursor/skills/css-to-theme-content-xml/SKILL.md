---
name: css-to-theme-content-xml
description: Reverse-engineer AEM Adaptive Forms _cq_styleConfig and _cq_themeConfig content.xml files from CSS. Use when the user provides a CSS file (or CSS selectors) and wants to generate the corresponding JCR content.xml for styleConfig or themeConfig, or when working with AEM Core Forms Components theming, styling, or theme-to-XML conversion.
---

# CSS to _cq_styleConfig / _cq_themeConfig Generator

Generate AEM Adaptive Forms `_cq_styleConfig/.content.xml` and `_cq_themeConfig/.content.xml` from CSS.

## Authoritative References

The actual `_cq_styleConfig` and `_cq_themeConfig` files in this repository are the source of truth. **Always read the relevant config file before generating XML.** See [config-file-index.md](config-file-index.md) for the full index of all 35 config files organized by component and pattern type.

See [component-selectors.md](component-selectors.md) for the complete CSS selector to XML node mapping.

## Super Resource Type Inheritance

Components use `sling:resourceSuperType` to inherit `_cq_styleConfig` from parent components. **When a component does not define its own `_cq_styleConfig`, it inherits from the nearest ancestor that does.**

### Full Inheritance Hierarchy

```
base/v1/base (has _cq_styleConfig)
├── textinput/v1/textinput (has _cq_styleConfig — overrides base)
│   ├── telephoneinput/v1/telephoneinput (has _cq_styleConfig — overrides textinput)
│   └── emailinput/v1/emailinput (has _cq_styleConfig — overrides textinput)
├── numberinput/v1/numberinput (has _cq_styleConfig)
├── datepicker/v1/datepicker (has _cq_styleConfig)
├── datetime/v1/datetime (has _cq_styleConfig)
├── dropdown/v1/dropdown (has _cq_styleConfig)
├── checkbox/v1/checkbox (has _cq_styleConfig)
│   └── switch/v1/switch (has _cq_styleConfig — overrides checkbox entirely)
├── checkboxgroup/v1/checkboxgroup (has _cq_styleConfig)
│   ├── checkboxgroup/v2/checkboxgroup (NO own config — inherits v1)
│   └── toggleablelink/v1/toggleablelink (NO own config — inherits checkboxgroup)
├── radiobutton/v1/radiobutton (has _cq_styleConfig)
│   └── radiobutton/v2/radiobutton (NO own config — inherits v1)
├── button/v1/button (NO own config — inherits base)
│   └── button/v2/button (has _cq_styleConfig — overrides base chain)
│       ├── submit/v2/submit (has _cq_styleConfig)
│       └── reset/v2/reset (has _cq_styleConfig)
├── recaptcha/v1/recaptcha (has _cq_styleConfig)
│   ├── hcaptcha/v1/hcaptcha (has _cq_styleConfig — overrides recaptcha)
│   └── turnstile/v1/turnstile (NO own config — inherits recaptcha)
├── fileinput/v1/fileinput (NO own config — inherits base)
│   └── fileinput/v2 → v3 (has _cq_styleConfig) → v4 (has _cq_styleConfig)
├── image/v1/image (has _cq_styleConfig)
├── text/v1/text (has _cq_styleConfig)
└── scribble/v1/scribble (has _cq_styleConfig)

panelcontainer/v1/panelcontainer (has _cq_styleConfig) [super: responsivegrid]
├── fragment/v1/fragment (NO own config — inherits panelcontainer)
└── termsandconditions/v1 (has _cq_styleConfig)

container/v1/container [super: responsivegrid]
└── container/v2/container (has _cq_themeConfig — aggregator)
    └── fragmentcontainer/v1 (NO own config — inherits container)

accordion/v1/accordion (has _cq_styleConfig) [super: wcm accordion]
tabsontop/v1/tabsontop (has _cq_styleConfig) [super: wcm tabs]
verticaltabs/v1/verticaltabs (has _cq_styleConfig) [super: wcm panelcontainer]
wizard/v1/wizard [super: wcm panelcontainer]
└── wizard/v2/wizard (has _cq_styleConfig)

title/v1/title [super: wcm title]
└── title/v2/title (has _cq_styleConfig)
```

### Config Resolution for CSS Selectors

When a CSS selector targets a component, resolve the config file using this algorithm:

1. **Extract component name** from CSS selector (e.g., `.cmp-adaptiveform-telephoneinput__widget` → `telephoneinput`)
2. **Check if the component has its own `_cq_styleConfig`** in the config-file-index
3. **If yes**: use that config as template
4. **If no**: walk the `sling:resourceSuperType` chain until finding a component with its own `_cq_styleConfig`
5. **Use the inherited config** but note that CSS selectors in the output should match the ACTUAL component, not the super type

### Override Patterns

Components that define their own `_cq_styleConfig` while having a super type follow one of these patterns:

#### Pattern 1: Same Structure, Different Selectors
Components like `telephoneinput` and `emailinput` mirror their super type (`textinput`) node-for-node, but:
- Replace all CSS selectors with their own prefix (e.g., `.cmp-adaptiveform-telephoneinput__*` instead of `.cmp-adaptiveform-textinput__*`)
- Replace node names with component-specific names (e.g., `telephoneinputLabel` instead of `textinputLabel`)
- Replace IDs (e.g., `af2_telephoneinputlabel` instead of `af2_textinputlabel`)
- Use `sling:hideResource="{Boolean}true"` to hide inherited nodes that don't apply (e.g., telephoneinput hides `textAreaWidgetAndText`)

#### Pattern 2: Completely Different Structure
Components like `switch` (super: `checkbox`) define an entirely different node hierarchy. Switch has `switchContainer`, `switchOption`, `switchWidget`, `switchHandle`, `switchSlider` — none of which exist in checkbox.

#### Pattern 3: Version Upgrade
Components like `button/v2` (super: `button/v1`) add or modify nodes from the previous version.

### sling:hideResource

When a component inherits from a super type but needs to hide certain inherited nodes, use:
```xml
<textAreaWidgetAndText
    jcr:primaryType="nt:unstructured"
    sling:hideResource="{Boolean}true"/>
```
This prevents the inherited node from appearing in the resolved config. Common usage:
- `telephoneinput` and `emailinput` both hide `textAreaWidgetAndText` inherited from `textinput`

### secondarySelectors and themeConfig Resolution

The `secondarySelectors` attribute on a node (e.g., `secondarySelectors="af2_guideContainer:af2_widgetAndText"`) maps component-specific nodes to generic selectors from the `_cq_themeConfig`. This enables the theme editor to apply styles from the generic widget node to the component-specific widget node.

The `_cq_themeConfig` `target` references always point to the **component that owns the `_cq_styleConfig`**, resolved via `/mnt/override/libs/` path. For components that inherit (like `turnstile` from `recaptcha`), the themeConfig references `recaptcha` directly — there is no separate themeConfig entry for `turnstile`.

---

## Two Config Types

### _cq_styleConfig (per-component)

Defines the structural hierarchy of styleable elements for a single component: which CSS selectors map to which parts, their nesting, and available states. One per component, 32 files total.

### _cq_themeConfig (aggregator)

Lives on container/header/footer. Aggregates multiple component styleConfigs via `target` references. 3 files total. Uses `componentId` and `label` instead of `jcr:title` on root.

## Workflow

### Step 1: Parse CSS

For each CSS rule, extract:
- **Selector**: e.g., `.cmp-adaptiveform-textinput__widget`
- **Pseudo-class/data-attribute state**: `:focus`, `:hover`, `[data-cmp-valid='false']`, etc.
- **Media query breakpoint**: `@media (max-width: 768px)` → phone
- **All CSS property-value pairs**

### Step 2: Identify Components from Selectors

| Selector Pattern | Component Type | Config File to Read | Super Type |
|-----------------|----------------|-------------------|------------|
| `.cmp-adaptiveform-textinput*` | Text Input | `textinput/v1/textinput/_cq_styleConfig` | `base/v1/base` |
| `.cmp-adaptiveform-numberinput*` | Number Input | `numberinput/v1/numberinput/_cq_styleConfig` | `base/v1/base` |
| `.cmp-adaptiveform-emailinput*` | Email Input | `emailinput/v1/emailinput/_cq_styleConfig` | `textinput/v1/textinput` |
| `.cmp-adaptiveform-telephoneinput*` | Telephone Input | `telephoneinput/v1/telephoneinput/_cq_styleConfig` | `textinput/v1/textinput` |
| `.cmp-adaptiveform-datepicker*` | Date Picker | `datepicker/v1/datepicker/_cq_styleConfig` | `base/v1/base` |
| `.cmp-adaptiveform-datetime*` | DateTime | `datetime/v1/datetime/_cq_styleConfig` | `base/v1/base` |
| `.cmp-adaptiveform-dropdown*` | Dropdown | `dropdown/v1/dropdown/_cq_styleConfig` | `base/v1/base` |
| `.cmp-adaptiveform-button*` | Button | `button/v2/button/_cq_styleConfig` | `button/v1/button` → `base/v1/base` |
| `.cmp-adaptiveform-checkbox*` | Checkbox | `checkbox/v1/checkbox/_cq_styleConfig` | `base/v1/base` |
| `.cmp-adaptiveform-checkboxgroup*` | CheckboxGroup | `checkboxgroup/v1/checkboxgroup/_cq_styleConfig` | `base/v1/base` |
| `.cmp-adaptiveform-radiobutton*` | Radio Button | `radiobutton/v1/radiobutton/_cq_styleConfig` | `base/v1/base` |
| `.cmp-adaptiveform-switch*` | Switch | `switch/v1/switch/_cq_styleConfig` | `checkbox/v1/checkbox` |
| `.cmp-adaptiveform-container` | Form Container | `container/v2/container/_cq_themeConfig` | `container/v1/container` |
| `.cmp-container*` | Panel | `panelcontainer/v1/panelcontainer/_cq_styleConfig` | `responsivegrid` |
| `.cmp-accordion*` | Accordion | `accordion/v1/accordion/_cq_styleConfig` | `wcm accordion` |
| `.cmp-tabs*` | Tabs on Top | `tabsontop/v1/tabsontop/_cq_styleConfig` | `wcm tabs` |
| `.cmp-verticaltabs*` | Vertical Tabs | `verticaltabs/v1/verticaltabs/_cq_styleConfig` | `wcm panelcontainer` |
| `.cmp-adaptiveform-wizard*` | Wizard | `wizard/v2/wizard/_cq_styleConfig` | `wizard/v1/wizard` |
| `.cmp-image*` | Image | `image/v1/image/_cq_styleConfig` | `base/v1/base` |
| `.cmp-title*` | Title | `title/v2/title/_cq_styleConfig` | `title/v1/title` → `wcm title` |
| `.cmp-adaptiveform-text*` | Text | `text/v1/text/_cq_styleConfig` | `base/v1/base` |
| `.cmp-adaptiveform-fileinput*` | File Input | `fileinput/v3/fileinput/_cq_styleConfig` | `fileinput/v2` → `v1` → `base` |
| `.cmp-adaptiveform-termsandconditions*` | T&C | `termsandconditions/v1/termsandconditions/_cq_styleConfig` | `responsivegrid` |
| `.cmp-adaptiveform-scribble*` | Scribble | `scribble/v1/scribble/_cq_styleConfig` | `base/v1/base` |
| `.cmp-adaptiveform-recaptcha*` | reCAPTCHA | `recaptcha/v1/recaptcha/_cq_styleConfig` | `base/v1/base` |
| `.cmp-adaptiveform-hcaptcha*` | hCaptcha | `hcaptcha/v1/hcaptcha/_cq_styleConfig` | `recaptcha/v1/recaptcha` |

**Components that inherit config via super type (no own `_cq_styleConfig`):**

| Component | Inherits Config From | Super Type |
|-----------|---------------------|------------|
| `turnstile/v1` | `recaptcha/v1/recaptcha/_cq_styleConfig` | `recaptcha/v1/recaptcha` |
| `toggleablelink/v1` | `checkboxgroup/v1/checkboxgroup/_cq_styleConfig` | `checkboxgroup/v1/checkboxgroup` |
| `fragment/v1` | `panelcontainer/v1/panelcontainer/_cq_styleConfig` | `panelcontainer/v1/panelcontainer` |
| `fragmentcontainer/v1` | `container/v2/container/_cq_themeConfig` | `container/v2/container` |
| `checkboxgroup/v2` | `checkboxgroup/v1/checkboxgroup/_cq_styleConfig` | `checkboxgroup/v1/checkboxgroup` |
| `radiobutton/v2` | `radiobutton/v1/radiobutton/_cq_styleConfig` | `radiobutton/v1/radiobutton` |
| `submit/v1` | `button/v1/button` (→ `base/v1/base/_cq_styleConfig`) | `button/v1/button` |
| `reset/v1` | `button/v1/button` (→ `base/v1/base/_cq_styleConfig`) | `button/v1/button` |

All paths relative to `ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/`.

### Step 3: Read the Matching Config File

**Read the actual file** from the repository. Use it as the authoritative template for:
- XML node hierarchy and nesting
- Node names and attribute patterns
- Which `id`, `cssSelector`, `longTitle`, `propertySheet`, `secondarySelectors` values to use
- Which states each element supports
- Namespace declarations

### Step 4: Generate XML

Copy the structure from the template config file. For each CSS rule:

1. **Find the node** whose `cssSelector` matches the CSS selector
2. **Embed CSS property values** on that node as a bracket-encoded attribute:
   - Attribute name: `{breakpoint}_x0023_{state}` where `_x0023_` encodes `#`
   - Attribute value: `[prop1:val1,prop2:val2,...]`
3. **Add state nodes** if the CSS has pseudo-classes not already in the template
4. **Preserve all structural attributes** (`jcr:primaryType`, `id`, `cssSelector`, `propertySheet`, etc.)

### Breakpoint and State Encoding

`_x0023_` is JCR encoding for `#`. Combine breakpoint + state:

| CSS context | Attribute name |
|------------|---------------|
| No media query, no pseudo-class | `default_x0023_default` |
| No media query, `:focus` | `default_x0023_focus` |
| No media query, `:hover` | `default_x0023_hover` |
| No media query, `:active` | `default_x0023_active` |
| No media query, `:disabled` | `default_x0023_disabled` |
| No media query, `:checked` | `default_x0023_checked` |
| No media query, `[data-cmp-valid='false']` | `default_x0023_error` |
| No media query, `[data-cmp-valid='true']` | `default_x0023_success` |
| `@media` phone breakpoint, no pseudo-class | `phone_x0023_default` |
| `@media` tablet breakpoint, no pseudo-class | `tablet_x0023_default` |

### Bracket Value Format

```
[prop1:val1,prop2:val2,prop3:val3]
```

Rules:
- No spaces around colons or commas (except within values)
- Commas inside values escaped with `\,` — e.g. `rgba(0\,0\,0\,0.5)`
- CSS shorthands must be expanded to individual properties (e.g. `padding: 1px` → `padding-right:1px,padding-bottom:1px,padding-left:1px,padding-top:1px`)
- Special properties: `cssOverride` (raw CSS), `addonCss` (JSON with `&quot;` and `\,`), `beforePseudoElement`, `afterPseudoElement`

### UI Metadata Companion

For every `{breakpoint}_x0023_{state}` attribute, also generate a `{breakpoint}_x0023_{state}_x0023_ui` companion that stores editor metadata. Common UI properties:

- `marginLock` / `paddingLock` / `borderWidthLock` / `borderRadiusLock`: `link` if all sides equal, `linkOff` if sides differ
- `marginPopover` / `paddingPopover` / `borderWidthPopover` / `borderRadiusPopover`: shorthand display values, `—` for unchanged sides
- `backgroundColor`: color value for the color picker
- Use `Set` as placeholder for unset popover values

### Example

CSS input:
```css
.cmp-adaptiveform-textinput__widget {
    padding-right: 1px;
    padding-bottom: 1px;
    padding-left: 1px;
    padding-top: 1px;
    margin-right: 2px;
    margin-bottom: 2px;
    margin-left: 2px;
    margin-top: 2px;
    height: 30px;
    width: 50%
}
```

Find node with `cssSelector=".cmp-adaptiveform-textinput__widget"` in textinput _cq_styleConfig → `textinputWidgetAndText`. Add bracket attributes:

```xml
<textinputWidgetAndText
    jcr:primaryType="nt:unstructured"
    jcr:title="Text Input"
    id="af2_textinputwidgetandtext"
    cssSelector=".cmp-adaptiveform-textinput__widget"
    longTitle="Text Input Widget"
    propertySheet="/mnt/overlay/fd/af/components/stylePropertySheet/common"
    secondarySelectors="af2_guideContainer:af2_widgetAndText"
    default_x0023_default="[padding-right:1px,padding-bottom:1px,padding-left:1px,padding-top:1px,margin-right:2px,margin-bottom:2px,margin-left:2px,margin-top:2px,height:30px,width:50%]"
    default_x0023_default_x0023_ui="[paddingLock:link,paddingPopover:1px,marginLock:link,marginPopover:2px]">
```

---

## XML Structure Rules

### Namespace Declarations

Always include on `<jcr:root>` (copy from the template file):

```xml
xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
xmlns:granite="http://www.adobe.com/jcr/granite/1.0"
xmlns:cq="http://www.day.com/jcr/cq/1.0"
xmlns:jcr="http://www.jcp.org/jcr/1.0"
xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
```

### Required Attributes on Styleable Nodes

| Attribute | Value | Required |
|-----------|-------|----------|
| `jcr:primaryType` | `"nt:unstructured"` | Always |
| `jcr:title` | Short display title | Always |
| `id` | `"af2_{componentpart}"` (lowercase, no separators) | Always |
| `cssSelector` | The CSS class selector | Always |
| `longTitle` | Extended display title | Always |
| `propertySheet` | `"/mnt/overlay/fd/af/components/stylePropertySheet/common"` | Always |
| `secondarySelectors` | `"af2_guideContainer:af2_{inheritId}"` | Only for widget/help-icon inheritance |

### Containers

- Children wrapped in `<items jcr:primaryType="nt:unstructured">`
- States wrapped in `<states jcr:primaryType="nt:unstructured">`

### ID Convention

`af2_` prefix + lowercase component part, no separators:
- `af2_textbox`, `af2_textboxwidgetandtext`, `af2_textinputlabel`
- `af2_button`, `af2_buttontext`, `af2_buttonhelpicon`
- `af2_panel`, `af2_accordionpanel`, `af2_accordionpanelheader`

---

## State Mapping

| CSS Pattern | State Node Name | `jcr:title` | Outer wrapper selector | Inner element selector |
|-------------|----------------|-------------|----------------------|----------------------|
| `:focus` | `focus` | Focus | `.cmp-...{comp}:focus` | `.cmp-...{el}:focus` |
| `:hover` | `hover` | Hover | `.cmp-...{comp}:hover` | `.cmp-...{el}:hover` |
| `:disabled` | `disabled` | Disabled | `[data-cmp-enabled='false']` | `:disabled` |
| `:active` | `active` | Down / Active | `:active` | `:active` |
| `:required` | `mandatory` | Mandatory | `[data-cmp-required='true']` | `:required` |
| `:checked` | `checked` | Selected | — | `:checked` |
| `[data-cmp-valid='false']` | `error` | Error | `[data-cmp-valid='false']` | — |
| `[data-cmp-valid='true']` | `success` | Success | `[data-cmp-valid='true']` | — |

**Outer wrapper** = the main `.cmp-adaptiveform-{component}` element (uses data-attribute selectors for disabled/mandatory).
**Inner element** = sub-elements like `__widget`, `__label` (uses pseudo-class selectors).

---

## themeConfig Target References

The container `_cq_themeConfig` aggregates component styleConfigs via `target`:

```xml
<allButton
    jcr:primaryType="nt:unstructured"
    target="/mnt/override/libs/core/fd/components/form/button/v2/button/cq:styleConfig/items/button"/>
```

Target path: `/mnt/override/libs/core/fd/components/form/{component}/{version}/{component}/cq:styleConfig/items/{itemName}`

Read `container/v2/container/_cq_themeConfig/.content.xml` for the complete set of existing target references.

---

## File Placement

```
ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/
├── {component}/{version}/{component}/
│   ├── _cq_styleConfig/
│   │   └── .content.xml      ← per-component style config
│   └── _cq_themeConfig/
│       └── .content.xml      ← only on container, header, footer
```

---

## theme.structure Output Format (Single Unified content.xml)

When the user asks for a **single unified content.xml** (e.g., "generate content.xml", "theme.structure format", "one file for all components"), use the `theme.structure` format instead of per-component `_cq_styleConfig` files.

### Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0" xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    jcr:primaryType="sling:Folder">
    <jcr:content
        jcr:primaryType="nt:unstructured"
        rendition.handler.id="theme.structure">
        <components jcr:primaryType="nt:unstructured">
            <af2_guideContainer
                jcr:primaryType="nt:unstructured"
                component="core/fd/components/form/container/v2/container">
                <!-- Child nodes: one per CSS rule, named by the node's id -->
                <af2_numberinputwidgetandtext .../>
                <af2_form .../>
                <af2_textinputwidgetandtext .../>
            </af2_guideContainer>
        </components>
        <assetLibrary jcr:primaryType="nt:unstructured"/>
    </jcr:content>
</jcr:root>
```

### Rules for theme.structure Output

1. **Root**: `jcr:primaryType="sling:Folder"`, child `jcr:content` with `rendition.handler.id="theme.structure"`
2. **Container**: `af2_guideContainer` with `component="core/fd/components/form/container/v2/container"`
3. **Node names**: Use the **id** from the matching config node (e.g., `af2_numberinputwidgetandtext`, `af2_form`, `af2_textinputwidgetandtext`) as the XML element name
4. **Selector → ID mapping**: Resolve each CSS selector to its config node, then use that node's `id` as the child element name under `af2_guideContainer`
5. **assetLibrary**: Include empty `<assetLibrary jcr:primaryType="nt:unstructured"/>` at end of `jcr:content`

### Color Conversion for theme.structure

Hex colors in bracket values must be converted to `rgb(r,g,b)` with commas escaped:

| CSS | Bracket value |
|-----|---------------|
| `#ec7f7f` | `rgb(236\,127\,127)` |
| `#7f7fe1` | `rgb(127\,127\,225)` |
| `#ffffff` | `rgb(255\,255\,255)` |

Conversion: `#RRGGBB` → `rgb(R,G,B)` where R,G,B are decimal (0–255). Commas inside `rgb()` escaped as `\,`.

### UI Metadata for theme.structure (Simplified)

Use popover values only when applicable; omit Lock values if not needed:
- `backgroundColor`: color value (use rgb format for hex)
- `borderWidthPopover`, `borderRadiusPopover`: when border props present
- `paddingPopover`, `marginPopover`: when padding/margin present

---

## Validation Checklist

- [ ] Read the actual matching config file from the repository before generating
- [ ] If component has no own `_cq_styleConfig`, resolve via `sling:resourceSuperType` chain
- [ ] If component overrides super type, check for `sling:hideResource` nodes that hide inherited elements
- [ ] Every node has `jcr:primaryType="nt:unstructured"`
- [ ] Every styleable node has `id`, `cssSelector`, `longTitle`, `propertySheet`
- [ ] States use correct selector suffix (pseudo-class for inner, data-attr for outer)
- [ ] `<items>` wrapper around all child collections
- [ ] `<states>` wrapper around all state nodes
- [ ] IDs use `af2_` prefix and are unique within the file
- [ ] XML well-formed with proper encoding declaration and namespace declarations
- [ ] Structure matches the pattern from the actual template file
