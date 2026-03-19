<!--
Copyright 2022 Adobe

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->
Adaptive Form Number Input (v1)
====
Adaptive Form Number input field component written in HTL.

## Features

* Provides the following type of input:
  * html5 number input
* Custom constraint messages for the above types
* Styles
* Allows replacing this component with other component (as mentioned below).

### Use Object
The Form Text component uses the `com.adobe.cq.forms.core.components.models.form.NumberInput` Sling Model for its Use-object.

### Edit Dialog Properties

The following properties are written to JCR by the Edit Dialog and consumed by the Sling Model.

#### Inherited from all components (base)

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Field name | `./name` | String | — | Submitted data key |
| Data reference | `./dataRef` | String | — | JSON-path for data binding |
| Visible | `./visible` | Boolean | *(runtime: true)* | Initial visibility; absent = runtime default true |
| Enabled | `./enabled` | Boolean | *(runtime: true)* | Whether field is interactive; absent = runtime default true |
| Label | `./jcr:title` | String | — | Visible label text |
| Hide label | `./hideTitle` | Boolean | `false` | Hides label visually |
| Rich text label | `./isTitleRichText` | Boolean | `false` | Treat label as rich text HTML |
| Description | `./description` | String | — | Help text / long description |
| Tooltip | `./tooltip` | String | — | Popover tooltip text |
| Show tooltip | `./tooltipVisible` | Boolean | `false` | Shows tooltip question-mark icon |
| Required | `./required` | Boolean | `false` | Whether a value is required |
| Required message | `./mandatoryMessage` | String | — | Error shown when required is violated |
| Validation expression | `./validationExpression` | String | — | json-formula returning true when valid |
| Validation expression message | `./validateExpMessage` | String | — | Error for validation expression failure |
| Assistive priority | `./assistPriority` | String | — | Screen-reader source: `description`, `title`, `name`, `custom` |
| Custom assistive text | `./custom` | String | — | Used when assistPriority is `custom` |
| Data type | `./type` | String | — | `string`, `number`, `integer`, `boolean`, etc. |

#### Field properties

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Read-only | `./readOnly` | Boolean | `false` | Prevents user edits |
| Default value | `./default` | Object[] | — | Initial value |
| Empty value | `./fd:emptyValue` | String | — | Value on empty submit: `"null"`, `"undefined"`, `""` |
| Placeholder | `./placeholder` | String | — | Ghosted hint text |
| Display format | `./displayFormat` | String | — | Display pattern (date/number formats) |
| Custom display format | `./fd:customDisplayFormat` | String | — | Overrides displayFormat when present |
| Edit format | `./editFormat` | String | — | Format for value entry |
| Display value expression | `./displayValueExpression` | String | — | json-formula for computed display value |
| Data format | `./dataFormat` | String | — | Format for value export/submission |
| Min length | `./minLength` | Integer | — | Minimum character count |
| Max length | `./maxLength` | Integer | — | Maximum character count |
| Min length message | `./minLengthMessage` | String | — | Error for minLength violation |
| Max length message | `./maxLengthMessage` | String | — | Error for maxLength violation |
| Pattern | `./pattern` | String | — | Regex validation pattern |
| Pattern message | `./validatePictureClauseMessage` | String | — | Error for pattern violation |
| Type message | `./typeMessage` | String | — | Error for type constraint violation |
| Format message | `./formatMessage` | String | — | Error for format constraint violation |

#### Child nodes

> These are JCR child nodes, not flat properties on the component node.

**`fd:rules`** (child node) — contains runtime rules (category A), visual rule editor AST (category B), and metadata (category C). The web runtime model only reads category A keys via `getRules()`.

| JCR property name | Category | Type | Description |
|-------------------|----------|------|-------------|
| `visible` | A — runtime rule | String | Show/hide json-formula expression |
| `required` | A — runtime rule | String | Required json-formula expression |
| `enabled` | A — runtime rule | String | Enable/disable json-formula expression |
| `readOnly` | A — runtime rule | String | Read-only json-formula expression |
| `value` | A — runtime rule | String | Computed value json-formula expression |
| `label` | A — runtime rule | String | Dynamic label json-formula expression |
| `enum` / `enumNames` | A — runtime rule | String | Dynamic options expressions |
| `minimum` / `maximum` | A — runtime rule | String | Dynamic constraint expressions |
| `exclusiveMinimum` / `exclusiveMaximum` | A — runtime rule | String | Dynamic exclusive constraint expressions |
| `description` | A — runtime rule | String | Dynamic description expression |
| `fd:click`, `fd:validate`, `fd:valueCommit`, `fd:format` | B — rule editor AST | String[] | Visual rule editor AST (ignored by web runtime) |
| `validationStatus` | C — metadata | String | Rule editor validity: `"none"` \| `"valid"` \| `"invalid"` |

**`fd:events`** (child node) — each property is an event name → handler expression (String or String[]):

| Event name | JCR property name | Description |
|------------|------------------|-------------|
| `click` | `click` | Button/field click handler |
| `submit` | `submit` | Form submit handler |
| `initialize` | `initialize` | On field initialization |
| `load` | `load` | On form load |
| `change` | `change` | On value change |
| `submitSuccess` | `submitSuccess` | After successful submit |
| `submitError` | `submitError` | After failed submit |
| `custom:eventName` | `custom_eventName` | Custom event (stored with `_`, read as `:`) |

#### NumberInput-specific

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Step | `./step` | String/Integer | — | Value must be a multiple of step |
| Step message | `./stepMessage` | String | — | Error for step constraint violation |
| Minimum | `./minimum` | String/Integer | — | Minimum numeric value (inclusive) |
| Maximum | `./maximum` | String/Integer | — | Maximum numeric value (inclusive) |
| Exclusive minimum | `./exclusiveMinimum` | Boolean | `false` | Whether minimum is exclusive |
| Exclusive maximum | `./exclusiveMaximum` | Boolean | `false` | Whether maximum is exclusive |
| Exclude minimum check (legacy) | `./excludeMinimumCheck` | Boolean | — | Legacy XFA property; use exclusiveMinimum |
| Exclude maximum check (legacy) | `./excludeMaximumCheck` | Boolean | — | Legacy XFA property; use exclusiveMaximum |
| Minimum message | `./minimumMessage` | String | — | Error for minimum constraint violation |
| Maximum message | `./maximumMessage` | String | — | Error for maximum constraint violation |

## Client Libraries
The component provides a `core.forms.components.numberinput.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property. 
The `core.forms.components.numberinput.v1.runtime` client library also include a widget which helps in implementation of `displayFormat` and `editFormat`.

It also provides a `core.forms.components.numberinput.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## Number Input Formatting

The formatting for number inputs, including decimal and thousand separators, is determined by the selected language. For example, with the `es-CO` locale:

- **Decimal separator:** `,`
- **Thousands separator:** `.`

### Supported Currency Symbols

Currency symbols are supported out-of-the-box (OOTB) for the following languages:

- `da-DK` (Danish)
- `de-DE` (German)
- `en-US` (English - United States)
- `en-GB` (English - United Kingdom)
- `es-ES` (Spanish - Spain)
- `fi-FI` (Finnish)
- `fr-FR` (French)
- `it-IT` (Italian)
- `ja-JP` (Japanese)
- `nb-NO` (Norwegian Bokmål)
- `nl-NL` (Dutch)
- `pt-BR` (Portuguese - Brazil)
- `sv-SE` (Swedish)
- `zh-CN` (Chinese - Simplified)
- `zh-TW` (Chinese - Traditional)
- `ko-KR` (Korean)
- `cs-CZ` (Czech)
- `pl-PL` (Polish)
- `ru-RU` (Russian)
- `tr-TR` (Turkish)

### Custom Currency Symbols

For languages not listed above, such as `es-CO` (Spanish - Colombia), the currency symbol must be explicitly defined using the ISO 4217 currency code. The format is `¤/COP#,#00.0#`.

## BEM Description
```
BLOCK cmp-adaptiveform-numberinput
    ELEMENT cmp-adaptiveform-numberinput__label
    ELEMENT cmp-adaptiveform-numberinput__label-container
    ELEMENT cmp-adaptiveform-numberinput__widget
    ELEMENT cmp-adaptiveform-numberinput__questionmark
    ELEMENT cmp-adaptiveform-numberinput__shortdescription
    ELEMENT cmp-adaptiveform-numberinput__longdescription
    ELEMENT cmp-adaptiveform-numberinput__errormessage
```

### Note
By placing the class names `cmp-adaptiveform-numberinput__label` and `cmp-adaptiveform-numberinput__questionmark` within the `cmp-adaptiveform-numberinput__label-container` class, you create a logical grouping of the label and question mark elements. This approach simplifies the process of maintaining a consistent styling for both elements.

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the number-input component in the form view:
1. `data-cmp-is="adaptiveFormButton"`
2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`



The following are optional attributes that can be added to the component in the form view:
1. `data-cmp-valid` having a boolean value to indicate whether the field is currently valid or not
2. `data-cmp-required` having a boolean value to indicate whether the field is currently required or not
3. `data-cmp-readonly` having a boolean value to indicate whether the field is currently readonly or not
4. `data-cmp-active` having a boolean value to indicate whether the field is currently active or not 
5. `data-cmp-visible` having a boolean value to indicate whether the field is currently visible or not
6. `data-cmp-enabled` having a boolean value to indicate whether the field is currently enabled or not

## Replace feature:
We support replace feature that allows replacing Reset Button component to any of the below components:

* Button
* Date Picker
* Email Input
* Reset Button
* Submit Button
* Telephone Input
* Text Box
* Text Input


## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready