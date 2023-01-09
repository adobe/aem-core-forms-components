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
Adaptive Form Panel Container (v1)
====
Adaptive Form Panel Container component written in HTL.

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
1. `./jcr:title` - defines the label to use for this panel
2. `./name` - defines the name of the panel, which will be submitted with the form data
3. `./layout` - defines the layout type, either `simple` (default) or `responsiveGrid`; if no value is defined, the component will fallback to the value defined by the component's policy
4. `./bindref` - defines the data binding, and how data will be sent
5. `./visible` - defines initial state of panel visibility
6. `./enabled` - defines initial state of panel if its enabled or not
7. `./tooltip` - defines tooltip on panel title
8. `./description` - defines a help message that can be rendered in the field as a hint for the user

#### Style Properties
1. `./backgroundImageReference` - defines the Panel Container background image.
2. `./backgroundColor` - defines the Panel Container background color.
3. `./cq:styleIds` - defines the selector (as provided in design dialog)

#### Accessibility
1. `./assistPriority` - defines where to pick accessibility information for the Panel Container. This can be one of 'Description', 'Title', 'Name', 'Custom' or 'None'
2. `./custom` - defines custom accessibility information for the Panel Container, if assistPriority is custom.
3. `./roleAttribute` - defines a role attribute for the Panel Container.

## Client Libraries
The component provides a `core.forms.components.panelcontainer.v1.runtime` client library category that contains a JavaScript
component. It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.panelcontainer.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-container
  ELEMENT cmp-container__label
  ELEMENT cmp-container__questionmark
  ELEMENT cmp-container__shortdescription
  ELEMENT cmp-container__longdescription
```
## JavaScript Data Attribute Bindings
The following attributes must be added for the initialization of the panel-container component in the form view:  
 1. `data-cmp-is="adaptiveFormPanel"`
 2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`

### Enabling Panel Container Editing Functionality
The following property is required in the proxy component to enable full editing functionality for the Panel Container:

1. `./cq:isContainer` - set to `{Boolean}true`, marks the Panel Container as a container component

## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: Cloud
* **Status**: production-ready

