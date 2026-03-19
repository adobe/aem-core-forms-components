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
Adaptive Form File Input (v1)
====
Adaptive Form File input field component written in HTL.

## Features

* Provides the following type of input:
  * file
* Custom constraint messages for the above types
* Styles

### Use Object
The Form File component uses the `com.adobe.cq.forms.core.components.models.form.FileInput` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Form File component and are expected to be available as `Resource` properties.

See [`docs/authoring-schema/components/fileinput.authoring.schema.yaml`](../../../../../../../../../../../../../../docs/authoring-schema/components/fileinput.authoring.schema.yaml) for the full machine-readable schema.

#### Base properties

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Field label | `./jcr:title` | String | — | Visible label rendered next to the field |
| Hide label | `./hideTitle` | Boolean | `false` | When true the label is hidden but available to screen readers |
| Field name | `./name` | String | — | Data key submitted with form data |
| Data binding | `./dataRef` | String | — | JSON-path binding; set to `null` to opt out |
| Visible | `./visible` | Boolean | `true` | Whether the field is visible on initial render |
| Enabled | `./enabled` | Boolean | `true` | Whether the field is enabled |
| Description | `./description` | String | — | Help text rendered as short/long description |
| Tooltip | `./tooltip` | String | — | Shown in a popover on the question-mark icon |
| Required | `./required` | Boolean | `false` | Marks the field as mandatory |
| Required message | `./mandatoryMessage` | String | — | Error shown when required field is empty |
| Validation expression | `./validationExpression` | String | — | json-formula expression returning true when valid |
| Assistive priority | `./assistPriority` | String | — | Screen-reader announcement priority |

#### Field properties

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Read only | `./readOnly` | Boolean | `false` | Prevents user input |
| Default value | `./default` | String/Number/Boolean | — | Initial value on form load |
| Empty value | `./fd:emptyValue` | String | — | Value submitted when the field is left empty |
| Min files | `./minItems` | Integer | — | Minimum number of files that must be attached |
| Max files | `./maxItems` | Integer | — | Maximum number of files allowed |
| Min files message | `./minItemsMessage` | String | — | Error shown when fewer than minimum files uploaded |
| Max files message | `./maxItemsMessage` | String | — | Error shown when more than maximum files uploaded |

#### FileInput-specific

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Allow multiple attachments | `./multiSelection` | Boolean | `false` | Allows selecting multiple files |
| Accepted MIME types | `./accept` | String[] | — | IANA media types (e.g. `application/pdf`, `image/*`) |
| Accepted extensions | `./fd:acceptExtensions` | String[] | — | Additional accepted file extensions |
| Max file size | `./maxFileSize` | String | — | Maximum file size in MB (e.g. `"5"`) |
| Max file size message | `./maxFileSizeMessage` | String | — | Error for file exceeding max size |
| Accept message | `./acceptMessage` | String | — | Error for unaccepted file type |
| Drag-drop text (v1/v2) | `./dragDropText` | String | — | Label for drag-and-drop zone |
| Drag-drop text (v3+) | `./fd:dragDropText` | String | — | Label for drag-and-drop zone (v3+) |
| Button text | `./buttonText` | String | — | Upload button label |

#### Child nodes

| Node | Description |
|------|-------------|
| `fd:rules` | Rule expressions and visual rule editor AST blobs |
| `fd:events` | Event handler expressions (click, change, initialize, etc.) |

## Client Libraries
The component provides a `core.forms.components.fileinput.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.fileinput.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveform-fileinput
    ELEMENT cmp-adaptiveform-fileinput__label
    ELEMENT cmp-adaptiveform-fileinput__label-container
    ELEMENT cmp-adaptiveform-fileinput__widget
    ELEMENT cmp-adaptiveform-fileinput__questionmark
    ELEMENT cmp-adaptiveform-fileinput__shortdescription
    ELEMENT cmp-adaptiveform-fileinput__longdescription
    ELEMENT cmp-adaptiveform-fileinput__filelist
    ELEMENT cmp-adaptiveform-fileinput__fileitem
    ELEMENT cmp-adaptiveform-fileinput__filename
    ELEMENT cmp-adaptiveform-fileinput__filedelete
    ELEMENT cmp-adaptiveform-fileinput__widgetlabel
```

### Note
By placing the class names `cmp-adaptiveform-fileinput__label` and `cmp-adaptiveform-fileinput__questionmark` within the `cmp-adaptiveform-fileinput__label-container` class, you create a logical grouping of the label and question mark elements. This approach simplifies the process of maintaining a consistent styling for both elements.

## JavaScript Data Attribute Bindings


The following attributes must be added for the initialization of the file-input component in the form view:  
 1. `data-cmp-is="adaptiveFormFileInput"`
 2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`


The following are optional attributes that can be added to the component in the form view:
1. `data-cmp-valid` having a boolean value to indicate whether the field is currently valid or not
2. `data-cmp-required` having a boolean value to indicate whether the field is currently required or not
3. `data-cmp-readonly` having a boolean value to indicate whether the field is currently readonly or not
4. `data-cmp-active` having a boolean value to indicate whether the field is currently active or not 
5. `data-cmp-visible` having a boolean value to indicate whether the field is currently visible or not
6. `data-cmp-enabled` having a boolean value to indicate whether the field is currently enabled or not
 
 
## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready

