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
Adaptive Form Button (v1)
====
Adaptive Form Button component written in HTL.

## Features

* Provides the following type of button:
  * button
  * submit
  * reset
* Accessibility friendly 
* Custom description/tooltip for help

### Use Object
The button component uses the `com.adobe.cq.forms.core.components.models.form.Button` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this button component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for this field
2. `./hideTitle` - if set to `true`, the label of this field will be hidden
3. `./name` - defines the name of the field, which will be submitted with the form data
4. `./default` - defines the default value of the field
5. `./description` - defines a help message that can be rendered in the field as a hint for the user

## Client Libraries
The component provides a `core.forms.components.button.v1` client library category that contains a JavaScript
component. It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.button.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-button
    ELEMENT cmp-button__text
    ELEMENT cmp-button__questionmark
    ELEMENT cmp-button__shortdescription
    ELEMENT cmp-button__longdescription
```

## JavaScript Data Attribute Bindings

Apply a `data-cmp-is="adaptiveFormButton"` attribute to the button to enable initialization of the JavaScript component.


