# Component Selector Reference

Complete mapping of CSS selectors to _cq_styleConfig XML nodes for all AEM Core Forms Components.

## Table of Contents

- [Input Fields (Pattern A)](#input-fields-pattern-a)
- [Button (Pattern B)](#button-pattern-b)
- [Checkbox / Radio / CheckboxGroup (Pattern C)](#checkbox--radio--checkboxgroup-pattern-c)
- [Switch](#switch)
- [Panel Types (Pattern D)](#panel-types-pattern-d)
- [Simple Components (Pattern E)](#simple-components-pattern-e)
- [Container / ThemeConfig](#container--themeconfig)
- [Common Sub-Element Suffixes](#common-sub-element-suffixes)

---

## Input Fields (Pattern A)

Components: `textinput`, `numberinput`, `emailinput`, `telephoneinput`, `datepicker`, `datetime`, `dropdown`

All follow the same structure. Replace `{comp}` with the component name.

**Inheritance notes:**
- `emailinput` and `telephoneinput` extend `textinput` via `sling:resourceSuperType` — they mirror textinput's structure but use their own CSS selectors and hide `textAreaWidgetAndText` with `sling:hideResource="{Boolean}true"`
- `numberinput`, `datepicker`, `datetime`, `dropdown` extend `base/v1/base` directly — each defines its own `_cq_styleConfig`

| XML Node | cssSelector | id pattern | secondarySelectors |
|----------|-------------|------------|-------------------|
| widgetAndText (root wrapper) | `.cmp-adaptiveform-{comp}` | `af2_{comp}widgetandtext` | `af2_guideContainer:af2_widgetAndText` |
| labelContainer | `.cmp-adaptiveform-{comp}__label-container` | `af2_{comp}labelcontainer` | — |
| label | `.cmp-adaptiveform-{comp}__label` | `af2_{comp}label` | — |
| helpIcon | `.cmp-adaptiveform-{comp}__questionmark` | `af2_{comp}helpicon` | `af2_guideContainer:af2_helpicon` |
| widget | `.cmp-adaptiveform-{comp}__widget` | `af2_{comp}widgetandtext` | `af2_guideContainer:af2_widgetAndText` |
| shortDescription | `.cmp-adaptiveform-{comp}__shortdescription` | `af2_{comp}descriptionshort` | — |
| longDescription | `.cmp-adaptiveform-{comp}__longdescription` | `af2_{comp}descriptionlong` | — |
| errorMessage | `.cmp-adaptiveform-{comp}__errormessage` | `af2_{comp}errormessage` | — |

### Outer states (on widgetAndText):
- focus: `.cmp-adaptiveform-{comp}:focus`
- disabled: `.cmp-adaptiveform-{comp}[data-cmp-enabled='false']`
- hover: `.cmp-adaptiveform-{comp}:hover`
- mandatory: `.cmp-adaptiveform-{comp}[data-cmp-required='true']`
- error: `.cmp-adaptiveform-{comp}[data-cmp-valid='false']`
- success: `.cmp-adaptiveform-{comp}[data-cmp-valid='true']`

### Inner widget states:
- focus: `.cmp-adaptiveform-{comp}__widget:focus`
- hover: `.cmp-adaptiveform-{comp}__widget:hover`
- disabled: `.cmp-adaptiveform-{comp}__widget:disabled`
- mandatory: `.cmp-adaptiveform-{comp}__widget:required`

### Specific component names:

| Component | {comp} value | Root id | jcr:title |
|-----------|-------------|---------|-----------|
| Text Input | `textinput` | `af2_textbox` | `Base` |
| Number Input | `numberinput` | `af2_numericbox` | `Base` |
| Email Input | `emailinput` | `af2_emailinput` | `Base` |
| Telephone Input | `telephoneinput` | `af2_telephoneinput` | `Base` |
| Date Picker | `datepicker` | `af2_datepicker` | `Base` |
| DateTime | `datetime` | `af2_datetime` | `Base` |
| Dropdown | `dropdown` | `af2_dropdownlist` | `Base` |

### Text Input special: textarea variant

Text Input has an additional `textAreaWidgetAndText` node:

| XML Node | cssSelector | id |
|----------|-------------|-----|
| textAreaWidgetAndText | `textarea.cmp-adaptiveform-textinput__widget` | `af2_textareawidgetandtext` |

With states: focus, disabled, hover, mandatory (all on `textarea.cmp-adaptiveform-textinput__widget:{state}`).

---

## Button (Pattern B)

Path: `button/v2/button/_cq_styleConfig`

| XML Node | cssSelector | id |
|----------|-------------|-----|
| button (root) | `.cmp-adaptiveform-button__widget` | `af2_button` |
| buttonText | `.cmp-adaptiveform-button__text` | `af2_buttontext` |
| buttonDescriptionShort | `.cmp-adaptiveform-button__shortdescription` | `af2_buttondescriptionshort` |
| buttonDescriptionLong | `.cmp-adaptiveform-button__longdescription` | `af2_buttondescriptionlong` |
| buttonHelpContainer | `.cmp-adaptiveform-button__help-container` | `af2_buttonhelpcontainer` |
| buttonHelpIcon | `.cmp-adaptiveform-button__questionmark` | `af2_buttonhelpicon` |

Root states: focus, active (Down), disabled, hover, error, success.
Button text states: focus, active (Down), disabled, hover.

Submit and Reset buttons reuse the same pattern at:
- `actions/submit/v2/submit/_cq_styleConfig` (super: `button/v2/button`)
- `actions/reset/v2/reset/_cq_styleConfig` (super: `button/v2/button`)
- v1 submit/reset have no own config — they inherit from `button/v1/button` → `base/v1/base`

---

## Checkbox / Radio / CheckboxGroup (Pattern C)

### Checkbox (`checkbox/v1/checkbox`)

| XML Node | cssSelector | id |
|----------|-------------|-----|
| widgetAndText | `.cmp-adaptiveform-checkbox` | `af2_checkboxfieldwidgetandtext` |
| checkBoxItem | `.cmp-adaptiveform-checkbox__widget-container` | `af2_checkboxitem` |
| checkBoxLabel | `.cmp-adaptiveform-checkbox__label` | `af2_checkboxlabel` |
| checkBoxWidgetAndText | `.cmp-adaptiveform-checkbox__widget` | `af2_checkboxwidgetandtext` |
| checkBoxDescriptionShort | `.cmp-adaptiveform-checkbox__shortdescription` | `af2_checkboxdescriptionshort` |
| checkBoxDescriptionLong | `.cmp-adaptiveform-checkbox__longdescription` | `af2_checkboxdescriptionlong` |
| checkBoxHelpContainer | `.cmp-adaptiveform-checkbox__help-container` | `af2_checkboxhelpcontainer` |
| checkBoxHelpIcon | `.cmp-adaptiveform-checkbox__questionmark` | `af2_checkboxhelpicon` |
| checkBoxErrorMessage | `.cmp-adaptiveform-checkbox__errormessage` | `af2_checkboxerrormessage` |

Widget states include `checked` (`:checked`).
Outer states: hover, focus, disabled (`[data-cmp-enabled='false']`), error, success.

### CheckboxGroup (`checkboxgroup/v1/checkboxgroup`)

Same pattern as Checkbox, replace `checkbox` with `checkboxgroup` in selectors and ids.
- `checkboxgroup/v2` has no own config — inherits from `checkboxgroup/v1`
- `toggleablelink/v1` also inherits from `checkboxgroup/v1` (no own config)

### RadioButton (`radiobutton/v1/radiobutton`)

Same pattern as Checkbox, replace `checkbox` with `radiobutton` in selectors and ids.
- `radiobutton/v2` has no own config — inherits from `radiobutton/v1`

---

## Switch

Path: `switch/v1/switch/_cq_styleConfig` (super: `checkbox/v1/checkbox` — but **completely different structure**)

Unique elements beyond the standard pattern:

| XML Node | cssSelector | id |
|----------|-------------|-----|
| widgetAndText (root) | `.cmp-adaptiveform-switch` | `af2_switchwidgetandtext` |
| switchContainer | `.cmp-adaptiveform-switch__container` | `af2_switchwidgetcontainer` |
| switchOption | `.cmp-adaptiveform-switch__option` | `af2_switchoption` |
| switchWidget | `.adaptiveform-switch__widget-label` | `af2_switchwidget` |
| switchHandle | `.cmp-adaptiveform-switch__circle-indicator` | `af2_switchhandle` |
| switchSlider | `.cmp-adaptiveform-switch__widget-slider` | `af2_switchonlabel` |

Switch handle and slider use adjacent sibling selectors for states:
- `.cmp-adaptiveform-switch__widget:focus + .cmp-adaptiveform-switch__widget-slider .cmp-adaptiveform-switch__circle-indicator`
- `.cmp-adaptiveform-switch__widget:checked + .cmp-adaptiveform-switch__widget-slider`

---

## Panel Types (Pattern D)

### Responsive Panel (`panelcontainer/v1/panelcontainer`)

| XML Node | cssSelector | id |
|----------|-------------|-----|
| responsivePanel | `.cmp-container` | `af2_panel` |
| panelLabelContainer | `.cmp-container__label-container` | `af2_panellabelcontainer` |
| panelLabel | `.cmp-container__label` | `af2_panellabel` |
| panelHelpIcon | `.cmp-container__questionmark` | `af2_panelhelpicon` |
| panelDescriptionShort | `.cmp-container__shortdescription` | `af2_paneldescriptionshort` |
| panelDescriptionLong | `.cmp-container__longdescription` | `af2_paneldescriptionlong` |

### Accordion (`accordion/v1/accordion`)

Root selector: `.cmp-accordion` (id: `af2_accordionpanel`)

Additional accordion-specific items:

| XML Node | cssSelector | id |
|----------|-------------|-----|
| accordionPanelItem | `.cmp-accordion__item` | `af2_accordionpanelitem` |
| accordionHeader | `.cmp-accordion__header` | `af2_accordionpanelheader` |
| accordionHeaderButton | `.cmp-accordion__button` | `af2_accordionheaderbutton` |
| accordionHeaderTitle | `.cmp-accordion__title` | `af2_accordionheadertitle` |
| accordionHeaderIcon | `.cmp-accordion__icon` | `af2_accordionheadericon` |
| accordionPanelWidget | `.cmp-accordion__panel` | `af2_accordionpanelwidget` |

Panel item states use `:active` and `:hover` (not `:focus`/`:disabled`).

### Tabs On Top (`tabsontop/v1/tabsontop`)

Root selector: `.cmp-tabs` (id: `af2_tabsontoppanel`)

### Vertical Tabs (`verticaltabs/v1/verticaltabs`)

Root selector: `.cmp-verticaltabs` (id: `af2_tabsonleftpanel`)

### Wizard (`wizard/v2/wizard`)

Root selector: `.cmp-adaptiveform-wizard` (id: `af2_wizardpanel`)

---

## Simple Components (Pattern E)

### Image (`image/v1/image`)

```xml
<Image jcr:primaryType="nt:unstructured"
    jcr:title="Image" id="af2_image"
    cssSelector=".cmp-image__image" longTitle="Image"
    propertySheet="/mnt/overlay/fd/af/components/stylePropertySheet/common"/>
```

### Title (`title/v2/title`)

Root selector: `.cmp-title` or component-specific selector.

### Text (`text/v1/text`)

Root selector: `.cmp-adaptiveform-text` or `.cmp-text`.

---

## Container / ThemeConfig

### Container _cq_themeConfig (`container/v2/container`)

The container themeConfig aggregates ALL component styleConfigs. It uses:
- `componentId="af2_guideContainer"` on the root
- `label="CC Container"` on the root
- Direct `target` references for delegation

Key groupings:

```
items
├── afPage (body selector, id: af2_page)
├── form (.cmp-adaptiveform-container, id: af2_form)
├── base (generic .base field, id: af2_base)
│   └── items: fieldLabel, widgetAndText (with many target overrides)
├── button (grouping for all buttons via targets)
├── panel (grouping for all panel types via targets)
├── Image (target → image styleConfig)
├── hcaptcha (target → hcaptcha styleConfig)
└── recaptcha (target → recaptcha styleConfig)
```

### Header/Footer _cq_themeConfig

These use `componentId` and reference their own `_cq_styleConfig` via `target`:

```xml
<jcr:root ... jcr:primaryType="nt:unstructured" componentId="af2_header">
    <items jcr:primaryType="nt:unstructured">
        <header jcr:primaryType="nt:unstructured"
            target="/mnt/override/apps/core/fd/components/form/pageheader/v1/pageheader/cq:styleConfig/items/header"/>
    </items>
</jcr:root>
```

---

## Common Sub-Element Suffixes

These BEM element suffixes appear consistently across components:

| Suffix | Purpose | Typical States |
|--------|---------|---------------|
| `__widget` | The actual input/control | focus, hover, disabled, mandatory, checked |
| `__label` | Field label text | hover, focus |
| `__label-container` | Wrapper around label + help icon | disabled, hover, focus |
| `__questionmark` | Help/info icon | focus, hover, disabled |
| `__shortdescription` | Brief help text | (none) |
| `__longdescription` | Extended help text | focus, hover |
| `__errormessage` | Validation error text | (none) |
| `__help-container` | Wrapper for help content | focus, hover |
| `__widget-container` | Wrapper for checkbox/radio items | focus, hover, disabled |
| `__text` | Button label text | focus, active, disabled, hover |
| `__widget-slider` | Switch slider track | focus, disabled, hover, checked |
| `__circle-indicator` | Switch handle circle | focus, disabled, hover, checked |

## Inheritance-Only Components (No Own _cq_styleConfig)

These components inherit their `_cq_styleConfig` entirely from their `sling:resourceSuperType` and have no file to read — use the super type's config instead:

| Component | Inherits From | Notes |
|-----------|--------------|-------|
| `turnstile/v1` | `recaptcha/v1/recaptcha` | Cloudflare Turnstile — uses reCAPTCHA config |
| `toggleablelink/v1` | `checkboxgroup/v1/checkboxgroup` | Uses checkbox group config |
| `fragment/v1` | `panelcontainer/v1/panelcontainer` | Form fragment — uses panel config |
| `fragmentcontainer/v1` | `container/v2/container` | Fragment container — uses container themeConfig |
| `checkboxgroup/v2` | `checkboxgroup/v1/checkboxgroup` | Version upgrade — no override needed |
| `radiobutton/v2` | `radiobutton/v1/radiobutton` | Version upgrade — no override needed |

---

## Base / Generic Field Selectors

The `base/v1/base/_cq_styleConfig` defines fallback selectors for all fields:

| Selector | Purpose |
|----------|---------|
| `.cmp-adaptiveform-container .base` | Generic field wrapper |
| `.cmp-adaptiveform-container input,select,textarea` | All native inputs |
| `.cmp-adaptiveform-container label` | All labels |
| `.cmp-adaptiveform-container [class$='__errormessage']` | All error messages |
