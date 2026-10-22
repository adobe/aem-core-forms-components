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
Adaptive Form Switch (v1)
====
Adaptive Form Switch component written in HTL.

## Features

* Provides the following type of input:
  * switch
* Custom constraint messages for the above types
* Styles

### Use Object
The Form switch component uses the `com.adobe.cq.forms.core.components.models.form.Switch` extends `com.adobe.cq.forms.core.components.models.form.CheckBox` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Form Switch component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for this field
2. `./hideTitle` - if set to `true`, the label of this field will be hidden
3. `./name` - defines the name of the field, which will be submitted with the form data
4. `./description` - defines a help message that can be rendered in the field as a hint for the user
5. `./readOnly` - if set to `true`, the filed will be read only
6. `./type` - defines the data type of the value
7. `./enum` - defines the two set of possible values for this field. (On or Off)

## Enum
Switch component can have only one of two state i.e. ON and OFF. Since the enums are stored as array, the enum at index '0' is assumed to be OFF(i.e. switch is 'off'), and enum at index '1' is ON (i.e. switch is 'on'')

## Client Libraries
The component provides a `core.forms.components.switch.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.switch.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveform-switch
    ELEMENT cmp-adaptiveform-switch__label-container
    ELEMENT cmp-adaptiveform-switch__label
    ELEMENT cmp-adaptiveform-switch__container
    ELEMENT cmp-adaptiveform-switch__option
    ELEMENT cmp-adaptiveform-switch__option--off
    ELEMENT cmp-adaptiveform-switch__option--on
    ELEMENT cmp-adaptiveform-switch__widget
    ELEMENT cmp-adaptiveform-switch__widget-label
    ELEMENT cmp-adaptiveform-switch__widget-slider
    ELEMENT cmp-adaptiveform-switch__circle-indicator
    ELEMENT cmp-adaptiveform-switch__hide-labels
    ELEMENT cmp-adaptiveform-switch__unhide-labels
    ELEMENT cmp-adaptiveform-switch__questionmark
    ELEMENT cmp-adaptiveform-switch__shortdescription
    ELEMENT cmp-adaptiveform-switch__longdescription
    ELEMENT cmp-adaptiveform-switch__errormessage
```

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the switch component in the form view:  
 1. `data-cmp-is="adaptiveFormSwitch"`
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



