<!--/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  ~ Copyright 2022 Adobe
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/-->
Title (v2)
====
Title component written in HTL, allowing to define a section heading.
When this component is dropped in the editor, it's text value is initialized from the title of the form.

## Features

* In-place editing
* Automatic reading of the page title from the current page, if no title text is defined
* HTML element configuration (`h1` - `h6`)
* Styles
* Allows replacing this component with other component (as mentioned below).

### Use Object
The Title component uses the `com.adobe.cq.forms.core.components.models.form.FormTitle` Sling model as its Use-object.

### Component Policy Configuration Properties
The following configuration properties are used:

1. `./type` - defines the default HTML heading element type (`h1` - `h6`) this component will use for its rendering

### Edit Dialog Properties
The following properties are written to JCR for this Title component and are expected to be available as `Resource` properties:

1. `./jcr:title` - will store the text of the title to be rendered
2. `./fd:htmlelementType` - will store the HTML heading element type which will be used for rendering; if no value is defined, the component will fallback
to the value defined by the component's policy
3. `./id` - defines the component HTML ID attribute.

## Client Libraries
The component leverages `core.wcm.components.title.v2.editor` editor client library category that includes JavaScript
handling for dialog interaction. It is already included by its edit and design dialogs.

## Replace feature:
We support replace feature that allows replacing Title component to any of the below components:

* Button
* Reset Button
* Submit Button
* Image
* Text Box

## BEM Description
```
BLOCK cmp-title
    ELEMENT cmp-title__text
```