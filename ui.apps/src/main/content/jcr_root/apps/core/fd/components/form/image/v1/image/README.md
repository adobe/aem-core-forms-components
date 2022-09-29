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
Adaptive Form Image (v1)
====
Image component written in HTL that renders an adaptive image.

## Features
* Native lazy loading enabled by default
* Native loading of optimal rendition
* Image title, description, accessibility text and link
* SVG support
* Styles
* Dynamic Media images support, including Image Presets and Smart Crop

### Use Object
The Image component uses the `com.adobe.cq.forms.core.components.models.form.StaticImage` Sling Model as its Use-object.

### Component Policy Configuration Properties
The following configuration properties are used:

1.`./fileReference` property or `file` child node - will store either a reference to the image file, or the image file
2`./name` - defines the name of the field, which will be submitted with the form data
3`./description` - the actual text to be rendered is stored here
4`./altText` - alternate text for image
5`./fieldType` - field type for adaptive form component
6`./imageSrc` - Image Src

## BEM Description
```
BLOCK cmp-image
    ELEMENT cmp-image__image
```

## Client Libraries
The component provides a `core.forms.components.image.v1.runtime` client library category that contains the Javascript runtime for the component. 
It should be added to a relevant site client library using the `embed` property.

## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the image component in the form view:  
 1. `data-cmp-is="adaptiveFormImage"`
 2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`
 
## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready