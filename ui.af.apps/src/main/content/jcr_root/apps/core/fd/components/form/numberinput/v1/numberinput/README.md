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
Adaptive Form Number Input (v1)
====
Adaptive Form Number input field component written in HTL.

## Features

* Provides the following type of input:
  * html5 number input
* Custom constraint messages for the above types
* Styles
* Allows replacing this component with other component (as mentioned below).

### Use Object
The Form Text component uses the `com.adobe.cq.forms.core.components.models.form.NumberInput` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Form Text component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for this field
2. `./hideTitle` - if set to `true`, the label of this field will be hidden
3. `./name` - defines the name of the field, which will be submitted with the form data
4. `./default` - defines the default value of the field
5. `./description` - defines a help message that can be rendered in the field as a hint for the user
6. `./required` - if set to `true`, this field will be marked as required, not allowing the form to be submitted until the field has a value
7. `./requiredMessage` - defines the message displayed as tooltip when submitting the form if the value is left empty
8. `./readOnly` - if set to `true`, the field will be read only
9. `./minimum` - the minimum value that can be entered in this input
10. `./maximum` - the maximum value that can be entered in this input
11. `./minimumMessage` - the message showed to the user if the entered value is less than the minimum value
12. `./maximumMessage` - the message showed to the user if the entered value is more than the maximum value
13. `./leadDigits` - the max no of digits before decimal that can be entered if the type of field is Decimal.
14. `./fracDigits` - the max no of digits after decimal that can be entered if the type of field is Decimal.
15. `./displayFormat` - define the template for display pattern (Reference can be found [here](https://unicode.org/reports/tr35/tr35-numbers.html#Number_Format_Patterns)).

## Client Libraries
The component provides a `core.forms.components.numberinput.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property. 
The `core.forms.components.numberinput.v1.runtime` client library also include a widget which helps in implementation of `displayFormat` and `editFormat`.

It also provides a `core.forms.components.numberinput.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## Number Input Formatting

The formatting for number inputs, including decimal and thousand separators, is determined by the selected language. For example, with the `es-CO` locale:

- **Decimal separator:** `,`
- **Thousands separator:** `.`

### Supported Currency Symbols

Currency symbols are supported out-of-the-box (OOTB) for the following languages:

- `da-DK` (Danish)
- `de-DE` (German)
- `en-US` (English - United States)
- `en-GB` (English - United Kingdom)
- `es-ES` (Spanish - Spain)
- `fi-FI` (Finnish)
- `fr-FR` (French)
- `it-IT` (Italian)
- `ja-JP` (Japanese)
- `nb-NO` (Norwegian Bokmål)
- `nl-NL` (Dutch)
- `pt-BR` (Portuguese - Brazil)
- `sv-SE` (Swedish)
- `zh-CN` (Chinese - Simplified)
- `zh-TW` (Chinese - Traditional)
- `ko-KR` (Korean)
- `cs-CZ` (Czech)
- `pl-PL` (Polish)
- `ru-RU` (Russian)
- `tr-TR` (Turkish)

### Custom Currency Symbols

For languages not listed above, such as `es-CO` (Spanish - Colombia), the currency symbol must be explicitly defined using the ISO 4217 currency code. The format is `¤/COP#,#00.0#`.

## BEM Description
```
BLOCK cmp-adaptiveform-numberinput
    ELEMENT cmp-adaptiveform-numberinput__label
    ELEMENT cmp-adaptiveform-numberinput__label-container
    ELEMENT cmp-adaptiveform-numberinput__widget
    ELEMENT cmp-adaptiveform-numberinput__questionmark
    ELEMENT cmp-adaptiveform-numberinput__shortdescription
    ELEMENT cmp-adaptiveform-numberinput__longdescription
    ELEMENT cmp-adaptiveform-numberinput__errormessage
```

### Note
By placing the class names `cmp-adaptiveform-numberinput__label` and `cmp-adaptiveform-numberinput__questionmark` within the `cmp-adaptiveform-numberinput__label-container` class, you create a logical grouping of the label and question mark elements. This approach simplifies the process of maintaining a consistent styling for both elements.

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the number-input component in the form view:
1. `data-cmp-is="adaptiveFormButton"`
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
* Date Picker
* Email Input
* Reset Button
* Submit Button
* Telephone Input
* Text Box
* Text Input


## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready