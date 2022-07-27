<!--
Copyright 2019 Adobe

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
Panel Container (v1)
====
Panel Container component written in HTL.

## Features

* Configurable layout type.
* Configurable background image and background color:
    * Background images and colors can be enabled through policy configuration.
    * Color swatches for background color can be defined through policy configuration.
    * Background color can be restricted to only allow swatches through policy configuration.
* Configurable HTML ID attribute.
* Allowed components can be configured through policy configuration.
* Style System support.

### Use Object
The Panel Container component uses the `com.adobe.cq.wcm.core.components.models.LayoutContainer` Sling model as its Use-object.

### Component Policy Configuration Properties
The following configuration properties are used:

1. `./layout` - defines the layout type, either `simple` (default) or `responsiveGrid`
2. `./layoutDisabled` - if set to true, it is not allowed to change the layout in the edit dialog
3. `./backgroundImageEnabled` - defines whether to display a background image option.
4. `./backgroundColorEnabled` - defines whether to display a background color option.
5. `./backgroundColorSwatchesOnly` -  defines whether or not to display swatches in the background color picker.
6. `./allowedColorSwatches` - defines a list of background color swatches that are allowed to be selected by an author.

It is also possible to define the allowed components for the Panel Container.

### Edit Dialog Properties
The following properties are written to JCR for this Panel Container component and are expected to be available as `Resource` properties:

#### Panel Container Properties
1. `./layout` - defines the layout type, either `simple` (default) or `responsiveGrid`; if no value is defined, the component will fallback to the value defined by the component's policy

#### Common Properties
1. `./backgroundImageReference` - defines the Panel Container background image.
2. `./backgroundColor` - defines the Panel Container background color.
3. `./id` - defines the component HTML ID attribute.

#### Accessibility
1. `./accessibilityLabel` - defines an accessibility label for the Panel Container.
2. `./roleAttribute` - defines a role attribute for the Panel Container.

## BEM Description
```
BLOCK cmp-adaptiveform-panel
  BLOCK cmp-adaptiveform-panel-content
```

### Enabling Panel Container Editing Functionality
The following property is required in the proxy component to enable full editing functionality for the Panel Container:

1. `./cq:isContainer` - set to `{Boolean}true`, marks the Panel Container as a container component

## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready

