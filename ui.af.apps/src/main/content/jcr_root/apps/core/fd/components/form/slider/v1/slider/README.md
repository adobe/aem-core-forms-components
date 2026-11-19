<!--
Copyright 2026 Adobe

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
Adaptive Form Slider (v1)
====
Adaptive Form Slider field component written in HTL. Lets users pick a numeric value within a range.

## Features

* Native HTML5 `<input type="range">`, operable by mouse, touch and keyboard
* Displays the current value and updates it live while dragging
* Configurable minimum, maximum, step and default value
* Exports `fieldType: "range"` and `type: "number"`, so the value works in rules and calculations
* Custom constraint messages (minimum, maximum, step)
* Styles

### Use Object
The Form Slider component uses the `com.adobe.cq.forms.core.components.models.form.Slider` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for this field
2. `./hideTitle` - if set to `true`, the label of this field will be hidden
3. `./name` - defines the name of the field, which will be submitted with the form data
4. `./default` - defines the initial value of the field
5. `./minimum` - lowest value; must be less than `./maximum`
6. `./maximum` - highest value
7. `./step` - granularity of the slider; must be greater than 0. Values are counted from `./minimum`
8. `./description` - defines a help message that can be rendered in the field as a hint for the user
9. `./required` - if set to `true`, the field is marked as required
10. `./minimumMessage`, `./maximumMessage`, `./stepMessage` - constraint violation messages
11. `./fieldType` - always `range`
12. `./type` - always `number`

### BEM Description
```
BLOCK cmp-adaptiveform-slider
    ELEMENT cmp-adaptiveform-slider__label-container
    ELEMENT cmp-adaptiveform-slider__label
    ELEMENT cmp-adaptiveform-slider__questionmark
    ELEMENT cmp-adaptiveform-slider__widget-container
    ELEMENT cmp-adaptiveform-slider__widget
    ELEMENT cmp-adaptiveform-slider__value
    ELEMENT cmp-adaptiveform-slider__shortdescription
    ELEMENT cmp-adaptiveform-slider__longdescription
    ELEMENT cmp-adaptiveform-slider__errormessage
```
