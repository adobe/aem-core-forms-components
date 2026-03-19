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
Adaptive Form Text Input (v1)
====
Adaptive Form Text input field component written in HTL.

## Features

* Provides the following type of input:
  * text
  * textarea
* Custom constraint messages for the above types
* Styles
* Allows replacing this component with other component (as mentioned below).

### Use Object
The Form Text component uses the `com.adobe.cq.forms.core.components.models.form.TextInput` Sling Model for its Use-object.

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

#### TextInput-specific

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Multi-line | `./multiLine` | Boolean | `false` | Renders as `<textarea>` when true |
| Autocomplete | `./autocomplete` | String | — | HTML autocomplete attribute value |


### Behavior of `maxLength` and `maxLengthMessage`

The `maxLength` property in HTML5 compliant fields, such as those used in the Adaptive Form Text Input component, restricts users from typing more characters than specified. This restriction aligns with HTML5 standards to ensure the input length does not exceed the defined maximum. However, there are scenarios, particularly in custom widgets or headless implementations, where it might be necessary to allow input beyond the `maxLength`.

To accommodate such use-cases, while still adhering to HTML5 compliance within the core component, the `maxLengthMessage` property is provided. This property allows developers to define a custom error message that is displayed when the input exceeds the `maxLength`, offering a way to guide users even when custom logic permits them to enter more characters than the standard limit.

### Display Format Feature

The Text Input component supports automatic formatting of input values using predefined display patterns:

- **Phone Number**: `(123) 456-7890`
- **Social Security Number**: `123-45-6789`
- **Email Alphanumeric**: `alphanumeric@example.com`
- **Zip Code**: `12345`

## Client Libraries
The component provides a `core.forms.components.textinput.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.textinput.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveform-textinput
    ELEMENT cmp-adaptiveform-textinput__label
    ELEMENT cmp-adaptiveform-textinput__label-container
    ELEMENT cmp-adaptiveform-textinput__widget
    ELEMENT cmp-adaptiveform-textinput__questionmark
    ELEMENT cmp-adaptiveform-textinput__shortdescription
    ELEMENT cmp-adaptiveform-textinput__longdescription
    ELEMENT cmp-adaptiveform-textinput__errormessage
```

### Note
By placing the class names `cmp-adaptiveform-textinput__label` and `cmp-adaptiveform-textinput__questionmark` within the `cmp-adaptiveform-textinput__label-container` class, you create a logical grouping of the label and question mark elements. This approach simplifies the process of maintaining a consistent styling for both elements.

## Replace feature:
We support replace feature that allows replacing Reset Button component to any of the below components:

* Button
* Date Picker
* Email Input
* Number Input
* Reset Button
* Submit Button
* Telephone Input
* Text Box

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the text-input component in the form view:  
 1. `data-cmp-is="adaptiveFormTextInput"`
 2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`


The following are optional attributes that can be added to the component in the form view:
1. `data-cmp-valid` having a boolean value to indicate whether the field is currently valid or not
2. `data-cmp-required` having a boolean value to indicate whether the field is currently required or not
3. `data-cmp-readonly` having a boolean value to indicate whether the field is currently readonly or not
4. `data-cmp-active` having a boolean value to indicate whether the field is currently active or not 
5. `data-cmp-visible` having a boolean value to indicate whether the field is currently visible or not
6. `data-cmp-enabled` having a boolean value to indicate whether the field is currently enabled or not