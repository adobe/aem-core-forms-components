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
Adaptive Form Terms and Conditions (v1)
====
Adaptive Form Terms and Components field component written in HTL.

## Features

* It is composed of Text Field, CheckBox and CheckBox Groups
* Allows to author a Terms & Conditions component with either links or Texts.
* Comes with some OOTB behaviour like
  * Approval Checkbox is not enabled if the text-area is scrollable and user has not scrolled to the bottom
  * Approval Checkbox is not enabled if TnC uses Links and user has not visited all the links

### Use Object
The Form Text component uses the `com.adobe.cq.forms.core.components.models.form.TermsAndConditions` Sling Model for its Use-object.

### Edit Dialog Properties
The following properties are written to JCR for this Form Terms and Conditions component and are expected to be available as `Resource` properties.

See [`docs/authoring-schema/components/termsandconditions.authoring.schema.yaml`](../../../../../../../../../../docs/authoring-schema/components/termsandconditions.authoring.schema.yaml) for the full machine-readable schema.

#### Base properties (inherited)

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Field label | `./jcr:title` | String | — | Visible label rendered next to the panel |
| Hide label | `./hideTitle` | Boolean | `false` | When true the label is hidden but available to screen readers |
| Panel name | `./name` | String | — | Data key submitted with form data |
| Data binding | `./dataRef` | String | — | JSON-path binding; set to `null` to opt out |
| Visible | `./visible` | Boolean | — | Whether the panel is visible on initial render |
| Enabled | `./enabled` | Boolean | — | Whether the panel is enabled |
| Description | `./description` | String | — | Help text rendered as short/long description |
| Required | `./required` | Boolean | `false` | Marks the field as mandatory |
| Required message | `./mandatoryMessage` | String | — | Error shown when required field is empty |
| Read only | `./readOnly` | Boolean | `false` | Renders the panel as read-only |

#### Terms and Conditions-specific properties

| Property | JCR Name | Type | Default | Description |
|----------|----------|------|---------|-------------|
| Show approval option | `./showApprovalOption` | Boolean | `true` | When true an approval/consent checkbox is rendered so the user can explicitly accept the terms. Injected via `ReservedProperties.PN_SHOW_APPROVAL_OPTION`. Not exported to JSON model (`@JsonIgnore`). |
| Show links | `./showLink` | Boolean | `false` | When true the component renders checkboxGroup children (links) rather than plain-text content. Controls which child resources are included via `getFilteredChildrenResources()`. Injected via `ReservedProperties.PN_SHOW_LINK`. Not exported to JSON model (`@JsonIgnore`). |
| Show as popup | `./showAsPopup` | Boolean | `false` | When true the terms content is displayed in a modal dialog overlay rather than inline. Injected via `ReservedProperties.PN_SHOW_AS_POPUP`. Not exported to JSON model (`@JsonIgnore`). |

#### Child nodes

| Node | Description |
|------|-------------|
| `fd:rules` | Rule expressions and visual rule editor AST blobs |
| `fd:events` | Event handler expressions (click, change, initialize, etc.) |

## Client Libraries
The component provides a `core.forms.components.termsandconditions.v1.runtime` client library category that contains the Javascript runtime for the component.
It should be added to a relevant site client library using the `embed` property.

It also provides a `core.forms.components.termsandconditions.v1.editor` editor client library category that includes
JavaScript handling for dialog interaction. It is already included by its edit dialog.

## BEM Description
```
BLOCK cmp-adaptiveform-termsandcondition
    ELEMENT cmp-adaptiveform-termsandcondition__label-container
    ELEMENT cmp-adaptiveform-termsandcondition__label
    ELEMENT cmp-adaptiveform-termsandcondition__questionmark
    ELEMENT cmp-adaptiveform-termsandcondition__content-container
      MODIFIER cmp-adaptiveform-termsandcondition__content-container--modal
    ELEMENT cmp-adaptiveform-termsandcondition__body
    ELEMENT cmp-adaptiveform-termsandcondition__header
    ELEMENT cmp-adaptiveform-termsandcondition__close-button
    ELEMENT cmp-adaptiveform-termsandcondition__content
    ELEMENT cmp-adaptiveform-termsandcondition__text
    ELEMENT cmp-adaptiveform-termsandcondition__text .cmp-adaptiveform-text
    ELEMENT cmp-adaptiveform-termsandcondition__text-intersect
    ELEMENT cmp-adaptiveform-termsandcondition__link
    ELEMENT cmp-adaptiveform-termsandcondition__link .cmp-adaptiveform-checkboxgroup 
    ELEMENT cmp-adaptiveform-termsandcondition__approvalcheckbox
    ELEMENT cmp-adaptiveform-termsandcondition__approvalcheckbox .cmp-adaptiveform-checkbox
    ELEMENT cmp-adaptiveform-termsandcondition__shortdescription
    ELEMENT cmp-adaptiveform-termsandcondition__longdescription
    ELEMENT cmp-adaptiveform-termsandcondition__errormessage
```



## JavaScript Data Attribute Bindings

The following attributes must be added for the initialization of the text-input component in the form view:
1. `data-cmp-is="adaptiveFormTermsAndConditions"`
2. `data-cmp-adaptiveformcontainer-path="${formstructparser.formContainerPath}"`



The following are optional attributes that can be added to the component in the form view:
1. `data-cmp-valid` having a boolean value to indicate whether the field is currently valid or not
2. `data-cmp-required` having a boolean value to indicate whether the field is currently required or not
3. `data-cmp-readonly` having a boolean value to indicate whether the field is currently readonly or not
4. `data-cmp-active` having a boolean value to indicate whether the field is currently active or not 
5. `data-cmp-visible` having a boolean value to indicate whether the field is currently visible or not
6. `data-cmp-enabled` having a boolean value to indicate whether the field is currently enabled or not
