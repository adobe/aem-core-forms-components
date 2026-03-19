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
Adaptive Form CheckBox Group (v1)
====
Adaptive Form CheckBox Group component written in HTL.

## Features

* Provides the following type of input:
  * checkbox
* Custom constraint messages for the above types
* Styles

### Use Object
The Form CheckBox Group component uses the `com.adobe.cq.forms.core.components.models.form.CheckBoxGroup` Sling Model for its Use-object.

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
| Description | `./description` | String | — | Help text / long description |
| Tooltip | `./tooltip` | String | — | Popover tooltip text |
| Show tooltip | `./tooltipVisible` | Boolean | `false` | Shows tooltip question-mark icon |
| Required | `./required` | Boolean | `false` | Whether a value is required |
| Required message | `./mandatoryMessage` | String | — | Error shown when required is violated |
| Validation expression | `./validationExpression` | String | — | json-formula returning true when valid |
| Assistive priority | `./assistPriority` | String | — | Screen-reader source: `description`, `title`, `name`, `custom` |
| Data type | `./type` | String | — | `string`, `number`, `boolean`, etc. |

#### Field properties

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Read-only | `./readOnly` | Boolean | `false` | Prevents user edits |
| Default value | `./default` | Object[] | — | Initial value |
| Multi-value default | `./fd:multiDefaultValues` | Object[] | — | Default for multi-value fields |
| Empty value | `./fd:emptyValue` | String | — | Value on empty submit: `"null"`, `"undefined"`, `""` |
| Placeholder | `./placeholder` | String | — | Ghosted hint text |

#### CheckboxGroup-specific

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Option values | `./enum` | String[] | — | Available checkbox values; type coerced to match `./type` at runtime; group always returns an array type |
| Option display labels | `./enumNames` | String[] | — | Display text for each enum value |
| Orientation | `./orientation` | String | — | Layout direction: `horizontal` or `vertical`; injected via `@ValueMapValue` in `CheckBoxGroupImpl` and placed in `customLayoutProperties` |
| Enforce enum | `./enforceEnum` | Boolean | `true` | When false, values outside the enum list are allowed |
| Enforce enum message | `./enforceEnumMessage` | String | — | Error message shown when enforceEnum is violated |
| Unique items message | `./uniqueItemsMessage` | String | — | Error message shown when duplicate values are selected |
| Options are rich text | `./areOptionsRichText` | Boolean | — | When true, enumNames are rendered as rich text HTML (consumed client-side) |

## Client Libraries
The component provides a `core.forms.components.checkboxgroup.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.checkboxgroup.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveform-checkboxgroup
    ELEMENT cmp-adaptiveform-checkboxgroup__label
    ELEMENT cmp-adaptiveform-checkboxgroup__label-container
    ELEMENT cmp-adaptiveform-checkboxgroup__widget
    ELEMENT cmp-adaptiveform-checkboxgroup-item
    ELEMENT cmp-adaptiveform-checkboxgroup__option-label
    ELEMENT cmp-adaptiveform-checkboxgroup__questionmark
    ELEMENT cmp-adaptiveform-checkboxgroup__shortdescription
    ELEMENT cmp-adaptiveform-checkboxgroup__longdescription
    ELEMENT cmp-adaptiveform-checkboxgroup__errormessage
```

### Note
By placing the class names `cmp-adaptiveform-checkboxgroup__label` and `cmp-adaptiveform-checkboxgroup__questionmark` within the `cmp-adaptiveform-checkboxgroup__label-container` class, you create a logical grouping of the label and question mark elements. This approach simplifies the process of maintaining a consistent styling for both elements.

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the checkbox-group component in the form view:  
 1. `data-cmp-is="adaptiveFormCheckBoxGroup"`
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

* Drop Down
* Radio Button
 
## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready



