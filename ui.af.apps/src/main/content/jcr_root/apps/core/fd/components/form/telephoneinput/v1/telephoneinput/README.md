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
Adaptive Form Telephone Input (v1)
====
Adaptive Form Telephone input field component written in HTL.

## Features

* Provides the following type of input:
  * telephone
* Custom constraint messages for the above types
* Styles

### Use Object
The Form Telephone component uses the `com.adobe.cq.forms.core.components.models.form.TextInput` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Form Telephone component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for this field
2. `./hideTitle` - if set to `true`, the label of this field will be hidden
3. `./name` - defines the name of the field, which will be submitted with the form data
4. `./default` - defines the default value of the field
5. `./description` - defines a help message that can be rendered in the field as a hint for the user
6. `./required` - if set to `true`, this field will be marked as required, not allowing the form to be submitted until the field has a value
7. `./requiredMessage` - defines the message displayed as tooltip when submitting the form if the value is left empty
8. `./readOnly` - if set to `true`, the filed will be read only

## Client Libraries
The component provides a `core.forms.components.textinput.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.textinput.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveform-telephoneinput
    ELEMENT cmp-adaptiveform-telephoneinput__label
    ELEMENT cmp-adaptiveform-telephoneinput__widget
    ELEMENT cmp-adaptiveform-telephoneinput__questionmark
    ELEMENT cmp-adaptiveform-telephoneinput__shortdescription
    ELEMENT cmp-adaptiveform-telephoneinput__longdescription
    ELEMENT cmp-adaptiveform-telephoneinput__errormessage
```