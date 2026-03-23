<!--
Copyright 2026 Adobe

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
Adaptive Form Date Picker (v2)
====
Adaptive Form Date Picker field component written in HTL.

## Features

* Provides the following type of input:
  * date
* Allows replacing this component with other component (as mentioned below).

### Use Object
The Form Date Picker component uses the `com.adobe.cq.forms.core.components.models.form.DatePicker` Sling Model for its Use-object.

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
| Type message | `./typeMessage` | String | — | Error for type constraint violation |
| Format message | `./formatMessage` | String | — | Error for format constraint violation |

#### DatePicker-specific

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Minimum date | `./minimumDate` | Date | — | Minimum selectable date (JCR Date property) |
| Maximum date | `./maximumDate` | Date | — | Maximum selectable date (JCR Date property) |
| Minimum date-time | `./minimumDateTime` | String | — | Minimum date-time (string) |
| Maximum date-time | `./maximumDateTime` | String | — | Maximum date-time (string) |
| Exclusive minimum | `./exclusiveMinimum` | Boolean | `false` | Whether minimum date is exclusive |
| Exclusive maximum | `./exclusiveMaximum` | Boolean | `false` | Whether maximum date is exclusive |
| Exclude minimum (legacy) | `./excludeMinimum` | Boolean | `false` | Legacy XFA property; use exclusiveMinimum |
| Exclude maximum (legacy) | `./excludeMaximum` | Boolean | `false` | Legacy XFA property; use exclusiveMaximum |
| Minimum message | `./minimumMessage` | String | — | Error for minimum date constraint violation |
| Maximum message | `./maximumMessage` | String | — | Error for maximum date constraint violation |

#### Child nodes

> These are JCR child nodes, not flat properties on the component node.

**`fd:rules`** (child node) — contains runtime rules (category A), visual rule editor AST (category B), and metadata (category C). The web runtime model only reads category A keys via `getRules()`.

**`fd:events`** (child node) — each property is an event name → handler expression (String or String[]):

| Event name | JCR property name | Description |
|------------|------------------|-------------|
| `click` | `click` | Button/field click handler |
| `change` | `change` | On value change |
| `initialize` | `initialize` | On field initialization |
| `custom:eventName` | `custom_eventName` | Custom event (stored with `_`, read as `:`) |

## Client Libraries
The component provides a `core.forms.components.datePicker.v2.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

## BEM Description
```
BLOCK cmp-adaptiveform-datepicker
    ELEMENT cmp-adaptiveform-datepicker__label
    ELEMENT cmp-adaptiveform-datepicker__label-container
    ELEMENT cmp-adaptiveform-datepicker__widget
    ELEMENT cmp-adaptiveform-datepicker__questionmark
    ELEMENT cmp-adaptiveform-datepicker__shortdescription
    ELEMENT cmp-adaptiveform-datepicker__longdescription
    ELEMENT cmp-adaptiveform-datepicker__errormessage
```

### Note
By placing the class names `cmp-adaptiveform-datepicker__label` and `cmp-adaptiveform-datepicker__questionmark` within the `cmp-adaptiveform-datepicker__label-container` class, you create a logical grouping of the label and question mark elements. This approach simplifies the process of maintaining a consistent styling for both elements.

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the date-picker component in the form view:  
 1. `data-cmp-is="adaptiveFormDatePicker"`
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
* Email Input
* Number Input
* Reset Button
* Submit Button
* Telephone Input
* Text Box
* Text Input
 
 
## Information
* **Vendor**: Adobe
* **Version**: v2
* **Compatibility**: Cloud
* **Status**: production-ready

