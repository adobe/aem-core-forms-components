<!--
Copyright 2023 Adobe

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
Adaptive Form CheckBox (v1)
====
Adaptive Form CheckBox component written in HTL.

## Features

* Provides the following type of input:
  * checkbox
* Custom constraint messages for the above types
* Styles

### Use Object
The Form CheckBox component uses the `com.adobe.cq.forms.core.components.models.form.CheckBox` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Form CheckBox component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for this field
2. `./hideTitle` - if set to `true`, the label of this field will be hidden
3. `./name` - defines the name of the field, which will be submitted with the form data
4. `./default` - defines the default value of the field
5. `./description` - defines a help message that can be rendered in the field as a hint for the user
6. `./required` - if set to `true`, this field will be marked as required, not allowing the form to be submitted until the field has a value
7. `./requiredMessage` - defines the message displayed as tooltip when submitting the form if the value is left empty
8. `./type` - defines the data type of the value
9. `./enum` - defines the two set of possible values for this field. (On or Off)

## Enum
Checkbox component can have only one of two state i.e. ON and OFF. Since the enums are stored as array, the enum at index '0' is assumed to be ON(i.e. checkbox is 'checked''), and enum at index '1' is OFF

## Client Libraries
The component provides a `core.forms.components.checkbox.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.checkbox.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveform-checkbox
    ELEMENT cmp-adaptiveform-checkbox__widget-container
    ELEMENT cmp-adaptiveform-checkbox__widget
    ELEMENT cmp-adaptiveform-checkbox__label
    ELEMENT cmp-adaptiveform-checkbox__help-container
    ELEMENT cmp-adaptiveform-checkbox__questionmark
    ELEMENT cmp-adaptiveform-checkbox__shortdescription
    ELEMENT cmp-adaptiveform-checkbox__longdescription
    ELEMENT cmp-adaptiveform-checkbox__errormessage
```

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the checkbox component in the form view:  
 1. `data-cmp-is="adaptiveFormCheckBox"`
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



