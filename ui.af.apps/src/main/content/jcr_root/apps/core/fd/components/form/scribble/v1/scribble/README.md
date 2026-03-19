<!--
Copyright 2025 Adobe

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
Adaptive Form Scribble (v1)
====
Adaptive Form Scribble field component written in HTL.

## Features

* Allows users to draw or sign directly on a canvas within an adaptive form
* Keyboard input for signature (text-to-sign)
* Geolocation capture (optional)
* Custom brush size and style
* Custom constraint messages
* Styles

### Use Object
The Form Scribble component uses the `com.adobe.cq.forms.core.components.models.form.Scribble` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Form Scribble component and are expected to be available as `Resource` properties.

See [`docs/authoring-schema/components/scribble.authoring.schema.yaml`](../../../../../../../../../../../../../../docs/authoring-schema/components/scribble.authoring.schema.yaml) for the full machine-readable schema.

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
| Placeholder | `./placeholder` | String | — | Placeholder text for the keyboard signature input |
| Display format | `./displayFormat` | String | — | Display format pattern |
| Edit format | `./editFormat` | String | — | Edit format pattern |
| Data format | `./dataFormat` | String | — | Submission/data format |

#### Scribble-specific

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Dialog label | `./fd:dialogLabel` | String | — | Label shown at the top of the signature capture dialog |
| Format hint | `./format` | String | — | General data format hint for scribble output (e.g. `data-url`) |

#### Child nodes

| Node | Description |
|------|-------------|
| `fd:rules` | Rule expressions and visual rule editor AST blobs |
| `fd:events` | Event handler expressions (click, change, initialize, etc.) |

### Other Properties (from template)
1. `fieldType` - set to `file-input`
2. `fd:viewType` - set to `signature`
3. `type` - set to `string`
4. `format` - set to `data-url`

## Client Libraries
The component provides a `core.forms.components.scribble.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.scribble.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveform-scribble
    ELEMENT cmp-adaptiveform-scribble__label-container
    ELEMENT cmp-adaptiveform-scribble__canvas-signed-container
        ELEMENT cmp-adaptiveform-scribble__canvas-signed-image
    ELEMENT cmp-adaptiveform-scribble__container
        ELEMENT cmp-adaptiveform-scribble__header
        ELEMENT cmp-adaptiveform-scribble__content
            ELEMENT cmp-adaptiveform-scribble__canvases
                ELEMENT cmp-adaptiveform-scribble__signcanvases
                    ELEMENT cmp-adaptiveform-scribble__canvas
                    ELEMENT cmp-adaptiveform-scribble__keyboard-sign-box
                ELEMENT cmp-adaptiveform-scribble__geocanvas
            ELEMENT cmp-adaptiveform-scribble__controlpanel
                ELEMENT cmp-adaptiveform-scribble__controls
                    ELEMENT cmp-adaptiveform-scribble__control-brush
                        MODIFIER cmp-adaptiveform-scribble__button
                    ELEMENT cmp-adaptiveform-scribble__brushlist
                    ELEMENT cmp-adaptiveform-scribble__control-clear
                        MODIFIER cmp-adaptiveform-scribble__button
                    ELEMENT cmp-adaptiveform-scribble__control-geo
                        MODIFIER cmp-adaptiveform-scribble__button
                    ELEMENT cmp-adaptiveform-scribble__control-text
                        MODIFIER cmp-adaptiveform-scribble__button
                    ELEMENT cmp-adaptiveform-scribble__control-message
                ELEMENT cmp-adaptiveform-scribble__controlpanel-controls
                    ELEMENT cmp-adaptiveform-scribble__close-button
                    ELEMENT cmp-adaptiveform-scribble__save-button
        ELEMENT cmp-adaptiveform-scribble__clearsign-container
            ELEMENT cmp-adaptiveform-scribble__clearsign-title
            ELEMENT cmp-adaptiveform-scribble__clearsign-content
                ELEMENT cmp-adaptiveform-scribble__clearsign-message
                ELEMENT cmp-adaptiveform-scribble__clearsign-panel
                    ELEMENT cmp-adaptiveform-scribble__button--secondary
                    ELEMENT cmp-adaptiveform-scribble__button--primary
```

### Note
By placing the class names `cmp-adaptiveform-scribble__label` and `cmp-adaptiveform-scribble__questionmark` within the `cmp-adaptiveform-scribble__label-container` class, you create a logical grouping of the label and question mark elements. This approach simplifies the process of maintaining a consistent styling for both elements.

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the scribble component in the form view:  
 1. `data-cmp-is="adaptiveFormScribble"`
 2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`

The following are optional attributes that can be added to the component in the form view:
1. `data-cmp-valid` having a boolean value to indicate whether the field is currently valid or not
2. `data-cmp-required` having a boolean value to indicate whether the field is currently required or not
3. `data-cmp-active` having a boolean value to indicate whether the field is currently active or not 
4. `data-cmp-visible` having a boolean value to indicate whether the field is currently visible or not
5. `data-cmp-enabled` having a boolean value to indicate whether the field is currently enabled or not

## Information
* **Vendor**: Adobe
* **Version**: v1
