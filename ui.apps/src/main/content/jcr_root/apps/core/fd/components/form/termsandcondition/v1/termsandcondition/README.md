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
Adaptive Form Terms And Conditions (v1)
====
Adaptive Form Terms And Conditions component written in HTL.

## Features

* Automatic reading of the terms and conditions and checkbox text from the edit dialog
* Styles

### Use Object
The Terms And Conditions component uses the `com.adobe.cq.forms.core.components.models.form.TermsAndConditions` Sling model as its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Form Terms And Conditions component and are expected to be available as `Resource` properties:

1. `./jcr:title` - defines the label to use for terms and conditions
2. `./hideTitle` - if set to `true`, the label of terms and conditions will be hidden
3. `./name` - defines the name of the field, which will be submitted with the form data
4. `./showAsLink` - if set to `true`, link field will be enabled else text field will be enabled 

## Client Libraries
The component provides a `core.forms.components.termsandcondition.v1` client library category that contains a JavaScript component. It should be added to a relevant site client library using the `embed` property.


## BEM Description
```
BLOCK cmp-adaptiveform-termsandcondition
    ELEMENT cmp-adaptiveform-termsandcondition__label
    ELEMENT cmp-adaptiveform-termsandcondition__text
    ELEMENT cmp-adaptiveform-termsandcondition__link
    ELEMENT cmp-adaptiveform-termsandcondition__checkbox
```

## JavaScript Data Attribute Bindings

Apply a `data-cmp-is="adaptiveFormTermsAndConditon"` attribute to the wrapper block to enable initialization of the JavaScript component.

## Information
* **Vendor**: Adobe
* **Version**: v1