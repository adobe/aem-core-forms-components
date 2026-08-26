# Config File Index

All `_cq_styleConfig` and `_cq_themeConfig` content.xml files in this repository, organized by component type. Use these as authoritative templates when generating new config files.

Base path: `ui.af.apps/src/main/content/jcr_root/apps/core/fd/components/form/`

## _cq_styleConfig Files (32 files)

### Input Fields (Pattern A)

| Component | Path | Pattern | sling:resourceSuperType |
|-----------|------|---------|------------------------|
| Text Input | `textinput/v1/textinput/_cq_styleConfig/.content.xml` | A (includes textarea variant) | `base/v1/base` |
| Number Input | `numberinput/v1/numberinput/_cq_styleConfig/.content.xml` | A | `base/v1/base` |
| Email Input | `emailinput/v1/emailinput/_cq_styleConfig/.content.xml` | A (hides textarea) | `textinput/v1/textinput` |
| Telephone Input | `telephoneinput/v1/telephoneinput/_cq_styleConfig/.content.xml` | A (hides textarea) | `textinput/v1/textinput` |
| Date Picker | `datepicker/v1/datepicker/_cq_styleConfig/.content.xml` | A | `base/v1/base` |
| DateTime | `datetime/v1/datetime/_cq_styleConfig/.content.xml` | A | `base/v1/base` |
| Dropdown | `dropdown/v1/dropdown/_cq_styleConfig/.content.xml` | A | `base/v1/base` |

### Buttons (Pattern B)

| Component | Path | Pattern | sling:resourceSuperType |
|-----------|------|---------|------------------------|
| Button | `button/v2/button/_cq_styleConfig/.content.xml` | B | `button/v1/button` → `base/v1/base` |
| Submit | `actions/submit/v2/submit/_cq_styleConfig/.content.xml` | B | `button/v2/button` |
| Reset | `actions/reset/v2/reset/_cq_styleConfig/.content.xml` | B | `button/v2/button` |

### Checkbox / Radio (Pattern C)

| Component | Path | Pattern | sling:resourceSuperType |
|-----------|------|---------|------------------------|
| Checkbox | `checkbox/v1/checkbox/_cq_styleConfig/.content.xml` | C | `base/v1/base` |
| CheckboxGroup | `checkboxgroup/v1/checkboxgroup/_cq_styleConfig/.content.xml` | C | `base/v1/base` |
| RadioButton | `radiobutton/v1/radiobutton/_cq_styleConfig/.content.xml` | C | `base/v1/base` |

### Switch

| Component | Path | sling:resourceSuperType |
|-----------|------|------------------------|
| Switch | `switch/v1/switch/_cq_styleConfig/.content.xml` | `checkbox/v1/checkbox` (completely different structure) |

### Panels (Pattern D)

| Component | Path | Pattern | sling:resourceSuperType |
|-----------|------|---------|------------------------|
| Panel Container | `panelcontainer/v1/panelcontainer/_cq_styleConfig/.content.xml` | D | `responsivegrid` |
| Accordion | `accordion/v1/accordion/_cq_styleConfig/.content.xml` | D | `wcm accordion` |
| Tabs on Top | `tabsontop/v1/tabsontop/_cq_styleConfig/.content.xml` | D | `wcm tabs` |
| Vertical Tabs | `verticaltabs/v1/verticaltabs/_cq_styleConfig/.content.xml` | D | `wcm panelcontainer` |
| Wizard | `wizard/v2/wizard/_cq_styleConfig/.content.xml` | D | `wizard/v1/wizard` |

### Simple / Other (Pattern E and unique)

| Component | Path | Pattern | sling:resourceSuperType |
|-----------|------|---------|------------------------|
| Image | `image/v1/image/_cq_styleConfig/.content.xml` | E | `base/v1/base` |
| Title | `title/v2/title/_cq_styleConfig/.content.xml` | E-variant | `title/v1/title` → `wcm title` |
| Text | `text/v1/text/_cq_styleConfig/.content.xml` | E-variant | `base/v1/base` |
| Base (generic field) | `base/v1/base/_cq_styleConfig/.content.xml` | Shared base | (root — no super) |
| File Input v3 | `fileinput/v3/fileinput/_cq_styleConfig/.content.xml` | Unique | `fileinput/v2` → `v1` → `base` |
| File Input v4 | `fileinput/v4/fileinput/_cq_styleConfig/.content.xml` | Unique | `fileinput/v3` |
| Scribble | `scribble/v1/scribble/_cq_styleConfig/.content.xml` | Unique | `base/v1/base` |
| Terms & Conditions | `termsandconditions/v1/termsandconditions/_cq_styleConfig/.content.xml` | Unique | `responsivegrid` |
| hCaptcha | `hcaptcha/v1/hcaptcha/_cq_styleConfig/.content.xml` | Unique | `recaptcha/v1/recaptcha` |
| reCAPTCHA | `recaptcha/v1/recaptcha/_cq_styleConfig/.content.xml` | Unique | `base/v1/base` |
| Review | `review/v1/review/_cq_styleConfig/.content.xml` | Unique | — |
| Footer | `footer/v1/footer/_cq_styleConfig/.content.xml` | Header/Footer | — |
| Page Header | `pageheader/v1/pageheader/_cq_styleConfig/.content.xml` | Header/Footer | — |

### Components Without Own _cq_styleConfig (inherit from super type)

| Component | Inherits Config From | sling:resourceSuperType |
|-----------|---------------------|------------------------|
| `turnstile/v1/turnstile` | `recaptcha/v1/recaptcha/_cq_styleConfig` | `recaptcha/v1/recaptcha` |
| `toggleablelink/v1/toggleablelink` | `checkboxgroup/v1/checkboxgroup/_cq_styleConfig` | `checkboxgroup/v1/checkboxgroup` |
| `fragment/v1/fragment` | `panelcontainer/v1/panelcontainer/_cq_styleConfig` | `panelcontainer/v1/panelcontainer` |
| `fragmentcontainer/v1/fragmentcontainer` | `container/v2/container/_cq_themeConfig` | `container/v2/container` |
| `checkboxgroup/v2/checkboxgroup` | `checkboxgroup/v1/checkboxgroup/_cq_styleConfig` | `checkboxgroup/v1/checkboxgroup` |
| `radiobutton/v2/radiobutton` | `radiobutton/v1/radiobutton/_cq_styleConfig` | `radiobutton/v1/radiobutton` |
| `submit/v1/submit` | `button/v1/button` → `base/v1/base/_cq_styleConfig` | `button/v1/button` |
| `reset/v1/reset` | `button/v1/button` → `base/v1/base/_cq_styleConfig` | `button/v1/button` |

## _cq_themeConfig Files (3 files)

| Component | Path | Purpose |
|-----------|------|---------|
| Container | `container/v2/container/_cq_themeConfig/.content.xml` | Main aggregator — references all component styleConfigs |
| Footer | `footer/v1/footer/_cq_themeConfig/.content.xml` | Footer aggregator |
| Page Header | `pageheader/v1/pageheader/_cq_themeConfig/.content.xml` | Header aggregator |

## Recommended Templates

When generating a new config file, use the closest existing component as a template:

| If the new component is... | Use as template |
|---------------------------|----------------|
| A text/number/email-like input | `textinput/v1/textinput/_cq_styleConfig/.content.xml` |
| A button variant | `button/v2/button/_cq_styleConfig/.content.xml` |
| A checkbox/radio/toggle | `checkbox/v1/checkbox/_cq_styleConfig/.content.xml` |
| A panel/container | `panelcontainer/v1/panelcontainer/_cq_styleConfig/.content.xml` |
| An accordion/tabs/wizard | `accordion/v1/accordion/_cq_styleConfig/.content.xml` |
| A simple display component | `image/v1/image/_cq_styleConfig/.content.xml` |
| A container themeConfig | `container/v2/container/_cq_themeConfig/.content.xml` |
