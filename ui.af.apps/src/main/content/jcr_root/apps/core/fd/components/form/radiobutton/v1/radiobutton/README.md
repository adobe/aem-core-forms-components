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
RadioButton (v1)
====
Adaptive form Radio Button component written in HTL.

## Features

* Provides the following type of input in form of radio button:
    * string
    * boolean
    * number
* Alignment of Options (`horizontal` or `vertical`)
* Styles

### Use Object
The Form Radio Button component uses the `com.adobe.cq.forms.core.components.models.form.RadioButton` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Radio Button component and are expected to be available as `Resource` properties:

1. `./name` - defines the name of the field, which will be submitted with the form data
2. `./jcr:title` - defines the label to use for this field
3. `./hideTitle` - if set to `true`, the label of this field will be hidden
4. `./type` - defines the type of values(string, boolean, number) which can be accepted
5. `./enum` - an array[] of type, defines the available values for selection
6. `./enumNames` - an array[] of strings, defines the display value of the enum
7. `./default` - defines the default option of the field
8. `./alignment` - defines how should the options be displayed, horizontally or vertically.
9. `./description` - defines a help message that can be rendered in the field as a hint for the user
10. `./required` - if set to `true`, this field will be marked as required, not allowing the form to be submitted until the field has a value
11. `./requiredMessage` - defines the message displayed as tooltip when submitting the form if the value is left empty
12. `./readOnly` - if set to `true`, the filed will be read only
13. `./fieldType` - defines the type of the component


## Client Libraries
The component provides a `core.forms.components.radiobutton.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.radiobutton.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveform-radiobutton
    ELEMENT cmp-adaptiveform-radiobutton__label
    ELEMENT cmp-adaptiveform-radiobutton__option
        ELEMENT cmp-adaptiveform-radiobutton__option__label
        ELEMENT cmp-adaptiveform-radiobutton__option__widget
    ELEMENT cmp-adaptiveform-radiobutton__questionmark
    ELEMENT cmp-adaptiveform-radiobutton__shortdescription
    ELEMENT cmp-adaptiveform-radiobutton__longdescription
    ELEMENT cmp-adaptiveform-radiobutton__errormessage
```

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the radio-button component in the form view:
1. `data-cmp-is="adaptiveFormRadioButton"`
2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`


## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready