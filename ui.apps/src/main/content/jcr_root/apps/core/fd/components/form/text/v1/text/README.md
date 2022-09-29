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
Adaptive Form Text (v1)
====
Text component written in HTL that provides a section of rich text.

## Features

* In-place editing
* Rich text editor
* Styles

### Use Object
The Title component uses the `com.adobe.cq.forms.core.components.models.form` Sling model as its Use-object. The current implementation reads
the following resource properties:

1. `./name` - defines the name of the field, which will be submitted with the form data
2. `./value` - the actual text to be rendered is stored here
3. `./textIsRich` - flag determining if the rendered text is rich or not, useful for applying the correct HTL display context
4. `./id` - defines the component HTML ID attribute
5. `./dataRef` - data model reference specified
6. `./fieldType` - field type for adaptive form component

## BEM Description
```
BLOCK cmp-adaptiveform-text
    ELEMENT cmp-adaptiveform-text__widget
```

## Client Libraries
The component provides a `core.forms.components.text.v1.runtime` client library category that contains a JavaScript
component. It should be added to a relevant site client library using the `embed` property.

## JavaScript Data Attribute Bindings
The following attributes must be added for the initialization of the text component in the form view:  
 1. `data-cmp-is="adaptiveFormText"`
 2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`

 
## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready
